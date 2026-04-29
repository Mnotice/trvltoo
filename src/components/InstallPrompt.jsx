import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-black/40 max-w-sm w-[calc(100%-3rem)]"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-black uppercase tracking-wider text-white leading-none mb-0.5">Install TRVLTOO</p>
            <p className="text-[11px] text-white/40">Add to home screen for offline access</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-xl bg-teal-500 text-white text-[11px] font-black uppercase tracking-wider hover:bg-teal-400 transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setVisible(false)}
              className="p-1.5 rounded-xl text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
