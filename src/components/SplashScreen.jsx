import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_DESTINATIONS = ['Bangkok', 'Bali', 'Tokyo', 'Kyoto', 'Hanoi', 'Ho Chi Minh City', 'Singapore', 'Kuala Lumpur', 'Phuket', 'Chiang Mai', 'Seoul', 'Manila'];

export default function SplashScreen({ onComplete }) {
  const [destIndex, setDestIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => setDestIndex(i => (i + 1) % SPLASH_DESTINATIONS.length), 420);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onComplete, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center font-black text-xl mb-8 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          T
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="text-[clamp(3.5rem,12vw,7rem)] font-black italic tracking-[-0.05em] uppercase leading-none mb-4"
        >
          TRVLTOO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-[10px] font-black uppercase tracking-[0.45em] mb-10"
        >
          AI Travel Planner · 155+ Destinations
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="h-6 flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={destIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-teal-400 text-[11px] font-black uppercase tracking-[0.4em]"
            >
              {SPLASH_DESTINATIONS[destIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-teal-500 origin-left"
          style={{ scaleX: progress, transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  );
}
