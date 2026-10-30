'use client';
import { AnimatePresence, motion } from 'motion/react';

// Feedback after copy, download or add: rises in, and now also leaves instead of vanishing.
export default function CueToast({ text }) {
  return (
    <AnimatePresence>
      {text ? (
        <motion.div
          key={text}
          role="status"
          initial={{ opacity: 0, y: 8, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 8, x: '-50%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 bottom-[92px] z-60 rounded-full bg-ink px-[18px] py-2.5 text-sm font-semibold text-[#09090b]"
        >
          {text}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
