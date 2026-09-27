import React, { useState, useEffect } from 'react';
import { DragDropChallenge, DRAG_DROP_CHALLENGES } from '../../data/dragDropData';
import { useLanguage } from '../../i18n/LanguageContext';
import { UserProfile, NavScreen } from '../../types';
import { 
  Puzzle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight, 
  Zap, 
  Layers, 
  Code2, 
  Terminal, 
  HelpCircle,
  Check
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface DragDropPracticeViewProps {
  user: UserProfile;
  onNavigate: (screen: NavScreen) => void;
  onCompleteChallenge?: (id: string, xp: number) => void;
  onOpenMentor?: (initialPrompt?: string) => void;
}

export const DragDropPracticeView: React.FC<DragDropPracticeViewProps> = ({
  user,
  onNavigate,
  onCompleteChallenge,
  onOpenMentor,
}) => {
  const { language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const [challenges, setChallenges] = useState<DragDropChallenge[]>(DRAG_DROP_CHALLENGES);
  const [activeCategory, setActiveCategory] = useState<'all' | 'python' | 'javascript' | 'sql' | 'architecture'>('all');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const filteredChallenges = challenges.filter(
    (c) => activeCategory === 'all' || c.language === activeCategory
  );
  const currentChallenge = filteredChallenges[currentChallengeIndex] || filteredChallenges[0] || challenges[0];

  // User selections for slots: { SLOT_0: 'in', SLOT_1: '%' }
  const [userPlacedSlots, setUserPlacedSlots] = useState<Record<string, string>>({});
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Initialize active slot on challenge change
  useEffect(() => {
    setUserPlacedSlots({});
    setIsSubmitted(false);
    setIsCorrect(null);
    setAiError(null);
    if (currentChallenge?.slots?.length > 0) {
      setActiveSlotId(currentChallenge.slots[0].id);
    }
  }, [currentChallenge?.id]);

  const handlePlaceChip = (chip: string) => {
    soundFx.playClick();
    if (!currentChallenge) return;

    // Determine target slot
    const targetSlotId = activeSlotId || currentChallenge.slots.find((s) => !userPlacedSlots[s.id])?.id || currentChallenge.slots[0].id;

    setUserPlacedSlots((prev) => ({
      ...prev,
      [targetSlotId]: chip,
    }));

    // Find next unplaced slot ID
    const nextUnplacedSlot = currentChallenge.slots.find(
      (s) => s.id !== targetSlotId && !userPlacedSlots[s.id]
    );
    if (nextUnplacedSlot) {
      setActiveSlotId(nextUnplacedSlot.id);
    }
  };

  const handleClearSlot = (slotId: string) => {
    soundFx.playClick();
    setUserPlacedSlots((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    setActiveSlotId(slotId);
  };

  const handleReset = () => {
    soundFx.playClick();
    setUserPlacedSlots({});
    setIsSubmitted(false);
    setIsCorrect(null);
    if (currentChallenge?.slots?.length > 0) {
      setActiveSlotId(currentChallenge.slots[0].id);
    }
  };

  const handleCheckAnswer = () => {
    soundFx.playClick();
    if (!currentChallenge) return;

    // Check if all slots are filled correctly
    let correct = true;
    for (const slot of currentChallenge.slots) {
      if (userPlacedSlots[slot.id] !== slot.correctAnswer) {
        correct = false;
        break;
      }
    }

    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      soundFx.playSuccess();
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#58CC02', '#FFC800', '#1CB0F6'],
      });
      if (onCompleteChallenge) {
        onCompleteChallenge(currentChallenge.id, currentChallenge.xpReward);
      }
    } else {
      soundFx.playWarning();
    }
  };

  // Generate new AI Drag & Drop challenge
  const handleGenerateAIChallenge = async () => {
    soundFx.playClick();
    setIsGeneratingAI(true);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-ai-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Word Bank Drag & Drop Code Completion for ${activeCategory}`,
          language: activeCategory === 'all' ? 'python' : activeCategory,
          difficulty: 'Intermediate',
          category: 'dragdrop',
          appLanguage: language,
        }),
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();

      const newChallenge: DragDropChallenge = {
        id: `dd-ai-${Date.now()}`,
        title: data.title || (isHe ? 'אתגר Drag & Drop שנוצר ב-AI' : 'AI Drag & Drop Challenge'),
        titleHe: data.title || 'אתגר Drag & Drop שנוצר ב-AI',
        instruction: data.instruction || data.description || (isHe ? 'השלם את בלוק הקוד במיקום הנכון.' : 'Complete the code block with the correct chips.'),
        instructionHe: data.instruction || data.description || 'השלם את בלוק הקוד במיקום הנכון.',
        language: (activeCategory === 'all' ? 'python' : activeCategory) as any,
        category: activeCategory === 'architecture' ? 'architecture' : 'code',
        difficulty: 'Intermediate',
        codeTemplate: data.codeTemplate || `def process_data(items):\n    return [{{SLOT_0}}(x) for x in items if {{SLOT_1}}(x)]`,
        slots: data.slots || [
          { id: 'SLOT_0', correctAnswer: 'str' },
          { id: 'SLOT_1', correctAnswer: 'bool' },
        ],
        wordBank: data.wordBank || ['str', 'bool', 'int', 'len', 'type', 'print'],
        explanation: data.explanation || (isHe ? 'כל הכבוד! הכללים יושמו בצורה מדויקת.' : 'Great job! Correct code tokens placed.'),
        explanationHe: data.explanation || 'כל הכבוד! הכללים יושמו בצורה מדויקת.',
        xpReward: 50,
      };

      setChallenges((prev) => [newChallenge, ...prev]);
      setCurrentChallengeIndex(0);
      soundFx.playSuccess();
    } catch (err) {
      console.warn('AI Drag & Drop generation failed:', err);
      setAiError(isHe ? 'קריאה ל-AI נכשלה. נסה שוב בעוד כדקה.' : 'AI request failed. Please try again in a moment.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Render code template with interactive Drop Zones
  const renderInteractiveCode = () => {
    if (!currentChallenge) return null;

    const parts = currentChallenge.codeTemplate.split(/(\{\{SLOT_\d+\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{(SLOT_\d+)\}\}/);
      if (match) {
        const slotId = match[1];
        const placedValue = userPlacedSlots[slotId];
        const isActive = activeSlotId === slotId;
        const slotConfig = currentChallenge.slots.find((s) => s.id === slotId);
        const isSlotCorrect = isSubmitted && placedValue === slotConfig?.correctAnswer;
        const isSlotIncorrect = isSubmitted && placedValue !== slotConfig?.correctAnswer;

        return (
          <button
            key={`slot-${slotId}-${index}`}
            type="button"
            onClick={() => handleClearSlot(slotId)}
            className={`inline-flex items-center justify-center min-w-[70px] px-3 py-1 mx-1.5 rounded-lg border-2 font-mono font-bold text-sm transition-all shadow-xs align-middle ${
              isSlotCorrect
                ? 'bg-[#58CC02] border-[#58CC02] text-white'
                : isSlotIncorrect
                ? 'bg-[#FF4B4B] border-[#FF4B4B] text-white animate-bounce'
                : placedValue
                ? 'bg-[#1CB0F6] border-[#1CB0F6] text-white'
                : isActive
                ? 'bg-amber-100 border-[#FFC800] text-[#3C3C3C] ring-2 ring-[#FFC800]/50'
                : 'bg-white/80 border-dashed border-[#AFAFAF] text-[#777777] hover:border-[#1CB0F6]'
            }`}
          >
            {placedValue || `[ ${slotId.replace('SLOT_', 'משבצת ')} ]`}
          </button>
        );
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 select-none">
      {/* Banner & Category Selector */}
      <div className="cose-card p-6 sm:p-8 bg-gradient-to-r from-[#FFC800]/10 via-[#1CB0F6]/10 to-transparent border-2 border-[#FFC800]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FFC800]">
            <Puzzle className="w-6 h-6 fill-current" />
            <span className="text-xs font-black uppercase tracking-widest text-[#3C3C3C]">
              {isHe ? 'משחקי Drag & Drop / Word-Bank (סגנון Duolingo)' : 'Duolingo-Style Code Completion'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3C3C3C]">
            {isHe ? 'השלמת מילות מפתח בקוד' : 'Word-Bank Code Completion'}
          </h1>
          <p className="text-sm font-semibold text-[#777777]">
            {isHe
              ? 'גרור או לחץ על תגיות הקוד מהבנק למטה כדי להשלים את בלוק הקוד בצורה מדויקת.'
              : 'Drag or click code chips from the word bank into the drop zones to fix the code.'}
          </p>
        </div>

        {/* AI Generator Button */}
        <button
          onClick={handleGenerateAIChallenge}
          disabled={isGeneratingAI}
          className="btn-outline text-xs font-extrabold !py-2.5 !px-4 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#EBF8FF] flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#1CB0F6] animate-pulse" />
          <span>{isGeneratingAI ? (isHe ? 'מייצר אתגר...' : 'Generating...') : (isHe ? '✨ יצור אתגר חדש ב-AI' : '✨ Generate AI Challenge')}</span>
        </button>
      </div>

      {/* Language Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'python', 'javascript', 'sql', 'architecture'] as const).map((cat) => {
          const count = challenges.filter((c) => cat === 'all' || c.language === cat).length;
          const label =
            cat === 'all'
              ? isHe ? 'הכל' : 'All Tracks'
              : cat === 'python'
              ? 'Python'
              : cat === 'javascript'
              ? 'JavaScript'
              : cat === 'sql'
              ? 'SQL'
              : isHe ? 'ארכיטקטורה' : 'Architecture';

          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentChallengeIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border-2 flex items-center gap-2 ${
                activeCategory === cat
                  ? 'border-[#1CB0F6] bg-[#EBF8FF] text-[#1CB0F6]'
                  : 'border-[#E5E5E5] text-[#777777] hover:border-[#1CB0F6]'
              }`}
            >
              <span>{label}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-current font-black">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* AI Error Alert Banner */}
      {aiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold flex items-center justify-between">
          <span>{aiError}</span>
          <button onClick={() => setAiError(null)} className="underline hover:text-rose-900">
            {isHe ? 'סגור' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* MAIN DRAG & DROP ARENA */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        {/* TOP AREA: TASK CONTEXT & INSTRUCTIONS */}
        <div className="p-5 rounded-2xl bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1CB0F6]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
                {isHe ? 'המשימה שלך' : 'Task Mission'}
              </span>
            </div>
            <span className="text-xs font-black text-[#58CC02] uppercase tracking-wider">
              +{currentChallenge.xpReward} XP
            </span>
          </div>

          <h2 className="text-xl font-black text-[#3C3C3C]">
            {isHe ? currentChallenge.titleHe : currentChallenge.title}
          </h2>

          <p className="text-sm font-extrabold text-[#3C3C3C] leading-relaxed">
            👉 {isHe ? currentChallenge.instructionHe : currentChallenge.instruction}
          </p>
        </div>

        {/* CENTER AREA: CODE BLOCK WITH DROP ZONES */}
        <div dir="ltr" className="rounded-2xl bg-[#1E1E1E] border-2 border-[#3C3C3C] text-left overflow-hidden shadow-md">
          {/* Top header bar with Language & Copy Code Button */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#3C3C3C] text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#AFAFAF] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#1CB0F6]" />
              <span>{currentChallenge.language || 'python'}</span>
            </span>
            <button
              onClick={() => {
                const codeToCopy = currentChallenge.codeTemplate.replace(/\{\{(SLOT_\d+)\}\}/g, (_, slotId) => userPlacedSlots[slotId] || `[${slotId}]`);
                navigator.clipboard.writeText(codeToCopy);
                soundFx.playClick();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-bold text-[#AFAFAF] hover:text-white hover:bg-[#3C3C3C] transition-all cursor-pointer"
            >
              <span>COPY CODE</span>
            </button>
          </div>

          <div className="p-6 text-white font-mono text-sm sm:text-base leading-relaxed overflow-x-auto whitespace-pre-wrap text-left" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
            {renderInteractiveCode()}
          </div>
        </div>

        {/* BOTTOM AREA: WORD BANK / CHIPS */}
        <div className="space-y-3 pt-4 border-t-2 border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#777777]">
              {isHe ? 'בנק המילים (Word Bank) - לחץ או גרור:' : 'Word Bank - Tap chip to place into active slot:'}
            </span>

            <button
              onClick={handleReset}
              className="text-xs font-extrabold text-[#777777] hover:text-[#1CB0F6] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHe ? 'איפוס תגיות' : 'Reset Placed Chips'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-4 rounded-2xl bg-[#F7F7F7] border-2 border-[#E5E5E5] min-h-[70px]">
            {currentChallenge.wordBank.map((chip, idx) => {
              const isUsed = Object.values(userPlacedSlots).includes(chip);

              return (
                <button
                  key={`chip-${chip}-${idx}`}
                  type="button"
                  disabled={isUsed || isSubmitted}
                  onClick={() => handlePlaceChip(chip)}
                  className={`px-4 py-2 rounded-xl font-mono font-bold text-sm transition-all shadow-sm border-2 ${
                    isUsed
                      ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#EBF8FF] hover:scale-105 active:scale-95 cursor-pointer'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTON & FEEDBACK */}
        <div className="pt-4 border-t-2 border-[#E5E5E5] space-y-4">
          {!isSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={Object.keys(userPlacedSlots).length < currentChallenge.slots.length}
              className="btn-primary w-full py-4 text-base font-black flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{isHe ? 'לבדוק תשובה' : 'CHECK SOLUTION'}</span>
            </button>
          ) : (
            <div
              className={`p-6 rounded-2xl border-2 space-y-3 ${
                isCorrect
                  ? 'bg-[#F2FBF0] border-[#58CC02] text-[#3C3C3C]'
                  : 'bg-rose-50 border-rose-300 text-[#3C3C3C]'
              }`}
            >
              <div className="flex items-center gap-2 text-base font-black">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-[#58CC02]" />
                    <span className="text-[#58CC02]">
                      {isHe ? 'מצוין! התשובה נכונה מדויקת! 🎉' : 'Awesome! Solution is Spot On! 🎉'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-rose-600" />
                    <span className="text-rose-600">
                      {isHe ? 'לא מדויק — בדוק את השימוש בתגיות הקוד' : 'Not quite right — review chip placement'}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm font-semibold leading-relaxed">
                {isHe ? currentChallenge.explanationHe : currentChallenge.explanation}
              </p>

              <div className="flex gap-3 pt-2">
                {!isCorrect && (
                  <button
                    onClick={handleReset}
                    className="btn-outline flex-1 py-3 text-sm font-extrabold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isHe ? 'נסה שוב' : 'Try Again'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (filteredChallenges.length > 1) {
                      setCurrentChallengeIndex((prev) => (prev + 1) % filteredChallenges.length);
                      handleReset();
                    }
                  }}
                  className="btn-primary flex-1 py-3 text-sm font-extrabold flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{isHe ? 'האתגר הבא' : 'Next Challenge'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
