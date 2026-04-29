import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Users, ArrowRight, LogIn } from 'lucide-react';
import { getInvite, acceptInvite, getTrip } from '../services/firestoreService';
import { useAuth } from '../hooks/useAuth';
import LandingNav from '../components/Landing/LandingNav';

export default function InvitePage() {
  const { token }   = useParams();
  const navigate    = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const [invite,  setInvite]  = useState(null);
  const [trip,    setTrip]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error,   setError]   = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token) { setExpired(true); setLoading(false); return; }
    getInvite(token)
      .then(async inv => {
        if (!inv) { setExpired(true); setLoading(false); return; }
        if (inv.expiresAt?.toDate?.() < new Date()) { setExpired(true); setLoading(false); return; }
        setInvite(inv);
        const t = await getTrip(inv.tripId);
        setTrip(t);
        setLoading(false);
      })
      .catch(() => { setExpired(true); setLoading(false); });
  }, [token]);

  async function handleAccept() {
    if (!user || !invite) return;
    setJoining(true);
    try {
      const tripId = await acceptInvite(token, user.uid);
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(err.message);
      setJoining(false);
    }
  }

  if (authLoading || loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
    </div>
  );

  if (expired) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 text-center px-6">
      <p className="text-5xl">🔗</p>
      <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white/40">Invite expired</h1>
      <p className="text-sm text-white/25 max-w-xs">This invite is no longer valid. Ask the trip owner to send a new link.</p>
      <Link to="/" className="px-8 py-3 rounded-full bg-teal-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors">
        Back to TRVLTOO
      </Link>
    </div>
  );

  const isOwner = user && trip?.createdBy === user.uid;
  const isAlreadyCollaborator = user && trip?.collaborators?.includes(user.uid);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />
      <main className="max-w-md mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center space-y-8">

        <div className="w-16 h-16 rounded-[1.5rem] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
          <Users className="w-8 h-8 text-teal-400" />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500">You're invited</p>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-tight">
            {trip?.destination?.emoji} {trip?.name ?? 'Join this trip'}
          </h1>
          {trip && (
            <p className="text-sm text-white/40">{trip.destination?.city}, {trip.destination?.country}</p>
          )}
        </div>

        {!user ? (
          <div className="w-full space-y-4">
            <p className="text-sm text-white/40">Sign in to join as a collaborator.</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/90 transition-colors shadow-xl">
              <LogIn className="w-4 h-4" /> Sign in with Google
            </motion.button>
          </div>
        ) : isOwner || isAlreadyCollaborator ? (
          <div className="w-full space-y-4">
            <p className="text-sm text-white/40">
              {isOwner ? "This is your own trip." : "You're already a collaborator."}
            </p>
            <Link to={`/trips/${invite.tripId}`}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-teal-400 transition-colors">
              Open Trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <p className="text-sm text-white/40">
              Joining as <span className="text-white/70 font-bold">{user.displayName}</span>
            </p>
            {error && <p className="text-[12px] text-red-400">{error}</p>}
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleAccept} disabled={joining}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-widest disabled:opacity-50 hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20">
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
              Join Trip
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
}
