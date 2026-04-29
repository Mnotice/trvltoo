import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WeatherTimeline({ hourly }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!hourly || hourly.length === 0) return null;

  const max = Math.max(...hourly);
  const min = Math.min(...hourly);
  const range = max - min || 1;
  const width = 800;
  const chartH = 100;
  const labelH = 28;
  const totalH = chartH + labelH;
  const padding = 40;

  const points = hourly.map((temp, i) => ({
    x: (i / (hourly.length - 1)) * (width - padding * 2) + padding,
    y: chartH - padding - ((temp - min) / range) * (chartH - padding * 2),
    temp,
    hour: i + 6,
  }));

  const pathData = points.reduce(
    (acc, p, i) => i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`,
    ''
  );

  const timeLabels = [
    { hour: 6, label: '6am' }, { hour: 9, label: '9am' }, { hour: 12, label: '12pm' },
    { hour: 15, label: '3pm' }, { hour: 18, label: '6pm' }, { hour: 21, label: '9pm' },
  ].map(({ hour, label }) => ({ label, x: points[hour - 6]?.x ?? 0 }));

  return (
    <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden relative mb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-1">Atmosphere Pulse</h4>
          <p className="text-3xl font-black italic tracking-tighter uppercase text-white">
            {hoverIndex !== null ? `${points[hoverIndex].temp}°C` : `${max}°C Peak`}
          </p>
        </div>
        <div className="text-right text-[10px] font-black uppercase tracking-widest text-white/50">
          {hoverIndex !== null ? `${points[hoverIndex].hour}:00` : 'Today'}
        </div>
      </div>

      <div className="relative group">
        <svg viewBox={`0 0 ${width} ${totalH}`} className="w-full overflow-visible" style={{ height: '7rem' }}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#g)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          {timeLabels.map(({ label, x }) => (
            <text
              key={label}
              x={x}
              y={totalH - 4}
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              letterSpacing="2"
              fill="rgba(255,255,255,0.25)"
              fontFamily="sans-serif"
              style={{ textTransform: 'uppercase' }}
            >
              {label}
            </text>
          ))}
          {points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
              <rect x={p.x - 15} y="0" width="30" height={chartH} fill="transparent" />
              {hoverIndex === i && (
                <>
                  <circle cx={p.x} cy={p.y} r="6" fill="#14b8a6" />
                  <line x1={p.x} y1={p.y + 10} x2={p.x} y2={chartH} stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 4" />
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
