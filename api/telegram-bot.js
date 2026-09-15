'use strict';
// Telegram catalog bot — lets a client filter the model roster (city,
// categories, rate) and submit a booking enquiry without leaving Telegram,
// reading the same data/models.js the site itself builds from.
//
// Flow: /start -> city (incl. cities that only have VIP presence) ->
// categories (multi-select toggle) -> rate (multi-select toggle) -> results
// (public models matching the filters, a 3-photo album per companion
// followed by stats + price + Book/More info buttons). If any VIP
// companion also matches the same filters, a "Want VIP models too?" button
// appears below the public results; tapping it either shows the matching
// VIP companions (if this chat has already paid) or offers a payment
// method (crypto is a placeholder for now; bank transfer gives the client
// the manager's contact and forwards a heads-up to the manager chat) —
// there's no automated checkout yet, so a manager takes payment out of
// band and taps "Confirm payment received" on the forwarded request to
// unlock that chat (see the grantvip: callback in handleUpdate).
//
// VIP model data is read directly from data/models.js here (this is
// server-side code, same trust level as api/vip-catalog.js) but is only
// ever sent to a chat after isTelegramVipPaid() confirms that chat has
// paid — the same "never leaves the server until paid" rule the website
// enforces, just checked against bot_vip_access instead of vip_access.
const {MODELS, CATEGORIES} = require('../data/models.js');
const {getBotSession, setBotSession, isTelegramVipPaid, upsertTelegramVipAccess} = require('./_lib/supabaseAdmin');
const {sendMessage, editMessageText, sendPhoto, sendMediaGroup, answerCallbackQuery} = require('./_lib/telegramBot');

const SITE_URL = process.env.SITE_URL || 'https://velvetescort.co.uk';
const RESULTS_PER_PAGE = 5;
const VIP_PRICE_GBP = 300;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// Non-overlapping on purpose — a model priced at exactly £500 or £1000
// used to match two buckets at once.
const PRICE_BUCKETS = [
  {key: 'u', label: 'Under £500', test: p => p != null && p < 500},
  {key: 'm', label: '£500–£999', test: p => p != null && p >= 500 && p < 1000},
  {key: 'p', label: '£1000+', test: p => p != null && p >= 1000},
];

function publicModels() {
  return MODELS.filter(m => m.real && !m.vip);
}
function vipModels() {
  return MODELS.filter(m => m.real && m.vip);
}
function modelBySlug(slug) {
  return MODELS.find(m => m.real && m.slug === slug);
}

// Mirrors startPrice() in assets/main.js (same "Extra Hour" exclusion fix
// from PR #156) — kept as a small local copy rather than a shared import
// since assets/main.js is browser-global code, not a CommonJS module.
function startPrice(m) {
  const rates = (m.incallRates && m.incallRates.length) ? m.incallRates : (m.outcallRates || []);
  const bookable = rates.filter(r => r.label !== 'Extra Hour');
  return bookable.length ? Math.min(...bookable.map(r => r.price)) : null;
}

function citySlug(c) {
  return c.toLowerCase().replace(/\s+/g, '-');
}

// Escapes the handful of characters that matter to Telegram's HTML
// parse_mode (used on every sendMessage/editMessageText call) so free-text
// a client types — a booking contact, a date — can't break the message.
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Union of every city with a public model and every city with a VIP model —
// a client can pick a VIP-only city and still reach the "want VIP?" offer
// even though no public result will ever show for it.
function cityKeyboard() {
  // Combined public + VIP count — a city with 1 public and 1 VIP companion
  // showing "(1)" understated how many companions are actually there.
  const counts = new Map();
  MODELS.filter(m => m.real).forEach(m => counts.set(m.city, (counts.get(m.city) || 0) + 1));
  const rows = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b)).map(city => {
    return [{text: `(${counts.get(city)}) ${city}`, callback_data: `city:${citySlug(city)}`}];
  });
  return {inline_keyboard: rows};
}

