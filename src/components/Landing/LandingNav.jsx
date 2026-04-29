import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black italic uppercase tracking-tighter text-white">
          TRVLTOO
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[['Features', '#features'], ['How It Works', '#how-it-works']].map(([label, href]) => (
            <a key={label} href={href} className="text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/destinations" className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Explore
          </Link>
          <Link to="/trips" className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            My Trips
          </Link>
          <Link to="/spots" className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            My Spots
          </Link>
          <Link to="/map" className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Map
          </Link>
          <Link to="/plan" className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Day Planner
          </Link>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/plan')}
            className="px-5 py-2.5 rounded-full bg-teal-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
          >
            Start Planning
          </motion.button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden text-white/60 hover:text-white transition-colors"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-4">
              {[['Features', '#features'], ['How It Works', '#how-it-works']].map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2">
                  {label}
                </a>
              ))}
              <Link to="/destinations" onClick={() => setMenuOpen(false)} className="text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2">
                Explore
              </Link>
              <Link to="/trips" onClick={() => setMenuOpen(false)} className="text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2">
                My Trips
              </Link>
              <Link to="/spots" onClick={() => setMenuOpen(false)} className="text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2">
                My Spots
              </Link>
              <Link to="/map" onClick={() => setMenuOpen(false)} className="text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2">
                Map
              </Link>
              <Link to="/plan" onClick={() => setMenuOpen(false)} className="text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2">
                Day Planner
              </Link>
              <button
                onClick={() => { setMenuOpen(false); navigate('/plan'); }}
                className="mt-2 py-3 rounded-full bg-teal-500 text-white text-[12px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors"
              >
                Start Planning
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
