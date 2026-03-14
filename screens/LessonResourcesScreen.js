import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import Tag from '../components/Tag';
import TopTabHeader from '../components/TopTabHeader';
import { lessonResources } from '../data/resources';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonResourcesCopy, getLocalizedLessons, getLocalizedModules } from '../utils/localization';
import { buildModulesWithIndexedLessons } from '../utils/helpers';

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

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <TopTabHeader
        title={copy.title}
        subtitle={copy.subtitle}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <View style={styles.moduleList}>
        {modulesWithLessons.map((module) => (
          <View key={module.id} style={styles.moduleSection}>
            <AppText style={styles.moduleSectionLabel}>
              {copy.themeLabel(module.themeIndex)}
              {'  ·  '}
              {module.title}
            </AppText>

            <View style={styles.lessonList}>
              {module.lessons.map((lesson) => {
                const isExpanded = expandedLessonId === lesson.id;
                const isCurrent = progress.currentLessonId === lesson.id;
                const resources = lessonResources[lesson.id] || [];

                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    resources={resources}
                    isExpanded={isExpanded}
                    isCurrent={isCurrent}
                    copy={copy}
                    styles={styles}
                    colors={colors}
                    components={components}
                    onPress={() =>
                      setExpandedLessonId((prev) =>
                        prev === lesson.id ? null : lesson.id
                      )
                    }
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </OnboardingScreen>
  );
}

// ─── Lesson card ─────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  resources,
  isExpanded,
  isCurrent,
  copy,
  styles,
  colors,
  components,
  onPress,
}) {
  return (
    <View style={[styles.lessonCard, isExpanded && styles.lessonCardExpanded]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.lessonHeader,
          pressed && styles.lessonHeaderPressed,
        ]}
      >
        <View style={styles.lessonHeaderLeft}>
          <View style={styles.lessonTitleRow}>
            <AppText style={styles.lessonTitle}>{lesson.title}</AppText>
            {isCurrent ? (
              <Tag label={copy.currentLessonTag} tone="accent" />
            ) : null}
          </View>
          <AppText style={styles.lessonDescription} numberOfLines={isExpanded ? 3 : 1}>
            {lesson.shortDescription}
          </AppText>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={components.sizes.icon.md}
          color={colors.text.secondary}
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
            name="globe-outline"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
        </View>

        <View style={styles.resourceCopy}>
          <AppText style={styles.resourceLabel} numberOfLines={2}>
            {resource.label}
          </AppText>
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
      gap: components.layout.contentGap,
    },

    // Module sections
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
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: sp.md,
      padding: sp.lg,
    },
    lessonHeaderPressed: {
      opacity: colors.opacity.emphasis,
    },
    lessonHeaderLeft: {
      flex: 1,
      gap: sp.xs,
    },
    lessonTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sp.sm,
      flexWrap: 'wrap',
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    lessonDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },

    // Resources (visible when expanded)
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
      alignItems: 'center',
      gap: sp.md,
      paddingVertical: sp.sm,
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
    },
    resourceCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    resourceLabel: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    resourceSource: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    resourceDivider: {
      height: components.borderWidth.thin,
      backgroundColor: dividerColor,
    },

    // Empty state
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
      paddingVertical: sp.sm,
    },
  });
};
