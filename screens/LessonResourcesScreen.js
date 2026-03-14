import React, { useMemo, useState, useCallback } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SearchBar from '../components/SearchBar';
import TopTabHeader from '../components/TopTabHeader';
import { lessonResources } from '../data/resources';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonResourcesCopy, getLocalizedLessons, getLocalizedModules } from '../utils/localization';
import { buildModulesWithIndexedLessons, getLessonStatus } from '../utils/helpers';

export default function LessonResourcesScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { preferences, progress } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight, mode),
    [colors, components, tabBarHeight, mode]
  );

  const copy = useMemo(
    () => getLessonResourcesCopy(preferences?.language),
    [preferences?.language]
  );

  const modulesWithLessons = useMemo(() => {
    const localizedLessons = getLocalizedLessons(preferences?.language);
    const localizedModules = getLocalizedModules(preferences?.language);
    return buildModulesWithIndexedLessons(localizedModules, localizedLessons);
  }, [preferences?.language]);

  const [expandedLessonId, setExpandedLessonId] = useState(
    progress.currentLessonId || null
  );
  const [query, setQuery] = useState('');

  // Suppress the active tab highlight while this screen is visible.
  // LessonResources lives inside the Lessons stack, but conceptually it does
  // not belong to any single tab — no tab should appear selected.
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

  const handleQueryChange = useCallback((text) => {
    setQuery(text);
    // Collapse open card when user starts a new search so results are clean
    if (text.length > 0) setExpandedLessonId(null);
  }, []);

  const totalLessons = useMemo(
    () => modulesWithLessons.reduce((sum, m) => sum + m.lessons.length, 0),
    [modulesWithLessons]
  );

  const totalSources = useMemo(
    () => Object.values(lessonResources).reduce((sum, arr) => sum + arr.length, 0),
    []
  );

  // Flat list of all lessons used for search
  const allLessons = useMemo(
    () => modulesWithLessons.flatMap((m) => m.lessons),
    [modulesWithLessons]
  );

  // Search: match on lesson title and short description
  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return allLessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(q) ||
        (lesson.shortDescription || '').toLowerCase().includes(q)
    );
  }, [allLessons, query]);

  const isSearching = query.trim().length > 0;

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
      scrollProps={{ keyboardShouldPersistTaps: 'handled' }}
    >
      <TopTabHeader
        title={copy.title}
        subtitle={copy.subtitle}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="library-outline" size={components.sizes.icon.sm} color={colors.text.secondary} />
          <AppText style={styles.statText}>{copy.lessonsCount(totalLessons)}</AppText>
        </View>
        <View style={styles.statDot} />
        <View style={styles.statItem}>
          <Ionicons name="globe-outline" size={components.sizes.icon.sm} color={colors.text.secondary} />
          <AppText style={styles.statText}>{copy.sourcesCount(totalSources)}</AppText>
        </View>
      </View>

      {/* Search */}
      <SearchBar
        value={query}
        onChangeText={handleQueryChange}
        placeholder={copy.searchPlaceholder}
      />

      {/* Content */}
      {isSearching ? (
        <SearchResults
          results={searchResults}
          expandedLessonId={expandedLessonId}
          setExpandedLessonId={setExpandedLessonId}
          progress={progress}
          copy={copy}
          styles={styles}
          colors={colors}
          components={components}
        />
      ) : (
        <ModuleList
          modulesWithLessons={modulesWithLessons}
          expandedLessonId={expandedLessonId}
          setExpandedLessonId={setExpandedLessonId}
          progress={progress}
          copy={copy}
          styles={styles}
          colors={colors}
          components={components}
        />
      )}
    </OnboardingScreen>
  );
}

// ─── Module list (default view) ───────────────────────────────────────────────

