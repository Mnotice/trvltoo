import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PopupCalendar from './PopupCalendar';

export default function ArrivalStrip({ selected, onSelect }) {
  const [calOpen, setCalOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quickDates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const toKey = (d) => d.toISOString().split('T')[0];
  const isQuick = quickDates.some(d => toKey(d) === selected);
  const calSelected = !isQuick && selected ? selected : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">02. Select Arrival</h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-6 gap-2">
        {quickDates.map((date, i) => {
          const key = toKey(date);
          const isSelected = selected === key;
          return (
            <motion.button
              key={i}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                  : 'border-white/15 bg-white/5 hover:border-teal-500/60'
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">
                {i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-xl font-black tracking-tight">{date.getDate()}</span>
              <span className="text-[9px] opacity-40 mt-0.5">
                {date.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCalOpen(true)}
        className={`w-full py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 ${
          calSelected
            ? 'border-teal-500 bg-teal-500/10 text-teal-400'
            : 'border-white/15 hover:border-teal-500/50 text-white/50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
          {calSelected
            ? new Date(calSelected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            : 'Pick a future date'}
        </span>
      </motion.button>

      <AnimatePresence>
        {calOpen && (
          <PopupCalendar
            selected={selected}
            minDate={toKey(new Date(today.getTime() + 6 * 86400000))}
            onSelect={(d) => { onSelect(d); setCalOpen(false); }}
            onClose={() => setCalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
