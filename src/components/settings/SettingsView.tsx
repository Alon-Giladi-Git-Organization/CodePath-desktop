import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../firebase/AuthContext';
import { syncUserProfileToFirestore, getUserProfileFromFirestore } from '../../firebase/service';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Target, 
  Languages,
  Check, 
  Cloud,
  RefreshCw,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { soundFx } from '../../utils/sound';

interface SettingsViewProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onUpdateUser: (updater: (prev: UserProfile) => UserProfile) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onToggleSound,
  onUpdateUser,
  onResetData,
}) => {
  const { t, language, setLanguage, isRtl } = useLanguage();
  const isHe = language === 'he';
  const { currentUser, signInWithGoogle, signOut } = useAuth();

  const [nameInput, setNameInput] = useState(user.name);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    onUpdateUser((prev) => ({ ...prev, name: nameInput.trim() || 'Learner' }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSelectGoal = (minutes: number) => {
    soundFx.playClick();
    onUpdateUser((prev) => ({ ...prev, dailyGoalMinutes: minutes }));
  };

  const handleManualSync = async () => {
    if (!currentUser) {
      await signInWithGoogle();
      return;
    }

    try {
      setIsSyncing(true);
      soundFx.playClick();
      // First pull any latest data from Firestore
      const remote = await getUserProfileFromFirestore(currentUser.uid);
      if (remote) {
        onUpdateUser((prev) => ({
          ...prev,
          ...remote,
          name: currentUser.displayName || remote.name || prev.name,
          email: currentUser.email || remote.email || prev.email,
          avatar: currentUser.photoURL || remote.avatar || prev.avatar,
        }));
      }
      // Then push current consolidated state
      await syncUserProfileToFirestore(currentUser.uid, {
        ...user,
        name: currentUser.displayName || user.name,
        email: currentUser.email || user.email,
        avatar: currentUser.photoURL || user.avatar,
      });

      soundFx.playSuccess();
      setSyncStatusMsg(isHe ? 'סונכרן בהצלחה מול Firestore!' : 'Successfully synced to Firestore!');
    } catch (err) {
      console.error('Manual sync failed:', err);
      setSyncStatusMsg(isHe ? 'שגיאה בסנכרון' : 'Sync error');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }
  };

  const handleConfirmReset = () => {
    soundFx.playClick();
    setIsConfirmResetOpen(false);
    onResetData();
  };

  return (
    <div id="settings-screen" className="w-full max-w-full space-y-5 sm:space-y-6 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C]">
          {t('settingsTitle')}
        </h1>
        <p className="text-sm text-[#777777] font-semibold mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Cloud Account & Synchronization Banner */}
      <div className="cose-card p-6 border-2 border-[#E5E5E5] bg-gradient-to-r from-white to-[#F7FCF0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-[#DBF8C5] text-[#58A700] flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#3C3C3C]">
                  {isHe ? 'סנכרון ענן ו-Firebase' : 'Cloud Sync & Firebase'}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EBF8FF] text-[#1CB0F6] border border-[#BAE3FF]">
                  codepthapp
                </span>
              </div>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                {currentUser 
                  ? (isHe ? `מחובר כ-${currentUser.email} • כל ההתקדמות נשמרת אוטומטית` : `Connected as ${currentUser.email} • Auto-synced across devices`)
                  : (isHe ? 'התחבר עם Google כדי לסנכרן את כל השיעורים, ה-XP והתרגילים בין הדסקטופ למובייל' : 'Sign in to sync your lessons, XP, and code exercises across Desktop & Mobile')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {currentUser ? (
              <>
                <button
                  type="button"
                  id="manual-sync-btn"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="btn-primary flex-1 sm:flex-none text-xs font-extrabold !py-2.5 !px-4 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? (isHe ? 'מסנכרן...' : 'Syncing...') : (isHe ? 'סנכרן עכשיו' : 'Sync Now')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="p-2.5 rounded-[12px] bg-white border-2 border-[#E5E5E5] text-[#777777] hover:text-[#FF4B4B] hover:border-[#FFCCCC] transition-colors cursor-pointer"
                  title={isHe ? 'התנתק' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                id="settings-signin-btn"
                onClick={() => signInWithGoogle()}
                className="btn-primary w-full sm:w-auto text-xs font-extrabold !py-2.5 !px-4 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isHe ? 'התחבר עם Google' : 'Sign In with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {syncStatusMsg && (
          <div className="mt-3 text-xs font-extrabold text-[#58A700] flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>{syncStatusMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="cose-card p-6 space-y-5">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser?.photoURL || user.avatar}
              alt={currentUser?.displayName || user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#58CC02] shadow-xs"
            />
            <div>
              <h2 className="font-extrabold text-base text-[#3C3C3C]">
                {currentUser?.displayName || user.name}
              </h2>
              <p className="text-xs text-[#777777] font-semibold">
                {currentUser?.email || user.email}
              </p>
              <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFFBE6] text-[#CC9900] border border-[#FFE885]">
                Level {user.level} ({user.xp.toLocaleString()} XP)
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#777777] mb-1.5">
                {t('settingsDisplayName')}
              </label>
              <input
                id="settings-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="cose-input w-full text-sm"
                placeholder={isHe ? 'שם התצוגה שלך' : 'Your display name'}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                id="save-profile-btn"
                className="btn-primary text-xs font-extrabold !py-2 !px-4"
              >
                {t('buttonSave')}
              </button>
              {isSaved && (
                <span className="text-xs font-extrabold text-[#58A700] flex items-center gap-1 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" /> {isHe ? 'נשמר בהצלחה!' : 'Saved!'}
                </span>
              )}
            </div>
          </form>

          {/* Daily Goal Setting */}
          <div className="space-y-3 pt-3 border-t-2 border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#58CC02]" />
              <h3 className="font-extrabold text-sm text-[#3C3C3C]">
                {t('settingsDailyGoal')}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSelectGoal(mins)}
                  className={`py-2 px-3 rounded-[12px] border-2 font-extrabold text-xs transition-all cursor-pointer ${
                    user.dailyGoalMinutes === mins
                      ? 'bg-[#DBF8C5] border-[#58CC02] text-[#58A700]'
                      : 'bg-white border-[#E5E5E5] text-[#777777] hover:border-[#AFAFAF]'
                  }`}
                >
                  {mins} {isHe ? 'דק׳/יום' : 'min/day'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences & Language Card */}
        <div className="cose-card p-6 space-y-5">
          {/* Language Switcher */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#1CB0F6]" />
              <h3 className="font-extrabold text-sm text-[#3C3C3C]">
                {t('languageSettingTitle')}
              </h3>
            </div>
            <p className="text-xs text-[#777777] font-semibold">
              {t('languageSettingDesc')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setLanguage('en');
                }}
                className={`py-2.5 px-3 rounded-[12px] border-2 font-extrabold text-xs transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#EBF8FF] border-[#1CB0F6] text-[#1CB0F6]'
                    : 'bg-white border-[#E5E5E5] text-[#777777] hover:border-[#AFAFAF]'
                }`}
              >
                🇺🇸 {t('langEnLabel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setLanguage('he');
                }}
                className={`py-2.5 px-3 rounded-[12px] border-2 font-extrabold text-xs transition-all cursor-pointer ${
                  language === 'he'
                    ? 'bg-[#EBF8FF] border-[#1CB0F6] text-[#1CB0F6]'
                    : 'bg-white border-[#E5E5E5] text-[#777777] hover:border-[#AFAFAF]'
                }`}
              >
                🇮🇱 {t('langHeLabel')}
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="space-y-3 pt-3 border-t-2 border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-[#3C3C3C]">
                  {t('settingsSoundEffects')}
                </h4>
                <p className="text-xs text-[#777777] font-semibold">
                  {isHe ? 'משוב קולי מדויק בלחיצות, הצלחות ובדיקות קוד.' : 'Tactile feedback on clicks, successes, and errors.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleSound}
                className="btn-outline !py-2 !px-3"
              >
                {user.soundEnabled ? <Volume2 className="w-4 h-4 text-[#58CC02]" /> : <VolumeX className="w-4 h-4 text-[#AFAFAF]" />}
              </button>
            </div>
          </div>

          {/* Reset Progress */}
          <div className="space-y-3 pt-3 border-t-2 border-[#E5E5E5]">
            <div>
              <h4 className="font-extrabold text-sm text-[#FF4B4B]">
                {isHe ? 'איפוס נתונים מקומי' : 'Danger Zone'}
              </h4>
              <p className="text-xs text-[#777777] font-semibold">
                {t('settingsResetConfirm')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsConfirmResetOpen(true)}
              className="btn-danger text-xs font-extrabold !py-2 !px-3"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('settingsResetProgress')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Modal */}
      <Modal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        title={t('settingsResetProgress')}
        subtitle={t('settingsResetConfirm')}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#777777] font-semibold">
            {t('settingsResetConfirm')}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsConfirmResetOpen(false)}
              className="btn-outline text-xs"
            >
              {t('buttonCancel')}
            </button>
            <button
              onClick={handleConfirmReset}
              className="btn-danger text-xs"
            >
              {t('settingsResetProgress')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