function ModuleList({ modulesWithLessons, expandedLessonId, setExpandedLessonId, progress, copy, styles, colors, components }) {
  return (
    <View style={styles.moduleList}>
      {modulesWithLessons.map((module) => (
        <View key={module.id} style={styles.moduleSection}>
          <AppText style={styles.moduleSectionLabel}>
            {copy.themeLabel(module.themeIndex)}{'  ·  '}{module.title}
          </AppText>

          <View style={styles.lessonList}>
            {module.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progress}
                expandedLessonId={expandedLessonId}
                setExpandedLessonId={setExpandedLessonId}
                copy={copy}
                styles={styles}
                colors={colors}
                components={components}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Search results view ──────────────────────────────────────────────────────

function SearchResults({ results, expandedLessonId, setExpandedLessonId, progress, copy, styles, colors, components }) {
  if (!results || results.length === 0) {
    return (
      <View style={styles.emptySearchCard}>
        <Ionicons name="search-outline" size={components.sizes.icon.lg} color={colors.text.secondary} />
        <AppText style={styles.emptySearchText}>{copy.noSearchResults}</AppText>
      </View>
    );
  }

  return (
    <View style={styles.lessonList}>
      {results.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          progress={progress}
          expandedLessonId={expandedLessonId}
          setExpandedLessonId={setExpandedLessonId}
          copy={copy}
          styles={styles}
          colors={colors}
          components={components}
        />
      ))}
    </View>
  );
}

// ─── Lesson card ──────────────────────────────────────────────────────────────

function LessonCard({ lesson, progress, expandedLessonId, setExpandedLessonId, copy, styles, colors, components }) {
  const isExpanded = expandedLessonId === lesson.id;
  const status = getLessonStatus(lesson.id, progress);
  const isCompleted = status === 'completed';
  const resources = lessonResources[lesson.id] || [];

  return (
    <View style={[styles.lessonCard, isExpanded && styles.lessonCardExpanded]}>
      <Pressable
        onPress={() =>
          setExpandedLessonId((prev) => (prev === lesson.id ? null : lesson.id))
        }
        style={({ pressed }) => [
          styles.lessonHeader,
          pressed && styles.lessonHeaderPressed,
        ]}
      >
        <View style={styles.lessonHeaderContent}>
          <View style={styles.lessonTitleRow}>
            <AppText
              style={[styles.lessonTitle, isCompleted && styles.lessonTitleCompleted]}
              numberOfLines={2}
            >
              {lesson.title}
            </AppText>
            {isCompleted ? (
              <Ionicons
                name="checkmark-circle"
                size={components.sizes.icon.md}
                color={colors.accent.primary}
                style={styles.chevron}
              />
            ) : null}
          </View>
          <AppText
            style={styles.lessonDescription}
            numberOfLines={isExpanded ? 3 : 1}
          >
            {lesson.shortDescription}
          </AppText>

          {!isExpanded && resources.length > 0 ? (
            <View style={styles.resourceCountRow}>
              <Ionicons name="globe-outline" size={components.sizes.icon.xs} color={colors.text.secondary} />
              <AppText style={styles.resourceCountText}>
                {resources.length} {resources.length === 1 ? 'source' : 'sources'}
              </AppText>
            </View>
          ) : null}
        </View>

        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={components.sizes.icon.md}
          color={colors.text.secondary}
          style={styles.chevron}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.resourceList}>
          {resources.length === 0 ? (
            <AppText style={styles.emptyText}>{copy.noResources}</AppText>
          ) : (
            resources.map((resource, index) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                copy={copy}
                styles={styles}
                colors={colors}
                components={components}
                showDivider={index < resources.length - 1}
              />
            ))
          )}
        </View>
      ) : null}
    </View>
  );
}

// ─── Resource row ─────────────────────────────────────────────────────────────

function getResourceIcon(url) {
  if (!url) return 'globe-outline';
  if (url.includes('/articles/')) return 'reader-outline';
  if (url.includes('/terms/')) return 'document-text-outline';
  return 'globe-outline';
}

