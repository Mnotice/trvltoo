import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PopupCalendar({ selected, minDate, onSelect, onClose }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initDate = selected && selected >= minDate
    ? new Date(selected + 'T00:00:00')
    : new Date(minDate + 'T00:00:00');

  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const toKey = (d) => d.toISOString().split('T')[0];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-sm font-black uppercase tracking-widest text-white">{monthName}</span>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest opacity-30 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = new Date(viewYear, viewMonth, i + 1);
            const key = toKey(d);
            const isPast = key < minDate;
            const isSel = key === selected;
            const isToday = key === toKey(today);
            return (
              <motion.button
                key={key}
                whileHover={!isPast ? { scale: 1.15 } : {}}
                whileTap={!isPast ? { scale: 0.95 } : {}}
                disabled={isPast}
                onClick={() => !isPast && onSelect(key)}
                className={`aspect-square rounded-xl text-sm font-bold transition-all ${
                  isSel
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : isToday
                    ? 'border border-teal-500/50 text-teal-400'
                    : isPast
                    ? 'opacity-15 cursor-not-allowed'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                {i + 1}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/15 text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
