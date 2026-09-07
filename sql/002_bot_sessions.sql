-- Run this once in the Supabase dashboard: Project -> SQL Editor -> New query
-- -> paste this whole file -> Run.
--
-- Holds the Telegram catalog bot's per-chat conversation state (e.g. "we're
-- mid-way through a booking, waiting for the client's date") between
-- webhook calls — a serverless function has no memory of its own between
-- invocations. Only ever read/written by api/telegram-bot.js using the
-- Supabase service role key, so no RLS policies are needed: nothing here
-- is ever exposed to a browser or an anon-key client.

create table if not exists public.bot_sessions (
  chat_id bigint primary key,
  state text not null default 'idle',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.bot_sessions enable row level security;
-- No policies: with RLS on and none defined, every role except the
-- service role (which bypasses RLS) is refused outright.
