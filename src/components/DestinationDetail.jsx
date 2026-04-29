import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { DESTINATION_INFO, LOCATIONS, FEATURE_DATA, THAILAND_PLACEHOLDERS } from '../data/destinations';
import KnowledgePanel from './KnowledgePanel';

export default function DestinationDetail({ destId, onBack, onPlan }) {
  const info = DESTINATION_INFO[destId] || {};
  const loc = LOCATIONS.find(l => l.id === destId) || {};
  const featured = FEATURE_DATA[destId];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 pb-20"
    >
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> All Destinations
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlan}
          className="px-8 py-3 rounded-full bg-teal-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors"
        >
          Plan My Day Here →
        </motion.button>
      </div>

      <div className="relative h-[28rem] rounded-[3rem] overflow-hidden">
        <img
          src={loc.image}
          alt={destId}
          onError={e => { e.target.src = THAILAND_PLACEHOLDERS[0]; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{loc.desc}</p>
          <h1 className="text-white text-6xl font-black italic uppercase tracking-tighter leading-none">{destId}</h1>
          <p className="text-white/60 text-sm mt-2 font-medium">{info.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(info.highlights || []).map(h => (
          <div key={h.label} className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">{h.label}</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{h.value}</p>
          </div>
        ))}
      </div>

      <p className="text-base leading-relaxed text-slate-600 dark:text-white/60 max-w-2xl">{info.about}</p>

      <KnowledgePanel destId={destId} />

      {featured && (
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Things To Do</h3>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>
          {['Morning', 'Afternoon', 'Evening'].map(slot => (
            <div key={slot} className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">{slot}</p>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                {(featured[slot] || []).map((act, i) => (
                  <div key={act.id} className="flex-shrink-0 w-56 rounded-[2rem] overflow-hidden border border-white/10 bg-white dark:bg-white/5">
                    <div className="h-32 overflow-hidden">
                      <img
                        src={act.image || THAILAND_PLACEHOLDERS[i % THAILAND_PLACEHOLDERS.length]}
                        alt={act.title}
                        onError={e => { e.target.src = THAILAND_PLACEHOLDERS[i % THAILAND_PLACEHOLDERS.length]; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-teal-500">{act.category}</span>
                      <p className="text-sm font-black italic uppercase tracking-tight text-slate-900 dark:text-white leading-tight mt-1">{act.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />{act.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlan}
          className="px-20 py-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-2xl uppercase italic tracking-tighter shadow-2xl hover:bg-slate-800 dark:hover:bg-white/90 transition-colors"
        >
          Plan My Day in {destId}
        </motion.button>
      </div>
    </motion.section>
  );
}
