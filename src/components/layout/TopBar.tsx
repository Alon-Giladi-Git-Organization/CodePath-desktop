import React, { useState } from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Zap,
  Languages,
  LogOut,
  CheckCircle2,
  Code,
  Search
} from 'lucide-react';
import { CoseMascot } from '../common/CoseMascot';

interface TopBarProps {
  currentScreen: NavScreen;
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onOpenMentor: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (screen: NavScreen) => void;
  onOpenSearch?: () => void;
  courseTitle?: string;
  lessonTitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  user,
  onToggleSound,
  onOpenMentor,
  onToggleMobileMenu,
  onNavigate,
  onOpenSearch,
  courseTitle,
  lessonTitle,
}) => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-[70px] bg-white border-b-2 border-[#E5E5E5] px-4 sm:px-6 flex items-center justify-between transition-colors select-none"
    >
      {/* Zone 1: Mobile menu trigger + Brand Wordmark */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="mobile-menu-trigger"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-[12px] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] transition-colors cursor-pointer shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <CoseMascot mood="happy" size="sm" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#3C3C3C] group-hover:text-[#58CC02] transition-colors">
              Cose<span className="text-[#58CC02]">Path</span>
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Streak & XP Metrics */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Button (Ctrl + K) */}
        {onOpenSearch && (
          <button
            id="topbar-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-[12px] bg-[#F7F7F7] hover:bg-[#EBEBEB] border-2 border-[#E5E5E5] text-[#777777] hover:text-[#3C3C3C] text-xs font-bold transition-all cursor-pointer"
            title="Search (Ctrl + K)"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 text-[#1CB0F6]" />
            <span className="hidden md:inline">{language === 'he' ? 'חיפוש' : 'Search'}</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E5E5E5] rounded shadow-xs text-[#777777]">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Real-time Online & Sync Indicator */}
        <div
          id="topbar-sync-status"
          title={currentUser ? (language === 'he' ? 'מחובר ומסונכרן עם Firestore' : 'Live Firestore Sync Active') : (language === 'he' ? 'מצב אורח (שמירה מקומית)' : 'Local Storage Mode')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-extrabold cursor-default transition-all ${
            currentUser
              ? 'bg-[#EBF7E3] border-[#B5E7A0] text-[#58A700]'
              : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#777777]'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {currentUser && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${currentUser ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
          </span>
          <span className="hidden sm:inline text-[11px]">
            {currentUser ? (language === 'he' ? 'מסונכרן' : 'Synced') : (language === 'he' ? 'מקומי' : 'Local')}
          </span>
        </div>

        {/* Streak Counter Pill */}
        <div
          id="topbar-streak-pill"
          title={t('topbarStreakTitle')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF5E6] border-2 border-[#FFD9A6] text-[#FF9600] text-xs sm:text-sm font-extrabold cursor-default"
        >
          <Flame className="w-4 h-4 fill-[#FF9600] text-[#FF9600] animate-pulse" />
          <span>{user.streak}</span>
        </div>

        {/* XP Points Pill */}
        <div
          id="topbar-xp-pill"
          title={t('topbarXpTitle')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] text-xs sm:text-sm font-extrabold cursor-default"
        >
          <Zap className="w-4 h-4 fill-[#FFC800] text-[#FFC800]" />
          <span>{user.xp.toLocaleString()} <span className="hidden sm:inline">XP</span></span>
        </div>

        {/* Language Switcher (Hebrew / English) */}
        <button
          id="toggle-language-btn"
          onClick={toggleLanguage}
          title={language === 'en' ? 'עבור למצב עברית (ישראל)' : 'Switch to English (US)'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-white border-2 border-[#E5E5E5] border-b-4 hover:border-[#AFAFAF] active:border-b-2 active:translate-y-[2px] text-[#3C3C3C] text-xs font-extrabold transition-all cursor-pointer"
          aria-label="Toggle application language"
        >
          <Languages className="w-3.5 h-3.5 text-[#1CB0F6]" />
          <span className="text-xs">{language === 'en' ? '🇮🇱 עברית' : '🇺🇸 EN'}</span>
        </button>

        {/* Sound Toggle */}
        <button
          id="toggle-sound-btn"
          onClick={onToggleSound}
          title={user.soundEnabled ? t('topbarSoundMute') : t('topbarSoundEnable')}
          className="p-2 rounded-[12px] bg-white border-2 border-[#E5E5E5] border-b-4 hover:border-[#AFAFAF] active:border-b-2 active:translate-y-[2px] text-[#777777] hover:text-[#3C3C3C] transition-all cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Toggle sound"
        >
          {user.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#58CC02]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#AFAFAF]" />
          )}
        </button>

        {/* Google Auth / User Avatar */}
        {currentUser ? (
          <div className="relative">
            <button
              id="topbar-user-avatar-btn"
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-[14px] border-2 border-[#E5E5E5] bg-white hover:border-[#58CC02] transition-colors cursor-pointer"
            >
              <img
                src={currentUser.photoURL || user.avatar}
                alt={currentUser.displayName || 'User'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#58CC02]"
              />
              <span className="hidden md:inline text-xs font-extrabold text-[#3C3C3C] max-w-[80px] truncate">
                {currentUser.displayName?.split(' ')[0] || user.name}
              </span>
            </button>

            {showAuthMenu && (
              <div
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 bg-white rounded-[16px] shadow-xl border-2 border-[#E5E5E5] p-3 z-50`}
              >
                <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-[#E5E5E5]">
                  <img
                    src={currentUser.photoURL || user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#3C3C3C] truncate">
                      {currentUser.displayName || user.name}
                    </p>
                    <p className="text-[10px] text-[#777777] truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#58A700] font-bold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'he' ? 'מסונכרן עם ענן Firestore' : 'Synced to Firestore'}</span>
                </div>

                <button
                  onClick={() => {
                    signOut();
                    setShowAuthMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] bg-[#FFE0E0] hover:bg-[#FFCCCC] text-[#FF4B4B] text-xs font-extrabold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'he' ? 'התנתק מחשבון' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            id="google-signin-btn"
            onClick={signInWithGoogle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-white border-2 border-[#E5E5E5] border-b-4 hover:border-[#AFAFAF] active:border-b-2 active:translate-y-[2px] text-[#3C3C3C] text-xs font-extrabold transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden sm:inline">{language === 'he' ? 'התחבר' : 'Sign In'}</span>
          </button>
        )}

        {/* Code Mentor AI CTA */}
        <button
          id="topbar-mentor-btn"
          onClick={onOpenMentor}
          className="btn-secondary text-xs font-extrabold !py-2 !px-3.5 !rounded-[14px]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t('topbarMentorBtn')}</span>
          <span className="md:hidden">AI</span>
        </button>
      </div>
    </header>
  );
};
