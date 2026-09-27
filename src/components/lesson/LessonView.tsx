import React, { useState } from 'react';
import { Lesson, UserProfile, NavScreen } from '../../types';
import { LESSONS, COURSES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CodeBlock } from '../code/CodeBlock';
import { InlineCode } from '../code/InlineCode';
import { CoseMascot } from '../common/CoseMascot';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Play, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  BookOpen,
  Code2,
  ChevronRight
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface LessonViewProps {
  lessonId: string;
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onCompleteLesson: (lessonId: string, courseId?: string) => void;
  onOpenMentor: (initialPrompt?: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  user,
  onNavigate,
  onCompleteLesson,
  onOpenMentor,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const lesson: Lesson = LESSONS[lessonId] || LESSONS['python-13'] || Object.values(LESSONS)[0];
  const course = COURSES.find((c) => c.id === lesson.courseId) || COURSES[0];

  const [activeStepTab, setActiveStepTab] = useState<'concept' | 'example' | 'breakdown' | 'tip'>('concept');
  const [selectedLine, setSelectedLine] = useState<number | null>(2);
  const isCompleted = user.completedLessons.includes(lesson.id);

  // Section progress calculation
  const currentLessonIndex = lesson.order;
  const sectionProgressPercent = Math.round((currentLessonIndex / (lesson.totalInCourse || 28)) * 100);

  const handleMarkComplete = () => {
    soundFx.playSuccess();
    onCompleteLesson(lesson.id, lesson.courseId);
  };

  const tabs = [
    { id: 'concept', label: t('lessonTabConcept'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'example', label: t('lessonTabExample'), icon: <Code2 className="w-4 h-4" /> },
    { id: 'breakdown', label: t('lessonTabBreakdown'), icon: <Layers className="w-4 h-4" /> },
    { id: 'tip', label: t('lessonTabTip'), icon: <Lightbulb className="w-4 h-4" /> },
  ] as const;

  const lessonTitle = isHe && lesson.titleHe ? lesson.titleHe : lesson.title;
  const lessonSub = isHe && lesson.subtitleHe ? lesson.subtitleHe : lesson.subtitle;
  const conceptTitle = isHe && lesson.conceptTitleHe ? lesson.conceptTitleHe : lesson.conceptTitle;
  const explanationParagraphs = isHe && lesson.explanationHe && lesson.explanationHe.length > 0 ? lesson.explanationHe : lesson.explanation;
  const realWorldAnalogy = isHe && lesson.realWorldAnalogyHe ? lesson.realWorldAnalogyHe : lesson.realWorldAnalogy;
  const courseTitle = isHe && course.titleHe ? course.titleHe : (lesson.courseTitle || course.title);

  const tipTitle = isHe && lesson.importantTip?.titleHe 
    ? lesson.importantTip.titleHe 
    : (lesson.importantTip?.title || (typeof lesson.importantTip === 'string' ? lesson.importantTip : (isHe ? 'טיפ זהב' : 'Key Tip')));

  const tipDesc = isHe && lesson.importantTip?.descriptionHe 
    ? lesson.importantTip.descriptionHe 
    : (lesson.importantTip?.description || (typeof lesson.importantTip === 'string' ? lesson.importantTip : ''));

  return (
    <div id="lesson-screen" className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Breadcrumb & Progress Header */}
      <div className="cose-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#777777] uppercase tracking-wider">
            <span
              onClick={() => onNavigate('courses')}
              className="hover:text-[#58CC02] cursor-pointer transition-colors"
            >
              {courseTitle}
            </span>
            <span>/</span>
            <span>{isHe ? 'שיעור' : 'Lesson'} {lesson.order}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              {lessonTitle}
            </h1>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#DBF8C5] text-[#58A700] border border-[#58CC02]/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('lessonCompletedBadge')}
              </span>
            )}
          </div>
        </div>

        {/* Section Progress */}
        <div className="sm:text-right space-y-1.5 min-w-[180px]">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-extrabold text-[#777777]">
            <span>{t('lessonProgressText').replace('{order}', String(lesson.order)).replace('{total}', String(lesson.totalInCourse || 28))}</span>
            <span className="text-[#58A700]">({sectionProgressPercent}%)</span>
          </div>
          <ProgressBar value={sectionProgressPercent} color="green" size="sm" />
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeStepTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`lesson-tab-${tab.id}`}
              onClick={() => {
                soundFx.playClick();
                setActiveStepTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs sm:text-sm font-extrabold uppercase tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#58CC02] text-white border-b-4 border-[#58A700]'
                  : 'bg-white text-[#777777] hover:text-[#3C3C3C] border-2 border-[#E5E5E5] border-b-4 hover:border-[#AFAFAF]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Concept */}
      {activeStepTab === 'concept' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
                {conceptTitle}
              </h2>
              <p className="text-sm text-[#777777] font-semibold mt-1">
                {lessonSub}
              </p>
            </div>
            <CoseMascot mood="thinking" size="md" />
          </div>

          <div className="space-y-4 text-[#3C3C3C] text-sm sm:text-base leading-relaxed font-medium">
            {explanationParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {realWorldAnalogy && (
            <div className="p-5 rounded-[16px] bg-[#FFFBE6] border-2 border-[#FFE885] space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#CC9900]">
                <Lightbulb className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                <span>{t('lessonMentalModel')}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#3C3C3C] leading-relaxed font-semibold">
                {realWorldAnalogy}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => onOpenMentor(`Explain "${conceptTitle}" with another beginner-friendly example`)}
              className="btn-outline text-xs font-extrabold"
            >
              <Sparkles className="w-4 h-4 text-[#1CB0F6]" />
              <span>{t('lessonAskMentorNudge')}</span>
            </button>
            <button
              onClick={() => setActiveStepTab('example')}
              className="btn-primary"
            >
              <span>{t('lessonNextExample')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Code Example */}
      {activeStepTab === 'example' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              {t('lessonInteractiveExampleTitle')}
            </h2>
            <p className="text-sm text-[#777777] font-semibold mt-1">
              {t('lessonInteractiveExampleSub')}
            </p>
          </div>

          {/* Syntax Highlighted Code Block (LTR & Pre-wrap always in dedicated box with copy button) */}
          <CodeBlock
            code={lesson.codeSnippet}
            language={lesson.language || 'python'}
            showLineNumbers={true}
          />

          <div className="p-4 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
              {t('lessonExpectedOutput')}
            </span>
            <pre
              dir="ltr"
              className="font-mono text-xs text-[#3C3C3C] whitespace-pre-wrap break-all text-left bg-white p-3 rounded-[10px] border border-[#E5E5E5]"
            >
              {lesson.simulatedOutput || 'Cycle number: 1\nCycle number: 2\nCycle number: 3\nCycle number: 4\nCycle number: 5\nLoop finished successfully!'}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => setActiveStepTab('concept')}
              className="btn-outline text-xs font-extrabold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('lessonBackConcept')}</span>
            </button>
            <button
              onClick={() => setActiveStepTab('breakdown')}
              className="btn-primary"
            >
              <span>{t('lessonNextBreakdown')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Line by Line Breakdown */}
      {activeStepTab === 'breakdown' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              {t('lessonLineBreakdownTitle')}
            </h2>
            <p className="text-sm text-[#777777] font-semibold mt-1">
              {t('lessonLineBreakdownSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <CodeBlock
              code={lesson.codeSnippet}
              language={lesson.language || 'python'}
              selectedLine={selectedLine}
              onLineClick={(num) => setSelectedLine(num)}
            />

            {/* Explanations List */}
            <div className="space-y-3">
              {lesson.lineBreakdown.map((item) => {
                const isSelected = selectedLine === item.lineNumber;
                const explanationText = isHe && item.explanationHe ? item.explanationHe : item.explanation;

                return (
                  <div
                    key={item.lineNumber}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedLine(item.lineNumber);
                    }}
                    className={`p-3.5 rounded-[14px] border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#DBF8C5] border-[#58CC02] shadow-xs'
                        : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-[#58CC02] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                        {item.lineNumber}
                      </span>
                      <InlineCode>{item.code}</InlineCode>
                    </div>
                    <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed">
                      {explanationText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => setActiveStepTab('example')}
              className="btn-outline text-xs font-extrabold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('lessonBackCode')}</span>
            </button>
            <button
              onClick={() => setActiveStepTab('tip')}
              className="btn-primary"
            >
              <span>{t('lessonNextTip')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Golden Tip & Completion */}
      {activeStepTab === 'tip' && (
        <div className="cose-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <CoseMascot mood="celebrating" size="md" />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
                {tipTitle}
              </h2>
              <p className="text-sm text-[#777777] font-semibold mt-1">
                {isHe ? 'שמור עיקרון זה בזכרון עבור משימות תכנות מעשיות.' : 'Keep this in your memory bank for live coding sessions.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[16px] bg-[#FFF5E6] border-2 border-[#FFD9A6] space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#CC7A00]">
              {t('lessonKeyTakeaway')}
            </span>
            <p className="text-sm sm:text-base text-[#3C3C3C] font-bold leading-relaxed">
              {tipDesc}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={() => onNavigate('practice', { exerciseId: lesson.exerciseId || 'ex-python-while-1' })}
              className="btn-secondary w-full sm:w-auto"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t('lessonJumpPractice')}</span>
            </button>

            <button
              id="lesson-mark-complete-btn"
              onClick={handleMarkComplete}
              className="btn-primary w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('lessonMarkComplete')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
