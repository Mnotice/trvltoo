import { motion } from 'framer-motion';
import { getDestinationAreas } from '../data/destinations';

export default function AreaSelector({ destination, selected, onSelect }) {
  const areas = getDestinationAreas(destination);
  if (!areas.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {areas.map(area => (
          <motion.button
            key={area}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(selected === area ? '' : area)}
            className={`px-5 py-3 rounded-[2rem] border-2 text-[11px] font-black uppercase tracking-widest transition-all ${
              selected === area
                ? 'border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                : 'border-slate-200 dark:border-white/20 bg-white dark:bg-white/10 text-slate-600 dark:text-white/60 hover:border-teal-400'
            }`}
          >
            {area}
          </motion.button>
        ))}
      </div>
      {selected && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-bold uppercase tracking-widest text-teal-500 opacity-70"
        >
          Activities near {selected} will be prioritised — re-roll anytime to explore further.
        </motion.p>
      )}
    </div>
  );
}
