import React, { useState, useEffect } from 'react';
import { UserProfile, ArchitectureChallenge, ArchitectureQuality } from '../../types';
import { ARCHITECTURE_CHALLENGES } from '../../data/architectureChallenges';
import { useLanguage } from '../../i18n/LanguageContext';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { CodeBlock } from '../code/CodeBlock';
import { CoseMascot } from '../common/CoseMascot';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Layers, 
  Server,
  Cpu,
  Database
} from 'lucide-react';

interface ArchitectureLabViewProps {
  user: UserProfile;
  onNavigate: (screen: any, opts?: any) => void;
  onOpenMentor: (initialPrompt?: string) => void;
  onCompleteChallenge: (challengeId: string, xpReward: number) => void;
}

export const ArchitectureLabView: React.FC<ArchitectureLabViewProps> = ({
  user,
  onNavigate,
  onOpenMentor,
  onCompleteChallenge,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  const [challenges, setChallenges] = useState<ArchitectureChallenge[]>(ARCHITECTURE_CHALLENGES);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Evaluation state
  const [selectedQuality, setSelectedQuality] = useState<ArchitectureQuality | null>(null);
  const [qualityEvaluated, setQualityEvaluated] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<string | null>(null);
  const [diagnosticEvaluated, setDiagnosticEvaluated] = useState(false);
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [impactEvaluated, setImpactEvaluated] = useState(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationRun, setSimulationRun] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const filteredChallenges = challenges.filter((ch) => {
    if (selectedCategory === 'all') return true;
    return ch.category === selectedCategory;
  });

  const currentChallenge = filteredChallenges[activeChallengeIndex] || challenges[0];

  useEffect(() => {
    setSelectedQuality(null);
    setQualityEvaluated(false);
    setSelectedDiagnostic(null);
    setDiagnosticEvaluated(false);
    setSelectedImpact(null);
    setImpactEvaluated(false);
    setSimulationRun(false);
    setIsSimulating(false);
    setShowComparison(false);
  }, [currentChallenge.id]);

  const completedList = user.completedArchitectureChallenges || [];
  const isAlreadyCompleted = completedList.includes(currentChallenge.id);

  const handleRunSimulation = () => {
    soundFx.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationRun(true);
      if (currentChallenge.expectedQuality === 'bad_crashing') {
        soundFx.playError();
      } else {
        soundFx.playSuccess();
      }
    }, 1000);
  };

  const handleSelectQuality = (quality: ArchitectureQuality) => {
    setSelectedQuality(quality);
    setQualityEvaluated(true);
    if (quality === currentChallenge.expectedQuality) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const diagnosticOptionsToUse = isHe && currentChallenge.diagnosticOptionsHe && currentChallenge.diagnosticOptionsHe.length > 0
    ? currentChallenge.diagnosticOptionsHe
    : currentChallenge.diagnosticOptions;

  const impactOptionsToUse = isHe && currentChallenge.productionImpactOptionsHe && currentChallenge.productionImpactOptionsHe.length > 0
    ? currentChallenge.productionImpactOptionsHe
    : currentChallenge.productionImpactOptions;

  const handleSelectDiagnostic = (optionId: string) => {
    setSelectedDiagnostic(optionId);
    setDiagnosticEvaluated(true);
    const opt = diagnosticOptionsToUse.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const handleSelectImpact = (optionId: string) => {
    setSelectedImpact(optionId);
    setImpactEvaluated(true);
    const opt = impactOptionsToUse.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      soundFx.playSuccess();
      if (!isAlreadyCompleted) {
        confetti({
          particleCount: 60,
          spread: 60,
          colors: ['#58CC02', '#1CB0F6', '#FFC800'],
        });
        onCompleteChallenge(currentChallenge.id, currentChallenge.xpReward);
      }
    } else {
      soundFx.playError();
    }
  };

  // Real-time AI Generation of Architecture Challenge
  const handleGenerateAIChallenge = async () => {
    soundFx.playClick();
    setIsGeneratingAI(true);

    try {
      const response = await fetch('/api/generate-ai-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'High Scale Microservices, Memory Leaks, and Database Optimization',
          language: 'typescript',
          difficulty: 'Intermediate',
          category: 'architecture',
          appLanguage: language,
        }),
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();

      // Formulate a new ArchitectureChallenge object
      const newChallenge: ArchitectureChallenge = {
        id: data.id || `arch-ai-${Date.now()}`,
        title: data.title || (isHe ? 'אתגר איכות ארכיטקטורה שנוצר ב-AI' : 'AI Generated Architecture Challenge'),
        titleHe: data.title || 'אתגר איכות ארכיטקטורה שנוצר ב-AI',
        category: 'scalability',
        difficulty: 'Intermediate',
        scenarioDescription: data.concept || 'Evaluating production performance and error resilience under heavy real-time traffic.',
        scenarioDescriptionHe: data.concept || 'ניתוח ביצועי פרודקשן ועמידות מערכת תחת תעבורת משתמשים כבדה.',
        language: data.language || 'typescript',
        expectedQuality: 'bad_crashing',
        antiPatternName: 'Architectural Defect',
        antiPatternNameHe: 'פגם ארכיטקטוני במערכת',
        architecturalPrinciple: 'Clean System Design & Scalability',
        architecturalPrincipleHe: 'תכנון מערכות נקי וסקיילבילי',
        codeSnippet: data.codeSnippet || `// Sample architecture snippet\nasync function handleTraffic(req, res) {\n  // Processing\n}`,
        diagnosticQuestion: data.question || 'What is the architectural bottleneck in this code?',
        diagnosticQuestionHe: data.question || 'מהו צוואר הבקבוק הארכיטקטוני בקוד זה?',
        diagnosticOptions: data.options.map((opt: any, idx: number) => ({
          id: opt.id || `diag-ai-${idx}`,
          text: opt.text,
          isCorrect: !!opt.isCorrect,
          explanation: opt.explanation,
        })),
        diagnosticOptionsHe: data.options.map((opt: any, idx: number) => ({
          id: opt.id || `diag-ai-${idx}`,
          text: opt.text,
          isCorrect: !!opt.isCorrect,
          explanation: opt.explanation,
        })),
        productionImpactQuestion: isHe 
          ? 'מה תהיה ההשפעה של פגם זה על שרתי הפרודקשן?' 
          : 'What is the blast radius of this defect in production?',
        productionImpactQuestionHe: 'מה תהיה ההשפעה של פגם זה על שרתי הפרודקשן?',
        productionImpactOptions: [
          {
            id: 'imp-1',
            text: isHe ? 'התארכות זמני תגובה (Latency) עד קריסת שרתים ו-504 Gateway Timeout' : 'Spike in P99 latency leading to HTTP 504 timeouts and worker crash',
            isCorrect: true,
            explanation: isHe ? 'נכון מאוד! העומס חונק את משאבי השרת.' : 'Correct! High resource contention cascades.'
          },
          {
            id: 'imp-2',
            text: isHe ? 'המשתמשים יראו צבעי גופן שונים' : 'Users will see altered CSS typography styles',
            isCorrect: false,
            explanation: isHe ? 'קוד שרת אינו משנה את גופני הלקוח.' : 'Server architecture is unrelated to browser font styling.'
          },
          {
            id: 'imp-3',
            text: isHe ? 'מסד הנתונים יימחק פיזית' : 'Database hardware will spontaneously reboot',
            isCorrect: false,
            explanation: isHe ? 'צוואר בקבוק אינו מוחק נתונים.' : 'Resource exhaustion does not format disks.'
          }
        ],
        productionImpactOptionsHe: [
          {
            id: 'imp-1',
            text: 'התארכות זמני תגובה (Latency) עד קריסת שרתים ו-504 Gateway Timeout',
            isCorrect: true,
            explanation: 'נכון מאוד! העומס חונק את משאבי השרת.'
          },
          {
            id: 'imp-2',
            text: 'המשתמשים יראו צבעי גופן שונים',
            isCorrect: false,
            explanation: 'קוד שרת אינו משנה את גופני הלקוח.'
          },
          {
            id: 'imp-3',
            text: 'מסד הנתונים יימחק פיזית',
            isCorrect: false,
            explanation: 'צוואר בקבוק אינו מוחק נתונים.'
          }
        ],
        simulatedMetrics: {
          loadRps: 500,
          bad: {
            cpuPercent: 94,
            memoryMb: 820,
            latencyMs: 3450,
            errorRatePercent: 48,
            crashReason: isHe ? 'קריסת שרת: ניצול מלא של תהליכי ה-CPU וזמני תגובה חורגים' : 'Server saturation: 100% CPU thread exhaustion and request queue timeout.',
            crashReasonHe: 'קריסת שרת: ניצול מלא של תהליכי ה-CPU וזמני תגובה חורגים',
          },
          good: {
            cpuPercent: 18,
            memoryMb: 110,
            latencyMs: 24,
            errorRatePercent: 0,
          }
        },
        badCodeExplanation: data.tip || 'Code requires asynchronous batching and resource cleanup.',
        badCodeExplanationHe: data.tip || 'הקוד דורש ביצוע מרוכז (Batching) ושחרור משאבים.',
        goodCodeSnippet: `// Refactored Scalable Solution\nexport async function handleTrafficOptimized(req, res) {\n  // Clean architecture\n  return res.json({ status: "optimized" });\n}`,
        goodCodeExplanation: isHe ? 'ארכיטקטורה מותאמת עומס החוסכת קריאות מיותרות ומפנה זיכרון.' : 'Scalable architecture minimizing roundtrips and reclaiming memory.',
        goodCodeExplanationHe: 'ארכיטקטורה מותאמת עומס החוסכת קריאות מיותרות ומפנה זיכרון.',
        keyTakeaways: [
          'Design for failure resilience and non-blocking asynchronous execution.',
          'Always clean up event handlers, intervals, and database connections.',
        ],
        keyTakeawaysHe: [
          'תכנן מערכות לטיפול עמיד בכשלים וביצוע אסינכרוני לא-חוסם.',
          'שחרר תמיד מאזינים, טיימרים וחיבורים למסד הנתונים.',
        ],
        xpReward: 50,
      };

      setChallenges((prev) => [newChallenge, ...prev]);
      setActiveChallengeIndex(0);
      setSelectedCategory('all');
      soundFx.playSuccess();
    } catch (err) {
      console.warn('AI Challenge generation fallback:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const categories = [
    { id: 'all', label: t('archFilterAll') },
    { id: 'scalability', label: t('archFilterScalability') },
    { id: 'error_handling', label: t('archFilterErrorHandling') },
    { id: 'frontend', label: t('archFilterFrontend') },
    { id: 'solid', label: t('archFilterSolid') },
    { id: 'concurrency', label: t('archFilterConcurrency') },
  ];

  const scenarioTitle = isHe && currentChallenge.titleHe ? currentChallenge.titleHe : currentChallenge.title;
  const scenarioDesc = isHe && currentChallenge.scenarioDescriptionHe ? currentChallenge.scenarioDescriptionHe : currentChallenge.scenarioDescription;
  const diagnosticQuestionText = isHe && currentChallenge.diagnosticQuestionHe ? currentChallenge.diagnosticQuestionHe : currentChallenge.diagnosticQuestion;
  const productionQuestionText = isHe && currentChallenge.productionImpactQuestionHe ? currentChallenge.productionImpactQuestionHe : currentChallenge.productionImpactQuestion;
  const crashReasonText = isHe && currentChallenge.simulatedMetrics.bad.crashReasonHe ? currentChallenge.simulatedMetrics.bad.crashReasonHe : currentChallenge.simulatedMetrics.bad.crashReason;
  const goodExplanationText = isHe && currentChallenge.goodCodeExplanationHe ? currentChallenge.goodCodeExplanationHe : currentChallenge.goodCodeExplanation;

  return (
    <div id="architecture-screen" className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Top Banner */}
      <div className="cose-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CoseMascot mood="thinking" size="md" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6]">
                {t('archBadgeLabel')}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFFBE6] text-[#CC9900] border border-[#FFE885]">
                +{currentChallenge.xpReward} XP
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#3C3C3C]">
              {t('archTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-semibold leading-relaxed max-w-2xl">
              {t('archSubtitle')}
            </p>
          </div>
        </div>

        {/* Action / Generator & Challenge Selector */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleGenerateAIChallenge}
            disabled={isGeneratingAI}
            className="btn-outline text-xs font-extrabold !py-2.5 !px-3.5 flex items-center gap-2 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#EBF8FF]"
          >
            <Sparkles className="w-4 h-4 text-[#1CB0F6] animate-pulse" />
            <span>{isGeneratingAI ? t('archAIGenerating') : t('archAIGenerateBtn')}</span>
          </button>

          <div className="flex items-center gap-2 bg-[#F7F7F7] p-1 rounded-[14px] border border-[#E5E5E5]">
            <button
              disabled={activeChallengeIndex === 0}
              onClick={() => setActiveChallengeIndex((prev) => Math.max(0, prev - 1))}
              className="btn-outline !p-2 disabled:opacity-40"
              title="Previous"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold text-[#3C3C3C] px-2">
              {activeChallengeIndex + 1} / {filteredChallenges.length}
            </span>
            <button
              disabled={activeChallengeIndex === filteredChallenges.length - 1}
              onClick={() => setActiveChallengeIndex((prev) => Math.min(filteredChallenges.length - 1, prev + 1))}
              className="btn-outline !p-2 disabled:opacity-40"
              title="Next"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory(cat.id);
              setActiveChallengeIndex(0);
            }}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#58CC02] text-white shadow-xs'
                : 'bg-white text-[#777777] border-2 border-[#E5E5E5] hover:border-[#AFAFAF]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Challenge Card */}
      <div className="cose-card p-6 sm:p-8 space-y-6">
        {/* Scenario Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#777777] block">
              {scenarioDesc}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#3C3C3C] mt-0.5">
              {scenarioTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="btn-secondary text-xs font-extrabold !py-2 !px-3.5"
            >
              <Activity className="w-4 h-4" />
              <span>{isSimulating ? t('archSimulating') : t('archSimulateLoadBtn')}</span>
            </button>
          </div>
        </div>

        {/* Code Inspection Block (Always dedicated box, LTR, with copy button) */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
            {t('archInspectTitle')} ({currentChallenge.language})
          </span>
          <CodeBlock
            code={currentChallenge.codeSnippet}
            language={currentChallenge.language}
            showLineNumbers={true}
          />
        </div>

        {/* Simulation Output Card */}
        {simulationRun && (
          <div className="p-5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-4 animate-fadeIn">
            <h3 className="text-sm font-extrabold text-[#3C3C3C] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#1CB0F6]" />
              <span>{t('archSimulationTitle')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* CPU */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsCpu')}</div>
                <div className="text-base font-extrabold text-[#3C3C3C]">
                  {currentChallenge.simulatedMetrics.bad.cpuPercent}%
                </div>
              </div>
              {/* Memory */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsMemory')}</div>
                <div className="text-base font-extrabold text-[#3C3C3C]">
                  {currentChallenge.simulatedMetrics.bad.memoryMb} MB
                </div>
              </div>
              {/* Latency */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsLatency')}</div>
                <div className="text-base font-extrabold text-[#3C3C3C]">
                  {currentChallenge.simulatedMetrics.bad.latencyMs}ms
                </div>
              </div>
              {/* Error Rate */}
              <div className="p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
                <div className="text-[11px] font-bold text-[#777777] uppercase">{t('archMetricsErrorRate')}</div>
                <div className={`text-base font-extrabold ${currentChallenge.simulatedMetrics.bad.errorRatePercent > 0 ? 'text-[#FF4B4B]' : 'text-[#58A700]'}`}>
                  {currentChallenge.simulatedMetrics.bad.errorRatePercent}%
                </div>
              </div>
            </div>

            <p className="text-xs text-[#3C3C3C] font-semibold leading-relaxed bg-white p-3 rounded-[10px] border border-[#E5E5E5]">
              {crashReasonText}
            </p>
          </div>
        )}

        {/* Evaluation Question 1: Quality Choice */}
        <div className="space-y-4 pt-4 border-t-2 border-[#E5E5E5]">
          <h3 className="text-sm font-extrabold text-[#3C3C3C]">
            {t('archCodeQuestion')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bad Option */}
            <div
              onClick={() => handleSelectQuality('bad_crashing')}
              className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                selectedQuality === 'bad_crashing'
                  ? currentChallenge.expectedQuality === 'bad_crashing'
                    ? 'bg-[#FFE0E0] border-[#FF4B4B] shadow-xs'
                    : 'bg-[#FFE0E0] border-[#FF4B4B]'
                  : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-sm font-extrabold text-[#FF4B4B]">
                <ShieldAlert className="w-5 h-5" />
                <span>{t('archChoiceBad')}</span>
              </div>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                {t('archChoiceBadDesc')}
              </p>
            </div>

            {/* Good Option */}
            <div
              onClick={() => handleSelectQuality('good_scalable')}
              className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                selectedQuality === 'good_scalable'
                  ? currentChallenge.expectedQuality === 'good_scalable'
                    ? 'bg-[#DBF8C5] border-[#58CC02] shadow-xs'
                    : 'bg-[#FFE0E0] border-[#FF4B4B]'
                  : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-sm font-extrabold text-[#58A700]">
                <ShieldCheck className="w-5 h-5" />
                <span>{t('archChoiceGood')}</span>
              </div>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                {t('archChoiceGoodDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation Question 2: Diagnostic Option */}
        {qualityEvaluated && (
          <div className="space-y-4 pt-4 border-t-2 border-[#E5E5E5] animate-fadeIn">
            <h3 className="text-sm font-extrabold text-[#3C3C3C]">
              {diagnosticQuestionText}
            </h3>

            <div className="space-y-2.5">
              {diagnosticOptionsToUse.map((opt) => {
                const isSelected = selectedDiagnostic === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectDiagnostic(opt.id)}
                    className={`p-3.5 rounded-[14px] border-2 cursor-pointer transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#DBF8C5] border-[#58CC02]'
                          : 'bg-[#FFE0E0] border-[#FF4B4B]'
                        : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#3C3C3C]">
                      <span>{opt.text}</span>
                      {isSelected && (
                        <span>{opt.isCorrect ? (isHe ? '✓ נכון מאוד' : '✓ Correct') : (isHe ? '✗ שגוי' : '✗ Incorrect')}</span>
                      )}
                    </div>
                    {isSelected && (
                      <p className="text-xs text-[#777777] mt-1 font-semibold leading-relaxed">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evaluation Question 3: Production Blast Radius */}
        {diagnosticEvaluated && (
          <div className="space-y-4 pt-4 border-t-2 border-[#E5E5E5] animate-fadeIn">
            <h3 className="text-sm font-extrabold text-[#3C3C3C]">
              {productionQuestionText}
            </h3>

            <div className="space-y-2.5">
              {impactOptionsToUse.map((opt) => {
                const isSelected = selectedImpact === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectImpact(opt.id)}
                    className={`p-3.5 rounded-[14px] border-2 cursor-pointer transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#DBF8C5] border-[#58CC02]'
                          : 'bg-[#FFE0E0] border-[#FF4B4B]'
                        : 'bg-white border-[#E5E5E5] hover:border-[#AFAFAF]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#3C3C3C]">
                      <span>{opt.text}</span>
                      {isSelected && (
                        <span>{opt.isCorrect ? (isHe ? '✓ מעולה (+XP)' : '✓ Correct (+XP)') : (isHe ? '✗ לא מדויק' : '✗ Incorrect')}</span>
                      )}
                    </div>
                    {isSelected && (
                      <p className="text-xs text-[#777777] mt-1 font-semibold leading-relaxed">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clean Refactoring Diff Toggle */}
        <div className="pt-4 border-t-2 border-[#E5E5E5]">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="btn-outline text-xs font-extrabold"
          >
            <Layers className="w-4 h-4 text-[#1CB0F6]" />
            <span>{showComparison ? t('archHideDiffBtn') : t('archCompareDiffBtn')}</span>
          </button>

          {showComparison && (
            <div className="mt-4 p-5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-4 animate-fadeIn">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#58A700]">
                {t('archGoodCodeHeader')}
              </span>
              <CodeBlock
                code={currentChallenge.goodCodeSnippet}
                language={currentChallenge.language}
                showLineNumbers={true}
              />
              <div className="p-3 rounded-[10px] bg-white border border-[#E5E5E5] text-xs font-semibold text-[#3C3C3C] leading-relaxed">
                {goodExplanationText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
