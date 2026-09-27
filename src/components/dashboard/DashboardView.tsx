import React from 'react';
import { UserProfile, Course, NavScreen } from '../../types';
import { COURSES, LESSONS, ACHIEVEMENTS } from '../../data/mockData';
import { ARCHITECTURE_CHALLENGES } from '../../data/architectureChallenges';
import { useLanguage } from '../../i18n/LanguageContext';
import { ProgressBar } from '../common/ProgressBar';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Play, 
  Flame, 
  Zap, 
  BookCheck, 
  Clock, 
  Sparkles, 
  Award, 
  ChevronRight,
  Terminal, 
  Layers,
  Check,
  Lock,
  Star
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  onOpenMentor,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const activeCourse = COURSES.find((c) => c.id === user.activeCourseId) || COURSES[0];
  const activeLesson = LESSONS[user.activeLessonId] || LESSONS['python-13'];

  // Flatten course lessons for skill tree display
  const courseLessons = activeCourse.modules.flatMap((m) => m.lessons);
  const completedInCourse = courseLessons.filter((l) => user.completedLessons.includes(l.id)).length;
  const progressPercentage = Math.round((completedInCourse / (activeCourse.totalLessons || 28)) * 100);

  const daysOfWeek = isHe 
    ? ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getLessonBubbleStyle = (lessonId: string, order: number, type?: string) => {
    const isCompleted = user.completedLessons.includes(lessonId);
    const isActive = user.activeLessonId === lessonId;

    if (isCompleted) {
      return {
        bg: 'bg-[#58CC02]',
        borderBottom: 'border-b-[6px] border-[#58A700]',
        icon: <Check className="w-8 h-8 text-white stroke-[3]" />,
        textColor: 'text-[#58A700]',
        pulse: false,
      };
    }

    if (isActive) {
      return {
        bg: 'bg-[#1CB0F6]',
        borderBottom: 'border-b-[6px] border-[#1B99D6]',
        icon: <Play className="w-8 h-8 text-white fill-white ml-1" />,
        textColor: 'text-[#1CB0F6]',
        pulse: true,
      };
    }

    // Locked or available
    return {
      bg: 'bg-[#E5E5E5]',
      borderBottom: 'border-b-[6px] border-[#D7D7D7]',
      icon: <Lock className="w-6 h-6 text-[#AFAFAF]" />,
      textColor: 'text-[#AFAFAF]',
      pulse: false,
    };
  };

  return (
    <div id="dashboard-screen" className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* 1. Playful Hero Greeting Banner */}
      <div className="cose-card relative overflow-hidden bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start max-w-2xl">
          <CoseMascot
            mood="happy"
            size="lg"
            speechBubble={isHe ? 'מוכן לתרגל היום?' : 'Ready to code?'}
          />
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3C3C3C]">
              {t('dashWelcome')}, {user.name}!
            </h1>
            <p className="text-sm sm:text-base text-[#777777] font-semibold leading-relaxed">
              {isHe
                ? `אתה מתקדם מצוין ב-${activeCourse.titleHe || activeCourse.title}. בוא נמשיך בתרגול!`
                : `You are making great strides in ${activeCourse.title}. Let's keep your streak alive!`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            id="dash-resume-lesson-hero-btn"
            onClick={() => {
              soundFx.playClick();
              onNavigate('lesson', { lessonId: activeLesson.id, courseId: activeCourse.id });
            }}
            className="btn-primary"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t('buttonContinueLesson')}</span>
          </button>
          <button
            id="dash-ask-mentor-hero-btn"
            onClick={() => {
              soundFx.playClick();
              onOpenMentor(isHe ? 'תוכל לתת לי רמז על לולאות ותנאים?' : 'Can you explain while loops to me?');
            }}
            className="btn-outline"
          >
            <Sparkles className="w-4 h-4 text-[#1CB0F6]" />
            <span>{t('topbarMentorBtn')}</span>
          </button>
        </div>
      </div>

      {/* 2. Core Gamification Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="cose-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFF5E6] border-2 border-[#FFD9A6] flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7 text-[#FF9600] fill-[#FF9600] animate-pulse" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.streak} {isHe ? 'ימים' : 'Days'}
            </div>
            <div className="text-xs font-bold text-[#FF9600] uppercase tracking-wide">
              {t('dashActiveStreak')}
            </div>
          </div>
        </div>

        {/* Total XP */}
        <div className="cose-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFFBE6] border-2 border-[#FFE885] flex items-center justify-center shrink-0">
            <Zap className="w-7 h-7 text-[#FFC800] fill-[#FFC800]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-[#CC9900] uppercase tracking-wide">
              {t('dashTotalXp')}
            </div>
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="cose-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#DBF8C5] border-2 border-[#89E219] flex items-center justify-center shrink-0">
            <BookCheck className="w-6 h-6 text-[#58A700]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.completedLessons.length}
            </div>
            <div className="text-xs font-bold text-[#58A700] uppercase tracking-wide">
              {t('dashCompletedLessons')}
            </div>
          </div>
        </div>

        {/* Study Hours */}
        <div className="cose-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#EBF8FF] border-2 border-[#BEE3F8] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#1CB0F6]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.totalHours} hrs
            </div>
            <div className="text-xs font-bold text-[#1CB0F6] uppercase tracking-wide">
              {t('dashStudyTime')}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Stage: Duolingo Skill Tree Path & Streak Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center Skill Tree Column (7 Cols) */}
        <div className="lg:col-span-7 cose-card p-6 sm:p-8 space-y-8">
          <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#58A700]">
                {isHe && activeCourse.titleHe ? activeCourse.titleHe : activeCourse.title}
              </span>
              <h2 className="text-xl font-extrabold text-[#3C3C3C] mt-0.5">
                {isHe ? 'מסלול הלימוד שלך' : 'Your Learning Path'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#777777]">
                {completedInCourse}/{activeCourse.totalLessons || 28} ({progressPercentage}%)
              </span>
              <div className="w-28 mt-1">
                <ProgressBar value={progressPercentage} size="sm" color="green" />
              </div>
            </div>
          </div>

          {/* Skill Tree Nodes */}
          <div className="flex flex-col items-center gap-8 py-4">
            {courseLessons.slice(0, 7).map((ls, idx) => {
              const isCompleted = user.completedLessons.includes(ls.id);
              const isActive = user.activeLessonId === ls.id;
              const isLocked = !isCompleted && !isActive;
              const bubble = getLessonBubbleStyle(ls.id, ls.order, ls.type);

              // Duolingo winding pattern offsets
              const offsets = [0, 40, -40, 30, -30, 0, 35];
              const xOffset = offsets[idx % offsets.length];

              return (
                <div
                  key={ls.id}
                  className="flex flex-col items-center"
                  style={{ transform: `translateX(${xOffset}px)` }}
                >
                  {/* Skill Bubble (80x72px) with 6px bottom border */}
                  <button
                    id={`skill-node-${ls.id}`}
                    disabled={isLocked}
                    onClick={() => {
                      soundFx.playClick();
                      onNavigate('lesson', { lessonId: ls.id, courseId: activeCourse.id });
                    }}
                    className={`w-20 h-[72px] rounded-full ${bubble.bg} ${bubble.borderBottom} flex items-center justify-center transition-all cursor-pointer select-none active:translate-y-[4px] active:border-b-0 ${
                      isActive ? 'ring-4 ring-[#1CB0F6]/30 animate-bounce' : 'hover:scale-105'
                    }`}
                  >
                    {bubble.icon}
                  </button>

                  {/* Title Label */}
                  <div className="mt-2 text-center max-w-[130px]">
                    <span className="text-xs font-extrabold text-[#3C3C3C] block leading-tight">
                      {isHe && ls.titleHe ? ls.titleHe : ls.title}
                    </span>
                    <span className={`text-[10px] font-bold ${bubble.textColor}`}>
                      {isCompleted ? (isHe ? 'הושלם ✓' : 'Completed ✓') : isActive ? (isHe ? 'הנוכחי' : 'Current') : (isHe ? 'נעול' : 'Locked')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => onNavigate('courses')}
              className="btn-outline text-xs font-extrabold"
            >
              <span>{isHe ? 'צפה בכל המסלולים והשיעורים' : 'View All Learning Paths'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Weekly Streak Calendar & Architecture Promo (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weekly Streak Card */}
          <div className="cose-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#FFF5E6] border-2 border-[#FFD9A6] flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#FF9600] fill-[#FF9600]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#3C3C3C]">
                  {user.streak} {t('topbarStreak')}
                </h3>
                <p className="text-xs text-[#777777] font-semibold">
                  {isHe ? 'השלם תרגיל כדי להאריך את הרצף!' : 'Complete a session to extend your streak!'}
                </p>
              </div>
            </div>

            {/* 7-Day Tracker */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {daysOfWeek.map((day, i) => {
                const isPassed = i < user.streak % 7 || (user.streak >= 7 && i < 6);
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs border-2 ${
                        isPassed
                          ? 'bg-[#58CC02] border-[#58A700] text-white shadow-xs'
                          : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF]'
                      }`}
                    >
                      {isPassed ? '✓' : '○'}
                    </div>
                    <span className="text-[11px] font-bold text-[#777777]">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architecture Lab Callout Card */}
          <div className="cose-card p-6 space-y-3 bg-[#F7F7F7]">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-[8px] bg-[#1CB0F6] text-white flex items-center justify-center font-extrabold text-xs">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
                {isHe ? 'מעבדת ארכיטקטורה' : 'Architecture Lab'}
              </span>
            </div>
            <h4 className="font-extrabold text-base text-[#3C3C3C]">
              {t('dashArchBannerTitle')}
            </h4>
            <p className="text-xs text-[#777777] font-semibold leading-relaxed">
              {t('dashArchBannerSub')}
            </p>
            <button
              id="dash-enter-architecture-btn"
              onClick={() => {
                soundFx.playClick();
                onNavigate('architecture');
              }}
              className="w-full btn-secondary text-xs font-extrabold !py-2.5"
            >
              <span>{t('dashArchBannerBtn')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Daily Goal Card */}
          <div className="cose-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
                {t('dashDailyGoal')}
              </span>
              <span className="text-xs font-extrabold text-[#58A700]">
                {user.dailyGoalMinutes} min / day
              </span>
            </div>
            <ProgressBar value={100} size="md" color="green" />
            <p className="text-xs text-[#777777] font-semibold">
              {t('dashDailyGoalDesc')} 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
