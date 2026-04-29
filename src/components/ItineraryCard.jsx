import { motion } from 'framer-motion';
import { MapPin, Clock, Lock, Star } from 'lucide-react';
import { SLOT_TIMES, CATEGORY_TIPS } from '../data/ui';
import { THAILAND_PLACEHOLDERS } from '../data/destinations';

export default function ItineraryCard({ activity, isLocked, onToggleLock, slot }) {
  return (
    <motion.div layout className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 group">
      <div className="h-52 overflow-hidden relative">
        <img
          src={activity.image || THAILAND_PLACEHOLDERS[0]}
          alt={activity.title}
          onError={e => {
            e.target.src = THAILAND_PLACEHOLDERS[Math.abs(activity.id?.charCodeAt(0) ?? 0) % THAILAND_PLACEHOLDERS.length];
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {slot && (
          <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{SLOT_TIMES[slot]}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onToggleLock(activity.id)}
        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm border transition-all ${
          isLocked
            ? 'bg-teal-500 border-teal-400 text-white shadow-lg shadow-teal-500/40'
            : 'bg-black/40 border-white/10 text-white/60 hover:bg-black/60 hover:text-white'
        }`}
      >
        {isLocked ? <Lock className="w-4 h-4" /> : <Star className="w-4 h-4" />}
      </button>

      <div className="p-6 space-y-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-teal-400">{activity.category}</span>
        <h4 className="text-xl font-black italic tracking-tighter uppercase text-white leading-tight">{activity.title}</h4>
        <p className="text-[11px] text-white/50 font-medium uppercase tracking-wide flex items-center gap-1.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />{activity.subtitle}
        </p>
        {(activity.duration || activity.cost) && (
          <div className="flex items-center gap-3 pt-1">
            {activity.duration && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                <Clock className="w-3 h-3" />{activity.duration}
              </span>
            )}
            {activity.cost && (
              <span className="text-[10px] font-bold text-teal-400/80">{activity.cost}</span>
            )}
          </div>
        )}
        {(activity.tip || CATEGORY_TIPS[activity.category]) && (
          <p className="text-[11px] text-white/40 leading-relaxed border-t border-white/8 pt-3 mt-1">
            {activity.tip || CATEGORY_TIPS[activity.category]}
          </p>
        )}
      </div>
    </motion.div>
  );
}
