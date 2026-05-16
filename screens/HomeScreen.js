import React, { useCallback, useMemo, useState } from 'react';
import { InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Animated, {
  FadeInDown,
  withDelay,
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
import TopTabHeader from '../components/TopTabHeader';
import {
  formatThemeLessonContextLabel,
  getDeepDiveCopy,
  getHomeCopy,
  getHomeLessonCardCopy,
  getLocaleKey,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  annotateLessonsWithThemeContext,
  buildModulesWithIndexedLessons,
  isPrototypeLessonAvailable,
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
  const deepDiveCopy = useMemo(
    () => getDeepDiveCopy(preferences?.language),
    [preferences?.language]
  );
  const [isPrimaryOpening, setIsPrimaryOpening] = useState(false);
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
  const prototypeLessons = useMemo(
    () => lessonsWithThemeContext.filter((lesson) => isPrototypeLessonAvailable(lesson.id)),
    [lessonsWithThemeContext]
  );
  const completedLessonIds = progress.completedLessonIds || [];
  const modulesWithLessons = useMemo(
    () => {
      const indexedModules = buildModulesWithIndexedLessons(localizedModules, localizedLessons);
      return indexedModules.map((module) => {
        const lessons = module.lessons.filter((lesson) => isPrototypeLessonAvailable(lesson.id));
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
  const totalLessons = prototypeLessons.length;
  const progressCurrentLesson = prototypeLessons.find(
    (lesson) => lesson.id === progress.currentLessonId
  );
  const firstUpcomingLesson = prototypeLessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id)
  );
  const currentLesson =
    (progressCurrentLesson && !completedLessonIds.includes(progressCurrentLesson.id)
      ? progressCurrentLesson
      : null) ||
    firstUpcomingLesson ||
    progressCurrentLesson ||
    prototypeLessons[0];
  const currentModule = modulesWithLessons.find(
    (module) => module.id === currentLesson?.moduleId
  );
  const currentLessonInTheme = currentModule?.lessons.find(
    (lesson) => lesson.id === currentLesson?.id
  );
  const isDutch = getLocaleKey(preferences?.language) === 'nl';
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
      prototypeLessons.some((lesson) => lesson.id === lessonId)
    ).length,
    totalLessons
  );
  const seriesProgress = totalLessons > 0 ? completedCount / totalLessons : 0;
  const displaySeriesProgress =
    seriesProgress === 0 ? 0.06 : Math.min(1, Math.max(0, seriesProgress));
  const insightCard = useMemo(
    () =>
      getHomeLessonCardCopy(
        currentLesson?.id,
        preferences?.language,
        currentThemeIndex,
        currentLessonIndexInTheme,
        formatHomeThemeLessonContext(
          preferences?.language,
          currentThemeIndex,
          currentLessonIndexInTheme
        )
      ),
    [currentLesson?.id, currentLessonIndexInTheme, currentThemeIndex, preferences?.language]
  );

  // Hero card entrance on every focus — subtle slide + fade
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(6);
  const insightOpacity = useSharedValue(0);
  const insightY = useSharedValue(12);
  const actionsOpacity = useSharedValue(0);
  const actionsY = useSharedValue(16);

  useFocusEffect(
    useCallback(() => {
      heroOpacity.value = 0;
      heroY.value = 6;
      insightOpacity.value = 0;
      insightY.value = 12;
      actionsOpacity.value = 0;
      actionsY.value = 16;
      heroOpacity.value = withTiming(1, { duration: 380 });
      heroY.value = withTiming(0, { duration: 380 });
      insightOpacity.value = withDelay(120, withTiming(1, { duration: 320 }));
      insightY.value = withDelay(120, withTiming(0, { duration: 320 }));
      actionsOpacity.value = withDelay(210, withTiming(1, { duration: 320 }));
      actionsY.value = withDelay(210, withTiming(0, { duration: 320 }));
    }, [])
  );

  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));
  const insightAnimStyle = useAnimatedStyle(() => ({
    opacity: insightOpacity.value,
    transform: [{ translateY: insightY.value }],
  }));
  const actionsAnimStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsY.value }],
  }));

  const greeting = getGreeting(homeCopy);
  const displayName = getDisplayName(authUser, homeCopy);
  const lessonTitle = currentLesson?.title || homeCopy.lessonFallbackTitle;
  const lessonDescription = currentLesson?.shortDescription || homeCopy.lessonFallbackDescription;
  const hasCompletedAllLessons = totalLessons > 0 && completedCount >= totalLessons;
  const primaryCtaLabel = hasCompletedAllLessons
    ? homeCopy.deepenInterests
    : completedCount > 0
      ? homeCopy.continueLesson
      : homeCopy.startLesson;
  const heroStepLabel = hasCompletedAllLessons
    ? (deepDiveCopy.sectionTitle || '').replace(/\.$/, '')
    : currentContextLabel;
  const heroTitle = hasCompletedAllLessons ? homeCopy.deepenInterests : lessonTitle;
  const heroDescription = hasCompletedAllLessons
    ? deepDiveCopy.sectionSubtitle
    : lessonDescription;
  const headerSubtitle = hasCompletedAllLessons
    ? homeCopy.postCourseStepLabel
    : currentContextLabel;
  const greetingLine = `${greeting}, ${displayName}`;
  const openingLabel = isDutch ? 'Openen...' : 'Opening...';
  const navigateToLessonOverview = useCallback((lessonId) => {
    if (!lessonId) {
      navigation.navigate('Lessons');
      return;
    }

    navigation.navigate('Lessons');
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        navigation.navigate('Lessons', {
          screen: 'LessonOverview',
          params: {
            lessonId,
            entrySource: 'Home',
          },
        });
      });
    });
  }, [navigation]);

  const handlePrimaryCtaPress = useCallback(() => {
    if (isPrimaryOpening) return;
    setIsPrimaryOpening(true);
    setTimeout(() => {
      setIsPrimaryOpening(false);
      if (hasCompletedAllLessons) {
        navigation.navigate('Lessons', {
          screen: 'LessonsHome',
          params: {
            scrollToSection: 'deepDive',
          },
        });
        return;
      }

      navigateToLessonOverview(currentLesson?.id);
    }, 140);
  }, [currentLesson?.id, hasCompletedAllLessons, isPrimaryOpening, navigateToLessonOverview, navigation]);
  const quickActions = useMemo(
    () => [
      {
        id: 'resources',
        title: 'Bronnen',
        subtitle: isDutch ? 'Bronnen en extra context' : 'Sources and deeper context',
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
        title: isDutch ? "Video's" : 'Videos',
        subtitle: isDutch ? 'Korte visuele\nuitleg' : 'Quick visual explainers',
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
    [isDutch]
  );

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <View style={styles.topBlock}>
        <TopTabHeader
          title={greetingLine}
          subtitle={headerSubtitle}
          subtitleStyle={styles.headerStepLabel}
          onPressProfile={() => navigation.navigate('Profile')}
        />
        <View style={styles.trajectoryBlock}>
          <View style={styles.trajectoryBar}>
            <ProgressBar progress={displaySeriesProgress} animated />
          </View>
        </View>
      </View>

      <View style={styles.heroGroup}>
        <Animated.View style={[styles.section, heroAnimStyle]}>
          <Card style={[styles.heroStack, styles.heroCard]}>
            <View style={styles.heroTextBlock}>
              <AppText style={styles.heroStepLabel} numberOfLines={1}>
                {heroStepLabel}
              </AppText>
              <View style={styles.heroTitleBlock}>
                <AppText style={styles.heroTitle}>{heroTitle}</AppText>
                {heroDescription ? (
                  <AppText style={styles.heroSubtitle}>{heroDescription}</AppText>
                ) : null}
              </View>
            </View>
            <CtaInsideButton
              label={isPrimaryOpening ? openingLabel : primaryCtaLabel}
              onPress={handlePrimaryCtaPress}
            />
          </Card>
        </Animated.View>

        {insightCard ? (
          <Animated.View style={[styles.section, insightAnimStyle]}>
            <Card style={[styles.heroStack, styles.insightCard]}>
              <AppText style={styles.insightLabel} numberOfLines={1}>
                {insightCard.label}
              </AppText>
              <AppText style={styles.insightTitle}>{insightCard.title}</AppText>
              <AppText style={styles.insightBody}>
                {insightCard.bodyBefore}
                <Text style={styles.insightBodyAccent}>{insightCard.bodyHighlight}</Text>
                {insightCard.bodyAfter}
              </AppText>
            </Card>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View style={[styles.section, actionsAnimStyle]}>
        <SectionTitle title="Hulpmiddelen" />
        <View style={styles.actionRow}>
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={FadeInDown.duration(260).delay(180 + index * 70)}
              style={styles.actionItem}
            >
              <Pressable
                onPress={() => navigation.navigate(action.target, action.params)}
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.actionItemPressed,
                ]}
              >
                <Ionicons
                  name={action.icon}
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
                <AppText style={styles.actionTitle}>{action.title}</AppText>
                <AppText style={styles.actionSubtitle}>{action.subtitle}</AppText>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight, mode) => {
  const isLight = mode === 'light';
  return StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.xxl,
    },
    topBlock: {
      gap: components.layout.spacing.md,
    },
    heroGroup: {
      gap: components.layout.spacing.xl,
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
      paddingVertical: components.layout.spacing.xxl,
      paddingHorizontal: components.layout.spacing.lg,
      gap: components.layout.spacing.xl,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      borderWidth: components.borderWidth.thin,
      borderColor: isLight
        ? colors.ui.divider
        : toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    heroTextBlock: {
      gap: 8,
    },
    heroTitleBlock: {
      gap: components.layout.spacing.sm,
    },
    heroStepLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
      maxWidth: '100%',
    },
    headerStepLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
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
    insightCard: {
      gap: components.layout.spacing.sm,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderWidth: components.borderWidth.thin,
      borderColor: isLight
        ? colors.ui.divider
        : toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    insightLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    insightTitle: {
      ...components.card.title,
      color: colors.text.primary,
    },
    insightBody: {
      ...components.card.body,
      color: colors.text.secondary,
    },
    insightBodyAccent: {
      ...typography.styles.body,
      color: colors.text.primary,
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
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      borderColor: toRgba(colors.text.primary, colors.opacity.stroke),
      transform: [{ scale: components.transforms.scalePressed }],
    },
    actionCard: {
      ...components.input.container,
      borderRadius: components.radius.card,
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

const formatThemeLessonContext = (language, themeIndex, lessonIndexInTheme) => {
  return formatThemeLessonContextLabel(language, themeIndex, lessonIndexInTheme, 'dot');
};

const formatHomeThemeLessonContext = (language, themeIndex, lessonIndexInTheme) => {
  return formatThemeLessonContextLabel(language, themeIndex, lessonIndexInTheme, 'dot')
    .split(' · ')
    .map((segment) => {
      if (!segment) return segment;
      return segment.charAt(0) + segment.slice(1).toLowerCase();
    })
    .join(' · ');
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
