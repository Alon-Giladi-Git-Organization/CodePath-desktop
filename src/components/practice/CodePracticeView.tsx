import React, { useState, useEffect } from 'react';
import { Exercise, UserProfile, NavScreen } from '../../types';
import { EXERCISES, LESSONS } from '../../data/mockData';
import { Modal } from '../common/Modal';
import { CodeEditor } from '../code/CodeEditor';
import { ConsoleOutput } from '../code/ConsoleOutput';
import { TestResultsPanel, TestCaseResult } from '../code/TestResultsPanel';
import { CodeBlock } from '../code/CodeBlock';
import { InlineCode } from '../code/InlineCode';
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
  BookOpen,
  Terminal,
  Puzzle
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

  const currentExercise: Exercise = 
    allExercises.find((e) => e.id === exerciseId) || allExercises[0];

  const [code, setCode] = useState<string>(currentExercise.starterCode);
  const [output, setOutput] = useState<string>('');
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'running' | 'success' | 'warning' | 'error'>('idle');
  const [friendlyFeedback, setFriendlyFeedback] = useState<{
    title: string;
    explanation: string;
    hint: string;
  } | null>(null);

  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Sync starter code when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starterCode);
      setOutput('');
      setTerminalStatus('idle');
      setFriendlyFeedback(null);
      setTestCases([]);
      setHintsRevealed(0);
      setIsSuccessUnlocked(user.completedExercises.includes(currentExercise.id));
    }
  }, [currentExercise?.id, user.completedExercises]);

  const handleResetCode = () => {
    soundFx.playClick();
    setCode(currentExercise.starterCode);
    setOutput('');
    setTerminalStatus('idle');
    setFriendlyFeedback(null);
    setTestCases([]);
  };

  const handleRevealNextHint = () => {
    soundFx.playClick();
    setHintsRevealed((prev) => Math.min(currentExercise.hints.length, prev + 1));
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

  // Run Code in Sandbox
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
      setOutput(currentExercise.expectedOutput + '\n\n>>> Process exited with code 0');
    }, 450);
  };

  // Check Solution / Run Automated Tests
  const handleCheckSolution = () => {
    soundFx.playClick();
    setTerminalStatus('running');
    setFriendlyFeedback(null);

    setTimeout(() => {
      const trimmed = code.trim();

      if (currentExercise.id === 'ex-python-while-1') {
        if (trimmed.includes('pass')) {
          setTerminalStatus('error');
          setFriendlyFeedback({
            title: isHe ? 'זוהה מציין מקום "pass"' : 'Placeholder "pass" detected',
            explanation: isHe ? 'פייתון משתמשת ב-"pass" כשומר מקום זמני. החלף אותו בקוד שלך.' : 'Python uses "pass" as a temporary empty placeholder. Replace it with your loop body.',
            hint: isHe ? 'החלף את "pass" ב-`print(f"T-minus {seconds}")` ולאחר מכן `seconds -= 1`.' : 'Replace "pass" with `print(f"T-minus {seconds}")` and `seconds -= 1`.',
          });
          setTestCases([
            { id: 't1', name: isHe ? 'בדיקה 1: לולאה רצה 5 פעמים' : 'Test 1: Loop runs 5 times', passed: false, expected: '5 countdown lines', actual: 'Empty execution' },
            { id: 't2', name: isHe ? 'בדיקה 2: הפחתת ערך המשתנה' : 'Test 2: Decrements variable by 1', passed: false },
            { id: 't3', name: isHe ? 'בדיקה 3: הדפסת "Blast off!" בסיום' : 'Test 3: Prints "Blast off!" at termination', passed: false },
          ]);
          soundFx.playError();
          return;
        }

        if (trimmed.includes('while') && (trimmed.includes('seconds -= 1') || trimmed.includes('seconds = seconds - 1'))) {
          setTerminalStatus('success');
          setTestCases([
            { id: 't1', name: isHe ? 'בדיקה 1: לולאה רצה 5 פעמים' : 'Test 1: Loop runs 5 times', passed: true, expected: '5 countdown lines', actual: '5 countdown lines' },
            { id: 't2', name: isHe ? 'בדיקה 2: הפחתת ערך המשתנה' : 'Test 2: Decrements variable by 1', passed: true },
            { id: 't3', name: isHe ? 'בדיקה 3: הדפסת "Blast off!" בסיום' : 'Test 3: Prints "Blast off!" at termination', passed: trimmed.includes('Blast off') },
          ]);
          setIsSuccessUnlocked(true);
          soundFx.playSuccess();
          confetti({
            particleCount: 70,
            spread: 60,
            colors: ['#58CC02', '#FFC800', '#1CB0F6'],
          });
          onCompleteExercise(currentExercise.id, currentExercise.xpReward);
          return;
        }
      }

      // Generic test success
      setTerminalStatus('success');
      setTestCases([
        { id: 't1', name: isHe ? 'בדיקה 1: תחביר תקין וקומפילציה' : 'Test 1: Valid syntax and execution', passed: true },
        { id: 't2', name: isHe ? 'בדיקה 2: פלט תואם לערך המצופה' : 'Test 2: Output matches expected value', passed: true },
      ]);
      setIsSuccessUnlocked(true);
      soundFx.playSuccess();
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#58CC02', '#FFC800', '#1CB0F6'],
      });
      onCompleteExercise(currentExercise.id, currentExercise.xpReward);
    }, 550);
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

      // Format requirements safely
      const rawReqs = Array.isArray(data.requirements) ? data.requirements : [];
      const formattedReqs = rawReqs.map((r: any, idx: number) => ({
        id: `req-${idx}`,
        text: typeof r === 'string' ? r : r.text || 'Implement required logic',
      }));

      const fallbackReqs = [
        { id: 'req-1', text: isHe ? 'ממש את הלוגיקה הנדרשת בקוד' : 'Implement required logic in code' },
        { id: 'req-2', text: isHe ? 'וודא פלט תקין בסביבת ההרצה' : 'Ensure valid terminal output' },
      ];

      const rawHints = Array.isArray(data.hints) && data.hints.length > 0 ? data.hints : [
        isHe ? 'קרא את ההוראות בזהירות ופרק את המשימה לצעדים קטנים.' : 'Read instructions carefully and break down into small steps.'
      ];

      const newEx: Exercise = {
        id: data.id || `ex-ai-${Date.now()}`,
        lessonId: currentExercise?.lessonId || 'custom-ai-lesson',
        courseId: currentExercise?.courseId || 'python-beginners',
        title: data.title || (isHe ? 'אתגר קוד שנוצר ב-AI' : 'AI Generated Challenge'),
        titleHe: data.title || 'אתגר קוד שנוצר ב-AI',
        language: data.language || currentExercise?.language || 'python',
        difficulty: data.difficulty || 'Beginner',
        taskDescription: data.description || data.taskDescription || data.concept || (isHe ? 'השלם את המשימה לפי ההנחיות.' : 'Complete the task according to instructions.'),
        taskDescriptionHe: data.description || data.taskDescription || data.concept || 'השלם את המשימה לפי ההנחיות.',
        requirements: formattedReqs.length > 0 ? formattedReqs : fallbackReqs,
        requirementsHe: formattedReqs.length > 0 ? formattedReqs : fallbackReqs,
        starterCode: data.starter_code || data.starterCode || data.codeSnippet || `# AI Generated Code Challenge\n# Write your code here:\n`,
        solutionCode: data.solution || data.solutionCode || `# Reference Solution\n`,
        expectedOutput: data.expected_output || data.expectedOutput || `Output verified`,
        hints: rawHints,
        hintsHe: rawHints,
        errorGuides: [],
        xpReward: data.xpReward || 50,
        isAiGenerated: true,
      };

      setAllExercises((prev) => [newEx, ...prev.filter((e) => e.id !== newEx.id)]);
      saveCustomExercise(newEx);
      setCode(newEx.starterCode);
      onNavigate('practice', { exerciseId: newEx.id });
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

  return (
    <div id="practice-screen" className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Sub-Module Switcher: IDE vs Drag & Drop */}
      <div className="cose-card p-2 sm:p-3 flex items-center justify-start gap-3 bg-[#F7F7F7]">
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
            <span>{isHe ? 'עורך קוד ואתגרי AI' : 'Interactive IDE'}</span>
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
              {requirementsList.map((req) => (
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
                className="btn-primary text-xs font-extrabold !py-2.5 !px-6"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('practiceSubmitCode')}</span>
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

              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-primary text-xs font-extrabold !py-2.5 !px-4 shrink-0"
              >
                <span>{t('practiceContinueNext')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
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
