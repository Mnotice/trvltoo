import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Dices, Star, Coffee, Sun, Moon, Copy, Check, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchItinerary } from './apiService';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-2 z-50 relative"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

// Fallback pool in case RapidAPI key is rate-limited or disabled
const fallbackPool = {
  Krabi: {
    Morning: [
      { id: 'k_m1', title: 'Tiger Cave Temple Climb', subtitle: 'A challenging climb with rewarding views', category: 'Activity', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800&h=400' },
      { id: 'k_m2', title: 'Ao Nang Beach Walk', subtitle: 'Relaxing morning stroll along the coast', category: 'Activity', image: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?auto=format&fit=crop&q=80&w=800&h=400' }
    ],
    Afternoon: [
      { id: 'k_a1', title: 'Railay Beach Rock Climbing', subtitle: 'Climb the iconic limestone cliffs', category: 'Activity', image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800&h=400' },
      { id: 'k_a2', title: 'Four Islands Boat Tour', subtitle: 'Explore the stunning nearby islands', category: 'Activity', image: 'https://images.unsplash.com/photo-1605008542797-09d30c5e7cde?auto=format&fit=crop&q=80&w=800&h=400' }
    ],
    Evening: [
      { id: 'k_e1', title: 'Night Market Street Food', subtitle: 'Sample various local delicacies', category: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800&h=400' },
      { id: 'k_e2', title: 'Sunset Dinner Cruise', subtitle: 'Romantic dinner on the water', category: 'Food', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800&h=400' }
    ]
  },
  Phuket: {
    Morning: [
      { id: 'p_m1', title: 'Big Buddha Visit', subtitle: 'Iconic landmark with panoramic views', category: 'Activity', image: 'https://images.unsplash.com/photo-1603566195729-1981615fcc65?auto=format&fit=crop&q=80&w=800&h=400' },
      { id: 'p_m2', title: 'Old Phuket Town Walk', subtitle: 'Explore Sino-Portuguese architecture', category: 'Activity', image: 'https://images.unsplash.com/photo-1627885012579-24b9a9572de6?auto=format&fit=crop&q=80&w=800&h=400' }
    ],
    Afternoon: [
      { id: 'p_a1', title: 'Phang Nga Bay Tour', subtitle: 'See James Bond Island', category: 'Activity', image: 'https://images.unsplash.com/photo-1605008542797-09d30c5e7cde?auto=format&fit=crop&q=80&w=800&h=400' },
      { id: 'p_a2', title: 'Elephant Sanctuary', subtitle: 'Ethical elephant interaction', category: 'Activity', image: 'https://images.unsplash.com/photo-1582209675230-f4342410a623?auto=format&fit=crop&q=80&w=800&h=400' }
    ],
    Evening: [
      { id: 'p_e1', title: 'Patong Beach Walking Street', subtitle: 'Vibrant nightlife and food', category: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800&h=400' },
      { id: 'p_e2', title: "Mom Tri's Kitchen", subtitle: 'Fine dining with a view', category: 'Food', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800&h=400' }
    ]
  }
};

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

function useItinerary() {
  const [location, setLocation] = useState('Krabi');
  const [itinerary, setItinerary] = useState({});
  const [lockedItems, setLockedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dataPool, setDataPool] = useState(fallbackPool['Krabi']);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      
      // Attempt RapidAPI Foursquare Fetch
      let fetchedData = await fetchItinerary(location);
      
      // Keep data safe if API breaks (or key has no access)
      if (!fetchedData || !fetchedData.Morning || fetchedData.Morning.length === 0) {
        fetchedData = fallbackPool[location] || fallbackPool['Krabi'];
      }

      if (!active) return;
      
      setDataPool(fetchedData);
      
      const newItinerary = {};
      const newLockedItems = {};
      
      TIME_SLOTS.forEach(slot => {
        newItinerary[slot] = fetchedData[slot]?.[0] || null;
        newLockedItems[slot] = false;
      });
      
      setItinerary(newItinerary);
      setLockedItems(newLockedItems);
      setIsLoading(false);
    };

    loadData();

    return () => { active = false; };
  }, [location]);

  const toggleLock = useCallback((slot) => {
    setLockedItems(prev => ({ ...prev, [slot]: !prev[slot] }));
  }, []);

  const reRoll = useCallback((slot) => {
    if (lockedItems[slot] || !dataPool) return;

    const currentItem = itinerary[slot];
    const categoryPool = dataPool[slot] || [];
    const availableItems = categoryPool.filter(item => item.id !== currentItem?.id);
    
    if (availableItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      setItinerary(prev => ({
        ...prev,
        [slot]: availableItems[randomIndex]
      }));
    }
  }, [itinerary, dataPool, lockedItems]);

  return {
    location,
    setLocation,
    itinerary,
    lockedItems,
    toggleLock,
    reRoll,
    isLoading
  };
}

const getSlotIcon = (slot) => {
  switch (slot) {
    case 'Morning': return <Coffee className="w-5 h-5 text-amber-500" />;
    case 'Afternoon': return <Sun className="w-5 h-5 text-orange-500" />;
    case 'Evening': return <Moon className="w-5 h-5 text-indigo-500" />;
    default: return null;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const TopographyPattern = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <pattern id="topo" width="80" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 20 Q 20 0, 40 20 T 80 20 M0 0 Q 20 -20, 40 0 T 80 0 M0 40 Q 20 20, 40 40 T 80 40" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M-20 10 Q 0 -10, 20 10 T 60 10 T 100 10 M-20 30 Q 0 10, 20 30 T 60 30 T 100 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#topo)" />
  </svg>
);

export default function App() {
  const { location, setLocation, itinerary, lockedItems, toggleLock, reRoll, isLoading } = useItinerary();
  const [copied, setCopied] = useState(false);

  const exportToNotes = () => {
    let md = `# My Perfect Day in ${location}\n\n`;
    TIME_SLOTS.forEach(slot => {
      const item = itinerary[slot];
      if (item) {
        md += `## ${slot}\n**${item.title}** (${item.category})\n*${item.subtitle}*\n\n`;
      }
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      {/* Absolute Positioned Background SVG Containers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-between">
        <div className="w-[30%] h-full opacity-10 dark:opacity-[0.04]">
          <TopographyPattern className="text-teal-600 dark:text-slate-300" />
        </div>
        <div className="w-[30%] h-full opacity-10 dark:opacity-[0.04] scale-x-[-1]">
          <TopographyPattern className="text-teal-600 dark:text-slate-300" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-teal-100 dark:border-slate-800 transition-colors">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-500 text-white p-2 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">trvltoo</h1>
          </div>
          
          <div className="flex items-center">
            {/* Location Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl transition-colors">
              {['Krabi', 'Phuket'].map(loc => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location === loc 
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 mt-8 pb-12 relative z-10">
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 transition-colors">Your Perfect Day in {location}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors">Curated activities to match your style. Re-roll until it's perfect.</p>
          </motion.div>
        </div>

        {/* Loading Spinner or Timeline */}
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <Leaf className="w-12 h-12 text-teal-500 animate-pulse mb-6 drop-shadow-md" />
            <span className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide text-lg">Foraging for the best spots...</span>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-100 dark:before:from-teal-900 before:via-teal-200 dark:before:via-teal-800 before:to-transparent"
          >
            {TIME_SLOTS.map((slot) => {
              const item = itinerary[slot];
              if (!item) return null;
              const isLocked = lockedItems[slot];

              return (
                <motion.div 
                  key={slot}
                  variants={itemVariants}
                  layout
                  className="relative flex flex-col md:flex-row items-start md:items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  
                  {/* Timeline Node */}
                  <motion.div layout className="flex items-center justify-center w-12 h-12 absolute left-0 md:relative md:left-auto rounded-full border-4 border-slate-50 dark:border-slate-900 bg-teal-50 dark:bg-slate-800 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors ml-0 md:ml-0">
                    {getSlotIcon(slot)}
                  </motion.div>

                  {/* Card Container */}
                  <div className="flex-1 w-full pl-16 md:pl-0 md:w-[calc(50%-3rem)] md:p-4">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(4px)' }}
                        transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                        className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-teal-500/5 group border border-teal-50 dark:border-slate-700 hover:border-teal-100 dark:hover:border-slate-600 transition-colors w-full"
                      >
                        {/* Card Image Header */}
                        <div className="h-48 w-full relative">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                            <span className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-1">
                              {slot} · {item.category}
                            </span>
                          </div>
                          
                          {/* Actions Overlay */}
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                              onClick={() => toggleLock(slot)}
                              className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                                isLocked 
                                  ? 'bg-amber-400 text-white' 
                                  : 'bg-white/20 text-white hover:bg-white/40'
                              }`}
                              aria-label={isLocked ? "Unlock item" : "Lock item"}
                            >
                              <Star className="w-5 h-5" fill={isLocked ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 md:p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight block transition-colors">{item.title}</h3>
                              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed transition-colors line-clamp-2">{item.subtitle}</p>
                            </div>
                            <button
                              onClick={() => reRoll(slot)}
                              disabled={isLocked}
                              className={`shrink-0 p-3 rounded-2xl transition-all duration-300 ${
                                isLocked 
                                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                                  : 'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-95'
                              }`}
                              aria-label="Re-roll activity"
                            >
                              <Dices className={`w-6 h-6 ${isLocked ? '' : 'group-hover:rotate-12 transition-transform'}`} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Action Button: Export to Notes */}
        {!isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center pb-8 border-t border-teal-100 dark:border-slate-800 pt-8 transition-colors"
          >
            <button 
              onClick={exportToNotes}
              className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-teal-500/30 transition-all active:scale-95"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Export to Notes'}</span>
            </button>
          </motion.div>
        )}

      </main>
    </div>
  );
}
