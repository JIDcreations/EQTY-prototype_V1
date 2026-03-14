import React, { useCallback, useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { CtaInsideButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import TopTabHeader from '../components/TopTabHeader';
import { glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  formatLessonUnitLabel,
  formatThemeUnitLabel,
  getLessonContent,
  getLessonVideosCopy,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { buildModulesWithIndexedLessons, getLessonStatus } from '../utils/helpers';

export default function LessonVideosScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { preferences, progress } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight, mode),
    [colors, components, tabBarHeight, mode]
  );

  const videosCopy = useMemo(
    () => getLessonVideosCopy(preferences?.language),
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

  const glossaryById = useMemo(() => {
    const index = {};
    glossaryTerms.forEach((term) => { index[term.id] = term; });
    return index;
  }, []);

  const moduleGroups = useMemo(() => {
    const modules = buildModulesWithIndexedLessons(localizedModules, localizedLessons);
    return modules.map((module) => ({
      ...module,
      lessonEntries: module.lessons.map((lesson) => {
        const content = getLessonContent(lesson.id, preferences?.language);
        return {
          lesson,
          status: getLessonStatus(lesson.id, progress),
          videos: getVideosForLesson(lesson, content, glossaryById, videosCopy),
        };
      }),
    }));
  }, [glossaryById, localizedLessons, localizedModules, preferences?.language, progress, videosCopy]);

  const featuredEntry = useMemo(() => {
    for (const group of moduleGroups) {
      const found = group.lessonEntries.find(
        (entry) => entry.lesson.id === progress.currentLessonId
      );
      if (found) return found;
    }
    return moduleGroups[0]?.lessonEntries?.[0] || null;
  }, [moduleGroups, progress.currentLessonId]);

  const featuredVideo = featuredEntry?.videos?.[0] || null;

  const handleOpenUrl = useCallback(async (url) => {
    if (!url) return;
    try { await Linking.openURL(url); } catch (_) {}
  }, []);

  // Suppress active tab highlight while this screen is visible
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (!parent) return;
      const inactiveColor = colors.text.secondary;
      const activeColor = mode === 'light' ? colors.text.primary : colors.accent.primary;
      parent.setOptions({ tabBarActiveTintColor: inactiveColor });
      return () => {
        parent.setOptions({ tabBarActiveTintColor: activeColor });
      };
    }, [navigation, colors, mode])
  );

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
      scrollProps={{ keyboardShouldPersistTaps: 'handled' }}
    >
      <TopTabHeader
        title={videosCopy.title}
        subtitle={videosCopy.subtitle}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      {/* Featured hero */}
      {featuredEntry && featuredVideo ? (
        <HeroCard
          entry={featuredEntry}
          video={featuredVideo}
          onPress={handleOpenUrl}
          styles={styles}
          colors={colors}
          components={components}
          videosCopy={videosCopy}
        />
      ) : null}

      {/* Browse by topic shelves */}
      <View style={styles.browseSection}>
        <AppText style={styles.browseSectionTitle}>{videosCopy.browseSectionTitle}</AppText>
        {moduleGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={components.sizes.icon.lg} color={colors.text.secondary} />
            <AppText style={styles.emptyText}>{videosCopy.noLessons}</AppText>
          </View>
        ) : (
          moduleGroups.map((group, index) => (
            <React.Fragment key={group.id}>
              {index > 0 ? <View style={styles.shelfSeparator} /> : null}
              <ModuleShelf
                group={group}
                language={preferences?.language}
                onPress={handleOpenUrl}
                styles={styles}
                colors={colors}
                components={components}
                videosCopy={videosCopy}
              />
            </React.Fragment>
          ))
        )}
      </View>
    </OnboardingScreen>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────

function HeroCard({ entry, video, onPress, styles, colors, components, videosCopy }) {
  const { lesson } = entry;
  const sourceIcon = getSourceIcon(video.source);

  return (
    <View style={styles.hero}>
      <View style={styles.heroThumb}>
        <View style={styles.heroBadge}>
          <AppText style={styles.heroBadgeText}>{videosCopy.currentLessonBadge}</AppText>
        </View>
        <View style={styles.heroPlayBtn}>
          <Ionicons name="play" size={components.sizes.icon.lg} color={colors.text.onAccent} />
        </View>
        <View style={styles.heroDurationBadge}>
          <AppText style={styles.heroDurationText}>{video.duration}</AppText>
        </View>
      </View>
      <View style={styles.heroBody}>
        <AppText style={styles.heroTitle} numberOfLines={2}>{lesson.title}</AppText>
        {lesson.shortDescription ? (
          <AppText style={styles.heroDesc} numberOfLines={2}>{lesson.shortDescription}</AppText>
        ) : null}
        <View style={styles.heroMeta}>
          <Ionicons name={sourceIcon} size={components.sizes.icon.xs} color={colors.text.secondary} />
          <AppText style={styles.heroMetaText}>{video.source}{'  ·  '}{video.duration}</AppText>
        </View>
        <CtaInsideButton label={videosCopy.watchNow} onPress={() => onPress(video.url)} />
      </View>
    </View>
  );
}

