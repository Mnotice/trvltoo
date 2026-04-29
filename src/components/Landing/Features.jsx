import { motion } from 'framer-motion';
import { Bookmark, Sparkles, Map, LayoutList, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Bookmark,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Save spots from anywhere',
    desc: 'Drop a Google Maps link, paste an Instagram reel URL, upload a screenshot — we extract the location automatically.',
  },
  {
    icon: Sparkles,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'AI builds your itinerary',
    desc: 'Claude AI optimizes your route, allocates time, suggests meals, and generates a full day-by-day plan around your spots.',
  },
  {
    icon: Map,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'See everything on a map',
    desc: 'All your saved spots shown on a live interactive map. Filter by category, zoom in on a neighborhood, draw your route.',
  },
  {
    icon: LayoutList,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Organize with lists',
    desc: 'Group spots into collections — by city, vibe, or trip. Keep "Must Eats Bangkok" separate from "Hidden Temples Kyoto".',
  },
  {
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Plan together',
    desc: 'Invite friends to a shared trip. Everyone adds spots, votes on must-dos, and watches the itinerary update in real time.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500"
          >
            Why TRVLTOO
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white leading-none"
          >
            Everything your trip needs.<br />
            <span className="text-white/30">Nothing it doesn't.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-7 rounded-[2rem] border bg-white/5 backdrop-blur-md space-y-4 ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${f.bg}`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black italic uppercase tracking-tight text-white leading-tight">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
