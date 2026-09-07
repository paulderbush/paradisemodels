'use strict';
// Thin wrapper over the Telegram Bot API for the catalog bot, matching the
// plain-fetch style already used site-wide (assets/main.js, this repo's
// other api/_lib helpers) instead of pulling in a bot framework dependency.
//
// Deliberately a SEPARATE bot/token from the one hardcoded in assets/main.js
// (TG_BOT_BASE there) — that token lives in client-side JS, fully visible
// to anyone viewing the page source, which is fine for a write-only
// "send a booking notification" call but would be a real problem for an
// interactive bot: this bot's token also authorizes replacing its webhook
// (i.e. hijacking it) and reading its message history via getUpdates. It
// must only ever live server-side, in Vercel's env vars.
const BOT_TOKEN = process.env.TELEGRAM_CATALOG_BOT_TOKEN;
const API_BASE = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null;

async function callTelegram(method, payload) {
  if (!API_BASE) throw new Error('TELEGRAM_CATALOG_BOT_TOKEN is not configured');
  const r = await fetch(`${API_BASE}/${method}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const json = await r.json().catch(() => null);
  if (!r.ok || !json || json.ok === false) {
    const desc = json && json.description;
    throw new Error(`Telegram ${method} failed (${r.status}): ${desc || 'unknown error'}`);
  }
  return json.result;
}

function sendMessage(chatId, text, extra) {
  return callTelegram('sendMessage', Object.assign({chat_id: chatId, text, parse_mode: 'HTML'}, extra));
}

function editMessageText(chatId, messageId, text, extra) {
  return callTelegram('editMessageText', Object.assign(
    {chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML'}, extra
  ));
}

function sendPhoto(chatId, photoUrl, caption, extra) {
  return callTelegram('sendPhoto', Object.assign(
    {chat_id: chatId, photo: photoUrl, caption, parse_mode: 'HTML'}, extra
  ));
}

// Telegram requires every callback query to be acknowledged (even with an
// empty body) or the client's button shows a permanent loading spinner.
function answerCallbackQuery(callbackQueryId, extra) {
  return callTelegram('answerCallbackQuery', Object.assign({callback_query_id: callbackQueryId}, extra));
}

module.exports = {callTelegram, sendMessage, editMessageText, sendPhoto, answerCallbackQuery};
