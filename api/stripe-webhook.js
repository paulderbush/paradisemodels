'use strict';
const Stripe = require('stripe');
const {upsertVipAccess} = require('./_lib/supabaseAdmin');

// Stripe signs the raw request body, so it must reach this handler
// unparsed — Vercel's default JSON body parsing would rewrite whitespace
// and break the signature check.
module.exports.config = {api: {bodyParser: false}};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('stripe-webhook: STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).end('Not configured');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('stripe-webhook: signature verification failed:', e.message);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id || (session.metadata && session.metadata.supabase_user_id);

    if (!userId) {
      console.error('stripe-webhook: checkout.session.completed with no supabase user id', session.id);
      // Acknowledge anyway — retrying won't produce a user id either, and
      // Stripe will keep resending an event we 4xx/5xx on.
      return res.status(200).json({received: true, warning: 'no user id on session'});
    }

    try {
      await upsertVipAccess({
        user_id: userId,
        paid: true,
        stripe_session_id: session.id,
        currency: session.currency,
        amount: session.amount_total,
        paid_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('stripe-webhook: failed to record VIP access:', e.message);
      // 500 so Stripe retries — the payment succeeded, we just failed to
      // record it, and that must not be silently dropped.
      return res.status(500).json({error: 'Failed to record access'});
    }
  }

  return res.status(200).json({received: true});
};
