import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Heart, Utensils, Laptop,
  Moon, Sun, ArrowRight, Compass,
  MapPin, Clock,
  Dices, Star, Lock, Download, Mail,
  Bookmark, BookmarkCheck, Trash2, LogOut, Share2,
  CheckCircle, XCircle, UtensilsCrossed, Bus, Bed, Lightbulb
} from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { saveTrip, getUserTrips, deleteTrip } from './db/trips';
import { performSecurityStartupAudit, sanitizeVibeData } from './utils/security';
import { fetchItinerary, fetchWeather, FEATURE_DATA, THAILAND_PLACEHOLDERS, getDestinationAreas } from './apiService';
import { fetchActivitiesPool } from './activityPool';
import { KNOWLEDGE_BASE } from './data/knowledgeBase';
import { trackItineraryGenerated, trackActivityRerolled, trackActivityLocked, trackExport, trackShareLink } from './analytics';
import { jsPDF } from 'jspdf';
import phuketImg from './assets/phuket.png';
import krabiImg from './assets/krabi.png';
import bangkokImg from './assets/bangkok.png';
import chiangMaiImg from './assets/chiang_mai.png';
import chiangRaiImg from './assets/chiang_rai.svg';
import ayutthayaImg from './assets/ayutthaya.svg';

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
const PERSONAS = [
  { id: 'Solo', icon: User, label: 'Solo Adventurer', desc: 'Freedom and discovery.' },
  { id: 'Couple', icon: Heart, label: 'Romantic Couple', desc: 'Shared moments.' },
  { id: 'Foodie', icon: Utensils, label: 'Foodie Friends', desc: 'Culture through food.' },
  { id: 'Nomad', icon: Laptop, label: 'Digital Nomad', desc: 'Work and play.' },
];

