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

// VIP_TEASER_MODELS is a separate global from MODELS on purpose (see the
// build.js comment where it's embedded) — these placeholder stand-ins for
// the real roster must never leak into the general catalog grid or nav
// search, only this locked teaser.
function vipTeaserPool() {
  return typeof VIP_TEASER_MODELS !== 'undefined' ? VIP_TEASER_MODELS.slice(0, 4) : [];
}

function renderVipTeaser() {
  const grid = document.getElementById('vipTeaserGrid');
  if (!grid) return;
  grid.innerHTML = vipTeaserPool().map(m => modelCardHTML(m, false)).join('');
}

// =================== VIP CATALOG FILTERS ===================
// Mirrors the public /models/ catalog (assets/catalog.js) — same filter
// groups, same CSS classes — but the city/nationality/services options are
// built from whatever the unlocked VIP roster actually has (a handful of
// models, not the site-wide lists), and the age/weight/height range
// filters skip a model entirely rather than excluding it when a minimal
// VIP profile doesn't give that field (see e.g. Ana/Adriana/Leyla in
// data/models.js, which have no weight on file).
let allVipModels = [];
let filteredVipModels = [];
let vipActiveCat = 'all';
let vipSelectedCities = [];
let vipSelectedNats = [];
let vipSelectedSvcs = [];
let vipAgeRange = [18, 60];
let vipWeightRange = [40, 100];
let vipHeightRange = [150, 185];

async function renderVipUnlocked() {
  const grid = document.getElementById('vipUnlocked');
  if (!grid) return;
  allVipModels = await fetchVipModels();
  buildVipCityList();
  buildVipNatList();
  buildVipSvcList();
  vipApplyFilters();
}

function vipApplyFilters() {
  let ms = [...allVipModels];
  if (vipActiveCat !== 'all') ms = ms.filter(m => m.cats && m.cats.includes(vipActiveCat));
  if (vipSelectedCities.length) ms = ms.filter(m => vipSelectedCities.includes(m.city));
  if (vipSelectedNats.length) ms = ms.filter(m => vipSelectedNats.includes(m.nationality));
  if (vipSelectedSvcs.length) ms = ms.filter(m => vipSelectedSvcs.every(s => m.svcs && m.svcs.includes(s)));
  ms = ms.filter(m => m.age == null || (m.age >= vipAgeRange[0] && m.age <= vipAgeRange[1]));
  ms = ms.filter(m => m.weight == null || (m.weight >= vipWeightRange[0] && m.weight <= vipWeightRange[1]));
  ms = ms.filter(m => m.height == null || (m.height >= vipHeightRange[0] && m.height <= vipHeightRange[1]));
  filteredVipModels = ms;
  renderVipGrid(ms);
}

function renderVipGrid(ms) {
  const grid = document.getElementById('vipUnlocked');
  const cnt = document.getElementById('vipResultsCount');
  if (!grid) return;
  grid.innerHTML = ms.length
    ? ms.map(m => modelCardHTML(m)).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--text-soft);padding:2rem 0">${allVipModels.length ? 'No VIP companions match these filters.' : 'New VIP companions are being added — check back soon.'}</p>`;
  if (cnt) cnt.textContent = `Showing ${ms.length} VIP companion${ms.length === 1 ? '' : 's'}`;
}

