import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchCities } from '../../data/cities';

export default function DestinationSearch({ value, onChange }) {
  const [query, setQuery]     = useState(value ? `${value.city}, ${value.country}` : '');
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);
    if (q.length >= 1) {
      setResults(searchCities(q));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
    onChange(null); // clear selection when typing
  }

  function handleSelect(city) {
    setQuery(`${city.city}, ${city.country}`);
    setOpen(false);
    setResults([]);
    onChange(city);
  }

  function handleClear() {
    setQuery('');
    setResults([]);
    setOpen(false);
    onChange(null);
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => query.length >= 1 && results.length && setOpen(true)}
          placeholder="Search destinations…"
          className="w-full pl-11 pr-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20"
          >
            {results.map((c, i) => (
              <li key={`${c.city}-${c.country}`}>
                <button
                  onClick={() => handleSelect(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <div>
                    <p className="text-sm font-black italic uppercase tracking-tight text-white">{c.city}</p>
                    <p className="text-[10px] text-white/40 font-medium">{c.country} · {c.region}</p>
                  </div>
                </button>
                {i < results.length - 1 && <div className="h-px bg-white/5 mx-4" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
