import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSpots } from '../hooks/useSpots';
import MapView from '../components/Map/MapView';
import FilterPanel from '../components/Map/FilterPanel';
import LandingNav from '../components/Landing/LandingNav';

export default function MapPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { spots, loading: spotsLoading } = useSpots(user?.uid);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState(null);

  const filtered = useMemo(() =>
    activeFilter === 'all' ? spots : spots.filter(s => s.category === activeFilter),
    [spots, activeFilter]
  );

  const counts = useMemo(() =>
    spots.reduce((acc, s) => ({ ...acc, [s.category]: (acc[s.category] ?? 0) + 1 }), {}),
    [spots]
  );

  const spotsWithCoords = filtered.filter(s => s.coordinates?.lat);
  const spotsWithoutCoords = filtered.filter(s => !s.coordinates?.lat);

  if (authLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500">Map View</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
            {user ? `${spotsWithCoords.length} spot${spotsWithCoords.length !== 1 ? 's' : ''} on the map` : 'Your world, mapped'}
          </h1>
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-6 text-center">
            <p className="text-6xl">🗺️</p>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase tracking-tighter">Sign in to see your map</p>
              <p className="text-sm text-white/40 max-w-sm">
                All your saved spots will appear on an interactive map once you sign in.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={signInWithGoogle}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/90 transition-colors shadow-xl">
              <LogIn className="w-4 h-4" /> Continue with Google
            </motion.button>
          </div>
        ) : spotsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
          </div>
        ) : (
          <>
            <FilterPanel active={activeFilter} onChange={setActiveFilter} counts={counts} />

            {/* Selected spot detail */}
            {selectedSpot && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-teal-500/30"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">{selectedSpot.category}</p>
                  <p className="text-base font-black italic uppercase tracking-tight text-white">{selectedSpot.name}</p>
                  {selectedSpot.address && <p className="text-[11px] text-white/40 mt-0.5">{selectedSpot.address}</p>}
                </div>
                <button onClick={() => setSelectedSpot(null)} className="text-white/30 hover:text-white/60 text-lg leading-none">×</button>
              </motion.div>
            )}

            {/* Map */}
            {spots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2rem] bg-white/5 border border-white/10 border-dashed space-y-3">
                <p className="text-5xl">🗺️</p>
                <p className="text-lg font-black italic uppercase tracking-tight text-white/20">No spots saved yet</p>
                <p className="text-sm text-white/20">Save spots with a Google Maps link to see them here.</p>
              </div>
            ) : (
              <>
                <MapView
                  spots={filtered}
                  onSpotClick={setSelectedSpot}
                  className="h-[60vh]"
                />
                {spotsWithoutCoords.length > 0 && (
                  <p className="text-[11px] text-white/25 text-center">
                    {spotsWithoutCoords.length} spot{spotsWithoutCoords.length !== 1 ? 's' : ''} not shown — no coordinates (paste a Google Maps link to add them)
                  </p>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
