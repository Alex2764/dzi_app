import { Check, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { modules, moduleSections } from '../data';
import { useProgress } from '../progress/ProgressContext';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { getPercent } = useProgress();

  const module = modules.find((m) => m.id === moduleId);
  const sections = moduleId ? moduleSections[moduleId] : undefined;

  if (!module || !sections) {
    return (
      <div className="dashboard">
        <Link to="/" className="back-link">
          ← Начало
        </Link>
        <p>Модулът не е намерен.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Link to="/" className="back-link">
        ← Начало
      </Link>
      <h1>{module.title}</h1>
      <p className="subtitle">{module.grade}</p>

      {sections.map((section) => (
        <section key={section.id} className="level-section">
          <div className="level-header">
            <h2>
              {section.number}. {section.title}
            </h2>
          </div>
          <div className="topic-grid">
            {section.lessons.map((lessonMeta) => {
              const ready = lessonMeta.status === 'ready';
              const percent = getPercent(lessonMeta.id);
              return (
                <Link
                  key={lessonMeta.id}
                  to={ready ? `/module/${module.id}/lesson/${lessonMeta.id}` : '#'}
                  className={`topic-card ${percent !== undefined ? 'done' : 'todo'} ${!ready ? 'disabled' : ''} ${lessonMeta.bonus ? 'bonus' : ''}`}
                  aria-disabled={!ready}
                  onClick={(e) => {
                    if (!ready) e.preventDefault();
                  }}
                >
                  <span className="topic-order">
                    {lessonMeta.bonus ? <Sparkles size={15} strokeWidth={2} /> : lessonMeta.number}
                  </span>
                  <span className="topic-title">
                    {lessonMeta.bonus && <span className="bonus-tag">Бонус</span>}
                    {lessonMeta.title}
                  </span>
                  {percent !== undefined && (
                    <span className="check">
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  )}
                  {!ready && <span className="soon">предстои</span>}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
