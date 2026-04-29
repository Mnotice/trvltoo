import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CITIES } from '../data/cities';
import LandingNav from '../components/Landing/LandingNav';

const REGIONS = ['All', 'SE Asia', 'East Asia', 'South Asia', 'Middle East', 'Africa', 'Europe', 'Americas', 'Oceania'];

const BUDGET_COLOR = {
  budget: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  mid:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
  luxury: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

function budgetLabel(b) {
  if (!b) return null;
  const low = b.toLowerCase();
  if (low.includes('50') || low.includes('budget') || low.includes('backpack')) return { key: 'budget', text: b };
  if (low.includes('150') || low.includes('luxury')) return { key: 'luxury', text: b };
  return { key: 'mid', text: b };
}

function CityCard({ city, onSelect }) {
  const budget = city.context?.budget ? budgetLabel(city.context.budget) : null;
  const hasContext = !!city.context;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(city)}
      className={`group relative flex flex-col gap-3 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
        hasContext
          ? 'bg-white/5 border-white/10 hover:border-teal-500/35 hover:bg-white/8'
          : 'bg-white/3 border-white/8 hover:border-white/20'
      }`}
    >
      {hasContext && (
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-teal-500/60" />
      )}

      <span className="text-4xl leading-none">{city.emoji}</span>

      <div className="flex-1 space-y-1">
        <p className="text-base font-black italic uppercase tracking-tight text-white leading-none">
          {city.city}
        </p>
        <p className="text-[11px] text-white/35 font-medium">{city.country}</p>
      </div>

      {city.context?.highlights && (
        <p className="text-[11px] text-white/30 leading-relaxed line-clamp-2">
          {city.context.highlights}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {budget && (
          <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${BUDGET_COLOR[budget.key]}`}>
            {budget.text}
          </span>
        )}
        {city.context?.bestMonths && (
          <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border text-white/30 border-white/10">
            {city.context.bestMonths}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-teal-500/40 group-hover:text-teal-400 transition-colors mt-1">
        Plan Trip <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

export default function Destinations() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = CITIES
    .filter(c => activeRegion === 'All' || c.region === activeRegion)
    .filter(c => !search || c.city.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      // cities with context first
      if (a.context && !b.context) return -1;
      if (!a.context && b.context) return 1;
      return a.city.localeCompare(b.city);
    });

  const regionCounts = Object.fromEntries(
    REGIONS.slice(1).map(r => [r, CITIES.filter(c => c.region === r).length])
  );

  function handleSelect(city) {
    navigate('/trips/new', { state: { destination: city } });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> {CITIES.length} destinations
          </p>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Where to next?
          </h1>
          <p className="text-white/40 text-sm max-w-md">
            Pick a destination and Claude builds your full day-by-day itinerary around your budget, style, and saved spots.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search city or country…"
          className="w-full max-w-sm px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/50 transition-colors"
        />

        {/* Region tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => { setActiveRegion(region); setSearch(''); }}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all ${
                activeRegion === region
                  ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
              }`}
            >
              {region}
              {region !== 'All' && (
                <span className={`ml-1.5 ${activeRegion === region ? 'text-teal-200/70' : 'text-white/20'}`}>
                  {regionCounts[region]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Count */}
        {search && (
          <p className="text-[11px] text-white/30 font-black uppercase tracking-wider">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map(city => (
              <CityCard key={`${city.city}-${city.country}`} city={city} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <p className="text-4xl">🗺️</p>
            <p className="text-white/30 font-black italic uppercase tracking-tight">No destinations found</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Key</p>
          <span className="flex items-center gap-1.5 text-[10px] text-white/25">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500/60 inline-block" /> Richer local data available
          </span>
        </div>
      </main>
    </div>
  );
}
