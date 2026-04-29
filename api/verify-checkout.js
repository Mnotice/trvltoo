import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN ?? '');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id is required' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === 'paid' || session.status === 'complete';
    res.json({ paid, userId: session.metadata?.userId ?? null });
  } catch {
    res.status(400).json({ error: 'Invalid session' });
  }
}
