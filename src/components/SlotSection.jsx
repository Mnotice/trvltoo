import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import ItineraryCard from './ItineraryCard';
import { SLOT_TIMES } from '../data/ui';

export default function SlotSection({ label, color, activity, isLocked, onToggleLock, onReroll, canReroll, slot }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${color}`}>{label}</span>
          <div className="h-px w-12 bg-white/10" />
          <span className="text-[9px] text-white/30 uppercase tracking-widest">{SLOT_TIMES[slot]}</span>
        </div>
        <motion.button
          whileTap={{ rotate: 180, scale: 0.9 }}
          onClick={onReroll}
          disabled={isLocked || !canReroll}
          title={isLocked ? 'Unlock to re-roll' : 'Re-roll activity'}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Dices className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {activity ? (
        <ItineraryCard activity={activity} isLocked={isLocked} onToggleLock={onToggleLock} slot={slot} />
      ) : (
        <div className="h-52 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">No activities found</span>
        </div>
      )}
    </div>
  );
}
