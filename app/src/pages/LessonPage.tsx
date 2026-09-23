import { ClipboardCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AiTutorButton from '../components/AiTutorButton';
import TheoryBlocks from '../components/TheoryBlocks';
import { lessonsContent, moduleSections, questionsByLesson } from '../data';
import { useProgress } from '../progress/ProgressContext';

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const { getPercent } = useProgress();

  const lesson = lessonId ? lessonsContent[lessonId] : undefined;
  const questions = lessonId ? questionsByLesson[lessonId] : undefined;
  const percent = lessonId ? getPercent(lessonId) : undefined;
  const siblingLessons = moduleId
    ? (moduleSections[moduleId] ?? []).flatMap((section) => section.lessons)
    : [];

  if (!lesson) {
    return (
      <div className="topic-page">
        <Link to={`/module/${moduleId}`} className="back-link">
          ← Назад към модула
        </Link>
        <p>Урокът все още няма съдържание.</p>
      </div>
    );
  }

  return (
    <div className="topic-page">
      <Link to={`/module/${moduleId}`} className="back-link">
        ← Назад към модула
      </Link>
      <h1>
        {lesson.number}. {lesson.title}
        {percent !== undefined && <span className="badge-done">{percent}% готовност</span>}
      </h1>

      <TheoryBlocks blocks={lesson.theory} />

      <AiTutorButton lesson={lesson} siblingLessons={siblingLessons} />

      {questions && questions.length > 0 && (
        <Link to={`/module/${moduleId}/lesson/${lesson.id}/test`} className="ai-btn">
          <ClipboardCheck size={18} strokeWidth={2} />
          Провери се — тест по темата
        </Link>
      )}
    </div>
  );
}
