import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, Check, X } from 'lucide-react';
import { FREE_TRIP_LIMIT } from '../hooks/usePlan';

const PRO_PERKS = [
  'Unlimited trips',
  'Unlimited AI regenerations',
  'PDF export',
  'Priority generation',
  'Early access to new features',
];

export default function ProGate({ onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: 'spring', damping: 22 }}
          className="w-full max-w-sm rounded-[2rem] bg-slate-900 border border-white/10 p-8 space-y-7 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">Free plan limit</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-tight">
              You've used all {FREE_TRIP_LIMIT} free trips
            </h2>
            <p className="text-sm text-white/40 leading-relaxed">
              Upgrade to Pro for unlimited trips and AI regenerations.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-2.5">
            {PRO_PERKS.map(perk => (
              <li key={perk} className="flex items-center gap-2.5 text-[12px] text-white/70">
                <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/upgrade')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 hover:opacity-90 transition-opacity"
            >
              <Crown className="w-4 h-4" /> Upgrade to Pro
            </motion.button>
            {onClose && (
              <button onClick={onClose}
                className="w-full py-2.5 text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white/50 transition-colors">
                Maybe later
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
