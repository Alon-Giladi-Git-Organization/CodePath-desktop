import React from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Menu, 
  Sparkles, 
  Flame, 
  Zap,
  Search
} from 'lucide-react';
import { CodalineLogo } from '../common/CodalineLogo';

interface TopBarProps {
  currentScreen: NavScreen;
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onOpenMentor: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string; language?: string }) => void;
  onOpenSearch?: () => void;
  courseTitle?: string;
  lessonTitle?: string;
}

/**
 * Mobile-only compact header bar (hidden on lg+ desktop where the unified Sidebar handles everything).
 */
export const TopBar: React.FC<TopBarProps> = ({
  user,
  onOpenMentor,
  onToggleMobileMenu,
  onNavigate,
  onOpenSearch,
}) => {
  return (
    <header
      id="app-mobile-topbar"
      className="lg:hidden sticky top-0 z-30 h-14 bg-white border-b-2 border-[#E5E5E5] px-3 flex items-center justify-between select-none"
    >
      {/* Mobile Menu Drawer Trigger + Brand */}
      <div className="flex items-center gap-2">
        <button
          id="mobile-menu-trigger"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-[12px] text-[#3C3C3C] bg-[#F7F7F7] hover:bg-[#EBEBEB] border border-[#E5E5E5] transition-colors cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <CodalineLogo
          size="sm"
          onClick={() => onNavigate('dashboard')}
        />
      </div>

      {/* Mobile Compact Metrics & Quick Actions */}
      <div className="flex items-center gap-1.5">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-[10px] bg-[#F7F7F7] border border-[#E5E5E5] text-[#1CB0F6] cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFF5E6] border border-[#FFD9A6] text-[#FF9600] text-xs font-extrabold">
          <Flame className="w-3.5 h-3.5 fill-[#FF9600]" />
          <span>{user.streak}</span>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFFBE6] border border-[#FFE885] text-[#CC9900] text-xs font-extrabold">
          <Zap className="w-3.5 h-3.5 fill-[#FFC800]" />
          <span>{user.xp}</span>
        </div>

        <button
          onClick={onOpenMentor}
          className="btn-secondary text-xs font-extrabold !py-1.5 !px-2.5 !rounded-[10px]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>
      </div>
    </header>
  );
};
