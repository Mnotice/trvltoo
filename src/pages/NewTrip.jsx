import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePlan, FREE_TRIP_LIMIT } from '../hooks/usePlan';
import { useTrips } from '../hooks/useTrips';
import AuthModal from '../components/AuthModal';
import ProGate from '../components/ProGate';
import { useSpots } from '../hooks/useSpots';
import { createTrip } from '../services/firestoreService';
import { CITIES, FEATURED_DESTINATIONS } from '../data/cities';
import DestinationSearch from '../components/TripPlanner/DestinationSearch';
import DateRangePicker from '../components/TripPlanner/DateRangePicker';
import SpotSelector from '../components/TripPlanner/SpotSelector';
import LandingNav from '../components/Landing/LandingNav';

// Pre-resolve featured destination objects once
const FEATURED = Object.entries(FEATURED_DESTINATIONS).map(([region, names]) => ({
  region,
  cities: names.map(n => CITIES.find(c => c.city === n)).filter(Boolean),
}));

const STEPS = ['Destination', 'Dates', 'Preferences', 'Spots', 'Review'];

const BUDGET_TIERS = [
  { id: 'budget',  label: 'Budget',   icon: '🎒', desc: '~$50/day',     sub: 'Hostels, street food, local transport' },
  { id: 'mid',     label: 'Mid-range',icon: '✈️', desc: '$60–120/day',  sub: 'Guesthouses, sit-down meals, Grab' },
  { id: 'luxury',  label: 'Luxury',   icon: '💎', desc: '$150+/day',    sub: 'Hotels, fine dining, private tours' },
];

const GROUP_TYPES = [
  { id: 'solo',    label: 'Solo' },
  { id: 'couple',  label: 'Couple' },
  { id: 'friends', label: 'Friends' },
  { id: 'family',  label: 'Family' },
];

const TRAVEL_STYLES = [
  'Adventure', 'Foodie', 'Culture', 'Nightlife',
  'Nature', 'Beach', 'Photography', 'Shopping', 'Wellness', 'History',
];

