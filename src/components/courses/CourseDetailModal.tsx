import React from 'react';
import { Course, UserProfile, NavScreen } from '../../types';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { LESSONS } from '../../data/mockData';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen?: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate?: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onStartLesson?: (lessonId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen = true,
  onClose,
  user,
  onNavigate,
  onStartLesson,
}) => {
  const { t, language, isRtl } = useLanguage();
  const isHe = language === 'he';

  if (!course) return null;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => user.completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (course.totalLessons || allLessons.length || 1)) * 100);

  const courseTitle = isHe && course.titleHe ? course.titleHe : course.title;
  const courseDesc = isHe && course.descriptionHe ? course.descriptionHe : course.description;
  const courseBadge = isHe && course.badgeHe ? course.badgeHe : course.badge;

  const handleSelectLesson = (lessonId: string) => {
    onClose();
    if (onStartLesson) {
      onStartLesson(lessonId);
    } else if (onNavigate) {
      const targetId = LESSONS[lessonId] ? lessonId : 'python-13';
      onNavigate('lesson', { lessonId: targetId, courseId: course.id });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseTitle}
      subtitle={`${course.difficulty} • ${course.totalLessons} ${isHe ? 'שיעורים' : 'Lessons'} • ${course.estimatedHours} ${isHe ? 'שעות לימוד' : 'Hours total'}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Course Summary Header */}
        <div className="p-5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-3">
          <p className="text-xs sm:text-sm text-[#3C3C3C] font-semibold leading-relaxed">
            {courseDesc}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="primary" size="sm">{course.difficulty}</Badge>
            {courseBadge && <Badge variant="purple" size="sm">{courseBadge}</Badge>}
            {course.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" size="sm">{tag}</Badge>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs font-extrabold text-[#777777] mb-1.5">
              <span>{isHe ? 'התקדמות במסלול' : 'Path Progress'}</span>
              <span className="text-[#58A700]">{progressPercent}% {isHe ? 'הושלמו' : 'Completed'}</span>
            </div>
            <ProgressBar value={progressPercent} color="green" size="md" />
          </div>
        </div>

        {/* Modules & Lessons Curriculum */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF]">
            {t('coursesSyllabusModalSub')}
          </h4>

          {course.modules.map((module) => {
            const moduleTitle = isHe && module.titleHe ? module.titleHe : module.title;
            const moduleDesc = isHe && module.descriptionHe ? module.descriptionHe : module.description;

            return (
              <div
                key={module.id}
                className="rounded-[16px] border-2 border-[#E5E5E5] overflow-hidden bg-white"
              >
                <div className="px-4 py-3 bg-[#F7F7F7] border-b-2 border-[#E5E5E5] flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-sm text-[#3C3C3C]">
                      {moduleTitle}
                    </h5>
                    <p className="text-xs text-[#777777] font-semibold">
                      {moduleDesc}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#777777]">
                    {module.lessons.length} {isHe ? 'שיעורים' : 'lessons'}
                  </span>
                </div>

                <div className="divide-y-2 divide-[#E5E5E5]">
                  {module.lessons.map((lesson) => {
                    const isCompleted = user.completedLessons.includes(lesson.id);
                    const isCurrent = user.activeLessonId === lesson.id && course.id === user.activeCourseId;
                    const lessonTitle = isHe && lesson.titleHe ? lesson.titleHe : lesson.title;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson.id)}
                        className={`p-3.5 flex items-center justify-between hover:bg-[#F7F7F7] transition-colors cursor-pointer ${
                          isCurrent ? 'bg-[#DBF8C5]/50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center text-xs font-extrabold">
                                ✓
                              </div>
                            ) : isCurrent ? (
                              <div className="w-6 h-6 rounded-full bg-[#1CB0F6] text-white flex items-center justify-center text-[10px] font-extrabold">
                                ▶
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-[#E5E5E5] text-[#AFAFAF] flex items-center justify-center text-[10px] font-bold">
                                {lesson.order}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="text-sm font-extrabold text-[#3C3C3C] flex items-center gap-2">
                              <span>{lessonTitle}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-[#58CC02] text-white">
                                  {isHe ? 'פעיל כעת' : 'Current'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#777777] font-semibold mt-0.5">
                              <span className="capitalize">{lesson.type === 'concept' ? (isHe ? 'מושג יסוד' : 'Concept') : lesson.type === 'practice' ? (isHe ? 'תרגול קוד' : 'Code Practice') : (isHe ? 'בוחן ידע' : 'Checkpoint Quiz')}</span>
                              <span>•</span>
                              <span>{lesson.durationMinutes} {isHe ? 'דק׳' : 'mins'}</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-[#AFAFAF]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
