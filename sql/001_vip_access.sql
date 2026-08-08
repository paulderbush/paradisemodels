-- Run this once in the Supabase dashboard: Project -> SQL Editor -> New query
-- -> paste this whole file -> Run.
--
-- Creates the table that records who has paid for VIP catalog access, and
-- locks it down so a signed-in visitor can only ever READ their own row.
-- Nobody (not even a signed-in user) can write to this table directly —
-- the only way a row gets inserted or updated is the Stripe webhook
-- (api/stripe-webhook.js), which authenticates with the Supabase service
-- role key and so bypasses Row Level Security entirely. That split is the
-- whole security model: the browser can prove "am I paid?" but never
-- "make me paid".

create table if not exists public.vip_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  paid boolean not null default false,
  stripe_session_id text,
  currency text,
  amount integer,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.vip_access enable row level security;

drop policy if exists "Users can read their own VIP access" on public.vip_access;
create policy "Users can read their own VIP access"
  on public.vip_access
  for select
  using (auth.uid() = user_id);

-- Deliberately no insert/update/delete policy for the anon/authenticated
-- roles — with RLS enabled and no such policy, those operations are
-- refused outright for everyone except the service role.