function cityNameFromSlug(slug) {
  const m = MODELS.find(x => x.real && citySlug(x.city) === slug);
  return m ? m.city : slug;
}

function catStepText(data) {
  const chosen = (data.cats || []).map(i => CATEGORIES[i]);
  return [
    `<b>City:</b> ${cityNameFromSlug(data.city)}`,
    '',
    'Choose one or more categories (tap to select), then Continue — or tap Continue with none selected to skip, since city and rate will narrow it down anyway:',
    chosen.length ? `\n<i>Selected: ${chosen.join(', ')}</i>` : ''
  ].filter(Boolean).join('\n');
}

// Each button shows how many public companions would still match if that
// category were (also) applied on top of the current city/cats/prices —
// lets a client see a combination is a dead end before tapping it, instead
// of finding out only after "Continue" (a real risk once a city only has
// one or two companions and 16 categories to pick from).
function catKeyboard(data) {
  const sel = new Set(data.cats || []);
  const pool = publicModels();
  const rows = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    const row = [i, i + 1].filter(j => j < CATEGORIES.length).map(j => {
      const testCats = Array.from(new Set([...sel, j]));
      const count = pool.filter(m => matchesFilters(m, Object.assign({}, data, {cats: testCats}))).length;
      return {
        text: `${sel.has(j) ? '✅ ' : ''}(${count}) ${CATEGORIES[j]}`,
        callback_data: `cat:${j}`
      };
    });
    rows.push(row);
  }
  const vipCount = vipModels().filter(m => matchesFilters(m, data)).length;
  rows.push([{text: `(${vipCount}) ⭐ VIP Models`, callback_data: 'cats:vip'}]);
  rows.push([{text: '◀️ Back', callback_data: 'nav:city'}, {text: '▶️ Continue', callback_data: 'cats:done'}]);
  return {inline_keyboard: rows};
}

function priceStepText(data) {
  const chosen = (data.prices || []).map(k => PRICE_BUCKETS.find(b => b.key === k)).filter(Boolean).map(b => b.label);
  return [
    `<b>City:</b> ${cityNameFromSlug(data.city)}`,
    '',
    'Choose one or more rate ranges (tap to select), then Continue — or tap Continue with none selected to skip:',
    chosen.length ? `\n<i>Selected: ${chosen.join(', ')}</i>` : ''
  ].filter(Boolean).join('\n');
}

// Same idea as catKeyboard() above: each bucket shows the count if it were
// (also) applied on top of city/cats/whatever prices are already selected.
// "Show all" bypasses price entirely (many companions have no listed rate,
// so a single-companion city can otherwise look empty at every bucket) —
// VIP isn't offered here at all; that only ever comes up after public
// results, and only when a VIP companion actually matches (see
// sendResultsBatch/handleVipShow), so a client is never sent to an empty
// VIP screen from this step.
function priceKeyboard(data) {
  const sel = new Set(data.prices || []);
  const pool = publicModels();
  const rows = PRICE_BUCKETS.map(b => {
    const testPrices = Array.from(new Set([...sel, b.key]));
    const count = pool.filter(m => matchesFilters(m, Object.assign({}, data, {prices: testPrices}))).length;
    return [{text: `${sel.has(b.key) ? '✅ ' : ''}(${count}) ${b.label}`, callback_data: `price:${b.key}`}];
  });
  const allCount = pool.filter(m => matchesFilters(m, Object.assign({}, data, {prices: []}))).length;
  rows.push([{text: `(${allCount}) 🔎 Show all`, callback_data: 'price:all'}]);
  rows.push([{text: '◀️ Back', callback_data: 'nav:cats'}, {text: '▶️ Continue', callback_data: 'price:done'}]);
  return {inline_keyboard: rows};
}

