'use strict';
// Serves actual VIP model data (photos, bio, rates — everything a paying
// member sees) — the one place that data exists outside the repo itself.
// Unlike the rest of the site, none of this is baked into static HTML/JS:
// the build never embeds vip:true models into any public page, so this
// endpoint is the only way to get it, and it only ever returns something
// after verifying payment server-side. A signed-in-but-unpaid caller (or
// no caller at all) gets a 401/403, not a redacted version of the data.
const {getUserFromAuthHeader, isVipPaid} = require('./_lib/supabaseAdmin');
const {MODELS} = require('../data/models.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed'});
  }

  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user || !user.id) {
    return res.status(401).json({error: 'Sign in first.'});
  }

  const paid = await isVipPaid(user.id);
  if (!paid) {
    return res.status(403).json({error: 'VIP access required.'});
  }

  const vipModels = MODELS.filter(m => m.vip === true);
  const slug = req.query && req.query.slug;

  if (slug) {
    const m = vipModels.find(x => x.slug === slug);
    if (!m) return res.status(404).json({error: 'Not found.'});
    return res.status(200).json({model: Object.assign({}, m, {reviews: []})});
  }

  return res.status(200).json({models: vipModels.map(m => Object.assign({}, m, {reviews: []}))});
};
