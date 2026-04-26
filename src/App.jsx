import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Heart, Utensils, Laptop, Users,
  Moon, Sun, ArrowRight, Compass,
  MapPin, Clock, CheckCircle2,
  Dices, Star, Lock, Download, Share2, FileText,
  Waves, Sailboat, UtensilsCrossed, Navigation, ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';
import { performSecurityStartupAudit, sanitizeVibeData } from './utils/security';
import { fetchItinerary, fetchWeather, getDestinationTips } from './apiService';
import { signInWithGoogle, signOutUser, subscribeToAuthState } from './auth';
import { saveTrip } from './supabase';
import { jsPDF } from 'jspdf';
import {
  trackItineraryGenerated,
  trackActivityRerolled,
  trackActivityLocked,
  trackExport,
  trackShareLink,
} from './analytics';
import imgPhuket from './assets/phuket.png';
import imgKrabi from './assets/krabi.png';
import imgBangkok from './assets/bangkok.png';
import imgChiangMai from './assets/chiang_mai.png';

// --- Security Protocol Components (#7 Error Boundaries) ---
class SecurityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error("🛡️ SECURITY AUDIT FAILURE:", error); }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10 text-center">
        <div className="p-8 rounded-[3rem] bg-red-500/10 border-2 border-red-500/20 max-w-lg">
           <h2 className="text-4xl font-black italic tracking-tighter uppercase text-red-500 mb-6">Expert Engine Fault</h2>
           <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white text-slate-900 rounded-full font-black uppercase tracking-tighter">Restart</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

// --- Constants & Config ---
const N8N_WEBHOOK_URL = "https://mikhailnicholls6.app.n8n.cloud/webhook-test/travel-consultant";

const PERSONAS = [
  { id: 'Solo', icon: User, label: 'Solo Adventurer', desc: 'Freedom and discovery.' },
  { id: 'Friends', icon: Users, label: 'Friends Trip', desc: 'Group adventures together.' },
  { id: 'Couple', icon: Heart, label: 'Romantic Couple', desc: 'Shared intimate moments.' },
  { id: 'Foodie', icon: Utensils, label: 'Foodie Friends', desc: 'Culture through food.' },
  { id: 'Nomad', icon: Laptop, label: 'Digital Nomad', desc: 'Work and play.' },
];

const LOCATIONS = [
  { id: 'Phuket', image: imgPhuket, desc: 'Islands & Nightlife' },
  { id: 'Krabi', image: imgKrabi, desc: 'Cliffs & Caves' },
  { id: 'Bangkok', image: imgBangkok, desc: 'City & Culture' },
  { id: 'Chiang Mai', image: imgChiangMai, desc: 'Mountains & Temples' },
];

const LOADING_MESSAGES = ["Consulting Agent...", "Scanning hidden gems...", "Optimizing energy...", "Finalizing your day..."];

const ENERGY_LABELS = [
  "Total Zen & Recharging",
  "Slow Morning & Chill Afternoon",
  "Low Impact Exploration",
  "Moderate Sightseeing Pace",
  "Balanced Cultured Discover",
  "Vibrant & Social Energy",
  "High-Intensity Exploration",
  "High Octane Adventure",
  "Maximum Adrenaline Flow",
  "Limitless Energy Protocol"
];