function ResourceRow({ resource, copy, styles, colors, components, showDivider }) {
  const handleOpen = async () => {
    if (!resource?.url) return;
    try {
      await Linking.openURL(resource.url);
    } catch (_) {}
  };

  return (
    <View>
      <Pressable
        onPress={handleOpen}
        style={({ pressed }) => [
          styles.resourceRow,
          pressed && styles.resourceRowPressed,
        ]}
      >
        <View style={styles.resourceIconWrap}>
          <Ionicons
            name={getResourceIcon(resource.url)}
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
        </View>

        <View style={styles.resourceCopy}>
          <AppText style={styles.resourceLabel} numberOfLines={2}>
            {resource.label}
          </AppText>
          {resource.description ? (
            <AppText style={styles.resourceDescription} numberOfLines={2}>
              {resource.description}
            </AppText>
          ) : null}
          <AppText style={styles.resourceSource} numberOfLines={1}>
            {resource.source}
          </AppText>
        </View>

        <Ionicons
          name="open-outline"
          size={components.sizes.icon.md}
          color={colors.text.secondary}
        />
      </Pressable>

      {showDivider ? <View style={styles.resourceDivider} /> : null}
    </View>
  );
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

  return StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + sp.xl,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight + sp.md,
      gap: sp.lg,
    },

    // Stats row
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.sm,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.xs,
    },
    statText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    statDot: {
      width: 3,
      height: 3,
      borderRadius: 999,
      backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },

    // Module list
    moduleList: {
      gap: sp.xl,
    },
    moduleSection: {
      gap: sp.sm,
    },
    moduleSectionLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },

    // Lesson list within a module
    lessonList: {
      gap: sp.sm,
    },

    // Lesson card
    lessonCard: {
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      borderColor: dividerColor,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      overflow: 'hidden',
    },
    lessonCardExpanded: {
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },

    // Lesson header (always visible)
    lessonHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: sp.md,
      padding: sp.lg,
    },
    lessonHeaderPressed: {
      opacity: colors.opacity.emphasis,
    },
    lessonHeaderContent: {
      flex: 1,
      gap: sp.xs,
    },
    lessonTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: sp.sm,
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flex: 1,
    },
    lessonTitleCompleted: {
      color: colors.text.secondary,
    },
    lessonDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    // Slight top nudge so the chevron sits level with the title cap-height
    chevron: {
      marginTop: 2,
      flexShrink: 0,
    },
    resourceCountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    resourceCountText: {
      ...typography.styles.small,
      color: colors.text.secondary,
      opacity: 0.7,
    },

    // Resource list (shown when expanded)
    resourceList: {
      borderTopWidth: components.borderWidth.thin,
      borderTopColor: dividerColor,
      paddingHorizontal: sp.lg,
      paddingTop: sp.sm,
      paddingBottom: sp.md,
    },

    // Resource row
    resourceRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: sp.md,
      paddingVertical: sp.md,
    },
    resourceRowPressed: {
      opacity: colors.opacity.emphasis,
    },
    resourceIconWrap: {
      width: components.sizes.square.md,
      height: components.sizes.square.md,
      borderRadius: components.radius.input,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: toRgba(colors.ui.divider, colors.opacity.tint),
      flexShrink: 0,
      marginTop: 1,
    },
    resourceCopy: {
      flex: 1,
      gap: sp.xs,
      minWidth: 0,
    },
    resourceLabel: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    resourceDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
      lineHeight: 18,
    },
    resourceSource: {
      ...typography.styles.small,
      color: colors.text.secondary,
      opacity: 0.65,
    },
    resourceDivider: {
      height: components.borderWidth.thin,
      backgroundColor: dividerColor,
    },

    // Search empty state
    emptySearchCard: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: sp.md,
      paddingVertical: sp.xxl,
    },
    emptySearchText: {
      ...typography.styles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },

    // Lesson empty state
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
      paddingVertical: sp.sm,
    },
  });
};
