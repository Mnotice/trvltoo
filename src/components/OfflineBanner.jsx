import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 py-2.5 bg-amber-500/95 backdrop-blur-sm text-slate-950 text-[11px] font-black uppercase tracking-widest"
        >
          <WifiOff className="w-3.5 h-3.5" />
          You're offline — cached content only
        </motion.div>
      )}
    </AnimatePresence>
  );
}