// A model matches if her price falls in ANY selected bucket (unlike
// categories, which require ALL selected ones) — a model has exactly one
// price, so "under £500 or £1000+" only makes sense as an OR.
function matchesFilters(m, data) {
  if (citySlug(m.city) !== data.city) return false;
  const cats = (data.cats || []).map(i => CATEGORIES[i]);
  if (cats.length && !cats.every(c => m.cats && m.cats.includes(c))) return false;
  const priceKeys = data.prices || [];
  if (priceKeys.length) {
    const buckets = priceKeys.map(k => PRICE_BUCKETS.find(b => b.key === k)).filter(Boolean);
    if (!buckets.some(b => b.test(startPrice(m)))) return false;
  }
  return true;
}

function resultCaption(m) {
  const price = startPrice(m);
  const lines = [
    `<b>${m.name}</b>`,
    [m.age ? `${m.age} yrs` : null, m.nationality, m.station || m.city].filter(Boolean).join(' · '),
    price !== null ? `💰 from £${price}` : '💰 Rates on request'
  ];
  if (m.svcs && m.svcs.length) lines.push(m.svcs.slice(0, 6).join(', ') + (m.svcs.length > 6 ? '…' : ''));
  return lines.join('\n');
}

function resultKeyboard(m) {
  const moreUrl = m.vip ? `${SITE_URL}/vip-models/` : `${SITE_URL}/models/${m.slug}/`;
  return {inline_keyboard: [
    [{text: '📅 Book', callback_data: `bk:${m.slug}`}, {text: '🔗 More info', url: moreUrl}],
    [{text: '💬 Contact Manager', callback_data: `cm:${m.slug}`}]
  ]};
}

const RESULT_PHOTO_COUNT = 3;

async function sendResultsBatch(chatId, data, pool, offset, kind) {
  const matches = pool.filter(m => matchesFilters(m, data));
  const page = matches.slice(offset, offset + RESULTS_PER_PAGE);
  for (const m of page) {
    const photoUrls = Array.from({length: RESULT_PHOTO_COUNT}, (_, i) => `${SITE_URL}/${m.folder}/${i + 1}.webp`);
    // Become-a-model requires at least 3 photos per profile, but fall back
    // to her single main photo if the album send fails for any reason
    // (e.g. an older profile with fewer than 3) rather than showing nothing.
    try {
      await sendMediaGroup(chatId, photoUrls);
    } catch (e) {
      console.error('telegram-bot: sendMediaGroup failed, falling back to single photo:', e.message);
      await sendPhoto(chatId, photoUrls[0]);
    }
    await sendMessage(chatId, resultCaption(m), {reply_markup: resultKeyboard(m)});
  }
  const nextOffset = offset + RESULTS_PER_PAGE;
  const hasMore = nextOffset < matches.length;
  const isLastBatchOfPublicResults = kind === 'pub' && !hasMore;

  const tailButtons = [];
  if (hasMore) tailButtons.push([{text: `Show ${Math.min(RESULTS_PER_PAGE, matches.length - nextOffset)} more`, callback_data: `${kind}:${nextOffset}`}]);

  if (isLastBatchOfPublicResults) {
    const vipMatches = vipModels().filter(m => matchesFilters(m, data));
    if (vipMatches.length) {
      tailButtons.push([{text: `🔓 ${vipMatches.length} VIP companion${vipMatches.length === 1 ? '' : 's'} also match — I want VIP`, callback_data: 'vip:show'}]);
    }
  }
  // VIP results reached straight from categories (the "(N) ⭐ VIP Models"
  // button, which skips the rate step entirely) should back out to
  // categories, not price — everywhere else "back" means the rate step.
  const backTarget = (kind === 'vip' && data.cameFromCats) ? 'nav:cats' : 'nav:price';
  tailButtons.push([{text: '◀️ Back to filters', callback_data: backTarget}, {text: '🔁 New search', callback_data: 'restart'}]);

  if (!matches.length && offset === 0) {
    const noun = kind === 'vip' ? 'VIP companions' : 'companions';
    await sendMessage(chatId, `No ${noun} match those filters.`, {reply_markup: {inline_keyboard: tailButtons}});
    return;
  }
  await sendMessage(chatId, offset === 0 ? `Showing ${Math.min(RESULTS_PER_PAGE, matches.length)} of ${matches.length} match${matches.length === 1 ? '' : 'es'}:` : 'More matches:', {reply_markup: {inline_keyboard: tailButtons}});
}

