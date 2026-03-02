import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import TopTabHeader from '../components/TopTabHeader';
import { CtaButton } from '../components/Button';
import {
  getHomeCopy,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  annotateLessonsWithThemeContext,
  buildModulesWithIndexedLessons,
  getLessonStatus,
} from '../utils/helpers';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollRef = useRef(null);
  const lastScrolled = useRef(null);
  const tabBarHeight = useBottomTabBarHeight();
  const { progress, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const homeCopy = useMemo(
    () => getHomeCopy(preferences?.language),
    [preferences?.language]
  );
  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const localizedModules = useMemo(
    () => getLocalizedModules(preferences?.language),
    [preferences?.language]
  );
  const lessonsWithThemeContext = useMemo(
    () => annotateLessonsWithThemeContext(localizedLessons, localizedModules),
    [localizedLessons, localizedModules]
  );
  const totalLessons = lessonsWithThemeContext.length;
  const currentLesson =
    lessonsWithThemeContext.find((lesson) => lesson.id === progress.currentLessonId) ||
    lessonsWithThemeContext[0];
  const currentLessonIndex = lessonsWithThemeContext.findIndex(
    (lesson) => lesson.id === currentLesson?.id
  );
  const lessonPosition = currentLessonIndex >= 0 ? currentLessonIndex + 1 : 1;
  const completedLessonIds = progress.completedLessonIds || [];

  const modulesWithLessons = useMemo(
    () => buildModulesWithIndexedLessons(localizedModules, localizedLessons),
    [localizedLessons, localizedModules]
  );

  const [expandedModules, setExpandedModules] = useState(() => {
    const moduleId = currentLesson?.moduleId;
    return moduleId ? { [moduleId]: true } : {};
  });
  const [moduleOffsets, setModuleOffsets] = useState({});

  const forcedModuleId = useMemo(
    () =>
      route?.params?.moduleId ||
      getModuleIdFromTheme(route?.params?.themeId, localizedModules),
    [localizedModules, route?.params?.moduleId, route?.params?.themeId]
  );

  useEffect(() => {
    if (!forcedModuleId) return;
    setExpandedModules({ [forcedModuleId]: true });
  }, [forcedModuleId]);

  useEffect(() => {
    if (forcedModuleId) return;
    if (!currentLesson?.moduleId) return;
    setExpandedModules((prev) =>
      prev[currentLesson.moduleId] ? prev : { ...prev, [currentLesson.moduleId]: true }
    );
  }, [currentLesson?.moduleId, forcedModuleId]);

  useEffect(() => {
    if (!forcedModuleId) return;
    const offset = moduleOffsets[forcedModuleId];
    if (typeof offset !== 'number') return;
    if (lastScrolled.current === forcedModuleId) return;
    lastScrolled.current = forcedModuleId;
    scrollRef.current?.scrollTo({
      y: Math.max(0, offset - components.layout.spacing.xxl),
      animated: true,
    });
  }, [components.layout.spacing.xxl, forcedModuleId, moduleOffsets]);

  const handleModuleLayout = (moduleId) => (event) => {
    const nextOffset = event.nativeEvent.layout.y;
    setModuleOffsets((prev) =>
      prev[moduleId] === nextOffset ? prev : { ...prev, [moduleId]: nextOffset }
    );
  };

  const currentLessonTitle = currentLesson?.title || homeCopy.lessonFallbackTitle;
  const currentLessonDescription =
    currentLesson?.shortDescription || homeCopy.lessonFallbackDescription;
  const primaryCtaLabel = 'Verdergaan';

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
      scrollRef={scrollRef}
    >
      <TopTabHeader
        title="Lesoverzicht"
        subtitle={homeCopy.currentLessonLabel}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <View style={styles.currentCard}>
        <View style={styles.currentMetaRow}>
          <AppText style={styles.currentProgress}>
            {formatLessonProgress(lessonPosition, totalLessons)}
          </AppText>
          <Tag label={STATUS_LABELS.current} tone="accent" />
        </View>
        <AppText style={styles.currentTitle}>{currentLessonTitle}</AppText>
        {currentLessonDescription ? (
          <AppText style={styles.currentDescription} numberOfLines={2}>
            {currentLessonDescription}
          </AppText>
        ) : null}
        <CtaButton
          label={primaryCtaLabel}
          onPress={() =>
            navigation.navigate('LessonOverview', {
              lessonId: currentLesson?.id,
              entrySource: 'Lessons',
            })
          }
        />
      </View>

      <View style={styles.modulesHeader}>
        <SectionTitle title="Leerpad" />
      </View>

      <View style={styles.modulesList}>
        {modulesWithLessons
          .filter((module) => module.lessons.length > 0)
          .map((module) => {
            const isExpanded = expandedModules[module.id];
            const moduleCompletedCount = module.lessons.filter((lesson) =>
              completedLessonIds.includes(lesson.id)
            ).length;
            const moduleTotal = module.lessons.length;
            const moduleProgress = moduleTotal > 0 ? moduleCompletedCount / moduleTotal : 0;
            const isModuleCompleted = moduleTotal > 0 && moduleCompletedCount === moduleTotal;
            const progressLabel = formatThemeProgress(moduleCompletedCount, moduleTotal);

            return (
              <View
                key={module.id}
                style={styles.module}
                onLayout={handleModuleLayout(module.id)}
              >
                <Pressable onPress={() => toggleModule(setExpandedModules, module.id)}>
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.moduleCard,
                        isExpanded && styles.moduleCardExpanded,
                        pressed && styles.moduleCardPressed,
                      ]}
                    >
                      <View style={styles.moduleHeaderRow}>
                        <View style={styles.moduleHeaderCopy}>
                          <View style={styles.themeTitleRow}>
                            <AppText style={styles.themeLabel}>
                              {`Thema ${module.themeIndex}`}
                            </AppText>
                            <AppText style={styles.themeDot}>·</AppText>
                            <AppText style={styles.themeTitle}>{module.title}</AppText>
                          </View>
                          {isExpanded ? (
                            <AppText
                              style={styles.moduleSubtitle}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {module.description}
                            </AppText>
                          ) : null}
                          <View style={styles.moduleMetaRow}>
                            {isModuleCompleted ? (
                              <AppText style={[styles.moduleMeta, styles.moduleMetaCompleted]}>
                                {progressLabel}
                              </AppText>
                            ) : (
                              <AppText style={styles.moduleMeta}>{progressLabel}</AppText>
                            )}
                          </View>
                        </View>
                        <View style={styles.moduleHeaderRight}>
                          {isModuleCompleted ? (
                            <Tag label="Voltooid" tone="default" style={styles.moduleTag} />
                          ) : null}
                          <Ionicons
                            name="chevron-down"
                            size={components.sizes.icon.md}
                            color={colors.text.secondary}
                            style={[styles.chevron, isExpanded && styles.chevronOpen]}
                          />
                        </View>
                      </View>
                      <View style={styles.themeProgress}>
                        <ProgressBar progress={Math.min(1, Math.max(0, moduleProgress))} />
                      </View>
                    </View>
                  )}
                </Pressable>
                {isExpanded ? (
                  <View style={styles.moduleLessons}>
                    {module.lessons.map((lesson) => {
                      const status = getLessonStatus(lesson.id, progress);
                      const statusLabel = STATUS_LABELS[status] || STATUS_LABELS.upcoming;
                      const lessonNumber = lesson.lessonIndexInTheme;
                      return (
                        <Pressable
                          key={lesson.id}
                          onPress={() =>
                            navigation.navigate('LessonOverview', {
                              lessonId: lesson.id,
                              entrySource: 'Lessons',
                            })
                          }
                        >
                          {({ pressed }) => (
                            <View
                              style={[
                                styles.lessonCard,
                                isExpanded && styles.lessonCardActive,
                                pressed && styles.lessonCardPressed,
                              ]}
                            >
                              <View style={styles.lessonHeader}>
                                <AppText style={styles.lessonNumber}>
                                  {homeCopy.lessonShort(lessonNumber)}
                                </AppText>
                                <Tag
                                  label={statusLabel}
                                  tone={status === 'current' ? 'accent' : 'default'}
                                />
                              </View>
                              <View style={styles.lessonBody}>
                                <View style={styles.lessonCopy}>
                                  <AppText
                                    style={styles.lessonTitle}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                  >
                                    {lesson.title}
                                  </AppText>
                                  <AppText
                                    style={styles.lessonDescription}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                  >
                                    {lesson.shortDescription}
                                  </AppText>
                                </View>
                                <Ionicons
                                  name="chevron-forward"
                                  size={components.sizes.icon.sm}
                                  color={colors.text.secondary}
                                />
                              </View>
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })}
      </View>
    </OnboardingScreen>
  );
}

const toggleModule = (setExpandedModules, moduleId) => {
  setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
};

const getModuleIdFromTheme = (themeId, modules) => {
  if (!themeId) return null;
  if (typeof themeId === 'string' && themeId.startsWith('module_')) return themeId;
  if (typeof themeId === 'string' && themeId.startsWith('t')) {
    const index = Number(themeId.slice(1));
    if (!Number.isNaN(index)) return `module_${index}`;
  }
  if (modules?.some((module) => module.id === themeId)) return themeId;
  return null;
};

const formatLessonProgress = (position, total) => `Les ${position} / ${total}`;

const formatLessonCount = (total) => (total === 1 ? '1 les' : `${total} lessen`);

const formatThemeProgress = (completed, total) =>
  `${formatLessonCount(total)} · ${completed} afgerond`;

const STATUS_LABELS = {
  current: 'Huidig',
  upcoming: 'Aankomend',
  completed: 'Voltooid',
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight,
    },
    currentCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    currentMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.sm,
    },
    currentProgress: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    currentTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    currentDescription: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    modulesHeader: {
      marginTop: components.layout.spacing.none,
    },
    modulesList: {
      gap: components.layout.spacing.md,
    },
    module: {
      gap: components.layout.spacing.md,
    },
    moduleCard: {
      ...components.input.container,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.sm,
    },
    moduleCardExpanded: {
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    moduleCardPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    moduleHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    moduleHeaderCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
    },
    moduleHeaderRight: {
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    moduleTag: {
      alignSelf: 'flex-end',
    },
    themeTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: components.layout.spacing.xs,
    },
    themeLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    themeDot: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    themeTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flexShrink: 1,
    },
    moduleSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    moduleMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    moduleMeta: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  moduleMetaCompleted: {
    color: colors.text.secondary,
  },
  themeProgress: {
  },
    chevron: {
      transform: [{ rotate: '0deg' }],
    },
    chevronOpen: {
      transform: [{ rotate: '180deg' }],
    },
    moduleLessons: {
      gap: components.layout.spacing.md,
      alignItems: 'center',
    },
    lessonCard: {
      ...components.input.container,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      padding: components.layout.spacing.md,
      gap: components.layout.spacing.sm,
      width: components.layout.contentWidth - components.layout.spacing.xxl,
    },
    lessonCardActive: {
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    lessonCardPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    lessonHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    lessonBody: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    lessonCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
      minWidth: 0,
    },
    lessonNumber: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    lessonDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
