import React, { useState, useRef, useEffect } from 'react';
import { NavScreen, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { 
  LayoutDashboard, 
  Trophy, 
  Settings, 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Layers,
  Award,
  Cloud,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Flame,
  Zap,
  Languages,
  Volume2,
  VolumeX,
  Puzzle,
  BookOpen,
  X
} from 'lucide-react';
import { CoseMascot } from '../common/CoseMascot';
import { CodalineLogo } from '../common/CodalineLogo';
import { SpiderWebCorner } from '../common/SpiderWebDecor';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string; language?: string }) => void;
  user: UserProfile;
  onOpenMentor: () => void;
  onOpenSearch?: () => void;
  onToggleSound?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SIDEBAR_LANGUAGES = [
  {
    id: 'python',
    courseId: 'python-beginners',
    icon: '🐍',
    labelHe: 'פייתון (Python)',
    labelEn: 'Python',
    badgeHe: 'פופולרי',
    badgeEn: 'Popular',
    descHe: 'משתנים, לולאות ותחביר Drag & Drop',
    descEn: 'Variables, loops & Drag & Drop syntax',
  },
  {
    id: 'javascript',
    courseId: 'javascript-beginners',
    icon: '⚡',
    labelHe: 'ג\'אווהסקריפט (JS/TS)',
    labelEn: 'JavaScript & TS',
    badgeHe: 'חיוני',
    badgeEn: 'Essential',
    descHe: 'DOM, פונקציות חץ ומערכים',
    descEn: 'DOM, arrow functions & arrays',
  },
  {
    id: 'sql',
    courseId: 'sql-fundamentals',
    icon: '🗄️',
    labelHe: 'בסיסי נתונים ו-SQL',
    labelEn: 'Databases & SQL',
    badgeHe: 'דאטה',
    badgeEn: 'Data',
    descHe: 'שאילתות SELECT, WHERE ו-JOIN',
    descEn: 'SELECT, WHERE & JOIN queries',
  },
  {
    id: 'web',
    courseId: 'html-css-essentials',
    icon: '🌐',
    labelHe: 'פיתוח Web (HTML/CSS)',
    labelEn: 'Web & HTML/CSS',
    badgeHe: 'עיצוב',
    badgeEn: 'UI',
    descHe: 'סמנטיקה, Flexbox ורספונסיביות',
    descEn: 'Semantics, Flexbox & responsive UI',
  },
  {
    id: 'git',
    courseId: 'git-fundamentals',
    icon: '🐙',
    labelHe: 'ניהול גרסאות (Git)',
    labelEn: 'Git Version Control',
    badgeHe: 'כלים',
    badgeEn: 'DevTools',
    descHe: 'קומיטים, ענפים ופתרון קונפליקטים',
    descEn: 'Commits, branches & merges',
  },
  {
    id: 'gamedev',
    courseId: 'game-dev-canvas',
    icon: '🎮',
    labelHe: 'פיתוח משחקים (Canvas)',
    labelEn: 'Game Dev (Canvas)',
    badgeHe: 'יצירתי',
    badgeEn: 'Creative',
    descHe: 'לולאת משחק 60 FPS וספרייטים',
    descEn: '60 FPS game loop & sprites',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenMentor,
  onOpenSearch,
  onToggleSound,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const isHe = language === 'he';
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [isLanguagesExpanded, setIsLanguagesExpanded] = useState(true);
  const [showCollapsedFlyout, setShowCollapsedFlyout] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Close collapsed flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setShowCollapsedFlyout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { screen: NavScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      screen: 'dashboard',
      label: t('navDashboard'),
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      screen: 'practice',
      label: isHe ? 'תרגול קוד ומסלולים' : 'Code Practice & Tracks',
      icon: <span className="text-lg shrink-0 leading-none">🕸️</span>,
      badge: isHe ? '6 שפות' : '6 Tracks',
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

  const widthClass = isCollapsed ? 'lg:w-20' : 'lg:w-72';

  const displayName = currentUser?.displayName || user.name;
  const displayAvatar = currentUser?.photoURL || user.avatar;

  // Direction-aware chevron for the persistent floating toggle button
  const renderToggleChevron = () => {
    if (isRtl) {
      // Sidebar is on the right in RTL:
      // When expanded, arrow points right (to collapse into right edge)
      // When collapsed, arrow points left (to expand out towards center)
      return isCollapsed ? (
        <ChevronLeft className="w-4 h-4 text-[#58A700] stroke-[3]" />
      ) : (
        <ChevronRight className="w-4 h-4 text-[#58A700] stroke-[3]" />
      );
    } else {
      // Sidebar is on the left in LTR:
      return isCollapsed ? (
        <ChevronRight className="w-4 h-4 text-[#58A700] stroke-[3]" />
      ) : (
        <ChevronLeft className="w-4 h-4 text-[#58A700] stroke-[3]" />
      );
    }
  };

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

      {/* Unified Side Navbar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 ${desktopPosClass} z-40 w-72 ${widthClass} bg-white flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${mobileTransformClass} select-none shadow-sm`}
      >
        {/* PERSISTENT FLOATING EXPAND / MINIMIZE HANDLE ON SIDEBAR EDGE (Always visible & clickable on desktop) */}
        {onToggleCollapse && (
          <button
            id="sidebar-edge-toggle-btn"
            onClick={onToggleCollapse}
            title={
              isCollapsed
                ? isHe
                  ? 'הרחב סרגל ניווט'
                  : 'Expand Sidebar'
                : isHe
                ? 'מזער סרגל ניווט'
                : 'Minimize Sidebar'
            }
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Minimize Sidebar'}
            className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#58CC02] shadow-md hover:bg-[#EBF7E3] hover:scale-110 active:scale-95 transition-all cursor-pointer absolute top-6 z-50 ${
              isRtl ? '-left-4' : '-right-4'
            }`}
          >
            {renderToggleChevron()}
          </button>
        )}

        {/* Top Section: Brand Header + Header Toggle Button + Status Metrics */}
        <div className="border-b-2 border-[#E5E5E5] p-3 space-y-2.5 relative">
          {!isCollapsed && <SpiderWebCorner position="top-right" size={44} color="#58CC02" />}

          {/* Brand Row */}
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <CodalineLogo
              collapsed={isCollapsed}
              size="md"
              subtitle={isRtl ? 'טווה את רשת הקוד שלך 🕸️' : 'Weave your code web 🕸️'}
              onClick={() => handleNavClick('dashboard')}
            />

            {/* Mobile Close Drawer Button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-[10px] text-[#777777] hover:bg-[#F7F7F7] cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Gamification Pills (Streak + XP + Sync Status) */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <div
                title={`${user.streak} ${isHe ? 'ימי רצף' : 'Day Streak'}`}
                className="w-11 py-1 rounded-full bg-[#FFF5E6] border border-[#FFD9A6] text-[#FF9600] text-[11px] font-extrabold flex items-center justify-center gap-0.5"
              >
                <Flame className="w-3.5 h-3.5 fill-[#FF9600]" />
                <span>{user.streak}</span>
              </div>
              <div
                title={`${user.xp.toLocaleString()} XP`}
                className="w-11 py-1 rounded-full bg-[#FFFBE6] border border-[#FFE885] text-[#CC9900] text-[10px] font-extrabold flex items-center justify-center gap-0.5"
              >
                <Zap className="w-3 h-3 fill-[#FFC800] text-[#FFC800]" />
                <span>{user.xp >= 1000 ? `${(user.xp / 1000).toFixed(1)}k` : user.xp}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {/* Streak Pill */}
              <div
                title={t('topbarStreakTitle')}
                className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-[12px] bg-[#FFF5E6] border-2 border-[#FFD9A6] text-[#FF9600] text-xs font-extrabold"
              >
                <Flame className="w-4 h-4 fill-[#FF9600] text-[#FF9600] animate-pulse shrink-0" />
                <span>{user.streak}</span>
              </div>

              {/* XP Pill */}
              <div
                title={t('topbarXpTitle')}
                className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-[12px] bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] text-xs font-extrabold"
              >
                <Zap className="w-4 h-4 fill-[#FFC800] text-[#FFC800] shrink-0" />
                <span>{user.xp.toLocaleString()} XP</span>
              </div>

              {/* Sync Dot Pill */}
              <div
                title={
                  currentUser
                    ? isHe
                      ? 'מחובר ומסונכרן עם Firestore'
                      : 'Live Firestore Sync'
                    : isHe
                    ? 'מצב אורח (שמירה מקומית)'
                    : 'Local Mode'
                }
                className={`px-2.5 py-1.5 rounded-[12px] border-2 text-[11px] font-extrabold flex items-center gap-1.5 ${
                  currentUser
                    ? 'bg-[#EBF7E3] border-[#B5E7A0] text-[#58A700]'
                    : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#777777]'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {currentUser && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      currentUser ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                </span>
                <span className="text-[10px]">
                  {currentUser ? (isHe ? 'ענן' : 'Sync') : isHe ? 'מקומי' : 'Local'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Search Bar (Ctrl + K) inside Sidebar */}
          {onOpenSearch && (
            <button
              id="sidebar-search-btn"
              onClick={() => {
                onOpenSearch();
                if (onCloseMobile) onCloseMobile();
              }}
              title={isHe ? 'חיפוש מהיר (Ctrl + K)' : 'Quick Search (Ctrl + K)'}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-[12px] bg-[#F7F7F7] hover:bg-[#EBEBEB] border-2 border-[#E5E5E5] text-[#777777] hover:text-[#3C3C3C] text-xs font-extrabold transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1CB0F6] shrink-0" />
                {!isCollapsed && <span>{isHe ? 'חיפוש מהיר...' : 'Quick Search...'}</span>}
              </div>
              {!isCollapsed && (
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E5E5E5] rounded text-[#777777]">
                  ⌘K
                </kbd>
              )}
            </button>
          )}
        </div>

        {/* Navigation Links & Language Drop Menu */}
        <nav className="flex-1 px-2.5 py-3 space-y-1.5 overflow-y-auto overflow-x-visible">
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.screen ||
              (item.screen === 'practice' &&
                (currentScreen === 'courses' || currentScreen === 'dragdrop'));

            return (
              <div
                key={item.screen}
                className="space-y-1 relative"
                ref={item.screen === 'practice' ? flyoutRef : undefined}
              >
                <button
                  id={`sidebar-link-${item.screen}`}
                  onClick={() => {
                    if (item.screen === 'practice') {
                      if (isCollapsed) {
                        setShowCollapsedFlyout((prev) => !prev);
                      } else {
                        setIsLanguagesExpanded((prev) => !prev);
                      }
                      handleNavClick('practice');
                    } else {
                      handleNavClick(item.screen);
                    }
                  }}
                  title={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                  } rounded-[16px] text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#DBF8C5] text-[#58A700] border-2 border-[#58CC02]'
                      : 'text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`${isActive ? 'text-[#58CC02]' : 'text-[#777777]'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
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
                      {item.screen === 'practice' && (
                        <ChevronDown
                          className={`w-4 h-4 text-[#58A700] transition-transform duration-200 ${
                            isLanguagesExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  )}
                </button>

                {/* EXPANDED SIDEBAR: Interactive Drop Menu for Programming Languages */}
                {item.screen === 'practice' && !isCollapsed && isLanguagesExpanded && (
                  <div
                    id="sidebar-practice-dropmenu"
                    className={`mt-1 mb-2 p-2 rounded-[16px] bg-[#F9FBF7] border-2 border-[#58CC02]/30 space-y-1`}
                  >
                    <div className="px-2 py-1 flex items-center justify-between text-[10px] font-black text-[#58A700] uppercase">
                      <span>🕷️ {isHe ? 'תת-מודולות שפות קוד' : 'Language Sub-modules'}</span>
                      <span>{SIDEBAR_LANGUAGES.length}</span>
                    </div>

                    {SIDEBAR_LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        id={`sidebar-sublang-${lang.id}`}
                        onClick={() => {
                          onNavigate('practice', { courseId: lang.courseId, language: lang.id });
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="w-full flex items-center justify-between py-2 px-2.5 rounded-[12px] bg-white hover:bg-[#EBF7E3] border border-[#E5E5E5] hover:border-[#58CC02] transition-all cursor-pointer group text-start"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg group-hover:scale-110 transition-transform shrink-0">
                            {lang.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-[#3C3C3C] group-hover:text-[#58A700] truncate">
                              {isHe ? lang.labelHe : lang.labelEn}
                            </div>
                            <div className="text-[10px] text-[#777777] font-semibold truncate">
                              {isHe ? lang.descHe : lang.descEn}
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#F7F7F7] group-hover:bg-[#58CC02] text-[#777777] group-hover:text-white transition-colors shrink-0">
                          {isHe ? lang.badgeHe : lang.badgeEn}
                        </span>
                      </button>
                    ))}

                    {/* Quick switch between Syntax Drag & Drop and All Courses Roadmap */}
                    <div className="pt-1.5 grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onNavigate('practice');
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="py-1.5 px-2 rounded-[10px] bg-[#EBF7E3] hover:bg-[#DBF8C5] text-[#58A700] text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Puzzle className="w-3 h-3" />
                        <span>{isHe ? 'פאזל סינתקס' : 'Syntax Deck'}</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('courses');
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="py-1.5 px-2 rounded-[10px] bg-white hover:bg-[#EBEBEB] border border-[#E5E5E5] text-[#3C3C3C] text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{isHe ? 'כל המסלולים' : 'All Tracks'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* COLLAPSED SIDEBAR: Floating Drop Menu Popover when clicking Practice icon */}
                {item.screen === 'practice' && isCollapsed && showCollapsedFlyout && (
                  <div
                    className={`fixed ${
                      isRtl ? 'right-22' : 'left-22'
                    } top-36 w-72 bg-white rounded-[20px] shadow-2xl border-2 border-[#58CC02] p-3 z-50 space-y-1.5`}
                  >
                    <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2 mb-1">
                      <span className="text-xs font-black text-[#3C3C3C]">
                        🕸️ {isHe ? 'בחר שפת קוד לתרגול' : 'Select Code Language'}
                      </span>
                      <button
                        onClick={() => setShowCollapsedFlyout(false)}
                        className="text-xs text-[#777777] hover:text-[#3C3C3C] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    {SIDEBAR_LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setShowCollapsedFlyout(false);
                          onNavigate('practice', { courseId: lang.courseId, language: lang.id });
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-[12px] hover:bg-[#EBF7E3] text-start transition-colors cursor-pointer"
                      >
                        <span className="text-lg">{lang.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-[#3C3C3C] truncate">
                            {isHe ? lang.labelHe : lang.labelEn}
                          </div>
                          <div className="text-[10px] text-[#777777] truncate">
                            {isHe ? lang.descHe : lang.descEn}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Code Mentor Callout Card in Sidebar */}
          <div className="pt-2">
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
              <div className="p-3 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] text-start">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-[8px] bg-[#1CB0F6] text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3C3C3C]">
                    {t('topbarMentorBtn')}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full bg-[#58CC02] animate-pulse ${
                      isRtl ? 'mr-auto' : 'ml-auto'
                    }`}
                    title="Ready"
                  />
                </div>
                <p className="text-[11px] text-[#777777] mb-2.5 leading-relaxed font-semibold">
                  {isRtl
                    ? 'צריך רמז ידידותי מספיידי? שאל את מנטור ה-AI!'
                    : 'Need a friendly web hint? Ask your AI Code Mentor!'}
                </p>
                <button
                  id="sidebar-open-mentor-btn"
                  onClick={() => {
                    onOpenMentor();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="w-full btn-outline text-xs font-extrabold !py-1.5 !px-3"
                >
                  <span>{isRtl ? 'שאל את המנטור' : 'Ask Mentor'}</span>
                  {isRtl ? (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Section: Language/Sound Controls + User Profile & Google Auth */}
        <div className="p-3 border-t-2 border-[#E5E5E5] space-y-2.5 bg-[#FAFAFA]">
          {/* App Language Switcher + Sound Toggle */}
          <div
            className={`flex items-center ${
              isCollapsed ? 'flex-col gap-1.5' : 'justify-between gap-2'
            }`}
          >
            <button
              id="sidebar-toggle-language-btn"
              onClick={toggleLanguage}
              title={language === 'en' ? 'עבור לעברית' : 'Switch to English'}
              className={`flex items-center justify-center gap-1.5 ${
                isCollapsed ? 'w-11 h-9' : 'flex-1 py-1.5 px-2.5'
              } rounded-[12px] bg-white border-2 border-[#E5E5E5] hover:border-[#AFAFAF] text-[#3C3C3C] text-xs font-extrabold transition-all cursor-pointer`}
            >
              <Languages className="w-3.5 h-3.5 text-[#1CB0F6] shrink-0" />
              {!isCollapsed && <span>{language === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}</span>}
            </button>

            {onToggleSound && (
              <button
                id="sidebar-toggle-sound-btn"
                onClick={onToggleSound}
                title={user.soundEnabled ? t('topbarSoundMute') : t('topbarSoundEnable')}
                className={`flex items-center justify-center ${
                  isCollapsed ? 'w-11 h-9' : 'p-2'
                } rounded-[12px] bg-white border-2 border-[#E5E5E5] hover:border-[#AFAFAF] text-[#777777] hover:text-[#3C3C3C] transition-all cursor-pointer`}
              >
                {user.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#58CC02]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#AFAFAF]" />
                )}
              </button>
            )}
          </div>

          {/* User Profile & Google Sign In / Sign Out */}
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div
                id="sidebar-user-profile"
                onClick={() => handleNavClick('settings')}
                title={`${displayName} - Lvl ${user.level}`}
                className={`flex-1 flex items-center ${
                  isCollapsed ? 'justify-center p-1' : 'gap-2.5 p-1.5'
                } rounded-[14px] hover:bg-white border-2 border-transparent hover:border-[#E5E5E5] transition-all cursor-pointer min-w-0`}
              >
                <div className="relative shrink-0">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#58CC02]"
                  />
                  <span
                    className={`absolute bottom-0 ${
                      isRtl ? 'left-0' : 'right-0'
                    } w-2.5 h-2.5 rounded-full bg-[#58CC02] border-2 border-white`}
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-[#3C3C3C] truncate">
                        {displayName}
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FFC800]/20 text-[#CC9900] shrink-0">
                        Lvl {user.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#58A700] font-semibold">
                      <Cloud className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {isHe ? 'מסונכרן לענן' : 'Firestore Synced'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <button
                  onClick={() => signOut()}
                  title={isHe ? 'התנתק מחשבון' : 'Sign Out'}
                  className="p-2 rounded-[12px] bg-[#FFE0E0] hover:bg-[#FFCCCC] text-[#FF4B4B] transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              id="sidebar-signin-btn"
              onClick={() => signInWithGoogle()}
              title={isHe ? 'התחבר עם Google לסנכרון' : 'Sign in with Google to sync'}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2' : 'justify-center gap-2 p-2.5'
              } rounded-[14px] bg-white hover:bg-[#EBF7E3] border-2 border-[#E5E5E5] hover:border-[#58CC02] text-[#3C3C3C] text-xs font-extrabold transition-all cursor-pointer shadow-2xs`}
            >
              <LogIn className="w-4 h-4 text-[#58CC02] shrink-0" />
              {!isCollapsed && (
                <span>{isHe ? 'התחבר עם Google' : 'Sign in with Google'}</span>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