function contactMethodKeyboard() {
  return {inline_keyboard: [
    [{text: '✈️ Telegram', callback_data: 'bkc:telegram'}],
    [{text: '📱 WhatsApp', callback_data: 'bkc:whatsapp'}],
    [{text: '📧 Email', callback_data: 'bkc:email'}],
    [{text: '◀️ Back', callback_data: 'bkcancel'}]
  ]};
}

// Handles a tap on contactMethodKeyboard(). Telegram picks itself up
// automatically from the tapper's @username (no typing needed); WhatsApp
// and Email still need a text reply since that detail isn't something the
// bot already knows.
async function handleContactMethod(chatId, method, from) {
  const session = await getBotSession(chatId);
  const data = session.data || {};

  if (method === 'telegram') {
    const username = from && from.username;
    if (username) {
      data.contact = `@${username} (Telegram)`;
      await setBotSession(chatId, 'awaiting_date', data);
      await sendMessage(chatId, 'What date would you like to book? (any format is fine — our manager will confirm the details with you)');
      return;
    }
    data.contactMethod = 'Telegram';
    await setBotSession(chatId, 'awaiting_contact_detail', data);
    await sendMessage(chatId, "You don't have a public Telegram username set — please type your Telegram username or phone number instead.");
    return;
  }

  data.contactMethod = method === 'whatsapp' ? 'WhatsApp' : 'Email';
  await setBotSession(chatId, 'awaiting_contact_detail', data);
  await sendMessage(chatId, method === 'whatsapp' ? 'Please send your WhatsApp number (with country code).' : 'Please send your email address.');
}

async function startBooking(chatId, slug) {
  const m = modelBySlug(slug);
  if (!m) {
    await sendMessage(chatId, "That companion isn't available anymore.");
    return;
  }
  if (m.vip) {
    const paid = await isTelegramVipPaid(chatId);
    if (!paid) {
      await sendMessage(chatId, "That's a VIP companion — unlock VIP access first (send /start, pick her city/filters, then \"I want VIP\").");
      return;
    }
  }
  // Keep the existing city/cats/prices in the session (merge, don't
  // replace) — a stale Back button tapped on an older results message
  // later would otherwise land on a filter step with no city recorded
  // ("City: undefined") since it reads whatever's currently in the session.
  const session = await getBotSession(chatId);
  const data = Object.assign({}, session.data || {}, {modelSlug: slug, modelName: m.name});
  await setBotSession(chatId, 'awaiting_name', data);
  await sendMessage(chatId, `Booking enquiry for <b>${m.name}</b>.\n\nWhat's your name? (/cancel to stop)`);
}

// One-tap escape hatch on a result card for a client who'd rather just talk
// to a person than step through Book's guided flow — gives them the
// manager's contact directly (reusing the same VIP_MANAGER_CONTACT) and
// gives the manager a heads-up with which companion they're asking about.
async function contactManagerAbout(chatId, slug, from) {
  const m = modelBySlug(slug);
  const name = m ? m.name : 'a companion';
  await sendMessage(chatId, `Message our manager directly about <b>${name}</b>: ${VIP_MANAGER_CONTACT}\n\nYour reference code: <code>${chatId}</code> — mention it along with her name so they know who you're asking about.`);

  const TG_CHAT = process.env.TELEGRAM_BOOKINGS_CHAT_ID;
  const TG_THREAD = process.env.TELEGRAM_BOOKINGS_THREAD_ID;
  const username = from && from.username ? `@${from.username}` : 'no username';
  const msg = `💬 <b>Contact Manager Request (Telegram Bot)</b>\n\n<b>Model:</b> ${escapeHtml(name)}\n<b>Telegram:</b> ${username} (chat id <code>${chatId}</code>)\n\n<i>Client was given the manager's contact and this reference code.</i>`;
  if (TG_CHAT) {
    try {
      await sendMessage(TG_CHAT, msg, TG_THREAD ? {message_thread_id: TG_THREAD} : undefined);
    } catch (e) {
      console.error('telegram-bot: failed to forward contact-manager notice:', e.message);
    }
  }
}

