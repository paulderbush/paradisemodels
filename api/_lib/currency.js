'use strict';
// Server-side mirror of assets/currency.js's region → currency mapping and
// round-up-to-10 rule, so the Stripe charge always matches what the visitor
// was shown on the page. Deliberately independent of the client: the amount
// charged must never be trusted from the browser, so this re-derives it from
// Vercel's own geo header rather than accepting a client-supplied figure.

// EU-27 (the same "Europe" definition used for pricing elsewhere would be
// continent-based via a geo API's continent_code; Vercel only gives us the
// two-letter country, so enumerate the eurozone/EU membership explicitly).
const EU_COUNTRY_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE'
]);

function pickCurrency(countryCode) {
  if (countryCode === 'AE') return 'AED';
  if (countryCode === 'GB') return 'GBP';
  if (countryCode === 'US') return 'USD';
  if (EU_COUNTRY_CODES.has(countryCode)) return 'EUR';
  return 'USD';
}

async function convertGbpToVisitorCurrency(gbpAmount, countryCode) {
  const code = pickCurrency(countryCode);
  if (code === 'GBP') return {code: 'GBP', amount: gbpAmount};
  const res = await fetch('https://open.er-api.com/v6/latest/GBP', {signal: AbortSignal.timeout(4000)});
  const data = await res.json();
  const rate = data && data.rates && data.rates[code];
  if (!rate) throw new Error('no rate for ' + code);
  const amount = Math.ceil((gbpAmount * rate) / 10) * 10;
  return {code, amount};
}

module.exports = {pickCurrency, convertGbpToVisitorCurrency};
