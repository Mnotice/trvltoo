import { motion } from 'framer-motion';
import { MapPin, Trash2, ExternalLink } from 'lucide-react';

const CATEGORY_STYLES = {
  food:       { emoji: '🍜', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  attraction: { emoji: '🏛️', color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20' },
  nature:     { emoji: '🌿', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  hotel:      { emoji: '🛏️', color: 'text-sky-400',     bg: 'bg-sky-500/10 border-sky-500/20' },
  shopping:   { emoji: '🛍️', color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
  nightlife:  { emoji: '🌙', color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
  experience: { emoji: '✨', color: 'text-teal-400',    bg: 'bg-teal-500/10 border-teal-500/20' },
  other:      { emoji: '📍', color: 'text-white/40',    bg: 'bg-white/5 border-white/10' },
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80',
  'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&q=80',
];

export default function SpotCard({ spot, index = 0, onDelete }) {
  const style = CATEGORY_STYLES[spot.category] ?? CATEGORY_STYLES.other;
  const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
    >
      {/* Image */}
      <div className="h-36 overflow-hidden">
        <img
          src={spot.imageUrl || fallback}
          alt={spot.name}
          onError={e => { e.target.src = fallback; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
      </div>

      {/* Delete button */}
      {onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => onDelete(spot.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:border-red-500/40"
          aria-label="Delete spot"
        >
          <Trash2 className="w-3.5 h-3.5 text-white/60" />
        </motion.button>
      )}

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${style.bg} ${style.color}`}>
          <span>{style.emoji}</span>
          {spot.category}
        </div>
        <h3 className="text-sm font-black italic uppercase tracking-tight text-white leading-tight line-clamp-2">
          {spot.name}
        </h3>
        {spot.address && (
          <p className="text-[11px] text-white/40 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{spot.address}</span>
          </p>
        )}
        {spot.notes && (
          <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 pt-0.5">
            {spot.notes}
          </p>
        )}
      </div>
    </motion.div>
  );
}
