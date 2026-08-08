'use strict';
const Stripe = require('stripe');
const {getUserFromAuthHeader} = require('./_lib/supabaseAdmin');
const {convertGbpToVisitorCurrency} = require('./_lib/currency');

const VIP_PRICE_GBP = 300;
const SITE_URL = process.env.SITE_URL || 'https://velvetescort.co.uk';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({error: 'Payments are not configured yet.'});
  }

  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user || !user.id) {
    return res.status(401).json({error: 'Sign in first.'});
  }

  // Vercel sets this automatically on every request at the edge — no
  // external geo lookup needed, and unlike a client-supplied currency code
  // it can't be spoofed to get a cheaper rate.
  const countryCode = req.headers['x-vercel-ip-country'] || '';

  let currency, amount;
  try {
    ({code: currency, amount} = await convertGbpToVisitorCurrency(VIP_PRICE_GBP, countryCode));
  } catch (e) {
    currency = 'GBP';
    amount = VIP_PRICE_GBP;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {supabase_user_id: user.id},
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amount * 100,
          product_data: {
            name: 'Paradise Models — VIP Catalog Access',
            description: 'One-time payment. Unlocks the VIP companion catalog for this account.'
          }
        },
        quantity: 1
      }],
      success_url: `${SITE_URL}/vip-models/?checkout=success`,
      cancel_url: `${SITE_URL}/vip-models/?checkout=cancelled`
    });
    return res.status(200).json({url: session.url});
  } catch (e) {
    console.error('create-checkout-session failed:', e);
    return res.status(500).json({error: 'Could not start checkout.'});
  }
};
