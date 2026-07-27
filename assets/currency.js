// =================== CURRENCY LOCALIZATION ===================
// All prices in data/models.js are entered in GBP. On load we detect the
// visitor's region and localize displayed prices: UAE -> AED, Europe -> EUR,
// US -> USD, everything else -> USD. Converted amounts are always rounded UP
// to the nearest 10 so they read as clean round figures (e.g. £500 -> €590,
// not €586). UK visitors keep native GBP, uncon­verted and unrounded — those
// are the exact prices as entered.
window.CUR = {code: 'GBP', symbol: '£', rate: 1};

const CURRENCY_CACHE_KEY = 'velvet_currency_v1';
const CURRENCY_CACHE_MS = 6 * 60 * 60 * 1000; // 6h

function _pickCurrency(geo) {
  const cc = geo && geo.country_code;
  if (cc === 'AE') return {code: 'AED', symbol: 'AED '};
  if (cc === 'GB') return {code: 'GBP', symbol: '£'};
  if (cc === 'US') return {code: 'USD', symbol: '$'};
  if (geo && geo.continent_code === 'EU') return {code: 'EUR', symbol: '€'};
  return {code: 'USD', symbol: '$'};
}

function fmtPrice(gbp) {
  // GBP is the source currency: show it exactly as entered. Everything else
  // is a converted figure, so round it up to the nearest 10 — an exact
  // conversion lands on odd amounts (€586, $668) that look like a glitch.
  const amount = window.CUR.code === 'GBP'
    ? gbp
    : Math.ceil((gbp * window.CUR.rate) / 10) * 10;
  return `${window.CUR.symbol}${amount.toLocaleString('en-US')}`;
}

window.CUR_READY = (async function() {
  try {
    const cached = JSON.parse(localStorage.getItem(CURRENCY_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.ts < CURRENCY_CACHE_MS) {
      window.CUR = cached.cur;
      return;
    }
    const geoRes = await fetch('https://ipwho.is/');
    const geo = await geoRes.json();
    const picked = _pickCurrency(geo && geo.success !== false ? geo : null);
    if (picked.code === 'GBP') {
      window.CUR = {code: 'GBP', symbol: '£', rate: 1};
    } else {
      const rateRes = await fetch('https://open.er-api.com/v6/latest/GBP');
      const rateData = await rateRes.json();
      const rate = rateData && rateData.rates && rateData.rates[picked.code];
      if (!rate) throw new Error('no rate for ' + picked.code);
      window.CUR = {code: picked.code, symbol: picked.symbol, rate};
    }
    localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify({cur: window.CUR, ts: Date.now()}));
  } catch(e) {
    window.CUR = {code: 'GBP', symbol: '£', rate: 1};
  }
})();
