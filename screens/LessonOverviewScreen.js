import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import AppText from '../components/AppText';
import { CtaButton } from '../components/Button';
import Card from '../components/Card';
import ScreenBackground from '../components/ScreenBackground';
import { useApp } from '../utils/AppContext';
import {
  getLessonContent,
  getLessonOverviewCopy,
  getLocalizedLessons,
  getLocalizedModules,
  formatLessonModuleLabel,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import {
  annotateLessonsWithThemeContext,
  getLessonStatus,
  isPrototypeLessonAvailable,
} from '../utils/helpers';

const FALLBACK_STEP_COUNT = 6;

export default function LessonOverviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tabBarHeight = useBottomTabBarHeight();
  const { lessonId, entrySource } = route.params || {};
  const { preferences, progress } = useApp();
  const { colors, components } = useTheme();
  const lockedTapStateRef = useRef({ count: 0, timestamp: 0 });
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(8);
  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(14);
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(16);

  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );

  const overviewCopy = useMemo(
    () => getLessonOverviewCopy(preferences?.language),
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

  const lesson = lessonsWithThemeContext.find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <ScreenBackground variant="bg3">
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons
                  name="chevron-back"
                  size={components.sizes.icon.lg}
                  color={colors.text.primary}
                />
              </Pressable>
              <AppText style={styles.fallbackTitle}>Lesson not found</AppText>
            </View>
          </ScrollView>
        </View>
      </ScreenBackground>
    );
  }

  const content = getLessonContent(lesson.id, preferences?.language);
  const lessonStatus = getLessonStatus(lesson.id, progress);
  const moduleLabel = formatLessonModuleLabel(
    preferences?.language,
    lesson.themeIndex,
    lesson.lessonIndexInTheme
  );
  const estimatedMinutes = estimateLessonMinutes(content);
  const hook = getLessonHook(overviewCopy, lesson, content);
  const outcomes = getLessonOutcomes(overviewCopy, lesson.id);
  const pointsLabel = overviewCopy.lessonPointsLabel || overviewCopy.outcomesLabel;
  const metaChips = getLessonMetaChips(overviewCopy, lesson.id, estimatedMinutes);

  const isLessonLocked = lessonStatus === 'locked' || !isPrototypeLessonAvailable(lesson.id);

  const startLesson = useCallback(() => {
    navigation.navigate('LessonStep', {
      lessonId: lesson.id,
      step: 1,
      entrySource,
    });
  }, [entrySource, lesson.id, navigation]);

  const handleStartPress = useCallback(() => {
    if (!isLessonLocked) {
      startLesson();
      return;
    }

    if (!__DEV__ || !isPrototypeLessonAvailable(lesson.id)) {
      return;
    }

    const now = Date.now();
    const nextCount =
      now - lockedTapStateRef.current.timestamp < 700
        ? lockedTapStateRef.current.count + 1
        : 1;

    if (nextCount >= 3) {
      lockedTapStateRef.current = { count: 0, timestamp: 0 };
      startLesson();
      return;
    }

    lockedTapStateRef.current = {
      count: nextCount,
      timestamp: now,
    };
  }, [isLessonLocked, lesson.id, startLesson]);

  useFocusEffect(
    useCallback(() => {
      heroOpacity.value = 0;
      heroY.value = 8;
      cardOpacity.value = 0;
      cardY.value = 14;
      ctaOpacity.value = 0;
      ctaY.value = 16;
      heroOpacity.value = withTiming(1, { duration: 320 });
      heroY.value = withTiming(0, { duration: 320 });
      cardOpacity.value = withDelay(110, withTiming(1, { duration: 300 }));
      cardY.value = withDelay(110, withTiming(0, { duration: 300 }));
      ctaOpacity.value = withDelay(180, withTiming(1, { duration: 280 }));
      ctaY.value = withDelay(180, withTiming(0, { duration: 280 }));
    }, [])
  );

  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));
  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));
  const ctaAnimStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  return (
    <ScreenBackground variant="bg3">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons
                name="chevron-back"
                size={components.sizes.icon.lg}
                color={colors.text.primary}
              />
            </Pressable>
            <Animated.View
              style={[
                styles.heroContent,
                lesson.id === 'lesson_0' && styles.heroContentLessonOne,
                heroAnimStyle,
              ]}
            >
              <View style={styles.labelAndTitle}>
                <AppText
                  style={[
                    styles.moduleLabel,
                    lesson.id === 'lesson_0' && styles.moduleLabelPrimary,
                  ]}
                >
                  {moduleLabel}
                </AppText>
                <View style={styles.titleBlock}>
                  <AppText
                    style={styles.title}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.9}
                  >
                    {lesson.title}
                  </AppText>
                  <AppText style={styles.hook}>{hook}</AppText>
                </View>
              </View>
              <View style={styles.metaChipRow}>
                {metaChips.map((chipText) => (
                  <View key={chipText} style={styles.metaChip}>
                    <AppText style={styles.metaChipText}>{chipText}</AppText>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>

          <Animated.View style={cardAnimStyle}>
            <Card>
              <View style={styles.outcomeSection}>
                <AppText style={styles.outcomeLabel}>{pointsLabel}</AppText>
                <View style={styles.outcomeList}>
                  {outcomes.map((line, index) => (
                    <View key={`${index}-${line}`} style={styles.outcomeItemRow}>
                      <AppText style={styles.outcomeBullet}>•</AppText>
                      <AppText style={styles.outcomeText}>{line}</AppText>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>

        <Animated.View style={[styles.ctaDock, ctaAnimStyle]}>
          <CtaButton
            label={isLessonLocked ? overviewCopy.lockedLesson : overviewCopy.startLesson}
            disabled={isLessonLocked && !isPrototypeLessonAvailable(lesson.id)}
            onPress={handleStartPress}
          />
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      ...components.screen.containerScroll,
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.sm,
      gap: components.layout.spacing.xxl,
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.sizes.input.minHeight +
        components.layout.spacing.xxl,
    },
    hero: {
      maxWidth: components.sizes.screen.maxContentWidth,
    },
    heroContent: {
      marginTop: components.layout.spacing.xxl,
      gap: components.layout.spacing.lg,
    },
    heroContentLessonOne: {
      marginTop: 12,
    },
    labelAndTitle: {
      gap: components.layout.spacing.xs,
    },
    titleBlock: {
      gap: components.layout.spacing.sm,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fallbackTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
      marginTop: components.layout.spacing.xl,
    },
    moduleLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    moduleLabelPrimary: {
      color: colors.text.primary,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    hook: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    outcomeSection: {
      gap: components.layout.spacing.md,
    },
    outcomeLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    outcomeList: {
      gap: components.layout.spacing.sm,
    },
    outcomeItemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: components.layout.spacing.xs,
    },
    outcomeBullet: {
      ...typography.styles.body,
      color: colors.text.primary,
      lineHeight: typography.styles.body.lineHeight,
    },
    outcomeText: {
      ...typography.styles.body,
      color: colors.text.primary,
      flex: 1,
    },
    metaChipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
      flexWrap: 'wrap',
      maxWidth: components.sizes.screen.maxContentWidth,
    },
    metaChip: {
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      paddingVertical: components.layout.spacing.xs,
      paddingHorizontal: components.layout.spacing.md,
    },
    metaChipText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    ctaDock: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.spacing.sm,
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.md,
    },
  });

const getLessonHook = (overviewCopy, lesson, content) =>
  overviewCopy.lessonHooks?.[lesson.id] ||
  content?.steps?.concept?.visualHint ||
  lesson.shortDescription ||
  overviewCopy.defaultHook;

const getLessonOutcomes = (overviewCopy, lessonId) =>
  overviewCopy.lessonOutcomes?.[lessonId] || overviewCopy.defaultOutcomes;

const getLessonMetaChips = (overviewCopy, lessonId, estimatedMinutes) =>
  overviewCopy.lessonMetaChips?.[lessonId] || [
    overviewCopy.minutesLabel(estimatedMinutes),
    overviewCopy.readinessLabel,
  ];

const estimateLessonMinutes = (content) => {
  const stepCount = Object.keys(content?.steps || {}).length || FALLBACK_STEP_COUNT;
  return Math.max(5, stepCount + 2);
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
