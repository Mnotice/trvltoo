import { AnimatePresence } from 'framer-motion';
import SpotCard from './SpotCard';

export default function SpotGrid({ spots, onDelete }) {
  if (!spots.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
        <p className="text-5xl">📍</p>
        <p className="text-lg font-black italic uppercase tracking-tight text-white/20">No spots yet</p>
        <p className="text-sm text-white/30 max-w-xs">
          Hit the button above to save your first place — restaurants, temples, beaches, anything.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {spots.map((spot, i) => (
          <SpotCard key={spot.id} spot={spot} index={i} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}
