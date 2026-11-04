import { useState, useEffect, useCallback } from 'react';
import { NavScreen, UserProfile, ToastMessage } from '../types';
import { INITIAL_USER, ACHIEVEMENTS } from '../data/mockData';
import { soundFx } from '../utils/sound';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'codepath_user_profile_v1';
const THEME_KEY = 'codepath_theme_v1';

export function useLearningState() {
  // Load user profile from localStorage or fallback to default
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER,
          ...parsed,
          completedArchitectureChallenges: parsed.completedArchitectureChallenges || INITIAL_USER.completedArchitectureChallenges || [],
          language: parsed.language || 'en',
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_USER;
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) return savedTheme === 'dark';
    } catch {
      // ignore
    }
    return false; // Default to light theme per prompt instructions ("A light background with a neutral tone")
  });

  const [currentScreen, setCurrentScreen] = useState<NavScreen>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string>(user.activeCourseId);
  const [activeLessonId, setActiveLessonId] = useState<string>(user.activeLessonId);
  const [activeExerciseId, setActiveExerciseId] = useState<string>(user.activeExerciseId);
  const [activeQuizId, setActiveQuizId] = useState<string>(user.activeQuizId);
  const [activeLanguage, setActiveLanguage] = useState<string>('all');

  // Mentor drawer
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [mentorInitialPrompt, setMentorInitialPrompt] = useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Sync sound manager enabled state
  useEffect(() => {
    soundFx.enabled = user.soundEnabled;
  }, [user.soundEnabled]);

  // Save user profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addXP = useCallback((amount: number, reason: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      if (newXp >= 2000 && prev.level !== 'Intermediate') {
        newLevel = 'Intermediate';
        soundFx.playFanfare();
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        addToast({
          type: 'xp',
          title: 'Level Up! 🌟',
          message: 'You have advanced to Intermediate level!',
          xpAmount: amount,
        });
      } else {
        soundFx.playSuccess();
        addToast({
          type: 'xp',
          title: `+${amount} XP Earned!`,
          message: reason,
          xpAmount: amount,
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  }, [addToast]);

  const completeLesson = useCallback((lessonId: string, courseId?: string) => {
    setUser((prev) => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }

      const updated = [...prev.completedLessons, lessonId];
      // Check achievements
      const unlocked = [...prev.unlockedAchievements];
      if (updated.length >= 10 && !unlocked.includes('ach-syntax-explorer')) {
        unlocked.push('ach-syntax-explorer');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        addToast({
          type: 'success',
          title: 'Achievement Unlocked! 🏆',
          message: 'Syntax Explorer: Completed 10 lessons!',
        });
      }

      return {
        ...prev,
        completedLessons: updated,
        unlockedAchievements: unlocked,
        activeLessonId: lessonId,
        activeCourseId: courseId || prev.activeCourseId,
      };
    });

    addXP(25, 'Lesson completed');
  }, [addXP, addToast]);

  const completeExercise = useCallback((exerciseId: string, xpReward: number = 50) => {
    setUser((prev) => {
      const alreadyDone = prev.completedExercises.includes(exerciseId);
      const updated = alreadyDone ? prev.completedExercises : [...prev.completedExercises, exerciseId];
      
      const unlocked = [...prev.unlockedAchievements];
      if (!unlocked.includes('ach-first-run')) {
        unlocked.push('ach-first-run');
        addToast({
          type: 'success',
          title: 'Achievement Unlocked! ⚡',
          message: 'First Code Run completed!',
        });
      }

      return {
        ...prev,
        completedExercises: updated,
        unlockedAchievements: unlocked,
      };
    });

    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    addXP(xpReward, 'Exercise solved successfully!');
  }, [addXP, addToast]);

  const recordQuizScore = useCallback((quizId: string, score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    const xpReward = score * 15;

    setUser((prev) => {
      const unlocked = [...prev.unlockedAchievements];
      if (percentage === 100 && !unlocked.includes('ach-quiz-ace')) {
        unlocked.push('ach-quiz-ace');
        addToast({
          type: 'success',
          title: 'Achievement Unlocked! 🎯',
          message: 'Quiz Ace: 100% Score!',
        });
      }

      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: { score, total, percentage },
        },
        unlockedAchievements: unlocked,
      };
    });

    if (score > 0) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      addXP(xpReward, `Quiz finished with ${score}/${total} score`);
    }
  }, [addXP, addToast]);

  const completeArchitectureChallenge = useCallback((challengeId: string, xpReward: number = 45) => {
    setUser((prev) => {
      const alreadyDone = (prev.completedArchitectureChallenges || []).includes(challengeId);
      const updated = alreadyDone 
        ? (prev.completedArchitectureChallenges || []) 
        : [...(prev.completedArchitectureChallenges || []), challengeId];

      const unlocked = [...prev.unlockedAchievements];
      if (updated.length >= 2 && !unlocked.includes('ach-arch-sentinel')) {
        unlocked.push('ach-arch-sentinel');
        addToast({
          type: 'success',
          title: 'Achievement Unlocked! 🛡️',
          message: 'Code Architect Sentinel: Diagnosed multiple fragile architectures!',
        });
      }

      return {
        ...prev,
        completedArchitectureChallenges: updated,
        unlockedAchievements: unlocked,
      };
    });

    soundFx.playSuccess();
    addXP(xpReward, 'Architecture challenge diagnosed and solved!');
  }, [addXP, addToast]);

  const navigateTo = useCallback((screen: NavScreen, opts?: {
    courseId?: string;
    lessonId?: string;
    exerciseId?: string;
    quizId?: string;
    language?: string;
  }) => {
    soundFx.playClick();
    if (opts?.courseId) setActiveCourseId(opts.courseId);
    if (opts?.lessonId) setActiveLessonId(opts.lessonId);
    if (opts?.exerciseId) setActiveExerciseId(opts.exerciseId);
    if (opts?.quizId) setActiveQuizId(opts.quizId);
    if (opts?.language) setActiveLanguage(opts.language);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openMentor = useCallback((initialPrompt?: string) => {
    soundFx.playClick();
    if (initialPrompt) {
      setMentorInitialPrompt(initialPrompt);
    }
    setIsMentorOpen(true);
  }, []);

  const closeMentor = useCallback(() => {
    soundFx.playClick();
    setIsMentorOpen(false);
  }, []);

  const toggleDarkMode = useCallback(() => {
    soundFx.playClick();
    setIsDarkMode((prev) => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    setUser((prev) => {
      const nextSound = !prev.soundEnabled;
      soundFx.enabled = nextSound;
      if (nextSound) soundFx.playClick();
      return { ...prev, soundEnabled: nextSound };
    });
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(INITIAL_USER);
    addToast({
      type: 'info',
      title: 'Progress Reset',
      message: 'Workspace restored to default beginner state.',
    });
  }, [addToast]);

  return {
    user,
    setUser,
    currentScreen,
    activeCourseId,
    activeLessonId,
    activeExerciseId,
    activeQuizId,
    activeLanguage,
    setActiveLanguage,
    isMentorOpen,
    mentorInitialPrompt,
    isDarkMode,
    toasts,
    navigateTo,
    openMentor,
    closeMentor,
    toggleDarkMode,
    toggleSound,
    completeLesson,
    completeExercise,
    completeArchitectureChallenge,
    recordQuizScore,
    addXP,
    addToast,
    removeToast,
    resetAllData,
  };
}
