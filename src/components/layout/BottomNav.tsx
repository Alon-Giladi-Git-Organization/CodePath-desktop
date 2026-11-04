import React from 'react';
import { NavScreen } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  LayoutDashboard, 
  Compass, 
  Terminal, 
  Layers,
  Award,
  Trophy 
} from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onOpenMentor?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';

  const items: { screen: NavScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { screen: 'practice', label: isHe ? 'תרגול ומסלולים' : 'Practice', icon: <span className="text-xl">🕸️</span> },
    { screen: 'architecture', label: t('navArchitecture'), icon: <Layers className="w-5 h-5" /> },
    { screen: 'leaderboard', label: t('navLeaderboard'), icon: <Award className="w-5 h-5" /> },
    { screen: 'achievements', label: t('navAchievements'), icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white border-t-2 border-[#E5E5E5] px-2 flex items-center justify-around select-none"
    >
      {items.map((item) => {
        const isActive = currentScreen === item.screen;
        return (
          <button
            key={item.screen}
            id={`bottom-nav-${item.screen}`}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-[12px] transition-transform min-w-[48px] min-h-[48px] cursor-pointer ${
              isActive
                ? 'text-[#58CC02] font-extrabold'
                : 'text-[#777777] font-bold hover:text-[#3C3C3C]'
            }`}
          >
            <motion.div
              animate={{ scale: isActive ? 1.12 : 1 }}
              transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {item.icon}
            </motion.div>
            <span className="text-[10px] mt-0.5 leading-none uppercase tracking-wide truncate max-w-[54px]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
