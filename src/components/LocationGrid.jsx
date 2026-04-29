import { motion } from 'framer-motion';
import { LOCATIONS } from '../data/destinations';

export default function LocationGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {LOCATIONS.map((loc, i) => (
        <motion.button
          key={loc.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(loc.id)}
          className={`group relative h-80 rounded-[3rem] overflow-hidden border-4 ${
            selected === loc.id ? 'border-teal-500' : 'border-transparent'
          }`}
        >
          <img
            src={loc.image}
            alt={loc.id}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
          <div className="absolute bottom-10 left-10 text-left">
            <h4 className="text-white text-2xl font-black italic tracking-tighter uppercase">{loc.id}</h4>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{loc.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
