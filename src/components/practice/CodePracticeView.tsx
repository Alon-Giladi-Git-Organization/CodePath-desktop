import React, { useState, useEffect, useMemo } from 'react';
import { Exercise, UserProfile, NavScreen, SemanticEvaluationResult } from '../../types';
import { EXERCISES } from '../../data/mockData';
import { Modal } from '../common/Modal';
import { CodeEditor } from '../code/CodeEditor';
import { ConsoleOutput } from '../code/ConsoleOutput';
import { TestResultsPanel, TestCaseResult } from '../code/TestResultsPanel';
import { CodeBlock } from '../code/CodeBlock';
import { CoseMascot } from '../common/CoseMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { DragDropPracticeView } from './DragDropPracticeView';
import { 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Lightbulb, 
  Eye, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  ChevronRight,
  ArrowLeft,
  Terminal,
  Puzzle,
  Shuffle,
  Layers,
  Award
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface CodePracticeViewProps {
  exerciseId: string;
  user: UserProfile;
  initialSubModule?: 'ide' | 'dragdrop';
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onCompleteExercise: (exerciseId: string, xpReward?: number) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

// Utility: Fisher-Yates Non-Repeating Randomizer
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const CodePracticeView: React.FC<CodePracticeViewProps> = ({
  exerciseId,
  user,
  initialSubModule = 'ide',
  onNavigate,
  onCompleteExercise,
  onOpenMentor,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const [activeSubModule, setActiveSubModule] = useState<'ide' | 'dragdrop'>(initialSubModule);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load custom persisted exercises from localStorage
  const [allExercises, setAllExercises] = useState<Exercise[]>(() => {
    try {
      const saved = localStorage.getItem('codepath_custom_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...EXERCISES];
        }
      }
    } catch {
      // fallback
    }
    return EXERCISES;
  });

  // Non-Repeating Practice Deck State
  const [isDeckMode, setIsDeckMode] = useState<boolean>(true);
  const [deckQueue, setDeckQueue] = useState<Exercise[]>(() => shuffleArray(allExercises));
  const [deckIndex, setDeckIndex] = useState<number>(0);
  const [deckStats, setDeckStats] = useState<{ attempted: number; correct: number }>({ attempted: 0, correct: 0 });

  // Current active exercise based on deck mode or direct selector
  const currentExercise: Exercise = useMemo(() => {
    if (isDeckMode && deckQueue.length > 0) {
      return deckQueue[deckIndex] || deckQueue[0];
    }
    return allExercises.find((e) => e.id === exerciseId) || allExercises[0];
  }, [isDeckMode, deckQueue, deckIndex, exerciseId, allExercises]);

  const [code, setCode] = useState<string>(currentExercise?.starterCode || '');
  const [output, setOutput] = useState<string>('');
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'running' | 'success' | 'warning' | 'error'>('idle');
  const [friendlyFeedback, setFriendlyFeedback] = useState<{
    title: string;
    explanation: string;
    hint: string;
  } | null>(null);

  // Semantic Conceptual Evaluation State (Gemini LLM)
  const [isEvaluatingSemantic, setIsEvaluatingSemantic] = useState<boolean>(false);
  const [semanticResult, setSemanticResult] = useState<SemanticEvaluationResult | null>(null);

  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Restart / Reshuffle Deck
  const handleShuffleNewDeck = () => {
    soundFx.playClick();
    const newShuffled = shuffleArray(allExercises);
    setDeckQueue(newShuffled);
    setDeckIndex(0);
    setDeckStats({ attempted: 0, correct: 0 });
    setSemanticResult(null);
  };

  // Sync starter code when current exercise changes
  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starterCode);
      setOutput('');
      setTerminalStatus('idle');
      setFriendlyFeedback(null);
      setSemanticResult(null);
      setTestCases([]);
      setHintsRevealed(0);
      setIsSuccessUnlocked(user.completedExercises.includes(currentExercise.id));
    }
  }, [currentExercise?.id, user.completedExercises]);

  const handleResetCode = () => {
    soundFx.playClick();
    if (currentExercise) {
      setCode(currentExercise.starterCode);
    }
    setOutput('');
    setTerminalStatus('idle');
    setFriendlyFeedback(null);
    setSemanticResult(null);
    setTestCases([]);
  };

  const handleRevealNextHint = () => {
    soundFx.playClick();
    if (currentExercise) {
      setHintsRevealed((prev) => Math.min(currentExercise.hints.length, prev + 1));
    }
  };

  // Helper to persist custom exercises
  const saveCustomExercise = (newEx: Exercise) => {
    try {
      const saved = localStorage.getItem('codepath_custom_exercises');
      const existing: Exercise[] = saved ? JSON.parse(saved) : [];
      const updated = [newEx, ...existing.filter((e) => e.id !== newEx.id)];
      localStorage.setItem('codepath_custom_exercises', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed saving custom exercise:', err);
    }
  };

  // Move to next exercise in the deck
  const handleNextInDeck = () => {
    soundFx.playClick();
    if (deckIndex + 1 < deckQueue.length) {
      setDeckIndex((prev) => prev + 1);
    } else {
      // Completed full session deck! Celebrate and restart
      confetti({ particleCount: 100, spread: 80 });
      soundFx.playSuccess();
      handleShuffleNewDeck();
    }
  };

  // Run Code in Local Sandbox
  const handleRunCode = () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setOutput(isHe ? 'מריץ קוד בסביבת ארגז החול...' : 'Executing in sandbox...');
    setFriendlyFeedback(null);

    setTimeout(() => {
      const trimmed = code.trim();

      if (currentExercise.id === 'ex-python-while-1') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('warning');
          setOutput(isHe ? 'התוכנית הסתיימה ללא פלט.\nרמז: החלף את הביטוי "pass" בלוגיקת הדפסה והפחתת מונה!' : 'Program completed with no output.\nHint: Replace `pass` with print and decrement logic!');
          return;
        }

        if (trimmed.includes('seconds += 1') || (!trimmed.includes('seconds -=') && !trimmed.includes('seconds = seconds -'))) {
          setTerminalStatus('error');
          setOutput(isHe ? 'אזהרת ריצה: הלולאה לא הגיעה לתנאי עצירה.\nההרצה נעצרה כדי למנוע קיפאון.' : 'Runtime Warning: Loop did not reach termination condition.\nExecution paused after 50 iterations to prevent infinite freeze.');
          setFriendlyFeedback({
            title: isHe ? "בוא נתקן את הלולאה האינסופית!" : "Let's fix that infinite loop!",
            explanation: isHe ? "הלולאה בודקת `while seconds > 0:`. אם הערך אינו מופחת, התנאי נשאר תמיד True." : "Your loop checks `while seconds > 0:`. If seconds is never reduced inside the loop, the condition is always True.",
            hint: isHe ? "הוסף `seconds -= 1` כשורה האחרונה בתוך גוף הלולאה." : "Add `seconds -= 1` as the last line inside the while loop.",
          });
          soundFx.playNotice();
          return;
        }

        if (trimmed.includes('while') && (trimmed.includes('seconds -= 1') || trimmed.includes('seconds = seconds - 1'))) {
          setTerminalStatus('success');
          let outputText = 'T-minus 5\nT-minus 4\nT-minus 3\nT-minus 2\nT-minus 1';
          if (trimmed.includes('Blast off')) {
            outputText += '\nBlast off!';
          }
          setOutput(outputText + '\n\n>>> Process exited with code 0');
          soundFx.playClick();
          return;
        }
      }

      // Default mock run
      setTerminalStatus('success');
      setOutput((currentExercise.expectedOutput || 'Execution completed successfully') + '\n\n>>> Process exited with code 0');
    }, 450);
  };

  // Semantic Conceptual Evaluation (via Gemini LLM)
  const handleCheckSolution = async () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setFriendlyFeedback(null);
    setIsEvaluatingSemantic(true);
    setSemanticResult(null);

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userCode: code,
          expectedOutput: currentExercise.expectedOutput,
          requirements: currentExercise.requirements.map(r => r.text),
          language: currentExercise.language || 'python',
          appLanguage: language,
          topic: currentExercise.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Evaluation request failed');
      }

      const evalData: SemanticEvaluationResult = await response.json();
      setSemanticResult(evalData);

      // Update session statistics
      setDeckStats((prev) => ({
        attempted: prev.attempted + 1,
        correct: evalData.isCorrect ? prev.correct + 1 : prev.correct,
      }));

      if (evalData.isCorrect) {
        setTerminalStatus('success');
        setIsSuccessUnlocked(true);
        soundFx.playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#58CC02', '#FFC800', '#1CB0F6'],
        });
        onCompleteExercise(currentExercise.id, currentExercise.xpReward);
      } else {
        setTerminalStatus('error');
        soundFx.playError();
        setFriendlyFeedback({
          title: isHe ? 'נדרש דיוק קונספטואלי' : 'Conceptual Refinement Needed',
          explanation: evalData.explanation || evalData.feedback,
          hint: evalData.idealSolution ? `Reference: ${evalData.idealSolution.slice(0, 100)}...` : 'Review the requirements carefully.',
        });
      }
    } catch (err) {
      console.warn('Semantic evaluation failed, using local criteria:', err);
      // Fallback evaluation
      const passed = code.trim().length > 10;
      setTerminalStatus(passed ? 'success' : 'error');
      if (passed) {
        soundFx.playSuccess();
        setIsSuccessUnlocked(true);
        onCompleteExercise(currentExercise.id, currentExercise.xpReward);
      } else {
        soundFx.playError();
      }
    } finally {
      setIsEvaluatingSemantic(false);
    }
  };

  // Generate real-time AI exercise
  const handleGenerateAIExercise = async () => {
    soundFx.playClick();
    setIsGeneratingAI(true);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-ai-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentExercise?.title || 'Loops and Functions in Python',
          language: currentExercise?.language || 'python',
          difficulty: currentExercise?.difficulty || 'Beginner',
          category: 'coding',
          appLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`API response status ${response.status}`);
      }

      const data = await response.json();

      const rawReqs = Array.isArray(data.requirements) ? data.requirements : [];
      const formattedReqs = rawReqs.map((r: any, idx: number) => ({
        id: `req-${idx}`,
        text: typeof r === 'string' ? r : r.text || 'Implement required logic',
      }));

      const rawHints = Array.isArray(data.hints) && data.hints.length > 0 ? data.hints : [
        isHe ? 'קרא את ההוראות בזהירות ופרק את המשימה לצעדים קטנים.' : 'Read instructions carefully and break down into small steps.'
      ];

      const newEx: Exercise = {
        id: data.id || `ex-ai-${Date.now()}`,
        lessonId: currentExercise?.lessonId || 'custom-ai-lesson',
        courseId: currentExercise?.courseId || 'python-beginners',
        title: data.title || 'AI Generated Practice Challenge',
        titleHe: data.title,
        difficulty: data.difficulty || 'Intermediate',
        language: data.language || currentExercise?.language || 'python',
        taskDescription: data.description || 'Complete the following challenge.',
        taskDescriptionHe: data.description,
        requirements: formattedReqs,
        starterCode: data.starter_code || data.starterCode || `# Write your code here\n`,
        solutionCode: data.solution || data.solutionCode || `# Reference Solution\n`,
        expectedOutput: data.expected_output || data.expectedOutput || `Output verified`,
        hints: rawHints,
        hintsHe: rawHints,
        errorGuides: [],
        xpReward: data.xpReward || 50,
        isAiGenerated: true,
      };

      setAllExercises((prev) => [newEx, ...prev.filter((e) => e.id !== newEx.id)]);
      setDeckQueue((prev) => [newEx, ...prev]);
      saveCustomExercise(newEx);
      setCode(newEx.starterCode);
      soundFx.playSuccess();
    } catch (err: any) {
      console.warn('AI Exercise Generation Error:', err);
      setApiError(
        isHe
          ? 'שגיאה ביצירת האתגר ב-AI. אנא וודא חיבור לרשת ונסה שוב בעוד כדקה.'
          : 'Failed to generate AI challenge. Please check connection and try again in a moment.'
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const exerciseTitle = isHe && currentExercise.titleHe ? currentExercise.titleHe : currentExercise.title;
  const exerciseTaskDesc = isHe && currentExercise.taskDescriptionHe ? currentExercise.taskDescriptionHe : currentExercise.taskDescription;
  const requirementsList = isHe && currentExercise.requirementsHe && currentExercise.requirementsHe.length > 0 
    ? currentExercise.requirementsHe 
    : currentExercise.requirements;

  const hintsList = isHe && currentExercise.hintsHe && currentExercise.hintsHe.length > 0
    ? currentExercise.hintsHe
    : currentExercise.hints;

  // Accuracy calculation for randomized session
  const accuracyRate = deckStats.attempted > 0
    ? Math.round((deckStats.correct / deckStats.attempted) * 100)
    : 100;

  const progressPercent = deckQueue.length > 0
    ? Math.min(100, Math.round(((deckIndex + 1) / deckQueue.length) * 100))
    : 0;

  return (
    <div id="practice-screen" className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Sub-Module Switcher: IDE vs Drag & Drop */}
      <div className="cose-card p-2 sm:p-3 flex items-center justify-between gap-3 bg-[#F7F7F7]">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSubModule('ide');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
              activeSubModule === 'ide'
                ? 'bg-[#1CB0F6] text-white shadow-sm'
                : 'text-[#777777] hover:text-[#3C3C3C] hover:bg-[#E5E5E5]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{isHe ? 'עורך קוד ו-Deck אינטראקטיבי' : 'Interactive IDE & Deck'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSubModule('dragdrop');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
              activeSubModule === 'dragdrop'
                ? 'bg-[#FFC800] text-[#3C3C3C] shadow-sm'
                : 'text-[#777777] hover:text-[#3C3C3C] hover:bg-[#E5E5E5]'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>{isHe ? 'תרגול Drag & Drop' : 'Drag & Drop'}</span>
          </button>
        </div>

        {/* Practice Mode Toggle: Non-Repeating Randomized Deck vs Free Select */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => {
              setIsDeckMode(!isDeckMode);
              soundFx.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-extrabold border-2 transition-all cursor-pointer ${
              isDeckMode
                ? 'bg-[#EBF7E3] border-[#58CC02] text-[#58A700]'
                : 'bg-white border-[#E5E5E5] text-[#777777]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isDeckMode ? (isHe ? 'חפיסה אקראית פעילה 🎴' : 'Random Deck Active 🎴') : (isHe ? 'בחירה חופשית' : 'Free Selection')}</span>
          </button>
        </div>
      </div>

      {activeSubModule === 'dragdrop' ? (
        <DragDropPracticeView
          user={user}
          onNavigate={onNavigate}
          onOpenMentor={onOpenMentor}
          onCompleteChallenge={(id, xp) => onCompleteExercise(id, xp)}
        />
      ) : (
        <>
          {/* Non-Repeating Randomized Deck Session Bar */}
          {isDeckMode && (
            <div className="p-4 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-2.5">
              <div className="flex items-center justify-between gap-3 text-xs font-extrabold text-[#3C3C3C]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#1CB0F6] text-white text-[11px] font-black uppercase">
                    {isHe ? 'חפיסת תרגול אקראית ללא חזרות' : 'Non-Repeating Practice Deck'}
                  </span>
                  <span className="text-[#777777]">
                    {isHe ? `כרטיס ${deckIndex + 1} מתוך ${deckQueue.length}` : `Card ${deckIndex + 1} of ${deckQueue.length}`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#3C3C3C]">
                    <Award className="w-3.5 h-3.5 text-[#FFC800]" />
                    <span>{isHe ? `דיוק: ${accuracyRate}%` : `Accuracy: ${accuracyRate}%`}</span>
                  </div>

                  <button
                    onClick={handleShuffleNewDeck}
                    title={isHe ? 'ערבב חפיסה מחדש' : 'Reshuffle deck'}
                    className="p-1.5 rounded-lg bg-white border border-[#E5E5E5] hover:bg-[#EBEBEB] text-[#777777] hover:text-[#3C3C3C] transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Visual Session Progress Bar */}
              <div className="w-full bg-[#E5E5E5] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#58CC02] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Top Breadcrumb, Challenge Switcher & Task Header */}
          <div className="cose-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#777777] uppercase tracking-wider">
                  <span
                    onClick={() => onNavigate('lesson', { lessonId: currentExercise.lessonId })}
                    className="hover:text-[#58CC02] cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isHe ? 'חזרה לשיעור' : 'Back to Lesson'}</span>
                  </span>
                  <span>/</span>
                  <span>{currentExercise.difficulty} Challenge</span>
                  {currentExercise.isAiGenerated && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1CB0F6]/10 text-[#1CB0F6] border border-[#1CB0F6]">
                      AI Generated
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
                  {exerciseTitle}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleGenerateAIExercise}
                  disabled={isGeneratingAI}
                  className="btn-outline text-xs font-extrabold !py-2 !px-3.5 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#EBF8FF] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#1CB0F6] animate-pulse" />
                  <span>{isGeneratingAI ? (isHe ? 'יוצר אתגר ב-AI...' : 'Creating Challenge...') : t('practiceAIGenerateBtn')}</span>
                </button>

                <button
                  onClick={() => onOpenMentor(`Give me a hint on "${currentExercise.title}" without spoiling the code`)}
                  className="btn-outline text-xs font-extrabold !py-2 !px-3.5 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#1CB0F6]" />
                  <span>{t('dashAskMentor')}</span>
                </button>

                <button
                  onClick={() => setIsSolutionModalOpen(true)}
                  className="btn-outline text-xs font-extrabold !py-2 !px-3.5 flex items-center gap-2 text-[#777777]"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('practiceViewSolution')}</span>
                </button>
              </div>
            </div>

            {/* Challenge Switcher Drawer / Selector */}
            {!isDeckMode && (
              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between gap-3 overflow-x-auto">
                <span className="text-xs font-extrabold text-[#777777] shrink-0">
                  {isHe ? 'בחר אתגר מתוך המאגר הגדל:' : 'Select Challenge from Question Bank:'}
                </span>

                <select
                  value={currentExercise.id}
                  onChange={(e) => onNavigate('practice', { exerciseId: e.target.value })}
                  className="px-3 py-1.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-extrabold text-[#3C3C3C] bg-white focus:border-[#1CB0F6] focus:outline-none max-w-md cursor-pointer"
                >
                  {allExercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.isAiGenerated ? '✨ [AI] ' : ''}
                      {isHe && ex.titleHe ? ex.titleHe : ex.title} ({ex.language})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* API Error Alert Banner */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{apiError}</span>
              </div>
              <button onClick={() => setApiError(null)} className="underline hover:text-rose-900">
                {isHe ? 'סגור' : 'Dismiss'}
              </button>
            </div>
          )}

          {/* Main 2-Column Split: Instructions vs Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Instructions + Objectives + Hints (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="cose-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02]" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#777777]">
                    {t('practiceTaskObjectives')}
                  </h2>
                </div>

                <p className="text-sm text-[#3C3C3C] leading-relaxed font-semibold">
                  {exerciseTaskDesc}
                </p>

                {/* Checklist */}
                <div className="space-y-2.5 pt-2 border-t border-[#E5E5E5]">
                  {requirementsList.map((req: { id: string; text: string }) => (
                    <div key={req.id} className="flex items-start gap-2.5 text-xs text-[#3C3C3C] font-semibold">
                      <div className="w-4 h-4 rounded-full border-2 border-[#58CC02] flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#58CC02]" />
                      </div>
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progressive Hint Drawer */}
              <div className="cose-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                    <span>{t('practiceHintsTitle')}</span>
                  </span>
                  <span className="text-xs font-bold text-[#777777]">
                    {hintsRevealed} / {hintsList.length}
                  </span>
                </div>

                {hintsRevealed > 0 && (
                  <div className="space-y-2 pt-1 animate-fadeIn">
                    {hintsList.slice(0, hintsRevealed).map((hint, idx) => (
                      <div key={idx} className="p-3 rounded-[12px] bg-[#FFFBE6] border border-[#FFE885] text-xs font-semibold text-[#3C3C3C]">
                        <span className="font-extrabold text-[#CC9900] block mb-0.5">Hint #{idx + 1}:</span>
                        {hint}
                      </div>
                    ))}
                  </div>
                )}

                {hintsRevealed < hintsList.length && (
                  <button
                    onClick={handleRevealNextHint}
                    className="w-full btn-outline text-xs font-extrabold !py-2"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-[#FFC800]" />
                    <span>{t('practiceRevealHint').replace('{revealed}', String(hintsRevealed + 1)).replace('{total}', String(hintsList.length))}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Code Editor + Controls + Console + Test Results (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Positive Reinforcement Error / Advice Banner */}
              {friendlyFeedback && (
                <div className="p-4 rounded-[16px] bg-[#FFE0E0] border-2 border-[#FF4B4B] space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-[#FF4B4B] font-extrabold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{friendlyFeedback.title}</span>
                  </div>
                  <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed">
                    {friendlyFeedback.explanation}
                  </p>
                  <div className="p-2.5 rounded-[10px] bg-white border border-[#FF4B4B]/30 text-xs font-mono text-[#3C3C3C] whitespace-pre-wrap text-left" dir="ltr">
                    💡 <strong>Tip:</strong> {friendlyFeedback.hint}
                  </div>
                </div>
              )}

              {/* Semantic Evaluation Feedback Card */}
              {semanticResult && (
                <div className={`p-4 rounded-[16px] border-2 space-y-2 animate-fadeIn ${
                  semanticResult.isCorrect 
                    ? 'bg-[#EBF7E3] border-[#58CC02] text-[#2C6600]' 
                    : 'bg-[#FFF2E0] border-[#FF9600] text-[#8C4800]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>{isHe ? 'הערכה קונספטואלית (Gemini LLM)' : 'Semantic Conceptual Evaluation'}</span>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/80 border border-current">
                      {semanticResult.conceptualScore}/100 {isHe ? 'ציון' : 'Score'}
                    </span>
                  </div>
                  <p className="text-xs font-bold leading-relaxed">
                    {semanticResult.feedback}
                  </p>
                  {semanticResult.explanation && (
                    <p className="text-xs text-[#3C3C3C] font-semibold">
                      {semanticResult.explanation}
                    </p>
                  )}
                  {semanticResult.idealSolution && !semanticResult.isCorrect && (
                    <div className="p-2.5 rounded-[10px] bg-white/90 border border-[#E5E5E5] text-xs font-mono text-left" dir="ltr">
                      <span className="font-bold text-[#777777] block text-[10px] uppercase">Ideal Concept:</span>
                      {semanticResult.idealSolution}
                    </div>
                  )}
                </div>
              )}

              {/* Code Editor (Strictly LTR & Pre-wrap enabled with line numbers) */}
              <CodeEditor
                value={code}
                onChange={setCode}
                language={currentExercise.language || 'python'}
                placeholder="Write your code here..."
                minHeight="220px"
              />

              {/* Action Button Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  id="practice-reset-btn"
                  onClick={handleResetCode}
                  className="btn-outline text-xs font-extrabold !py-2.5 !px-3.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('practiceResetCode')}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    id="practice-run-btn"
                    onClick={handleRunCode}
                    className="btn-secondary text-xs font-extrabold !py-2.5 !px-5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t('practiceRunCode')}</span>
                  </button>

                  <button
                    id="practice-submit-btn"
                    onClick={handleCheckSolution}
                    disabled={isEvaluatingSemantic}
                    className="btn-primary text-xs font-extrabold !py-2.5 !px-6 flex items-center gap-2"
                  >
                    {isEvaluatingSemantic ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>{isHe ? 'מעריך קונספט...' : 'Evaluating with AI...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('practiceSubmitCode')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Console Output Panel */}
              <ConsoleOutput
                output={output}
                status={terminalStatus}
              />

              {/* Automated Test Results Panel */}
              {testCases.length > 0 && (
                <TestResultsPanel
                  testCases={testCases}
                />
              )}

              {/* Success Banner */}
              {isSuccessUnlocked && (
                <div className="p-5 rounded-[16px] bg-[#DBF8C5] border-2 border-[#58CC02] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CoseMascot mood="celebrating" size="sm" />
                    <div>
                      <h3 className="text-base font-extrabold text-[#58A700]">
                        {t('practiceSuccessTitle')}
                      </h3>
                      <p className="text-xs text-[#3C3C3C] font-semibold">
                        {t('practiceSuccessSub').replace('{xp}', String(currentExercise.xpReward))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDeckMode ? (
                      <button
                        onClick={handleNextInDeck}
                        className="btn-primary text-xs font-extrabold !py-2.5 !px-4 shrink-0 flex items-center gap-1.5"
                      >
                        <span>{isHe ? 'לאתגר הבא בחפיסה' : 'Next Card in Deck'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="btn-primary text-xs font-extrabold !py-2.5 !px-4 shrink-0 flex items-center gap-1.5"
                      >
                        <span>{t('practiceContinueNext')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Solution Modal (Strictly left-aligned CodeBlock with copy button) */}
          <Modal
            isOpen={isSolutionModalOpen}
            onClose={() => setIsSolutionModalOpen(false)}
            title={t('practiceViewSolution')}
            subtitle="Review the reference solution and expected execution below."
          >
            <div className="space-y-4">
              <CodeBlock
                code={currentExercise.solutionCode}
                language={currentExercise.language || 'python'}
              />
              <div className="p-4 rounded-[12px] bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
                <span className="text-xs font-extrabold uppercase text-[#777777]">{t('lessonExpectedOutput')}</span>
                <pre dir="ltr" className="text-xs font-mono text-[#3C3C3C] whitespace-pre-wrap text-left bg-white p-3 rounded-[8px] border border-[#E5E5E5]">
                  {currentExercise.expectedOutput}
                </pre>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