function vipSetCat(el, cat) {
  document.querySelectorAll('#vipCatChips .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  vipActiveCat = cat;
  vipApplyFilters();
}

function buildVipCityList() {
  const el = document.getElementById('vipCityList');
  if (!el) return;
  const cities = Array.from(new Set(allVipModels.map(m => m.city).filter(Boolean))).sort();
  el.innerHTML = cities.map(c => `
    <label class="filter-check">
      <input type="checkbox" value="${c}" onchange="toggleVipCity('${c}',this.checked)"> ${c}
    </label>`).join('');
}
function filterVipCities(q) {
  document.querySelectorAll('#vipCityList .filter-check').forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function toggleVipCity(c, checked) {
  if (checked) vipSelectedCities.push(c);
  else vipSelectedCities = vipSelectedCities.filter(x => x !== c);
  vipApplyFilters();
}

function buildVipNatList() {
  const el = document.getElementById('vipNatList');
  if (!el) return;
  const nats = Array.from(new Set(allVipModels.map(m => m.nationality).filter(Boolean))).sort();
  el.innerHTML = nats.map(n => `
    <label class="filter-check">
      <input type="checkbox" value="${n}" onchange="toggleVipNat('${n}',this.checked)"> ${n}
    </label>`).join('');
}
function filterVipNat(q) {
  document.querySelectorAll('#vipNatList .filter-check').forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function toggleVipNat(n, checked) {
  if (checked) vipSelectedNats.push(n);
  else vipSelectedNats = vipSelectedNats.filter(x => x !== n);
  vipApplyFilters();
}

function buildVipSvcList() {
  const el = document.getElementById('vipSvcList');
  if (!el) return;
  const svcs = Array.from(new Set(allVipModels.flatMap(m => m.svcs || []))).sort();
  el.innerHTML = svcs.map(s => `
    <label class="filter-check">
      <input type="checkbox" value="${s}" onchange="toggleVipSvc('${s}',this.checked)"> ${s}
    </label>`).join('');
}
function filterVipSvc(q) {
  document.querySelectorAll('#vipSvcList .filter-check').forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function toggleVipSvc(s, checked) {
  if (checked) vipSelectedSvcs.push(s);
  else vipSelectedSvcs = vipSelectedSvcs.filter(x => x !== s);
  vipApplyFilters();
}

function updateVipRange(type) {
  const cap = type.charAt(0).toUpperCase() + type.slice(1);
  const minEl = document.getElementById('vip' + cap + 'Min');
  const maxEl = document.getElementById('vip' + cap + 'Max');
  if (!minEl || !maxEl) return;
  const min = +minEl.value;
  const max = +maxEl.value;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  if (type === 'age') { vipAgeRange = [lo, hi]; }
  if (type === 'weight') { vipWeightRange = [lo, hi]; }
  if (type === 'height') { vipHeightRange = [lo, hi]; }
  const valsEl = document.getElementById('vip' + cap + 'Vals');
  if (valsEl) valsEl.textContent = lo + ' – ' + hi;
  const fill = document.getElementById('vip' + cap + 'Fill');
  if (fill) {
    const bounds = {age: [18, 60], weight: [40, 100], height: [150, 185]}[type];
    const range = bounds[1] - bounds[0];
    const left = ((lo - bounds[0]) / range) * 100;
    const right = ((hi - bounds[0]) / range) * 100;
    fill.style.left = left + '%';
    fill.style.width = (right - left) + '%';
  }
  vipApplyFilters();
}

function sortVipModels(val) {
  let ms = [...filteredVipModels];
  if (val === 'price-asc' || val === 'price-desc') {
    const withPrice = ms.filter(m => startPrice(m) !== null);
    const withoutPrice = ms.filter(m => startPrice(m) === null);
    withPrice.sort((a, b) => val === 'price-asc' ? startPrice(a) - startPrice(b) : startPrice(b) - startPrice(a));
    ms = [...withPrice, ...withoutPrice];
  } else if (val === 'age-asc') ms.sort((a, b) => a.age - b.age);
  else if (val === 'name') ms.sort((a, b) => a.name.localeCompare(b.name));
  renderVipGrid(ms);
}

function clearVipFilters() {
  vipActiveCat = 'all'; vipSelectedCities = []; vipSelectedNats = []; vipSelectedSvcs = [];
  vipAgeRange = [18, 60]; vipWeightRange = [40, 100]; vipHeightRange = [150, 185];
  document.querySelectorAll('#vipCatChips .filter-chip').forEach((c, i) => c.classList.toggle('active', i === 0));
  document.querySelectorAll('#filtersSidebar .filter-check input').forEach(cb => cb.checked = false);
  const bounds = {age: [18, 60], weight: [40, 100], height: [150, 185]};
  Object.keys(bounds).forEach(type => {
    const cap = type.charAt(0).toUpperCase() + type.slice(1);
    const minEl = document.getElementById('vip' + cap + 'Min'); if (minEl) minEl.value = bounds[type][0];
    const maxEl = document.getElementById('vip' + cap + 'Max'); if (maxEl) maxEl.value = bounds[type][1];
  });
  ['age', 'weight', 'height'].forEach(t => updateVipRange(t));
  vipApplyFilters();
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
  document.getElementById('vipUnlockedWrap').style.display = state === 'unlocked' ? 'grid' : 'none';
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