async function handleBookingStep(chatId, session, text) {
  const data = session.data || {};
  if (/^\/cancel$/i.test(text.trim())) {
    await setBotSession(chatId, 'idle', {});
    await sendMessage(chatId, 'Booking cancelled. Send /start to search again.');
    return;
  }

  if (session.state === 'awaiting_name') {
    data.name = text.trim();
    await setBotSession(chatId, 'choosing_contact_method', data);
    await sendMessage(chatId, 'How should we contact you?', {reply_markup: contactMethodKeyboard()});
    return;
  }

  if (session.state === 'awaiting_contact_detail') {
    data.contact = `${text.trim()} (${data.contactMethod})`;
    await setBotSession(chatId, 'awaiting_date', data);
    await sendMessage(chatId, 'What date would you like to book? (any format is fine — our manager will confirm the details with you)');
    return;
  }

  if (session.state === 'awaiting_date') {
    data.date = text.trim();
    await setBotSession(chatId, 'awaiting_time', data);
    await sendMessage(chatId, 'What time? (any format is fine)');
    return;
  }

  if (session.state === 'awaiting_time') {
    data.time = text.trim();
    await setBotSession(chatId, 'idle', {});
    await forwardBookingRequest(chatId, data);
    return;
  }
}

// Posts the completed enquiry to the same manager group/topic the site's
// booking form uses (assets/main.js's submitBooking) — but with THIS bot's
// own token, so this bot must be added to that group separately from the
// site's notification bot before this will actually deliver anything.
async function forwardBookingRequest(chatId, data) {
  const TG_CHAT = process.env.TELEGRAM_BOOKINGS_CHAT_ID;
  const TG_THREAD = process.env.TELEGRAM_BOOKINGS_THREAD_ID;
  const msg = `🔖 <b>New Booking Request (Telegram Bot)</b>\n\n<b>Model:</b> ${escapeHtml(data.modelName)}\n<b>Client:</b> ${escapeHtml(data.name)}\n<b>Contact:</b> ${escapeHtml(data.contact)}\n<b>Date:</b> ${escapeHtml(data.date)}\n<b>Time:</b> ${escapeHtml(data.time)}\n\n<i>Sent via the Telegram catalog bot — confirm availability, duration and rate directly with the client.</i>`;

  if (TG_CHAT) {
    try {
      await sendMessage(TG_CHAT, msg, TG_THREAD ? {message_thread_id: TG_THREAD} : undefined);
    } catch (e) {
      console.error('telegram-bot: failed to forward booking to manager chat:', e.message);
    }
  } else {
    console.error('telegram-bot: TELEGRAM_BOOKINGS_CHAT_ID not configured — booking not forwarded:', msg);
  }

  await sendMessage(chatId, "✅ Thanks! Your enquiry has been sent — our team will contact you shortly to confirm.");
}

// No automated payment processor is wired up yet (no Stripe, no crypto
// gateway) — the client is pointed straight at the manager's own Telegram
// to arrange payment out of band, and the manager confirms it manually by
// tapping the button on the request forwarded to TELEGRAM_BOOKINGS_CHAT_ID.
const VIP_MANAGER_CONTACT = process.env.TELEGRAM_VIP_MANAGER_CONTACT || '@paradisemodelslondon';

async function startVipPurchase(chatId, from) {
  await sendMessage(chatId, `VIP access is a one-time £${VIP_PRICE_GBP}. Message our manager to arrange payment: ${VIP_MANAGER_CONTACT}\n\nYour reference code: <code>${chatId}</code> — mention it so they can activate your VIP access once payment is confirmed.`);
  await forwardVipRequest(chatId, from);
}

