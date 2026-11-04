import React from 'react';
import { motion } from 'motion/react';

interface CodalineLogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * CodalineLogo - Animated brand emblem & wordmark for "Codaline".
 * Blends coding ("Coda") with a spider's silk thread ("line") and web geometry:
 * - Animated octagonal spiderweb badge with code brackets < / >
 * - Cute bouncing mini-spider dangling from a silk line
 * - Wordmark "Codaline" with an interactive silk thread underline & glowing dewdrop
 */
export const CodalineLogo: React.FC<CodalineLogoProps> = ({
  collapsed = false,
  size = 'md',
  subtitle,
  onClick,
  className = '',
}) => {
  const dimensions = {
    sm: 38,
    md: 46,
    lg: 58,
  }[size];

  return (
    <div
      onClick={onClick}
      title="Codaline"
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Animated Spider-Web & Code Emblem */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
        whileTap={{ scale: 0.94 }}
        style={{ width: dimensions, height: dimensions }}
        className="relative shrink-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-xs"
        >
          <defs>
            <linearGradient id="codalineBgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#58CC02" />
              <stop offset="100%" stopColor="#46A302" />
            </linearGradient>
            <linearGradient id="codalineSilkGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#DBF8C5" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Tactile 3D Base Shadow */}
          <rect
            x="4"
            y="7"
            width="56"
            height="54"
            rx="16"
            fill="#3B8A00"
          />

          {/* Main Rounded Badge Surface */}
          <rect
            x="4"
            y="3"
            width="56"
            height="54"
            rx="16"
            fill="url(#codalineBgGrad)"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Rotating / Pulsing Web Spokes & Octagon Rings */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '32px', originY: '30px' }}
          >
            {/* Radial Web Spokes */}
            <line x1="32" y1="6" x2="32" y2="54" stroke="url(#codalineSilkGrad)" strokeWidth="1.3" strokeDasharray="2 2" />
            <line x1="8" y1="30" x2="56" y2="30" stroke="url(#codalineSilkGrad)" strokeWidth="1.3" strokeDasharray="2 2" />
            <line x1="15" y1="13" x2="49" y2="47" stroke="url(#codalineSilkGrad)" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="49" y1="13" x2="15" y2="47" stroke="url(#codalineSilkGrad)" strokeWidth="1.2" strokeDasharray="2 2" />

            {/* Outer Octagonal Web Ring */}
            <polygon
              points="32,10 46,16 52,30 46,44 32,50 18,44 12,30 18,16"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="1.4"
              fill="none"
            />
            {/* Inner Octagonal Web Ring */}
            <polygon
              points="32,18 40,22 44,30 40,38 32,42 24,38 20,30 24,22"
              stroke="#FFFFFF"
              strokeOpacity="0.65"
              strokeWidth="1.3"
              fill="none"
            />
          </motion.g>

          {/* Code Brackets <   > Woven on the Sides */}
          <path
            d="M17 23 L11 30 L17 37"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M47 23 L53 30 L47 37"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top Silk Thread Line ("Coda-line") */}
          <motion.line
            x1="32"
            y1="3"
            x2="32"
            y2="20"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={{ y2: [18, 23, 18] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Cute Bouncing Spider in Center of Logo */}
          <motion.g
            animate={{ y: [-2, 3, -2], rotate: [-3, 3, -3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '32px', originY: '32px' }}
          >
            {/* Spider Little Legs */}
            <path d="M24 29 Q19 25 16 27" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M23 32 Q18 32 15 35" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M24 35 Q19 38 17 41" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />

            <path d="M40 29 Q45 25 48 27" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M41 32 Q46 32 49 35" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M40 35 Q45 38 47 41" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />

            {/* Spider Body */}
            <ellipse cx="32" cy="32" rx="10" ry="8.5" fill="#2B2B2B" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Big Expressive Eyes */}
            <circle cx="28.5" cy="30" r="2.8" fill="#FFFFFF" />
            <circle cx="35.5" cy="30" r="2.8" fill="#FFFFFF" />
            <circle cx="29" cy="30" r="1.4" fill="#1CB0F6" />
            <circle cx="35" cy="30" r="1.4" fill="#1CB0F6" />
            <circle cx="28.4" cy="29.3" r="0.6" fill="#FFFFFF" />
            <circle cx="34.4" cy="29.3" r="0.6" fill="#FFFFFF" />

            {/* Cheerful Smile */}
            <path d="M29.5 34.8 Q32 37 34.5 34.8" stroke="#58CC02" strokeWidth="1.6" strokeLinecap="round" fill="none" />

            {/* Rosy Cheeks */}
            <circle cx="26" cy="33.5" r="1.3" fill="#FF8CA3" />
            <circle cx="38" cy="33.5" r="1.3" fill="#FF8CA3" />
          </motion.g>

          {/* Sparkling Dewdrop Node on Corner */}
          <motion.circle
            cx="48"
            cy="14"
            r="3"
            fill="#FFE885"
            animate={{ scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Wordmark + Animated Silk Line */}
      {!collapsed && (
        <div className="flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center gap-1">
            <span className="font-black text-xl sm:text-[22px] tracking-tight text-[#3C3C3C] group-hover:text-[#2B2B2B] transition-colors leading-none">
              Coda<span className="text-[#58CC02]">line</span>
            </span>
            <motion.span
              animate={{ rotate: [0, 12, -12, 0], y: [0, -1.5, 0] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="text-xs leading-none"
              aria-hidden="true"
            >
              🕷️
            </motion.span>
          </div>

          {/* Animated Silk Thread Underline with Traveling Dewdrop */}
          <div className="relative h-[4px] w-full bg-[#E5E5E5] rounded-full overflow-hidden mt-1">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#58CC02] to-[#1CB0F6] rounded-full"
            />
          </div>

          {subtitle && (
            <p className="text-[10px] text-[#777777] font-bold truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
