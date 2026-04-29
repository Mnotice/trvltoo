import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Bookmark, BookmarkCheck, Download, Mail,
  Moon, Sun, Share2, Trash2, LogOut,
} from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { saveTrip, getUserTrips, deleteTrip } from '../db/trips';
import { performSecurityStartupAudit, sanitizeVibeData } from '../utils/security';
import { fetchItinerary } from '../services/geminiService';
import { fetchWeather } from '../services/weatherService';
import { fetchActivitiesPool } from '../activityPool';
import { getDestinationAreas } from '../data/destinations';
import { LOADING_MESSAGES, ENERGY_LABELS, SLOT_TIMES } from '../data/ui';
import { trackItineraryGenerated, trackActivityRerolled, trackActivityLocked, trackExport, trackShareLink } from '../analytics';
import { jsPDF } from 'jspdf';

import SecurityErrorBoundary from '../components/SecurityErrorBoundary';
import SplashScreen from '../components/SplashScreen';
import Header from '../components/Header';
import WeatherTimeline from '../components/WeatherTimeline';
import LocationGrid from '../components/LocationGrid';
import CalculatingVibe from '../components/CalculatingVibe';
import SlotSection from '../components/SlotSection';
import ArrivalStrip from '../components/ArrivalStrip';
import AreaSelector from '../components/AreaSelector';
import DestinationDetail from '../components/DestinationDetail';