// Posts the VIP payment request to the same manager chat bookings use, but
// in its own topic (TELEGRAM_VIP_THREAD_ID) so VIP requests don't get mixed
// in with regular booking enquiries. Includes a button that marks this
// chat as paid (see the grantvip: callback in handleUpdate) once the
// manager has actually taken payment from the client directly.
async function forwardVipRequest(chatId, from) {
  const TG_CHAT = process.env.TELEGRAM_BOOKINGS_CHAT_ID;
  const TG_THREAD = process.env.TELEGRAM_VIP_THREAD_ID;
  const username = from && from.username ? `@${from.username}` : 'no username';
  const msg = `🔓 <b>VIP Access Request (Telegram Bot)</b>\n\n<b>Telegram:</b> ${username} (chat id <code>${chatId}</code>)\n<b>Amount:</b> £${VIP_PRICE_GBP}\n\n<i>The client was given ${VIP_MANAGER_CONTACT}'s contact and this reference code — confirm below once they've paid.</i>`;
  const keyboard = {inline_keyboard: [[{text: '✅ Confirm payment received', callback_data: `grantvip:${chatId}`}]]};

  if (TG_CHAT) {
    try {
      await sendMessage(TG_CHAT, msg, Object.assign({reply_markup: keyboard}, TG_THREAD ? {message_thread_id: TG_THREAD} : {}));
    } catch (e) {
      console.error('telegram-bot: failed to forward VIP request to manager chat:', e.message);
    }
  } else {
    console.error('telegram-bot: TELEGRAM_BOOKINGS_CHAT_ID not configured — VIP request not forwarded:', msg);
  }
}

async function handleVipShow(chatId, data) {
  const paid = await isTelegramVipPaid(chatId);
  if (!paid) {
    await sendMessage(chatId, `VIP access is a one-time £${VIP_PRICE_GBP}. How would you like to pay?`, {
      reply_markup: {inline_keyboard: [
        [{text: '🪙 Pay with Crypto', callback_data: 'vip:crypto'}],
        [{text: '🏦 Bank Transfer', callback_data: 'vip:bank'}],
        [{text: '◀️ Back', callback_data: 'nav:price'}]
      ]}
    });
    return;
  }
  await sendResultsBatch(chatId, data, vipModels(), 0, 'vip');
}

// Crypto isn't wired up to anything yet — the button exists now so it's
// visible in the flow, but just tells the client to use Bank Transfer
// until a crypto processor is actually connected.
async function showCryptoComingSoon(chatId) {
  await sendMessage(chatId, "Crypto payment isn't set up yet — please use Bank Transfer for now, or check back soon.");
}

async function showCityStep(chatId, messageId) {
  const text = 'Where would you like to search?';
  const keyboard = cityKeyboard();
  if (messageId) {
    await editMessageText(chatId, messageId, text, {reply_markup: keyboard}).catch(() => sendMessage(chatId, text, {reply_markup: keyboard}));
  } else {
    await sendMessage(chatId, text, {reply_markup: keyboard});
  }
}

