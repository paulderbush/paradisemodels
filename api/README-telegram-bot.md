# Telegram catalog bot

`telegram-bot.js` is a webhook handler that lets a client filter the model
roster (city, categories, age, rate) and submit a booking enquiry from
inside Telegram, reading the same `data/models.js` the site itself builds
from. VIP models are matched against the same filters but their cards are
only ever sent to a chat after that chat has paid for VIP access — see
"VIP access" below.

This is a **separate bot** from the one already embedded in
`assets/main.js` (used only to push booking notifications from the site).
That one's token lives in client-side JS and is fine for a write-only call;
this bot is interactive, so its token must only ever live in Vercel's env
vars, never in the repo or in the browser.

## One-time setup

1. **Create the bot.** Message [@BotFather](https://t.me/BotFather) on
   Telegram, `/newbot`, follow the prompts. It gives you a token that looks
   like `123456789:AA...`.

   If a token was ever pasted somewhere outside of Vercel's env vars
   (a chat, a doc, a screenshot), treat it as compromised — message
   @BotFather → your bot → **Revoke current token** and use the new one.
   Anyone holding the old token can hijack the bot's webhook and read all
   of its message history.

2. **Set Vercel environment variables** (Project → Settings →
   Environment Variables):
   - `TELEGRAM_CATALOG_BOT_TOKEN` — the token from step 1.
   - `TELEGRAM_WEBHOOK_SECRET` — any long random string you generate
     yourself (e.g. `openssl rand -hex 32`). This is checked against the
     `X-Telegram-Bot-Api-Secret-Token` header Telegram sends, so a request
     to the webhook URL that doesn't know this value is rejected.
   - `TELEGRAM_BOOKINGS_CHAT_ID` — the Telegram group/chat id where booking
     enquiries **and VIP payment requests** from the bot should land. Can be
     the same group the site already notifies (`TG_CHAT` in
     `assets/main.js`) or a different one. This chat is also the only place
     the "✅ Confirm payment received" button (see "VIP access" below) is
     allowed to be tapped from, so whoever needs to grant VIP access must be
     a member of it.
   - `TELEGRAM_BOOKINGS_THREAD_ID` — optional, a forum topic id within that
     chat for booking enquiries (leave unset for a non-forum group or the
     General topic).
   - `TELEGRAM_VIP_THREAD_ID` — optional, a **separate** forum topic id for
     VIP payment requests, so they don't mix in with regular bookings.
     Leave unset to have them land in the same place as
     `TELEGRAM_BOOKINGS_THREAD_ID` (or the General topic if that's unset
     too).
   - `TELEGRAM_VIP_MANAGER_CONTACT` — optional, the Telegram contact
     (e.g. `@paradisemodelslondon`) a client is told to message to arrange
     VIP payment. Defaults to `@paradisemodelslondon` if unset.
   - `SUPABASE_SERVICE_ROLE_KEY` — the bot uses it to store conversation
     state (`sql/002_bot_sessions.sql`) and Telegram-chat VIP access
     (`sql/003_bot_vip_access.sql`).
   - `SITE_URL` — optional, used to build the model-photo and "More" links
     the bot sends (e.g. `https://velvetescort.co.uk`); falls back to that
     same URL if unset.

   No Stripe or crypto keys are needed for the bot — VIP payment is
   currently confirmed manually by a manager (see "VIP access" below).

3. **Run the SQL migrations.** Supabase dashboard → SQL Editor → paste and
   run `sql/002_bot_sessions.sql` (conversation state) and
   `sql/003_bot_vip_access.sql` (per-chat VIP payment record) if you
   haven't already.

4. **Add the bot to the bookings chat.** Invite the bot into the
   `TELEGRAM_BOOKINGS_CHAT_ID` group (and give it permission to post, and to
   post in the specific topic if using threads) — otherwise both booking
   forwards and VIP payment requests silently fail with a logged error.

5. **Register the webhook.** Deploy first so the URL exists, then run
   this once from your own machine (never paste the token into a shared
   chat — this is the only step that needs it):

   ```bash
   curl -s "https://api.telegram.org/bot<TELEGRAM_CATALOG_BOT_TOKEN>/setWebhook" \
     -d "url=https://velvetescort.co.uk/api/telegram-bot" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```

   A `{"ok":true,...}` response confirms it. Telegram will now POST every
   update for this bot to that URL. If the webhook was already registered
   from an earlier version of the bot, you don't need to re-run this —
   only the code changed, not the URL.

6. Message the bot `/start` or `/models` on Telegram to try it.

## How it works

1. `/start` (or `/models`) → **city** (inline buttons: every city with a
   public model, showing the count, plus any city that only has VIP
   presence marked "VIP only").
2. → **categories**, multi-select: tapping a button toggles a ✅ prefix and
   re-renders the same message (Telegram has no native multi-select), tap
   **Continue** when done (zero selected = no category filter).
3. → **age**: `Under 23` / `24–27` / `27+` (single choice; the 24–27 and
   27+ buckets both match an exact age of 27, and the under-500/over-1000
   rate buckets below both match an exact £500/£1000, so a client can't
   fall through a gap between two buttons — adjust `AGE_BUCKETS`/
   `PRICE_BUCKETS` in `telegram-bot.js` if you'd rather have hard cutoffs).
4. → **rate**: `Under £500` / `£501–£1000` / `£1000+`.
5. → **results**: up to 5 matching public companions at a time (photo +
   age/nationality/area + starting price + top services, with **Book** and
   **More** — a link to her profile on the site — buttons), then a
   "Show N more" button if there are further matches.
6. If any **VIP** companion also matches the same filters, a
   "🔓 N VIP companions also match — I want VIP" button appears after the
   last page of public results (it's omitted entirely when there's no VIP
   match for the current filters). Tapping it either shows the matching VIP
   companions (if this chat has already paid) or gives the client the
   manager's contact and a reference code — see "VIP access" below.
7. **Book** on any card (public or VIP, VIP requires the chat to have
   already paid) starts a short guided flow — name → contact → date → time
   — stored per-chat in `bot_sessions` between webhook calls since a
   serverless function has no memory of its own. `/cancel` aborts it at
   any point. The enquiry is forwarded to `TELEGRAM_BOOKINGS_CHAT_ID` for a
   manager to confirm availability and rate directly with the client — it
   does not walk them through the site's full incall/outcall/duration
   price calculator; widen `handleBookingStep` in `telegram-bot.js` if
   that's not enough.

## VIP access

Mirrors the site's own rule: a VIP companion's real data never reaches a
client (browser or Telegram chat) until server-side payment verification
succeeds. `isTelegramVipPaid(chatId)` (in `api/_lib/supabaseAdmin.js`)
checks `bot_vip_access` — a table keyed by Telegram `chat_id` instead of a
Supabase user id, since a bot conversation has no website account behind
it (see `sql/003_bot_vip_access.sql`).

There's no automated payment processor wired up for the bot yet (no
Stripe, no crypto gateway — the site doesn't have one live either at the
moment). Instead:

1. Tapping **"I want VIP"** immediately messages the client the manager's
   own Telegram contact (`TELEGRAM_VIP_MANAGER_CONTACT`, defaults to
   `@paradisemodelslondon`) and a reference code (their chat id) to give
   the manager.
2. At the same time, the bot forwards a heads-up to
   `TELEGRAM_BOOKINGS_CHAT_ID` (in the `TELEGRAM_VIP_THREAD_ID` topic, kept
   separate from regular bookings) with the client's Telegram username and
   the same reference code, plus a **"✅ Confirm payment received"** button.
3. The client messages the manager directly and arranges the £300 payment
   out of band — the bot itself isn't part of that conversation.
4. Once paid, the manager taps the button on the forwarded heads-up. The
   tap is only honoured if it comes from inside `TELEGRAM_BOOKINGS_CHAT_ID`
   — anyone else tapping a copy of that button (they'd have to be in the
   group to see it in the first place) is ignored. On a valid tap, the bot
   marks that chat as paid in `bot_vip_access` and messages the client
   directly that VIP is unlocked.

When a real payment processor (Stripe, crypto, or both) is ready to go
live, `startVipPurchase`/`forwardVipRequest` in `telegram-bot.js` is the
place to swap in an automated checkout instead of the manual request —
`upsertTelegramVipAccess` (already wired up) is what a payment webhook
would call to mark the chat paid, the same way `stripe-webhook.js` does
for the site's own `vip_access` table.
