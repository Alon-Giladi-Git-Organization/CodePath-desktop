import React, { useState, useEffect } from 'react';
import { useLearningState } from './hooks/useLearningState';
import { useLanguage } from './i18n/LanguageContext';
import { useAuth } from './firebase/AuthContext';
import { syncUserProfileToFirestore } from './firebase/service';
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
    removeToast,
  } = useLearningState();

  const { isRtl } = useLanguage();
  const { effectiveUserId, currentUser } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorInitialPrompt, setMentorInitialPrompt] = useState<string | undefined>(undefined);

  // Sync state to Firestore on updates
  useEffect(() => {
    if (effectiveUserId) {
      syncUserProfileToFirestore(effectiveUserId, {
        ...user,
        name: currentUser?.displayName || user.name,
        email: currentUser?.email || user.email,
        avatar: currentUser?.photoURL || user.avatar,
      }).catch((err) => {
        console.warn('Background sync:', err);
      });
    }
  }, [user.xp, user.streak, user.completedLessons, effectiveUserId, currentUser]);

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
