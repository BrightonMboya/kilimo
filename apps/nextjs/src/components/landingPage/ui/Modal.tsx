'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.98 },
};

export default function Modal({ open, onClose, children, className = '' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const posStyle = isRtl ? { left: '0.5rem' } : { right: '0.5rem' };

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
          role="dialog"
          aria-modal="true"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            variants={overlayVariants}
            onClick={onClose}
          />

          <motion.div
            className={`relative z-10 max-w-7xl w-full max-h-[90vh] h-full mx-4 p-2 bg-white rounded-xl shadow-xl ${className}`}
            variants={panelVariants}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              className="absolute top-2 text-gray-600 hover:text-gray-900 hover:cursor-pointer"
              style={posStyle}
              aria-label="Close"
              onClick={onClose}
            >
              <X />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
