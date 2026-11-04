import React, { useState, useEffect, useMemo } from 'react';
import { Exercise, UserProfile, NavScreen, SemanticEvaluationResult } from '../../types';
import { EXERCISES } from '../../data/mockData';
import { Modal } from '../common/Modal';
import { CodeEditor } from '../code/CodeEditor';
import { ConsoleOutput } from '../code/ConsoleOutput';
import { TestResultsPanel, TestCaseResult } from '../code/TestResultsPanel';
import { CodeBlock } from '../code/CodeBlock';
import { CoseMascot } from '../common/CoseMascot';
import { CoursesView } from '../courses/CoursesView';
import { SpiderWebCorner } from '../common/SpiderWebDecor';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Puzzle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowLeft, 
  ChevronRight, 
  Lightbulb, 
  Play, 
  Eye, 
  Code2, 
  Terminal, 
  Layers, 
  Shuffle, 
  Award, 
  Check, 
  X,
  HelpCircle,
  Zap,
  BookOpen
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface CodePracticeViewProps {
  exerciseId: string;
  user: UserProfile;
  initialSubModule?: 'syntax' | 'editor' | 'ide' | 'dragdrop' | 'tracks';
  initialLanguage?: string;
  initialCourseId?: string;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string; language?: string }) => void;
  onCompleteExercise: (exerciseId: string, xpReward?: number) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

