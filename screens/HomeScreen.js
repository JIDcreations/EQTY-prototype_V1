import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { CtaInsideButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import TopTabHeader from '../components/TopTabHeader';
import {
  formatLessonUnitLabel,
  formatThemeLessonContextLabel,
  formatThemeUnitLabel,
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

export default function HomeScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { progress, authUser, preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight, mode),
    [colors, components, tabBarHeight, mode]
  );
  const homeCopy = useMemo(() => getHomeCopy(preferences?.language), [preferences?.language]);
  const localizedModules = useMemo(
    () => getLocalizedModules(preferences?.language),
    [preferences?.language]
  );

  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const lessonsWithThemeContext = useMemo(
    () => annotateLessonsWithThemeContext(localizedLessons, localizedModules),
    [localizedLessons, localizedModules]
  );
  const completedLessonIds = progress.completedLessonIds || [];
  const modulesWithLessons = useMemo(
    () => {
      const indexedModules = buildModulesWithIndexedLessons(localizedModules, localizedLessons);
      return indexedModules.map((module) => {
        const lessons = module.lessons;
        const completedCount = lessons.filter((lesson) =>
          completedLessonIds.includes(lesson.id)
        ).length;
        return {
          ...module,
          completedCount,
          isCompleted: lessons.length > 0 && completedCount === lessons.length,
        };
      });
    },
    [completedLessonIds, localizedLessons, localizedModules]
  );
  const activeModulesWithLessons = useMemo(
    () => modulesWithLessons.filter((module) => module.lessons.length > 0 && !module.isCompleted),
    [modulesWithLessons]
  );
  const totalLessons = lessonsWithThemeContext.length;
  const progressCurrentLesson = lessonsWithThemeContext.find(
    (lesson) => lesson.id === progress.currentLessonId
  );
  const firstUpcomingLesson = lessonsWithThemeContext.find(
    (lesson) => !completedLessonIds.includes(lesson.id)
  );
  const currentLesson =
    (progressCurrentLesson && !completedLessonIds.includes(progressCurrentLesson.id)
      ? progressCurrentLesson
      : null) ||
    firstUpcomingLesson ||
    progressCurrentLesson ||
    lessonsWithThemeContext[0];
  const currentModule = modulesWithLessons.find(
    (module) => module.id === currentLesson?.moduleId
  );
  const currentLessonInTheme = currentModule?.lessons.find(
    (lesson) => lesson.id === currentLesson?.id
  );
  const currentThemeIndex = currentLesson?.themeIndex || currentModule?.themeIndex || 1;
  const currentLessonIndexInTheme =
    currentLesson?.lessonIndexInTheme || currentLessonInTheme?.lessonIndexInTheme || 1;
  const currentContextLabel = formatThemeLessonContext(
    preferences?.language,
    currentThemeIndex,
    currentLessonIndexInTheme
  );
  const completedCount = Math.min(
    completedLessonIds.filter((lessonId) =>
      lessonsWithThemeContext.some((lesson) => lesson.id === lessonId)
    ).length,
    totalLessons
  );
  const seriesProgress = totalLessons > 0 ? completedCount / totalLessons : 0;
  const displaySeriesProgress =
    seriesProgress === 0 ? 0.06 : Math.min(1, Math.max(0, seriesProgress));

  // Hero card entrance on every focus — subtle slide + fade
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(6);

  useFocusEffect(
    useCallback(() => {
      heroOpacity.value = 0;
      heroY.value = 6;
      heroOpacity.value = withTiming(1, { duration: 380 });
      heroY.value = withTiming(0, { duration: 380 });
    }, [])
  );

  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));

  const greeting = getGreeting(homeCopy);
  const displayName = getDisplayName(authUser, homeCopy);
  const lessonTitle = currentLesson?.title || homeCopy.lessonFallbackTitle;
  const lessonDescription = currentLesson?.shortDescription || homeCopy.lessonFallbackDescription;
  const primaryCtaLabel =
    completedCount > 0 ? homeCopy.continueLesson : homeCopy.startLesson;
  const heroDescription = lessonDescription;
  const greetingLine = `${greeting}, ${displayName}`;
  const [expandedModules, setExpandedModules] = useState(() => {
    const hasCurrentTheme = activeModulesWithLessons.some(
      (module) => module.id === currentLesson?.moduleId
    );
    const moduleId = hasCurrentTheme ? currentLesson?.moduleId : activeModulesWithLessons[0]?.id;
    return moduleId ? { [moduleId]: true } : {};
  });
  const quickActions = useMemo(
    () => [
      {
        id: 'resources',
        title: 'Extra info',
        subtitle: 'Sources and deeper context',
        icon: 'book-outline',
        target: 'Lessons',
        params: {
          screen: 'LessonResources',
          params: {
            entrySource: 'Home',
          },
        },
      },
      {
        id: 'videos',
        title: 'Videos',
        subtitle: 'Quick visual explainers',
        icon: 'play-circle-outline',
        target: 'Lessons',
        params: {
          screen: 'LessonVideos',
          params: {
            entrySource: 'Home',
          },
        },
      },
    ],
    []
  );

  useEffect(() => {
    const hasCurrentTheme = activeModulesWithLessons.some(
      (module) => module.id === currentLesson?.moduleId
    );
    const moduleIdToExpand = hasCurrentTheme
      ? currentLesson?.moduleId
      : activeModulesWithLessons[0]?.id;
    if (!moduleIdToExpand) return;
    setExpandedModules((prev) =>
      prev[moduleIdToExpand] ? prev : { ...prev, [moduleIdToExpand]: true }
    );
  }, [activeModulesWithLessons, currentLesson?.moduleId]);

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <View style={styles.topBlock}>
        <TopTabHeader
          title={greetingLine}
          subtitle={currentContextLabel}
          onPressProfile={() => navigation.navigate('Profile')}
        />
        <View style={styles.trajectoryBlock}>
          <View style={styles.trajectoryBar}>
            <ProgressBar progress={displaySeriesProgress} animated />
          </View>
        </View>
      </View>

      <Animated.View style={[styles.section, heroAnimStyle]}>
        <Card style={[styles.heroStack, styles.heroCard]}>
          <AppText style={styles.heroStepLabel} numberOfLines={1}>
            {currentContextLabel}
          </AppText>
          <AppText style={styles.heroTitle}>{lessonTitle}</AppText>
          {heroDescription ? (
            <AppText style={styles.heroSubtitle}>{heroDescription}</AppText>
          ) : null}
          <CtaInsideButton
            label={primaryCtaLabel}
            onPress={() =>
              navigation.navigate('Lessons', {
                screen: 'LessonOverview',
                params: {
                  lessonId: currentLesson?.id,
                  entrySource: 'Home',
                },
              })
            }
          />
        </Card>
      </Animated.View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SectionTitle title={homeCopy.nextThemesTitle} />
          <Pressable onPress={() => navigation.navigate('Lessons')}>
            <AppText style={styles.viewAll}>Bekijk alles</AppText>
          </Pressable>
        </View>
        <View style={styles.themeList}>
          {activeModulesWithLessons
            .slice(0, 3)
            .map((module) => {
              const isExpanded = !!expandedModules[module.id];
              const moduleCompletedCount = module.completedCount;
              const moduleTotal = module.lessons.length;
              const moduleProgress = moduleTotal > 0 ? moduleCompletedCount / moduleTotal : 0;
              const isModuleCompleted = module.isCompleted;
              const progressLabel = formatThemeProgress(moduleCompletedCount, moduleTotal);

              return (
                <View key={module.id} style={styles.module}>
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
                                {formatThemeUnitLabel(preferences?.language, module.themeIndex)}
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
                              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                              size={components.sizes.icon.md}
                              color={colors.text.secondary}
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
                        const lessonContextLabel = formatLessonUnitLabel(
                          preferences?.language,
                          lesson.lessonIndexInTheme
                        );
                        return (
                          <Pressable
                            key={lesson.id}
                            onPress={() =>
                              navigation.navigate('Lessons', {
                                screen: 'LessonOverview',
                                params: {
                                  lessonId: lesson.id,
                                  entrySource: 'Home',
                                },
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
                                    {lessonContextLabel}
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
      </View>

      <View style={styles.section}>
        <SectionTitle title="Hulpmiddelen" />
        <View style={styles.actionRow}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => navigation.navigate(action.target, action.params)}
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
            >
              <View style={styles.actionCard}>
                <Ionicons
                  name={action.icon}
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
                <AppText style={styles.actionTitle}>{action.title}</AppText>
                <AppText style={styles.actionSubtitle}>{action.subtitle}</AppText>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight, mode) => {
  const isLight = mode === 'light';
  return StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.md,
    },
    topBlock: {
      gap: components.layout.spacing.md,
    },
    section: {
      gap: components.layout.spacing.md,
    },
    trajectoryBlock: {
      gap: components.layout.spacing.none,
    },
    heroStack: {
      width: '100%',
      maxWidth: components.layout.contentWidth,
      alignSelf: 'center',
    },
    heroCard: {
      padding: components.layout.spacing.xxl,
      gap: components.layout.spacing.lg,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      borderWidth: components.borderWidth.thin,
      borderColor: isLight
        ? colors.ui.divider
        : toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    heroStepLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
      maxWidth: '100%',
    },
    heroTitle: {
      ...typography.styles.h1,
      color: colors.text.primary,
      flexShrink: 1,
      maxWidth: '100%',
      width: '100%',
    },
    heroSubtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
      flexShrink: 1,
      maxWidth: '100%',
      width: '100%',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    viewAll: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    themeList: {
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
      ...typography.styles.stepLabel,
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
    actionRow: {
      flexDirection: 'row',
      gap: components.layout.spacing.md,
    },
    actionItem: {
      flex: 1,
      borderRadius: components.radius.card,
    },
    actionItemPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    actionCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: isLight
        ? colors.ui.divider
        : toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.sm,
      alignItems: 'flex-start',
      minHeight: components.sizes.list.minItemHeight,
    },
    actionTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    actionSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    trajectoryBar: {
    },
  });
};

const getGreeting = (homeCopy) => homeCopy.greetingHi || 'Hi';

const toggleModule = (setExpandedModules, moduleId) => {
  setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
};

const formatLessonCount = (count) => (count === 1 ? '1 les' : `${count} lessen`);

const formatThemeLessonContext = (language, themeIndex, lessonIndexInTheme) => {
  return formatThemeLessonContextLabel(language, themeIndex, lessonIndexInTheme, 'dot');
};

const formatThemeProgress = (completed, total) =>
  `${formatLessonCount(total)} · ${completed} afgerond`;

const STATUS_LABELS = {
  current: 'Huidig',
  upcoming: 'Aankomend',
  completed: 'Voltooid',
};

const getDisplayName = (authUser, homeCopy) => {
  const raw =
    authUser?.name ||
    authUser?.username ||
    (authUser?.email ? authUser.email.split('@')[0] : '');
  const cleaned = raw.trim().replace(/[_\-.]+/g, ' ');
  const first = cleaned.split(' ').filter(Boolean)[0];
  if (!first) return homeCopy.defaultName;
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
