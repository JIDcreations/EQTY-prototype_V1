import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
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
  getLessonResourcesCopy,
  getLocalizedLessons,
} from '../utils/localization';
import { getLessonStatus } from '../utils/helpers';

export default function LessonResourcesScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { preferences, progress } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight, mode),
    [colors, components, tabBarHeight, mode]
  );
  const resourcesCopy = useMemo(
    () => getLessonResourcesCopy(preferences?.language),
    [preferences?.language]
  );
  const homeCopy = useMemo(() => getHomeCopy(preferences?.language), [preferences?.language]);

  const lessons = useMemo(() => {
    const localizedLessons = getLocalizedLessons(preferences?.language);
    return [...localizedLessons].sort((a, b) => a.order - b.order);
  }, [preferences?.language]);

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

  const lessonCards = useMemo(() => {
    return lessons.map((lesson) => {
      const content = getLessonContent(lesson.id, preferences?.language);
      const takeaways = getTakeaways(content, lesson.shortDescription);
      const links = getLinksForLesson(lesson, content, glossaryById, resourcesCopy);
      return {
        lesson,
        takeaways,
        webLinks: links.web,
        pdfLinks: links.pdf,
      };
    });
  }, [glossaryById, lessons, preferences?.language, resourcesCopy]);

  const completedCount = useMemo(
    () =>
      lessonCards.filter((item) =>
        progress.completedLessonIds?.includes(item.lesson.id)
      ).length,
    [lessonCards, progress.completedLessonIds]
  );

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <TopTabHeader
        title={resourcesCopy.title}
        subtitle={resourcesCopy.subtitle}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <Card style={styles.summaryCard}>
        <SectionTitle title={resourcesCopy.summaryTitle} subtitle={resourcesCopy.summarySubtitle} />
        <View style={styles.summaryMeta}>
          <Tag label={resourcesCopy.lessonCount(lessons.length)} tone="default" />
          <Tag
            label={`${completedCount}/${lessons.length} ${resourcesCopy.statusCompleted.toLowerCase()}`}
            tone="accent"
          />
        </View>
      </Card>

      <View style={styles.lessonList}>
        {lessonCards.map(({ lesson, takeaways, webLinks, pdfLinks }) => {
          const isExpanded = expandedLessonId === lesson.id;
          const status = getLessonStatus(lesson.id, progress);
          const statusLabel = getStatusLabel(status, resourcesCopy);
          const lessonLabel = homeCopy.lessonShort(lesson.order + 1);

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
                  <AppText style={styles.lessonNumber}>{lessonLabel}</AppText>
                  <AppText style={styles.lessonTitle}>{lesson.title}</AppText>
                  <AppText style={styles.lessonDescription} numberOfLines={isExpanded ? 3 : 2}>
                    {lesson.shortDescription}
                  </AppText>
                </View>
                <View style={styles.lessonHeaderRight}>
                  <Tag label={statusLabel} tone={status === 'current' ? 'accent' : 'default'} />
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={components.sizes.icon.md}
                    color={colors.text.secondary}
                  />
                </View>
              </Pressable>

              {isExpanded ? (
                <View style={styles.expandedContent}>
                  <View style={styles.resourceSection}>
                    <AppText style={styles.sectionLabel}>{resourcesCopy.extraInfoTitle}</AppText>
                    {takeaways.length ? (
                      takeaways.map((item) => (
                        <View key={`${lesson.id}-${item}`} style={styles.takeawayRow}>
                          <View style={styles.takeawayDot} />
                          <AppText style={styles.takeawayText}>{item}</AppText>
                        </View>
                      ))
                    ) : (
                      <AppText style={styles.emptyText}>{resourcesCopy.noExtraInfo}</AppText>
                    )}
                  </View>

                  <View style={styles.resourceSection}>
                    <AppText style={styles.sectionLabel}>{resourcesCopy.sitesTitle}</AppText>
                    {webLinks.length ? (
                      webLinks.map((link) => (
                        <LinkRow
                          key={link.id}
                          link={link}
                          styles={styles}
                          colors={colors}
                          components={components}
                          fallbackLabel={resourcesCopy.openLink}
                        />
                      ))
                    ) : (
                      <AppText style={styles.emptyText}>{resourcesCopy.noLinks}</AppText>
                    )}
                  </View>

                  <View style={styles.resourceSection}>
                    <AppText style={styles.sectionLabel}>{resourcesCopy.pdfTitle}</AppText>
                    {pdfLinks.length ? (
                      pdfLinks.map((link) => (
                        <LinkRow
                          key={link.id}
                          link={link}
                          styles={styles}
                          colors={colors}
                          components={components}
                          fallbackLabel={resourcesCopy.openLink}
                        />
                      ))
                    ) : (
                      <AppText style={styles.emptyText}>{resourcesCopy.noLinks}</AppText>
                    )}
                  </View>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}

function LinkRow({ link, styles, colors, components, fallbackLabel }) {
  const handleOpen = async () => {
    if (!link?.url) return;
    try {
      await Linking.openURL(link.url);
    } catch (error) {
      // Keep this quiet; broken external links should not break the screen.
    }
  };

  return (
    <Pressable onPress={handleOpen} style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}>
      <View style={styles.linkCopy}>
        <AppText style={styles.linkTitle}>{link.label || fallbackLabel}</AppText>
        {link.subtitle ? <AppText style={styles.linkSubtitle}>{link.subtitle}</AppText> : null}
      </View>
      <Ionicons
        name={link.type === 'pdf' ? 'document-outline' : 'open-outline'}
        size={components.sizes.icon.md}
        color={colors.text.secondary}
      />
    </Pressable>
  );
}

function getTakeaways(content, fallback) {
  const summaryTakeaways = content?.steps?.summary?.takeaways || [];
  if (summaryTakeaways.length > 0) {
    return summaryTakeaways.slice(0, 4);
  }

  const conceptIntro = content?.steps?.concept?.intro;
  const conceptBody = content?.steps?.concept?.body;
  const fallbackItems = [conceptIntro, conceptBody, fallback].filter(Boolean);
  return fallbackItems.slice(0, 3);
}

function getLinksForLesson(lesson, content, glossaryById, resourcesCopy) {
  const queryTitle = encodeURIComponent(`${lesson.title} investing`);
  const termIds = Array.from(collectTermIds(content?.steps || {}));

  const glossaryLinks = termIds
    .map((termId) => glossaryById[termId])
    .filter((term) => term?.learnMoreUrl)
    .map((term) => ({
      id: `term-${lesson.id}-${term.id}`,
      label: term.term,
      subtitle: resourcesCopy.glossaryLabel,
      type: 'site',
      url: term.learnMoreUrl,
    }));

  const fallbackSites = [
    {
      id: `video-${lesson.id}`,
      label: resourcesCopy.fallbackVideo,
      subtitle: 'YouTube',
      type: 'site',
      url: `https://www.youtube.com/results?search_query=${queryTitle}`,
    },
    {
      id: `article-${lesson.id}`,
      label: resourcesCopy.fallbackArticle,
      subtitle: 'Investopedia',
      type: 'site',
      url: `https://www.investopedia.com/search?q=${encodeURIComponent(lesson.title)}`,
    },
  ];

  const pdfLinks = [
    {
      id: `pdf-${lesson.id}`,
      label: resourcesCopy.fallbackPdf,
      subtitle: 'Google',
      type: 'pdf',
      url: `https://www.google.com/search?q=${encodeURIComponent(`${lesson.title} investing filetype:pdf`)}`,
    },
  ];

  return {
    web: dedupeByUrl([...glossaryLinks.slice(0, 2), ...fallbackSites]),
    pdf: dedupeByUrl(pdfLinks),
  };
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

function getStatusLabel(status, resourcesCopy) {
  if (status === 'current') return resourcesCopy.statusCurrent;
  if (status === 'completed') return resourcesCopy.statusCompleted;
  return resourcesCopy.statusUpcoming;
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
    summaryCard: {
      borderWidth: components.borderWidth.thin,
      borderColor: isLight
        ? colors.ui.divider
        : toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      gap: components.layout.spacing.md,
    },
    summaryMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      flexWrap: 'wrap',
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
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    lessonHeaderPressed: {
      opacity: colors.opacity.emphasis,
    },
    lessonHeaderCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
    },
    lessonHeaderRight: {
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    lessonNumber: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    lessonDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    expandedContent: {
      gap: components.layout.spacing.md,
      borderTopWidth: components.borderWidth.thin,
      borderTopColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      paddingTop: components.layout.spacing.md,
    },
    resourceSection: {
      gap: components.layout.spacing.sm,
    },
    sectionLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    takeawayRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: components.layout.spacing.sm,
    },
    takeawayDot: {
      width: components.sizes.dot.sm,
      height: components.sizes.dot.sm,
      borderRadius: components.radius.pill,
      marginTop: components.layout.spacing.sm,
      backgroundColor: colors.accent.primary,
    },
    takeawayText: {
      ...typography.styles.body,
      color: colors.text.primary,
      flex: 1,
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      borderRadius: components.radius.input,
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.sm,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      minHeight: components.sizes.list.minItemHeight,
    },
    linkRowPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    linkCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
      minWidth: 0,
    },
    linkTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    linkSubtitle: {
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