// Fisher-Yates shuffle helper
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
  initialSubModule = 'syntax',
  initialLanguage = 'all',
  initialCourseId,
  onNavigate,
  onCompleteExercise,
  onOpenMentor,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  // Submodule Language Filter: 'all', 'python', 'javascript', 'sql', 'web', 'git', 'gamedev'
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage || 'all');

  // Toggle between Syntax Drag & Drop mode, Learning Tracks Roadmap, and Free Editor
  const [mode, setMode] = useState<'syntax' | 'tracks' | 'editor'>(
    initialSubModule === 'tracks' 
      ? 'tracks' 
      : (initialSubModule === 'editor' || initialSubModule === 'ide' ? 'editor' : 'syntax')
  );

  // Sync state if initialSubModule or initialLanguage changes from navigation
  useEffect(() => {
    if (initialSubModule === 'tracks') {
      setMode('tracks');
    } else if (initialSubModule === 'editor' || initialSubModule === 'ide') {
      setMode('editor');
    } else if (initialSubModule === 'syntax' || initialSubModule === 'dragdrop') {
      setMode('syntax');
    }
  }, [initialSubModule]);

  useEffect(() => {
    if (initialLanguage && initialLanguage !== 'all') {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);

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

  // Filter exercises by selected submodule language
  const filteredExercises = useMemo(() => {
    if (!selectedLanguage || selectedLanguage === 'all') return allExercises;
    return allExercises.filter((ex) => {
      if (selectedLanguage === 'python') return ex.language === 'python';
      if (selectedLanguage === 'javascript') return ex.language === 'javascript' || ex.language === 'typescript';
      if (selectedLanguage === 'sql') return ex.language === 'sql';
      if (selectedLanguage === 'web') return ex.language === 'web' || ex.language === 'html' || ex.language === 'css';
      if (selectedLanguage === 'git') return ex.language === 'git';
      if (selectedLanguage === 'gamedev') return ex.language === 'gamedev';
      return true;
    });
  }, [allExercises, selectedLanguage]);

  // Non-Repeating Practice Deck State
  const [isDeckMode, setIsDeckMode] = useState<boolean>(true);
  const [deckQueue, setDeckQueue] = useState<Exercise[]>(() => shuffleArray(allExercises));
  const [deckIndex, setDeckIndex] = useState<number>(0);
  const [deckStats, setDeckStats] = useState<{ attempted: number; correct: number }>({ attempted: 0, correct: 0 });

  // Reshuffle deck when selectedLanguage changes
  useEffect(() => {
    const list = filteredExercises.length > 0 ? filteredExercises : allExercises;
    setDeckQueue(shuffleArray(list));
    setDeckIndex(0);
    setUserPlacedSlots({});
    setSlotValidation({});
    setIsSubmitted(false);
    setIsAllCorrect(null);
  }, [selectedLanguage, filteredExercises, allExercises]);

  // Current active exercise
  const currentExercise: Exercise = useMemo(() => {
    if (isDeckMode && deckQueue.length > 0) {
      return deckQueue[deckIndex] || deckQueue[0];
    }
    return allExercises.find((e) => e.id === exerciseId) || allExercises[0];
  }, [isDeckMode, deckQueue, deckIndex, exerciseId, allExercises]);

  // Syntax Slots & Word Bank Setup for current exercise
  const { codeTemplate, slots, wordBank } = useMemo(() => {
    if (currentExercise.codeTemplate && currentExercise.syntaxSlots && currentExercise.wordBank) {
      return {
        codeTemplate: currentExercise.codeTemplate,
        slots: currentExercise.syntaxSlots,
        wordBank: currentExercise.wordBank,
      };
    }

    // Auto-generate fallback syntax slots from starter/solution code
    const lines = (currentExercise.starterCode || '').split('\n');
    const autoSlots: { id: string; correctAnswer: string }[] = [];
    let template = currentExercise.starterCode || '';

    if (template.includes('pass')) {
      template = template.replace('pass', '{{SLOT_0}}');
      autoSlots.push({ id: 'SLOT_0', correctAnswer: 'seconds -= 1' });
    } else {
      template = `{{SLOT_0}}\n` + template;
      autoSlots.push({ id: 'SLOT_0', correctAnswer: currentExercise.language === 'python' ? 'def' : 'function' });
    }

    const autoWordBank = [
      ...autoSlots.map((s) => s.correctAnswer),
      'for', 'while', 'if', 'return', 'print', 'import'
    ];

    return {
      codeTemplate: template,
      slots: autoSlots,
      wordBank: autoWordBank,
    };
  }, [currentExercise]);

  // User Placed Slots state: { 'SLOT_0': 'while', 'SLOT_1': 'seconds -= 1' }
  const [userPlacedSlots, setUserPlacedSlots] = useState<Record<string, string>>({});
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [slotValidation, setSlotValidation] = useState<Record<string, boolean>>({});
  const [isAllCorrect, setIsAllCorrect] = useState<boolean | null>(null);

  // Free Editor & Sandbox States
  const [freeCode, setFreeCode] = useState<string>(currentExercise.starterCode || '');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'running' | 'success' | 'warning' | 'error'>('idle');
  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ title: string; explanation: string; hint?: string } | null>(null);

  // Reset states on exercise change
  useEffect(() => {
    setUserPlacedSlots({});
    setActiveSlotId(slots[0]?.id || null);
    setIsSubmitted(false);
    setSlotValidation({});
    setIsAllCorrect(null);
    setFeedbackMessage(null);
    setFreeCode(currentExercise.starterCode || '');
    setConsoleOutput('');
    setTerminalStatus('idle');
    setHintsRevealed(0);
  }, [currentExercise.id, slots]);

  // Reshuffle Deck
  const handleShuffleNewDeck = () => {
    soundFx.playClick();
    const list = filteredExercises.length > 0 ? filteredExercises : allExercises;
    const newShuffled = shuffleArray(list);
    setDeckQueue(newShuffled);
    setDeckIndex(0);
    setDeckStats({ attempted: 0, correct: 0 });
    setUserPlacedSlots({});
  };

  // Advance to next exercise in deck
  const handleNextInDeck = () => {
    soundFx.playClick();
    if (deckIndex + 1 < deckQueue.length) {
      setDeckIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 80 });
      soundFx.playSuccess();
      handleShuffleNewDeck();
    }
  };

  // Place chip into active or next available slot
  const handlePlaceChip = (chip: string) => {
    soundFx.playClick();

    // Determine target slot
    let targetSlot = activeSlotId;
    if (!targetSlot || userPlacedSlots[targetSlot]) {
      const nextEmpty = slots.find((s) => !userPlacedSlots[s.id]);
      if (nextEmpty) {
        targetSlot = nextEmpty.id;
      } else {
        targetSlot = slots[0]?.id || null;
      }
    }

    if (!targetSlot) return;

    setUserPlacedSlots((prev) => ({
      ...prev,
      [targetSlot!]: chip,
    }));

    // Find next unplaced slot to focus
    const remainingSlot = slots.find((s) => s.id !== targetSlot && !userPlacedSlots[s.id]);
    setActiveSlotId(remainingSlot ? remainingSlot.id : null);
    setIsSubmitted(false);
    setFeedbackMessage(null);
  };

  // Remove chip from a slot
  const handleRemoveFromSlot = (slotId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    setUserPlacedSlots((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    setActiveSlotId(slotId);
    setIsSubmitted(false);
    setFeedbackMessage(null);
  };

  // Reset placed tokens
  const handleResetSlots = () => {
    soundFx.playClick();
    setUserPlacedSlots({});
    setActiveSlotId(slots[0]?.id || null);
    setIsSubmitted(false);
    setSlotValidation({});
    setIsAllCorrect(null);
    setFeedbackMessage(null);
  };

  // Check syntax solution
  const handleCheckSyntaxSolution = () => {
    soundFx.playClick();

    // Check if any slot is missing
    const unfilled = slots.filter((s) => !userPlacedSlots[s.id]);
    if (unfilled.length > 0) {
      soundFx.playWarning();
      setFeedbackMessage({
        title: isHe ? 'השלם את כל המקומות הריקים' : 'Fill all syntax slots',
        explanation: isHe
          ? `נותרו עוד ${unfilled.length} מילות סינתקס להצבה בקוד.`
          : `There are ${unfilled.length} syntax slots still waiting to be filled.`,
      });
      setActiveSlotId(unfilled[0].id);
      return;
    }

    // Validate each slot
    const validationMap: Record<string, boolean> = {};
    let allCorrect = true;

    for (const s of slots) {
      const isMatch = (userPlacedSlots[s.id] || '').trim() === s.correctAnswer.trim();
      validationMap[s.id] = isMatch;
      if (!isMatch) {
        allCorrect = false;
      }
    }

    setSlotValidation(validationMap);
    setIsSubmitted(true);
    setIsAllCorrect(allCorrect);

    // Update session deck stats
    setDeckStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: prev.correct + (allCorrect ? 1 : 0),
    }));

    if (allCorrect) {
      soundFx.playSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        colors: ['#58CC02', '#FFC800', '#1CB0F6', '#8B5CF6'],
      });
      onCompleteExercise(currentExercise.id, currentExercise.xpReward);
      setFeedbackMessage({
        title: isHe ? 'סינתקס ולוגיקה מושלמים! 🎯' : 'Syntax & Logic Perfect! 🎯',
        explanation: isHe
          ? 'כל מילות המפתח והביטויים מוקמו בדיוק בהתאם לכללי השפה.'
          : 'All syntax tokens and operators are placed according to programming standards.',
      });
    } else {
      soundFx.playWarning();
      setFeedbackMessage({
        title: isHe ? 'בדוק את הסינתקס והלוגיקה' : 'Review Syntax & Logic',
        explanation: isHe
          ? 'חלק מהביטויים שהוצבו אינם נכונים. שים לב לתנאי העצירה, מילות המפתח והמפעילים.'
          : 'Some tokens are placed incorrectly. Pay close attention to loop conditions and operators.',
        hint: currentExercise.hints?.[0] || undefined,
      });
    }
  };

  // Reveal next hint
  const handleRevealNextHint = () => {
    soundFx.playClick();
    const hints = isHe && currentExercise.hintsHe ? currentExercise.hintsHe : currentExercise.hints;
    if (hints && hints.length > 0) {
      setHintsRevealed((prev) => Math.min(hints.length, prev + 1));
    }
  };

  // Generate new AI exercise
  const handleGenerateAIExercise = async () => {
    soundFx.playClick();
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/generate-ai-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Syntax Token Drag & Drop Exercise for ${currentExercise.language}`,
          language: currentExercise.language || 'python',
          difficulty: currentExercise.difficulty || 'Beginner',
          category: 'code',
          appLanguage: language,
        }),
      });

      if (!response.ok) throw new Error('AI generation failed');
      const data = await response.json();

      const newEx: Exercise = {
        id: data.id || `ex-ai-${Date.now()}`,
        lessonId: currentExercise.lessonId,
        courseId: currentExercise.courseId,
        title: data.title || 'AI Generated Syntax Challenge',
        titleHe: data.titleHe || data.title,
        language: currentExercise.language,
        difficulty: currentExercise.difficulty,
        taskDescription: data.taskDescription || data.instructions,
        taskDescriptionHe: data.taskDescriptionHe || data.taskDescription,
        requirements: data.requirements || [{ id: 'r1', text: 'Complete the syntax correctly' }],
        starterCode: data.starterCode || data.codeSnippet || '',
        solutionCode: data.solutionCode || '',
        codeTemplate: data.codeTemplate || data.starterCode,
        syntaxSlots: data.slots || [
          { id: 'SLOT_0', correctAnswer: 'while' }
        ],
        wordBank: data.wordBank || ['while', 'for', 'if', 'return'],
        expectedOutput: data.expectedOutput || 'Success',
        hints: data.hints || ['Pay attention to keywords'],
        hintsHe: data.hintsHe || ['שים לב למילות המפתח'],
        errorGuides: [],
        xpReward: 60,
        isAiGenerated: true,
      };

      setAllExercises((prev) => [newEx, ...prev]);
      setDeckQueue((prev) => [newEx, ...prev]);
      setDeckIndex(0);
      soundFx.playSuccess();
    } catch (err) {
      console.warn('AI Exercise generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Render Code Template with Interactive Slots
  const renderCodeWithSlots = () => {
    const lines = codeTemplate.split('\n');

    return (
      <div 
        dir="ltr"
        className="font-mono text-xs sm:text-sm bg-[#1E1E2E] text-[#CDD6F4] p-3 sm:p-5 rounded-[16px] border-2 border-[#313244] shadow-inner overflow-x-auto leading-relaxed select-none"
      >
        {lines.map((line, lineIdx) => {
          // Check if line contains {{SLOT_X}}
          const slotRegex = /\{\{(SLOT_\d+)\}\}/g;
          const parts: React.ReactNode[] = [];
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = slotRegex.exec(line)) !== null) {
            const slotId = match[1];
            const beforeText = line.substring(lastIndex, match.index);
            if (beforeText) {
              parts.push(<span key={`text-${lineIdx}-${lastIndex}`}>{beforeText}</span>);
            }

            const placedValue = userPlacedSlots[slotId];
            const isActive = activeSlotId === slotId;
            const isValid = slotValidation[slotId];

            parts.push(
              <span
                key={slotId}
                onClick={() => {
                  soundFx.playClick();
                  setActiveSlotId(slotId);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedChip = e.dataTransfer.getData('text/plain');
                  if (droppedChip) {
                    soundFx.playClick();
                    setUserPlacedSlots((prev) => ({
                      ...prev,
                      [slotId]: droppedChip,
                    }));
                    setIsSubmitted(false);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 mx-1 my-0.5 rounded-[10px] font-bold text-xs sm:text-sm cursor-pointer transition-all duration-200 min-h-[36px] min-w-[70px] justify-center align-middle ${
                  placedValue
                    ? isValid === true
                      ? 'bg-[#58CC02] text-white border-2 border-[#58A700] shadow-sm'
                      : isValid === false
                      ? 'bg-[#FF4B4B] text-white border-2 border-[#CC3B3B] animate-pulse shadow-sm'
                      : 'bg-[#89B4FA] text-[#11111B] border-2 border-[#B4BEFE] shadow-sm'
                    : isActive
                    ? 'bg-[#45475A] border-2 border-dashed border-[#F38BA8] text-[#F5E0DC] ring-2 ring-[#F38BA8]/40'
                    : 'bg-[#313244] border-2 border-dashed border-[#6C7086] text-[#A6ADC8] hover:border-[#89B4FA]'
                }`}
              >
                {placedValue ? (
                  <>
                    <span>{placedValue}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFromSlot(slotId, e)}
                      title={isHe ? 'הסר' : 'Remove'}
                      className="w-4 h-4 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center shrink-0 text-white cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] opacity-70">
                    {isActive ? (isHe ? 'מקום פעיל 🎯' : 'Active Slot') : (isHe ? 'הצב כאן' : 'Drop Token')}
                  </span>
                )}
              </span>
            );

            lastIndex = match.index + match[0].length;
          }

          if (lastIndex < line.length) {
            parts.push(<span key={`text-end-${lineIdx}`}>{line.substring(lastIndex)}</span>);
          }

          return (
            <div key={lineIdx} className="flex items-center gap-3 min-h-[32px] py-0.5">
              <span className="text-[#585B70] text-[11px] w-6 select-none text-right shrink-0">
                {lineIdx + 1}
              </span>
              <div className="flex-1 flex flex-wrap items-center">
                {parts.length > 0 ? parts : <span>{line || ' '}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const exerciseTitle = isHe && currentExercise.titleHe ? currentExercise.titleHe : currentExercise.title;
  const exerciseTaskDesc = isHe && currentExercise.taskDescriptionHe ? currentExercise.taskDescriptionHe : currentExercise.taskDescription;
  const requirementsList = (isHe && currentExercise.requirementsHe ? currentExercise.requirementsHe : currentExercise.requirements) || [];
  const hintsList = (isHe && currentExercise.hintsHe ? currentExercise.hintsHe : currentExercise.hints) || [];

  const progressPercent = Math.round(((deckIndex + 1) / deckQueue.length) * 100);
  const accuracyRate = deckStats.attempted > 0 ? Math.round((deckStats.correct / deckStats.attempted) * 100) : 100;

  return (
    <div id="practice-screen" className="w-full max-w-full space-y-4 sm:space-y-5 pb-8">
      {/* 1. Sub-module Language Selector Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase text-[#AFAFAF] flex items-center gap-1 shrink-0">
          <span>🕷️</span>
          {isHe ? 'שפת קוד:' : 'LANGUAGE:'}
        </span>
        {[
          { id: 'all', icon: '🌟', labelHe: 'כל השפות', labelEn: 'All Tracks', count: allExercises.length },
          { id: 'python', icon: '🐍', labelHe: 'פייתון', labelEn: 'Python', count: allExercises.filter((e) => e.language === 'python').length },
          { id: 'javascript', icon: '⚡', labelHe: 'ג\'אווהסקריפט', labelEn: 'JavaScript', count: allExercises.filter((e) => e.language === 'javascript' || e.language === 'typescript').length },
          { id: 'sql', icon: '🗄️', labelHe: 'בסיסי נתונים SQL', labelEn: 'Databases SQL', count: allExercises.filter((e) => e.language === 'sql').length },
          { id: 'web', icon: '🌐', labelHe: 'פיתוח Web', labelEn: 'Web & CSS', count: allExercises.filter((e) => e.language === 'web' || e.language === 'html' || e.language === 'css').length },
          { id: 'git', icon: '🐙', labelHe: 'ניהול גרסאות Git', labelEn: 'Git', count: allExercises.filter((e) => e.language === 'git').length },
          { id: 'gamedev', icon: '🎮', labelHe: 'פיתוח משחקים', labelEn: 'Game Dev', count: allExercises.filter((e) => e.language === 'gamedev').length },
        ].map((item) => (
          <button
            key={item.id}
            id={`practice-lang-filter-${item.id}`}
            onClick={() => {
              soundFx.playClick();
              setSelectedLanguage(item.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border-2 ${
              selectedLanguage === item.id
                ? 'bg-[#58CC02] text-white border-[#58CC02] shadow-xs'
                : 'bg-white text-[#777777] border-[#E5E5E5] hover:border-[#CCCCCC]'
            }`}
          >
            <span>{item.icon}</span>
            <span>{isHe ? item.labelHe : item.labelEn}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                selectedLanguage === item.id
                  ? 'bg-white/25 text-white'
                  : 'bg-[#F0F0F0] text-[#777777]'
              }`}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* 2. Main Mode Toggle Bar: Drag & Drop Syntax vs Learning Tracks Roadmap vs Free Editor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-[18px] border-2 border-[#E5E5E5] shadow-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
          <button
            id="tab-mode-syntax"
            onClick={() => {
              setMode('syntax');
              soundFx.playClick();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-xs font-extrabold border-2 transition-all cursor-pointer ${
              mode === 'syntax'
                ? 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700] shadow-xs'
                : 'bg-white border-[#E5E5E5] text-[#777777] hover:border-[#CCCCCC]'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>{isHe ? 'תרגול סינתקס (Drag & Drop)' : 'Syntax Practice (Drag & Drop)'}</span>
          </button>

          <button
            id="tab-mode-tracks"
            onClick={() => {
              setMode('tracks');
              soundFx.playClick();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-xs font-extrabold border-2 transition-all cursor-pointer ${
              mode === 'tracks'
                ? 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700] shadow-xs'
                : 'bg-white border-[#E5E5E5] text-[#777777] hover:border-[#CCCCCC]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isHe ? 'מסלולי למידה ושיעורים' : 'Learning Tracks'}</span>
          </button>

          <button
            id="tab-mode-editor"
            onClick={() => {
              setMode('editor');
              soundFx.playClick();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-xs font-extrabold border-2 transition-all cursor-pointer ${
              mode === 'editor'
                ? 'bg-[#EBF8FF] border-[#1CB0F6] text-[#1CB0F6] shadow-xs'
                : 'bg-white border-[#E5E5E5] text-[#777777] hover:border-[#CCCCCC]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{isHe ? 'עורך קוד חופשי' : 'Free Code Editor'}</span>
          </button>
        </div>

        {mode !== 'tracks' && (
          <div className="flex items-center gap-2">
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
              <span>{isDeckMode ? (isHe ? 'חפיסה אקראית 🎴' : 'Random Deck 🎴') : (isHe ? 'בחירה חופשית' : 'Free Select')}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Conditional Content: If Tracks Mode, embed CoursesView directly! */}
      {mode === 'tracks' ? (
        <CoursesView user={user} onNavigate={onNavigate} />
      ) : (
        <>
          {/* Interactive Exercise Strip & Deck Progress Header */}
          <div className="p-3 sm:p-4 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-extrabold text-[#3C3C3C]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[11px] font-black uppercase">
                  {isHe ? 'תרגילי סינתקס אינטראקטיביים' : 'Interactive Syntax Deck'}
                </span>
                <span className="text-[#777777]">
                  {isHe
                    ? `תרגיל ${deckIndex + 1} מתוך ${deckQueue.length}`
                    : `Exercise ${deckIndex + 1} of ${deckQueue.length}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
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

            {/* Interactive Exercise Selector Pills (1..N) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {deckQueue.map((ex, idx) => {
                const isCurrent = idx === deckIndex;
                const isDone = user.completedExercises.includes(ex.id);
                const exTitle = isHe && ex.titleHe ? ex.titleHe : ex.title;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      soundFx.playClick();
                      setIsDeckMode(true);
                      setDeckIndex(idx);
                    }}
                    title={exTitle}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                      isCurrent
                        ? 'bg-[#58CC02] text-white border-[#46A302] shadow-2xs'
                        : isDone
                        ? 'bg-[#EBF7E3] text-[#58A700] border-[#B5E7A0]'
                        : 'bg-white text-[#777777] border-[#E5E5E5] hover:border-[#AFAFAF] hover:text-[#3C3C3C]'
                    }`}
                  >
                    <span className="font-black">#{idx + 1}</span>
                    <span className="max-w-[130px] truncate">{exTitle}</span>
                    {isDone && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="w-full bg-[#E5E5E5] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#58CC02] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

      {/* Exercise Header Card */}
      <div className="cose-card p-4 sm:p-5 space-y-3 relative overflow-hidden">
        <SpiderWebCorner position="top-right" size={60} color="#58CC02" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              <span>{currentExercise.difficulty} Syntax Challenge</span>
              {currentExercise.isAiGenerated && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]">
                  AI Generated
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#3C3C3C]">
              {exerciseTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerateAIExercise}
              disabled={isGeneratingAI}
              className="btn-outline text-xs font-extrabold !py-2 !px-3 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3E8FF] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
              <span>{isGeneratingAI ? (isHe ? 'יוצר אתגר...' : 'Creating Challenge...') : (isHe ? '✨ אתגר AI חדש' : '✨ New AI Challenge')}</span>
            </button>

            <button
              onClick={() => onOpenMentor(`Explain the syntax and concept behind "${currentExercise.title}" without giving away the direct answers`)}
              className="btn-outline text-xs font-extrabold !py-2 !px-3 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1CB0F6]" />
              <span>{t('dashAskMentor')}</span>
            </button>

            <button
              onClick={() => setIsSolutionModalOpen(true)}
              className="btn-outline text-xs font-extrabold !py-2 !px-3 flex items-center gap-1.5 text-[#777777]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('practiceViewSolution')}</span>
            </button>
          </div>
        </div>

        {/* Free Select Dropdown if not in deck mode */}
        {!isDeckMode && (
          <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold text-[#777777]">
              {isHe ? 'בחר אתגר:' : 'Select Challenge:'}
            </span>
            <select
              value={currentExercise.id}
              onChange={(e) => onNavigate('practice', { exerciseId: e.target.value })}
              className="px-3 py-1.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-extrabold text-[#3C3C3C] bg-white max-w-sm cursor-pointer"
            >
              {allExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.isAiGenerated ? '✨ ' : ''}{isHe && ex.titleHe ? ex.titleHe : ex.title} ({ex.language})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Instructions vs Interactive Syntax Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Objective, Syntax Checklist, Progressive Hints (4.5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="cose-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02]" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
                {t('practiceTaskObjectives')}
              </h2>
            </div>

            <p className="text-sm text-[#3C3C3C] leading-relaxed font-semibold">
              {exerciseTaskDesc}
            </p>

            <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
              {requirementsList.map((req: { id: string; text: string }) => (
                <div key={req.id} className="flex items-start gap-2 text-xs text-[#3C3C3C] font-semibold">
                  <div className="w-4 h-4 rounded-full border-2 border-[#58CC02] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#58CC02]" />
                  </div>
                  <span>{req.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progressive Hint Box */}
          <div className="cose-card p-4 space-y-2.5">
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
                  <div key={idx} className="p-2.5 rounded-[12px] bg-[#FFFBE6] border border-[#FFE885] text-xs font-semibold text-[#3C3C3C]">
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

        {/* Right Column: Code Snippet with Fill-in-the-Blank Slots + Syntax Word Bank (7.5 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Feedback & Error / Success Banner */}
          {feedbackMessage && (
            <div
              className={`p-3.5 sm:p-4 rounded-[16px] border-2 space-y-1.5 animate-fadeIn ${
                isAllCorrect
                  ? 'bg-[#DBF8C5] border-[#58CC02] text-[#2C6600]'
                  : 'bg-[#FFF2E0] border-[#FF9600] text-[#8C4800]'
              }`}
            >
              <div className="flex items-center gap-2 font-extrabold text-sm">
                {isAllCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#FF9600]" />
                )}
                <span>{feedbackMessage.title}</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                {feedbackMessage.explanation}
              </p>
              {feedbackMessage.hint && (
                <div className="p-2 rounded-[10px] bg-white/90 border border-[#E5E5E5] text-xs text-[#3C3C3C]">
                  💡 <strong>רמז:</strong> {feedbackMessage.hint}
                </div>
              )}
            </div>
          )}

          {mode === 'syntax' ? (
            <>
              {/* Code Snippet with Slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#777777]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#58CC02]" />
                    <span>{currentExercise.language?.toUpperCase()} Syntax Snippet</span>
                  </span>
                  <span className="text-[11px] text-[#AFAFAF]">
                    {isHe ? 'לחץ על מקום בקוד או גרור מילת סינתקס' : 'Tap slot or drag token into place'}
                  </span>
                </div>

                {renderCodeWithSlots()}
              </div>

              {/* Syntax Word Bank (מאגר מילות סינתקס) */}
              <div className="cose-card p-3 sm:p-4 bg-[#F8FAFC] border-2 border-[#CBD5E1] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-[#475569] tracking-wider">
                    <Puzzle className="w-4 h-4 text-[#8B5CF6]" />
                    <span>{isHe ? 'מאגר מילות סינתקס ומפעילים' : 'Syntax & Operator Word Bank'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#64748B]">
                    {isHe ? 'גרור אל הקוד או לחץ להצבה מהירה' : 'Drag or tap to place'}
                  </span>
                </div>

                {/* Word Bank Chips */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {wordBank.map((chip, idx) => {
                    const isAlreadyPlaced = Object.values(userPlacedSlots).includes(chip);

                    return (
                      <button
                        key={`${chip}-${idx}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', chip);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => handlePlaceChip(chip)}
                        className={`font-mono text-xs sm:text-sm font-bold px-3 py-2 rounded-[12px] border-2 border-b-4 transition-all duration-150 select-none cursor-pointer min-h-[44px] flex items-center gap-1.5 touch-manipulation active:scale-95 ${
                          isAlreadyPlaced
                            ? 'bg-[#E2E8F0] border-[#CBD5E1] text-[#94A3B8] opacity-60'
                            : 'bg-white border-[#E2E8F0] border-b-[#CBD5E1] text-[#1E293B] hover:border-[#8B5CF6] hover:bg-[#F3E8FF] hover:text-[#7C3AED] shadow-xs'
                        }`}
                      >
                        <span>{chip}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleResetSlots}
                  className="btn-outline text-xs font-extrabold !py-2.5 !px-3.5 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isHe ? 'אפס מקומות' : 'Reset Placed'}</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCheckSyntaxSolution}
                    className="btn-primary text-xs font-extrabold !py-2.5 !px-6 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHe ? 'בדוק סינתקס ולוגיקה' : 'Check Syntax & Logic'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Free Code Editor Mode */
            <div className="space-y-3">
              <CodeEditor
                value={freeCode}
                onChange={setFreeCode}
                language={currentExercise.language || 'python'}
                placeholder="Write code here..."
                minHeight="240px"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setFreeCode(currentExercise.starterCode)}
                  className="btn-outline text-xs font-extrabold !py-2 !px-3"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('practiceResetCode')}</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setTerminalStatus('success');
                    setConsoleOutput(currentExercise.expectedOutput || 'Program exited with code 0');
                  }}
                  className="btn-primary text-xs font-extrabold !py-2 !px-5 flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t('practiceRunCode')}</span>
                </button>
              </div>

              <ConsoleOutput
                output={consoleOutput}
                status={terminalStatus}
              />
            </div>
          )}

          {/* Success Banner & Deck Transition */}
          {isAllCorrect && (
            <div className="p-4 sm:p-5 rounded-[16px] bg-[#DBF8C5] border-2 border-[#58CC02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
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
                    className="btn-primary text-xs font-extrabold !py-2.5 !px-5 shrink-0 flex items-center gap-1.5"
                  >
                    <span>{isHe ? 'לאתגר הבא בחפיסה' : 'Next Card in Deck'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="btn-primary text-xs font-extrabold !py-2.5 !px-5 shrink-0 flex items-center gap-1.5"
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
      </>
      )}

      {/* Solution Reference Modal */}
      <Modal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        title={t('practiceViewSolution')}
        subtitle="Review the full reference code and syntax below."
      >
        <div className="space-y-4">
          <CodeBlock
            code={currentExercise.solutionCode}
            language={currentExercise.language || 'python'}
          />
          <div className="p-3 sm:p-4 rounded-[12px] bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#777777]">{t('lessonExpectedOutput')}</span>
            <pre dir="ltr" className="text-xs font-mono text-[#3C3C3C] whitespace-pre-wrap text-left bg-white p-3 rounded-[8px] border border-[#E5E5E5]">
              {currentExercise.expectedOutput}
            </pre>
          </div>
        </div>
      </Modal>
    </div>
  );
};
