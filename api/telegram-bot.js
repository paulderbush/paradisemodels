'use strict';
// Telegram catalog bot — lets a client browse the public model roster and
// submit a booking enquiry without leaving Telegram. Webhook handler: point
// this bot's setWebhook at POST https://<domain>/api/telegram-bot.
//
// Deliberately reads data/models.js directly (the same single source of
// truth the site build reads from) rather than scraping the live site or
// keeping a separate copy, so there is nothing to keep in sync — a new
// model added to data/models.js shows up here on the next request with no
// extra step.
//
// VIP models are out of scope on purpose: the whole point of vip:true is
// that the data never leaves the server except after a paid Stripe
// checkout (see api/vip-catalog.js's comment) — a Telegram bot has no
// equivalent payment gate yet, so this only ever shows the public roster.
const {MODELS} = require('../data/models.js');
const {getBotSession, setBotSession} = require('./_lib/supabaseAdmin');
const {sendMessage, editMessageText, sendPhoto, answerCallbackQuery} = require('./_lib/telegramBot');

const SITE_URL = 'https://velvetescort.co.uk';
const MODELS_PER_PAGE = 8;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

function publicModels() {
  return MODELS.filter(m => m.real && !m.vip);
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

function citiesWithCounts() {
  const counts = new Map();
  publicModels().forEach(m => counts.set(m.city, (counts.get(m.city) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

function cityKeyboard() {
  const rows = citiesWithCounts().map(([city, count]) => ([
    {text: `${city} (${count})`, callback_data: `c:${citySlug(city)}:0`}
  ]));
  return {inline_keyboard: rows};
}

function modelsInCity(slug) {
  return publicModels().filter(m => citySlug(m.city) === slug);
}

function cityPageKeyboard(slug, page) {
  const all = modelsInCity(slug);
  const start = page * MODELS_PER_PAGE;
  const pageModels = all.slice(start, start + MODELS_PER_PAGE);
  const rows = pageModels.map(m => ([{text: m.name, callback_data: `m:${m.slug}`}]));
  const navRow = [];
  if (page > 0) navRow.push({text: '⬅ Prev', callback_data: `c:${slug}:${page - 1}`});
  if (start + MODELS_PER_PAGE < all.length) navRow.push({text: 'Next ➡', callback_data: `c:${slug}:${page + 1}`});
  if (navRow.length) rows.push(navRow);
  rows.push([{text: '🏙 All cities', callback_data: 'cities'}]);
  return {inline_keyboard: rows};
}

function modelCaption(m) {
  const price = startPrice(m);
  const lines = [
    `<b>${m.name}</b>`,
    [m.age ? `${m.age} yrs` : null, m.nationality, m.station || m.city].filter(Boolean).join(' · '),
    price !== null ? `💰 from £${price}` : '💰 Rates on request'
  ];
  if (m.svcs && m.svcs.length) lines.push(m.svcs.slice(0, 6).join(', ') + (m.svcs.length > 6 ? '…' : ''));
  return lines.join('\n');
}

function modelKeyboard(m) {
  return {inline_keyboard: [
    [{text: '📅 Book', callback_data: `bk:${m.slug}`}],
    [{text: '⬅ Back to city', callback_data: `c:${citySlug(m.city)}:0`}]
  ]};
}

async function showCityPage(chatId, slug, page, messageId) {
  const all = modelsInCity(slug);
  if (!all.length) {
    await sendMessage(chatId, "No companions listed in that city right now.", {reply_markup: cityKeyboard()});
    return;
  }
  const cityName = all[0].city;
  const text = `<b>${cityName}</b> — ${all.length} companion${all.length === 1 ? '' : 's'}`;
  const keyboard = cityPageKeyboard(slug, page);
  if (messageId) {
    await editMessageText(chatId, messageId, text, {reply_markup: keyboard}).catch(() => sendMessage(chatId, text, {reply_markup: keyboard}));
  } else {
    await sendMessage(chatId, text, {reply_markup: keyboard});
  }
}

async function showModel(chatId, slug) {
  const m = publicModels().find(x => x.slug === slug);
  if (!m) {
    await sendMessage(chatId, "That companion isn't available anymore.", {reply_markup: cityKeyboard()});
    return;
  }
  const photoUrl = `${SITE_URL}/${m.folder}/1.webp`;
  await sendPhoto(chatId, photoUrl, modelCaption(m), {reply_markup: modelKeyboard(m)});
}

async function startBooking(chatId, slug) {
  const m = publicModels().find(x => x.slug === slug);
  if (!m) {
    await sendMessage(chatId, "That companion isn't available anymore.");
    return;
  }
  await setBotSession(chatId, 'awaiting_name', {modelSlug: slug, modelName: m.name});
  await sendMessage(chatId, `Booking enquiry for <b>${m.name}</b>.\n\nWhat's your name? (/cancel to stop)`);
}

async function handleBookingStep(chatId, session, text) {
  const data = session.data || {};
  if (/^\/cancel$/i.test(text.trim())) {
    await setBotSession(chatId, 'idle', {});
    await sendMessage(chatId, 'Booking cancelled. Send /models to browse again.');
    return;
  }

  if (session.state === 'awaiting_name') {
    data.name = text.trim();
    await setBotSession(chatId, 'awaiting_contact', data);
    await sendMessage(chatId, 'How should we contact you? (WhatsApp, Telegram username, or email)');
    return;
  }

  if (session.state === 'awaiting_contact') {
    data.contact = text.trim();
    await setBotSession(chatId, 'awaiting_date', data);
    await sendMessage(chatId, 'What date would you like to book? (e.g. 2026-09-10)');
    return;
  }

  if (session.state === 'awaiting_date') {
    data.date = text.trim();
    await setBotSession(chatId, 'awaiting_time', data);
    await sendMessage(chatId, 'What time? (24h format, e.g. 14:30)');
    return;
  }

  if (session.state === 'awaiting_time') {
    const time = text.trim();
    if (!/^\d{2}:\d{2}$/.test(time) || +time.slice(0, 2) > 23 || +time.slice(3) > 59) {
      await sendMessage(chatId, 'Please enter a valid time in 24h format (e.g. 14:30).');
      return;
    }
    data.time = time;
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
  const msg = `🔖 <b>New Booking Request (Telegram Bot)</b>\n\n<b>Model:</b> ${data.modelName}\n<b>Client:</b> ${data.name}\n<b>Contact:</b> ${data.contact}\n<b>Date:</b> ${data.date}\n<b>Time:</b> ${data.time}\n\n<i>Sent via the Telegram catalog bot — confirm availability, duration and rate directly with the client.</i>`;

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

async function handleUpdate(update) {
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message.chat.id;
    const messageId = cq.message.message_id;
    const dataStr = cq.data || '';
    await answerCallbackQuery(cq.id).catch(() => {});

    if (dataStr === 'cities') {
      await editMessageReplaceWithCities(chatId, messageId);
      return;
    }
    if (dataStr.startsWith('c:')) {
      const [, slug, pageStr] = dataStr.split(':');
      await showCityPage(chatId, slug, parseInt(pageStr, 10) || 0, messageId);
      return;
    }
    if (dataStr.startsWith('m:')) {
      const slug = dataStr.slice(2);
      await showModel(chatId, slug);
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
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (/^\/(start|models)\b/i.test(text)) {
    await setBotSession(chatId, 'idle', {});
    await sendMessage(chatId, "Welcome to Paradise Models. Browse our companions by city:", {reply_markup: cityKeyboard()});
    return;
  }

  const session = await getBotSession(chatId);
  if (session.state !== 'idle') {
    await handleBookingStep(chatId, session, text);
    return;
  }

  await sendMessage(chatId, "Send /models to browse our companions.");
}

// A city-list message replaces itself in place (edit) when reached via the
// "All cities" button so browsing doesn't leave a trail of old messages —
// editMessageText can't switch a photo-caption message back to plain text,
// so that one case falls back to a fresh message instead.
async function editMessageReplaceWithCities(chatId, messageId) {
  const text = 'Choose a city:';
  const keyboard = cityKeyboard();
  await editMessageText(chatId, messageId, text, {reply_markup: keyboard}).catch(() => sendMessage(chatId, text, {reply_markup: keyboard}));
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
