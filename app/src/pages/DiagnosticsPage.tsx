import { Link } from 'react-router-dom';
import { lessonsContent, moduleSections, modules } from '../data';
import { useProgress } from '../progress/ProgressContext';

export default function DiagnosticsPage() {
  const { progress } = useProgress();
  const entries = Object.entries(progress);

  return (
    <div className="dashboard">
      <Link to="/" className="back-link">
        ← Начало
      </Link>
      <h1>Диагностика</h1>
      <p className="subtitle">
        Процент готовност по тема, изчислен от последните ти опити (формулата е чернова — виж
        CLAUDE.md §11.4).
      </p>

      {entries.length === 0 && <p>Все още няма направени тестове. Реши тест по някой урок, за да видиш карта тук.</p>}

      {entries.length > 0 && (
        <ul className="my-word-list">
          {entries
            .sort((a, b) => a[1].percent - b[1].percent)
            .map(([lessonId, p]) => {
              const lesson = lessonsContent[lessonId];
              const moduleId = Object.keys(moduleSections).find((mid) =>
                moduleSections[mid].some((s) => s.lessons.some((l) => l.id === lessonId)),
              );
              const moduleTitle = modules.find((m) => m.id === moduleId)?.title ?? '';
              return (
                <li key={lessonId}>
                  <span className="en">{lesson?.title ?? lessonId}</span>
                  <span className="bg">{moduleTitle}</span>
                  <span style={{ fontWeight: 700, color: p.percent >= 70 ? 'var(--right)' : 'var(--wrong)' }}>
                    {p.percent}%
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
