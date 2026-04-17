import React, { useCallback, useMemo } from 'react';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  formatThemeUnitLabel,
  getLessonContent,
  getLessonVideosCopy,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { buildModulesWithIndexedLessons, getLessonStatus } from '../utils/helpers';

// ─── Module color palette ─────────────────────────────────────────────────────
// One rich dark color per module — used as thumbnail backgrounds

const MODULE_COLORS = [
  '#1B3668', // deep blue
  '#1A4A42', // deep teal
  '#3D1E5E', // deep purple
  '#1A3D22', // deep forest
  '#5C1F16', // deep rust
  '#2B3A1A', // deep olive
  '#1C2E4A', // deep navy
];

function getModuleColor(themeIndex) {
  return MODULE_COLORS[(themeIndex ?? 0) % MODULE_COLORS.length];
}

// ─── Screen ───────────────────────────────────────────────────────────────────

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

  // Find current lesson entry + its module color index
  const featuredEntry = useMemo(() => {
    for (const group of moduleGroups) {
      const found = group.lessonEntries.find(
        (entry) => entry.lesson.id === progress.currentLessonId
      );
      if (found) return { ...found, moduleThemeIndex: group.themeIndex };
    }
    const firstGroup = moduleGroups[0];
    const first = firstGroup?.lessonEntries?.[0];
    return first ? { ...first, moduleThemeIndex: firstGroup?.themeIndex ?? 0 } : null;
  }, [moduleGroups, progress.currentLessonId]);

  const featuredVideo = featuredEntry?.videos?.[0] || null;

  const handleOpenUrl = useCallback(async (url) => {
    if (!url) return;
    try { await Linking.openURL(url); } catch (_) {}
  }, []);

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
        onBack={() => navigation.goBack()}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      {/* Featured hero — current lesson */}
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

      {/* Browse by topic — vertical module groups */}
      <View style={styles.browseSection}>
        <AppText style={styles.browseSectionTitle}>{videosCopy.browseSectionTitle}</AppText>
        {moduleGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={components.sizes.icon.lg} color={colors.text.secondary} />
            <AppText style={styles.emptyText}>{videosCopy.noLessons}</AppText>
          </View>
        ) : (
          moduleGroups.map((group) => (
            <ModuleGroup
              key={group.id}
              group={group}
              language={preferences?.language}
              onPress={handleOpenUrl}
              styles={styles}
              colors={colors}
              components={components}
              videosCopy={videosCopy}
            />
          ))
        )}
      </View>
    </OnboardingScreen>
  );
}

// ─── Video thumbnail ──────────────────────────────────────────────────────────
// Abstract generated thumbnail — rich colored background with decorative
// geometry and a ghost lesson number. No real images needed.

const THUMBNAIL = require('../assets/video-thumbnail/Test-Thumbnail.png');