const MOCK_EXPERT_RESULTS = {
  Solo: {
    strategy: "Optimizing for peak isolation and raw discovery.",
    morning: "Sunrise trek to Black Rock Viewpoint (360° views)",
    afternoon: "Deep-sea scouting or solo meditation at Nui Beach",
    evening: "Secret night market tasting tour in Old Town",
    hourly: [24,25,26,28,30,31,32,32,31,30,28,27,26,25,24,23]
  },
  Couple: {
    strategy: "Curating for shared emotional resonance and cinematic lighting.",
    morning: "Private longtail boat to Phra Nang Cave (7 AM)",
    afternoon: "Couples spa session at a jungle-integrated retreat",
    evening: "Private sunset dinner on a hidden clifftop",
    hourly: [23,24,25,27,29,30,31,31,30,29,27,26,25,24,23,22]
  },
  Foodie: {
    strategy: "A narrative-driven culinary path bypassing tourist zones.",
    morning: "Hidden fresh market 'chef-led' tasting session",
    afternoon: "Street food workshop with a local legend",
    evening: "Table-side storytelling at Jek Pui Curry",
    hourly: [25,26,27,29,31,32,33,33,32,31,29,28,27,26,25,24]
  },
  Nomad: {
    strategy: "High-velocity work node cycling with rapid decompression.",
    morning: "Jungle-co-working sprint (fiber connected)",
    afternoon: "Beach-office protocol under a natural canopy",
    evening: "Rooftop networking protocol at sunset",
    hourly: [24,24,26,28,30,31,32,32,31,30,28,27,26,25,24,24]
  }
};

const WeatherTimeline = ({ hourly }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  if (!hourly || hourly.length === 0) return null;
  const max = Math.max(...hourly);
  const min = Math.min(...hourly);
  const range = max - min || 1;
  const width = 800;
  const height = 120;
  const padding = 40;
  const points = hourly.map((temp, i) => ({
    x: (i / (hourly.length - 1)) * (width - padding * 2) + padding,
    y: height - padding - ((temp - min) / range) * (height - padding * 2),
    temp, hour: i + 6
  }));
  const pathData = points.reduce((acc, p, i) => i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`, "");

  return (
    <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden relative mb-10">
      <div className="flex justify-between items-end mb-6">
        <div><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-1">Atmosphere Pulse</h4><p className="text-3xl font-black italic tracking-tighter uppercase">{hoverIndex !== null ? `${points[hoverIndex].temp}°C` : `${max}°C Peak`}</p></div>
        <div className="text-right text-[10px] font-black uppercase tracking-widest opacity-40">{hoverIndex !== null ? `${points[hoverIndex].hour}:00` : 'Daylight Cycle'}</div>
      </div>
      <div className="relative h-24 group"><svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible"><motion.path d={pathData} fill="none" stroke="url(#g)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fbbf24" /><stop offset="50%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
        {points.map((p, i) => (<g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}><rect x={p.x - 15} y="0" width="30" height={height} fill="transparent" />{hoverIndex === i && (<><circle cx={p.x} cy={p.y} r="6" fill="#14b8a6" /><line x1={p.x} y1={p.y + 10} x2={p.x} y2={height} stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 4" /></>)}</g>))}
      </svg></div>
    </div>
  );
};

// --- Sub-Components ---
const SystemBootSequence = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Initializing TML Security Protocol...",
    "Scanning Reasoning Node Latency...",
    "Validating Expert Proxy Hub...",
    "Access Granted: TRVLTOO ALPHA-01"
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(s => s + 1), 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-white font-mono p-10"
    >
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center space-x-6">
           <div className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center font-black text-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)]">TML</div>
           <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-[0.8]">System Boot</h2>
              <p className="text-[10px] opacity-40 uppercase tracking-[0.4em] mt-1">Environment: Production</p>
           </div>
        </div>
        
        <div className="space-y-4">
           {steps.slice(0, step + 1).map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center space-x-4 ${i === steps.length - 1 ? 'text-teal-400 font-black' : 'opacity-60'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${i === steps.length - 1 ? 'bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]' : 'bg-white'}`} />
                <span className="text-xs uppercase tracking-widest">{s}</span>
              </motion.div>
           ))}
        </div>

        {step >= steps.length && (
           <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="h-0.5 bg-teal-500/50 origin-left" />
        )}
      </div>
    </motion.div>
  );
};

