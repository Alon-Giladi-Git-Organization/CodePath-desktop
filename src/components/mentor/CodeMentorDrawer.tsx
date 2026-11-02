import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MentorMessage, MentorMode, AiActionProposal, Exercise, UserSnippet } from '../../types';
import { INITIAL_MENTOR_MESSAGES } from '../../data/mockData';
import { CodeBlock } from '../code/CodeBlock';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Lightbulb, 
  BookOpen,
  Database,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { useAuth } from '../../firebase/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  getUserDataSnapshotForAi, 
  saveUserExercise, 
  saveUserSnippet 
} from '../../firebase/service';
import { AiActionConfirmationModal } from './AiActionConfirmationModal';

interface CodeMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
  activeLanguage?: string;
  currentCodeContext?: string;
  activeExerciseId?: string;
  onExerciseAdded?: (newEx: Exercise) => void;
}

export const CodeMentorDrawer: React.FC<CodeMentorDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  activeLanguage = 'python',
  currentCodeContext = '',
  activeExerciseId = '',
  onExerciseAdded,
}) => {
  const { effectiveUserId } = useAuth();
  const { language, isRtl } = useLanguage();

  const [messages, setMessages] = useState<MentorMessage[]>(INITIAL_MENTOR_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<MentorMode>('hint');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<AiActionProposal | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: isRtl ? 'שמור מקטע קוד' : 'Save current snippet', text: isRtl ? 'תוכל לשמור את הפונקציה הנוכחית שלי למאגר האישי?' : 'Can you save my current code snippet to my repository?' },
    { label: isRtl ? 'אתגר נוסף לתרגול' : 'Give practice exercise', text: isRtl ? 'תן לי תרגיל חדש מותאם לרמה שלי בפייתון' : 'Generate a custom practice exercise matched to my level' },
    { label: isRtl ? 'חוקי הזחה בפייתון' : 'Indentation rules', text: isRtl ? 'מדוע הזחה כל כך קריטית בפייתון?' : 'Why is indentation so strict in Python?' },
    { label: isRtl ? 'מניעת לולאות אינסופיות' : 'Avoid infinite loops', text: isRtl ? 'איך מוודאים שלולאת while לא נתקעת לנצח?' : 'How do I make sure my while loop terminates?' },
    { label: isRtl ? 'אנלוגיה מהחיים' : 'Real-world analogy', text: isRtl ? 'תן לי אנלוגיה מהחיים למבנה לולאות עם תנאים' : 'Give me a real-world analogy for conditional loops' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    soundFx.playClick();
    const userMsg: MentorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      // 1. Fetch live sanitized snapshot of the user's personal database (exercises, snippets, progress)
      const dbSnapshot = await getUserDataSnapshotForAi(effectiveUserId, {
        activeExerciseId,
        currentCode: currentCodeContext,
      });

      // 2. Call intelligent backend endpoint with injected context
      const res = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userDataSnapshot: dbSnapshot,
          currentCodeContext,
          appLanguage: language,
        }),
      });

      const data = await res.json();

      let botText = data.response || "I'm here to help you master code! Keep exploring and asking questions.";
      let proposal: AiActionProposal | null = null;

      if (data.actionProposal) {
        proposal = {
          id: `prop-${Date.now()}`,
          action: data.actionProposal.action || 'create',
          entityType: data.actionProposal.entityType || 'snippet',
          title: data.actionProposal.title || 'AI Action Proposal',
          description: data.actionProposal.description || 'Database change proposed by Mentor',
          afterData: data.actionProposal.data || {},
          diffSummary: data.actionProposal.diffSummary || ['New record proposed for personal database'],
        };
        setPendingProposal(proposal);
      }

      const botMsg: MentorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: botText,
        codeSnippet: data.codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      soundFx.playSuccess();
    } catch (err) {
      console.warn('Mentor query error, using local fallback:', err);
      const fallbackMsg: MentorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: isRtl 
          ? 'אני כאן כדי לעזור! פרק את הבעיה לצעדים קטנים ובדוק שכל שורה מקבלת את הקלט הנכון.'
          : 'I am here to guide you! Break the problem down into small steps and verify variable values along the way.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCommitProposal = async (proposal: AiActionProposal) => {
    setIsCommitting(true);
    try {
      if (proposal.entityType === 'exercise') {
        const newEx = proposal.afterData as unknown as Exercise;
        await saveUserExercise(effectiveUserId, newEx);
        if (onExerciseAdded) onExerciseAdded(newEx);
      } else if (proposal.entityType === 'snippet') {
        const newSnippet = proposal.afterData as unknown as UserSnippet;
        await saveUserSnippet(effectiveUserId, newSnippet);
      }

      const confirmMsg: MentorMessage = {
        id: `msg-${Date.now()}`,
        sender: 'mentor',
        text: isRtl 
          ? `✓ השינוי (${proposal.title}) נשמר בהצלחה במסד הנתונים האישי שלך ב-Firestore!`
          : `✓ Successfully committed (${proposal.title}) to your personal Firestore repository!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmMsg]);
      setPendingProposal(null);
    } catch (err) {
      console.error('Failed to commit AI action proposal:', err);
    } finally {
      setIsCommitting(false);
    }
  };

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative w-full max-w-md bg-white border-x-2 border-[#E5E5E5] h-full flex flex-col shadow-2xl z-10 select-none"
            >
              {/* Header */}
              <div className="p-4 border-b-2 border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CoseMascot mood="happy" size="sm" />
                  <div>
                    <h3 className="font-extrabold text-base text-[#3C3C3C]">
                      {isRtl ? 'מנטור קוד AI אינטראקטיבי' : 'AI Code Mentor'}
                    </h3>
                    <p className="text-[11px] text-[#58A700] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
                      {isRtl ? 'מחובר למאגר הנתונים האישי' : 'Live Personal DB Connected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMessages(INITIAL_MENTOR_MESSAGES)}
                    title={isRtl ? 'איפוס צ׳אט' : 'Reset Chat'}
                    className="p-2 rounded-[12px] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-[12px] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="p-3 bg-[#F7F7F7] border-b-2 border-[#E5E5E5] flex gap-2">
                <button
                  onClick={() => setMode('hint')}
                  className={`flex-1 py-1.5 px-3 rounded-[12px] text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'hint'
                      ? 'bg-[#DBF8C5] border-2 border-[#58CC02] text-[#58A700]'
                      : 'bg-white border-2 border-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'רמזים והכוונה' : 'Nudge & Hints'}</span>
                </button>
                <button
                  onClick={() => setMode('explanation')}
                  className={`flex-1 py-1.5 px-3 rounded-[12px] text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'explanation'
                      ? 'bg-[#EBF8FF] border-2 border-[#1CB0F6] text-[#1CB0F6]'
                      : 'bg-white border-2 border-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'הסבר מעמיק' : 'Deep Dive'}</span>
                </button>
              </div>

              {/* Message Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                  const isMentor = msg.sender === 'mentor';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[88%] p-3.5 rounded-[16px] text-xs sm:text-sm font-semibold leading-relaxed ${
                          isMentor
                            ? 'bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#3C3C3C]'
                            : 'bg-[#58CC02] text-white border-b-4 border-[#58A700]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.codeSnippet && (
                          <div className="mt-2.5">
                            <CodeBlock
                              code={msg.codeSnippet}
                              language={activeLanguage}
                              showLineNumbers={false}
                            />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[#AFAFAF] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* AI Action Execution Callout Card */}
                {pendingProposal && (
                  <div className="p-3.5 rounded-[16px] bg-[#EBF8FF] border-2 border-[#1CB0F6] space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-[#1CB0F6]">
                      <Database className="w-4 h-4" />
                      <span className="text-xs font-extrabold uppercase">
                        {isRtl ? 'הצעת פעולה למסד הנתונים' : 'AI Database Proposal'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#3C3C3C]">
                      {pendingProposal.title}
                    </p>
                    <p className="text-[11px] text-[#777777] font-semibold">
                      {pendingProposal.description}
                    </p>
                    <button
                      id="review-ai-diff-btn"
                      onClick={() => setIsConfirmModalOpen(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] bg-[#1CB0F6] hover:bg-[#009CEB] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                    >
                      <span>{isRtl ? 'סקור שינויים (Diff View) ואשר' : 'Review Diff & Approve'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1CB0F6] italic p-2 bg-[#F7F7F7] rounded-[12px] border border-[#E5E5E5] w-fit">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{isRtl ? 'המנטור מגבש תשובה מותאמת אישית...' : 'Mentor is formulating personal guidance...'}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Prompts */}
              <div className="p-2.5 bg-[#F7F7F7] border-t-2 border-[#E5E5E5] flex gap-1.5 overflow-x-auto scrollbar-none">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] text-[11px] font-bold text-[#777777] hover:text-[#3C3C3C] hover:border-[#AFAFAF] whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t-2 border-[#E5E5E5] bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isRtl ? 'שאל את מנטור ה-AI שאלה...' : 'Ask your AI mentor a question...'}
                  className="cose-input flex-1 text-xs sm:text-sm !py-2.5"
                />
                <button
                  id="mentor-send-msg-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="btn-primary !p-2.5 !rounded-[12px] disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Action Confirmation Modal with Diff View */}
      <AiActionConfirmationModal
        proposal={pendingProposal}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleCommitProposal}
        isCommitting={isCommitting}
      />
    </>
  );
};
