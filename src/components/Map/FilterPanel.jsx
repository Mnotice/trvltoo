import { motion } from 'framer-motion';

const FILTERS = [
  { id: 'all',        label: 'All',        emoji: '🗺️' },
  { id: 'food',       label: 'Food',       emoji: '🍜' },
  { id: 'attraction', label: 'Attraction', emoji: '🏛️' },
  { id: 'nature',     label: 'Nature',     emoji: '🌿' },
  { id: 'hotel',      label: 'Stay',       emoji: '🛏️' },
  { id: 'shopping',   label: 'Shopping',   emoji: '🛍️' },
  { id: 'nightlife',  label: 'Nightlife',  emoji: '🌙' },
  { id: 'experience', label: 'Experience', emoji: '✨' },
];

export default function FilterPanel({ active, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(f => {
        const count = f.id === 'all' ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[f.id] ?? 0);
        return (
          <motion.button
            key={f.id}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(f.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
              active === f.id
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white/5 border border-white/10 text-white/50 hover:border-teal-500/30'
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
            <span className={`opacity-60 ${active === f.id ? 'text-white' : 'text-white/30'}`}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
