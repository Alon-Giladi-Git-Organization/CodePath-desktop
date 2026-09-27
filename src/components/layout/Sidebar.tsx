import React from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  LayoutDashboard, 
  Compass, 
  Terminal, 
  Trophy, 
  Settings, 
  Sparkles, 
  Flame, 
  Zap, 
  ChevronRight,
  ChevronLeft,
  Layers,
  Award,
  Code2,
  Brain,
  Puzzle
} from 'lucide-react';
import { CoseMascot } from '../common/CoseMascot';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  user: UserProfile;
  onOpenMentor: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenMentor,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { t, language, isRtl } = useLanguage();

  const navItems: { screen: NavScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      screen: 'dashboard',
      label: t('navDashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      screen: 'courses',
      label: t('navCourses'),
      icon: <Compass className="w-5 h-5" />,
      badge: '6 Paths',
    },
    {
      screen: 'practice',
      label: t('navPractice'),
      icon: <Terminal className="w-5 h-5 text-[#1CB0F6]" />,
      badge: 'IDE & AI',
    },
    {
      screen: 'architecture',
      label: t('navArchitecture'),
      icon: <Layers className="w-5 h-5" />,
      badge: isRtl ? 'ארכיטקטורה' : 'Quality Lab',
    },
    {
      screen: 'leaderboard',
      label: t('navLeaderboard'),
      icon: <Award className="w-5 h-5" />,
      badge: 'XP Top',
    },
    {
      screen: 'achievements',
      label: t('navAchievements'),
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      screen: 'settings',
      label: t('navSettings'),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (screen: NavScreen) => {
    onNavigate(screen);
    if (onCloseMobile) onCloseMobile();
  };

  const desktopPosClass = isRtl
    ? 'right-0 border-l-2 border-[#E5E5E5]'
    : 'left-0 border-r-2 border-[#E5E5E5]';

  const mobileTransformClass = isMobileOpen
    ? 'translate-x-0'
    : isRtl
    ? 'translate-x-full'
    : '-translate-x-full';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 ${desktopPosClass} z-40 w-64 bg-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileTransformClass} select-none`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b-2 border-[#E5E5E5]">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <CoseMascot mood="happy" size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#3C3C3C]">
                  Cose<span className="text-[#58CC02]">Path</span>
                </span>
              </div>
              <p className="text-[11px] text-[#777777] font-semibold">
                {isRtl ? 'ללמוד לתכנת בכיף' : 'Learn code with joy'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                id={`sidebar-link-${item.screen}`}
                onClick={() => handleNavClick(item.screen)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[16px] text-sm font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#DBF8C5] text-[#58A700] border-2 border-[#58CC02]'
                    : 'text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#58CC02]' : 'text-[#777777]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#58CC02] text-white'
                        : 'bg-[#F7F7F7] text-[#777777] border border-[#E5E5E5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* AI Code Mentor Callout Card in Sidebar */}
          <div className="pt-3">
            <div className="p-3.5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] text-start">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-[8px] bg-[#1CB0F6] text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-extrabold text-[#3C3C3C]">
                  {t('topbarMentorBtn')}
                </span>
                <span className={`w-2 h-2 rounded-full bg-[#58CC02] animate-pulse ${isRtl ? 'mr-auto' : 'ml-auto'}`} title="Ready" />
              </div>
              <p className="text-xs text-[#777777] mb-3 leading-relaxed font-semibold">
                {isRtl
                  ? 'צריך רמז ידידותי? שאל את מנטור הקוד שלך!'
                  : 'Need a gentle nudge? Ask your friendly Code Mentor!'}
              </p>
              <button
                id="sidebar-open-mentor-btn"
                onClick={() => {
                  onOpenMentor();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full btn-outline text-xs font-extrabold !py-2 !px-3"
              >
                <span>{isRtl ? 'שאל את המנטור' : 'Ask Mentor'}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t-2 border-[#E5E5E5]">
          <div
            id="sidebar-user-profile"
            onClick={() => handleNavClick('settings')}
            className="flex items-center gap-3 p-2 rounded-[14px] hover:bg-[#F7F7F7] border-2 border-transparent hover:border-[#E5E5E5] transition-all cursor-pointer"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#58CC02]"
              />
              <span className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-3 h-3 rounded-full bg-[#58CC02] border-2 border-white`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#3C3C3C] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FFC800]/20 text-[#CC9900]">
                  Lvl {user.level}
                </span>
              </div>
              <p className="text-xs text-[#777777] truncate font-semibold">
                {user.xp.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
