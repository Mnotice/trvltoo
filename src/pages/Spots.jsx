import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, PenLine, LogIn, Loader2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSpots } from '../hooks/useSpots';
import ManualEntryForm from '../components/SpotCollector/ManualEntryForm';
import URLParser from '../components/SpotCollector/URLParser';
import SpotGrid from '../components/SpotCollector/SpotGrid';
import LandingNav from '../components/Landing/LandingNav';

const CATEGORY_FILTERS = [
  { id: 'all',        label: 'All',         emoji: '🗺️' },
  { id: 'food',       label: 'Food',        emoji: '🍜' },
  { id: 'attraction', label: 'Attraction',  emoji: '🏛️' },
  { id: 'nature',     label: 'Nature',      emoji: '🌿' },
  { id: 'hotel',      label: 'Stay',        emoji: '🛏️' },
  { id: 'shopping',   label: 'Shopping',    emoji: '🛍️' },
  { id: 'nightlife',  label: 'Nightlife',   emoji: '🌙' },
  { id: 'experience', label: 'Experience',  emoji: '✨' },
];

// null = closed, 'choice' = pick method, 'url' = URL parser, 'manual' = manual form
function useAddModal() {
  const [modal, setModal] = useState(null);
  return {
    modal,
    open:    () => setModal('choice'),
    openUrl: () => setModal('url'),
    openManual: () => setModal('manual'),
    close:   () => setModal(null),
  };
}

export default function Spots() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { spots, loading: spotsLoading, createSpot, deleteSpot } = useSpots(user?.uid);
  const { modal, open, openUrl, openManual, close } = useAddModal();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? spots
    : spots.filter(s => s.category === activeFilter);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20 space-y-10">
        {/* Page header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500">My Spots</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
              {user ? `${spots.length} place${spots.length !== 1 ? 's' : ''} saved` : 'Your saved places'}
            </h1>
          </div>
          {user && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={open}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Spot
            </motion.button>
          )}
        </div>

        {/* Auth gate */}
        {!user ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-6 text-center">
            <p className="text-6xl">🗺️</p>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase tracking-tighter text-white">Sign in to save spots</p>
              <p className="text-sm text-white/40 max-w-sm">
                Create a free account to start collecting places from anywhere on the web.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={signInWithGoogle}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/90 transition-colors shadow-xl"
            >
              <LogIn className="w-4 h-4" /> Continue with Google
            </motion.button>
          </div>
        ) : (
          <>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map(f => (
                <motion.button
                  key={f.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeFilter === f.id
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:border-teal-500/30'
                  }`}
                >
                  <span>{f.emoji}</span> {f.label}
                  {f.id !== 'all' && (
                    <span className={`ml-0.5 opacity-60 ${activeFilter === f.id ? '' : 'text-white/30'}`}>
                      {spots.filter(s => s.category === f.id).length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Spots grid */}
            {spotsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
              </div>
            ) : (
              <SpotGrid spots={filtered} onDelete={deleteSpot} />
            )}
          </>
        )}
      </main>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {/* Method chooser */}
        {modal === 'choice' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && close()}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-7 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Add a Spot</h2>
                <button onClick={close} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openUrl}
                  className="flex flex-col items-center gap-3 p-6 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black uppercase tracking-wider text-white">Paste a Link</p>
                    <p className="text-[10px] text-white/35 mt-0.5">Maps, Instagram, TikTok</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openManual}
                  className="flex flex-col items-center gap-3 p-6 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black uppercase tracking-wider text-white">Add Manually</p>
                    <p className="text-[10px] text-white/35 mt-0.5">Type name & address</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {modal === 'url' && (
          <URLParser onSave={createSpot} onClose={close} />
        )}

        {modal === 'manual' && (
          <ManualEntryForm onSave={createSpot} onClose={close} />
        )}
      </AnimatePresence>
    </div>
  );
}
