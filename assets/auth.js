// =================== ACCOUNT / VIP ACCESS ===================
// Thin wrappers around Supabase Auth + the vip_access table (see
// sql/001_vip_access.sql). Shared by the account page and the VIP Models
// page so both read "signed in?" / "paid?" the same way.

async function authSignUp(email, password) {
  if (!sb) return {error: {message: 'Auth is not available right now.'}};
  try { return await sb.auth.signUp({email, password}); }
  catch (e) { return {error: {message: 'Network error — please try again.'}}; }
}

async function authSignIn(email, password) {
  if (!sb) return {error: {message: 'Auth is not available right now.'}};
  try { return await sb.auth.signInWithPassword({email, password}); }
  catch (e) { return {error: {message: 'Network error — please try again.'}}; }
}

async function authSignOut() {
  if (!sb) return;
  try { await sb.auth.signOut(); } catch (e) {}
}

// Resolves to the current user (or null if signed out, or if the auth check
// itself fails — a network hiccup here must read as "not signed in", never
// throw and break the page). Supabase persists the session in localStorage
// itself, so this is safe to call on every page load.
async function authGetUser() {
  if (!sb) return null;
  try {
    const {data} = await sb.auth.getUser();
    return data ? data.user : null;
  } catch (e) {
    return null;
  }
}

// Resolves to true only if there's a paid row for this user. Reads through
// the anon key + the visitor's own session, so RLS only ever lets this see
// their own row — it cannot be used to probe anyone else's access, and
// there is deliberately no client-side way to set it to true. Any failure
// (network, RLS, missing table) reads as "not paid", never throws.
async function checkVipAccess(userId) {
  if (!sb || !userId) return false;
  try {
    const {data, error} = await sb
      .from('vip_access')
      .select('paid')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return false;
    return !!(data && data.paid);
  } catch (e) {
    return false;
  }
}
