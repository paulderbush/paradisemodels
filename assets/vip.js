// =================== VIP MODELS PAGE ===================
const VIP_PRICE_GBP = 300;

// vip:true models are never embedded in this page's MODELS array (the
// build excludes them from every public page — see _build/build.js), so
// the unlocked grid is fetched from /api/vip-catalog instead, which only
// returns them after verifying payment server-side. Nothing client-side
// can be trusted to gate the real data, only the UI around it.
async function fetchVipModels() {
  try {
    const {data: sessionData} = await sb.auth.getSession();
    const token = sessionData && sessionData.session && sessionData.session.access_token;
    if (!token) return [];
    const r = await fetch('/api/vip-catalog', {headers: {Authorization: `Bearer ${token}`}});
    if (!r.ok) return [];
    const json = await r.json();
    return json.models || [];
  } catch (e) {
    return [];
  }
}

// The blurred backdrop behind the paywall card is just visual enticement —
// identity is hidden by the blur either way — so it doesn't have to be the
// real VIP set (which is never in MODELS here anyway). Prefer real photos,
// pad out to 4 with fake models so the page never looks sparse just because
// there are only 1-2 public real models right now.
function vipTeaserPool() {
  const real = MODELS.filter(m => m.real);
  const pool = real.length ? real.slice() : [];
  if (pool.length < 4) pool.push(...MODELS.filter(m => !m.real));
  return pool.slice(0, 4);
}

function renderVipTeaser() {
  const grid = document.getElementById('vipTeaserGrid');
  if (!grid) return;
  grid.innerHTML = vipTeaserPool().map(m => modelCardHTML(m, false)).join('');
}

async function renderVipUnlocked() {
  const grid = document.getElementById('vipUnlocked');
  if (!grid) return;
  const list = await fetchVipModels();
  grid.innerHTML = list.length
    ? list.map(m => modelCardHTML(m)).join('')
    : '<p style="grid-column:1/-1;text-align:center;color:var(--text-soft);padding:2rem 0">New VIP companions are being added — check back soon.</p>';
}

async function setVipPriceTag() {
  const tag = document.getElementById('vipPriceTag');
  if (!tag) return;
  if (window.CUR_READY) await window.CUR_READY;
  tag.textContent = typeof fmtPrice === 'function' ? fmtPrice(VIP_PRICE_GBP) : `£${VIP_PRICE_GBP}`;
}

function showVipState(state) {
  document.getElementById('vipLoading').style.display = state === 'loading' ? 'block' : 'none';
  document.getElementById('vipLocked').style.display = state === 'locked' ? 'block' : 'none';
  document.getElementById('vipUnlocked').style.display = state === 'unlocked' ? 'grid' : 'none';
}

async function handleVipCta() {
  const errorEl = document.getElementById('vipError');
  errorEl.style.display = 'none';

  const user = await authGetUser();
  if (!user) {
    window.location.href = '/account/?next=' + encodeURIComponent('/vip-models/');
    return;
  }

  const btn = document.getElementById('vipUnlockBtn');
  btn.disabled = true;
  btn.textContent = 'Redirecting to checkout…';

  try {
    const {data: sessionData} = await sb.auth.getSession();
    const token = sessionData && sessionData.session && sessionData.session.access_token;
    const r = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    const json = await r.json();
    if (!r.ok || !json.url) throw new Error(json.error || 'Could not start checkout.');
    window.location.href = json.url;
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Unlock VIP Access';
    errorEl.textContent = e.message || 'Something went wrong — please try again.';
    errorEl.style.display = 'block';
  }
}

function setVipPaywallCopy(signedIn) {
  document.getElementById('vipPaywallCopy').textContent = signedIn
    ? 'Unlock the VIP catalog with a one-time payment.'
    : 'Sign in, then unlock the VIP catalog with a one-time payment.';
  document.getElementById('vipUnlockBtn').textContent = signedIn ? 'Unlock VIP Access' : 'Sign In';
}

async function pollVipAccessAfterCheckout(userId, attemptsLeft) {
  const hasVip = await checkVipAccess(userId);
  if (hasVip) {
    await renderVipUnlocked();
    showVipState('unlocked');
    return;
  }
  if (attemptsLeft <= 0) {
    document.getElementById('vipPaywallCopy').textContent =
      'Payment received — confirming your access. This can take a minute; refresh the page shortly.';
    document.getElementById('vipUnlockBtn').style.display = 'none';
    showVipState('locked');
    return;
  }
  setTimeout(() => pollVipAccessAfterCheckout(userId, attemptsLeft - 1), 2000);
}

async function initVipPage() {
  renderVipTeaser();
  setVipPriceTag();

  const params = new URLSearchParams(window.location.search);
  const user = await authGetUser();

  if (!user) {
    setVipPaywallCopy(false);
    showVipState('locked');
    return;
  }

  if (params.get('checkout') === 'success') {
    document.getElementById('vipPaywallCopy').textContent = 'Finalizing your payment…';
    document.getElementById('vipUnlockBtn').style.display = 'none';
    showVipState('locked');
    pollVipAccessAfterCheckout(user.id, 8); // ~16s of retries
    return;
  }

  setVipPaywallCopy(true);
  const hasVip = await checkVipAccess(user.id);
  if (hasVip) {
    await renderVipUnlocked();
    showVipState('unlocked');
  } else {
    showVipState('locked');
  }
}

document.addEventListener('DOMContentLoaded', initVipPage);
