import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AppText from '../components/AppText';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import OnboardingScreen from '../components/OnboardingScreen';
import TopTabHeader from '../components/TopTabHeader';
import { glossaryCategories, glossaryTerms as rawGlossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  getGlossaryCopy,
  getLocalizedGlossaryCategories,
  getLocalizedGlossaryTerms,
} from '../utils/localization';

const DEFAULT_GLOSSARY_COPY = {
  title: 'Glossary',
  subtitle: 'Find terms fast without leaving your flow.',
  searchPlaceholder: 'Search terms, tags, or categories',
  filterAll: 'All',
  allTerms: 'All terms',
  fallbackTerms: 'Terms',
  termCount: (count) => `${count} terms`,
  noMatches: 'No matches. Try another term.',
  definition: 'Definition',
  example: 'Example',
  watchVideo: 'Watch 2-minute video',
};

export default function GlossaryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { preferences } = useApp();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight, mode),
    [colors, components, tabBarHeight, mode]
  );
  const glossaryCopy = useMemo(
    () => getGlossaryCopy?.(preferences?.language) || DEFAULT_GLOSSARY_COPY,
    [preferences?.language]
  );
  const localizedCategories = useMemo(
    () =>
      getLocalizedGlossaryCategories?.(preferences?.language, glossaryCategories) ||
      glossaryCategories,
    [preferences?.language]
  );
  const localizedTerms = useMemo(
    () =>
      getLocalizedGlossaryTerms?.(preferences?.language, rawGlossaryTerms) ||
      rawGlossaryTerms,
    [preferences?.language]
  );
  const [query, setQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortAz, setSortAz] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLearnMorePending, setIsLearnMorePending] = useState(false);
  const scrollRef = useRef(null);
  const isDutch = (preferences?.language || '').toLowerCase().startsWith('nl');

  const scopedTermIds =
    route?.params?.termIds ||
    route?.params?.lessonTermIds ||
    route?.params?.terms ||
    null;

  const categoriesById = useMemo(() => {
    return localizedCategories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [localizedCategories]);

  const rawTermsById = useMemo(() => {
    return rawGlossaryTerms.reduce((acc, term) => {
      acc[term.id] = term;
      return acc;
    }, {});
  }, []);

  const scopedTerms = useMemo(() => {
    if (!Array.isArray(scopedTermIds) || scopedTermIds.length === 0) {
      return localizedTerms;
    }
    const normalizedIds = scopedTermIds
      .map((value) => (typeof value === 'string' ? value.toLowerCase() : value))
      .filter(Boolean);
    const idSet = new Set(normalizedIds);
    return localizedTerms.filter((term) => {
      const rawTerm = rawTermsById[term.id];
      const termId = term.id?.toLowerCase();
      const termLabel = term.term?.toLowerCase();
      const rawTermLabel = rawTerm?.term?.toLowerCase();
      return idSet.has(termId) || idSet.has(termLabel) || idSet.has(rawTermLabel);
    });
  }, [localizedTerms, rawTermsById, scopedTermIds]);

  const activeCategories = useMemo(() => {
    return localizedCategories.filter((category) =>
      scopedTerms.some((term) => term.categoryId === category.id)
    );
  }, [localizedCategories, scopedTerms]);

  const normalizedQuery = query.trim().toLowerCase();
  const searchedTerms = useMemo(() => {
    if (!normalizedQuery) return scopedTerms;
    return scopedTerms.filter((item) => {
      const category = categoriesById[item.categoryId];
      const haystack = [
        item.term,
        item.definition,
        item.example,
        ...(item.tags || []),
        ...(item.aliases || []),
        category?.title,
        category?.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [categoriesById, normalizedQuery, scopedTerms]);

  const filteredTerms = useMemo(() => {
    if (activeCategory === 'all') return searchedTerms;
    return searchedTerms.filter((term) => term.categoryId === activeCategory);
  }, [activeCategory, searchedTerms]);

  const displayTerms = useMemo(() => {
    if (!sortAz) return filteredTerms;
    return [...filteredTerms].sort((a, b) => a.term.localeCompare(b.term));
  }, [filteredTerms, sortAz]);

  const listTitle =
    activeCategory === 'all'
      ? glossaryCopy.allTerms
      : categoriesById[activeCategory]?.title || glossaryCopy.fallbackTerms;
  const searchAssistiveCopy = normalizedQuery
    ? displayTerms.length === 0
      ? isDutch
        ? 'Geen matches. Probeer een ander woord.'
        : 'No matches. Try another term.'
      : isDutch
        ? `${displayTerms.length} term${displayTerms.length === 1 ? '' : 'en'} gevonden`
        : `${displayTerms.length} term${displayTerms.length === 1 ? '' : 's'} found`
    : isDutch
      ? 'Tik op een term voor een snelle uitleg.'
      : 'Tap a term for a quick explanation.';

  const handleScroll = useCallback(
    (event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setShowScrollTop(offsetY > components.layout.spacing.xxl);
    },
    [components.layout.spacing.xxl]
  );

  const handleScrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const getVideoUrl = (term) => {
    if (!term?.term) return null;
    return (
      term.learnMoreUrl ||
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${term.term} investing explained`
      )}`
    );
  };

  const handleLearnMore = async () => {
    const videoUrl = getVideoUrl(selectedTerm);
    if (!videoUrl || isLearnMorePending) return;
    setIsLearnMorePending(true);
    await new Promise((resolve) => setTimeout(resolve, 120));
    await Linking.openURL(videoUrl);
    setIsLearnMorePending(false);
  };

  const renderTermRow = (term, index, total) => (
    <GlossaryTermRow
      key={term.id}
      term={term}
      index={index}
      total={total}
      isSelected={selectedTerm?.id === term.id}
      onPress={() => setSelectedTerm(term)}
      styles={styles}
      colors={colors}
      components={components}
    />
  );

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
        scrollProps={{
          showsVerticalScrollIndicator: false,
          keyboardShouldPersistTaps: 'handled',
          onScroll: handleScroll,
          scrollEventThrottle: 16,
        }}
        scrollRef={scrollRef}
      >
        <View style={styles.headerBlock}>
          <TopTabHeader
            title={glossaryCopy.title}
            subtitle={glossaryCopy.subtitle}
            onPressProfile={() => navigation.navigate('Profile')}
          />

          <Animated.View entering={FadeInDown.duration(260).delay(40)} style={styles.stickyControls}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder={glossaryCopy.searchPlaceholder}
            />
            <AppText style={styles.searchAssistiveText}>{searchAssistiveCopy}</AppText>
            <View style={styles.chipRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
                style={styles.filterScroll}
              >
                <Pressable
                  onPress={() => setActiveCategory('all')}
                  style={({ pressed }) => [
                    styles.filterChip,
                    activeCategory === 'all' && styles.filterChipActive,
                    pressed && styles.filterChipPressed,
                  ]}
                >
                  <AppText
                    style={[
                      styles.filterChipText,
                      activeCategory === 'all' && styles.filterChipTextActive,
                    ]}
                  >
                    {glossaryCopy.filterAll}
                  </AppText>
                </Pressable>
                {activeCategories.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => setActiveCategory(category.id)}
                      style={({ pressed }) => [
                        styles.filterChip,
                        isActive && styles.filterChipActive,
                        pressed && styles.filterChipPressed,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.filterChipText,
                          isActive && styles.filterChipTextActive,
                        ]}
                      >
                        {category.title}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.duration(300).delay(110)} style={styles.termsBlock}>
          <View style={styles.sortTextRow}>
            <Pressable onPress={() => setSortAz((prev) => !prev)}>
              <View style={styles.sortTextInner}>
                <Ionicons
                  name="swap-vertical"
                  size={components.sizes.icon.xs}
                  color={sortAz ? (mode === 'light' ? colors.text.primary : colors.accent.primary) : colors.text.secondary}
                />
                <AppText
                  style={[styles.sortText, sortAz && styles.sortTextActive]}
                >
                  A-Z
                </AppText>
              </View>
            </Pressable>
          </View>
          <Animated.View layout={LinearTransition.duration(220)}>
            <Card style={styles.termsCard}>
              <View style={styles.termsHeader}>
                <AppText style={styles.termsTitle}>{listTitle}</AppText>
                <AppText style={styles.termsCount}>{glossaryCopy.termCount(displayTerms.length)}</AppText>
              </View>
              {displayTerms.length === 0 ? (
                <AppText style={styles.emptyText}>{glossaryCopy.noMatches}</AppText>
              ) : (
                <Animated.View layout={LinearTransition.duration(220)} style={styles.termList}>
                  {displayTerms.map((term, index) =>
                    renderTermRow(term, index, displayTerms.length)
                  )}
                </Animated.View>
              )}
            </Card>
          </Animated.View>
        </Animated.View>
      </OnboardingScreen>

      {showScrollTop ? (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(140)}>
          <Pressable
            onPress={handleScrollToTop}
            style={({ pressed }) => [
              styles.scrollTopButton,
              pressed && styles.scrollTopButtonPressed,
            ]}
          >
            <Ionicons
              name="chevron-up"
              size={components.sizes.icon.md}
              color={colors.text.primary}
            />
          </Pressable>
        </Animated.View>
      ) : null}

      <BottomSheet
        visible={!!selectedTerm}
        title={selectedTerm?.term}
        onClose={() => setSelectedTerm(null)}
        scrimOpacity={0}
      >
        <View style={styles.sheetSection}>
          <AppText style={styles.sheetLabel}>{glossaryCopy.definition}</AppText>
          <AppText style={styles.sheetDefinition}>{selectedTerm?.definition}</AppText>
        </View>
        <View style={styles.sheetSection}>
          <AppText style={styles.sheetLabel}>{glossaryCopy.example}</AppText>
          <AppText style={styles.sheetExample}>{selectedTerm?.example}</AppText>
        </View>
        {selectedTerm?.term ? (
          <Pressable style={styles.learnMoreRow} onPress={handleLearnMore}>
            <Ionicons
              name="play-circle-outline"
              size={components.sizes.icon.sm}
              color={isLearnMorePending ? colors.accent.primary : colors.text.secondary}
            />
            <AppText style={[styles.learnMoreText, isLearnMorePending && styles.learnMoreTextActive]}>
              {isLearnMorePending
                ? isDutch
                  ? 'Video openen...'
                  : 'Opening video...'
                : glossaryCopy.watchVideo}
            </AppText>
          </Pressable>
        ) : null}
      </BottomSheet>
    </View>
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

const createStyles = (colors, components, tabBarHeight, mode) => {
  const isLight = mode === 'light';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      gap: components.layout.spacing.lg,
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.md,
    },
    headerBlock: {
      gap: components.layout.spacing.lg,
    },
    stickyControls: {
      gap: components.layout.spacing.md,
    },
    searchAssistiveText: {
      ...typography.styles.small,
      color: colors.text.secondary,
      marginTop: -components.layout.spacing.xs,
    },
    chipRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterScroll: {
      flex: 1,
      marginHorizontal: -components.layout.pagePaddingHorizontal,
    },
    filterScrollContent: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: components.layout.spacing.xs,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingRight: components.layout.pagePaddingHorizontal + components.layout.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.xs,
      borderRadius: components.radius.input,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    filterChipActive: {
      backgroundColor: isLight ? colors.text.primary : colors.accent.primary,
      borderColor: isLight ? colors.text.primary : colors.accent.primary,
    },
    filterChipPressed: {
      opacity: colors.opacity.emphasis,
    },
    filterChipText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    filterChipTextActive: {
      color: isLight ? colors.background.surfaceActive : colors.text.onAccent,
    },
    termsBlock: {
      gap: components.layout.spacing.sm,
    },
    sortTextRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    sortTextInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    sortText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    sortTextActive: {
      color: isLight ? colors.text.primary : colors.accent.primary,
    },
    termsCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      gap: components.layout.spacing.md,
    },
    termsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    termsTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    termsCount: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    termList: {
      gap: 0,
    },
    termRow: {
      ...components.list.row,
      paddingVertical: components.layout.spacing.md,
      paddingHorizontal: components.layout.spacing.sm,
      marginHorizontal: -components.layout.spacing.sm,
      borderRadius: components.radius.input,
    },
    termRowSelected: {
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    termDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    termRowPressed: {
      opacity: colors.opacity.emphasis,
    },
    termRowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.sm,
    },
    termTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flex: 1,
    },
    termDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    scrollTopButton: {
      position: 'absolute',
      right: components.layout.spacing.lg,
      bottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.xxl,
      width: components.sizes.square.md,
      height: components.sizes.square.md,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    scrollTopButtonPressed: {
      opacity: colors.opacity.emphasis,
    },
    sheetSection: {
      gap: components.layout.spacing.xs,
    },
    sheetLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    sheetDefinition: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    sheetExample: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    learnMoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      paddingTop: components.layout.spacing.sm,
    },
    learnMoreText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    learnMoreTextActive: {
      color: colors.accent.primary,
    },
  });
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function GlossaryTermRow({
  term,
  index,
  total,
  isSelected,
  onPress,
  styles,
  colors,
  components,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(220).delay(Math.min(index * 35, 240))}
      layout={LinearTransition.duration(220)}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(components.transforms.scalePressed, { duration: 120 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        style={[
          styles.termRow,
          isSelected && styles.termRowSelected,
          index < total - 1 && styles.termDivider,
          animatedStyle,
        ]}
      >
        <View style={styles.termRowTop}>
          <AppText style={styles.termTitle}>{term.term}</AppText>
          <Ionicons
            name="chevron-forward"
            size={components.sizes.icon.sm}
            color={colors.text.secondary}
          />
        </View>
        <AppText style={styles.termDescription} numberOfLines={1}>
          {term.definition}
        </AppText>
      </AnimatedPressable>
    </Animated.View>
  );
}
