import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
  id = 'app-modal',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  }[maxWidth];

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          id={id} 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Dialog with Pinned Layout Architecture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidthClass} max-h-[92vh] flex flex-col bg-white rounded-[20px] border-2 border-[#E5E5E5] border-b-4 shadow-2xl overflow-hidden z-10`}
          >
            {/* Pinned Fixed Header (shrink-0) */}
            <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b-2 border-[#E5E5E5] bg-white">
              <div className="min-w-0 pr-3">
                <h3 className="text-lg font-extrabold text-[#3C3C3C] leading-snug truncate">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#777777] font-semibold mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="shrink-0 p-1.5 text-[#777777] hover:text-[#3C3C3C] rounded-[10px] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Independent Scrollable Body (flex-1 overflow-y-auto) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {children}
            </div>

            {/* Fixed Action Footer (shrink-0) */}
            {footer && (
              <div className="shrink-0 px-5 py-3.5 border-t-2 border-[#E5E5E5] bg-[#FAFBF9] flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
