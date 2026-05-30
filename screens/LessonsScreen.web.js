import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import ScreenBackground from '../components/ScreenBackground';
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
  getPrototypeAvailableLessonIds,
  isPrototypeLessonAvailable,
} from '../utils/helpers';
import { getDeepDiveLessonsForTrack } from '../data/deepDives';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tabBarHeight = useBottomTabBarHeight();
  const { progress, preferences, isPremium, updateProgress } = useApp();
  const { colors, components, mode } = useTheme();
  const lockedTapStateRef = useRef(new Map());
  const titleTapStateRef = useRef({ count: 0, timestamp: 0 });
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
    (lessonId, isLocked, isAvailable) => {
      if (!isLocked) {
        openLessonOverview(lessonId);
        return;
      }

      if (!__DEV__ || !isAvailable) {
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

  const scrollToDeepDiveSection = useCallback(() => {
    if (typeof deepDiveSectionY !== 'number') return;
    scrollRef.current?.scrollTo?.({
      x: 0,
      y: Math.max(0, deepDiveSectionY - components.layout.spacing.lg),
      animated: true,
    });
  }, [components.layout.spacing.lg, deepDiveSectionY]);

  const handleTitlePress = useCallback(async () => {
    const now = Date.now();
    const previous = titleTapStateRef.current;
    const nextCount =
      previous && now - previous.timestamp < 700 ? previous.count + 1 : 1;

    if (nextCount >= 3) {
      titleTapStateRef.current = { count: 0, timestamp: 0 };
      await updateProgress({
        completedLessonIds: getPrototypeAvailableLessonIds(),
        currentLessonId: getLastCoreLessonId() || progress.currentLessonId,
      });
      deepDiveOffsetRef.current = setTimeout(scrollToDeepDiveSection, 120);
      return;
    }

    titleTapStateRef.current = {
      count: nextCount,
      timestamp: now,
    };
  }, [progress.currentLessonId, scrollToDeepDiveSection, updateProgress]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.scrollToSection !== 'deepDive') return undefined;

      const handleDeepDiveScroll = () => {
        scrollToDeepDiveSection();
        navigation.setParams({ scrollToSection: undefined });
      };

      deepDiveOffsetRef.current = setTimeout(handleDeepDiveScroll, 120);

      return () => {
        if (deepDiveOffsetRef.current) {
          clearTimeout(deepDiveOffsetRef.current);
          deepDiveOffsetRef.current = null;
        }
      };
    }, [navigation, route.params?.scrollToSection, scrollToDeepDiveSection])
  );

  return (
    <ScreenBackground variant="bg3">
      <View ref={scrollRef} style={styles.webScroll}>
        <View style={styles.content}>
          <TopTabHeader
            title="Lesoverzicht"
            subtitle="Bekijk alle lessen per thema"
            onPressProfile={() => navigation.navigate('Profile')}
            onPressTitle={handleTitlePress}
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
                    const isAvailable = isPrototypeLessonAvailable(lesson.id);
                    const isLocked = status === 'locked' || !isAvailable;

                    return (
                      <Pressable
                        key={lesson.id}
                        onPress={() => handleLessonPress(lesson.id, isLocked, isAvailable)}
                      >
                        {({ pressed }) => (
                          <View
                            style={[
                              styles.lessonRow,
                              status === 'current' && styles.lessonRowCurrent,
                              status === 'completed' && styles.lessonRowCompleted,
                              isLocked && styles.lessonRowLocked,
                              pressed && !isLocked && styles.lessonRowPressed,
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
                                mode === 'light' ? (
                                  <View style={styles.completedLessonIconLight}>
                                    <Ionicons
                                      name="checkmark"
                                      size={components.sizes.icon.xs}
                                      color={colors.text.secondary}
                                    />
                                  </View>
                                ) : (
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={components.sizes.icon.lg}
                                    color={colors.accent.primary}
                                  />
                                )
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
            <AppText
              style={[
                styles.deepDiveIntroTitle,
                { color: mode === 'light' ? colors.text.primary : colors.accent.primary },
              ]}
            >
              {deepDiveCopy.sectionTitle}
            </AppText>
            {!isPremium && (
              <View
                style={[
                  styles.deepDivePremiumBadge,
                  { borderColor: toRgba(colors.text.secondary, colors.opacity.stroke) },
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
                                borderColor: toRgba(colors.text.secondary, colors.opacity.stroke),
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
        </View>
      </View>
    </ScreenBackground>
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
    webScroll: {
      height: '100vh',
      width: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      touchAction: 'pan-y',
    },
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
    completedLessonIconLight: {
      width: components.sizes.icon.lg,
      height: components.sizes.icon.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
      alignItems: 'center',
      justifyContent: 'center',
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
