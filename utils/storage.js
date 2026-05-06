import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultAuthUser,
  defaultOnboardingContext,
  defaultPreferences,
  defaultProgress,
  defaultReflections,
  defaultUserContext,
} from '../data/defaults';

const STORAGE_KEYS = {
  authUser: 'eqty_auth_user',
  onboardingContext: 'eqty_onboarding_context',
  preferences: 'eqty_preferences',
  userContext: 'eqty_user_context',
  progress: 'eqty_progress',
  reflections: 'eqty_reflections',
};

export async function loadAuthUser() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.authUser);
  if (!stored) return defaultAuthUser;
  try {
    const parsed = JSON.parse(stored);
    if (parsed === null) return null;
    return { ...defaultAuthUser, ...parsed };
  } catch (error) {
    return defaultAuthUser;
  }
}

export async function saveAuthUser(user) {
  await AsyncStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
}

export async function clearAuthUser() {
  await AsyncStorage.setItem(STORAGE_KEYS.authUser, 'null');
}

export async function loadOnboardingContext() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.onboardingContext);
  if (!stored) return defaultOnboardingContext;
  try {
    const parsed = JSON.parse(stored);
    const merged = { ...defaultOnboardingContext, ...parsed };
    const parsedAnswers = merged.onboardingAnswers || {};
    const nextAnswers = {
      q1: parsedAnswers.q1 ?? merged.experienceAnswer ?? '',
      q2: parsedAnswers.q2 ?? merged.knowledgeAnswer ?? '',
      q3: parsedAnswers.q3 ?? merged.motivationAnswer ?? '',
    };
    const hasAllAnswers = [nextAnswers.q1, nextAnswers.q2, nextAnswers.q3].every(
      (value) => value && value.trim()
    );
    return {
      ...merged,
      experienceAnswer: merged.experienceAnswer || nextAnswers.q1,
      knowledgeAnswer: merged.knowledgeAnswer || nextAnswers.q2,
      motivationAnswer: merged.motivationAnswer || nextAnswers.q3,
      onboardingAnswers: nextAnswers,
      onboardingComplete: merged.onboardingComplete || hasAllAnswers,
    };
  } catch (error) {
    return defaultOnboardingContext;
  }
}

export async function saveOnboardingContext(context) {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingContext, JSON.stringify(context));
}

export async function clearOnboardingContext() {
  await AsyncStorage.setItem(
    STORAGE_KEYS.onboardingContext,
    JSON.stringify(defaultOnboardingContext)
  );
}

export async function loadPreferences() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.preferences);
  if (!stored) return defaultPreferences;
  try {
    const parsed = JSON.parse(stored);
    return { ...defaultPreferences, ...parsed };
  } catch (error) {
    return defaultPreferences;
  }
}

export async function savePreferences(preferences) {
  await AsyncStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
}

export async function loadUserContext() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.userContext);
  return stored ? JSON.parse(stored) : defaultUserContext;
}

export async function saveUserContext(context) {
  await AsyncStorage.setItem(STORAGE_KEYS.userContext, JSON.stringify(context));
}

export async function clearUserContext() {
  await AsyncStorage.setItem(STORAGE_KEYS.userContext, JSON.stringify(defaultUserContext));
}

export async function loadProgress() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.progress);
  if (!stored) {
    return defaultProgress;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return defaultProgress;
    }
    return {
      ...defaultProgress,
      ...parsed,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : defaultProgress.completedLessonIds,
      currentLessonId: parsed.currentLessonId || defaultProgress.currentLessonId,
    };
  } catch (error) {
    return defaultProgress;
  }
}

export async function saveProgress(progress) {
  await AsyncStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}

export async function loadReflections() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.reflections);
  return stored ? JSON.parse(stored) : defaultReflections;
}

export async function saveReflections(reflections) {
  await AsyncStorage.setItem(STORAGE_KEYS.reflections, JSON.stringify(reflections));
}
