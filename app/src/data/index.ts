import type { Lesson, Question, Section } from '../types';
import { dataProcessingLessons, dataProcessingSections } from './dataProcessing';
import { dataProcessingQuestions } from './dataProcessingQuestions';
import { ictProblemsLessons, ictProblemsSections } from './ictProblems';
import { ictProblemsQuestions } from './ictProblemsQuestions';
import { multimediaLessons, multimediaSections } from './multimedia';
import { multimediaQuestions } from './multimediaQuestions';
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
  ...dataProcessingQuestions,
  ...multimediaQuestions,
  ...ictProblemsQuestions,
};
