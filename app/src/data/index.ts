import type { Lesson, Question, Section } from '../types';
import { dataProcessingLessons, dataProcessingSections } from './dataProcessing';
import { ictProblemsLessons, ictProblemsSections } from './ictProblems';
import { multimediaLessons, multimediaSections } from './multimedia';
import { webDesignLessons, webDesignQuestions, webDesignSections } from './webDesign';

export { modules } from './modules';

export const moduleSections: Record<string, Section[]> = {
  'web-design': webDesignSections,
  'data-processing': dataProcessingSections,
  multimedia: multimediaSections,
  'ict-problems': ictProblemsSections,
};

export const lessonsContent: Record<string, Lesson> = {
  ...webDesignLessons,
  ...dataProcessingLessons,
  ...ictProblemsLessons,
  ...multimediaLessons,
};

export const questionsByLesson: Record<string, Question[]> = {
  ...webDesignQuestions,
};
