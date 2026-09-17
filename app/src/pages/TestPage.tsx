import { Check, Loader2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lessonsContent, questionsByLesson } from '../data';
import { explainAnswer } from '../lib/api';
import { useProgress } from '../progress/ProgressContext';
import type { Question } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Разбъркваме реда на въпросите И реда на опциите вътре във всеки въпрос —
// AI не участва в тази стъпка (виж CLAUDE.md §4.2 — само разбъркване, не съчиняване).
function buildShuffledQuestions(bank: Question[]): Question[] {
  return shuffle(bank).map((q) => {
    const optionsWithIndex = q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex }));
    const shuffled = shuffle(optionsWithIndex);
    return {
      ...q,
      options: shuffled.map((o) => o.text),
      correctIndex: shuffled.findIndex((o) => o.isCorrect),
    };
  });
}

export default function TestPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const { recordAttempt } = useProgress();

  const lesson = lessonId ? lessonsContent[lessonId] : undefined;
  const bank = lessonId ? questionsByLesson[lessonId] : undefined;
  const questions = useMemo(() => (bank ? buildShuffledQuestions(bank) : []), [bank]);

  const [index, setIndex] = useState(0);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!lesson || questions.length === 0) {
    return (
      <div className="topic-page">
        <Link to={`/module/${moduleId}/lesson/${lessonId}`} className="back-link">
          ← Назад към урока
        </Link>
        <p>Няма въпроси за този урок още.</p>
      </div>
    );
  }

  const current = questions[index];

  async function choose(optionIndex: number) {
    if (chosenIndex !== null) return;
    setChosenIndex(optionIndex);
    const isCorrect = optionIndex === current.correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);

    setExplaining(true);
    try {
      const result = await explainAnswer({
        question: current.text,
        options: current.options,
        correctIndex: current.correctIndex,
        chosenIndex: optionIndex,
      });
      setExplanation(result.explanation);
    } catch {
      // Локален резервен вариант, ако AI обяснението не успее (напр. няма ANTHROPIC_API_KEY локално).
      setExplanation(
        isCorrect
          ? 'Верен отговор.'
          : `Грешен отговор. Верният е: „${current.options[current.correctIndex]}“.`,
      );
    } finally {
      setExplaining(false);
    }
  }

  async function next() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setChosenIndex(null);
      setExplanation(null);
    } else {
      if (lessonId) await recordAttempt(lessonId, correctCount, questions.length);
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="topic-page">
        <div className="flashcard-finished">
          <h2>
            Резултат: {correctCount} / {questions.length}
          </h2>
          <p>{Math.round((correctCount / questions.length) * 100)}% верни отговори по темата.</p>
          <div className="flashcard-actions">
            <Link to={`/module/${moduleId}/lesson/${lessonId}`} className="ai-btn secondary">
              Обратно към урока
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-page">
      <Link to={`/module/${moduleId}/lesson/${lessonId}`} className="back-link">
        ← Назад към урока
      </Link>
      <h1>
        {lesson.title}
        <br />
        <small className="subtitle">
          Въпрос {index + 1} от {questions.length}
        </small>
      </h1>

      <div className="explanation">
        <p style={{ fontWeight: 600 }}>{current.text}</p>
        <div className="exercises">
          {current.options.map((opt, i) => {
            let cls = 'exercise ai';
            if (chosenIndex !== null) {
              if (i === current.correctIndex) cls += ' correct';
              else if (i === chosenIndex) cls += ' incorrect';
            }
            return (
              <div key={i} className={cls}>
                <button type="button" className="ai-btn secondary" disabled={chosenIndex !== null} onClick={() => choose(i)}>
                  {opt}
                </button>
                {chosenIndex !== null && i === current.correctIndex && (
                  <span className="mark ok">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                )}
                {chosenIndex !== null && i === chosenIndex && i !== current.correctIndex && (
                  <span className="mark bad">
                    <X size={16} strokeWidth={2.5} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {chosenIndex !== null && (
          <div className="ai-exercise">
            <h2>Обяснение</h2>
            {explaining && (
              <p>
                <Loader2 size={16} className="spin" /> AI генерира обяснение…
              </p>
            )}
            {!explaining && explanation && <p>{explanation}</p>}
            <button type="button" className="ai-btn" onClick={next}>
              {index + 1 < questions.length ? 'Следващ въпрос' : 'Виж резултата'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
