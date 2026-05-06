import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
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
  getDeepDiveCopy,
  getLocalizedDeepDiveTracks,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  buildModulesWithIndexedLessons,
  getLessonStatus,
  areAllCoreLessonsComplete,
  getLastCoreLessonId,
} from '../utils/helpers';
import { lessons } from '../data/curriculum';
import { getDeepDiveLessonsForTrack } from '../data/deepDives';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tabBarHeight = useBottomTabBarHeight();
  const { progress, preferences, isPremium, updateProgress } = useApp();
  const { colors, components } = useTheme();
  const lockedTapStateRef = useRef(new Map());
  const devTitleTapRef = useRef({ count: 0, timestamp: 0 });
  const scrollRef = useRef(null);
  const deepDiveOffsetRef = useRef(null);
  const [deepDiveSectionY, setDeepDiveSectionY] = useState(null);
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const deepDiveCopy = useMemo(
    () => getDeepDiveCopy(preferences?.language),
    [preferences?.language]
  );
  const localizedDeepDiveTracks = useMemo(
    () => getLocalizedDeepDiveTracks(preferences?.language),
    [preferences?.language]
  );
  const allCoreComplete = useMemo(
    () => areAllCoreLessonsComplete(progress),
    [progress]
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

  const handleDevTripleTap = useCallback(() => {
    if (!__DEV__) return;
    const now = Date.now();
    const ref = devTitleTapRef.current;
    const nextCount = now - ref.timestamp < 600 ? ref.count + 1 : 1;
    devTitleTapRef.current = { count: nextCount, timestamp: now };
    if (nextCount >= 3) {
      devTitleTapRef.current = { count: 0, timestamp: 0 };
      const allIds = lessons.map((l) => l.id);
      updateProgress({
        completedLessonIds: allIds,
        currentLessonId: getLastCoreLessonId(),
      });
    }
  }, [updateProgress]);

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

  useFocusEffect(
    useCallback(() => {
      if (route.params?.scrollToSection !== 'deepDive') return undefined;

      const scrollToDeepDive = () => {
        if (typeof deepDiveSectionY !== 'number') return;
        scrollRef.current?.scrollTo?.({
          y: Math.max(0, deepDiveSectionY - components.layout.spacing.lg),
          animated: true,
        });
        navigation.setParams({ scrollToSection: undefined });
      };

      deepDiveOffsetRef.current = setTimeout(scrollToDeepDive, 120);

      return () => {
        if (deepDiveOffsetRef.current) {
          clearTimeout(deepDiveOffsetRef.current);
          deepDiveOffsetRef.current = null;
        }
      };
    }, [components.layout.spacing.lg, deepDiveSectionY, navigation, route.params?.scrollToSection])
  );

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
      scrollRef={scrollRef}
    >
      <TopTabHeader
        title="Lesoverzicht"
        subtitle="Bekijk alle lessen per thema"
        onPressProfile={() => navigation.navigate('Profile')}
        onPressTitle={__DEV__ ? handleDevTripleTap : undefined}
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

      {/* Deep Dive section — always visible, signals a new phase */}
      <View
        style={styles.deepDiveSection}
        onLayout={(event) => setDeepDiveSectionY(event.nativeEvent.layout.y)}
      >

        {/* Divider */}
        <View style={[styles.deepDiveDivider, { backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke) }]} />

        {/* Section intro */}
        <View style={styles.deepDiveIntro}>
          <View style={styles.deepDiveTitleRow}>
            <AppText style={[styles.deepDiveIntroTitle, { color: colors.accent.primary }]}>
              {deepDiveCopy.sectionTitle}
            </AppText>
            {!isPremium && (
              <View
                style={[
                  styles.deepDivePremiumBadge,
                  { borderColor: toRgba(colors.ui.divider, colors.opacity.stroke) },
                ]}
              >
                <AppText style={[styles.deepDivePremiumLabel, { color: colors.text.secondary }]}>
                  {deepDiveCopy.premiumBadge}
                </AppText>
              </View>
            )}
          </View>
          <AppText style={[styles.deepDiveIntroSubtitle, { color: colors.text.secondary }]}>
            {deepDiveCopy.sectionSubtitle}
          </AppText>
          {!allCoreComplete && (
            <View style={styles.deepDiveLockedRow}>
              <Ionicons
                name="lock-closed"
                size={components.sizes.icon.xs}
                color={colors.text.secondary}
              />
              <AppText style={[styles.deepDiveLockedNote, { color: colors.text.secondary }]}>
                {deepDiveCopy.sectionLockedNote}
              </AppText>
            </View>
          )}
        </View>

        {/* Track cards */}
        <View style={styles.deepDiveTrackList}>
          {localizedDeepDiveTracks.map((track) => {
            const trackLessons = getDeepDiveLessonsForTrack(track.id);
            const completedCount = trackLessons.filter((l) =>
              (progress?.completedLessonIds || []).includes(l.id)
            ).length;
            const isAccessible = allCoreComplete && track.available;
            const showLockedState = !allCoreComplete && track.available;
            const allDone = completedCount === trackLessons.length && completedCount > 0;

            return (
              <Pressable
                key={track.id}
                disabled={!isAccessible}
                onPress={() => {
                  if (isPremium) {
                    navigation.navigate('DeepDive', { trackId: track.id });
                  } else {
                    navigation.navigate('Premium');
                  }
                }}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      styles.deepDiveTrackCard,
                      {
                        backgroundColor: toRgba(
                          colors.background.surface,
                          colors.opacity.surface * 0.72
                        ),
                        borderColor: isAccessible
                          ? toRgba(colors.ui.divider, colors.opacity.stroke)
                          : toRgba(colors.ui.divider, colors.opacity.stroke * 0.7),
                      },
                      !isAccessible && styles.deepDiveTrackCardLocked,
                      pressed && isAccessible && styles.deepDiveTrackCardPressed,
                    ]}
                  >
                    <View style={styles.deepDiveTrackCardInner}>
                      <View style={styles.deepDiveTrackCardText}>
                        <View style={styles.deepDiveTrackTitleRow}>
                          <AppText
                            style={[
                              styles.deepDiveTrackTitle,
                              {
                                color: isAccessible
                                  ? colors.text.primary
                                  : colors.text.secondary,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {track.title}
                          </AppText>
                        </View>
                        <AppText
                          style={[
                            styles.deepDiveTrackDescription,
                            { color: colors.text.secondary },
                          ]}
                          numberOfLines={1}
                        >
                          {track.description}
                        </AppText>
                      </View>

                      <View style={styles.deepDiveTrackCardRight}>
                        {allDone ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={components.sizes.icon.sm}
                            color={colors.accent.primary}
                          />
                        ) : isAccessible ? (
                          <View style={styles.deepDiveTrackMeta}>
                            {completedCount > 0 && (
                              <AppText
                                style={[
                                  styles.deepDiveTrackProgress,
                                  { color: colors.accent.primary },
                                ]}
                              >
                                {deepDiveCopy.trackProgress(completedCount, trackLessons.length)}
                              </AppText>
                            )}
                            <View style={styles.deepDiveTrackMetaRow}>
                              <AppText
                                style={[
                                  styles.deepDiveTrackCount,
                                  { color: colors.text.secondary },
                                ]}
                              >
                                {deepDiveCopy.lessonsCount(trackLessons.length)}
                              </AppText>
                              <Ionicons
                                name="chevron-forward"
                                size={components.sizes.icon.sm}
                                color={colors.text.secondary}
                              />
                            </View>
                          </View>
                        ) : showLockedState ? (
                          <Ionicons
                            name="lock-closed"
                            size={components.sizes.icon.sm}
                            color={colors.text.secondary}
                          />
                        ) : !track.available ? (
                          <View
                            style={[
                              styles.deepDiveComingSoonChip,
                              {
                                borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
                              },
                            ]}
                          >
                            <AppText
                              style={[
                                styles.deepDiveComingSoonLabel,
                                { color: colors.text.secondary },
                              ]}
                            >
                              {deepDiveCopy.comingSoon}
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
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
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.xxl,
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

    // ── Deep Dive section ────────────────────────────────────────────────────
    deepDiveSection: {
      gap: components.layout.spacing.xl,
      paddingBottom: components.layout.spacing.xl,
    },

    // Section intro block
    deepDiveDivider: {
      height: 1,
    },
    deepDiveIntro: {
      gap: components.layout.spacing.sm,
    },
    deepDiveTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      flexWrap: 'wrap',
    },
    deepDiveIntroTitle: {
      ...typography.styles.h2,
    },
    deepDivePremiumBadge: {
      paddingHorizontal: components.layout.spacing.sm,
      paddingVertical: 4,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
    },
    deepDivePremiumLabel: {
      ...typography.styles.stepLabel,
    },
    deepDiveIntroSubtitle: {
      ...typography.styles.body,
    },
    deepDiveLockedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
      marginTop: components.layout.spacing.xs,
    },
    deepDiveLockedNote: {
      ...typography.styles.small,
    },

    // Track list
    deepDiveTrackList: {
      gap: components.layout.spacing.sm,
    },

    // Track card
    deepDiveTrackCard: {
      ...components.input.container,
      flexDirection: 'row',
      overflow: 'hidden',
      width: '100%',
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    deepDiveTrackCardLocked: {
      opacity: 0.8,
    },
    deepDiveTrackCardPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    deepDiveTrackCardInner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    deepDiveTrackCardText: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    deepDiveTrackTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      flexWrap: 'wrap',
    },
    deepDiveTrackTitle: {
      ...typography.styles.bodyStrong,
    },
    deepDiveTrackDescription: {
      ...typography.styles.small,
    },
    deepDiveTrackCardRight: {
      flexShrink: 0,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      gap: 2,
    },
    deepDiveTrackMeta: {
      alignItems: 'flex-end',
      gap: 2,
    },
    deepDiveTrackMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    deepDiveTrackProgress: {
      ...typography.styles.small,
    },
    deepDiveTrackCount: {
      ...typography.styles.small,
    },
    deepDiveComingSoonChip: {
      paddingHorizontal: components.layout.spacing.sm,
      paddingVertical: 2,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
    },
    deepDiveComingSoonLabel: {
      ...typography.styles.stepLabel,
      fontSize: 10,
    },
  });