function VideoThumbnail({ duration, isHero, colors }) {
  const height = isHero ? 192 : 72;
  const playSize = isHero ? 52 : 32;
  const playIconSize = isHero ? 20 : 14;

  return (
    <View style={{ height, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
      {/* Thumbnail image */}
      <Image source={THUMBNAIL} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
      {/* Play button */}
      <View style={{
        width: playSize,
        height: playSize,
        borderRadius: playSize / 2,
        backgroundColor: colors.accent.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: isHero ? 3 : 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 5,
      }}>
        <Ionicons name="play" size={playIconSize} color={colors.text.onAccent} />
      </View>
      {/* Duration badge — bottom right */}
      {isHero && duration ? (
        <View style={{
          position: 'absolute',
          bottom: isHero ? 12 : 5,
          right: isHero ? 12 : 5,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 16,
          paddingHorizontal: isHero ? 8 : 5,
          paddingVertical: isHero ? 3 : 2,
        }}>
          <AppText style={{
            ...typography.styles.small,
            fontSize: isHero ? 12 : 9,
            lineHeight: isHero ? 15 : 11,
            color: 'rgba(255,255,255,0.95)',
          }}>
            {duration}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────

function HeroCard({ entry, video, onPress, styles, colors, components, videosCopy }) {
  const { lesson } = entry;
  const lessonNumber = (lesson.lessonIndexInTheme ?? 0) + 1;

  return (
    <View style={styles.hero}>
      <VideoThumbnail
        duration={video.duration}
        isHero
        colors={colors}
      />
      <View style={styles.heroBody}>
        <AppText style={styles.heroLabel}>{videosCopy.currentLessonBadge}</AppText>
        <AppText style={styles.heroTitle} numberOfLines={2}>{lesson.title}</AppText>
        {lesson.shortDescription ? (
          <AppText style={styles.heroDesc} numberOfLines={2}>{lesson.shortDescription}</AppText>
        ) : null}
        <CtaInsideButton label={videosCopy.watchNow} onPress={() => onPress(video.url)} />
      </View>
    </View>
  );
}

// ─── Module group ─────────────────────────────────────────────────────────────

function ModuleGroup({ group, language, onPress, styles, colors, components, videosCopy }) {
  const entries = group.lessonEntries.filter((e) => e.videos.length > 0);
  if (entries.length === 0) return null;

  const themeLabel = formatThemeUnitLabel(language, group.themeIndex);

  return (
    <View style={styles.moduleGroup}>
      {/* Module header */}
      <View style={styles.moduleHeader}>
        <View style={styles.moduleHeaderText}>
          <AppText style={styles.moduleThemeLabel}>{themeLabel}</AppText>
          <AppText style={styles.moduleTitle} numberOfLines={1}>{group.title}</AppText>
        </View>
        <AppText style={styles.moduleCount}>{videosCopy.videosCountFn(entries.length)}</AppText>
      </View>
      {/* Lesson rows */}
      {entries.map((entry, idx) => (
        <LessonRow
          key={entry.lesson.id}
          entry={entry}
          video={entry.videos[0]}
          moduleThemeIndex={group.themeIndex}
          onPress={onPress}
          isLast={idx === entries.length - 1}
          styles={styles}
          colors={colors}
          components={components}
        />
      ))}
    </View>
  );
}

// ─── Lesson row ───────────────────────────────────────────────────────────────

function LessonRow({ entry, video, moduleThemeIndex, onPress, isLast, styles, colors, components }) {
  const { lesson } = entry;
  const lessonNumber = (lesson.lessonIndexInTheme ?? 0) + 1;
  const sourceIcon = getSourceIcon(video.source);

  return (
    <>
      <Pressable
        onPress={() => onPress(video.url)}
        style={({ pressed }) => [styles.lessonRow, pressed && styles.lessonRowPressed]}
      >
        <View style={styles.lessonRowThumb}>
          <VideoThumbnail
            duration={video.duration}
            isHero={false}
            colors={colors}
          />
        </View>
        <View style={styles.lessonRowInfo}>
          <AppText style={styles.lessonRowTitle} numberOfLines={2}>{lesson.title}</AppText>
          <View style={styles.lessonRowMeta}>
            <Ionicons name={sourceIcon} size={12} color={colors.text.secondary} />
            <AppText style={styles.lessonRowMetaText}>{video.source}</AppText>
          </View>
        </View>
        <Ionicons name="open-outline" size={16} color={colors.text.secondary} style={{ opacity: 0.45 }} />
      </Pressable>
      {!isLast && <View style={styles.rowDivider} />}
    </>
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

  const dividerColor = isLight
    ? colors.ui.divider
    : toRgba(colors.ui.divider, colors.opacity.stroke);
  const surfaceBg = toRgba(colors.background.surface, colors.opacity.surface);

  return StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + sp.xl,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight + sp.xxl,
      gap: sp.xl,
    },

    // ── Browse section ────────────────────────────────────────────────────────
    browseSection: {
      gap: sp.md,
    },
    browseSectionTitle: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },

    // ── Hero card ─────────────────────────────────────────────────────────────
    hero: {
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.accent.primary,
      backgroundColor: surfaceBg,
      overflow: 'hidden',
    },
    heroBody: {
      padding: sp.lg,
      gap: sp.sm,
    },
    heroLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    heroTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    heroDesc: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },

    // ── Module group ──────────────────────────────────────────────────────────
    moduleGroup: {
      borderRadius: components.radius.input,
      borderWidth: components.borderWidth.thin,
      borderColor: dividerColor,
      backgroundColor: surfaceBg,
      overflow: 'hidden',
    },
    moduleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.sm,
      paddingHorizontal: sp.lg,
      paddingTop: sp.md,
      paddingBottom: sp.md,
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: dividerColor,
    },
    moduleHeaderText: {
      flex: 1,
      gap: 1,
    },
    moduleThemeLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    moduleTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    moduleCount: {
      ...typography.styles.small,
      color: colors.text.secondary,
      opacity: 0.6,
      flexShrink: 0,
    },

    // ── Lesson row ────────────────────────────────────────────────────────────
    lessonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.md,
      padding: sp.md,
    },
    lessonRowPressed: {
      backgroundColor: toRgba(colors.background.surfaceActive, 0.5),
    },
    lessonRowThumb: {
      width: 120,
      height: 72,
      borderRadius: components.radius.input,
      overflow: 'hidden',
      flexShrink: 0,
    },
    lessonRowInfo: {
      flex: 1,
      gap: 5,
    },
    lessonRowTitle: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    lessonRowMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    lessonRowMetaText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    rowDivider: {
      height: components.borderWidth.thin,
      backgroundColor: dividerColor,
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