const Header = ({ currentView, isDark, onToggleTheme, setView, user, onSignIn, onSignOut }) => (
  <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 md:px-12 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
    <div className="flex items-center space-x-12">
      <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xl shadow-2xl cursor-pointer" onClick={() => setView('explore')}>TML</div>
      <nav className="hidden md:flex items-center space-x-10">
        {['Explore', 'Plan', 'Community'].map(item => (
          <button key={item} onClick={() => setView(item.toLowerCase())} className={`text-xs font-black uppercase tracking-[0.3em] transition-colors ${currentView === item.toLowerCase() ? 'text-teal-500' : 'text-slate-400 hover:text-white'}`}>{item}</button>
        ))}
      </nav>
    </div>
    <div className="flex items-center space-x-4">
      <button onClick={onToggleTheme} className="p-3 rounded-2xl bg-white/10">{isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}</button>
      {user ? (
        <div className="flex items-center space-x-3">
          <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full border-2 border-teal-500" referrerPolicy="no-referrer" />
          <button onClick={onSignOut} className="hidden md:block px-5 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/40 transition-colors">Sign Out</button>
        </div>
      ) : (
        <button onClick={onSignIn} className="hidden md:flex items-center space-x-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity">
          <span>Sign In</span>
        </button>
      )}
    </div>
  </header>
);

const LocationGrid = ({ selected, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {LOCATIONS.map((loc, i) => (
      <motion.button key={loc.id} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => onSelect(loc.id)} className={`group relative h-80 rounded-[3rem] overflow-hidden border-4 ${selected === loc.id ? 'border-teal-500' : 'border-transparent'}`}>
        <img src={loc.image} alt={loc.id} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
        <div className="absolute bottom-10 left-10 text-left"><h4 className="text-white text-2xl font-black italic tracking-tighter uppercase">{loc.id}</h4><p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{loc.desc}</p></div>
      </motion.button>
    ))}
  </div>
);

const PersonaCard = ({ persona, isSelected, onSelect }) => (
  <motion.button 
    type="button"
    whileHover={{ y: -4 }} 
    onClick={() => onSelect(persona.id)} 
    className={`p-8 rounded-[2.5rem] border-2 text-left flex flex-col transition-all shadow-sm hover:shadow-md ${
      isSelected 
        ? 'border-teal-500 bg-teal-500 text-white shadow-xl shadow-teal-500/20' 
        : 'border-slate-200 dark:border-white/20 bg-white dark:bg-white/10 backdrop-blur-md hover:border-teal-400'
    }`}
  >
    <div className={`p-4 rounded-2xl mb-6 flex items-center justify-center w-fit transition-colors ${
      isSelected ? 'bg-white/20' : 'bg-teal-500/5 dark:bg-white/5 text-teal-500'
    }`}>
      <persona.icon className="w-7 h-7" />
    </div>
    <h4 className="font-black text-xl uppercase italic tracking-tighter">{persona.id}</h4>
    <p className={`text-[11px] mt-2 font-bold uppercase tracking-widest leading-snug ${
      isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
    }`}>
      {persona.desc}
    </p>
  </motion.button>
);