const SLIDE = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  animate: { opacity: 1, x: 0 },
  exit:    (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function NewTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isPro } = usePlan(user?.uid);
  const { trips } = useTrips(user?.uid);
  const [showAuth, setShowAuth] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const { spots } = useSpots(user?.uid);

  const preSelected = location.state?.destination ?? null;

  const [step, setStep]   = useState(preSelected ? 1 : 0);
  const [dir,  setDir]    = useState(1);
  const [saving, setSaving]   = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const [destination, setDestination] = useState(preSelected);
  const [tripName,    setTripName]    = useState('');
  const [dates,       setDates]       = useState({ startDate: null, endDate: null });
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [prefs, setPrefs] = useState({ budgetTier: 'mid', groupType: 'solo', travelStyle: [] });

  function go(next) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function toggleSpot(id) {
    setSelectedSpots(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function toggleStyle(style) {
    setPrefs(p => ({
      ...p,
      travelStyle: p.travelStyle.includes(style)
        ? p.travelStyle.filter(s => s !== style)
        : [...p.travelStyle, style],
    }));
  }

  const canNext = [
    !!destination,
    !!(dates.startDate && dates.endDate),
    true, // prefs always valid (has defaults)
    true, // spots optional
    !!(destination && dates.startDate && dates.endDate),
  ][step];

  async function handleCreate() {
    if (!user || !destination || !dates.startDate || !dates.endDate) return;
    if (!isPro && trips.length >= FREE_TRIP_LIMIT) { setShowGate(true); return; }
    setSaving(true);
    try {
      const name = tripName.trim() || `${destination.city} Trip`;
      const id   = await createTrip(user.uid, {
        name,
        destination: { city: destination.city, country: destination.country, emoji: destination.emoji, context: destination.context ?? null },
        startDate:   dates.startDate,
        endDate:     dates.endDate,
        spotIds:     selectedSpots,
        prefs,
      });
      navigate(`/trips/${id}`);
    } catch (err) {
      const msg = err?.code === 'permission-denied'
        ? 'Permission denied — make sure your Firestore rules are deployed.'
        : 'Failed to create trip. Please try again.';
      setSaveErr(msg);
      setSaving(false);
    }
  }

  const nights = dates.startDate && dates.endDate
    ? Math.round((new Date(dates.endDate + 'T00:00:00') - new Date(dates.startDate + 'T00:00:00')) / 86400000)
    : null;

  if (authLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />
      <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} />}</AnimatePresence>
      {showGate && <ProGate onClose={() => setShowGate(false)} />}
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 text-center px-6">
        <p className="text-6xl">✈️</p>
        <p className="text-2xl font-black italic uppercase tracking-tighter">Sign in to plan a trip</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowAuth(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-[12px] uppercase tracking-[0.2em]">
          <LogIn className="w-4 h-4" /> Sign In
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />

      <main className="max-w-xl mx-auto px-6 pt-28 pb-20">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => i < step && go(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                  i < step  ? 'bg-teal-500 text-white cursor-pointer hover:bg-teal-400' :
                  i === step ? 'bg-white text-slate-900' :
                  'bg-white/10 text-white/30 cursor-default'
                }`}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 transition-all ${i < step ? 'bg-teal-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={SLIDE}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {step === 0 && (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">Step 1</p>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Where are you going?</h2>
                  </div>

                  {/* Featured destinations */}
                  {!destination && (
                    <div className="space-y-4">
                      {FEATURED.map(({ region, cities }) => (
                        <div key={region} className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{region}</p>
                          <div className="flex flex-wrap gap-2">
                            {cities.map(c => (
                              <motion.button
                                key={c.city}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setDestination(c)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-wide text-white/60 hover:text-white hover:border-teal-500/30 transition-all"
                              >
                                <span>{c.emoji}</span>{c.city}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pt-1">Or search</p>
                    </div>
                  )}

                  <DestinationSearch value={destination} onChange={setDestination} />

                  {destination && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                      <span className="text-3xl">{destination.emoji}</span>
                      <div>
                        <p className="text-base font-black italic uppercase tracking-tight text-white">{destination.city}</p>
                        <p className="text-[11px] text-teal-400 font-medium">{destination.country} · {destination.region}</p>
                        {destination.context?.highlights && (
                          <p className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{destination.context.highlights}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">Step 2</p>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">When are you going?</h2>
                  </div>
                  <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10">
                    <DateRangePicker
                      startDate={dates.startDate}
                      endDate={dates.endDate}
                      onChange={setDates}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Trip Name (optional)</label>
                    <input type="text" value={tripName} onChange={e => setTripName(e.target.value)}
                      placeholder={destination ? `${destination.city} Trip` : 'My Trip'}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 transition-colors" />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">Step 3</p>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Your travel style</h2>
                    <p className="text-sm text-white/40 mt-1">Claude will tailor the itinerary to your preferences.</p>
                  </div>

                  {/* Budget tier */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Budget per day</p>
                    <div className="grid grid-cols-3 gap-2">
                      {BUDGET_TIERS.map(tier => (
                        <motion.button
                          key={tier.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setPrefs(p => ({ ...p, budgetTier: tier.id }))}
                          className={`flex flex-col items-center gap-1 py-4 px-2 rounded-2xl border transition-all text-center ${
                            prefs.budgetTier === tier.id
                              ? 'bg-teal-500/15 border-teal-500/40 text-white'
                              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl">{tier.icon}</span>
                          <span className="text-[11px] font-black uppercase tracking-wide">{tier.label}</span>
                          <span className={`text-[10px] font-bold ${prefs.budgetTier === tier.id ? 'text-teal-400' : 'text-white/55'}`}>{tier.desc}</span>
                          <span className="text-[9px] text-white/40 leading-tight hidden sm:block">{tier.sub}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Group type */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Who's travelling?</p>
                    <div className="flex gap-2 flex-wrap">
                      {GROUP_TYPES.map(g => (
                        <motion.button
                          key={g.id}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setPrefs(p => ({ ...p, groupType: g.id }))}
                          className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all ${
                            prefs.groupType === g.id
                              ? 'bg-teal-500 border-teal-500 text-white'
                              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                          }`}
                        >
                          {g.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Travel styles */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Interests <span className="text-white/20 normal-case font-medium tracking-normal">— pick any</span></p>
                    <div className="flex flex-wrap gap-2">
                      {TRAVEL_STYLES.map(style => (
                        <motion.button
                          key={style}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleStyle(style)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide border transition-all ${
                            prefs.travelStyle.includes(style)
                              ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                          }`}
                        >
                          {style}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">Step 4</p>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Add your saved spots</h2>
                    <p className="text-sm text-white/40 mt-1">
                      {selectedSpots.length ? `${selectedSpots.length} selected` : 'Optional — you can add spots later too'}
                    </p>
                  </div>
                  <SpotSelector spots={spots} selected={selectedSpots} onToggle={toggleSpot} />
                </>
              )}

              {step === 4 && (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">Step 5</p>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Looks good?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Destination', value: `${destination?.emoji} ${destination?.city}, ${destination?.country}` },
                      { label: 'Dates', value: nights ? `${new Date(dates.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${new Date(dates.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${nights} night${nights !== 1 ? 's' : ''})` : '—' },
                      { label: 'Trip Name', value: tripName.trim() || `${destination?.city} Trip` },
                      { label: 'Budget', value: BUDGET_TIERS.find(t => t.id === prefs.budgetTier)?.label + ' · ' + BUDGET_TIERS.find(t => t.id === prefs.budgetTier)?.desc },
                      { label: 'Group', value: GROUP_TYPES.find(g => g.id === prefs.groupType)?.label ?? prefs.groupType },
                      { label: 'Interests', value: prefs.travelStyle.length ? prefs.travelStyle.join(', ') : 'No preference' },
                      { label: 'Spots', value: selectedSpots.length ? `${selectedSpots.length} spot${selectedSpots.length !== 1 ? 's' : ''} included` : 'None yet (add later)' },
                    ].map(row => (
                      <div key={row.label} className="flex items-start justify-between gap-4 py-3 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 shrink-0 w-24">{row.label}</span>
                        <span className="text-sm font-bold text-white text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Save error */}
        {saveErr && (
          <p className="text-[12px] text-red-400 text-center mt-6">{saveErr}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => step === 0 ? navigate('/trips') : go(step - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-white/50 font-black text-[11px] uppercase tracking-widest hover:border-white/30 hover:text-white/70 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Back' : 'Previous'}
          </button>

          {step < STEPS.length - 1 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => go(step + 1)}
              disabled={!canNext}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors disabled:opacity-40"
            >
              Next <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={saving || !canNext}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors disabled:opacity-40"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <>Create Trip <Check className="w-4 h-4" /></>}
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
}
