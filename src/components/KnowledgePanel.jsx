import { CheckCircle, XCircle, UtensilsCrossed, Bus, Bed, Lightbulb } from 'lucide-react';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';

export default function KnowledgePanel({ destId }) {
  const k = KNOWLEDGE_BASE[destId];
  if (!k) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Local Intelligence</h3>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-[11px] font-bold text-emerald-300">{k.when.best}</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20">
          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="text-[11px] font-bold text-red-300">{k.when.avoid}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">Getting Around</p>
          </div>
          <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">{k.transport}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">Where to Stay</p>
          </div>
          <div className="space-y-2">
            {k.stay.map(s => (
              <div key={s.tier} className="flex items-center gap-3">
                <span className="w-8 text-[11px] font-black text-teal-400">{s.tier}</span>
                <span className="text-sm text-slate-700 dark:text-white/70">{s.area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Eat This</p>
          </div>
          <ul className="space-y-2">
            {k.eat.map((item, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-white/70 leading-snug flex gap-2">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">—</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">Do This</p>
          </div>
          <ul className="space-y-2">
            {k.doThis.map((item, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-white/70 leading-snug flex gap-2">
                <span className="text-teal-400 flex-shrink-0 mt-0.5">—</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Avoid</p>
          </div>
          <ul className="space-y-2">
            {k.avoid.map((item, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-white/70 leading-snug flex gap-2">
                <span className="text-red-400 flex-shrink-0 mt-0.5">—</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20">
        <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-1">Local Tip</p>
          <p className="text-sm text-amber-200/80 leading-relaxed">{k.localTip}</p>
        </div>
      </div>
    </div>
  );
}
