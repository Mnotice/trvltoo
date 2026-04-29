import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, MapPin, CalendarDays, DollarSign,
  ChevronDown, ChevronUp, Clock, Lightbulb, Sparkles,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CATEGORY_EMOJI = {
  food: '🍜', attraction: '🏛️', nature: '🌿', hotel: '🛏️',
  shopping: '🛍️', nightlife: '🌙', experience: '✨', other: '📍',
};
const COST_COLOR = { '$': 'text-emerald-400', '$$': 'text-amber-400', '$$$': 'text-rose-400' };

function fromKey(k) { return new Date(k + 'T00:00:00'); }
function formatDate(k) {
  return fromKey(k).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function ActivityRow({ act, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-l-2 border-white/10 pl-5 space-y-1 hover:border-teal-500/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[11px] font-black text-teal-400/70 w-12 shrink-0">{act.time}</span>
          <span className="text-sm font-black italic uppercase tracking-tight text-white truncate">
            {CATEGORY_EMOJI[act.category] ?? '📍'} {act.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {act.cost && <span className={`text-[10px] font-black ${COST_COLOR[act.cost] ?? 'text-white/30'}`}>{act.cost}</span>}
          {open ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 space-y-2">
              {act.description && <p className="text-[12px] text-white/50 leading-relaxed">{act.description}</p>}
              <div className="flex flex-wrap gap-3 text-[11px] text-white/35">
                {act.duration  && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}</span>}
                {act.transport && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{act.transport}</span>}
              </div>
              {act.tip && (
                <div className="flex items-start gap-2 mt-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-300/80">{act.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DayCard({ day, index }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden"
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">{day.day}</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400/70">{formatDate(day.date)}</p>
            <p className="text-base font-black italic uppercase tracking-tight text-white leading-tight">{day.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {day.dayBudget && (
            <span className="text-[11px] font-black text-white/30 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />~${day.dayBudget}
            </span>
          )}
          {collapsed ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronUp className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-6 pb-6 space-y-3">
              {day.daySummary && (
                <p className="text-[12px] text-white/40 italic border-l-2 border-teal-500/30 pl-3">{day.daySummary}</p>
              )}
              <div className="space-y-3 pt-1">
                {(day.activities ?? []).map((act, i) => (
                  <ActivityRow key={i} act={act} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SharedTrip() {
  const { id } = useParams();
  const [trip,     setTrip]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    getDoc(doc(db, 'trips', id))
      .then(snap => {
        if (!snap.exists() || !snap.data().isPublic) { setNotFound(true); }
        else { setTrip({ id: snap.id, ...snap.data() }); }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
        <Compass className="w-10 h-10 text-teal-500" />
      </motion.div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="text-5xl">🗺️</p>
      <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white/40">Trip not found</h1>
      <p className="text-sm text-white/25 max-w-xs">This link may have expired or the trip is no longer public.</p>
      <Link to="/" className="px-8 py-3 rounded-full bg-teal-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors">
        Plan Your Own Trip
      </Link>
    </div>
  );

  const { name, destination, startDate, endDate, itinerary } = trip;
  const nights = startDate && endDate
    ? Math.round((new Date(endDate + 'T00:00:00') - new Date(startDate + 'T00:00:00')) / 86400000)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors">
            ← TRVLTOO
          </Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-500">Shared Itinerary</span>
        </div>

        {/* Trip header */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-4xl">{destination?.emoji}</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">{name}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/40">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />{destination?.city}, {destination?.country}
            </span>
            {startDate && endDate && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/40">
                <CalendarDays className="w-3.5 h-3.5 text-teal-500" />
                {formatDate(startDate)} → {formatDate(endDate)} · {nights} night{nights !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {itinerary && (
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <p className="text-[11px] font-black uppercase tracking-wider text-teal-400">
                {itinerary.days?.length}-day itinerary · Generated by Claude
              </p>
            </div>
            {itinerary.totalBudget && (
              <p className="text-[11px] font-bold text-white/40 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />~${itinerary.totalBudget} est.
              </p>
            )}
          </div>
        )}

        {/* General tips */}
        {itinerary?.generalTips?.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">General Tips</p>
            <div className="flex flex-col gap-2">
              {itinerary.generalTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px] text-white/50">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />{tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day cards */}
        {itinerary?.days?.length > 0 && (
          <div className="space-y-4">
            {itinerary.days.map((day, i) => (
              <DayCard key={day.day} day={day} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 mb-1">Powered by</p>
            <p className="text-xl font-black italic uppercase tracking-tighter text-white/50">TRVLTOO</p>
          </div>
          <Link
            to={`/trips/new${destination?.city ? `?destination=${encodeURIComponent(destination.city)}` : ''}`}
            className="px-10 py-4 rounded-full bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-colors shadow-2xl"
          >
            Plan My Own Trip →
          </Link>
        </div>
      </main>
    </div>
  );
}