const CalculatingVibe = ({ messageIndex }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="mb-10"><Compass className="w-16 h-16 text-teal-500" /></motion.div>
    <AnimatePresence mode="wait"><motion.p key={messageIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-xl font-black italic uppercase italic uppercase text-teal-500">{LOADING_MESSAGES[messageIndex]}</motion.p></AnimatePresence>
  </motion.div>
);

const ItineraryCard = ({ activity, isLocked, onToggleLock }) => (
  <motion.div layout className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 group">
    <div className="h-52 overflow-hidden">
      <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <button
      onClick={() => onToggleLock(activity.id)}
      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm border transition-all ${
        isLocked
          ? 'bg-teal-500 border-teal-400 text-white shadow-lg shadow-teal-500/40'
          : 'bg-black/40 border-white/10 text-white/60 hover:bg-black/60 hover:text-white'
      }`}
    >
      {isLocked ? <Lock className="w-4 h-4" /> : <Star className="w-4 h-4" />}
    </button>
    <div className="p-6 space-y-2">
      <span className="text-[9px] font-black uppercase tracking-widest text-teal-400">{activity.category}</span>
      <h4 className="text-xl font-black italic tracking-tighter uppercase text-white leading-tight">{activity.title}</h4>
      <p className="text-[11px] text-white/50 font-medium uppercase tracking-wide flex items-center gap-1.5">
        <MapPin className="w-3 h-3 flex-shrink-0" />{activity.subtitle}
      </p>
    </div>
  </motion.div>
);

const SlotSection = ({ label, color, activity, isLocked, onToggleLock, onReroll, canReroll }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${color}`}>{label}</span>
        <div className="h-px w-12 bg-white/10" />
      </div>
      <motion.button
        whileTap={{ rotate: 180, scale: 0.9 }}
        onClick={onReroll}
        disabled={isLocked || !canReroll}
        title={isLocked ? 'Unlock to re-roll' : 'Re-roll activity'}
        className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <Dices className="w-5 h-5 text-white" />
      </motion.button>
    </div>
    {activity ? (
      <ItineraryCard activity={activity} isLocked={isLocked} onToggleLock={onToggleLock} />
    ) : (
      <div className="h-52 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">No activities found</span>
      </div>
    )}
  </div>
);

const LOCAL_INTEL_TABS = [
  { id: 'beaches',      label: 'Beaches',          Icon: Waves,          key: 'beaches' },
  { id: 'dayTrips',     label: 'Day Trips',         Icon: Sailboat,       key: 'dayTrips' },
  { id: 'food',         label: 'Food',              Icon: UtensilsCrossed, key: 'food' },
  { id: 'gettingAround',label: 'Getting Around',    Icon: Navigation,     key: 'gettingAround' },
  { id: 'avoid',        label: 'Things to Avoid',   Icon: ShieldAlert,    key: 'thingsToAvoid' },
];

