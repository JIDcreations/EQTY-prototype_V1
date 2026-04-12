import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import TopTabHeader from '../components/TopTabHeader';
import {
  formatLessonUnitLabel,
  formatThemeUnitLabel,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  buildModulesWithIndexedLessons,
  getLessonStatus,
} from '../utils/helpers';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { progress, preferences } = useApp();
  const { colors, components } = useTheme();
  const lockedTapStateRef = useRef(new Map());
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );

  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const localizedModules = useMemo(
    () => getLocalizedModules(preferences?.language),
    [preferences?.language]
  );

  const learningPath = useMemo(() => {
    const modulesWithLessons = buildModulesWithIndexedLessons(localizedModules, localizedLessons);

    return modulesWithLessons
      .filter((module) => module.lessons.length > 0)
      .map((module) => module);
  }, [localizedLessons, localizedModules]);

  const openLessonOverview = useCallback(
    (lessonId) => {
      navigation.navigate('LessonOverview', {
        lessonId,
        entrySource: 'Lessons',
      });
    },
    [navigation]
  );

  const handleLessonPress = useCallback(
    (lessonId, isLocked) => {
      if (!isLocked) {
        openLessonOverview(lessonId);
        return;
      }

      if (!__DEV__) {
        return;
      }

      const now = Date.now();
      const previous = lockedTapStateRef.current.get(lessonId);
      const nextCount =
        previous && now - previous.timestamp < 700 ? previous.count + 1 : 1;

      if (nextCount >= 3) {
        lockedTapStateRef.current.delete(lessonId);
        openLessonOverview(lessonId);
        return;
      }

      lockedTapStateRef.current.set(lessonId, {
        count: nextCount,
        timestamp: now,
      });
    },
    [openLessonOverview]
  );

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <TopTabHeader
        title="Lesoverzicht"
        subtitle="Bekijk alle lessen per thema"
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <View style={styles.themeList}>
        {learningPath.map((module) => (
          <View key={module.id} style={styles.themeSection}>
            <View style={styles.themeHeader}>
              <AppText style={styles.themeTitle}>
                {formatThemeUnitLabel(preferences?.language, module.themeIndex)} · {module.title}
              </AppText>
            </View>

            <View style={styles.lessonList}>
              {module.lessons.map((lesson) => {
                const status = getLessonStatus(lesson.id, progress);
                const isLocked = status === 'locked';

                return (
                  <Pressable
                    key={lesson.id}
                    onPress={() => handleLessonPress(lesson.id, isLocked)}
                  >
                    {({ pressed }) => (
                      <View
                        style={[
                          styles.lessonRow,
                          status === 'current' && styles.lessonRowCurrent,
                          status === 'completed' && styles.lessonRowCompleted,
                          isLocked && styles.lessonRowLocked,
                          pressed && (!isLocked || __DEV__) && styles.lessonRowPressed,
                        ]}
                      >
                        <View style={styles.lessonRowLeft}>
                          <AppText style={styles.lessonNumber}>
                            {formatLessonUnitLabel(
                              preferences?.language,
                              lesson.lessonIndexInTheme
                            )}
                          </AppText>
                          <AppText
                            style={[
                              styles.lessonTitle,
                              (status === 'upcoming' || isLocked) && styles.lessonTitleUpcoming,
                            ]}
                            numberOfLines={1}
                          >
                            {lesson.title}
                          </AppText>
                        </View>

                        <View style={styles.lessonRowRight}>
                          {status === 'completed' ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={components.sizes.icon.lg}
                              color={colors.accent.primary}
                            />
                          ) : isLocked ? (
                            <Ionicons
                              name="lock-closed"
                              size={components.sizes.icon.sm}
                              color={colors.text.secondary}
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
          </View>
        ))}
      </View>
    </OnboardingScreen>
  );
}

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
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.md,
    },
    themeList: {
      gap: components.layout.spacing.xxl,
    },
    themeSection: {
      gap: components.layout.spacing.md,
    },
    themeHeader: {
      paddingBottom: components.layout.spacing.md,
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    themeTitle: {
      ...typography.styles.stepLabel,
      color: colors.text.primary,
    },
    lessonList: {
      gap: components.layout.spacing.sm,
    },
    lessonRow: {
      ...components.input.container,
      minHeight: 56,
      paddingVertical: components.layout.spacing.md,
      paddingHorizontal: components.layout.spacing.md,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    lessonRowCurrent: {
      borderColor: colors.accent.primary,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    lessonRowCompleted: {
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    lessonRowLocked: {
      opacity: 0.62,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      flexShrink: 0,
    },
    lessonNumber: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flex: 1,
    },
    lessonTitleUpcoming: {
      color: colors.text.secondary,
    },
  });
