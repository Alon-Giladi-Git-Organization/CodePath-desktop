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
  Exercise,
  UserSnippet,
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

  return [];
}

// Storage keys for offline-first fallback
const LOCAL_STORAGE_EXERCISES_KEY = 'codepath_local_exercises';
const LOCAL_STORAGE_SNIPPETS_KEY = 'codepath_local_snippets';
const LOCAL_STORAGE_NOTES_KEY = 'codepath_local_notes';

export const BASELINE_SEEDED_EXERCISES: Exercise[] = [
  {
    id: 'seed-py-list-comp',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'List Comprehension Filtering',
    titleHe: 'סינון רשימות עם List Comprehension',
    language: 'python',
    difficulty: 'Beginner',
    difficultyHe: 'מתחיל',
    taskDescription: 'Write a Python list comprehension that filters the given list `words` to keep only words with length > 4, then print the result.',
    taskDescriptionHe: 'כתוב ביטוי List Comprehension שמסנן את הרשימה הנתונה `words` ושומר רק מילים שאורכן גדול מ-4, והדפס את התוצאה.',
    requirements: [
      { id: 'req-1', text: 'Use syntax [w for w in words if len(w) > 4]', textHe: 'השתמש בתחביר [w for w in words if len(w) > 4]' },
      { id: 'req-2', text: 'Assign the filtered list to long_words and print it', textHe: 'השם את הרשימה המסוננת למשתנה long_words והדפס אותו' }
    ],
    starterCode: `words = ["code", "python", "dev", "algorithm", "loop", "syntax"]

# TODO: Filter words longer than 4 characters
long_words = [w for w in words if len(w) > 4]

print(long_words)`,
    solutionCode: `words = ["code", "python", "dev", "algorithm", "loop", "syntax"]
long_words = [w for w in words if len(w) > 4]
print(long_words)`,
    expectedOutput: `['python', 'algorithm', 'syntax']`,
    hints: ['Check len(w) > 4 inside your if condition'],
    hintsHe: ['בדוק ש-len(w) > 4 בתוך תנאי ה-if'],
    errorGuides: [],
    xpReward: 50,
    isAiGenerated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-js-reduce-sum',
    lessonId: 'js-arrays',
    courseId: 'javascript-modern',
    title: 'Array Sum with Reduce',
    titleHe: 'חישוב סכום מערך עם Reduce',
    language: 'javascript',
    difficulty: 'Beginner',
    difficultyHe: 'מתחיל',
    taskDescription: 'Calculate the total sum of the given numbers array using Array.prototype.reduce with an initial accumulator value of 0, then print "Total: {sum}".',
    taskDescriptionHe: 'חשב את הסכום הכולל של מערך המספרים בעזרת reduce עם ערך התחלתי 0 והדפס "Total: {sum}".',
    requirements: [
      { id: 'req-1', text: 'Use numbers.reduce((acc, curr) => acc + curr, 0)', textHe: 'השתמש ב-reduce עם צובר (accumulator)' },
      { id: 'req-2', text: 'Print Total: 150', textHe: 'הדפס Total: 150' }
    ],
    starterCode: `const numbers = [10, 20, 30, 40, 50];

// TODO: Sum the array with reduce
const total = numbers.reduce((acc, curr) => acc + curr, 0);

console.log(\`Total: \${total}\`);`,
    solutionCode: `const numbers = [10, 20, 30, 40, 50];
const total = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(\`Total: \${total}\`);`,
    expectedOutput: `Total: 150`,
    hints: ['First parameter of reduce is the reducer function, second is 0'],
    hintsHe: ['הפרמטר הראשון הוא פונקציית החיבור והשני הוא 0'],
    errorGuides: [],
    xpReward: 50,
    isAiGenerated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-sql-select-active',
    lessonId: 'sql-queries',
    courseId: 'sql-databases',
    title: 'Filter & Order High Balance Users',
    titleHe: 'סינון ומיון משתמשים עם יתרה גבוהה ב-SQL',
    language: 'sql',
    difficulty: 'Beginner',
    difficultyHe: 'מתחיל',
    taskDescription: 'Write a SQL query that retrieves name and balance from customers table where balance > 100, ordered descending by balance.',
    taskDescriptionHe: 'כתוב שאילתת SQL השולפת name ו-balance מטבלת customers עם balance > 100 וממוינת בסדר יורד.',
    requirements: [
      { id: 'req-1', text: 'Filter with WHERE balance > 100', textHe: 'סנן בעזרת WHERE balance > 100' },
      { id: 'req-2', text: 'Order results by balance DESC', textHe: 'מיין בעזרת ORDER BY balance DESC' }
    ],
    starterCode: `-- Select customers with balance > 100 ordered by balance DESC
SELECT name, balance FROM customers WHERE balance > 100 ORDER BY balance DESC;`,
    solutionCode: `SELECT name, balance FROM customers WHERE balance > 100 ORDER BY balance DESC;`,
    expectedOutput: `3 rows returned`,
    hints: ['Remember to put WHERE before ORDER BY'],
    hintsHe: ['זכור ש-WHERE מופיע לפני ORDER BY'],
    errorGuides: [],
    xpReward: 50,
    isAiGenerated: false,
    createdAt: new Date().toISOString()
  }
];

