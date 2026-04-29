import { motion } from 'framer-motion';
import { CheckCircle, MapPin } from 'lucide-react';

const CATEGORY_EMOJI = {
  food: '🍜', attraction: '🏛️', nature: '🌿', hotel: '🛏️',
  shopping: '🛍️', nightlife: '🌙', experience: '✨', other: '📍',
};

const FALLBACK = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&q=70';

export default function SpotSelector({ spots, selected, onToggle }) {
  if (!spots.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <p className="text-4xl">📍</p>
        <p className="text-sm font-black italic uppercase tracking-tight text-white/30">No spots saved yet</p>
        <p className="text-xs text-white/20 max-w-xs">
          Go to My Spots to save places first, then come back to build your trip.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 no-scrollbar">
      {spots.map(spot => {
        const isSelected = selected.includes(spot.id);
        return (
          <motion.button
            key={spot.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(spot.id)}
            className={`relative rounded-2xl overflow-hidden text-left transition-all border-2 ${
              isSelected ? 'border-teal-500 shadow-lg shadow-teal-500/20' : 'border-white/5 hover:border-white/20'
            }`}
          >
            {/* Image */}
            <div className="h-20 overflow-hidden">
              <img
                src={spot.imageUrl || FALLBACK}
                alt={spot.name}
                onError={e => { e.target.src = FALLBACK; }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>

            {/* Check badge */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Content */}
            <div className="p-2.5 bg-slate-900">
              <p className="text-[9px] font-black uppercase tracking-wider text-teal-400 mb-0.5">
                {CATEGORY_EMOJI[spot.category]} {spot.category}
              </p>
              <p className="text-[11px] font-black italic uppercase tracking-tight text-white leading-tight line-clamp-2">
                {spot.name}
              </p>
              {spot.address && (
                <p className="text-[9px] text-white/35 flex items-center gap-0.5 mt-0.5">
                  <MapPin className="w-2 h-2" /><span className="line-clamp-1">{spot.address}</span>
                </p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
