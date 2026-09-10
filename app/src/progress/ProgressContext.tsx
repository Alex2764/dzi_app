import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getAllProgress, recordAttempt as recordAttemptStorage } from '../lib/storage';
import type { LessonProgress } from '../types';

interface ProgressContextValue {
  progress: Record<string, LessonProgress>;
  loading: boolean;
  getPercent: (lessonId: string) => number | undefined;
  recordAttempt: (lessonId: string, correctCount: number, totalCount: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }
    setLoading(true);
    getAllProgress(user.id).then((map) => {
      setProgress(map);
      setLoading(false);
    });
  }, [user]);

  async function recordAttempt(lessonId: string, correctCount: number, totalCount: number) {
    if (!user) return;
    const entry = await recordAttemptStorage(user.id, lessonId, correctCount, totalCount);
    if (entry) setProgress((prev) => ({ ...prev, [lessonId]: entry }));
  }

  function getPercent(lessonId: string) {
    return progress[lessonId]?.percent;
  }

  return (
    <ProgressContext.Provider value={{ progress, loading, getPercent, recordAttempt }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