function VibeEngine() {
  const [isBooting, setIsBooting] = useState(true);
  const [form, setForm] = useState({
    destination: 'Krabi',
    arrivalDate: new Date().toISOString().split('T')[0],
    groupContext: 'Solo',
    interests: [],
    dietary: 'None',
    budget: '$$',
    energy: 5,
    noctourism: false,
    nightIntensity: 5,
    area: '',
  });
  const [status, setStatus] = useState('idle');
  const [genError, setGenError] = useState(null);
  const [pools, setPools] = useState({ Morning: [], Afternoon: [], Evening: [] });
  const [picks, setPicks] = useState({ Morning: 0, Afternoon: 0, Evening: 0 });
  const [locked, setLocked] = useState(new Set());
  const [weather, setWeather] = useState(null);
  const [insight, setInsight] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [view, setView] = useState('explore');
  const [selectedDestId, setSelectedDestId] = useState(null);
  const [planStep, setPlanStep] = useState(0);
  const [planDir, setPlanDir] = useState(1);
  const [user, setUser] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activityPool, setActivityPool] = useState([]);

  const loadTrips = async (uid) => {
    setTripsLoading(true);
    try {
      const trips = await getUserTrips(uid);
      setSavedTrips(trips);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setTripsLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadTrips(u.uid);
      else setSavedTrips([]);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setSavedTrips([]);
    setSavedId(null);
  };

  const handleSaveTrip = async () => {
    if (!user) { handleSignIn(); return; }
    setSaving(true);
    try {
      const tripData = {
        destination: form.destination,
        arrivalDate: form.arrivalDate,
        groupContext: form.groupContext,
        interests: form.interests,
        dietary: form.dietary,
        budget: form.budget,
        energy: form.energy,
        noctourism: form.noctourism,
        area: form.area || null,
        insight: insight || null,
        slots: {
          Morning: pools.Morning[picks.Morning] || null,
          Afternoon: pools.Afternoon[picks.Afternoon] || null,
          Evening: pools.Evening[picks.Evening] || null,
        },
      };
      const id = await saveTrip(user.uid, tripData);
      setSavedId(id);
      loadTrips(user.uid);
    } catch (err) {
      console.error('Save trip error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadTrip = (trip) => {
    setForm(prev => ({
      ...prev,
      destination: trip.destination,
      arrivalDate: trip.arrivalDate,
      groupContext: trip.groupContext || 'Solo',
      interests: trip.interests || [],
      dietary: trip.dietary || 'None',
      budget: trip.budget,
      energy: trip.energy,
      noctourism: trip.noctourism ?? false,
      area: trip.area || '',
    }));
    if (trip.slots) {
      const toPool = (act) => act ? [act] : [];
      setPools({
        Morning: toPool(trip.slots.Morning),
        Afternoon: toPool(trip.slots.Afternoon),
        Evening: toPool(trip.slots.Evening),
      });
      setPicks({ Morning: 0, Afternoon: 0, Evening: 0 });
    }
    setInsight(trip.insight || null);
    setSavedId(trip.id);
    setStatus('completed');
  };

  const handleDeleteTrip = async (tripId) => {
    await deleteTrip(tripId);
    setSavedTrips(prev => prev.filter(t => t.id !== tripId));
    if (savedId === tripId) setSavedId(null);
  };

  const handleShare = () => {
    if (!savedId) return;
    const url = `${window.location.origin}/trip/${savedId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShareLink(form.destination);
    });
  };

  const goToStep = (next) => {
    setPlanDir(next > planStep ? 1 : -1);
    setPlanStep(next);
  };

  useEffect(() => {
    try { performSecurityStartupAudit(); } catch (err) { console.error('🚨 CRITICAL SYSTEM HALT:', err.message); }
  }, []);

  useEffect(() => {
    if (form.noctourism) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [form.noctourism]);

  useEffect(() => {
    setActivityPool([]);
    fetchActivitiesPool(form.destination).then(setActivityPool);
  }, [form.destination]);

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length), 2500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleReroll = (slot) => {
    const pool = pools[slot];
    if (!pool || pool.length <= 1) return;
    const currentActivity = pool[picks[slot]];
    if (currentActivity && locked.has(currentActivity.id)) return;
    let next;
    do { next = Math.floor(Math.random() * pool.length); } while (next === picks[slot] && pool.length > 1);
    setPicks(prev => ({ ...prev, [slot]: next }));
    trackActivityRerolled(slot, form.destination);
  };

  const handleToggleLock = (id) => {
    setLocked(prev => {
      const next = new Set(prev);
      const wasLocked = next.has(id);
      wasLocked ? next.delete(id) : next.add(id);
      if (!wasLocked) trackActivityLocked(id, form.destination);
      return next;
    });
  };

  const buildItineraryText = () => [
    `TRVLTOO — ${form.destination} Itinerary`,
    `Date: ${form.arrivalDate} | ${form.groupContext} | Budget: ${form.budget}`,
    '',
    ...['Morning', 'Afternoon', 'Evening'].map(slot => {
      const act = pools[slot]?.[picks[slot]];
      return act
        ? `${slot.toUpperCase()}\n${act.title}\n${act.subtitle} — ${act.category}`
        : `${slot.toUpperCase()}\nNo activity selected`;
    }),
    '',
    'Generated by TRVLTOO — https://trvltoo.com/',
  ].join('\n');

  const exportMarkdown = () => {
    const lines = [
      `# TRVLTOO — ${form.destination} Itinerary`,
      `**Date:** ${form.arrivalDate} | **${form.groupContext}** | **Budget:** ${form.budget}`,
      '',
      ...['Morning', 'Afternoon', 'Evening'].map(slot => {
        const act = pools[slot]?.[picks[slot]];
        return act
          ? `## ${slot}\n**${act.title}**\n${act.subtitle} — _${act.category}_\n`
          : `## ${slot}\n_No activity selected_\n`;
      }),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trvltoo-${form.destination.toLowerCase().replace(' ', '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    trackExport('markdown', form.destination);
  };

  const exportPDF = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const slotColors = { Morning: [251, 191, 36], Afternoon: [56, 189, 248], Evening: [99, 102, 241] };

    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 595, 841, 'F');
    pdf.setTextColor(20, 184, 166);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRVLTOO — ITINERARY', 40, 50);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.text(form.destination.toUpperCase(), 40, 90);
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`${form.arrivalDate}  ·  ${form.groupContext}  ·  ${form.budget}${form.area ? `  ·  ${form.area}` : ''}`, 40, 110);
    pdf.setDrawColor(255, 255, 255, 20);
    pdf.line(40, 125, 555, 125);

    let y = 155;
    ['Morning', 'Afternoon', 'Evening'].forEach(slot => {
      const act = pools[slot]?.[picks[slot]];
      const [r, g, b] = slotColors[slot];
      pdf.setTextColor(r, g, b);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(slot.toUpperCase(), 40, y);
      y += 18;
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(act?.title ?? 'No activity selected', 40, y, { maxWidth: 515 });
      y += 20;
      pdf.setTextColor(120, 120, 120);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${act?.subtitle ?? ''}  ·  ${act?.category ?? ''}`, 40, y);
      y += 14;
      if (act?.tip) {
        pdf.setTextColor(100, 100, 100);
        pdf.text(act.tip, 40, y, { maxWidth: 515 });
        y += 14;
      }
      y += 22;
    });

    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(8);
    pdf.text('Generated by TRVLTOO — trvltoo.com', 40, 820);
    pdf.save(`trvltoo-${form.destination.toLowerCase().replace(/ /g, '-')}.pdf`);
    trackExport('pdf', form.destination);
  };

  const emailItinerary = () => {
    const subject = encodeURIComponent(`My ${form.destination} Itinerary — TRVLTOO`);
    const body = encodeURIComponent(buildItineraryText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setGenError(null);
    setStatus('processing');
    setLocked(new Set());
    setSavedId(null);
    try {
      const sanitizedForm = sanitizeVibeData(form);
      const [itinerary, weatherData] = await Promise.all([
        fetchItinerary(sanitizedForm, activityPool),
        fetchWeather(sanitizedForm.destination),
      ]);
      const safeItinerary = itinerary || { Morning: [], Afternoon: [], Evening: [] };
      setPools({ Morning: safeItinerary.Morning || [], Afternoon: safeItinerary.Afternoon || [], Evening: safeItinerary.Evening || [] });
      setInsight(safeItinerary.insight || null);
      setPicks({ Morning: 0, Afternoon: 0, Evening: 0 });
      setWeather(weatherData);
      setStatus('completed');
      trackItineraryGenerated(sanitizedForm.destination, sanitizedForm.groupContext, sanitizedForm.budget);
    } catch (err) {
      setStatus('idle');
      if (err.message === 'RATE_LIMIT') {
        setGenError(err.friendly);
      } else {
        console.error('Vibe Engine Error:', err);
      }
    }
  };

  const renderContent = () => {
    if (view === 'destination' && selectedDestId) return (
      <DestinationDetail
        destId={selectedDestId}
        onBack={() => setView('explore')}
        onPlan={() => {
          updateForm('destination', selectedDestId);
          setPlanStep(0);
          setView('plan');
        }}
      />
    );

    if (view === 'explore') return (
      <section className="space-y-20">
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-black italic uppercase leading-[0.9] mb-4">
            Explore <span className="text-teal-500">Coordinates</span>
          </h2>
          <p className="text-sm opacity-60">Choose a destination to see what's waiting for you.</p>
        </div>
        <div className="space-y-12">
          <div className="flex items-center space-x-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">01. Destination</h3>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>
          <LocationGrid
            selected={form.destination}
            onSelect={(id) => { setSelectedDestId(id); setView('destination'); }}
          />
        </div>
      </section>
    );

    if (view === 'plan') {
      const STEPS = [
        { num: '01', label: 'Arrival Date' },
        { num: '02', label: 'Your Area' },
        { num: '03', label: "Who You're With" },
        { num: '04', label: 'Your Interests' },
        { num: '05', label: 'Energy Level' },
        { num: '06', label: 'Budget' },
        { num: '07', label: 'Trip Mode' },
      ];
      const isLast = planStep === STEPS.length - 1;
      const toggleInterest = (id) =>
        updateForm('interests', form.interests.includes(id)
          ? form.interests.filter(i => i !== id)
          : [...form.interests, id]
        );

      const stepVariants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
      };

      const stepContent = () => {
        if (planStep === 0) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">01 — Arrival Date</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                When are you <span className="text-teal-500">arriving</span> in {form.destination}?
              </h2>
            </div>
            <div className="pt-4">
              <ArrivalStrip selected={form.arrivalDate} onSelect={(date) => updateForm('arrivalDate', date)} />
            </div>
          </div>
        );

        if (planStep === 1) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">02 — Your Area</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                Where are you <span className="text-teal-500">staying</span> in {form.destination}?
              </h2>
            </div>
            <div className="pt-4">
              {getDestinationAreas(form.destination).length > 0 ? (
                <AreaSelector destination={form.destination} selected={form.area} onSelect={(a) => updateForm('area', a)} />
              ) : (
                <p className="text-white/40 italic text-sm">
                  Area data coming soon for {form.destination} — we'll surface the best activities regardless.
                </p>
              )}
            </div>
          </div>
        );

        if (planStep === 2) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">03 — Who You're With</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                Who are you <span className="text-teal-500">travelling with?</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { id: 'Solo',     icon: '🧍', label: 'Solo', desc: 'Flying free, your own pace' },
                { id: 'Friends',  icon: '👥', label: 'With Friends', desc: 'Small group, flexible plans' },
                { id: 'Couple',   icon: '💑', label: 'Couple', desc: 'Shared moments, romantic finds' },
                { id: 'Flexible', icon: '🤷', label: 'Flexible', desc: 'Alone now, open to company' },
              ].map(({ id, icon, label, desc }) => (
                <motion.button
                  key={id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updateForm('groupContext', id)}
                  className={`p-6 rounded-[2.5rem] border-2 text-left transition-all ${
                    form.groupContext === id
                      ? 'border-teal-500 bg-teal-500 text-white shadow-xl shadow-teal-500/20'
                      : 'border-white/20 bg-white/10 hover:border-teal-500/50'
                  }`}
                >
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="font-black text-base uppercase italic tracking-tighter mb-1">{label}</div>
                  <div className={`text-[11px] leading-snug ${form.groupContext === id ? 'text-white/70' : 'opacity-50'}`}>{desc}</div>
                </motion.button>
              ))}
            </div>
            <div className="pt-4 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Dietary preferences</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'None', label: 'No restrictions' },
                  { id: 'Vegetarian', label: 'Vegetarian' },
                  { id: 'Vegan', label: 'Vegan' },
                  { id: 'Halal', label: 'Halal' },
                ].map(({ id, label }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateForm('dietary', id)}
                    className={`px-5 py-3 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all ${
                      form.dietary === id
                        ? 'border-teal-500 bg-teal-500 text-white'
                        : 'border-white/20 bg-white/10 hover:border-teal-500/50'
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

        if (planStep === 3) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">04 — Your Interests</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                What are you <span className="text-teal-500">into?</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {[
                { id: 'Nature', emoji: '🌿' }, { id: 'Food', emoji: '🍜' },
                { id: 'Culture', emoji: '🏛️' }, { id: 'Adventure', emoji: '🧗' },
                { id: 'Nightlife', emoji: '🌙' }, { id: 'Wellness', emoji: '🧘' },
                { id: 'Shopping', emoji: '🛍️' }, { id: 'Photography', emoji: '📷' },
                { id: 'History', emoji: '🏺' }, { id: 'Water Sports', emoji: '🤿' },
              ].map(({ id, emoji }) => {
                const active = form.interests.includes(id);
                return (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleInterest(id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 text-[11px] font-black uppercase tracking-wider transition-all ${
                      active ? 'border-teal-500 bg-teal-500 text-white' : 'border-white/20 bg-white/10 hover:border-teal-500/50'
                    }`}
                  >
                    <span>{emoji}</span>{id}
                  </motion.button>
                );
              })}
            </div>
            {form.interests.length === 0 && (
              <p className="text-[11px] opacity-30 italic">Pick at least one — the AI uses these to shape your day.</p>
            )}
          </div>
        );

        if (planStep === 4) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">05 — Energy Level</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                How <span className="text-teal-500">intense</span> should this day be?
              </h2>
            </div>
            <div className="pt-4 space-y-10">
              <div className="flex items-end justify-between">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={form.energy}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-2xl font-black italic tracking-tighter uppercase opacity-50"
                  >
                    {ENERGY_LABELS[form.energy - 1]}
                  </motion.p>
                </AnimatePresence>
                <span className="text-7xl font-black italic text-teal-500 tracking-tighter leading-none">
                  {form.energy}<span className="text-3xl opacity-40">/10</span>
                </span>
              </div>
              <input
                type="range" min="1" max="10" step="1"
                value={form.energy}
                onChange={(e) => updateForm('energy', parseInt(e.target.value))}
                className="w-full h-5 bg-slate-200 dark:bg-slate-900/50 rounded-full appearance-none cursor-pointer accent-teal-500 border border-slate-300 dark:border-white/10"
              />
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-30">
                <span>Total Zen</span><span>Max Adrenaline</span>
              </div>
            </div>
          </div>
        );

        if (planStep === 5) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">06 — Budget</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                What's your <span className="text-teal-500">daily spend</span> comfort zone?
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { tier: '$', label: 'Backpacker', range: 'Under $30/day', desc: 'Street food & hostels' },
                { tier: '$$', label: 'Comfort', range: '$30–100/day', desc: 'Mid-range hotels & restaurants' },
                { tier: '$$$', label: 'Premium', range: '$100+/day', desc: 'Resorts & fine dining' },
              ].map(({ tier, label, range, desc }) => (
                <motion.button
                  key={tier}
                  type="button"
                  whileHover={{ y: -4 }}
                  onClick={() => updateForm('budget', tier)}
                  className={`p-8 rounded-[2.5rem] border-2 text-center transition-all shadow-sm hover:shadow-md ${
                    form.budget === tier
                      ? 'border-teal-500 bg-teal-500 text-white shadow-xl shadow-teal-500/20'
                      : 'border-slate-200 dark:border-white/20 bg-white dark:bg-white/10 backdrop-blur-md hover:border-teal-400'
                  }`}
                >
                  <div className="text-2xl font-black italic tracking-tighter mb-1">{tier}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${form.budget === tier ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{label}</div>
                  <div className={`text-sm font-bold ${form.budget === tier ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{range}</div>
                  <div className={`text-[11px] mt-1 leading-tight ${form.budget === tier ? 'text-white/80' : 'text-slate-500 dark:text-slate-300'}`}>{desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
        );

        if (planStep === 6) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">07 — Trip Mode</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">
                Day or <span className="text-teal-500">night</span> first?
              </h2>
            </div>
            <div className="pt-4 space-y-6">
              <div
                onClick={() => updateForm('noctourism', !form.noctourism)}
                className={`p-8 rounded-[3.5rem] border-2 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-md ${
                  form.noctourism
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-xl shadow-indigo-500/30'
                    : 'border-slate-200 dark:border-white/20 bg-white/10 hover:border-teal-400'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-5 rounded-2xl ${form.noctourism ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-teal-600'}`}>
                    {form.noctourism ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl italic uppercase tracking-tighter">Noctourism</h4>
                    <p className={`text-xs mt-1 ${form.noctourism ? 'text-white/70' : 'opacity-40'}`}>
                      {form.noctourism ? 'Night-forward itinerary' : 'Daytime-first itinerary'}
                    </p>
                  </div>
                </div>
                <div className={`w-16 h-8 rounded-full p-1.5 transition-colors ${form.noctourism ? 'bg-white/40' : 'bg-slate-200 dark:bg-slate-800'}`}>
                  <motion.div animate={{ x: form.noctourism ? 32 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-lg" />
                </div>
              </div>
              {form.noctourism && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 p-8 rounded-[3rem] bg-indigo-500/10 border border-indigo-500/20"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Night Pressure</h3>
                    <span className="text-3xl font-black italic text-indigo-400">{form.nightIntensity}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={form.nightIntensity}
                    onChange={(e) => updateForm('nightIntensity', parseInt(e.target.value))}
                    className="w-full h-4 bg-indigo-500/20 rounded-full appearance-none cursor-pointer accent-indigo-500"
                  />
                </motion.div>
              )}
            </div>
          </div>
        );
      };

      return (
        <section className="max-w-2xl mx-auto space-y-10 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('explore')}
              className="px-5 py-2 rounded-full border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/10"
            >
              ← {form.destination}
            </button>
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => i < planStep && goToStep(i)}
                  className={`transition-all rounded-full ${
                    i === planStep ? 'w-8 h-2.5 bg-teal-500' :
                    i < planStep ? 'w-2.5 h-2.5 bg-teal-500/40 hover:bg-teal-500/60 cursor-pointer' :
                    'w-2.5 h-2.5 bg-slate-300 dark:bg-white/20 cursor-default'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{STEPS[planStep].num} / 07</span>
          </div>

          <div className={`p-10 md:p-14 rounded-[4rem] backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden ${form.noctourism ? 'bg-indigo-900/40' : 'bg-white/60'}`}>
            <AnimatePresence custom={planDir} mode="wait">
              <motion.div
                key={planStep}
                custom={planDir}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                {stepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {genError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm font-bold text-center"
              >
                {genError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => goToStep(planStep - 1)}
              disabled={planStep === 0}
              className="px-8 py-4 rounded-full border-2 border-slate-200 dark:border-white/20 font-black uppercase tracking-widest text-[10px] disabled:opacity-20 hover:border-teal-400 transition-all"
            >
              Back
            </button>
            {isLast ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSubmit}
                className={`px-16 py-6 rounded-full font-black text-xl uppercase italic tracking-tighter shadow-2xl transition-all ${
                  form.noctourism
                    ? 'bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Generate Trip
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => goToStep(planStep + 1)}
                className="px-16 py-6 rounded-full bg-teal-500 text-white font-black text-xl uppercase italic tracking-tighter shadow-xl shadow-teal-500/20 hover:bg-teal-400 transition-all"
              >
                Next
              </motion.button>
            )}
          </div>
        </section>
      );
    }

    if (view === 'trips') {
      if (!user) return (
        <section className="py-40 text-center space-y-8">
          <h2 className="text-4xl font-black italic uppercase opacity-60">Sign in to see your saved trips</h2>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSignIn}
            className="px-12 py-5 rounded-full bg-teal-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-400 transition-all"
          >
            Sign in with Google
          </motion.button>
        </section>
      );
      return (
        <section className="space-y-10">
          <div>
            <h2 className="text-5xl font-black italic uppercase leading-[0.9] mb-4">My <span className="text-teal-500">Trips</span></h2>
            <p className="text-sm opacity-60">Your saved itineraries.</p>
          </div>
          {tripsLoading ? (
            <div className="py-20 text-center opacity-40 italic text-sm">Loading trips...</div>
          ) : savedTrips.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="opacity-40 italic text-sm">No saved trips yet.</p>
              <button
                onClick={() => setView('explore')}
                className="px-8 py-3 rounded-full border-2 border-teal-500/30 text-teal-500 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/10 transition-all"
              >
                Start Planning
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-8 rounded-[3rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md space-y-4 hover:border-teal-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-1">{trip.arrivalDate}</p>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">{trip.destination}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-red-500/20 transition-all group"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[trip.groupContext || trip.persona || 'Solo', trip.budget, `Energy ${trip.energy}`].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">{tag}</span>
                    ))}
                  </div>
                  {trip.insight && (
                    <p className="text-[12px] text-slate-500 dark:text-white/50 italic leading-relaxed line-clamp-2">{trip.insight}</p>
                  )}
                  <button
                    onClick={() => handleLoadTrip(trip)}
                    className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-white/90 transition-all"
                  >
                    Load Itinerary
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      );
    }

    return <section className="py-40 text-center opacity-40 italic">Coming Soon.</section>;
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${form.noctourism ? 'bg-indigo-950 text-indigo-50' : 'bg-sky-50 text-slate-900'} pt-32 pb-12 px-6 md:px-12 font-sans selection:bg-teal-500/30`}>
      <AnimatePresence>
        {isBooting && <SplashScreen onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      <Header
        currentView={view}
        isDark={form.noctourism}
        onToggleTheme={() => updateForm('noctourism', !form.noctourism)}
        setView={setView}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <AnimatePresence>
        {status === 'processing' && <CalculatingVibe messageIndex={messageIndex} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <main>
          {renderContent()}

          <AnimatePresence>
            {status === 'completed' && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="z-50 fixed inset-0 overflow-y-auto bg-slate-950"
              >
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-10">
                  <header className="flex justify-between items-start pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-teal-500 mb-3">Your Itinerary</p>
                      <h2 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-[0.85]">{form.destination}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {[form.arrivalDate, form.groupContext, form.budget].map(tag => (
                          <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">{tag}</span>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-white/40 max-w-lg leading-relaxed">
                        {ENERGY_LABELS[form.energy - 1]} · {form.groupContext} · {form.noctourism ? 'Night-forward itinerary' : 'Daytime-first itinerary'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveTrip}
                        disabled={saving}
                        title={user ? (savedId ? 'Saved!' : 'Save trip') : 'Sign in to save'}
                        className={`p-4 rounded-2xl border transition-all ${
                          savedId
                            ? 'bg-teal-500/20 border-teal-500/40 text-teal-400'
                            : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                        } disabled:opacity-40`}
                      >
                        {savedId ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        disabled={!savedId}
                        title={savedId ? (copied ? 'Link copied!' : 'Copy share link') : 'Save trip first to share'}
                        className={`p-4 rounded-2xl border transition-all relative ${
                          copied
                            ? 'bg-teal-500/30 border-teal-500/50 text-teal-300'
                            : savedId
                              ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                              : 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        <Share2 className="w-5 h-5" />
                        {copied && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-teal-500 text-white text-[10px] font-black uppercase tracking-wide whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={emailItinerary}
                        title="Email itinerary to yourself"
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                      >
                        <Mail className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={exportPDF}
                        title="Export to PDF"
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={exportMarkdown}
                        title="Export to Markdown"
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-[9px] font-black text-white/60 uppercase tracking-widest"
                      >
                        .MD
                      </motion.button>
                      <button
                        onClick={() => { setStatus('idle'); setLocked(new Set()); }}
                        className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition-all group"
                      >
                        <ArrowRight className="w-6 h-6 text-white rotate-180 group-hover:-translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </header>

                  {insight && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-[2.5rem] bg-teal-500/10 border border-teal-500/20"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-3">Agent Insight</p>
                      <p className="text-white/80 text-base leading-relaxed italic">{insight}</p>
                    </motion.div>
                  )}

                  {weather && (
                    <>
                      <WeatherTimeline hourly={weather.hourly} />
                      <div className="flex flex-wrap gap-3">
                        <span className="px-5 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black uppercase tracking-widest text-amber-300">Peak {weather.maxTemp}°C</span>
                        <span className="px-5 py-2 rounded-full bg-sky-500/20 border border-sky-400/40 text-[10px] font-black uppercase tracking-widest text-sky-300">Rain {weather.precipProb}%</span>
                        {weather.maxUv >= 8 && (
                          <span className="px-5 py-2 rounded-full bg-red-500/20 border border-red-400/40 text-[10px] font-black uppercase tracking-widest text-red-300">High UV {weather.maxUv} — Sunscreen Required</span>
                        )}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
                    {[
                      { slot: 'Morning', label: '01. Morning', color: 'text-amber-400' },
                      { slot: 'Afternoon', label: '02. Afternoon', color: 'text-sky-400' },
                      { slot: 'Evening', label: '03. Evening', color: 'text-indigo-400' },
                    ].map(({ slot, label, color }) => {
                      const pool = pools[slot] || [];
                      const activity = pool[picks[slot]];
                      const isLocked = !!(activity && locked.has(activity.id));
                      return (
                        <SlotSection
                          key={slot}
                          slot={slot}
                          label={label}
                          color={color}
                          activity={activity}
                          isLocked={isLocked}
                          onToggleLock={handleToggleLock}
                          onReroll={() => handleReroll(slot)}
                          canReroll={pool.length > 1}
                        />
                      );
                    })}
                  </div>

                  <footer className="border-t border-white/5 pt-8 flex justify-between items-center opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">TRVLTOO — Alpha</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{form.destination}, Thailand</span>
                  </footer>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function Planner() {
  return (
    <SecurityErrorBoundary>
      <VibeEngine />
    </SecurityErrorBoundary>
  );
}
