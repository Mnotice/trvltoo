import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function toKey(d) { return d.toISOString().split('T')[0]; }
function fromKey(k) { return new Date(k + 'T00:00:00'); }

export default function DateRangePicker({ startDate, endDate, onChange, maxNights = 21 }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovering, setHovering]   = useState(null);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay  = new Date(viewYear, viewMonth + 1, 0);
  const offset   = firstDay.getDay(); // 0 = Sunday
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(viewYear, viewMonth, d));

  function handleDayClick(day) {
    if (day < today) return;
    const k = toKey(day);
    if (!startDate || (startDate && endDate)) {
      onChange({ startDate: k, endDate: null });
    } else {
      if (k <= startDate) {
        onChange({ startDate: k, endDate: null });
      } else {
        const nights = Math.round((day - fromKey(startDate)) / 86400000);
        if (nights > maxNights) {
          const maxEnd = new Date(fromKey(startDate));
          maxEnd.setDate(maxEnd.getDate() + maxNights);
          onChange({ startDate, endDate: toKey(maxEnd) });
        } else {
          onChange({ startDate, endDate: k });
        }
      }
    }
  }

  function isInRange(day) {
    if (!day) return false;
    const k = toKey(day);
    const rangeEnd = endDate || hovering;
    if (!startDate || !rangeEnd) return false;
    return k > startDate && k < rangeEnd;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const nights = startDate && endDate
    ? Math.round((fromKey(endDate) - fromKey(startDate)) / 86400000)
    : null;

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        <p className="text-sm font-black uppercase tracking-widest text-white">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map(n => (
          <div key={n} className="text-center text-[10px] font-black uppercase tracking-widest text-white/25 py-1">{n}</div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const k        = toKey(day);
          const isPast   = day < today;
          const isStart  = k === startDate;
          const isEnd    = k === endDate;
          const inRange  = isInRange(day);
          const isHover  = k === hovering && startDate && !endDate;

          return (
            <motion.button
              key={k}
              whileTap={!isPast ? { scale: 0.9 } : undefined}
              onClick={() => !isPast && handleDayClick(day)}
              onMouseEnter={() => startDate && !endDate && setHovering(k)}
              onMouseLeave={() => setHovering(null)}
              className={`relative h-9 rounded-xl text-[12px] font-bold transition-all select-none ${
                isPast        ? 'text-white/15 cursor-not-allowed' :
                isStart || isEnd ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 font-black' :
                inRange       ? 'bg-teal-500/20 text-teal-300' :
                isHover       ? 'bg-white/10 text-white' :
                'text-white/70 hover:bg-white/10'
              }`}
            >
              {day.getDate()}
            </motion.button>
          );
        })}
      </div>

      {/* Summary */}
      {startDate && (
        <div className="pt-2 text-center space-y-0.5">
          {endDate ? (
            <>
              <p className="text-[11px] font-black uppercase tracking-widest text-teal-400">
                {nights} night{nights !== 1 ? 's' : ''}
              </p>
              <p className="text-[10px] text-white/40 font-medium">
                {fromKey(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' → '}
                {fromKey(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </>
          ) : (
            <p className="text-[11px] text-white/40 font-medium">Now pick your checkout date</p>
          )}
        </div>
      )}
    </div>
  );
}
