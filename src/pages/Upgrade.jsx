import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { usePlan, FREE_TRIP_LIMIT } from '../hooks/usePlan';
import AuthModal from '../components/AuthModal';
import LandingNav from '../components/Landing/LandingNav';

const FREE_FEATURES  = [`${FREE_TRIP_LIMIT} trips`, 'AI itinerary generation', 'Spot collection & URL parser', 'Invite collaborators', 'Markdown & JSON export'];
const PRO_FEATURES   = ['Unlimited trips', 'Unlimited AI regenerations', 'PDF export', 'Priority generation speed', 'Early access to new features'];

export default function Upgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const { isPro } = usePlan(user?.uid);
  const [searchParams] = useSearchParams();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [verifying,       setVerifying]       = useState(false);
  const [upgraded,        setUpgraded]        = useState(false);
  const [error,           setError]           = useState('');

  const sessionId = searchParams.get('session_id');

  // Verify completed Stripe checkout and activate Pro
  useEffect(() => {
    if (!sessionId || !user || upgraded) return;
    setVerifying(true);
    fetch(`/api/verify-checkout?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(async ({ paid, userId }) => {
        if (paid && userId === user.uid) {
          await updateDoc(doc(db, 'users', user.uid), { plan: 'pro' });
          setUpgraded(true);
        } else {
          setError('Payment could not be verified. Contact support if you were charged.');
        }
      })
      .catch(() => setError('Verification failed. Contact support if you were charged.'))
      .finally(() => setVerifying(false));
  }, [sessionId, user, upgraded]);

  async function handleUpgrade() {
    if (!user) return;
    setCheckoutLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: user.uid, email: user.email }),
      });
      const { url, error: err } = await res.json();
      if (err) throw new Error(err);
      window.location.href = url;
    } catch (e) {
      setError(e.message || 'Could not start checkout. Try again.');
      setCheckoutLoading(false);
    }
  }

  // Already Pro or just upgraded
  if (isPro || upgraded) return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }}
          className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Crown className="w-9 h-9 text-white" />
        </motion.div>
        <div className="space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">
            {upgraded ? 'Welcome to Pro!' : 'You\'re on Pro'}
          </p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Unlimited everything.</h1>
          <p className="text-white/40 text-sm">Plan as many trips as you want with no limits.</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-teal-400 transition-colors">
          Go to My Trips <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );

  // Verifying payment
  if (verifying) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
      <span className="text-white/50 text-sm font-medium">Verifying payment…</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />
      <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} />}</AnimatePresence>
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 space-y-14">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-black uppercase tracking-widest text-amber-400">
            <Crown className="w-3.5 h-3.5" /> Simple pricing
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Unlock unlimited travel
          </h1>
          <p className="text-white/40 max-w-md mx-auto">One plan. No surprises.</p>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

          {/* Free */}
          <div className="p-7 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Free</p>
              <p className="text-4xl font-black text-white">$0</p>
              <p className="text-[12px] text-white/30">forever</p>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[12px] text-white/50">
                  <Check className="w-3.5 h-3.5 text-white/25 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <div className="pt-2 py-3 rounded-2xl border border-white/10 text-center text-[11px] font-black uppercase tracking-wider text-white/25">
              Current plan
            </div>
          </div>

          {/* Pro */}
          <div className="relative p-7 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 space-y-6 shadow-2xl shadow-amber-500/10">
            <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest text-amber-400">
              Popular
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400">Pro</p>
              <div className="flex items-end gap-1.5">
                <p className="text-4xl font-black text-white">$9</p>
                <p className="text-[12px] text-white/40 mb-1.5">/ month</p>
              </div>
              <p className="text-[12px] text-white/30">cancel anytime</p>
            </div>
            <ul className="space-y-3">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[12px] text-white/80">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />{f}
                </li>
              ))}
            </ul>

            {error && <p className="text-[11px] text-red-400">{error}</p>}

            {!user ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowAuth(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20">
                Sign in to upgrade
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleUpgrade} disabled={checkoutLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 disabled:opacity-60 hover:opacity-90 transition-opacity">
                {checkoutLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting…</>
                  : <><Sparkles className="w-4 h-4" /> Upgrade to Pro</>
                }
              </motion.button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-white/20">
          Payments powered by Stripe · Secure · Cancel anytime
        </p>
      </main>
    </div>
  );
}
