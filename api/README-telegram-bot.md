# Telegram catalog bot

`telegram-bot.js` is a webhook handler that lets a client browse the public
model roster and submit a booking enquiry from inside Telegram, reading the
same `data/models.js` the site itself builds from. VIP models are
deliberately excluded — see the comment at the top of the file.

This is a **separate bot** from the one already embedded in
`assets/main.js` (used only to push booking notifications from the site).
That one's token lives in client-side JS and is fine for a write-only call;
this bot is interactive, so its token must only ever live in Vercel's env
vars, never in the repo or in the browser.

## One-time setup

1. **Create the bot.** Message [@BotFather](https://t.me/BotFather) on
   Telegram, `/newbot`, follow the prompts. It gives you a token that looks
   like `123456789:AA...`.

2. **Set Vercel environment variables** (Project → Settings →
   Environment Variables):
   - `TELEGRAM_CATALOG_BOT_TOKEN` — the token from step 1.
   - `TELEGRAM_WEBHOOK_SECRET` — any long random string you generate
     yourself (e.g. `openssl rand -hex 32`). This is checked against the
     `X-Telegram-Bot-Api-Secret-Token` header Telegram sends, so a request
     to the webhook URL that doesn't know this value is rejected.
   - `TELEGRAM_BOOKINGS_CHAT_ID` — the Telegram group/chat id where booking
     enquiries from the bot should land. Can be the same group the site
     already notifies (`TG_CHAT` in `assets/main.js`) or a different one.
   - `TELEGRAM_BOOKINGS_THREAD_ID` — optional, a forum topic id within that
     chat (leave unset for a non-forum group or the General topic).
   - `SUPABASE_SERVICE_ROLE_KEY` — already required for the VIP/Stripe
     flow; the bot reuses it to store conversation state (see
     `sql/002_bot_sessions.sql`).

3. **Run the SQL migration.** Supabase dashboard → SQL Editor → paste and
   run `sql/002_bot_sessions.sql`.

4. **Add the bot to the bookings chat.** If `TELEGRAM_BOOKINGS_CHAT_ID` is
   a group, invite the new bot into it (and give it permission to post, and
   to post in the specific topic if using threads) — otherwise the booking
   forward silently fails with a logged error.

5. **Register the webhook.** Deploy first so the URL exists, then run
   this once from your own machine (never paste the token into a shared
   chat — this is the only step that needs it):

   ```bash
   curl -s "https://api.telegram.org/bot<TELEGRAM_CATALOG_BOT_TOKEN>/setWebhook" \
     -d "url=https://velvetescort.co.uk/api/telegram-bot" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```

   A `{"ok":true,...}` response confirms it. Telegram will now POST every
   update for this bot to that URL.

6. Message the bot `/start` or `/models` on Telegram to try it.

## How it works

- `/models` (or `/start`) → city list (inline buttons, one per city with a
  public model, with counts) → paginated model list per city → model card
  (photo + stats + price + Book button).
- "Book" starts a short guided flow (name → contact → date → time), stored
  per-chat in `bot_sessions` between webhook calls since a serverless
  function has no memory of its own. `/cancel` aborts it at any point.
- Booking flow does not walk the client through the site's full
  incall/outcall/duration price calculator — it collects a simple enquiry
  and the manager confirms rate and availability directly. Widen this in
  `telegram-bot.js`'s `handleBookingStep` if that's not enough.
