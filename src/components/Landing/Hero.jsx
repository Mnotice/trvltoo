import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../../assets/hero.png';

export default function Hero({ onStartPlanning }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-teal-400">
              AI-Powered Travel Planning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-white"
          >
            You save<br />
            the spots.<br />
            <span className="text-teal-400">We'll handle</span><br />
            the rest.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 leading-relaxed max-w-md"
          >
            Turn your saved travel ideas — from Instagram, TikTok, Google Maps, or anywhere — into a real day-by-day itinerary in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartPlanning}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-teal-500 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-teal-500/25 hover:bg-teal-400 transition-colors"
            >
              Start Planning <ArrowRight className="w-4 h-4" />
            </motion.button>
            <Link
              to="/plan"
              className="flex items-center gap-3 px-8 py-4 rounded-full border-2 border-white/15 text-white/70 font-black text-[12px] uppercase tracking-[0.2em] hover:border-white/40 hover:text-white transition-all"
            >
              Try Day Planner
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-6 pt-2"
          >
            {[['12+', 'Destinations'], ['10k+', 'Itineraries built'], ['Free', 'Always free']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{val}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-teal-500/20 to-indigo-500/10 blur-2xl scale-105" />
          <img
            src={heroImg}
            alt="TRVLTOO app preview"
            className="relative rounded-[3rem] w-full object-cover shadow-2xl border border-white/10"
          />
          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 px-5 py-3 rounded-2xl bg-slate-900 border border-white/10 shadow-xl"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">AI Generated</p>
            <p className="text-sm font-black text-white mt-0.5">Bangkok · 3 Days</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-6 -right-6 px-5 py-3 rounded-2xl bg-teal-500 shadow-xl shadow-teal-500/30"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Spots Saved</p>
            <p className="text-sm font-black text-white mt-0.5">12 places ready</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
