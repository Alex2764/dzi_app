export interface SheetCell {
  value: string | number;
  readOnly?: boolean;
}

export type TheoryBlock =
  | { kind: 'definitions'; items: { term: string; text: string }[] }
  | { kind: 'table'; title?: string; headers: string[]; rows: string[][] }
  | { kind: 'note'; label: string; text: string }
  | { kind: 'list'; title: string; items: string[] }
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string; lang?: 'markup' | 'css' | 'javascript' | 'php' }
  | { kind: 'sheet'; title?: string; caption?: string; columnLabels?: string[]; data: SheetCell[][] }
  | { kind: 'model3d'; title?: string; src: string; caption?: string; attributionText: string; attributionUrl: string };

export type LessonStatus = 'ready' | 'planned';

export interface LessonMeta {
  id: string;
  number: number;
  title: string;
  status: LessonStatus;
  bonus?: boolean;
}

export interface Lesson extends LessonMeta {
  theory: TheoryBlock[];
}

export interface Section {
  id: string;
  number: number;
  title: string;
  lessons: LessonMeta[];
}

export interface ModuleMeta {
  id: string;
  title: string;
  grade: string;
  status: LessonStatus;
}

export interface Question {
  id: string;
  lessonId: string;
  text: string;
  options: string[];
  correctIndex: number;
  note?: string;
}

export interface LessonProgress {
  percent: number;
  attempts: number;
  lastAttemptAt: string;
}
