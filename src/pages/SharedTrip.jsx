import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Compass } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { THAILAND_PLACEHOLDERS } from '../apiService';

const SLOT_TIMES = {
  Morning: '07:00 – 10:00',
  Afternoon: '13:00 – 16:00',
  Evening: '19:00 – 22:00',
};

const SLOT_COLORS = {
  Morning: 'text-amber-400',
  Afternoon: 'text-sky-400',
  Evening: 'text-indigo-400',
};

const ReadOnlyCard = ({ activity, slot, index }) => {
  if (!activity) return (
    <div className="h-48 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">No activity</span>
    </div>
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={activity.image || THAILAND_PLACEHOLDERS[0]}
          alt={activity.title}
          onError={e => { e.target.src = THAILAND_PLACEHOLDERS[index % THAILAND_PLACEHOLDERS.length]; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{SLOT_TIMES[slot]}</span>
        </div>
      </div>
      <div className="p-5 space-y-1.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-teal-400">{activity.category}</span>
        <h4 className="text-lg font-black italic tracking-tighter uppercase text-white leading-tight">{activity.title}</h4>
        <p className="text-[11px] text-white/50 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />{activity.subtitle}
        </p>
        {(activity.duration || activity.cost) && (
          <div className="flex items-center gap-3 pt-1">
            {activity.duration && <span className="flex items-center gap-1 text-[10px] text-white/40"><Clock className="w-3 h-3" />{activity.duration}</span>}
            {activity.cost && <span className="text-[10px] text-teal-400/80">{activity.cost}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function SharedTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    getDoc(doc(db, 'trips', id)).then(snap => {
      if (!snap.exists()) { setNotFound(true); }
      else { setTrip({ id: snap.id, ...snap.data() }); }
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
        <Compass className="w-12 h-12 text-teal-500" />
      </motion.div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-4xl font-black italic uppercase text-white/40 tracking-tighter">Trip not found</h1>
      <Link to="/" className="px-10 py-4 rounded-full bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all">
        Plan Your Own Trip
      </Link>
    </div>
  );

  const slots = trip.slots || {};
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-10">

        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 rotate-180" /> trvltoo
          </Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-500">Shared Itinerary</span>
        </header>

        {/* Title */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-teal-500 mb-3">Your Itinerary</p>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.85]">{trip.destination}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {[trip.arrivalDate, trip.persona, trip.budget].map(tag => tag && (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">{tag}</span>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        {trip.insight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-teal-500/10 border border-teal-500/20"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-3">Agent Insight</p>
            <p className="text-white/80 text-base leading-relaxed italic">{trip.insight}</p>
          </motion.div>
        )}

        {/* Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {['Morning', 'Afternoon', 'Evening'].map((slot, i) => (
            <div key={slot} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${SLOT_COLORS[slot]}`}>
                  {String(i + 1).padStart(2, '0')}. {slot}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <ReadOnlyCard activity={slots[slot]} slot={slot} index={i} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">Powered by</p>
            <p className="text-xl font-black italic uppercase tracking-tighter text-white/60">TRVLTOO</p>
          </div>
          <Link
            to={`/?destination=${encodeURIComponent(trip.destination)}`}
            className="px-12 py-5 rounded-full bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-2xl"
          >
            Plan My Own Trip to {trip.destination} →
          </Link>
        </div>

      </div>
    </div>
  );
}
