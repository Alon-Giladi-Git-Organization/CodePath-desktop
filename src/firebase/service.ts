import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './error';
import {
  UserProfile,
  LeaderboardEntry,
} from '../types';

const LOCAL_STORAGE_PROFILE_KEY = 'codepath_local_profile';

/**
 * Checks if the current request is for an authenticated Firebase user
 */
export function isUserAuthenticated(userId?: string): boolean {
  if (!auth.currentUser) return false;
  if (!userId) return true;
  return auth.currentUser.uid === userId;
}

/**
 * Persists or updates the user profile in Firestore and syncs leaderboard entry
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profile: Partial<UserProfile> & { name: string; email: string; xp: number; level: string | number; streak: number }
): Promise<void> {
  const levelStr = String(profile.level || 'Beginner+');
  
  const payload: Record<string, unknown> = {
    id: userId,
    name: profile.name || 'Anonymous Learner',
    email: profile.email || 'user@example.com',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    xp: Math.max(0, Number(profile.xp) || 0),
    level: levelStr,
    streak: Math.max(0, Number(profile.streak) || 0),
    streakActiveToday: Boolean(profile.streakActiveToday ?? true),
    totalHours: Number(profile.totalHours) || 0,
    language: profile.language || 'en',
    activeCourseId: profile.activeCourseId || 'python-beginners',
    activeLessonId: profile.activeLessonId || 'python-1',
    activeExerciseId: profile.activeExerciseId || 'ex-python-intro',
    activeQuizId: profile.activeQuizId || 'quiz-python-basics',
    dailyGoalMinutes: Math.min(180, Math.max(0, Number(profile.dailyGoalMinutes) || 15)),
    editorFontSize: profile.editorFontSize || 'md',
    soundEnabled: Boolean(profile.soundEnabled ?? true),
    completedLessons: Array.isArray(profile.completedLessons) ? profile.completedLessons : [],
    completedExercises: Array.isArray(profile.completedExercises) ? profile.completedExercises : [],
    completedArchitectureChallenges: Array.isArray(profile.completedArchitectureChallenges) ? profile.completedArchitectureChallenges : [],
    quizScores: profile.quizScores && typeof profile.quizScores === 'object' ? profile.quizScores : {},
    unlockedAchievements: Array.isArray(profile.unlockedAchievements) ? profile.unlockedAchievements : [],
    updatedAt: new Date().toISOString(),
  };

  // Keep a local backup in localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore local storage errors
  }

  // If not authenticated with Firebase, don't execute unauthorized Firestore write
  if (!isUserAuthenticated(userId)) {
    return;
  }

  const userRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  try {
    await setDoc(userRef, payload, { merge: true });

    // Also sync the public leaderboard record
    const lbRef = doc(db, 'leaderboard', userId);
    const lbPayload = {
      id: userId,
      userId: userId,
      displayName: String(payload.name).substring(0, 100),
      photoURL: String(payload.avatar).substring(0, 500),
      xp: payload.xp,
      level: levelStr,
      streak: payload.streak,
      badgesCount: (payload.unlockedAchievements as string[] || []).length,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(lbRef, lbPayload, { merge: true });
    console.info(`[Firestore] Successfully synced profile and leaderboard for UID: ${userId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Retrieves the user profile from Firestore or local fallback
 */
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  if (!isUserAuthenticated(userId)) {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  const userRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data() as UserProfile;
    console.info(`[Firestore] Retrieved profile for UID: ${userId}, XP: ${data.xp}, Lessons: ${data.completedLessons?.length || 0}`);
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Subscribes to real-time profile updates for the current user across devices (Desktop <-> Mobile)
 */
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: UserProfile) => void
): () => void {
  if (!isUserAuthenticated(userId)) {
    return () => {};
  }

  const userRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        onUpdate(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Retrieves top leaderboard users ordered by XP descending
 */
export async function getLeaderboardFromFirestore(maxEntries: number = 25): Promise<LeaderboardEntry[]> {
  const lbRef = collection(db, 'leaderboard');
  const path = 'leaderboard';

  try {
    const q = query(lbRef, orderBy('xp', 'desc'), limit(maxEntries));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d, index) => ({
        id: d.id,
        ...d.data(),
        rank: index + 1,
      } as LeaderboardEntry));
    }
  } catch (error) {
    console.warn('Leaderboard fetch fallback:', error);
  }

  // Fallback demo leaderboard entries if empty
  return [
    {
      id: 'demo-1',
      userId: 'demo-1',
      displayName: 'Alex Chen (Staff Architect)',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      xp: 14250,
      level: 'Advanced',
      streak: 42,
      badgesCount: 16,
      rank: 1,
    },
    {
      id: 'demo-2',
      userId: 'demo-2',
      displayName: 'Maya Lin (Senior Engineer)',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      xp: 11800,
      level: 'Intermediate+',
      streak: 28,
      badgesCount: 12,
      rank: 2,
    },
    {
      id: 'demo-3',
      userId: 'demo-3',
      displayName: 'David K. (System Specialist)',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      xp: 8650,
      level: 'Intermediate',
      streak: 19,
      badgesCount: 9,
      rank: 3,
    },
  ];
}
