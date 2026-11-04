import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { getLeaderboardFromFirestore } from '../../firebase/service';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Crown, 
  Sparkles, 
  Award,
  Layers,
  Terminal,
  ChevronRight
} from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
  onNavigateToArchitecture?: () => void;
  onNavigateToPractice?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  user,
  onNavigateToArchitecture,
  onNavigateToPractice,
}) => {
  const { language, isRtl } = useLanguage();
  const { currentUser, effectiveUserId } = useAuth();
  const isHe = language === 'he';

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboardFromFirestore(25);
      
      const baseSeed: LeaderboardEntry[] = [
        {
          id: 'lead-1',
          userId: 'user_architect_1',
          displayName: isHe ? 'ד״ר נועם כהן' : 'Dr. Noam Vance',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          xp: 14250,
          level: 28,
          streak: 42,
          badgesCount: 16,
          rank: 1,
        },
        {
          id: 'lead-2',
          userId: 'user_sarah_lead',
          displayName: isHe ? 'שרה לוי' : 'Sarah Jenkins',
          photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
          xp: 11950,
          level: 23,
          streak: 28,
          badgesCount: 12,
          rank: 2,
        },
        {
          id: 'lead-3',
          userId: 'user_alex_dev',
          displayName: isHe ? 'אלכס פרידמן' : 'Alex Chen',
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
          xp: 9400,
          level: 19,
          streak: 19,
          badgesCount: 9,
          rank: 3,
        },
        {
          id: 'lead-4',
          userId: 'user_maya_arch',
          displayName: isHe ? 'מאיה ברק' : 'Maya Lin',
          photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80',
          xp: 7120,
          level: 15,
          streak: 14,
          badgesCount: 7,
          rank: 4,
        },
      ];

      let merged = [...(data || [])];
      baseSeed.forEach((seed) => {
        if (!merged.some((m) => m.userId === seed.userId)) {
          merged.push(seed);
        }
      });

      const currentUserName = currentUser?.displayName || user.name;
      const currentUserPhoto = currentUser?.photoURL || user.avatar;
      const existingUserIdx = merged.findIndex((m) => m.userId === effectiveUserId);
      
      if (existingUserIdx >= 0) {
        merged[existingUserIdx].xp = Math.max(merged[existingUserIdx].xp, user.xp);
        merged[existingUserIdx].streak = user.streak;
        merged[existingUserIdx].displayName = currentUserName;
      } else {
        merged.push({
          id: effectiveUserId,
          userId: effectiveUserId,
          displayName: currentUserName,
          photoURL: currentUserPhoto,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          badgesCount: user.unlockedAchievements.length,
        });
      }

      merged.sort((a, b) => b.xp - a.xp);
      merged = merged.map((m, idx) => ({ ...m, rank: idx + 1 }));

      setLeaderboard(merged);
    } catch (err) {
      console.warn('Leaderboard loading offline fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [user.xp, effectiveUserId]);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="w-full max-w-full space-y-5 sm:space-y-6 pb-8">
      {/* Header Banner */}
      <div className="cose-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CoseMascot mood="celebrating" size="md" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C]">
              Global XP Leaderboard
            </h1>
            <p className="text-sm text-[#777777] font-semibold">
              Compete with fellow coders, climb divisions, and gain XP by finishing daily lessons.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] text-xs font-extrabold flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[#FFC800]" />
            <span>Diamond League</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4">
        {/* Rank 2 */}
        {topThree[1] && (
          <div className="cose-card p-5 text-center space-y-3 order-2 sm:order-1">
            <div className="relative inline-block">
              <img
                src={topThree[1].photoURL || user.avatar}
                alt={topThree[1].displayName}
                className="w-16 h-16 rounded-full object-cover border-4 border-[#E5E5E5] mx-auto"
              />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#E5E5E5] text-[#777777] font-extrabold text-xs flex items-center justify-center">
                2
              </span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-[#3C3C3C] truncate">{topThree[1].displayName}</h2>
              <span className="text-xs font-bold text-[#777777]">{topThree[1].xp.toLocaleString()} XP</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold / Elevated) */}
        {topThree[0] && (
          <div className="cose-card p-6 text-center space-y-3 order-1 sm:order-2 bg-[#FFFBE6]/40 border-[#FFC800]">
            <div className="relative inline-block">
              <img
                src={topThree[0].photoURL || user.avatar}
                alt={topThree[0].displayName}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#FFC800] mx-auto shadow-sm"
              />
              <span className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-[#FFC800] text-white font-extrabold text-sm flex items-center justify-center">
                👑
              </span>
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#3C3C3C] truncate">{topThree[0].displayName}</h2>
              <span className="text-sm font-extrabold text-[#CC9900]">{topThree[0].xp.toLocaleString()} XP</span>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {topThree[2] && (
          <div className="cose-card p-5 text-center space-y-3 order-3">
            <div className="relative inline-block">
              <img
                src={topThree[2].photoURL || user.avatar}
                alt={topThree[2].displayName}
                className="w-16 h-16 rounded-full object-cover border-4 border-[#FFD9A6] mx-auto"
              />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FFD9A6] text-[#CC7A00] font-extrabold text-xs flex items-center justify-center">
                3
              </span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-[#3C3C3C] truncate">{topThree[2].displayName}</h2>
              <span className="text-xs font-bold text-[#777777]">{topThree[2].xp.toLocaleString()} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table List */}
      <div className="cose-card p-4 sm:p-6 divide-y-2 divide-[#E5E5E5]">
        {leaderboard.map((entry) => {
          const isCurrentUser = entry.userId === effectiveUserId;
          return (
            <div
              key={entry.id || entry.userId}
              className={`py-3.5 px-3 flex items-center justify-between rounded-[12px] transition-colors ${
                isCurrentUser ? 'bg-[#DBF8C5]/50 font-extrabold' : 'hover:bg-[#F7F7F7]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-7 font-extrabold text-sm text-[#777777] text-center shrink-0">
                  #{entry.rank}
                </span>
                <img
                  src={entry.photoURL || user.avatar}
                  alt={entry.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-[#E5E5E5]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#3C3C3C] truncate">
                      {entry.displayName}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#58CC02] text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#777777] font-semibold">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#FF9600]" /> {entry.streak}d streak
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-extrabold text-[#3C3C3C]">
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
