export type NavScreen = 
  | 'dashboard' 
  | 'courses' 
  | 'lesson' 
  | 'practice' 
  | 'quiz' 
  | 'achievements' 
  | 'stats' 
  | 'settings'
  | 'architecture'
  | 'leaderboard'
  | 'dragdrop';

export type AppLanguage = 'en' | 'he';

export type MentorMode = 'hint' | 'explanation';

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  xp: number;
  streak: number;
  streakActiveToday: boolean;
  totalHours: number;
  language: AppLanguage;
  activeCourseId: string;
  activeLessonId: string;
  activeExerciseId: string;
  activeQuizId: string;
  completedLessons: string[];
  completedExercises: string[];
  completedArchitectureChallenges: string[];
  customExercises?: Exercise[];
  quizScores: Record<string, { score: number; total: number; percentage: number }>;
  unlockedAchievements: string[];
  dailyGoalMinutes: number;
  editorFontSize: 'sm' | 'md' | 'lg';
  soundEnabled: boolean;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: string | number;
  streak: number;
  badgesCount: number;
  updatedAt?: string;
  rank?: number;
}

export type ArchitectureQuality = 'bad_crashing' | 'good_scalable';
export type ArchitectureCategory = 'scalability' | 'error_handling' | 'frontend' | 'solid_clean' | 'concurrency';

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ProductionImpactOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ArchitectureChallenge {
  id: string;
  title: string;
  titleHe: string;
  category: ArchitectureCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenarioDescription: string;
  scenarioDescriptionHe: string;
  codeSnippet: string;
  language: 'typescript' | 'javascript' | 'python' | 'sql';
  expectedQuality: ArchitectureQuality;
  antiPatternName?: string;
  antiPatternNameHe?: string;
  patternName?: string;
  patternNameHe?: string;
  architecturalPrinciple: string;
  architecturalPrincipleHe: string;
  diagnosticQuestion: string;
  diagnosticQuestionHe: string;
  diagnosticOptions: DiagnosticOption[];
  diagnosticOptionsHe?: DiagnosticOption[];
  productionImpactQuestion: string;
  productionImpactQuestionHe: string;
  productionImpactOptions: ProductionImpactOption[];
  productionImpactOptionsHe?: ProductionImpactOption[];
  simulatedMetrics: {
    loadRps: number;
    bad: { cpuPercent: number; memoryMb: number; latencyMs: number; errorRatePercent: number; crashReason: string; crashReasonHe: string };
    good: { cpuPercent: number; memoryMb: number; latencyMs: number; errorRatePercent: number };
  };
  badCodeExplanation: string;
  badCodeExplanationHe: string;
  goodCodeSnippet: string;
  goodCodeExplanation: string;
  goodCodeExplanationHe: string;
  keyTakeaways: string[];
  keyTakeawaysHe: string[];
  xpReward: number;
}

export interface LessonSummary {
  id: string;
  title: string;
  titleHe?: string;
  durationMinutes: number;
  order: number;
  type: 'concept' | 'practice' | 'quiz';
}

export interface CourseModule {
  id: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  lessons: LessonSummary[];
}

export interface Course {
  id: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyHe?: string;
  category: 'Python' | 'JavaScript' | 'SQL' | 'Web' | 'Git' | 'Game Dev';
  totalLessons: number;
  estimatedHours: number;
  iconName: string;
  badge: 'Popular' | 'Practical' | 'Beginner' | 'Foundational';
  badgeHe?: string;
  tags: string[];
  tagsHe?: string[];
  modules: CourseModule[];
}

export interface LineExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  explanationHe?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  courseTitle: string;
  courseTitleHe?: string;
  order: number;
  totalInCourse: number;
  title: string;
  titleHe?: string;
  subtitle: string;
  subtitleHe?: string;
  conceptTitle: string;
  conceptTitleHe?: string;
  explanation: string[];
  explanationHe?: string[];
  realWorldAnalogy?: string;
  realWorldAnalogyHe?: string;
  codeSnippet: string;
  language: string;
  simulatedOutput?: string;
  lineBreakdown: LineExplanation[];
  importantTip: {
    title: string;
    titleHe?: string;
    description: string;
    descriptionHe?: string;
  };
  exerciseId: string;
  quizId: string;
  nextLessonId?: string;
  prevLessonId?: string;
}

export interface PracticeObjective {
  id: string;
  text: string;
  textHe?: string;
}

export interface ErrorGuide {
  triggerPattern: string; // keyword or regex pattern match
  title: string;
  titleHe?: string;
  explanation: string;
  explanationHe?: string;
  hint: string;
  hintHe?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  titleHe?: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate';
  difficultyHe?: string;
  taskDescription: string;
  taskDescriptionHe?: string;
  requirements: PracticeObjective[];
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hints: string[];
  hintsHe?: string[];
  errorGuides: ErrorGuide[];
  xpReward: number;
  isAiGenerated?: boolean;
  createdAt?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  textHe?: string;
  isCorrect: boolean;
  explanation: string;
  explanationHe?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionHe?: string;
  codeSnippet?: string;
  options: QuizOption[];
  xpReward: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  questions: QuizQuestion[];
}

export interface Achievement {
  id: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  icon: string;
  category: 'streak' | 'lessons' | 'practice' | 'quiz' | 'mastery';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xpBonus: number;
  unlockedDate?: string;
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  codeSnippet?: string;
  timestamp: string;
  mode?: MentorMode;
}

export interface DailyActivity {
  day: string;
  shortDay: string;
  dateStr: string;
  minutes: number;
  xp: number;
  completedGoal: boolean;
  isToday: boolean;
}

export interface TopicProficiency {
  name: string;
  proficiency: number; // percentage 0-100
  status: 'strong' | 'needs_practice';
  lessonCount: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'xp' | 'streak';
  title: string;
  message?: string;
  xpAmount?: number;
}
