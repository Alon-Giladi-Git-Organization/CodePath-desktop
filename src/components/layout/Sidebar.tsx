import React from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { 
  LayoutDashboard, 
  Compass, 
  Terminal, 
  Trophy, 
  Settings, 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  Layers,
  Award,
  Cloud,
  LogIn,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { CoseMascot } from '../common/CoseMascot';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  user: UserProfile;
  onOpenMentor: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenMentor,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t, language, isRtl } = useLanguage();
  const { currentUser, signInWithGoogle } = useAuth();

  const navItems: { screen: NavScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      screen: 'dashboard',
      label: t('navDashboard'),
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      screen: 'courses',
      label: t('navCourses'),
      icon: <Compass className="w-5 h-5 shrink-0" />,
      badge: '6 Paths',
    },
    {
      screen: 'practice',
      label: t('navPractice'),
      icon: <Terminal className="w-5 h-5 text-[#1CB0F6] shrink-0" />,
      badge: 'IDE & AI',
    },
    {
      screen: 'architecture',
      label: t('navArchitecture'),
      icon: <Layers className="w-5 h-5 shrink-0" />,
      badge: isRtl ? 'ארכיטקטורה' : 'Quality Lab',
    },
    {
      screen: 'leaderboard',
      label: t('navLeaderboard'),
      icon: <Award className="w-5 h-5 shrink-0" />,
      badge: 'XP Top',
    },
    {
      screen: 'achievements',
      label: t('navAchievements'),
      icon: <Trophy className="w-5 h-5 shrink-0" />,
    },
    {
      screen: 'settings',
      label: t('navSettings'),
      icon: <Settings className="w-5 h-5 shrink-0" />,
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

  const widthClass = isCollapsed ? 'lg:w-20' : 'lg:w-64';

  const displayName = currentUser?.displayName || user.name;
  const displayAvatar = currentUser?.photoURL || user.avatar;

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
        className={`fixed top-0 bottom-0 ${desktopPosClass} z-40 w-64 ${widthClass} bg-white flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${mobileTransformClass} select-none`}
      >
        {/* Brand Header */}
        <div className={`p-4 border-b-2 border-[#E5E5E5] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div 
            className="flex items-center gap-2.5 cursor-pointer min-w-0" 
            onClick={() => handleNavClick('dashboard')}
            title="CosePath Dashboard"
          >
            <CoseMascot mood="happy" size="sm" />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-xl tracking-tight text-[#3C3C3C] block truncate">
                  Cose<span className="text-[#58CC02]">Path</span>
                </span>
                <p className="text-[11px] text-[#777777] font-semibold truncate">
                  {isRtl ? 'ללמוד לתכנת בכיף' : 'Learn code with joy'}
                </p>
              </div>
            )}
          </div>

          {/* Expand / Minimize Toggle (Desktop only) */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-[10px] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] transition-colors cursor-pointer shrink-0 ${isCollapsed ? 'mt-2' : ''}`}
              title={isCollapsed ? (language === 'he' ? 'הרחב תפריט צד' : 'Expand Sidebar') : (language === 'he' ? 'צמצם תפריט צד' : 'Minimize Sidebar')}
              aria-label="Toggle sidebar collapse"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#58CC02]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
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
                title={item.label}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-3'} rounded-[16px] text-sm font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#DBF8C5] text-[#58A700] border-2 border-[#58CC02]'
                    : 'text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#58CC02]' : 'text-[#777777]'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
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
            {isCollapsed ? (
              <button
                onClick={() => {
                  onOpenMentor();
                  if (onCloseMobile) onCloseMobile();
                }}
                title={t('topbarMentorBtn')}
                className="w-full flex items-center justify-center p-3 rounded-[16px] bg-[#F7F7F7] hover:bg-[#EBF7E3] border-2 border-[#E5E5E5] hover:border-[#58CC02] text-[#1CB0F6] transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#1CB0F6]" />
              </button>
            ) : (
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
            )}
          </div>
        </nav>

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t-2 border-[#E5E5E5]">
          {currentUser ? (
            <div
              id="sidebar-user-profile"
              onClick={() => handleNavClick('settings')}
              title={`${displayName} - Lvl ${user.level}`}
              className={`flex items-center ${isCollapsed ? 'justify-center p-1.5' : 'gap-3 p-2'} rounded-[14px] hover:bg-[#F7F7F7] border-2 border-transparent hover:border-[#E5E5E5] transition-all cursor-pointer`}
            >
              <div className="relative">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#58CC02]"
                />
                <span className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-3 h-3 rounded-full bg-[#58CC02] border-2 border-white`} />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#3C3C3C] truncate">
                      {displayName}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FFC800]/20 text-[#CC9900]">
                      Lvl {user.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#58A700] font-semibold">
                    <Cloud className="w-3 h-3" />
                    <span className="truncate">{language === 'he' ? 'מסונכרן לענן' : 'Firestore Synced'}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="sidebar-signin-btn"
              onClick={() => signInWithGoogle()}
              title={language === 'he' ? 'התחבר לחשבון לסנכרון' : 'Sign in to sync progress'}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-center gap-2 p-2.5'} rounded-[14px] bg-[#F7F7F7] hover:bg-[#EBF7E3] border-2 border-[#E5E5E5] hover:border-[#58CC02] text-[#3C3C3C] text-xs font-extrabold transition-all cursor-pointer`}
            >
              <LogIn className="w-4 h-4 text-[#58CC02]" />
              {!isCollapsed && (
                <span>{language === 'he' ? 'התחבר לחשבון' : 'Sign in'}</span>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
