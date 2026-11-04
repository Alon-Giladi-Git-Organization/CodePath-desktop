import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export type MascotMood =
  | 'happy'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'proud'
  | 'confused'
  | 'jumping';

interface CoseMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  className?: string;
}

/**
 * "Spidey the Web Weaver" - CosePath's friendly, bouncy spider mascot.
 * Symbolizes both the World Wide Web and clever coding logic!
 * Features an animated silk thread, woven spiderweb strands, 8 expressive legs,
 * glossy blinking eyes, friendly smile, and reaction states.
 */
export const CoseMascot: React.FC<CoseMascotProps> = ({
  mood = 'happy',
  size = 'md',
  speechBubble,
  className = '',
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Automatic blink loop every 4 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeDimensions = {
    sm: { w: 48, h: 48 },
    md: { w: 72, h: 72 },
    lg: { w: 104, h: 104 },
    xl: { w: 144, h: 144 },
  }[size];

  // Motion variants based on mood for the overall body and silk thread
  const getMotionAnimation = () => {
    switch (mood) {
      case 'celebrating':
      case 'jumping':
        return {
          y: [0, -14, 0, -8, 0],
          rotate: [0, -5, 5, -2, 0],
          transition: { duration: 0.9, repeat: Infinity, repeatDelay: 0.8 },
        };
      case 'thinking':
        return {
          rotate: [0, -7, -7, 0],
          y: [0, -3, 0],
          transition: { duration: 2.2, repeat: Infinity },
        };
      case 'encouraging':
        return {
          scale: [1, 1.06, 1],
          y: [0, -4, 0],
          transition: { duration: 1.5, repeat: Infinity },
        };
      case 'proud':
        return {
          y: [0, -5, 0],
          scale: [1, 1.04, 1],
          transition: { duration: 2, repeat: Infinity },
        };
      case 'confused':
        return {
          rotate: [-4, 4, -4],
          x: [-2, 2, -2],
          transition: { duration: 1.2, repeat: Infinity },
        };
      default:
        return {
          y: [0, -4, 0],
          transition: { duration: 2.6, repeat: Infinity },
        };
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <motion.div
        animate={getMotionAnimation()}
        style={{ width: sizeDimensions.w, height: sizeDimensions.h }}
        className="relative shrink-0 select-none cursor-pointer"
        whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        title="Spidey - Web & Code Weaver"
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Body Gradient - Friendly Violet / Indigo */}
            <linearGradient id="spideyBodyGrad" x1="20" y1="35" x2="100" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>

            {/* Belly highlight gradient */}
            <linearGradient id="spideyBellyGrad" x1="40" y1="65" x2="80" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>

            {/* Glowing silk thread */}
            <linearGradient id="silkGrad" x1="60" y1="0" x2="60" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.95" />
            </linearGradient>

            {/* Glasses / Visor gradient */}
            <linearGradient id="glassGrad" x1="30" y1="42" x2="90" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* 1. Spiderweb Pattern in Background ("WEB" Theme) */}
          <g opacity="0.32" stroke="#818CF8" strokeWidth="1.2" strokeLinecap="round">
            {/* Radial Web Strands */}
            <line x1="60" y1="10" x2="10" y2="35" />
            <line x1="60" y1="10" x2="110" y2="35" />
            <line x1="60" y1="10" x2="15" y2="85" />
            <line x1="60" y1="10" x2="105" y2="85" />
            <line x1="60" y1="10" x2="60" y2="115" />
            {/* Concentric Web Arcs */}
            <path d="M 28 30 Q 60 40 92 30" fill="none" />
            <path d="M 20 55 Q 60 70 100 55" fill="none" />
            <path d="M 18 80 Q 60 100 102 80" fill="none" />
          </g>

          {/* 2. Top Silk Thread Spun Down to Spider's Head */}
          <line
            x1="60"
            y1="0"
            x2="60"
            y2="42"
            stroke="url(#silkGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Silk Drop Bead / Node */}
          <circle cx="60" cy="40" r="3.5" fill="#C7D2FE" />
          <circle cx="60" cy="40" r="1.8" fill="#FFFFFF" />

          {/* 3. Eight Animated Spider Legs (4 Left, 4 Right) */}
          <g stroke="#6D28D9" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* --- LEFT LEGS --- */}
            {/* Leg L1 (Upper-left) */}
            <path
              d={
                mood === 'celebrating' || mood === 'jumping'
                  ? 'M 44 48 Q 24 22 14 36'
                  : mood === 'thinking'
                  ? 'M 44 48 Q 28 32 38 28'
                  : 'M 44 48 Q 22 28 16 46'
              }
              className="transition-all duration-300"
            />
            {/* Leg L2 (Mid-upper left) */}
            <path
              d={
                mood === 'celebrating' || mood === 'jumping'
                  ? 'M 40 58 Q 16 42 10 58'
                  : 'M 40 58 Q 14 50 12 68'
              }
              className="transition-all duration-300"
            />
            {/* Leg L3 (Mid-lower left) */}
            <path
              d={
                mood === 'encouraging'
                  ? 'M 42 70 Q 16 66 18 84'
                  : 'M 42 70 Q 18 68 20 88'
              }
              className="transition-all duration-300"
            />
            {/* Leg L4 (Lower-left anchor) */}
            <path
              d="M 46 80 Q 26 88 32 104"
              className="transition-all duration-300"
            />

            {/* --- RIGHT LEGS --- */}
            {/* Leg R1 (Upper-right) */}
            <path
              d={
                mood === 'celebrating' || mood === 'jumping'
                  ? 'M 76 48 Q 96 22 106 36'
                  : mood === 'encouraging'
                  ? 'M 76 48 Q 94 26 102 38'
                  : 'M 76 48 Q 98 28 104 46'
              }
              className="transition-all duration-300"
            />
            {/* Leg R2 (Mid-upper right) */}
            <path
              d={
                mood === 'celebrating' || mood === 'jumping'
                  ? 'M 80 58 Q 104 42 110 58'
                  : 'M 80 58 Q 106 50 108 68'
              }
              className="transition-all duration-300"
            />
            {/* Leg R3 (Mid-lower right) */}
            <path
              d="M 78 70 Q 102 68 100 88"
              className="transition-all duration-300"
            />
            {/* Leg R4 (Lower-right anchor) */}
            <path
              d="M 74 80 Q 94 88 88 104"
              className="transition-all duration-300"
            />
          </g>

          {/* Cute Little Leg Paws / Soft Tips */}
          <g fill="#A78BFA">
            <circle cx="16" cy={mood === 'celebrating' ? 36 : 46} r="3" />
            <circle cx="12" cy={mood === 'celebrating' ? 58 : 68} r="3" />
            <circle cx="20" cy="88" r="3" />
            <circle cx="32" cy="104" r="3" />
            <circle cx="104" cy={mood === 'celebrating' ? 36 : 46} r="3" />
            <circle cx="108" cy={mood === 'celebrating' ? 58 : 68} r="3" />
            <circle cx="100" cy="88" r="3" />
            <circle cx="88" cy="104" r="3" />
          </g>

          {/* 4. Main Plump Spider Body */}
          {/* Abdomen (Lower round body) */}
          <circle cx="60" cy="74" r="26" fill="url(#spideyBodyGrad)" />
          {/* Subtle Abdomen Shadow Rim */}
          <path
            d="M 38 78 C 42 96, 78 96, 82 78 C 76 92, 44 92, 38 78 Z"
            fill="#5B21B6"
            opacity="0.6"
          />

          {/* Cute Lil Belly Patch */}
          <ellipse cx="60" cy="77" rx="15" ry="12" fill="url(#spideyBellyGrad)" opacity="0.8" />

          {/* Web Emblem / Coding Node on Belly */}
          <g stroke="#EDE9FE" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <line x1="60" y1="70" x2="60" y2="84" />
            <line x1="53" y1="77" x2="67" y2="77" />
            <circle cx="60" cy="77" r="3.5" fill="#8B5CF6" />
          </g>

          {/* Cephalothorax / Head (Upper round body) */}
          <circle cx="60" cy="50" r="19" fill="url(#spideyBodyGrad)" />

          {/* Rosy Cheeks */}
          <ellipse cx="44" cy="56" rx="4.5" ry="2.8" fill="#F472B6" opacity="0.8" />
          <ellipse cx="76" cy="56" rx="4.5" ry="2.8" fill="#F472B6" opacity="0.8" />

          {/* 5. Big Expressive Glossy Eyes */}
          {/* Left Eye */}
          <g>
            <ellipse cx="49" cy="46" rx="8.5" ry="10" fill="#FFFFFF" />
            {isBlinking ? (
              // Blink Arc
              <path d="M 42 47 Q 49 52 56 47" stroke="#3730A3" strokeWidth="3" strokeLinecap="round" />
            ) : mood === 'celebrating' || mood === 'proud' ? (
              // Joyful Eye Arc (^ ^)
              <path d="M 42 47 Q 49 40 56 47" stroke="#3730A3" strokeWidth="3.2" strokeLinecap="round" />
            ) : mood === 'thinking' ? (
              // Looking up thoughtfully
              <>
                <ellipse cx="49" cy="42" rx="5" ry="6" fill="#1E1B4B" />
                <circle cx="51" cy="40" r="2.2" fill="#FFFFFF" />
              </>
            ) : mood === 'confused' ? (
              // Spiral / Dizzy pupil
              <path
                d="M 49 46 A 3 3 0 0 1 47 43 A 5 5 0 0 1 52 44"
                stroke="#3730A3"
                strokeWidth="2.5"
                fill="none"
              />
            ) : (
              // Standard Glossy Anime Eye
              <>
                <ellipse cx="50" cy="46" rx="5.5" ry="6.5" fill="#1E1B4B" />
                <circle cx="52" cy="43" r="2.4" fill="#FFFFFF" />
                <circle cx="47" cy="48" r="1.3" fill="#A5B4FC" />
              </>
            )}
          </g>

          {/* Right Eye */}
          <g>
            <ellipse cx="71" cy="46" rx="8.5" ry="10" fill="#FFFFFF" />
            {isBlinking ? (
              // Blink Arc
              <path d="M 64 47 Q 71 52 78 47" stroke="#3730A3" strokeWidth="3" strokeLinecap="round" />
            ) : mood === 'celebrating' || mood === 'proud' ? (
              // Joyful Eye Arc (^ ^)
              <path d="M 64 47 Q 71 40 78 47" stroke="#3730A3" strokeWidth="3.2" strokeLinecap="round" />
            ) : mood === 'thinking' ? (
              // Looking up thoughtfully
              <>
                <ellipse cx="71" cy="42" rx="5" ry="6" fill="#1E1B4B" />
                <circle cx="73" cy="40" r="2.2" fill="#FFFFFF" />
              </>
            ) : mood === 'confused' ? (
              <path
                d="M 71 46 A 3 3 0 0 1 69 43 A 5 5 0 0 1 74 44"
                stroke="#3730A3"
                strokeWidth="2.5"
                fill="none"
              />
            ) : (
              // Standard Glossy Anime Eye
              <>
                <ellipse cx="70" cy="46" rx="5.5" ry="6.5" fill="#1E1B4B" />
                <circle cx="72" cy="43" r="2.4" fill="#FFFFFF" />
                <circle cx="67" cy="48" r="1.3" fill="#A5B4FC" />
              </>
            )}
          </g>

          {/* Two tiny secondary cute top spider eyes (baby arachnid feature!) */}
          <circle cx="53" cy="35" r="2.2" fill="#C4B5FD" />
          <circle cx="67" cy="35" r="2.2" fill="#C4B5FD" />

          {/* 6. Friendly Smile and Cute Little Chelicerae/Fangs */}
          {mood === 'celebrating' || mood === 'proud' ? (
            // Big open happy smile
            <path
              d="M 53 54 Q 60 62 67 54 Z"
              fill="#BE185D"
              stroke="#831843"
              strokeWidth="1.5"
            />
          ) : mood === 'confused' ? (
            // Wavy mouth
            <path
              d="M 54 56 Q 57 53 60 56 Q 63 59 66 56"
              stroke="#3730A3"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Sweet gentle smile
            <path
              d="M 54 54 Q 60 60 66 54"
              stroke="#3730A3"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Two tiny cute white fangs peeking out */}
          <path d="M 56 55 L 57 58 L 58 55 Z" fill="#FFFFFF" />
          <path d="M 62 55 L 63 58 L 64 55 Z" fill="#FFFFFF" />

          {/* 7. Celebrating Sparkles / Stars on the Web */}
          {(mood === 'celebrating' || mood === 'proud') && (
            <g fill="#FBBF24">
              <path d="M 22 24 L 24 18 L 26 24 L 32 26 L 26 28 L 24 34 L 22 28 L 16 26 Z" />
              <path d="M 96 22 L 97 18 L 98 22 L 102 23 L 98 24 L 97 28 L 96 24 L 92 23 Z" />
              <circle cx="106" cy="74" r="2.5" fill="#38BDF8" />
              <circle cx="14" cy="76" r="2.5" fill="#34D399" />
            </g>
          )}

          {/* 8. Developer Glasses on Proud Mode */}
          {mood === 'proud' && (
            <g stroke="#38BDF8" strokeWidth="2.5" fill="none">
              <rect x="40" y="38" width="17" height="15" rx="4" fill="url(#glassGrad)" />
              <rect x="63" y="38" width="17" height="15" rx="4" fill="url(#glassGrad)" />
              <line x1="57" y1="45" x2="63" y2="45" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Optional Speech Bubble */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-[16px] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#3C3C3C] shadow-xs max-w-xs"
        >
          {speechBubble}
          {/* Speech bubble pointer arrow */}
          <div
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#E5E5E5] border-b-[6px] border-b-transparent"
          />
          <div
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-r-white border-b-[5px] border-b-transparent"
          />
        </motion.div>
      )}
    </div>
  );
};
