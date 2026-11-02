import React from 'react';
import { AiActionProposal } from '../../types';
import { Modal } from '../common/Modal';
import { CodeBlock } from '../code/CodeBlock';
import { useLanguage } from '../../i18n/LanguageContext';
import { Check, X, PlusCircle, RefreshCw, Trash2, ShieldCheck, Database } from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface AiActionConfirmationModalProps {
  proposal: AiActionProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (proposal: AiActionProposal) => Promise<void>;
  isCommitting?: boolean;
}

export const AiActionConfirmationModal: React.FC<AiActionConfirmationModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onConfirm,
  isCommitting = false,
}) => {
  const { isRtl } = useLanguage();

  if (!proposal) return null;

  const handleConfirm = async () => {
    soundFx.playClick();
    await onConfirm(proposal);
    soundFx.playSuccess();
    onClose();
  };

  const getActionBadge = () => {
    switch (proposal.action) {
      case 'create':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#DBF8C5] text-[#58A700] border border-[#58CC02]">
            <PlusCircle className="w-3.5 h-3.5" />
            {isRtl ? 'יצירה / הוספה' : 'Create & Add'}
          </span>
        );
      case 'update':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#EBF8FF] text-[#1CB0F6] border border-[#1CB0F6]">
            <RefreshCw className="w-3.5 h-3.5" />
            {isRtl ? 'עדכון נתונים' : 'Update Record'}
          </span>
        );
      case 'delete':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FFE0E0] text-[#FF4B4B] border border-[#FF4B4B]">
            <Trash2 className="w-3.5 h-3.5" />
            {isRtl ? 'מחיקה' : 'Delete'}
          </span>
        );
    }
  };

  const codePayload = (proposal.afterData as any)?.code || (proposal.afterData as any)?.starterCode || '';
  const lang = (proposal.afterData as any)?.language || 'python';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRtl ? 'אישור שינוי מסד נתונים על ידי ה-AI' : 'AI Action: Database Mutation Confirmation'}
      subtitle={isRtl ? 'המנטור מציע שינוי במאגר האישי שלך. השינוי יחול רק לאחר אישורך המפורש.' : 'The AI Mentor proposes a change to your personal Firestore repository. Review the diff before committing.'}
      maxWidth="2xl"
      id="ai-action-confirm-modal"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-[#58A700] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isRtl ? 'אבטחת Multi-Tenant: מוגבל למשתמש שלך בלבד' : 'Multi-Tenant Security: Scoped to your UID'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              id="ai-action-cancel-btn"
              onClick={onClose}
              disabled={isCommitting}
              className="btn-outline text-xs !py-2 !px-4"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              <span>{isRtl ? 'ביטול' : 'Cancel'}</span>
            </button>
            <button
              id="ai-action-confirm-btn"
              onClick={handleConfirm}
              disabled={isCommitting}
              className="btn-primary text-xs !py-2 !px-4 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isCommitting ? (isRtl ? 'מבצע...' : 'Committing...') : (isRtl ? 'אשר ובצע שינוי' : 'Approve & Commit')}</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Header Action Summary Banner */}
        <div className="p-4 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1CB0F6]" />
              <span className="text-xs font-extrabold text-[#3C3C3C] uppercase tracking-wider">
                {proposal.entityType.toUpperCase()} REPOSITORY
              </span>
            </div>
            {getActionBadge()}
          </div>
          <h4 className="font-extrabold text-base text-[#3C3C3C]">
            {proposal.title}
          </h4>
          <p className="text-xs text-[#777777] font-semibold">
            {proposal.description}
          </p>
        </div>

        {/* Diff Summary Checklist */}
        {proposal.diffSummary && proposal.diffSummary.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="text-xs font-extrabold uppercase tracking-wide text-[#777777]">
              {isRtl ? 'פירוט השינויים (Diff View):' : 'Proposed Diff Summary:'}
            </h5>
            <ul className="space-y-1">
              {proposal.diffSummary.map((diffItem, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-[#3C3C3C] bg-[#FAFBF9] p-2 rounded-[10px] border border-[#E5E5E5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02]" />
                  <span>{diffItem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Diff / Preview */}
        {codePayload && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#777777]">
                {isRtl ? 'קוד מוצע:' : 'Proposed Code Content:'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5E5E5] text-[#3C3C3C]">
                {lang}
              </span>
            </div>
            <div className="border-2 border-[#E5E5E5] rounded-[14px] overflow-hidden">
              <CodeBlock code={codePayload} language={lang} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
