// =================== VIP MODELS PAGE ===================
const VIP_PRICE_GBP = 300;

function vipModelsList() {
  return MODELS.filter(m => m.cats && m.cats.includes('recommended'));
}

function renderVipTeaser() {
  const grid = document.getElementById('vipTeaserGrid');
  if (!grid) return;
  const teaser = vipModelsList().slice(0, 4);
  grid.innerHTML = teaser.map(m => modelCardHTML(m, false)).join('');
}

function renderVipUnlocked() {
  const grid = document.getElementById('vipUnlocked');
  if (!grid) return;
  grid.innerHTML = vipModelsList().map(m => modelCardHTML(m)).join('');
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
    renderVipUnlocked();
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
    renderVipUnlocked();
    showVipState('unlocked');
  } else {
    showVipState('locked');
  }
}

document.addEventListener('DOMContentLoaded', initVipPage);
