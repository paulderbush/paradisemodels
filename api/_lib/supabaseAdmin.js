'use strict';
// Thin REST helpers for talking to Supabase from server-side functions,
// matching the plain-fetch style the client code already uses (assets/main.js,
// assets/chat.js) instead of pulling in @supabase/supabase-js as a dependency.

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rfmixjljtwzhedsjsjni.supabase.co';
// Anon key: same public, low-privilege key already embedded in assets/main.js.
// Safe to fall back to since it carries no elevated access — kept as an env
// var mainly for parity with the service key below.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_r7LdYArejggySFV2So1rmg_72NU_XK5';
// Service role key: full read/write, bypasses Row Level Security. Only ever
// used from these server functions, never sent to the browser. Must be set
// in Vercel's project environment variables — there is no safe fallback.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Resolves the Supabase user for a request's "Authorization: Bearer <jwt>"
// header. Uses the anon key + the visitor's own access token (not the
// service role), so this only ever proves who the caller already is — it
// can't be used to impersonate another user.
async function getUserFromAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}`}
  });
  if (!r.ok) return null;
  return r.json();
}

// Upserts a row in vip_access using the service role key, which bypasses RLS.
// This is the ONLY code path allowed to mark a user as paid — everything
// else only has read access to its own row (see sql/001_vip_access.sql).
async function upsertVipAccess(row) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/vip_access`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(row)
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Supabase upsert failed (${r.status}): ${text}`);
  }
}

// Reads a user's paid status using the service role key, which bypasses
// RLS. Used where a server function needs an authoritative yes/no (gating
// what VIP model data to return) rather than the client's own anon-key +
// RLS read (assets/auth.js's checkVipAccess, used only for UI state).
async function isVipPaid(userId) {
  if (!SUPABASE_SERVICE_ROLE_KEY || !userId) return false;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/vip_access?user_id=eq.${userId}&select=paid`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  if (!r.ok) return false;
  const rows = await r.json();
  return !!(rows[0] && rows[0].paid);
}

module.exports = {SUPABASE_URL, SUPABASE_ANON_KEY, getUserFromAuthHeader, upsertVipAccess, isVipPaid};
