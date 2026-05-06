import React, { useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import OnboardingScreen from '../components/OnboardingScreen';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonContent, getLessonStepCopy, getDeepDiveCopy, getLocaleKey } from '../utils/localization';
import { getLastCoreLessonId } from '../utils/helpers';
import { getDeepDiveLesson } from '../data/deepDives';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function LessonSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || {};
  const { preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  const deepDiveCopy = useMemo(
    () => getDeepDiveCopy(preferences?.language),
    [preferences?.language]
  );
  const content = getLessonContent(lessonId, preferences?.language);
  const locale = getLocaleKey(preferences?.language);
  const lessonTitle = content?.title || copy.lessonSuccess.fallbackTitle;
  const isIntroLesson = lessonId === 'lesson_0';
  const isDeepDiveLesson = typeof lessonId === 'string' && lessonId.startsWith('deep_');
  const isLastCoreLesson = lessonId === getLastCoreLessonId();
  const deepLesson = isDeepDiveLesson ? getDeepDiveLesson(lessonId) : null;
  const subtitle = isDeepDiveLesson
    ? (deepLesson?.shortDescription || lessonTitle)
    : isIntroLesson
      ? copy.lessonSuccess.introSubtitle
      : lessonId === 'lesson_2' && locale === 'nl'
        ? 'Je hebt de les ‘Soorten beleggingsdoelen’ afgerond.'
      : lessonId === 'lesson_1' && locale === 'nl'
        ? 'Je hebt de les ‘Waarom wil ik beleggen?’ afgerond.'
      : copy.lessonSuccess.subtitle
        ? copy.lessonSuccess.subtitle(lessonTitle)
        : '';
  const detail = isDeepDiveLesson
    ? deepDiveCopy.headerSubtitle
    : isLastCoreLesson
      ? deepDiveCopy.finalLessonSubtitle
      : isIntroLesson
        ? copy.lessonSuccess.introDetail
        : lessonId === 'lesson_2' && locale === 'nl'
          ? 'Ga verder en ontdek hoe je dit toepast in de volgende lessen.'
        : copy.lessonSuccess.detail;

  // Entrance animations — staggered, spring badge, eased text
  const badgeScale = useSharedValue(0.4);
  const badgeOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const labelY = useSharedValue(10);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(14);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(10);
  const detailOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);
  const footerY = useSharedValue(32);

  const runAnimation = useCallback(() => {
    badgeScale.value = 0.4;
    badgeOpacity.value = 0;
    labelOpacity.value = 0;
    labelY.value = 10;
    titleOpacity.value = 0;
    titleY.value = 14;
    subtitleOpacity.value = 0;
    subtitleY.value = 10;
    detailOpacity.value = 0;
    footerOpacity.value = 0;
    footerY.value = 32;

    badgeOpacity.value = withDelay(60, withTiming(1, { duration: 200 }));
    badgeScale.value = withDelay(60, withSpring(1, { damping: 13, stiffness: 160 }));
    labelOpacity.value = withDelay(300, withTiming(1, { duration: 260 }));
    labelY.value = withDelay(300, withTiming(0, { duration: 260 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 280 }));
    titleY.value = withDelay(400, withTiming(0, { duration: 280 }));
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 260 }));
    subtitleY.value = withDelay(500, withTiming(0, { duration: 260 }));
    detailOpacity.value = withDelay(660, withTiming(1, { duration: 280 }));
    footerOpacity.value = withDelay(720, withTiming(1, { duration: 300 }));
    footerY.value = withDelay(720, withTiming(0, { duration: 300 }));
  }, []);

  useEffect(() => {
    runAnimation();
  }, []);

  const badgeAnimStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));
  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ translateY: labelY.value }],
  }));
  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subtitleAnimStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));
  const detailAnimStyle = useAnimatedStyle(() => ({
    opacity: detailOpacity.value,
  }));
  const footerAnimStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: footerY.value }],
  }));

  const handleReturnHome = () => {
    const parent = navigation.getParent();
    navigation.popToTop();
    if (parent) {
      parent.navigate('Home');
    } else {
      navigation.navigate('Home');
    }
  };

  const handleGoToLessonsOverview = () => {
    // Pop to the top of the lessons stack — the deep dive section is right there
    navigation.popToTop();
  };

  const handleBackToTrack = () => {
    if (deepLesson) {
      navigation.navigate('DeepDive', { trackId: deepLesson.trackId });
    } else {
      navigation.popToTop();
    }
  };

  return (
    <OnboardingScreen
      backgroundVariant={mode === 'dark' ? 'bg2' : 'whiteNoBlur'}
      showGlow={false}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.content}>

          {/* Achievement badge */}
          <Animated.View style={[styles.badgeWrapper, badgeAnimStyle]}>
            <View
              style={[
                styles.badgeGlow,
                { backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint) },
              ]}
            />
            <View style={[styles.badge, { backgroundColor: colors.accent.primary }]}>
              <AppText style={[styles.checkmark, { color: colors.text.onAccent }]}>✓</AppText>
            </View>
          </Animated.View>

          {/* "LESSON COMPLETE" tag */}
          <Animated.View style={labelAnimStyle}>
            <View
              style={[
                styles.completedTag,
                { backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint) },
              ]}
            >
              <AppText
                style={[
                  styles.completedLabel,
                  { color: mode === 'light' ? colors.text.secondary : colors.accent.primary },
                ]}
              >
                {copy.lessonSuccess.completedLabel}
              </AppText>
            </View>
          </Animated.View>

          {/* Titles group */}
          <View style={styles.titlesGroup}>
            <Animated.View style={titleAnimStyle}>
              <AppText style={[styles.mainTitle, { color: colors.text.primary }]}>
                {copy.lessonSuccess.congrats}
              </AppText>
            </Animated.View>
          </View>

          {/* Detail */}
          <Animated.View style={[styles.detailGroup, detailAnimStyle]}>
            <Animated.View style={subtitleAnimStyle}>
              <AppText
                style={[
                  styles.lessonSubtitle,
                  { color: isIntroLesson ? colors.text.primary : colors.text.secondary },
                ]}
              >
                {subtitle}
              </AppText>
            </Animated.View>
            <View
              style={[
                styles.divider,
                { backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke) },
              ]}
            />
            <AppText style={[styles.detail, { color: colors.text.secondary }]}>{detail}</AppText>
          </Animated.View>

        </View>

        {/* Footer CTA */}
        <Animated.View style={[styles.footer, footerAnimStyle]}>
          {/* DEV ONLY — remove before final */}
          <Pressable style={styles.replayButton} onPress={runAnimation}>
            <AppText style={[styles.replayLabel, { color: colors.text.secondary }]}>↺ Replay</AppText>
          </Pressable>

          {isDeepDiveLesson ? (
            <>
              <PrimaryButton label={deepDiveCopy.deepDiveCta} onPress={handleBackToTrack} />
              <Pressable style={styles.secondaryAction} onPress={handleReturnHome}>
                <AppText style={[styles.secondaryActionLabel, { color: colors.text.secondary }]}>
                  {copy.lessonSuccess.cta}
                </AppText>
              </Pressable>
            </>
          ) : isLastCoreLesson ? (
            <>
              <PrimaryButton label={deepDiveCopy.finalLessonCta} onPress={handleGoToLessonsOverview} />
              <Pressable style={styles.secondaryAction} onPress={handleReturnHome}>
                <AppText style={[styles.secondaryActionLabel, { color: colors.text.secondary }]}>
                  {copy.lessonSuccess.cta}
                </AppText>
              </Pressable>
            </>
          ) : (
            <PrimaryButton label={copy.lessonSuccess.cta} onPress={handleReturnHome} />
          )}
        </Animated.View>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    screen: {
      paddingBottom: tabBarHeight,
    },
    container: {
      flex: 1,
      paddingBottom: components.layout.spacing.xl,
      paddingTop: components.layout.spacing.xl,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: components.layout.spacing.xl,
    },

    // Badge
    badgeWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    badgeGlow: {
      position: 'absolute',
      width: 108,
      height: 108,
      borderRadius: components.radius.pill,
    },
    badge: {
      width: 68,
      height: 68,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      ...typography.styles.h1,
      lineHeight: 34,
    },

    // Tag
    completedTag: {
      alignSelf: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: components.radius.pill,
    },
    completedLabel: {
      ...typography.styles.stepLabel,
    },

    // Titles
    titlesGroup: {
      alignItems: 'center',
    },
    mainTitle: {
      ...typography.styles.display,
      textAlign: 'center',
    },
    lessonSubtitle: {
      ...typography.styles.body,
      textAlign: 'center',
    },

    // Detail
    detailGroup: {
      alignItems: 'center',
      gap: components.layout.spacing.md,
      paddingHorizontal: components.layout.spacing.md,
    },
    divider: {
      height: 1,
      width: 40,
      borderRadius: components.radius.pill,
    },
    detail: {
      ...typography.styles.body,
      textAlign: 'center',
    },

    // Footer
    footer: {
      paddingTop: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    replayButton: {
      alignSelf: 'center',
      paddingVertical: components.layout.spacing.xs,
      paddingHorizontal: components.layout.spacing.md,
    },
    replayLabel: {
      ...typography.styles.small,
    },
    secondaryAction: {
      alignSelf: 'center',
      paddingVertical: components.layout.spacing.xs,
      paddingHorizontal: components.layout.spacing.md,
    },
    secondaryActionLabel: {
      ...typography.styles.small,
    },
  });
