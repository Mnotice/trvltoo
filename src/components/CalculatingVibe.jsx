import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import { LOADING_MESSAGES } from '../data/ui';

export default function CalculatingVibe({ messageIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="mb-10"
      >
        <Compass className="w-16 h-16 text-teal-500" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-black italic uppercase text-teal-500"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
