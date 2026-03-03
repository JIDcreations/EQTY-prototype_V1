import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { CtaInsideButton } from '../components/Button';
import Card from '../components/Card';
import OnboardingScreen from '../components/OnboardingScreen';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import TopTabHeader from '../components/TopTabHeader';
import { glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  getHomeCopy,
  getLessonContent,
  getLessonVideosCopy,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { annotateLessonsWithThemeContext, getLessonStatus } from '../utils/helpers';

const FILTER_KEYS = ['all', 'current', 'completed', 'upcoming'];

export default function LessonVideosScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { preferences, progress } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight, mode),
    [colors, components, tabBarHeight, mode]
  );

  const homeCopy = useMemo(() => getHomeCopy(preferences?.language), [preferences?.language]);
  const videosCopy = useMemo(
    () => getLessonVideosCopy(preferences?.language),
    [preferences?.language]
  );
  const localizedModules = useMemo(
    () => getLocalizedModules(preferences?.language),
    [preferences?.language]
  );

  const lessons = useMemo(() => {
    const localized = getLocalizedLessons(preferences?.language);
    return annotateLessonsWithThemeContext(localized, localizedModules);
  }, [localizedModules, preferences?.language]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedLessonId, setExpandedLessonId] = useState(
    progress.currentLessonId || lessons[0]?.id || null
  );

  const glossaryById = useMemo(() => {
    const index = {};
    glossaryTerms.forEach((term) => {
      index[term.id] = term;
    });
    return index;
  }, []);

  const lessonEntries = useMemo(() => {
    return lessons.map((lesson) => {
      const content = getLessonContent(lesson.id, preferences?.language);
      return {
        lesson,
        status: getLessonStatus(lesson.id, progress),
        videos: getVideosForLesson(lesson, content, glossaryById, videosCopy),
      };
    });
  }, [glossaryById, lessons, preferences?.language, progress, videosCopy]);

  const featuredEntry =
    lessonEntries.find((entry) => entry.lesson.id === progress.currentLessonId) || lessonEntries[0];
  const featuredVideo = featuredEntry?.videos?.[0] || null;

  const filteredEntries = useMemo(() => {
    if (activeFilter === 'all') return lessonEntries;
    return lessonEntries.filter((entry) => entry.status === activeFilter);
  }, [activeFilter, lessonEntries]);

  const handleOpenUrl = async (url) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      // Keep this quiet; broken links should not block screen usage.
    }
  };

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <TopTabHeader
        title={videosCopy.title}
        subtitle={videosCopy.subtitle}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <Card style={styles.featuredCard}>
        <SectionTitle
          title={videosCopy.featuredTitle}
          subtitle={
            featuredEntry ? homeCopy.lessonShort(featuredEntry.lesson.lessonIndexInTheme) : null
          }
        />

        {featuredEntry ? (
          <>
            <AppText style={styles.featuredTitle}>{featuredEntry.lesson.title}</AppText>
            <AppText style={styles.featuredDescription} numberOfLines={2}>
              {featuredEntry.lesson.shortDescription}
            </AppText>
            <View style={styles.featuredMeta}>
              <Tag label={getStatusLabel(featuredEntry.status, videosCopy)} tone="accent" />
              {featuredVideo ? <Tag label={featuredVideo.source} tone="default" /> : null}
            </View>
            {featuredVideo ? (
              <CtaInsideButton
                label={videosCopy.watchNow}
                onPress={() => handleOpenUrl(featuredVideo.url)}
              />
            ) : (
              <AppText style={styles.emptyText}>{videosCopy.featuredFallback}</AppText>
            )}
          </>
        ) : (
          <AppText style={styles.emptyText}>{videosCopy.featuredFallback}</AppText>
        )}
      </Card>

      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTER_KEYS.map((filterKey) => {
            const active = filterKey === activeFilter;
            return (
              <Pressable
                key={filterKey}
                onPress={() => setActiveFilter(filterKey)}
                style={({ pressed }) => [
                  styles.filterChip,
                  active && styles.filterChipActive,
                  pressed && styles.filterChipPressed,
                ]}
              >
                <AppText style={[styles.filterText, active && styles.filterTextActive]}>
                  {getFilterLabel(filterKey, videosCopy)}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.lessonList}>
        {filteredEntries.length ? (
          filteredEntries.map((entry) => {
            const { lesson, status, videos } = entry;
            const isExpanded = expandedLessonId === lesson.id;
            return (
              <Card
                key={lesson.id}
                style={[styles.lessonCard, isExpanded && styles.lessonCardExpanded]}
              >
                <Pressable
                  onPress={() =>
                    setExpandedLessonId((prev) => (prev === lesson.id ? null : lesson.id))
                  }
                  style={({ pressed }) => [styles.lessonHeader, pressed && styles.lessonHeaderPressed]}
                >
                  <View style={styles.lessonHeaderCopy}>
                    <AppText style={styles.lessonLabel}>
                      {homeCopy.lessonShort(lesson.lessonIndexInTheme)}
                    </AppText>
                    <AppText style={styles.lessonTitle}>{lesson.title}</AppText>
                  </View>
                  <View style={styles.lessonHeaderRight}>
                    <Tag label={getStatusLabel(status, videosCopy)} tone={status === 'current' ? 'accent' : 'default'} />
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={components.sizes.icon.md}
                      color={colors.text.secondary}
                    />
                  </View>
                </Pressable>

                {isExpanded ? (
                  <View style={styles.videoList}>
                    {videos.map((video) => (
                      <Pressable
                        key={video.id}
                        onPress={() => handleOpenUrl(video.url)}
                        style={({ pressed }) => [styles.videoRow, pressed && styles.videoRowPressed]}
                      >
                        <View style={styles.videoIconWrap}>
                          <Ionicons
                            name="play"
                            size={components.sizes.icon.sm}
                            color={colors.text.primary}
                          />
                        </View>
                        <View style={styles.videoCopy}>
                          <AppText style={styles.videoTitle}>{video.title}</AppText>
                          <AppText style={styles.videoMeta}>{`${video.source} · ${video.duration}`}</AppText>
                        </View>
                        <Ionicons
                          name="open-outline"
                          size={components.sizes.icon.md}
                          color={colors.text.secondary}
                        />
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <AppText style={styles.emptyText}>{videosCopy.noLessons}</AppText>
          </Card>
        )}
      </View>
    </OnboardingScreen>
  );
}

function getVideosForLesson(lesson, content, glossaryById, videosCopy) {
  const lessonVideos = [];
  const summaryVideo = content?.steps?.summary?.video;

  if (summaryVideo?.url) {
    lessonVideos.push({
      id: `summary-${lesson.id}`,
      title: summaryVideo.label || videosCopy.lessonVideoLabel,
      source: videosCopy.sourceLesson,
      duration: '~2m',
      url: summaryVideo.url,
    });
  }

  const termIds = Array.from(collectTermIds(content?.steps || {}));
  termIds
    .map((termId) => glossaryById[termId])
    .filter((term) => term?.learnMoreUrl)
    .slice(0, 2)
    .forEach((term) => {
      lessonVideos.push({
        id: `term-${lesson.id}-${term.id}`,
        title: term.term || videosCopy.glossaryVideoLabel,
        source: videosCopy.sourceGlossary,
        duration: '~2m',
        url: term.learnMoreUrl,
      });
    });

  const searchTitle = encodeURIComponent(`${lesson.title} investing explained`);
  const fallbackVideos = [
    {
      id: `fallback-main-${lesson.id}`,
      title: videosCopy.fallbackVideoLabel,
      source: videosCopy.sourceYoutube,
      duration: '~3m',
      url: `https://www.youtube.com/results?search_query=${searchTitle}`,
    },
    {
      id: `fallback-alt-${lesson.id}`,
      title: `${videosCopy.fallbackVideoLabel} 2`,
      source: videosCopy.sourceYoutube,
      duration: '~5m',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${lesson.title} investing tutorial`)}`,
    },
  ];

  return dedupeByUrl([...lessonVideos, ...fallbackVideos]).slice(0, 3);
}

function collectTermIds(node, bag = new Set()) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectTermIds(item, bag));
    return bag;
  }

  if (!node || typeof node !== 'object') {
    return bag;
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key === 'termIds' && Array.isArray(value)) {
      value.forEach((termId) => {
        if (typeof termId === 'string' && termId.trim()) {
          bag.add(termId);
        }
      });
      return;
    }
    collectTermIds(value, bag);
  });

  return bag;
}

function dedupeByUrl(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.url) return false;
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function getStatusLabel(status, videosCopy) {
  if (status === 'current') return videosCopy.statusCurrent;
  if (status === 'completed') return videosCopy.statusCompleted;
  return videosCopy.statusUpcoming;
}

function getFilterLabel(filterKey, videosCopy) {
  if (filterKey === 'current') return videosCopy.currentFilter;
  if (filterKey === 'completed') return videosCopy.completedFilter;
  if (filterKey === 'upcoming') return videosCopy.upcomingFilter;
  return videosCopy.allFilter;
}

const createStyles = (colors, components, tabBarHeight, mode) => {
  const isLight = mode === 'light';

  return StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.md,
      gap: components.layout.contentGap,
    },
    featuredCard: {
      borderWidth: components.borderWidth.thin,
      borderColor: isLight
        ? colors.ui.divider
        : toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      gap: components.layout.spacing.md,
    },
    featuredTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    featuredDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    featuredMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      flexWrap: 'wrap',
    },
    filterWrap: {
      marginTop: -components.layout.spacing.xs,
    },
    filterRow: {
      gap: components.layout.spacing.sm,
      paddingRight: components.layout.spacing.sm,
    },
    filterChip: {
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderRadius: components.radius.pill,
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.xs,
    },
    filterChipActive: {
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    },
    filterChipPressed: {
      opacity: colors.opacity.emphasis,
    },
    filterText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    filterTextActive: {
      color: colors.text.primary,
    },
    lessonList: {
      gap: components.layout.spacing.md,
    },
    lessonCard: {
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    lessonCardExpanded: {
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    lessonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    lessonHeaderPressed: {
      opacity: colors.opacity.emphasis,
    },
    lessonHeaderCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
      minWidth: 0,
    },
    lessonHeaderRight: {
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    lessonLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    videoList: {
      gap: components.layout.spacing.sm,
      borderTopWidth: components.borderWidth.thin,
      borderTopColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      paddingTop: components.layout.spacing.md,
    },
    videoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      borderRadius: components.radius.input,
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.sm,
      minHeight: components.sizes.list.minItemHeight,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    videoRowPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    videoIconWrap: {
      width: components.sizes.square.sm,
      height: components.sizes.square.sm,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    },
    videoCopy: {
      flex: 1,
      minWidth: 0,
      gap: components.layout.spacing.xs,
    },
    videoTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    videoMeta: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyCard: {
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
};

function toRgba(hex, alpha) {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
