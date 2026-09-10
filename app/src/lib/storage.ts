import { supabase } from './supabaseClient';
import type { LessonProgress } from '../types';

type ProgressMap = Record<string, LessonProgress>;

export async function getAllProgress(userId: string): Promise<ProgressMap> {
  const { data, error } = await supabase.from('lesson_progress').select('*').eq('user_id', userId);
  if (error || !data) return {};

  const map: ProgressMap = {};
  for (const row of data) {
    map[row.lesson_id] = {
      percent: row.percent,
      attempts: row.attempts,
      lastAttemptAt: row.last_attempt_at,
    };
  }
  return map;
}

// ⚠️ ЧЕРНОВА формула — виж CLAUDE.md §11.4 (отворен въпрос "Скала на процентите").
// Засега: проста среднопретеглена стойност между старото % и резултата от
// последния опит (50/50), без претегляне по трудност. Ще се преработи, когато
// формулата бъде решена официално.
export async function recordAttempt(
  userId: string,
  lessonId: string,
  correctCount: number,
  totalCount: number,
): Promise<LessonProgress | null> {
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  const rawPercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const percent = existing ? Math.round(existing.percent * 0.5 + rawPercent * 0.5) : rawPercent;
  const attempts = (existing?.attempts ?? 0) + 1;
  const lastAttemptAt = new Date().toISOString();

  const { error } = await supabase.from('lesson_progress').upsert({
    user_id: userId,
    lesson_id: lessonId,
    percent,
    attempts,
    last_attempt_at: lastAttemptAt,
  });
  if (error) {
    console.error('[storage] recordAttempt failed', error);
    return null;
  }

  return { percent, attempts, lastAttemptAt };
}
