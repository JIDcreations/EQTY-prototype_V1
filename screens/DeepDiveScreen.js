import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import {
  getDeepDiveLessonsForTrack,
} from '../data/deepDives';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getDeepDiveCopy, getLocalizedDeepDiveTrack } from '../utils/localization';
import { getDeepDiveLessonStatus } from '../utils/helpers';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function DeepDiveScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { trackId } = route.params || {};
  const { progress, preferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const copy = useMemo(
    () => getDeepDiveCopy(preferences?.language),
    [preferences?.language]
  );
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );

  // This screen is only used for track detail — if no trackId, go back
  if (!trackId) {
    navigation.goBack();
    return null;
  }

  return (
    <TrackDetailView
      trackId={trackId}
      progress={progress}
      navigation={navigation}
      copy={copy}
      styles={styles}
      colors={colors}
      components={components}
    />
  );
}

// ─── Track detail view ────────────────────────────────────────────────────────

function TrackDetailView({ trackId, progress, navigation, copy, styles, colors, components }) {
  const { preferences } = useApp();
  const track = getLocalizedDeepDiveTrack(trackId, preferences?.language);
  const lessons = useMemo(
    () => getDeepDiveLessonsForTrack(trackId),
    [trackId]
  );

  const handleLessonPress = useCallback(
    (lesson) => {
      navigation.navigate('LessonStep', {
        lessonId: lesson.id,
        step: 1,
        entrySource: 'DeepDive',
      });
    },
    [navigation]
  );

  if (!track) {
    return (
      <OnboardingScreen backgroundVariant="bg3" contentContainerStyle={styles.content}>
        <AppText style={styles.heroTitle}>{copy.trackNotFound}</AppText>
      </OnboardingScreen>
    );
  }

  const completedCount = lessons.filter((l) =>
    (progress?.completedLessonIds || []).includes(l.id)
  ).length;

  return (
    <OnboardingScreen scroll backgroundVariant="bg3" contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={components.sizes.icon.lg}
            color={colors.text.primary}
          />
        </Pressable>
      </View>

      <View style={styles.heroBlock}>
        <AppText style={styles.trackDetailLabel}>{copy.trackLabel}</AppText>
        <AppText style={styles.heroTitle}>{track.title}</AppText>
        <AppText style={styles.heroSubtitle}>{track.description}</AppText>
        {completedCount > 0 && (
          <AppText style={styles.trackDetailProgress}>
            {copy.trackProgress(completedCount, lessons.length)}
          </AppText>
        )}
      </View>

      {/* Lesson list */}
      <View style={styles.lessonList}>
        {lessons.map((lesson) => {
          const status = getDeepDiveLessonStatus(lesson.id, progress);
          const isCompleted = status === 'completed';

          return (
            <Pressable key={lesson.id} onPress={() => handleLessonPress(lesson)}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.lessonRow,
                    isCompleted && styles.lessonRowCompleted,
                    pressed && styles.lessonRowPressed,
                  ]}
                >
                  <View style={styles.lessonRowLeft}>
                    <AppText style={styles.lessonNumber}>
                      {copy.lessonIndex(lesson.order + 1)}
                    </AppText>
                    <View style={styles.lessonTextBlock}>
                      <AppText style={styles.lessonTitle} numberOfLines={1}>
                        {lesson.title}
                      </AppText>
                      <AppText style={styles.lessonDescription} numberOfLines={1}>
                        {lesson.shortDescription}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.lessonRowRight}>
                    {isCompleted ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={components.sizes.icon.lg}
                        color={colors.accent.primary}
                      />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={components.sizes.icon.sm}
                        color={colors.text.secondary}
                      />
                    )}
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      gap: components.layout.spacing.xxl,
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.xl,
    },

    // Header
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Hero block
    heroBlock: {
      gap: components.layout.spacing.sm,
    },
    heroTitle: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    heroSubtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    trackDetailLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    trackDetailProgress: {
      ...typography.styles.small,
      color: colors.accent.primary,
      marginTop: components.layout.spacing.xs,
    },

    // Lesson list (track detail)
    lessonList: {
      gap: components.layout.spacing.sm,
    },
    lessonRow: {
      ...components.input.container,
      minHeight: 64,
      paddingVertical: components.layout.spacing.md,
      paddingHorizontal: components.layout.spacing.md,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    lessonRowCompleted: {
      borderColor: toRgba(colors.accent.primary, 0.3),
    },
    lessonRowPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    lessonRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
      flex: 1,
      minWidth: 0,
    },
    lessonRowRight: {
      flexShrink: 0,
    },
    lessonNumber: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
      flexShrink: 0,
    },
    lessonTextBlock: {
      flex: 1,
      gap: 2,
      minWidth: 0,
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
