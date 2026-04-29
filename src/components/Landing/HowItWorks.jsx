import { motion } from 'framer-motion';
import { Bookmark, Sparkles, Share2 } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Bookmark,
    color: 'text-teal-400',
    ring: 'ring-teal-500/30',
    title: 'Save your spots',
    desc: 'As you scroll Instagram, TikTok, or Google Maps, save anything that catches your eye. Drop a link or upload a screenshot — we handle the rest.',
  },
  {
    num: '02',
    icon: Sparkles,
    color: 'text-indigo-400',
    ring: 'ring-indigo-500/30',
    title: 'Let AI plan your days',
    desc: 'Choose your trip dates and travel style. Claude AI clusters your spots geographically, adds meals, estimates timing, and builds a full itinerary.',
  },
  {
    num: '03',
    icon: Share2,
    color: 'text-amber-400',
    ring: 'ring-amber-500/30',
    title: 'Share & explore',
    desc: 'Export as PDF, share a live link with friends, or view everything on a map. Edit any day on the fly before you go.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative overflow-hidden">
      {/* Section divider line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white leading-none"
          >
            Three steps to your<br />
            <span className="text-teal-400">perfect trip.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-teal-500/40 via-indigo-500/40 to-amber-500/40" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center space-y-5 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className={`w-14 h-14 rounded-full bg-slate-950 ring-4 ${step.ring} flex items-center justify-center z-10`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${step.color} opacity-60`}>{step.num}</span>
              <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-tight">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
