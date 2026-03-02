import { lessons } from '../data/curriculum';
import { defaultUserContext } from '../data/defaults';

export function getLessonById(lessonId) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonStatus(lessonId, progress) {
  if (progress.completedLessonIds.includes(lessonId)) {
    return 'completed';
  }
  if (progress.currentLessonId === lessonId) {
    return 'current';
  }
  return 'upcoming';
}

export function getNextLessonId(currentLessonId) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((lesson) => lesson.id === currentLessonId);
  if (index === -1 || index === sorted.length - 1) {
    return currentLessonId;
  }
  return sorted[index + 1].id;
}

function parseModuleNumberFromId(moduleId) {
  if (typeof moduleId !== 'string') return null;
  const match = moduleId.match(/(\d+)(?!.*\d)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function areModuleIdsZeroBased(modules = []) {
  const parsedIds = modules
    .map((module) => parseModuleNumberFromId(module?.id))
    .filter((value) => Number.isFinite(value));
  if (!parsedIds.length) return false;
  return Math.min(...parsedIds) === 0;
}

export function getThemeIndex(module, fallbackIndex = 0, modules = []) {
  const parsedOrder = Number(module?.order);
  if (Number.isFinite(parsedOrder)) {
    return Math.max(1, parsedOrder + 1);
  }

  const parsedId = parseModuleNumberFromId(module?.id);
  if (Number.isFinite(parsedId)) {
    const normalizeFromZero = areModuleIdsZeroBased(modules);
    return Math.max(1, normalizeFromZero ? parsedId + 1 : parsedId);
  }

  return fallbackIndex + 1;
}

export function annotateLessonsWithThemeContext(lessonsList = [], modules = []) {
  const moduleThemeIndexById = modules.reduce((acc, module, moduleIndex) => {
    acc[module.id] = getThemeIndex(module, moduleIndex, modules);
    return acc;
  }, {});

  const lessonIndexByModuleId = {};
  return [...lessonsList]
    .sort((a, b) => a.order - b.order)
    .map((lesson) => {
      lessonIndexByModuleId[lesson.moduleId] = (lessonIndexByModuleId[lesson.moduleId] || 0) + 1;
      return {
        ...lesson,
        lessonIndexInTheme: lessonIndexByModuleId[lesson.moduleId],
        themeIndex: moduleThemeIndexById[lesson.moduleId] || 1,
      };
    });
}

export function buildModulesWithIndexedLessons(modules = [], lessonsList = []) {
  const modulesWithThemeIndex = modules.map((module, moduleIndex) => ({
    ...module,
    themeIndex: getThemeIndex(module, moduleIndex, modules),
    lessons: [],
  }));
  const moduleById = new Map(modulesWithThemeIndex.map((module) => [module.id, module]));
  const lessonsWithThemeContext = annotateLessonsWithThemeContext(lessonsList, modules);

  lessonsWithThemeContext.forEach((lesson) => {
    const module = moduleById.get(lesson.moduleId);
    if (!module) return;
    module.lessons.push(lesson);
  });

  return modulesWithThemeIndex;
}

export function getScenarioVariant(userContext) {
  const experience = userContext?.experience || 'new';
  if (experience === 'seasoned') {
    return 'seasoned';
  }
  if (experience === 'growing') {
    return 'growing';
  }
  return 'new';
}

export function getGlossaryExplanation(term, userContext) {
  const knowledge = userContext?.knowledge || 'basic';
  if (knowledge === 'advanced') {
    return term.advanced || term.definition;
  }
  if (knowledge === 'basic') {
    return term.simple || term.definition;
  }
  return term.definition;
}

export function getTextScale(textSize) {
  if (textSize === 'Large') return 1.2;
  if (textSize === 'Comfort') return 1.1;
  return 1;
}

export function deriveUserContextFromOnboarding(context) {
  const experienceText = (context?.experienceAnswer || '').toLowerCase();
  const knowledgeText = (context?.knowledgeAnswer || '').toLowerCase();
  const motivationText = context?.motivationAnswer?.trim();

  let experience = defaultUserContext.experience;
  if (/(seasoned|professional|advisor|decade|advanced)/.test(experienceText)) {
    experience = 'seasoned';
  } else if (/(year|years|portfolio|stock|crypto|etf|bond|fund|index)/.test(experienceText)) {
    experience = 'growing';
  } else if (/(none|nothing|new|starting|beginner)/.test(experienceText)) {
    experience = 'new';
  }

  let knowledge = defaultUserContext.knowledge;
  if (/(advanced|expert|professional)/.test(knowledgeText)) {
    knowledge = 'advanced';
  } else if (/(intermediate|familiar|comfortable|some)/.test(knowledgeText)) {
    knowledge = 'intermediate';
  } else if (/(basic|new|beginner|none)/.test(knowledgeText)) {
    knowledge = 'basic';
  }

  return {
    experience,
    knowledge,
    motivation: motivationText || defaultUserContext.motivation,
  };
}