export const BASELINE_SEEDED_SNIPPETS: UserSnippet[] = [
  {
    id: 'snip-memoize',
    userId: 'default',
    title: 'Clean Python Memoization Decorator',
    language: 'python',
    code: `from functools import wraps

def memoize(fn):
    cache = {}
    @wraps(fn)
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper`,
    description: 'Universal decorator pattern for caching pure function calls.',
    tags: ['python', 'decorator', 'performance'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'snip-debounce',
    userId: 'default',
    title: 'TypeScript Debounce Utility',
    language: 'typescript',
    code: `export function debounce<T extends (...args: any[]) => void>(
  fn: T, 
  delayMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}`,
    description: 'High performance rate-limiter for search and resize handlers.',
    tags: ['typescript', 'react', 'utility'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Multi-Tenant Scoped Subcollection: User Exercises (/users/{userId}/exercises)
 */
export async function getUserExercisesFromFirestore(userId: string): Promise<Exercise[]> {
  // Read local cache first for offline-first responsiveness
  let localItems: Exercise[] = [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`);
    if (raw) localItems = JSON.parse(raw);
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) {
    return localItems.length > 0 ? localItems : BASELINE_SEEDED_EXERCISES;
  }

  const exCol = collection(db, 'users', userId, 'exercises');
  try {
    const snap = await getDocs(exCol);
    if (!snap.empty) {
      const remoteItems = snap.docs.map((d) => d.data() as Exercise);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`, JSON.stringify(remoteItems));
      } catch {
        // ignore
      }
      return remoteItems;
    } else {
      // Seed default baseline exercises for new account
      return await seedUserDefaultExercises(userId);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/exercises`);
    return localItems.length > 0 ? localItems : BASELINE_SEEDED_EXERCISES;
  }
}

/**
 * Seeds default baseline exercises into new account repository
 */
export async function seedUserDefaultExercises(userId: string): Promise<Exercise[]> {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`, JSON.stringify(BASELINE_SEEDED_EXERCISES));
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) {
    return BASELINE_SEEDED_EXERCISES;
  }

  for (const ex of BASELINE_SEEDED_EXERCISES) {
    try {
      const exRef = doc(db, 'users', userId, 'exercises', ex.id);
      await setDoc(exRef, ex, { merge: true });
    } catch {
      // non-blocking
    }
  }

  return BASELINE_SEEDED_EXERCISES;
}

/**
 * Creates or updates an exercise in user's personal repository
 */
export async function saveUserExercise(userId: string, exercise: Exercise): Promise<void> {
  // Update local cache immediately
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`);
    const current: Exercise[] = raw ? JSON.parse(raw) : [...BASELINE_SEEDED_EXERCISES];
    const idx = current.findIndex((e) => e.id === exercise.id);
    if (idx >= 0) {
      current[idx] = exercise;
    } else {
      current.push(exercise);
    }
    localStorage.setItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`, JSON.stringify(current));
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) return;

  const exRef = doc(db, 'users', userId, 'exercises', exercise.id);
  const path = `users/${userId}/exercises/${exercise.id}`;
  try {
    await setDoc(exRef, exercise, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes an exercise from user's personal repository
 */
export async function deleteUserExercise(userId: string, exerciseId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`);
    if (raw) {
      const filtered = (JSON.parse(raw) as Exercise[]).filter((e) => e.id !== exerciseId);
      localStorage.setItem(`${LOCAL_STORAGE_EXERCISES_KEY}_${userId}`, JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) return;

  const exRef = doc(db, 'users', userId, 'exercises', exerciseId);
  const path = `users/${userId}/exercises/${exerciseId}`;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(exRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Multi-Tenant Scoped Subcollection: User Snippets (/users/{userId}/snippets)
 */
export async function getUserSnippetsFromFirestore(userId: string): Promise<UserSnippet[]> {
  let localItems: UserSnippet[] = [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SNIPPETS_KEY}_${userId}`);
    if (raw) localItems = JSON.parse(raw);
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) {
    return localItems.length > 0 ? localItems : BASELINE_SEEDED_SNIPPETS;
  }

  const snipCol = collection(db, 'users', userId, 'snippets');
  try {
    const snap = await getDocs(snipCol);
    if (!snap.empty) {
      const remoteItems = snap.docs.map((d) => d.data() as UserSnippet);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_SNIPPETS_KEY}_${userId}`, JSON.stringify(remoteItems));
      } catch {
        // ignore
      }
      return remoteItems;
    } else {
      // Seed baseline snippets
      for (const s of BASELINE_SEEDED_SNIPPETS) {
        await setDoc(doc(db, 'users', userId, 'snippets', s.id), { ...s, userId }, { merge: true });
      }
      return BASELINE_SEEDED_SNIPPETS;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/snippets`);
    return localItems.length > 0 ? localItems : BASELINE_SEEDED_SNIPPETS;
  }
}

