import React, { useState, useEffect, useRef } from 'react';
import { useLearningState } from './hooks/useLearningState';
import { useLanguage } from './i18n/LanguageContext';
import { useAuth } from './firebase/AuthContext';
import { 
  syncUserProfileToFirestore, 
  getUserProfileFromFirestore, 
  subscribeToUserProfile 
} from './firebase/service';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { CodeMentorDrawer } from './components/mentor/CodeMentorDrawer';

import { DashboardView } from './components/dashboard/DashboardView';
import { CoursesView } from './components/courses/CoursesView';
import { LessonView } from './components/lesson/LessonView';
import { CodePracticeView } from './components/practice/CodePracticeView';
import { ArchitectureLabView } from './components/architecture/ArchitectureLabView';
import { QuizView } from './components/quiz/QuizView';
import { StatsAndAchievementsView } from './components/stats/StatsAndAchievementsView';
import { SettingsView } from './components/settings/SettingsView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';

export default function App() {
  const {
    user,
    setUser,
    currentScreen,
    activeLessonId,
    activeExerciseId,
    activeQuizId,
    isDarkMode,
    toggleDarkMode,
    toggleSound,
    navigateTo,
    completeLesson,
    completeExercise,
    completeArchitectureChallenge,
    recordQuizScore,
    resetAllData,
    toasts,
    addToast,
    removeToast,
  } = useLearningState();

  const { isRtl, language } = useLanguage();
  const { effectiveUserId, currentUser, authError, clearAuthError } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorInitialPrompt, setMentorInitialPrompt] = useState<string | undefined>(undefined);
  const isInitialRemoteLoadDone = useRef(false);

  // Notify on Auth Error
  useEffect(() => {
    if (authError) {
      addToast({
        type: 'error',
        title: language === 'he' ? 'שגיאת התחברות' : 'Sign-In Error',
        message: authError,
      });
      clearAuthError();
    }
  }, [authError, addToast, language, clearAuthError]);

  // Load and Subscribe to Firestore User Profile when Authenticated
  useEffect(() => {
    if (!currentUser) {
      isInitialRemoteLoadDone.current = false;
      return;
    }

    let isMounted = true;

    // 1. Initial Remote Fetch from Firestore
    async function loadRemoteProfile() {
      try {
        const remoteData = await getUserProfileFromFirestore(currentUser!.uid);
        if (!isMounted) return;

        if (remoteData) {
          console.info('[App] Loaded remote profile from Firestore:', remoteData);
          setUser((prev) => ({
            ...prev,
            ...remoteData,
            name: currentUser!.displayName || remoteData.name || prev.name,
            email: currentUser!.email || remoteData.email || prev.email,
            avatar: currentUser!.photoURL || remoteData.avatar || prev.avatar,
            completedLessons: remoteData.completedLessons || prev.completedLessons || [],
            completedExercises: remoteData.completedExercises || prev.completedExercises || [],
            completedArchitectureChallenges: remoteData.completedArchitectureChallenges || prev.completedArchitectureChallenges || [],
            unlockedAchievements: remoteData.unlockedAchievements || prev.unlockedAchievements || [],
            quizScores: remoteData.quizScores || prev.quizScores || {},
          }));
          addToast({
            type: 'success',
            title: language === 'he' ? 'החשבון סונכרן בהצלחה! ☁️' : 'Profile Synced! ☁️',
            message: language === 'he' ? `ברוך שובך, ${currentUser!.displayName || 'לומד'}` : `Welcome back, ${currentUser!.displayName || 'Learner'}`,
          });
        } else {
          // If no remote profile exists yet in Firestore, immediately create it!
          console.info('[App] Creating new Firestore document for user:', currentUser!.uid);
          const initialProfile = {
            ...user,
            name: currentUser!.displayName || user.name,
            email: currentUser!.email || user.email,
            avatar: currentUser!.photoURL || user.avatar,
          };
          setUser(initialProfile);
          await syncUserProfileToFirestore(currentUser!.uid, initialProfile);
          addToast({
            type: 'success',
            title: language === 'he' ? 'חשבון חובר ל-Firestore 🚀' : 'Connected to Firestore 🚀',
            message: language === 'he' ? 'ההתקדמות שלך תישמר בענן בזמן אמת' : 'Your progress is now synced to the cloud',
          });
        }
      } catch (err) {
        console.error('[App] Failed to load remote profile:', err);
      } finally {
        isInitialRemoteLoadDone.current = true;
      }
    }

    loadRemoteProfile();

    // 2. Real-time Subscription (Cross-device sync Desktop <-> Mobile)
    const unsubscribe = subscribeToUserProfile(currentUser.uid, (remoteProfile) => {
      if (!isMounted) return;
      console.info('[App] Realtime profile update received from Firestore');
      setUser((prev) => {
        // Only update if remote data has higher XP or different progress
        return {
          ...prev,
          ...remoteProfile,
          name: currentUser.displayName || remoteProfile.name || prev.name,
          email: currentUser.email || remoteProfile.email || prev.email,
          avatar: currentUser.photoURL || remoteProfile.avatar || prev.avatar,
        };
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentUser]);

  // Sync state mutations to Firestore (debounced / on learning activity)
  useEffect(() => {
    if (currentUser && isInitialRemoteLoadDone.current) {
      syncUserProfileToFirestore(currentUser.uid, {
        ...user,
        name: currentUser.displayName || user.name,
        email: currentUser.email || user.email,
        avatar: currentUser.photoURL || user.avatar,
      }).catch((err) => {
        console.warn('[App] Background Firestore sync failed:', err);
      });
    }
  }, [
    user.xp, 
    user.streak, 
    user.level, 
    user.completedLessons.length, 
    user.completedExercises.length, 
    user.completedArchitectureChallenges?.length,
    currentUser
  ]);

  const handleOpenMentor = (initialPrompt?: string) => {
    setMentorInitialPrompt(initialPrompt);
    setIsMentorOpen(true);
  };

  const handleCloseMentor = () => {
    setIsMentorOpen(false);
    setMentorInitialPrompt(undefined);
  };

  return (
    <div className="min-h-screen bg-white text-[#3C3C3C] flex flex-col selection:bg-[#DBF8C5] selection:text-[#58A700]">
      {/* Top Navigation Bar */}
      <TopBar
        currentScreen={currentScreen}
        user={user}
        isDarkMode={false}
        onToggleDarkMode={toggleDarkMode}
        onToggleSound={toggleSound}
        onOpenMentor={() => handleOpenMentor()}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        onNavigate={navigateTo}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar & Mobile Drawer Navigation */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenMentor={() => handleOpenMentor()}
          user={user}
        />

        {/* Main Workspace Screen Content */}
        <main className={`flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 lg:pb-12 ${isRtl ? 'lg:mr-64' : 'lg:ml-64'}`}>
          {currentScreen === 'dashboard' && (
            <DashboardView
              user={user}
              onNavigate={navigateTo}
              onOpenMentor={handleOpenMentor}
            />
          )}

          {currentScreen === 'courses' && (
            <CoursesView
              user={user}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'lesson' && (
            <LessonView
              lessonId={activeLessonId}
              user={user}
              onNavigate={navigateTo}
              onCompleteLesson={completeLesson}
              onOpenMentor={handleOpenMentor}
            />
          )}

          {currentScreen === 'practice' && (
            <CodePracticeView
              exerciseId={activeExerciseId}
              user={user}
              initialSubModule="ide"
              onNavigate={navigateTo}
              onCompleteExercise={completeExercise}
              onOpenMentor={handleOpenMentor}
            />
          )}

          {currentScreen === 'dragdrop' && (
            <CodePracticeView
              exerciseId={activeExerciseId}
              user={user}
              initialSubModule="dragdrop"
              onNavigate={navigateTo}
              onCompleteExercise={completeExercise}
              onOpenMentor={handleOpenMentor}
            />
          )}

          {currentScreen === 'architecture' && (
            <ArchitectureLabView
              user={user}
              onNavigate={navigateTo}
              onOpenMentor={handleOpenMentor}
              onCompleteChallenge={completeArchitectureChallenge}
            />
          )}

          {currentScreen === 'leaderboard' && (
            <LeaderboardView
              user={user}
              onNavigateToArchitecture={() => navigateTo('architecture')}
              onNavigateToPractice={() => navigateTo('practice')}
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizView
              quizId={activeQuizId}
              user={user}
              onNavigate={navigateTo}
              onRecordScore={recordQuizScore}
              onOpenMentor={handleOpenMentor}
            />
          )}

          {(currentScreen === 'achievements' || currentScreen === 'stats') && (
            <StatsAndAchievementsView
              user={user}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsView
              user={user}
              isDarkMode={false}
              onToggleDarkMode={toggleDarkMode}
              onToggleSound={toggleSound}
              onUpdateUser={setUser}
              onResetData={resetAllData}
            />
          )}
        </main>
      </div>

      {/* Mobile Persistent Bottom Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onOpenMentor={() => handleOpenMentor()}
      />

      {/* AI Code Mentor Drawer */}
      <CodeMentorDrawer
        isOpen={isMentorOpen}
        onClose={handleCloseMentor}
        initialPrompt={mentorInitialPrompt}
      />

      {/* Global Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