const LocalIntelPanel = ({ tips, activeTab, onTabChange }) => {
  if (!tips) return null;
  const visibleTabs = LOCAL_INTEL_TABS.filter(t => {
    const d = tips[t.key];
    return Array.isArray(d) ? d.length > 0 : !!d;
  });
  const active = visibleTabs.find(t => t.id === activeTab) || visibleTabs[0];
  if (!active) return null;
  const data = tips[active.key];

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center space-x-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500">Local Intel</h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="flex flex-wrap gap-3">
        {visibleTabs.map(tab => {
          const isActive = active.id === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-teal-500 border-teal-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {(active.id === 'beaches') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-black text-base italic tracking-tighter uppercase text-white">{item.name}</h4>
                    <span className="flex-shrink-0 px-3 py-1 rounded-full bg-sky-500/10 text-[9px] font-black uppercase tracking-widest text-sky-400">{item.vibe}</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          )}

          {active.id === 'dayTrips' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-black text-base italic tracking-tighter uppercase text-white">{item.name}</h4>
                    <span className="flex-shrink-0 px-3 py-1 rounded-full bg-indigo-500/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">{item.budget}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{item.duration}</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          )}

          {active.id === 'food' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-2">
                  <h4 className="font-black text-base italic tracking-tighter uppercase text-white">{item.name}</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          )}

          {(active.id === 'gettingAround' || active.id === 'avoid') && (
            <div className="space-y-3">
              {data.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-white/5 border border-white/10"
                >
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${active.id === 'avoid' ? 'text-red-400' : 'text-teal-400'}`} />
                  <p className="text-[12px] text-white/70 leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DateRangeStrip = ({ arrivalDate, departureDate, onArrivalChange, onDepartureChange }) => {
  const nights = arrivalDate && departureDate
    ? Math.max(0, Math.round((new Date(departureDate) - new Date(arrivalDate)) / 86400000))
    : 0;

  const DatePicker = ({ label, value, onChange, minDate, stepLabel }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{stepLabel}. {label}</h3>
        <div className="h-px flex-1 bg-white/10 dark:bg-slate-800" />
      </div>
      <div className="relative">
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${value ? 'border-teal-500 bg-teal-500/10' : 'border-white/20 bg-white/5'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{label}</p>
          {value ? (
            <p className="text-2xl font-black italic tracking-tighter">
              {new Date(value + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          ) : (
            <p className="text-lg font-black italic tracking-tighter opacity-30">Select date</p>
          )}
        </div>
        <input
          type="date"
          min={minDate}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DatePicker label="Check-In" value={arrivalDate} onChange={onArrivalChange} minDate={new Date().toISOString().split('T')[0]} stepLabel="02" />
        <DatePicker label="Check-Out" value={departureDate} onChange={onDepartureChange} minDate={arrivalDate} stepLabel="03" />
      </div>
      {nights > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center">
          <div className="px-8 py-4 rounded-full bg-teal-500/10 border border-teal-500/30">
            <span className="text-teal-500 font-black text-xl italic tracking-tighter">{nights} Night{nights !== 1 ? 's' : ''}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-3">Trip Duration</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

function VibeEngine() {
  const [isBooting, setIsBooting] = useState(true);
  const defaultArrival = new Date();
  defaultArrival.setDate(defaultArrival.getDate() + 7);
  const defaultDeparture = new Date(defaultArrival);
  defaultDeparture.setDate(defaultDeparture.getDate() + 7);

  const [form, setForm] = useState({
    destination: 'Krabi',
    arrivalDate: defaultArrival.toISOString().split('T')[0],
    departureDate: defaultDeparture.toISOString().split('T')[0],
    persona: 'Friends',
    budget: '$$',
    energy: 5,
    noctourism: false,
    nightIntensity: 5
  });
  const [status, setStatus] = useState('idle');
  const [pools, setPools] = useState({ Morning: [], Afternoon: [], Evening: [] });
  const [picks, setPicks] = useState({ Morning: 0, Afternoon: 0, Evening: 0 });
  const [locked, setLocked] = useState(new Set());
  const [weather, setWeather] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [view, setView] = useState('explore');
  const [user, setUser] = useState(null);

  useEffect(() => { try { performSecurityStartupAudit(); } catch (err) { console.error("🚨 CRITICAL SYSTEM HALT:", err.message); } }, []);
  useEffect(() => subscribeToAuthState(setUser), []);
  useEffect(() => { if (form.noctourism) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [form.noctourism]);
  useEffect(() => { if (status === 'processing') { const interval = setInterval(() => setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length), 2500); return () => clearInterval(interval); } }, [status]);

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
      next.has(id) ? next.delete(id) : next.add(id);
      if (!next.has(id)) trackActivityLocked(id, form.destination);
      return next;
    });
  };

  const exportMarkdown = () => {
    const lines = [
      `# TRVLTOO — ${form.destination} Itinerary`,
      `**Date:** ${form.arrivalDate} | **Persona:** ${form.persona} | **Budget:** ${form.budget}`,
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
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const slots = ['Morning', 'Afternoon', 'Evening'];
    const colors = { Morning: [251, 191, 36], Afternoon: [56, 189, 248], Evening: [99, 102, 241] };

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 595, 841, 'F');
    doc.setTextColor(20, 184, 166);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TRVLTOO — ITINERARY', 40, 50);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.text(form.destination.toUpperCase(), 40, 90);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`${form.arrivalDate}  ·  ${form.persona}  ·  ${form.budget}`, 40, 110);

    // Divider
    doc.setDrawColor(255, 255, 255, 20);
    doc.line(40, 125, 555, 125);

    let y = 155;
    slots.forEach((slot) => {
      const act = pools[slot]?.[picks[slot]];
      const [r, g, b] = colors[slot];
      doc.setTextColor(r, g, b);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(slot.toUpperCase(), 40, y);
      y += 18;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(act?.title ?? 'No activity selected', 40, y);
      y += 16;
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${act?.subtitle ?? ''}  ·  ${act?.category ?? ''}`, 40, y);
      y += 40;
    });

    // Footer
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.text('Generated by TRVLTOO', 40, 810);

    doc.save(`trvltoo-${form.destination.toLowerCase().replace(' ', '-')}.pdf`);
    trackExport('pdf', form.destination);
  };

  const [shareCopied, setShareCopied] = useState(false);
  const [localIntelTab, setLocalIntelTab] = useState('beaches');
  const copyShareLink = () => {
    const params = new URLSearchParams({
      dest: form.destination,
      date: form.arrivalDate,
      persona: form.persona,
      budget: form.budget,
    });
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
      trackShareLink(form.destination);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('processing');
    setLocked(new Set());
    try {
      const sanitizedForm = sanitizeVibeData(form);

      // If the n8n agent is configured, use it; otherwise fall back to the
      // curated + Foursquare data pipeline in apiService.
      const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      const itineraryPromise = n8nUrl
        ? fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitizedForm),
          })
            .then(r => r.json())
            .catch(() => fetchItinerary(sanitizedForm)) // fallback on n8n failure
        : fetchItinerary(sanitizedForm);

      const [itinerary, weatherData] = await Promise.all([
        itineraryPromise,
        fetchWeather(sanitizedForm.destination),
      ]);

      const safeItinerary = itinerary || { Morning: [], Afternoon: [], Evening: [] };
      const initialPicks = { Morning: 0, Afternoon: 0, Evening: 0 };
      setPools(safeItinerary);
      setPicks(initialPicks);
      setWeather(weatherData);
      setStatus('completed');
      trackItineraryGenerated(sanitizedForm.destination, sanitizedForm.persona, sanitizedForm.budget);
      // Persist to Supabase (fire-and-forget, non-blocking)
      if (user) saveTrip(user.uid, sanitizedForm, safeItinerary, initialPicks);
    } catch (err) {
      console.error("Vibe Engine Error:", err);
      setStatus('idle');
    }
  };

  const renderContent = () => {
    if (view === 'explore') return (
      <section className="space-y-20">
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-black italic uppercase leading-[0.9] mb-4">Explore <span className="text-teal-500">Coordinates</span></h2>
          <p className="text-sm opacity-60">Select your destination and arrival nodal point for reasoning.</p>
        </div>
        
        <div className="space-y-12">
          <div className="flex items-center space-x-4"><h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">01. Destination Selection</h3><div className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div>
          <LocationGrid selected={form.destination} onSelect={(id) => updateForm('destination', id)} />
        </div>

        <DateRangeStrip
          arrivalDate={form.arrivalDate}
          departureDate={form.departureDate}
          onArrivalChange={(d) => {
            updateForm('arrivalDate', d);
            if (form.departureDate && d >= form.departureDate) {
              const dep = new Date(d + 'T00:00:00');
              dep.setDate(dep.getDate() + 7);
              updateForm('departureDate', dep.toISOString().split('T')[0]);
            }
          }}
          onDepartureChange={(d) => updateForm('departureDate', d)}
        />

        <div className="flex justify-center pt-10 pb-20">
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => setView('plan')}
             disabled={!form.destination || !form.arrivalDate || !form.departureDate}
             className="relative group px-24 py-10 rounded-[3rem] bg-white/20 dark:bg-white/5 backdrop-blur-3xl border-2 border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white font-black text-3xl uppercase italic tracking-tighter shadow-2xl transition-all flex items-center space-x-6 disabled:opacity-20 disabled:cursor-not-allowed group"
           >
             <div className="absolute inset-0 rounded-[3rem] border-b-4 border-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="relative z-10">Configure Vibe</span>
             <div className="relative z-10 p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transform group-hover:rotate-12 transition-transform">
                <ArrowRight className="w-8 h-8" />
             </div>
           </motion.button>
        </div>
      </section>
    );
    if (view === 'plan') return (
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-black italic uppercase leading-[0.9] mb-4">Trip <span className="text-teal-500">Customization</span></h2>
            <p className="text-sm opacity-60">Configure your travel identity for {form.destination}.</p>
          </div>
          <button onClick={() => setView('explore')} className="px-6 py-2 rounded-full border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/10">Change Destination</button>
        </div>

        <div className={`p-10 md:p-16 rounded-[4rem] backdrop-blur-3xl border border-white/20 transition-colors shadow-2xl ${form.noctourism ? 'bg-indigo-900/40' : 'bg-white/60'}`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

              {/* Left Column: The Vibe */}
              <div className="space-y-16">
                <div className="space-y-10">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">01. Travel Persona</h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {PERSONAS.map((p, i) => (
                      <div key={p.id} className={PERSONAS.length % 2 !== 0 && i === PERSONAS.length - 1 ? 'col-span-2 max-w-xs mx-auto w-full' : ''}>
                        <PersonaCard persona={p} isSelected={form.persona === p.id} onSelect={(id) => updateForm('persona', id)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">02. Energy Intensity</h3>
                    <span className="text-4xl font-black italic text-teal-500 tracking-tighter uppercase">{form.energy}/10</span>
                  </div>
                  <div className="space-y-10 text-center">
                    <input
                      type="range" min="1" max="10" step="1"
                      value={form.energy}
                      onChange={(e) => updateForm('energy', parseInt(e.target.value))}
                      className="w-full h-4 bg-slate-200 dark:bg-slate-900/50 rounded-full appearance-none cursor-pointer accent-teal-500 border border-slate-300 dark:border-white/10"
                    />
                    <div className="h-12 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={form.energy}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="text-2xl font-black italic tracking-tighter uppercase text-slate-400 dark:text-white/60"
                        >
                          {ENERGY_LABELS[form.energy - 1]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: The Setup */}
              <div className="space-y-16">
                <div className="space-y-10">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">03. Budget Tier</h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { tier: '$', label: 'Budget' },
                      { tier: '$$', label: 'Comfort' },
                      { tier: '$$$', label: 'Premium' },
                    ].map(({ tier, label }) => (
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
                        <div className="text-2xl font-black italic tracking-tighter mb-2">{tier}</div>
                        <div className={`text-[10px] font-black uppercase tracking-widest ${form.budget === tier ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>{label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">04. Mode Arbiter</h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div onClick={() => updateForm('noctourism', !form.noctourism)} className={`p-8 rounded-[3.5rem] border-2 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-md ${form.noctourism ? 'border-indigo-500 bg-indigo-500 text-white shadow-xl shadow-indigo-500/30' : 'border-slate-200 dark:border-white/20 bg-white/10 hover:border-teal-400'}`}>
                    <div className="flex items-center space-x-6">
                      <div className={`p-5 rounded-2xl ${form.noctourism ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-teal-600'}`}>{form.noctourism ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />}</div>
                      <h4 className="font-black text-2xl italic uppercase tracking-tighter">Noctourism</h4>
                    </div>
                    <div className={`w-16 h-8 rounded-full p-1.5 transition-colors ${form.noctourism ? 'bg-white/40' : 'bg-slate-200 dark:bg-slate-800'}`}>
                      <motion.div animate={{ x: form.noctourism ? 32 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-lg" />
                    </div>
                  </div>

                  {form.noctourism && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Night Pressure</h3>
                        <span className="text-2xl font-black italic text-indigo-400">{form.nightIntensity}/10</span>
                      </div>
                      <input type="range" min="1" max="10" step="1" value={form.nightIntensity} onChange={(e) => updateForm('nightIntensity', parseInt(e.target.value))} className="w-full h-3 bg-indigo-500/20 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-16">
              <button type="submit" className={`px-24 py-12 rounded-full font-black text-3xl uppercase italic tracking-tighter shadow-2xl transition-all active:scale-95 ${form.noctourism ? 'bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Reason Trip</button>
            </div>
          </form>
        </div>
      </section>
    );
    
    return <section className="py-40 text-center opacity-40 italic">Coming Soon.</section>;
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${form.noctourism ? 'bg-indigo-950 text-indigo-50' : 'bg-sky-50 text-slate-900'} pt-32 pb-12 px-6 md:px-12 font-sans selection:bg-teal-500/30`}>
      <AnimatePresence>
         {isBooting && <SystemBootSequence onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>
      
      <Header currentView={view} isDark={form.noctourism} onToggleTheme={() => updateForm('noctourism', !form.noctourism)} setView={setView} user={user} onSignIn={signInWithGoogle} onSignOut={signOutUser} />
      <AnimatePresence>{status === 'processing' && <CalculatingVibe messageIndex={messageIndex} />}</AnimatePresence>
      <div className="max-w-7xl mx-auto"><main>{renderContent()}
        <AnimatePresence>{status === 'completed' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="z-50 fixed inset-0 overflow-y-auto bg-slate-950"
          >
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-10">

              {/* Header */}
              <header className="flex justify-between items-start pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.6em] text-teal-500 mb-3">Your Itinerary</p>
                  <h2 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-[0.85]">{form.destination}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {(() => {
                      const nights = form.departureDate
                        ? Math.round((new Date(form.departureDate) - new Date(form.arrivalDate)) / 86400000)
                        : null;
                      return [
                        `${form.arrivalDate} → ${form.departureDate}`,
                        nights ? `${nights} nights` : null,
                        form.persona,
                        form.budget,
                      ].filter(Boolean).map(tag => (
                        <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">{tag}</span>
                      ));
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={copyShareLink} title="Copy share link" className={`p-4 rounded-2xl border transition-all ${shareCopied ? 'bg-teal-500 border-teal-400' : 'bg-white/10 hover:bg-white/20 border-white/10'}`}>
                    <Share2 className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={exportPDF} title="Export to PDF" className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                    <FileText className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={exportMarkdown} title="Export to Markdown" className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                    <Download className="w-5 h-5 text-white" />
                  </motion.button>
                  <button onClick={() => { setStatus('idle'); setLocked(new Set()); }} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition-all group">
                    <ArrowRight className="w-6 h-6 text-white rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </header>

              {/* Weather */}
              {weather && (
                <>
                  <WeatherTimeline hourly={weather.hourly} />
                  <div className="flex flex-wrap gap-3">
                    <span className="px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-400">Peak {weather.maxTemp}°C</span>
                    <span className="px-5 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-black uppercase tracking-widest text-sky-400">Rain {weather.precipProb}%</span>
                    {weather.maxUv >= 8 && (
                      <span className="px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-400">High UV {weather.maxUv} — Sunscreen Required</span>
                    )}
                  </div>
                </>
              )}

              {/* Time Slots */}
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

              {/* Local Intel */}
              <LocalIntelPanel
                tips={getDestinationTips(form.destination)}
                activeTab={localIntelTab}
                onTabChange={setLocalIntelTab}
              />

              <footer className="border-t border-white/5 pt-8 flex justify-between items-center opacity-30">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">TRVLTOO — Alpha</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{form.destination}, Thailand</span>
              </footer>
            </div>
          </motion.section>
        )}</AnimatePresence>
      </main></div>
    </div>
  );
}

export default function SafeVibeEngine() {
  return (
    <SecurityErrorBoundary>
      <VibeEngine />
    </SecurityErrorBoundary>
  );
}
