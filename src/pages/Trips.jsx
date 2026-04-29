import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LogIn, Loader2, CalendarDays, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import LandingNav from '../components/Landing/LandingNav';

function formatDateRange(start, end) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end   + 'T00:00:00');
  const nights = Math.round((e - s) / 86400000);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(s)} → ${fmt(e)} · ${nights} night${nights !== 1 ? 's' : ''}`;
}

export default function Trips() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { trips, loading: tripsLoading, deleteTrip } = useTrips(user?.uid);

  if (authLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500">My Trips</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
              {user ? `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned` : 'Your trips'}
            </h1>
          </div>
          {user && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/trips/new')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors">
              <Plus className="w-4 h-4" /> New Trip
            </motion.button>
          )}
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-6 text-center">
            <p className="text-6xl">✈️</p>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase tracking-tighter">Sign in to see your trips</p>
              <p className="text-sm text-white/40 max-w-sm">Plan multi-day trips, organise your saved spots, and generate AI itineraries.</p>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={signInWithGoogle}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/90 transition-colors shadow-xl">
              <LogIn className="w-4 h-4" /> Continue with Google
            </motion.button>
          </div>
        ) : tripsLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-teal-400 animate-spin" /></div>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
            <p className="text-6xl">✈️</p>
            <p className="text-xl font-black italic uppercase tracking-tight text-white/20">No trips yet</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/trips/new')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors">
              <Plus className="w-4 h-4" /> Plan your first trip
            </motion.button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip, i) => (
              <motion.div key={trip.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all cursor-pointer space-y-4"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                {/* Destination */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-3xl">{trip.destination?.emoji}</span>
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-tight">
                      {trip.name}
                    </h3>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteTrip(trip.id); }}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/40" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-white/40 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 flex-shrink-0 text-teal-500" />
                    {trip.destination?.city}, {trip.destination?.country}
                  </p>
                  {trip.startDate && trip.endDate && (
                    <p className="text-[11px] text-white/40 flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 flex-shrink-0 text-teal-500" />
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    trip.itinerary ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-white/5 text-white/30 border border-white/10'
                  }`}>
                    {trip.itinerary ? 'Itinerary ready' : `${trip.spotIds?.length || 0} spots`}
                  </span>
                  <span className="text-[11px] font-black text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
