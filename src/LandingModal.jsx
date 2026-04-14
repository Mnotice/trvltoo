import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Map, Dices, SunMedium, ArrowRight, X } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome to TRVLTOO",
    description: "Your intelligent companion for crafting the perfect travel day, wherever you are.",
    icon: Plane,
    color: "bg-teal-500"
  },
  {
    title: "Pick Your Vibe",
    description: "Tell us where you're going and what kind of traveler you are. We'll handle the rest.",
    icon: Map,
    color: "bg-amber-500"
  },
  {
    title: "Refine Your Day",
    description: "Lock the activities you love and re-roll the ones you don't. Your day, your way.",
    icon: Dices,
    color: "bg-indigo-500"
  },
  {
    title: "Weather Smart",
    description: "We automatically adjust your itinerary based on real-time heat and rain forecasts.",
    icon: SunMedium,
    color: "bg-orange-500"
  }
];

const LandingModal = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for initial logo animation
  
  useEffect(() => {
    // Initial logo stays for 1.5 seconds then moves to first step
    const timer = setTimeout(() => {
      setCurrentStep(0);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const skipToTool = () => {
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl p-4 md:p-6"
    >
      <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white dark:border-slate-800 backdrop-saturate-150">
        
        {/* Background Decorative Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <AnimatePresence mode="wait">
          {currentStep === -1 ? (
            <motion.div
              key="logo-fader"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)', transition: { duration: 0.8 } }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-[450px] flex flex-col items-center justify-center p-12 text-center relative z-10"
            >
              <motion.div
                initial={{ rotate: -15, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-7 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(20,184,166,0.5)] mb-10"
              >
                <Map className="w-20 h-20" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-6xl font-black tracking-[0.15em] text-slate-900 dark:text-white uppercase italic">
                TRVL<span className="text-teal-500">TOO</span>
              </h1>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
                <p className="text-slate-400 dark:text-slate-500 font-bold tracking-[0.3em] text-xs uppercase px-2">
                  Elevate Your Journey
                </p>
                <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="p-10 md:p-14 flex flex-col items-center text-center relative z-10"
            >
              <button 
                onClick={skipToTool}
                className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all active:scale-90 group"
                aria-label="Skip"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <motion.div 
                layoutId="step-icon"
                className={`w-28 h-28 ${TUTORIAL_STEPS[currentStep].color} text-white rounded-[2.2rem] flex items-center justify-center mb-10 shadow-2xl relative overflow-hidden group`}
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 blur-2xl" 
                />
                {React.createElement(TUTORIAL_STEPS[currentStep].icon, { className: "w-14 h-14 relative z-10 drop-shadow-lg" })}
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-black text-slate-900 dark:text-white mb-5 tracking-tight"
              >
                {TUTORIAL_STEPS[currentStep].title}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-12 font-medium"
              >
                {TUTORIAL_STEPS[currentStep].description}
              </motion.p>

              {/* Step indicator */}
              <div className="flex space-x-3 mb-12">
                {TUTORIAL_STEPS.map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ 
                      width: i === currentStep ? 40 : 12,
                      backgroundColor: i === currentStep ? '#14b8a6' : (i < currentStep ? '#94a3b8' : '#e2e8f0')
                    }}
                    className="h-2 rounded-full transition-all duration-300" 
                  />
                ))}
              </div>

              <div className="w-full flex flex-col space-y-4">
                <button
                  onClick={handleNext}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[1.8rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
                >
                  <span>{currentStep === TUTORIAL_STEPS.length - 1 ? "Get Started" : "Continue"}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {currentStep < TUTORIAL_STEPS.length - 1 && (
                  <button
                    onClick={skipToTool}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-bold transition-colors py-3 text-sm uppercase tracking-widest"
                  >
                    Skip to Tool
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LandingModal;
