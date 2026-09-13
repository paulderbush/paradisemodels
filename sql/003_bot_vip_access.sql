-- Run this once in the Supabase dashboard: Project -> SQL Editor -> New query
-- -> paste this whole file -> Run.
--
-- Mirrors vip_access (001_vip_access.sql) but keyed by Telegram chat_id
-- instead of a Supabase auth user — the catalog bot's VIP unlock has no
-- website account behind it, just a Telegram conversation. Only ever
-- read/written by server code using the service role key (api/telegram-bot.js
-- checks it, api/stripe-webhook.js writes it after a completed Stripe
-- Checkout with metadata.telegram_chat_id set), so no RLS policies are
-- needed: nothing here is ever exposed to a browser or an anon-key client.

create table if not exists public.bot_vip_access (
  chat_id bigint primary key,
  paid boolean not null default false,
  stripe_session_id text,
  currency text,
  amount integer,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.bot_vip_access enable row level security;
-- No policies: with RLS on and none defined, every role except the
-- service role (which bypasses RLS) is refused outright.