const LOCATIONS = [
  { id: 'Phuket', image: phuketImg, desc: 'Islands & Nightlife' },
  { id: 'Krabi', image: krabiImg, desc: 'Cliffs & Caves' },
  { id: 'Bangkok', image: bangkokImg, desc: 'City & Culture' },
  { id: 'Chiang Mai', image: chiangMaiImg, desc: 'Mountains & Temples' },
  { id: 'Koh Samui', image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800', desc: 'Beaches & Luxury' },
  { id: 'Koh Phangan', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', desc: 'Party & Wellness' },
  { id: 'Koh Tao', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800', desc: 'Diving & Reefs' },
  { id: 'Chiang Rai', image: chiangRaiImg, desc: 'Temples & Tribes' },
  { id: 'Ayutthaya', image: ayutthayaImg, desc: 'Ancient Ruins' },
  { id: 'Hua Hin', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800', desc: 'Royal Coast' },
  { id: 'Pai', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800', desc: 'Mountains & Mist' },
  { id: 'Koh Lanta', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800', desc: 'Laid-back & Reefs' },
];

const DESTINATION_INFO = {
  'Phuket':      { tagline: 'Islands, nightlife & legendary beaches', about: "Thailand's largest island blends vibrant beach resorts with cultural depth. From the white sands of Kata and Karon to the Sino-Portuguese streets of Phuket Town, it caters to every pace.", highlights: [{ label: 'Best For', value: 'Beach life & island hopping' }, { label: 'Best Season', value: 'Nov – Apr' }, { label: 'Vibe', value: 'Lively & social' }, { label: 'Suggested Stay', value: '3–5 days' }] },
  'Krabi':       { tagline: 'Limestone cliffs, caves & emerald water', about: 'Krabi is defined by dramatic karst scenery rising from the Andaman Sea. Railay Beach, accessible only by longtail boat, rivals anywhere in Southeast Asia for sheer beauty.', highlights: [{ label: 'Best For', value: 'Rock climbing & kayaking' }, { label: 'Best Season', value: 'Oct – Apr' }, { label: 'Vibe', value: 'Adventure & scenic' }, { label: 'Suggested Stay', value: '3–5 days' }] },
  'Bangkok':     { tagline: 'Temples, street food & relentless energy', about: 'A city of contrasts — ancient wats beside glass skyscrapers, tuk-tuks weaving past luxury malls, and Michelin-starred street carts beneath rooftop bars. Bangkok rewards every traveller type.', highlights: [{ label: 'Best For', value: 'Culture, food & nightlife' }, { label: 'Best Season', value: 'Nov – Feb' }, { label: 'Vibe', value: 'Electric & urban' }, { label: 'Suggested Stay', value: '2–4 days' }] },
  'Chiang Mai':  { tagline: 'Mountains, temples & northern soul', about: "Thailand's northern capital holds 300+ temples surrounded by forested mountains and hill tribe villages. The moat-ringed Old City brims with artisan cafés, cooking schools, and vibrant night markets.", highlights: [{ label: 'Best For', value: 'Culture & trekking' }, { label: 'Best Season', value: 'Nov – Feb' }, { label: 'Vibe', value: 'Spiritual & creative' }, { label: 'Suggested Stay', value: '3–5 days' }] },
  'Koh Samui':   { tagline: 'Luxury resorts on a palm-fringed island', about: "The Gulf of Thailand's most developed island balances upscale beach clubs and five-star resorts with coconut-shaded roads and quiet fishing villages in the interior.", highlights: [{ label: 'Best For', value: 'Luxury & spa retreats' }, { label: 'Best Season', value: 'Dec – Apr' }, { label: 'Vibe', value: 'Upscale & relaxed' }, { label: 'Suggested Stay', value: '3–5 days' }] },
  'Koh Phangan': { tagline: 'Full Moon parties & jungle wellness', about: 'Famous for the Full Moon Party, Koh Phangan has evolved into a destination for both high-energy beach raves and serious wellness retreats — often on the same stretch of coastline.', highlights: [{ label: 'Best For', value: 'Parties & yoga' }, { label: 'Best Season', value: 'Dec – Apr' }, { label: 'Vibe', value: 'Eclectic & free-spirited' }, { label: 'Suggested Stay', value: '3–7 days' }] },
  'Koh Tao':     { tagline: 'World-class diving on a tiny island', about: 'One of the best places on earth to get dive-certified — warm clear water, healthy coral reefs, and a laid-back village atmosphere with surprisingly good restaurants.', highlights: [{ label: 'Best For', value: 'Diving & snorkelling' }, { label: 'Best Season', value: 'Dec – Apr' }, { label: 'Vibe', value: 'Relaxed & sporty' }, { label: 'Suggested Stay', value: '3–7 days' }] },
  'Chiang Rai':  { tagline: 'White Temple, hill tribes & border mystique', about: "Thailand's northernmost city sits near the Golden Triangle. The White Temple, Blue Temple, and surrounding hill tribe villages make it one of the most visually distinct destinations in Asia.", highlights: [{ label: 'Best For', value: 'Temples & trekking' }, { label: 'Best Season', value: 'Nov – Feb' }, { label: 'Vibe', value: 'Mystical & offbeat' }, { label: 'Suggested Stay', value: '2–3 days' }] },
  'Ayutthaya':   { tagline: "Ancient ruins of Thailand's golden capital", about: "Once one of the largest cities on earth, Ayutthaya's ruined temples and headless Buddha statues span a river island 80km from Bangkok — a living open-air museum of Thai history.", highlights: [{ label: 'Best For', value: 'History & cycling' }, { label: 'Best Season', value: 'Nov – Feb' }, { label: 'Vibe', value: 'Cultural & reflective' }, { label: 'Suggested Stay', value: '1–2 days' }] },
  'Hua Hin':     { tagline: 'Royal coast, golf & quiet beach days', about: "Thailand's oldest beach resort town has been the royal family's seaside retreat for a century. A long calm beach, colonial-era hotel, night markets, and golf make it a reliable retreat.", highlights: [{ label: 'Best For', value: 'Families & relaxation' }, { label: 'Best Season', value: 'Apr – Oct' }, { label: 'Vibe', value: 'Relaxed & royal' }, { label: 'Suggested Stay', value: '2–3 days' }] },
  'Pai':         { tagline: 'Mountain mist, waterfalls & hippie vibes', about: 'The 762 curves of the mountain road are worth it. This small valley town in Mae Hong Son draws free spirits with hot springs, waterfalls, canyon overlooks, and creative café culture.', highlights: [{ label: 'Best For', value: 'Nature & slow travel' }, { label: 'Best Season', value: 'Nov – Feb' }, { label: 'Vibe', value: 'Bohemian & serene' }, { label: 'Suggested Stay', value: '2–4 days' }] },
  'Koh Lanta':   { tagline: "Laid-back reefs, mangroves & long evenings", about: "Krabi's quieter sibling — a long island of undeveloped beaches, mangrove-edged roads, and a charming old town on stilts above the sea. Ideal for slowing down.", highlights: [{ label: 'Best For', value: 'Snorkelling & kayaking' }, { label: 'Best Season', value: 'Nov – Apr' }, { label: 'Vibe', value: 'Unhurried & natural' }, { label: 'Suggested Stay', value: '3–5 days' }] },
};

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

const SLOT_TIMES = {
  Morning: '07:00 – 10:00',
  Afternoon: '13:00 – 16:00',
  Evening: '19:00 – 22:00',
};

const CATEGORY_TIPS = {
  Adventure: 'Start early to beat the heat. Bring water and sunscreen.',
  Culture: 'Dress modestly. Remove shoes before entering temples.',
  Dining: 'Arrive before the rush or book a table in advance.',
  Nature: 'Cooler and quieter in the morning — ideal timing.',
  Lifestyle: 'Perfect for slow exploration and people-watching.',
  Sports: 'Check local conditions and equipment hire beforehand.',
  Luxury: 'Smart casual dress code often applies — plan accordingly.',
  Sightseeing: 'Golden hour light transforms the scenery — worth the wait.',
};

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
  const chartH = 100;
  const labelH = 28;
  const totalH = chartH + labelH;
  const padding = 40;
  const points = hourly.map((temp, i) => ({
    x: (i / (hourly.length - 1)) * (width - padding * 2) + padding,
    y: chartH - padding - ((temp - min) / range) * (chartH - padding * 2),
    temp, hour: i + 6,
  }));
  const pathData = points.reduce((acc, p, i) => i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`, "");
  const timeLabels = [
    { hour: 6, label: '6am' }, { hour: 9, label: '9am' }, { hour: 12, label: '12pm' },
    { hour: 15, label: '3pm' }, { hour: 18, label: '6pm' }, { hour: 21, label: '9pm' },
  ].map(({ hour, label }) => ({ label, x: points[hour - 6]?.x ?? 0 }));

  return (
    <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden relative mb-10">
      <div className="flex justify-between items-end mb-6">
        <div><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-1">Atmosphere Pulse</h4><p className="text-3xl font-black italic tracking-tighter uppercase text-white">{hoverIndex !== null ? `${points[hoverIndex].temp}°C` : `${max}°C Peak`}</p></div>
        <div className="text-right text-[10px] font-black uppercase tracking-widest text-white/50">{hoverIndex !== null ? `${points[hoverIndex].hour}:00` : 'Today'}</div>
      </div>
      <div className="relative group">
        <svg viewBox={`0 0 ${width} ${totalH}`} className="w-full overflow-visible" style={{ height: '7rem' }}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fbbf24" /><stop offset="50%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
          <motion.path d={pathData} fill="none" stroke="url(#g)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          {/* Time labels */}
          {timeLabels.map(({ label, x }) => (
            <text key={label} x={x} y={totalH - 4} textAnchor="middle" fontSize="20" fontWeight="700" letterSpacing="2" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif" style={{ textTransform: 'uppercase' }}>{label}</text>
          ))}
          {/* Hover interaction */}
          {points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
              <rect x={p.x - 15} y="0" width="30" height={chartH} fill="transparent" />
              {hoverIndex === i && (<><circle cx={p.x} cy={p.y} r="6" fill="#14b8a6" /><line x1={p.x} y1={p.y + 10} x2={p.x} y2={chartH} stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 4" /></>)}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// --- Sub-Components ---
const SPLASH_DESTINATIONS = ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Koh Samui', 'Chiang Rai'];

const SplashScreen = ({ onComplete }) => {
  const [destIndex, setDestIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => setDestIndex(i => (i + 1) % SPLASH_DESTINATIONS.length), 420);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onComplete, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center font-black text-xl mb-8 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          TML
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="text-[clamp(3.5rem,12vw,7rem)] font-black italic tracking-[-0.05em] uppercase leading-none mb-4"
        >
          TRVLTOO
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-[10px] font-black uppercase tracking-[0.45em] mb-10"
        >
          AI Travel Planner · Southeast Asia
        </motion.p>

        {/* Cycling destination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="h-6 flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={destIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-teal-400 text-[11px] font-black uppercase tracking-[0.4em]"
            >
              {SPLASH_DESTINATIONS[destIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-teal-500 origin-left"
          style={{ scaleX: progress, transformOrigin: 'left' }}
        />
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
        {user && (
          <button onClick={() => setView('trips')} className={`text-xs font-black uppercase tracking-[0.3em] transition-colors ${currentView === 'trips' ? 'text-teal-500' : 'text-slate-400 hover:text-white'}`}>My Trips</button>
        )}
      </nav>
    </div>
    <div className="flex items-center space-x-4">
       <button onClick={onToggleTheme} className="p-3 rounded-2xl bg-white/10">{isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}</button>
       {user ? (
         <div className="hidden md:flex items-center gap-3">
           {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full border-2 border-teal-500/40" />}
           <button onClick={onSignOut} title="Sign out" className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">
             <LogOut className="w-4 h-4 text-slate-400" />
           </button>
         </div>
       ) : (
         <button onClick={onSignIn} className="hidden md:block px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest">Sign In</button>
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

const ItineraryCard = ({ activity, isLocked, onToggleLock, slot }) => (
  <motion.div layout className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 group">
    <div className="h-52 overflow-hidden relative">
      <img
        src={activity.image || THAILAND_PLACEHOLDERS[0]}
        alt={activity.title}
        onError={e => { e.target.src = THAILAND_PLACEHOLDERS[Math.abs(activity.id?.charCodeAt(0) ?? 0) % THAILAND_PLACEHOLDERS.length]; }}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {slot && (
        <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{SLOT_TIMES[slot]}</span>
        </div>
      )}
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
      {(activity.duration || activity.cost) && (
        <div className="flex items-center gap-3 pt-1">
          {activity.duration && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-white/50">
              <Clock className="w-3 h-3" />{activity.duration}
            </span>
          )}
          {activity.cost && (
            <span className="text-[10px] font-bold text-teal-400/80">{activity.cost}</span>
          )}
        </div>
      )}
      {(activity.tip || CATEGORY_TIPS[activity.category]) && (
        <p className="text-[11px] text-white/40 leading-relaxed border-t border-white/8 pt-3 mt-1">
          {activity.tip || CATEGORY_TIPS[activity.category]}
        </p>
      )}
    </div>
  </motion.div>
);

const SlotSection = ({ label, color, activity, isLocked, onToggleLock, onReroll, canReroll, slot }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${color}`}>{label}</span>
        <div className="h-px w-12 bg-white/10" />
        <span className="text-[9px] text-white/30 uppercase tracking-widest">{SLOT_TIMES[slot]}</span>
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
      <ItineraryCard activity={activity} isLocked={isLocked} onToggleLock={onToggleLock} slot={slot} />
    ) : (
      <div className="h-52 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">No activities found</span>
      </div>
    )}
  </div>
);

const ArrivalStrip = ({ selected, onSelect }) => {
  const [calOpen, setCalOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quickDates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const toKey = (d) => d.toISOString().split('T')[0];
  const isQuick = quickDates.some(d => toKey(d) === selected);
  const calSelected = !isQuick && selected ? selected : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">02. Select Arrival</h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Quick pills — today through +5 */}
      <div className="grid grid-cols-6 gap-2">
        {quickDates.map((date, i) => {
          const key = toKey(date);
          const isSelected = selected === key;
          return (
            <motion.button
              key={i}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                  : 'border-white/15 bg-white/5 hover:border-teal-500/60'
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">
                {i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-xl font-black tracking-tight">{date.getDate()}</span>
              <span className="text-[9px] opacity-40 mt-0.5">
                {date.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Future date button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCalOpen(true)}
        className={`w-full py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 ${
          calSelected
            ? 'border-teal-500 bg-teal-500/10 text-teal-400'
            : 'border-white/15 hover:border-teal-500/50 text-white/50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
          {calSelected
            ? new Date(calSelected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            : 'Pick a future date'}
        </span>
      </motion.button>

      {/* Popup calendar */}
      <AnimatePresence>
        {calOpen && (
          <PopupCalendar
            selected={selected}
            minDate={toKey(new Date(today.getTime() + 6 * 86400000))}
            onSelect={(d) => { onSelect(d); setCalOpen(false); }}
            onClose={() => setCalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PopupCalendar = ({ selected, minDate, onSelect, onClose }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initDate = selected && selected >= minDate ? new Date(selected + 'T00:00:00') : new Date(minDate + 'T00:00:00');
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const toKey = (d) => d.toISOString().split('T')[0];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="text-sm font-black uppercase tracking-widest text-white">{monthName}</span>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-2">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest opacity-30 py-1">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = new Date(viewYear, viewMonth, i + 1);
            const key = toKey(d);
            const isPast = key < minDate;
            const isSel = key === selected;
            const isToday = key === toKey(today);
            return (
              <motion.button
                key={key}
                whileHover={!isPast ? { scale: 1.15 } : {}}
                whileTap={!isPast ? { scale: 0.95 } : {}}
                disabled={isPast}
                onClick={() => !isPast && onSelect(key)}
                className={`aspect-square rounded-xl text-sm font-bold transition-all ${
                  isSel
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : isToday
                    ? 'border border-teal-500/50 text-teal-400'
                    : isPast
                    ? 'opacity-15 cursor-not-allowed'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                {i + 1}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/15 text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AreaSelector = ({ destination, selected, onSelect }) => {
  const areas = getDestinationAreas(destination);
  if (!areas.length) return null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {areas.map(area => (
          <motion.button
            key={area}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(selected === area ? '' : area)}
            className={`px-5 py-3 rounded-[2rem] border-2 text-[11px] font-black uppercase tracking-widest transition-all ${
              selected === area
                ? 'border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                : 'border-slate-200 dark:border-white/20 bg-white dark:bg-white/10 text-slate-600 dark:text-white/60 hover:border-teal-400'
            }`}
          >
            {area}
          </motion.button>
        ))}
      </div>
      {selected && (
        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-bold uppercase tracking-widest text-teal-500 opacity-70">
          Activities near {selected} will be prioritised — re-roll anytime to explore further.
        </motion.p>
      )}
    </div>
  );
};

const KnowledgePanel = ({ destId }) => {
  const k = KNOWLEDGE_BASE[destId];
  if (!k) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Local Intelligence</h3>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      {/* When to Go */}
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

      {/* Grid: Transport + Stay */}
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

      {/* Eat / Do / Avoid */}
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

      {/* Local Tip */}
      <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20">
        <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-1">Local Tip</p>
          <p className="text-sm text-amber-200/80 leading-relaxed">{k.localTip}</p>
        </div>
      </div>
    </div>
  );
};

const DestinationDetail = ({ destId, onBack, onPlan }) => {
  const info = DESTINATION_INFO[destId] || {};
  const loc = LOCATIONS.find(l => l.id === destId) || {};
  const featured = FEATURE_DATA[destId];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 rotate-180" /> All Destinations
        </button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onPlan}
          className="px-8 py-3 rounded-full bg-teal-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors">
          Plan My Day Here →
        </motion.button>
      </div>

      {/* Hero */}
      <div className="relative h-[28rem] rounded-[3rem] overflow-hidden">
        <img src={loc.image} alt={destId}
          onError={e => { e.target.src = THAILAND_PLACEHOLDERS[0]; }}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{loc.desc}</p>
          <h1 className="text-white text-6xl font-black italic uppercase tracking-tighter leading-none">{destId}</h1>
          <p className="text-white/60 text-sm mt-2 font-medium">{info.tagline}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(info.highlights || []).map(h => (
          <div key={h.label} className="p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">{h.label}</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{h.value}</p>
          </div>
        ))}
      </div>

      {/* About */}
      <p className="text-base leading-relaxed text-slate-600 dark:text-white/60 max-w-2xl">{info.about}</p>

      {/* Knowledge Base */}
      <KnowledgePanel destId={destId} />

      {/* Activity Preview */}
      {featured && (
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Things To Do</h3>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>
          {['Morning', 'Afternoon', 'Evening'].map(slot => (
            <div key={slot} className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">{slot}</p>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                {(featured[slot] || []).map((act, i) => (
                  <div key={act.id} className="flex-shrink-0 w-56 rounded-[2rem] overflow-hidden border border-white/10 bg-white dark:bg-white/5">
                    <div className="h-32 overflow-hidden">
                      <img src={act.image || THAILAND_PLACEHOLDERS[i % THAILAND_PLACEHOLDERS.length]} alt={act.title}
                        onError={e => { e.target.src = THAILAND_PLACEHOLDERS[i % THAILAND_PLACEHOLDERS.length]; }}
                        className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-teal-500">{act.category}</span>
                      <p className="text-sm font-black italic uppercase tracking-tight text-slate-900 dark:text-white leading-tight mt-1">{act.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{act.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center pt-6">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onPlan}
          className="px-20 py-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-2xl uppercase italic tracking-tighter shadow-2xl hover:bg-slate-800 dark:hover:bg-white/90 transition-colors">
          Plan My Day in {destId}
        </motion.button>
      </div>
    </motion.section>
  );
};

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
    const url = `${window.location.origin}/trvltoo/trip/${savedId}`;
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

  useEffect(() => { try { performSecurityStartupAudit(); } catch (err) { console.error("🚨 CRITICAL SYSTEM HALT:", err.message); } }, []);
  useEffect(() => { if (form.noctourism) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [form.noctourism]);
  // Preload Firestore activity pool whenever destination changes
  useEffect(() => {
    setActivityPool([]);
    fetchActivitiesPool(form.destination).then(setActivityPool);
  }, [form.destination]);
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
    'Generated by TRVLTOO — https://mnotice.github.io/trvltoo/',
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
          <h2 className="text-5xl font-black italic uppercase leading-[0.9] mb-4">Explore <span className="text-teal-500">Coordinates</span></h2>
          <p className="text-sm opacity-60">Choose a destination to see what's waiting for you.</p>
        </div>

        <div className="space-y-12">
          <div className="flex items-center space-x-4"><h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">01. Destination</h3><div className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div>
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
        { num: '03', label: 'Who You\'re With' },
        { num: '04', label: 'Your Interests' },
        { num: '05', label: 'Energy Level' },
        { num: '06', label: 'Budget' },
        { num: '07', label: 'Trip Mode' },
      ];
      const isLast = planStep === STEPS.length - 1;
      const toggleInterest = (id) => updateForm('interests', form.interests.includes(id) ? form.interests.filter(i => i !== id) : [...form.interests, id]);

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
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">When are you <span className="text-teal-500">arriving</span> in {form.destination}?</h2>
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
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">Where are you <span className="text-teal-500">staying</span> in {form.destination}?</h2>
            </div>
            <div className="pt-4">
              {getDestinationAreas(form.destination).length > 0 ? (
                <AreaSelector destination={form.destination} selected={form.area} onSelect={(a) => updateForm('area', a)} />
              ) : (
                <p className="text-white/40 italic text-sm">Area data coming soon for {form.destination} — we'll surface the best activities regardless.</p>
              )}
            </div>
          </div>
        );
        if (planStep === 2) return (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">03 — Who You're With</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">Who are you <span className="text-teal-500">travelling with?</span></h2>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { id: 'Solo',     icon: '🧍', label: 'Solo', desc: 'Flying free, your own pace' },
                { id: 'Friends',  icon: '👥', label: 'With Friends', desc: 'Small group, flexible plans' },
                { id: 'Couple',   icon: '💑', label: 'Couple', desc: 'Shared moments, romantic finds' },
                { id: 'Flexible', icon: '🤷', label: 'Flexible', desc: 'Alone now, open to company' },
              ].map(({ id, icon, label, desc }) => (
                <motion.button key={id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => updateForm('groupContext', id)}
                  className={`p-6 rounded-[2.5rem] border-2 text-left transition-all ${form.groupContext === id ? 'border-teal-500 bg-teal-500 text-white shadow-xl shadow-teal-500/20' : 'border-white/20 bg-white/10 hover:border-teal-500/50'}`}>
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
                  <motion.button key={id} whileTap={{ scale: 0.95 }}
                    onClick={() => updateForm('dietary', id)}
                    className={`px-5 py-3 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all ${form.dietary === id ? 'border-teal-500 bg-teal-500 text-white' : 'border-white/20 bg-white/10 hover:border-teal-500/50'}`}>
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
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">What are you <span className="text-teal-500">into?</span></h2>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {[
                { id: 'Nature', emoji: '🌿' },
                { id: 'Food', emoji: '🍜' },
                { id: 'Culture', emoji: '🏛️' },
                { id: 'Adventure', emoji: '🧗' },
                { id: 'Nightlife', emoji: '🌙' },
                { id: 'Wellness', emoji: '🧘' },
                { id: 'Shopping', emoji: '🛍️' },
                { id: 'Photography', emoji: '📷' },
                { id: 'History', emoji: '🏺' },
                { id: 'Water Sports', emoji: '🤿' },
              ].map(({ id, emoji }) => {
                const active = form.interests.includes(id);
                return (
                  <motion.button key={id} whileTap={{ scale: 0.93 }}
                    onClick={() => toggleInterest(id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 text-[11px] font-black uppercase tracking-wider transition-all ${active ? 'border-teal-500 bg-teal-500 text-white' : 'border-white/20 bg-white/10 hover:border-teal-500/50'}`}>
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
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">How <span className="text-teal-500">intense</span> should this day be?</h2>
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
                <span className="text-7xl font-black italic text-teal-500 tracking-tighter leading-none">{form.energy}<span className="text-3xl opacity-40">/10</span></span>
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
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">What's your <span className="text-teal-500">daily spend</span> comfort zone?</h2>
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
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9]">Day or <span className="text-teal-500">night</span> first?</h2>
            </div>
            <div className="pt-4 space-y-6">
              <div onClick={() => updateForm('noctourism', !form.noctourism)} className={`p-8 rounded-[3.5rem] border-2 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-md ${form.noctourism ? 'border-indigo-500 bg-indigo-500 text-white shadow-xl shadow-indigo-500/30' : 'border-slate-200 dark:border-white/20 bg-white/10 hover:border-teal-400'}`}>
                <div className="flex items-center space-x-6">
                  <div className={`p-5 rounded-2xl ${form.noctourism ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-teal-600'}`}>{form.noctourism ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />}</div>
                  <div>
                    <h4 className="font-black text-2xl italic uppercase tracking-tighter">Noctourism</h4>
                    <p className={`text-xs mt-1 ${form.noctourism ? 'text-white/70' : 'opacity-40'}`}>{form.noctourism ? 'Night-forward itinerary' : 'Daytime-first itinerary'}</p>
                  </div>
                </div>
                <div className={`w-16 h-8 rounded-full p-1.5 transition-colors ${form.noctourism ? 'bg-white/40' : 'bg-slate-200 dark:bg-slate-800'}`}>
                  <motion.div animate={{ x: form.noctourism ? 32 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-lg" />
                </div>
              </div>
              {form.noctourism && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-8 rounded-[3rem] bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Night Pressure</h3>
                    <span className="text-3xl font-black italic text-indigo-400">{form.nightIntensity}/10</span>
                  </div>
                  <input type="range" min="1" max="10" step="1" value={form.nightIntensity} onChange={(e) => updateForm('nightIntensity', parseInt(e.target.value))} className="w-full h-4 bg-indigo-500/20 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                </motion.div>
              )}
            </div>
          </div>
        );
      };

      return (
        <section className="max-w-2xl mx-auto space-y-10 py-8">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <button onClick={() => setView('explore')} className="px-5 py-2 rounded-full border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/10">
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

          {/* Step content */}
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

          {/* Rate limit error */}
          <AnimatePresence>
            {genError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm font-bold text-center"
              >
                {genError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
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
                className={`px-16 py-6 rounded-full font-black text-xl uppercase italic tracking-tighter shadow-2xl transition-all ${form.noctourism ? 'bg-indigo-500 text-white shadow-indigo-500/40 hover:bg-indigo-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
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
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSignIn}
            className="px-12 py-5 rounded-full bg-teal-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-400 transition-all">
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
              <button onClick={() => setView('explore')} className="px-8 py-3 rounded-full border-2 border-teal-500/30 text-teal-500 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/10 transition-all">
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
      
      <Header currentView={view} isDark={form.noctourism} onToggleTheme={() => updateForm('noctourism', !form.noctourism)} setView={setView} user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
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

              {/* AI Insight */}
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

              {/* Weather */}
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
