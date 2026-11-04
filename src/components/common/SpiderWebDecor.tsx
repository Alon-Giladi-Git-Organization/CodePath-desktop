import React from 'react';
import { motion } from 'motion/react';

/**
 * SpiderWebCorner - A delicate, playful spiderweb decorative corner
 * that adds atmospheric charm to cards, headers, and modals.
 */
export const SpiderWebCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
  color?: string;
}> = ({ position = 'top-right', className = '', size = 56, color = '#58CC02' }) => {
  const rotation = {
    'top-right': 'rotate-0',
    'bottom-right': 'rotate-90',
    'bottom-left': 'rotate-180',
    'top-left': '-rotate-90',
  }[position];

  return (
    <div
      className={`pointer-events-none absolute z-10 opacity-40 hover:opacity-80 transition-opacity ${
        position.includes('top') ? 'top-0' : 'bottom-0'
      } ${position.includes('right') ? 'right-0' : 'left-0'} ${className}`}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transform ${rotation}`}
      >
        {/* Radial web spokes */}
        <line x1="100" y1="0" x2="0" y2="0" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="0" x2="100" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="0" x2="20" y2="80" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="100" y1="0" x2="50" y2="90" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="100" y1="0" x2="10" y2="40" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

        {/* Concentric curved spiral threads */}
        <path d="M 80,0 Q 82,20 100,20" stroke={color} strokeWidth="1.6" fill="none" strokeDasharray="3 2" />
        <path d="M 60,0 Q 64,38 100,40" stroke={color} strokeWidth="1.6" fill="none" />
        <path d="M 40,0 Q 48,60 100,60" stroke={color} strokeWidth="1.8" fill="none" strokeDasharray="4 2" />
        <path d="M 20,0 Q 32,80 100,80" stroke={color} strokeWidth="2" fill="none" />
        <path d="M 5,0 Q 15,96 100,98" stroke={color} strokeWidth="2" fill="none" strokeDasharray="3 3" />

        {/* Dew drops / micro sparkle circles on web nodes */}
        <circle cx="60" cy="18" r="2.5" fill="#FFE885" />
        <circle cx="44" cy="40" r="2.5" fill="#FFE885" />
        <circle cx="28" cy="62" r="3" fill="#1CB0F6" />
      </svg>
    </div>
  );
};

/**
 * SpiderDangler - A cute animated spider hanging from a silky strand.
 * Drops down with a spring bounce and swings slightly side-to-side.
 */
export const SpiderDangler: React.FC<{
  threadLength?: number;
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}> = ({ threadLength = 36, size = 'sm', className = '', onClick }) => {
  const isSm = size === 'sm';
  const spiderW = isSm ? 28 : 38;
  const spiderH = isSm ? 24 : 32;

  return (
    <motion.div
      initial={{ y: -threadLength, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      className={`inline-flex flex-col items-center select-none cursor-pointer group ${className}`}
      onClick={onClick}
      whileHover={{ y: 6 }}
      whileTap={{ scale: 0.9 }}
      title="Spidey: 'טווה את הרשת שלך!'"
    >
      {/* Silky web strand */}
      <motion.div
        animate={{ scaleY: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ height: threadLength }}
        className="w-[2px] bg-gradient-to-b from-[#58CC02]/40 via-[#58CC02] to-[#3C3C3C] origin-top"
      />

      {/* Spider Mascot Mini Body */}
      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
        style={{ width: spiderW, height: spiderH }}
      >
        <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* 8 Articulated legs */}
          <path d="M12 18 Q6 10 2 12" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 22 Q4 20 0 24" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 26 Q6 30 2 36" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 28 Q10 36 6 40" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />

          <path d="M36 18 Q42 10 46 12" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 22 Q44 20 48 24" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36 26 Q42 30 46 36" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M34 28 Q38 36 42 40" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Abdomen / Body */}
          <ellipse cx="24" cy="22" rx="14" ry="12" fill="#58CC02" stroke="#46A302" strokeWidth="2" />
          
          {/* Web pattern on spider back */}
          <path d="M24 12 L24 32 M14 22 L34 22" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
          <circle cx="24" cy="22" r="5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />

          {/* Big Cheerful Eyes */}
          <circle cx="19" cy="18" r="3.5" fill="#FFFFFF" />
          <circle cx="29" cy="18" r="3.5" fill="#FFFFFF" />
          <circle cx="20" cy="18" r="1.8" fill="#1CB0F6" />
          <circle cx="28" cy="18" r="1.8" fill="#1CB0F6" />
          <circle cx="19.2" cy="17" r="0.8" fill="#FFFFFF" />
          <circle cx="27.2" cy="17" r="0.8" fill="#FFFFFF" />

          {/* Happy smile */}
          <path d="M21 24 Q24 27 27 24" stroke="#2B2B2B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Rosy cheeks */}
          <circle cx="16" cy="23" r="1.8" fill="#FF8CA3" opacity="0.8" />
          <circle cx="32" cy="23" r="1.8" fill="#FF8CA3" opacity="0.8" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

/**
 * WebThreadDivider - A whimsical silky web divider separating sections
 */
export const WebThreadDivider: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="relative my-6 flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-2 border-dashed border-[#58CC02]/30" />
      </div>
      <div className="relative flex items-center gap-2 bg-white px-3 py-1 rounded-full border-2 border-[#E5E5E5] text-xs font-extrabold text-[#777777] shadow-xs">
        <span className="text-sm">🕸️</span>
        {label && <span>{label}</span>}
        <span className="text-sm">🕷️</span>
      </div>
    </div>
  );
};
