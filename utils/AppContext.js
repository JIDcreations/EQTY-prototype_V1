import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  defaultAuthUser,
  defaultOnboardingContext,
  defaultPreferences,
  defaultProgress,
  defaultUserContext,
} from '../data/defaults';
import {
  deriveUserContextFromOnboarding,
  getNextLessonId,
  getPrototypeLessonIdsUpTo,
  getTextScale,
} from './helpers';
import {
  clearAuthUser,
  clearOnboardingContext,
  clearUserContext,
  loadAuthUser,
  loadOnboardingContext,
  loadPreferences,
  loadProgress,
  loadReflections,
  loadUserContext,
  saveAuthUser,
  saveOnboardingContext,
  savePreferences,
  saveProgress,
  saveReflections,
  saveUserContext,
} from './storage';

const AppContext = createContext(null);
const RESET_PROGRESS_ON_LAUNCH = true;

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(defaultAuthUser);
  const [onboardingContext, setOnboardingContext] = useState(defaultOnboardingContext);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [userContext, setUserContext] = useState(defaultUserContext);
  const [progress, setProgress] = useState(defaultProgress);
  const [reflections, setReflections] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const authUserRef = useRef(defaultAuthUser);

  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      const [
        storedAuthUser,
        storedOnboarding,
        storedPreferences,
        storedContext,
        storedProgress,
        storedReflections,
      ] = await Promise.all([
        loadAuthUser(),
        loadOnboardingContext(),
        loadPreferences(),
        loadUserContext(),
        loadProgress(),
        loadReflections(),
      ]);
      if (isMounted) {
        authUserRef.current = storedAuthUser;
        setAuthUser(storedAuthUser);
        setOnboardingContext(storedOnboarding);
        setPreferences(storedPreferences);
        setUserContext(storedContext);
        const nextProgress = RESET_PROGRESS_ON_LAUNCH ? defaultProgress : storedProgress;
        const nextReflections = RESET_PROGRESS_ON_LAUNCH ? [] : storedReflections;
        setProgress(nextProgress);
        setReflections(nextReflections);
        if (RESET_PROGRESS_ON_LAUNCH) {
          await saveProgress(nextProgress);
          await saveReflections(nextReflections);
        }
        setIsReady(true);
      }
    }
    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateAuthUser = async (updates) => {
    const base = authUserRef.current || defaultAuthUser;
    const next = { ...base, ...updates };
    authUserRef.current = next;
    setAuthUser(next);
    await saveAuthUser(next);
  };

  const resetOnboardingState = async () => {
    setOnboardingContext(defaultOnboardingContext);
    setUserContext(defaultUserContext);
    await Promise.all([clearOnboardingContext(), clearUserContext()]);
  };

  const logOut = async () => {
    authUserRef.current = null;
    setAuthUser(null);
    await Promise.all([clearAuthUser(), resetOnboardingState()]);
  };

  const updateOnboardingContext = async (updates) => {
    const nextBase = { ...onboardingContext, ...updates };
    const nextAnswers = {
      q1:
        updates?.onboardingAnswers?.q1 ??
        updates?.experienceAnswer ??
        nextBase?.experienceAnswer ??
        '',
      q2:
        updates?.onboardingAnswers?.q2 ??
        updates?.knowledgeAnswer ??
        nextBase?.knowledgeAnswer ??
        '',
      q3:
        updates?.onboardingAnswers?.q3 ??
        updates?.motivationAnswer ??
        nextBase?.motivationAnswer ??
        '',
    };
    const next = {
      ...nextBase,
      onboardingAnswers: nextAnswers,
      experienceAnswer: nextBase?.experienceAnswer || nextAnswers.q1,
      knowledgeAnswer: nextBase?.knowledgeAnswer || nextAnswers.q2,
      motivationAnswer: nextBase?.motivationAnswer || nextAnswers.q3,
    };
    setOnboardingContext(next);
    await saveOnboardingContext(next);
    const derived = deriveUserContextFromOnboarding(next);
    await updateUserContext(derived);
  };

  const updatePreferences = async (updates) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    await savePreferences(next);
  };

  const updateUserContext = async (updates) => {
    const next = { ...userContext, ...updates };
    setUserContext(next);
    await saveUserContext(next);
  };

  const updateProgress = async (next) => {
    setProgress(next);
    await saveProgress(next);
  };

  const addReflection = async (text, lessonId, response = null) => {
    const entry = {
      id: `${lessonId}_${Date.now()}`,
      lessonId,
      text,
      response,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...reflections];
    setReflections(next);
    await saveReflections(next);
  };

  const unlockPremium = () => {
    setIsPremium(true);
  };

  const completeLesson = async (lessonId) => {
    const prototypeLessonIds = getPrototypeLessonIdsUpTo(lessonId);
    const completed = Array.from(
      new Set([
        ...progress.completedLessonIds,
        ...(prototypeLessonIds.length > 0 ? prototypeLessonIds : [lessonId]),
      ])
    );
    // Deep dive lessons do not advance the core lesson pointer
    const isDeepDive = typeof lessonId === 'string' && lessonId.startsWith('deep_');
    const nextLessonId = isDeepDive ? progress.currentLessonId : getNextLessonId(lessonId);
    const nextProgress = {
      completedLessonIds: completed,
      currentLessonId: nextLessonId,
    };
    await updateProgress(nextProgress);
    return nextProgress;
  };

  const value = useMemo(
    () => ({
      authUser,
      onboardingContext,
      preferences,
      userContext,
      progress,
      reflections,
      isPremium,
      isReady,
      textScale: getTextScale(preferences?.textSize),
      updateAuthUser,
      updateOnboardingContext,
      resetOnboardingState,
      updatePreferences,
      logOut,
      updateUserContext,
      updateProgress,
      addReflection,
      completeLesson,
      unlockPremium,
    }),
    [
      authUser,
      onboardingContext,
      preferences,
      userContext,
      progress,
      reflections,
      isPremium,
      isReady,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
