import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN ?? '');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRO_PRICE_ID) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const { userId, email } = req.body ?? {};
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = process.env.ALLOWED_ORIGIN ?? 'https://trvltoo.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      metadata: { userId },
      success_url: `${origin}/upgrade?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/upgrade`,
    });
    res.json({ url: session.url });
  } catch {
    res.status(500).json({ error: 'Could not create checkout session' });
  }
}