// ─── Module shelf ─────────────────────────────────────────────────────────────

function ModuleShelf({ group, language, onPress, styles, colors, components, videosCopy }) {
  const totalVideos = group.lessonEntries.filter((e) => e.videos.length > 0).length;
  const themeLabel = formatThemeUnitLabel(language, group.themeIndex);

  return (
    <View style={styles.shelf}>
      <View style={styles.shelfHeader}>
        <AppText style={styles.shelfLabel} numberOfLines={1}>
          {themeLabel}{'  ·  '}{group.title}
        </AppText>
        {totalVideos > 0 ? (
          <AppText style={styles.shelfCount}>{videosCopy.videosCountFn(totalVideos)}</AppText>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.shelfScroll}
        contentContainerStyle={styles.shelfScrollContent}
      >
        {group.lessonEntries.map((entry) => {
          const primaryVideo = entry.videos[0];
          if (!primaryVideo) return null;
          return (
            <VideoCard
              key={entry.lesson.id}
              entry={entry}
              video={primaryVideo}
              language={language}
              onPress={onPress}
              styles={styles}
              colors={colors}
              components={components}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Video card ───────────────────────────────────────────────────────────────

function VideoCard({ entry, video, language, onPress, styles, colors, components }) {
  const { lesson } = entry;
  const lessonLabel = formatLessonUnitLabel(language, lesson.lessonIndexInTheme);
  const sourceIcon = getSourceIcon(video.source);

  return (
    <Pressable
      onPress={() => onPress(video.url)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardThumb}>
        <View style={styles.cardBadge}>
          <AppText style={styles.cardBadgeText}>{lessonLabel}</AppText>
        </View>
        <View style={styles.cardPlayBtn}>
          <Ionicons name="play" size={components.sizes.icon.xs} color={colors.text.onAccent} />
        </View>
        <View style={styles.cardDurationBadge}>
          <AppText style={styles.cardDurationText}>{video.duration}</AppText>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <AppText style={styles.cardTitle} numberOfLines={2}>{lesson.title}</AppText>
        <View style={styles.cardSourceRow}>
          <Ionicons name={sourceIcon} size={components.sizes.icon.xs} color={colors.text.secondary} />
          <AppText style={styles.cardSourceText} numberOfLines={1}>{video.source}</AppText>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function getVideosForLesson(lesson, content, glossaryById, videosCopy) {
  const lessonVideos = [];
  const summaryVideo = content?.steps?.summary?.video;
  if (summaryVideo?.url) {
    lessonVideos.push({
      id: `summary-${lesson.id}`,
      title: summaryVideo.label || videosCopy.lessonVideoLabel,
      source: videosCopy.sourceLesson,
      duration: '2m',
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
        duration: '2m',
        url: term.learnMoreUrl,
      });
    });
  const searchTitle = encodeURIComponent(`${lesson.title} investing explained`);
  const fallbackVideos = [
    {
      id: `fallback-main-${lesson.id}`,
      title: videosCopy.fallbackVideoLabel,
      source: videosCopy.sourceYoutube,
      duration: '3m',
      url: `https://www.youtube.com/results?search_query=${searchTitle}`,
    },
    {
      id: `fallback-alt-${lesson.id}`,
      title: `${videosCopy.fallbackVideoLabel} 2`,
      source: videosCopy.sourceYoutube,
      duration: '5m',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${lesson.title} investing tutorial`)}`,
    },
  ];
  return dedupeByUrl([...lessonVideos, ...fallbackVideos]).slice(0, 3);
}

function collectTermIds(node, bag = new Set()) {
  if (Array.isArray(node)) { node.forEach((item) => collectTermIds(item, bag)); return bag; }
  if (!node || typeof node !== 'object') return bag;
  Object.entries(node).forEach(([key, value]) => {
    if (key === 'termIds' && Array.isArray(value)) {
      value.forEach((termId) => { if (typeof termId === 'string' && termId.trim()) bag.add(termId); });
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

function getSourceIcon(source) {
  if (!source) return 'globe-outline';
  const s = source.toLowerCase();
  if (s.includes('youtube')) return 'logo-youtube';
  if (s.includes('lesson') || s.includes('les') || s.includes('summary')) return 'bookmark-outline';
  if (s.includes('glossary')) return 'library-outline';
  return 'globe-outline';
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function toRgba(hex, alpha) {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const createStyles = (colors, components, tabBarHeight, mode) => {
  const isLight = mode === 'light';
  const sp = components.layout.spacing;
  const ph = components.layout.pagePaddingHorizontal;

  const dividerColor = isLight
    ? colors.ui.divider
    : toRgba(colors.ui.divider, colors.opacity.stroke);
  const surfaceBg = toRgba(colors.background.surface, colors.opacity.surface);
  const surfaceActiveBg = toRgba(colors.background.surfaceActive, colors.opacity.surface);

  return StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + sp.xl,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight + sp.md,
      gap: sp.lg,
    },

    // ── Browse section ────────────────────────────────────────────────────────
    browseSection: {
      gap: sp.lg,
    },
    browseSectionTitle: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    shelfSeparator: {
      height: components.borderWidth.thin,
      backgroundColor: dividerColor,
      marginVertical: sp.lg,
    },

    // ── Hero card ─────────────────────────────────────────────────────────────
    hero: {
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: surfaceActiveBg,
      overflow: 'hidden',
    },
    heroThumb: {
      height: 180,
      backgroundColor: toRgba(colors.accent.primary, 0.13),
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroBadge: {
      position: 'absolute',
      top: sp.lg,
      left: sp.lg,
      backgroundColor: toRgba(colors.background.app, 0.65),
      borderRadius: components.radius.pill,
      paddingHorizontal: sp.sm,
      paddingVertical: 4,
    },
    heroBadgeText: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    heroPlayBtn: {
      width: 52,
      height: 52,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
      alignItems: 'center',
      justifyContent: 'center',
      // Nudge the icon slightly right to visually center the play triangle
      paddingLeft: 3,
    },
    heroDurationBadge: {
      position: 'absolute',
      bottom: sp.sm,
      right: sp.sm,
      backgroundColor: toRgba(colors.background.app, 0.7),
      borderRadius: components.radius.pill,
      paddingHorizontal: sp.xs,
      paddingVertical: 3,
    },
    heroDurationText: {
      ...typography.styles.small,
      fontSize: 11,
      lineHeight: 14,
      color: colors.text.primary,
    },
    heroBody: {
      padding: sp.lg,
      gap: sp.sm,
    },
    heroTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    heroDesc: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    heroMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.xs,
    },
    heroMetaText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },

    // ── Module shelf ──────────────────────────────────────────────────────────
    shelf: {
      gap: sp.md,
    },
    shelfHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: sp.md,
    },
    shelfLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
      flex: 1,
    },
    shelfCount: {
      ...typography.styles.small,
      color: colors.text.secondary,
      opacity: 0.65,
      flexShrink: 0,
    },
    shelfScroll: {
      marginHorizontal: -ph,
    },
    shelfScrollContent: {
      paddingHorizontal: ph,
      gap: sp.sm,
    },

    // ── Video card ────────────────────────────────────────────────────────────
    card: {
      width: 168,
      borderRadius: components.radius.input,
      borderWidth: components.borderWidth.thin,
      borderColor: dividerColor,
      backgroundColor: surfaceBg,
      overflow: 'hidden',
    },
    cardPressed: {
      opacity: colors.opacity.emphasis,
    },
    cardThumb: {
      height: 96,
      backgroundColor: isLight
        ? toRgba(colors.background.surfaceActive, 1)
        : toRgba(colors.background.surfaceActive, 0.9),
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardBadge: {
      position: 'absolute',
      top: 7,
      left: 7,
      backgroundColor: toRgba(colors.background.app, 0.65),
      borderRadius: components.radius.pill,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    cardBadgeText: {
      ...typography.styles.stepLabel,
      fontSize: 10,
      lineHeight: 13,
      color: colors.text.secondary,
    },
    cardPlayBtn: {
      width: 34,
      height: 34,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 2,
    },
    cardDurationBadge: {
      position: 'absolute',
      bottom: 7,
      right: 7,
      backgroundColor: toRgba(colors.background.app, 0.7),
      borderRadius: components.radius.pill,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    cardDurationText: {
      ...typography.styles.small,
      fontSize: 10,
      lineHeight: 13,
      color: colors.text.primary,
    },
    cardInfo: {
      padding: sp.sm,
      gap: 5,
    },
    cardTitle: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    cardSourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    cardSourceText: {
      ...typography.styles.small,
      fontSize: 11,
      lineHeight: 14,
      color: colors.text.secondary,
      opacity: 0.7,
    },

    // ── Empty state ───────────────────────────────────────────────────────────
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: sp.md,
      paddingVertical: sp.xxl,
    },
    emptyText: {
      ...typography.styles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });
};
