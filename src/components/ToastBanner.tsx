import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useStore } from '../store';

export default function ToastBanner() {
  const { toast, clearToast } = useStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#141416] text-white border border-white/10 px-4 py-3 rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.28)] max-w-md"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#80CBC4] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="text-xs font-sans font-medium leading-snug">{toast.message}</span>
          <button
            type="button"
            onClick={clearToast}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
