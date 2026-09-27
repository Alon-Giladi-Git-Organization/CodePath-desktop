import React, { useState } from 'react';
import { Quiz, QuizQuestion, UserProfile, NavScreen } from '../../types';
import { QUIZZES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CoseMascot } from '../common/CoseMascot';
import { CodeBlock } from '../code/CodeBlock';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Zap, 
  ChevronRight,
  Sparkles, 
  Award,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  quizId: string;
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onRecordScore: (quizId: string, score: number, total: number) => void;
  onOpenMentor: (prompt?: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizId,
  user,
  onNavigate,
  onRecordScore,
  onOpenMentor,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const baseQuiz: Quiz = QUIZZES[quizId] || QUIZZES['quiz-python-loops'] || Object.values(QUIZZES)[0];
  const [activeQuiz, setActiveQuiz] = useState<Quiz>(baseQuiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const currentQuestion: QuizQuestion = activeQuiz.questions[currentIndex] || activeQuiz.questions[0];
  const totalQuestions = activeQuiz.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const chosen = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!chosen?.isCorrect;

    if (isCorrect) {
      soundFx.playSuccess();
      setCorrectCount((prev) => prev + 1);
    } else {
      soundFx.playNotice();
    }

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      if (correctCount >= Math.floor(totalQuestions / 2)) {
        confetti({
          particleCount: 80,
          spread: 70,
          colors: ['#58CC02', '#FFC800', '#1CB0F6'],
        });
      }
      onRecordScore(activeQuiz.id, correctCount, totalQuestions);
    }
  };

  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  // Generate new dynamic AI quiz question
  const handleGenerateAIQuestion = async () => {
    soundFx.playClick();
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/generate-ai-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeQuiz.title || 'Programming Concepts & Code Quality',
          language: 'python',
          difficulty: 'Beginner',
          category: 'quiz',
          appLanguage: language,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate AI question');
      const data = await response.json();

      const newQ: QuizQuestion = {
        id: data.id || `q-ai-${Date.now()}`,
        question: data.question || (isHe ? 'מהו הפלט או התוצאה של קטע קוד זה?' : 'What is the expected outcome of this code?'),
        questionHe: data.question || 'מהו הפלט או התוצאה של קטע קוד זה?',
        codeSnippet: data.codeSnippet,
        options: data.options.map((opt: any, idx: number) => ({
          id: opt.id || `opt-ai-${idx}`,
          text: opt.text,
          textHe: opt.text,
          isCorrect: !!opt.isCorrect,
          explanation: opt.explanation,
          explanationHe: opt.explanation,
        })),
        xpReward: 20,
      };

      setActiveQuiz((prev) => ({
        ...prev,
        questions: [...prev.questions, newQ],
      }));

      // Jump to the newly created question
      setCurrentIndex(activeQuiz.questions.length);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      soundFx.playSuccess();
    } catch (e) {
      console.warn('AI Quiz generation failed, fallback:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Results Screen View
  if (isFinished) {
    const finalScore = correctCount;
    const finalPercent = Math.round((finalScore / totalQuestions) * 100);
    const isPerfect = finalScore === totalQuestions;

    return (
      <div id="quiz-results-screen" className="max-w-2xl mx-auto space-y-8 pb-20">
        <div className="cose-card p-8 sm:p-10 text-center space-y-6">
          <div className="flex justify-center">
            <CoseMascot mood={isPerfect ? 'celebrating' : 'proud'} size="xl" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C]">
              {isPerfect ? t('quizFlawlessTitle') : t('quizCompletedTitle')}
            </h1>
            <p className="text-sm text-[#777777] font-semibold">
              {t('quizScoreText')
                .replace('{score}', String(finalScore))
                .replace('{total}', String(totalQuestions))
                .replace('{percent}', String(finalPercent))}
            </p>
          </div>

          {/* XP Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFBE6] border-2 border-[#FFE885] text-[#CC9900] font-extrabold text-sm">
            <Zap className="w-4 h-4 fill-[#FFC800]" />
            <span>{t('quizXpEarned').replace('{xp}', String(finalScore * 15))}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t-2 border-[#E5E5E5]">
            <button
              id="quiz-retake-btn"
              onClick={handleRestartQuiz}
              className="btn-outline text-xs font-extrabold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('quizRetake')}</span>
            </button>

            <button
              id="quiz-continue-btn"
              onClick={() => onNavigate('dashboard')}
              className="btn-primary"
            >
              <span>{t('quizContinueLearning')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chosenOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
  const isCorrect = isAnswerSubmitted && !!chosenOption?.isCorrect;

  const quizTitle = isHe && activeQuiz.titleHe ? activeQuiz.titleHe : activeQuiz.title;
  const questionText = isHe && currentQuestion.questionHe ? currentQuestion.questionHe : currentQuestion.question;

  return (
    <div id="quiz-screen" className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Top Header & Progress */}
      <div className="cose-card p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#777777] uppercase tracking-wider">
          <span>{t('quizQuestionCounter').replace('{current}', String(currentIndex + 1)).replace('{total}', String(totalQuestions))}</span>
          <span className="text-[#58A700]">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} color="green" size="md" />
      </div>

      {/* Main Question Card */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
              {quizTitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C] mt-1">
              {questionText}
            </h2>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-start">
            <button
              onClick={handleGenerateAIQuestion}
              disabled={isGeneratingAI}
              className="btn-outline text-xs font-extrabold !py-2 !px-3 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#EBF8FF] flex items-center gap-1.5"
              title={t('quizAIGenerateBtn')}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1CB0F6]" />
              <span className="hidden sm:inline">{isGeneratingAI ? t('quizAIGenerating') : t('quizAIGenerateBtn')}</span>
            </button>
            <CoseMascot
              mood={isAnswerSubmitted ? (isCorrect ? 'celebrating' : 'encouraging') : 'thinking'}
              size="sm"
            />
          </div>
        </div>

        {/* Dedicated Code Block if question has codeSnippet (Always LTR with copy button) */}
        {currentQuestion.codeSnippet && (
          <div className="space-y-1.5">
            <CodeBlock
              code={currentQuestion.codeSnippet}
              language="python"
              showLineNumbers={true}
            />
          </div>
        )}

        {/* Options List (3 or 4 options with randomized correct answer) */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]';

            if (isAnswerSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700] shadow-xs';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-[#FFE0E0] border-[#FF4B4B] text-[#FF4B4B]';
              }
            } else if (isSelected) {
              optionStyles = 'bg-[#EBF8FF] border-[#1CB0F6] shadow-xs';
            }

            const optionLabel = isHe 
              ? (idx === 0 ? 'א' : idx === 1 ? 'ב' : idx === 2 ? 'ג' : 'ד')
              : (idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : 'D');

            const optionText = isHe && option.textHe ? option.textHe : option.text;

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-[16px] border-2 border-b-4 cursor-pointer transition-all flex items-center justify-between gap-3 ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isSelected ? 'bg-[#1CB0F6] text-white' : 'bg-[#F7F7F7] text-[#777777] border border-[#E5E5E5]'
                  }`}>
                    {optionLabel}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-[#3C3C3C]">
                    {optionText}
                  </span>
                </div>
                {isAnswerSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-[#58A700] shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-[#FF4B4B] shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Bottom Banner */}
        {isAnswerSubmitted && (
          <div
            className={`p-4 rounded-[16px] border-2 space-y-1 animate-fadeIn ${
              isCorrect
                ? 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700]'
                : 'bg-[#FFE0E0] border-[#FF4B4B] text-[#FF4B4B]'
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-sm">
              {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{isCorrect ? t('quizCorrectTitle') : t('quizIncorrectTitle')}</span>
            </div>
            {chosenOption && (
              <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed">
                {isHe && chosenOption.explanationHe ? chosenOption.explanationHe : chosenOption.explanation}
              </p>
            )}
          </div>
        )}

        {/* Submit or Continue Button */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
          <button
            onClick={() => onNavigate('courses')}
            className="btn-outline text-xs font-extrabold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('quizBackToQuizzes')}</span>
          </button>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="btn-primary"
            >
              <span>{t('quizCheckAnswer')}</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              <span>{t('quizContinue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
