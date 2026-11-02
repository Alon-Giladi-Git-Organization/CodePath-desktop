import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Compass, Terminal, Layers, HelpCircle, FileCode, Settings, ArrowRight, CornerDownLeft } from 'lucide-react';
import { NavScreen, GlobalSearchResult } from '../../types';
import { COURSES } from '../../data/mockData';
import { ARCHITECTURE_CHALLENGES } from '../../data/architectureChallenges';
import { useLanguage } from '../../i18n/LanguageContext';
import { Modal } from './Modal';
import { soundFx } from '../../utils/sound';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  savedSnippets?: { id: string; title: string; language: string }[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  savedSnippets = [],
}) => {
  const { isRtl } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build Unified Search Index
  const searchIndex: GlobalSearchResult[] = useMemo(() => {
    const list: GlobalSearchResult[] = [];

    // 1. Courses
    COURSES.forEach((c) => {
      list.push({
        id: `course-${c.id}`,
        title: c.title,
        titleHe: c.titleHe,
        subtitle: `${c.difficulty} • ${c.totalLessons} Lessons • ${c.category}`,
        subtitleHe: `${c.difficultyHe || c.difficulty} • ${c.totalLessons} שיעורים • ${c.category}`,
        category: 'course',
        screen: 'courses',
        targetId: c.id,
        badge: c.category,
      });

      // 2. Lessons & Quizzes inside modules
      c.modules.forEach((mod) => {
        mod.lessons.forEach((l) => {
          list.push({
            id: `lesson-${l.id}`,
            title: l.title,
            titleHe: l.titleHe,
            subtitle: `${c.title} • Module: ${mod.title}`,
            subtitleHe: `${c.titleHe || c.title} • ${mod.titleHe || mod.title}`,
            category: 'lesson',
            screen: 'lesson',
            targetId: l.id,
            badge: l.type === 'concept' ? 'Concept' : 'Practice',
          });
        });
      });
    });

    // 3. Architecture Challenges
    ARCHITECTURE_CHALLENGES.forEach((arch) => {
      list.push({
        id: `arch-${arch.id}`,
        title: arch.title,
        titleHe: arch.titleHe,
        subtitle: `Quality Lab • ${arch.difficulty} • ${arch.category}`,
        subtitleHe: `מעבדת ארכיטקטורה • ${arch.difficulty} • ${arch.category}`,
        category: 'architecture',
        screen: 'architecture',
        targetId: arch.id,
        badge: 'Architecture',
      });
    });

    // 4. Core Practice IDE Modules
    list.push({
      id: 'practice-python',
      title: 'Python Interactive IDE Practice',
      titleHe: 'תרגול פייתון אינטראקטיבי ב-IDE',
      subtitle: 'Code practice with live execution, test cases & AI hints',
      subtitleHe: 'תרגול קוד עם הרצה חיה, בדיקות ורמזי AI',
      category: 'practice',
      screen: 'practice',
      badge: 'IDE',
    });

    list.push({
      id: 'practice-dragdrop',
      title: 'Drag & Drop Code Syntax Builder',
      titleHe: 'בניית תחביר קוד בגרירה ושחרור',
      subtitle: 'Tactile block puzzle exercises for foundational programming',
      subtitleHe: 'פאזל בלוקים מוחשי להבנת תחביר',
      category: 'practice',
      screen: 'dragdrop',
      badge: 'Blocks',
    });

    // 5. Saved Snippets
    savedSnippets.forEach((snip) => {
      list.push({
        id: `snip-${snip.id}`,
        title: snip.title,
        titleHe: snip.title,
        subtitle: `Saved User Snippet • ${snip.language}`,
        subtitleHe: `מקטע קוד שמור • ${snip.language}`,
        category: 'snippet',
        screen: 'settings',
        targetId: snip.id,
        badge: snip.language,
      });
    });

    // 6. Settings & System Screens
    list.push({
      id: 'nav-settings',
      title: 'Settings & Cloud Sync',
      titleHe: 'הגדרות וסנכרון ענן',
      subtitle: 'Manage profile, Google account, language, sound & data',
      subtitleHe: 'ניהול פרופיל, חשבון Google, שפה וצלילים',
      category: 'settings',
      screen: 'settings',
      badge: 'System',
    });

    list.push({
      id: 'nav-leaderboard',
      title: 'Global Community Leaderboard',
      titleHe: 'טבלת מובילים קהילתית',
      subtitle: 'Compare XP rankings, streaks and badges with other coders',
      subtitleHe: 'השוואת דירוגי XP, רצפי למידה ותגים',
      category: 'course',
      screen: 'leaderboard',
      badge: 'Rankings',
    });

    return list;
  }, [savedSnippets]);

  // Filter results
  const filteredResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8);

    return searchIndex
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          (item.titleHe && item.titleHe.toLowerCase().includes(q)) ||
          item.subtitle.toLowerCase().includes(q) ||
          (item.subtitleHe && item.subtitleHe.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
        );
      })
      .slice(0, 10);
  }, [searchIndex, searchTerm]);

  // Reset selected index on search
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelectResult = (item: GlobalSearchResult) => {
    soundFx.playClick();
    onClose();
    if (item.screen === 'lesson' && item.targetId) {
      onNavigate('lesson', { lessonId: item.targetId });
    } else if (item.screen === 'courses' && item.targetId) {
      onNavigate('courses', { courseId: item.targetId });
    } else {
      onNavigate(item.screen);
    }
  };

  // Keyboard Navigation: Up, Down, Enter, Esc
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      }
    }
  };

  const getCategoryIcon = (cat: GlobalSearchResult['category']) => {
    switch (cat) {
      case 'course': return <Compass className="w-4 h-4 text-[#1CB0F6]" />;
      case 'lesson': return <Terminal className="w-4 h-4 text-[#58CC02]" />;
      case 'practice': return <Terminal className="w-4 h-4 text-[#FF9600]" />;
      case 'architecture': return <Layers className="w-4 h-4 text-[#9333EA]" />;
      case 'quiz': return <HelpCircle className="w-4 h-4 text-[#FFC800]" />;
      case 'snippet': return <FileCode className="w-4 h-4 text-[#0EA5E9]" />;
      case 'settings': return <Settings className="w-4 h-4 text-[#64748B]" />;
      default: return <Search className="w-4 h-4 text-[#777777]" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRtl ? 'חיפוש גלובלי מהיר' : 'Instant Global Search'}
      subtitle={isRtl ? 'נווט בקלות לכל שיעור, קורס, אתגר או מקטע קוד' : 'Jump directly to any course, lesson, challenge or code snippet'}
      maxWidth="xl"
      id="global-search-modal"
      footer={
        <div className="w-full flex items-center justify-between text-[11px] text-[#777777] font-semibold">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#E5E5E5] text-[#3C3C3C] font-mono text-[10px]">↑↓</span>
            <span>{isRtl ? 'לניווט' : 'Navigate'}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#E5E5E5] text-[#3C3C3C] font-mono text-[10px] ml-1">Enter</span>
            <span>{isRtl ? 'לבחירה' : 'Select'}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#E5E5E5] text-[#3C3C3C] font-mono text-[10px] ml-1">Esc</span>
            <span>{isRtl ? 'לסגירה' : 'Close'}</span>
          </div>
          <span className="text-[#58A700] font-bold">
            {filteredResults.length} {isRtl ? 'תוצאות' : 'results'}
          </span>
        </div>
      }
    >
      <div className="space-y-4" onKeyDown={handleKeyDown}>
        {/* Search Input */}
        <div className="relative">
          <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]`} />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'חפש שיעור, פקודה, פייתון, ארכיטקטורה, SQL...' : 'Search lessons, algorithms, Python, architecture, SQL...'}
            className={`w-full py-3 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-[14px] bg-[#F7F7F7] border-2 border-[#E5E5E5] focus:border-[#58CC02] focus:bg-white text-sm font-semibold text-[#3C3C3C] outline-none transition-all placeholder:text-[#AFAFAF]`}
          />
        </div>

        {/* Results List */}
        <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredResults.length === 0 ? (
            <div className="py-8 text-center text-[#777777]">
              <p className="text-sm font-bold">{isRtl ? 'לא נמצאו תוצאות' : 'No matching items found'}</p>
              <p className="text-xs mt-1">{isRtl ? 'נסה לחפש מילות מפתח כמו "python", "reduce", "loop"' : 'Try searching for keywords like "python", "reduce", or "loop"'}</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-[14px] border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#DBF8C5] border-[#58CC02] text-[#3C3C3C] translate-x-1'
                      : 'bg-white border-[#E5E5E5] hover:border-[#D5D5D5] text-[#3C3C3C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-[10px] ${isSelected ? 'bg-white shadow-xs' : 'bg-[#F7F7F7]'}`}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold truncate">
                        {isRtl && item.titleHe ? item.titleHe : item.title}
                      </p>
                      <p className="text-xs text-[#777777] font-semibold truncate">
                        {isRtl && item.subtitleHe ? item.subtitleHe : item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#58CC02] text-white' : 'bg-[#F7F7F7] text-[#777777] border border-[#E5E5E5]'}`}>
                        {item.badge}
                      </span>
                    )}
                    {isSelected ? (
                      <CornerDownLeft className="w-4 h-4 text-[#58A700]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-[#AFAFAF]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