async function handleUpdate(update) {
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message.chat.id;
    const messageId = cq.message.message_id;
    const dataStr = cq.data || '';
    await answerCallbackQuery(cq.id).catch(() => {});

    if (dataStr === 'restart') {
      await setBotSession(chatId, 'idle', {});
      await showCityStep(chatId, messageId);
      return;
    }

    // Steps back one stage in the city -> categories -> price wizard,
    // editing whichever message the tapped Back button lives on — the
    // original stepper message while moving through it, or a later message
    // (results footer, VIP payment choice) when backing out of those.
    if (dataStr.startsWith('nav:')) {
      const step = dataStr.slice(4);
      const session = await getBotSession(chatId);
      const data = session.data || {};
      if (step === 'city') {
        await showCityStep(chatId, messageId);
        return;
      }
      if (step === 'cats') {
        data.cats = data.cats || [];
        await setBotSession(chatId, 'choosing_cats', data);
        await editMessageText(chatId, messageId, catStepText(data), {reply_markup: catKeyboard(data)});
        return;
      }
      if (step === 'price') {
        data.prices = data.prices || [];
        await setBotSession(chatId, 'choosing_price', data);
        await editMessageText(chatId, messageId, priceStepText(data), {reply_markup: priceKeyboard(data)});
        return;
      }
      return;
    }

    if (dataStr === 'bkcancel') {
      await setBotSession(chatId, 'idle', {});
      await editMessageText(chatId, messageId, 'Booking cancelled. Send /start to search again.').catch(() => {});
      return;
    }

    if (dataStr.startsWith('city:')) {
      const slug = dataStr.slice(5);
      const data = {city: slug, cats: []};
      await setBotSession(chatId, 'choosing_cats', data);
      await editMessageText(chatId, messageId, catStepText(data), {reply_markup: catKeyboard(data)});
      return;
    }

    if (dataStr.startsWith('cat:')) {
      const idx = parseInt(dataStr.slice(4), 10);
      const session = await getBotSession(chatId);
      const data = session.data || {};
      data.cats = data.cats || [];
      const pos = data.cats.indexOf(idx);
      if (pos === -1) data.cats.push(idx); else data.cats.splice(pos, 1);
      await setBotSession(chatId, 'choosing_cats', data);
      await editMessageText(chatId, messageId, catStepText(data), {reply_markup: catKeyboard(data)});
      return;
    }

    // Same VIP entry point as the one after public results (handleVipShow
    // shows matches if this chat already paid, otherwise the payment
    // choice) — just reachable straight from categories too, since a
    // client interested in VIP shouldn't have to click through rate first.
    if (dataStr === 'cats:vip') {
      const session = await getBotSession(chatId);
      const data = session.data || {};
      data.cats = data.cats || [];
      data.cameFromCats = true;
      await setBotSession(chatId, 'idle', data);
      await handleVipShow(chatId, data);
      return;
    }

    if (dataStr === 'cats:done') {
      const session = await getBotSession(chatId);
      const data = session.data || {};
      data.prices = data.prices || [];
      await setBotSession(chatId, 'choosing_price', data);
      await editMessageText(chatId, messageId, priceStepText(data), {reply_markup: priceKeyboard(data)});
      return;
    }

    // Many companions don't have a listed rate, so any price bucket filter
    // silently excludes them — this button clears the price filter
    // entirely and shows every city/category match regardless of rate.
    if (dataStr === 'price:all') {
      const session = await getBotSession(chatId);
      const data = session.data || {};
      data.prices = [];
      await setBotSession(chatId, 'idle', data);
      await editMessageText(chatId, messageId, `<b>City:</b> ${cityNameFromSlug(data.city)}\nSearching…`);
      await sendResultsBatch(chatId, data, publicModels(), 0, 'pub');
      return;
    }

    if (dataStr === 'price:done') {
      const session = await getBotSession(chatId);
      const data = session.data || {};
      await setBotSession(chatId, 'idle', data);
      await editMessageText(chatId, messageId, `<b>City:</b> ${cityNameFromSlug(data.city)}\nSearching…`);
      await sendResultsBatch(chatId, data, publicModels(), 0, 'pub');
      return;
    }

    if (dataStr.startsWith('price:')) {
      const key = dataStr.slice(6);
      const session = await getBotSession(chatId);
      const data = session.data || {};
      data.prices = data.prices || [];
      const pos = data.prices.indexOf(key);
      if (pos === -1) data.prices.push(key); else data.prices.splice(pos, 1);
      await setBotSession(chatId, 'choosing_price', data);
      await editMessageText(chatId, messageId, priceStepText(data), {reply_markup: priceKeyboard(data)});
      return;
    }

    if (dataStr.startsWith('pub:')) {
      const offset = parseInt(dataStr.slice(4), 10) || 0;
      const session = await getBotSession(chatId);
      await sendResultsBatch(chatId, session.data || {}, publicModels(), offset, 'pub');
      return;
    }

    if (dataStr.startsWith('vip:')) {
      const rest = dataStr.slice(4);
      const session = await getBotSession(chatId);
      if (rest === 'show') {
        const data = session.data || {};
        data.cameFromCats = false;
        await handleVipShow(chatId, data);
        return;
      }
      if (rest === 'crypto') {
        await showCryptoComingSoon(chatId);
        return;
      }
      if (rest === 'bank') {
        await startVipPurchase(chatId, cq.from);
        return;
      }
      const offset = parseInt(rest, 10) || 0;
      await sendResultsBatch(chatId, session.data || {}, vipModels(), offset, 'vip');
      return;
    }

    if (dataStr.startsWith('grantvip:')) {
      const targetChatId = dataStr.slice('grantvip:'.length);
      const managerChat = process.env.TELEGRAM_BOOKINGS_CHAT_ID;
      if (!managerChat || String(chatId) !== String(managerChat)) return;
      try {
        await upsertTelegramVipAccess({chat_id: targetChatId, paid: true, paid_at: new Date().toISOString()});
        await editMessageText(chatId, messageId, `${cq.message.text}\n\n✅ Marked as paid.`, {reply_markup: {inline_keyboard: []}}).catch(() => {});
        await sendMessage(targetChatId, "✅ Payment confirmed — VIP companions are now included in your search. Send /start to search again.").catch(() => {});
      } catch (e) {
        console.error('telegram-bot: failed to grant VIP access:', e.message);
      }
      return;
    }

    if (dataStr.startsWith('bkc:')) {
      const method = dataStr.slice(4);
      await handleContactMethod(chatId, method, cq.from);
      return;
    }

    if (dataStr.startsWith('cm:')) {
      const slug = dataStr.slice(3);
      await contactManagerAbout(chatId, slug, cq.from);
      return;
    }

    if (dataStr.startsWith('bk:')) {
      const slug = dataStr.slice(3);
      await startBooking(chatId, slug);
      return;
    }
    return;
  }

  const msg = update.message;
  if (!msg || typeof msg.text !== 'string') return;
  // The bot is an admin of the staff group (so it can post/forward there),
  // which means Telegram delivers it every message in every topic of that
  // group, not just what's meant for it. Only ever treat a text message as
  // part of the client conversation when it's a private 1:1 chat with the
  // bot — the group side only ever interacts via button taps (grantvip:).
  if (msg.chat.type !== 'private') return;
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (/^\/(start|models)\b/i.test(text)) {
    await setBotSession(chatId, 'idle', {});
    await sendMessage(chatId, "Welcome to Paradise Models. Let's find you a companion.");
    await showCityStep(chatId);
    return;
  }

  const session = await getBotSession(chatId);
  if (session.state && session.state.startsWith('awaiting_')) {
    await handleBookingStep(chatId, session, text);
    return;
  }

  await sendMessage(chatId, "Send /start to search our companions.");
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }
  if (WEBHOOK_SECRET && req.headers['x-telegram-bot-api-secret-token'] !== WEBHOOK_SECRET) {
    return res.status(401).end('Unauthorized');
  }
  if (!process.env.TELEGRAM_CATALOG_BOT_TOKEN) {
    console.error('telegram-bot: TELEGRAM_CATALOG_BOT_TOKEN not configured');
    // Still 200 — Telegram retries a webhook that doesn't 2xx, and retrying
    // won't fix a missing env var.
    return res.status(200).end('Not configured');
  }

  try {
    await handleUpdate(req.body || {});
  } catch (e) {
    console.error('telegram-bot: unhandled error processing update:', e);
  }
  // Always 200 quickly — Telegram treats a slow/non-2xx response as
  // delivery failure and will keep retrying the same update.
  return res.status(200).end('ok');
};