export async function saveUserSnippet(userId: string, snippet: UserSnippet): Promise<void> {
  const payload = { ...snippet, userId, updatedAt: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SNIPPETS_KEY}_${userId}`);
    const current: UserSnippet[] = raw ? JSON.parse(raw) : [...BASELINE_SEEDED_SNIPPETS];
    const idx = current.findIndex((s) => s.id === snippet.id);
    if (idx >= 0) current[idx] = payload;
    else current.push(payload);
    localStorage.setItem(`${LOCAL_STORAGE_SNIPPETS_KEY}_${userId}`, JSON.stringify(current));
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) return;

  const sRef = doc(db, 'users', userId, 'snippets', snippet.id);
  const path = `users/${userId}/snippets/${snippet.id}`;
  try {
    await setDoc(sRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteUserSnippet(userId: string, snippetId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SNIPPETS_KEY}_${userId}`);
    if (raw) {
      const filtered = (JSON.parse(raw) as UserSnippet[]).filter((s) => s.id !== snippetId);
      localStorage.setItem(`${LOCAL_STORAGE_SNIPPETS_KEY}_${userId}`, JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }

  if (!isUserAuthenticated(userId)) return;

  const sRef = doc(db, 'users', userId, 'snippets', snippetId);
  const path = `users/${userId}/snippets/${snippetId}`;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(sRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Dynamic Database Context Snapshot for Gemini AI Mentor
 * Gathers a live, sanitized snapshot of the user's personal database
 */
export async function getUserDataSnapshotForAi(userId: string, activeContext?: { activeExerciseId?: string; currentCode?: string }): Promise<Record<string, unknown>> {
  const profile = await getUserProfileFromFirestore(userId);
  const exercises = await getUserExercisesFromFirestore(userId);
  const snippets = await getUserSnippetsFromFirestore(userId);

  return {
    learner: {
      name: profile?.name || 'Learner',
      xp: profile?.xp || 0,
      level: profile?.level || 'Beginner+',
      streak: profile?.streak || 0,
      activeCourseId: profile?.activeCourseId || 'python-beginners',
      activeLessonId: profile?.activeLessonId || 'python-1',
      completedLessonsCount: (profile?.completedLessons || []).length,
      completedExercisesCount: (profile?.completedExercises || []).length,
      unlockedAchievements: profile?.unlockedAchievements || [],
    },
    savedSnippetsCount: snippets.length,
    recentSnippets: snippets.slice(0, 3).map((s) => ({ id: s.id, title: s.title, language: s.language })),
    personalExercisesCount: exercises.length,
    recentExercises: exercises.slice(0, 4).map((e) => ({ id: e.id, title: e.title, language: e.language, difficulty: e.difficulty })),
    activeEditorContext: {
      exerciseId: activeContext?.activeExerciseId || profile?.activeExerciseId,
      currentCodeSnippet: activeContext?.currentCode ? activeContext.currentCode.substring(0, 800) : undefined,
    },
    timestamp: new Date().toISOString(),
  };
}

