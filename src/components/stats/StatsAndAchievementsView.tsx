import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ACHIEVEMENTS, WEEKLY_ACTIVITY, TOPIC_PROFICIENCY } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CoseMascot } from '../common/CoseMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Trophy, 
  Flame, 
  Zap, 
  BookCheck, 
  Clock, 
  Lock, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface StatsAndAchievementsViewProps {
  user: UserProfile;
  onNavigate: (screen: any, opts?: any) => void;
}

export const StatsAndAchievementsView: React.FC<StatsAndAchievementsViewProps> = ({
  user,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = ACHIEVEMENTS.filter((a) => user.unlockedAchievements.includes(a.id)).length;
  const maxWeeklyMinutes = Math.max(...WEEKLY_ACTIVITY.map((d) => d.minutes));

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = user.unlockedAchievements.includes(ach.id);
    if (activeTab === 'unlocked') return isUnlocked;
    if (activeTab === 'locked') return !isUnlocked;
    return true;
  });

  const daysOfWeek = isHe 
    ? ['ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳', 'א׳']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div id="stats-screen" className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="cose-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CoseMascot mood="celebrating" size="md" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C]">
              {t('statsTitle')}
            </h1>
            <p className="text-sm text-[#777777] font-semibold mt-1">
              {t('statsSub')}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] text-xs font-extrabold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FFC800]" />
          <span>{unlockedCount} / {ACHIEVEMENTS.length} {isHe ? 'תגים נפתחו' : 'Badges Unlocked'}</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Lessons */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#DBF8C5] border-2 border-[#89E219] flex items-center justify-center shrink-0">
            <BookCheck className="w-6 h-6 text-[#58A700]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.completedLessons.length}
            </div>
            <div className="text-xs font-bold text-[#58A700] uppercase tracking-wide">
              {t('dashCompletedLessons')}
            </div>
          </div>
        </div>

        {/* XP Points */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFFBE6] border-2 border-[#FFE885] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-[#FFC800] fill-[#FFC800]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-[#CC9900] uppercase tracking-wide">
              {t('dashTotalXp')}
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFF5E6] border-2 border-[#FFD9A6] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-[#FF9600] fill-[#FF9600] animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.streak} {isHe ? 'ימים' : 'Days'}
            </div>
            <div className="text-xs font-bold text-[#FF9600] uppercase tracking-wide">
              {t('dashActiveStreak')} 🔥
            </div>
          </div>
        </div>

        {/* Study Hours */}
        <div className="cose-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#EBF8FF] border-2 border-[#BEE3F8] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#1CB0F6]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#3C3C3C] leading-tight">
              {user.totalHours} {isHe ? 'שעות' : 'hrs'}
            </div>
            <div className="text-xs font-bold text-[#1CB0F6] uppercase tracking-wide">
              {t('dashStudyTime')}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Weekly Activity Chart + Topic Proficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Activity Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 cose-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#58A700]">
                {t('statsWeeklyActivity')}
              </span>
              <h2 className="text-lg font-extrabold text-[#3C3C3C] mt-0.5">
                {isHe ? 'דקות אימון וקצב צבירת נקודות' : 'Practice Time & XP Velocity'}
              </h2>
            </div>
            <span className="text-xs font-bold text-[#777777]">{t('statsMinutesSpent')}</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 border-b-2 border-[#E5E5E5]">
            {WEEKLY_ACTIVITY.map((d, idx) => {
              const heightPercent = Math.round((d.minutes / maxWeeklyMinutes) * 100);
              const dayLabel = daysOfWeek[idx] || d.shortDay;

              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-extrabold text-[#777777] group-hover:text-[#58CC02] transition-colors">
                    {d.minutes}m
                  </span>
                  <div className="w-full max-w-[36px] bg-[#F7F7F7] rounded-t-[10px] h-32 flex items-end overflow-hidden p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-[8px] transition-all duration-500 ${
                        d.isToday ? 'bg-[#58CC02]' : 'bg-[#1CB0F6]'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-extrabold ${d.isToday ? 'text-[#58A700]' : 'text-[#777777]'}`}>
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Proficiency (5 Cols) */}
        <div className="lg:col-span-5 cose-card p-6 sm:p-8 space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
              {t('statsTopicProficiency')}
            </span>
            <h2 className="text-lg font-extrabold text-[#3C3C3C] mt-0.5">
              {isHe ? 'רמת שליטה ומיומנויות' : 'Mastery by Topic'}
            </h2>
          </div>

          <div className="space-y-4">
            {TOPIC_PROFICIENCY.map((tp) => (
              <div key={tp.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-[#3C3C3C]">
                  <span>{tp.name}</span>
                  <span className={`font-extrabold ${tp.proficiency >= 80 ? 'text-[#58A700]' : 'text-[#FF9600]'}`}>
                    {tp.proficiency}%
                  </span>
                </div>
                <ProgressBar
                  value={tp.proficiency}
                  size="sm"
                  color={tp.proficiency >= 80 ? 'green' : 'orange'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges and Achievements Grid */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#3C3C3C]">
              {isHe ? 'תגי כבוד והישגים' : 'Badges & Trophies'}
            </h3>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              {isHe ? 'השלם אתגרים, בחנים ורצפי למידה כדי לפתוח את כל התגים.' : 'Unlock milestones through continuous learning and clean code architecture.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F7] p-1 rounded-[12px] border border-[#E5E5E5]">
            {(['all', 'unlocked', 'locked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1 rounded-[8px] text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-[#3C3C3C] shadow-xs'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                {tab === 'all' ? (isHe ? 'הכל' : 'All') : tab === 'unlocked' ? (isHe ? 'נפתחו' : 'Unlocked') : (isHe ? 'נעולים' : 'Locked')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => {
            const isUnlocked = user.unlockedAchievements.includes(ach.id);
            const achTitle = isHe && ach.titleHe ? ach.titleHe : ach.title;
            const achDesc = isHe && ach.descriptionHe ? ach.descriptionHe : ach.description;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-[16px] border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-white border-[#E5E5E5] hover:border-[#58CC02]'
                    : 'bg-[#F7F7F7] border-[#E5E5E5] opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border-2 ${
                    isUnlocked
                      ? 'bg-[#FFFBE6] border-[#FFE885] text-[#FFC800]'
                      : 'bg-[#E5E5E5] border-[#D7D7D7] text-[#AFAFAF]'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6 fill-[#FFC800]" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-[#3C3C3C]">{achTitle}</h4>
                  </div>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed line-clamp-2">
                    {achDesc}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFFBE6] text-[#CC9900] border border-[#FFE885]">
                      +{ach.xpBonus} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
