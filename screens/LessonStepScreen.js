import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useGlossary } from '../components/GlossaryProvider';
import GlossaryText from '../components/GlossaryText';
import LessonStepContainer from '../components/LessonStepContainer';
import ScreenBackground from '../components/ScreenBackground';
import SelectableOptionButton from '../components/SelectableOptionButton';
import SurfacePillButton from '../components/SurfacePillButton';
import TOPSECTION from '../components/TOPSECTION';
import { glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getScenarioVariant } from '../utils/helpers';
import { collectGlossaryTermIds } from '../utils/glossary';
import {
  getLocaleKey,
  getIntroStepTitle,
  getLessonContent,
  getLessonStepCopy,
} from '../utils/localization';

const TOTAL_STEPS = 6;
const STABLE_CURVE_POINTS = [
  { x: 0, y: 78 },
  { x: 8, y: 75 },
  { x: 16, y: 72 },
  { x: 24, y: 68 },
  { x: 32, y: 66 },
  { x: 40, y: 60 },
  { x: 48, y: 58 },
  { x: 56, y: 52 },
  { x: 64, y: 50 },
  { x: 72, y: 44 },
  { x: 80, y: 40 },
  { x: 88, y: 36 },
  { x: 96, y: 30 },
  { x: 100, y: 26 },
];
const VOLATILE_CURVE_POINTS = [
  { x: 0, y: 50 },
  { x: 15, y: 38 },
  { x: 30, y: 64 },
  { x: 45, y: 42 },
  { x: 60, y: 70 },
  { x: 75, y: 50 },
  { x: 90, y: 78 },
  { x: 100, y: 72 },
];
const L1_ALLOC_PIE_SIZE = 74;
const L1_ALLOC_PIE_RADIUS = 32;
const INTRO_VISUALIZATION_TITLE = '6 stappen vóór beleggen';
const INTRO_VISUALIZATION_SUBTITLE =
  'Het proces vóór je een belegging uitvoert.';
const INTRO_VISUALIZATION_STEPS = [
  {
    id: 'goal',
    label: 'Doelbepaling',
    question: 'Wat wil je met je belegging bereiken?',
    detail:
      'Eerst bepaal je wat je met je geld wil bereiken. Dat doel bepaalt welke stappen daarna volgen.',
  },
  {
    id: 'risk',
    label: 'Individuele risicoanalyse',
    question: 'Hoeveel risico kan en wil ik nemen?',
    detail:
      'De risicoanalyse bepaalt hoeveel risico binnen jouw grenzen blijft, op basis van je tolerantie en je tijdshorizon.',
  },
  {
    id: 'strategy',
    label: 'Financiële investeringsstrategie',
    question: 'Welke aanpak ga je volgen om je doel te bereiken?',
    detail:
      'Hier bepaal je hoe je wil investeren, bijvoorbeeld op lange termijn, actief of passief.',
  },
  {
    id: 'allocation',
    label: 'Kapitaalallocatie',
    question: 'Hoe verdeel je je geld over verschillende beleggingen?',
    detail: 'Hier bepaal je welk deel van je geld naar elke belegging gaat.',
  },
  {
    id: 'vehicle',
    label: 'Beleggingsinstrumenten',
    question: 'In welke soort belegging ga je investeren?',
    detail:
      'Dit zijn de instrumenten waarmee je je plan uitvoert, zoals aandelen, ETF’s of obligaties.',
  },
  {
    id: 'execution',
    label: 'Uitvoering',
    question: 'Hoe voer je je belegging uit?',
    detail:
      'Hier kies je een broker of bank en plaats je de order om je belegging daadwerkelijk aan te kopen.',
  },
];

const polarToCartesian = (cx, cy, radius, angleDeg) => {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
};

const createPieSlicePath = (cx, cy, radius, startDeg, endDeg) => {
  const start = polarToCartesian(cx, cy, radius, startDeg);
  const end = polarToCartesian(cx, cy, radius, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
};

const glossaryTermIndex = glossaryTerms.reduce((acc, term) => {
  if (term?.id) acc[term.id] = term;
  return acc;
}, {});

const getSmoothPoints = (basePoints, samplesPerSegment = 10) => {
  if (basePoints.length < 3) return basePoints;
  const smooth = [];
  for (let i = 0; i < basePoints.length - 1; i += 1) {
    const p0 = basePoints[i - 1] || basePoints[i];
    const p1 = basePoints[i];
    const p2 = basePoints[i + 1];
    const p3 = basePoints[i + 2] || p2;
    for (let step = 0; step <= samplesPerSegment; step += 1) {
      const t = step / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      if (i > 0 && step === 0) continue;
      smooth.push({ x, y });
    }
  }
  return smooth;
};

function useLessonStepStyles() {
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components, mode), [colors, components, mode]);
  return { colors, components, styles, mode };
}

export default function LessonStepScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, step = 1, entrySource } = route.params || {};
  const { userContext, onboardingContext, addReflection, completeLesson, preferences, reflections } = useApp();
  const locale = getLocaleKey(preferences?.language);
  const { colors, components, styles } = useLessonStepStyles();
  const [isLessonGlossaryOpen, setLessonGlossaryOpen] = useState(false);
  const [lessonTermQuery, setLessonTermQuery] = useState('');
  const lessonGlossarySheetMaxHeight = Math.max(
    components.sizes.screen.minPanelHeight,
    Dimensions.get('window').height * 0.72
  );
  const keyboardOffset =
    components.layout.spacing.xxl +
    components.layout.spacing.xl +
    components.layout.spacing.md;
  const glossary = useGlossary();
  const content = getLessonContent(lessonId, preferences?.language);
  const lessonTermIds = useMemo(
    () => collectGlossaryTermIds(content || {}),
    [content]
  );
  const lessonTerms = useMemo(
    () => lessonTermIds.map((termId) => glossaryTermIndex[termId]).filter(Boolean),
    [lessonTermIds]
  );
  const isLessonSearchActive = lessonTermQuery.trim().length > 0;
  const globalSearchResults = useMemo(() => {
    const query = lessonTermQuery.trim().toLowerCase();
    if (!query) return [];
    return glossaryTerms.filter((term) => {
      const name = term.term?.toLowerCase() || '';
      const definition = term.definition?.toLowerCase() || '';
      return name.includes(query) || definition.includes(query);
    });
  }, [lessonTermQuery]);
  const displayedLessonTerms = isLessonSearchActive ? globalSearchResults : lessonTerms;
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  
  useEffect(() => {
    if (!isLessonGlossaryOpen) setLessonTermQuery('');
  }, [isLessonGlossaryOpen]);
  const stepTitle = useMemo(() => {
    if (!content) return `${copy.labels.part} ${step}`;
    const introTitle = getIntroStepTitle(preferences?.language, step);
    switch (step) {
      case 1:
        return content.steps.concept.title;
      case 2:
        return lessonId === 'lesson_0'
          ? INTRO_VISUALIZATION_TITLE
          : introTitle || content.steps.visualization.title;
      case 3:
        return content.steps.scenario.title;
      case 4:
        return content?.steps?.exercise?.title || introTitle || 'Build the process';
      case 5:
        return content?.steps?.reflection?.title || introTitle || 'Reflection';
      case 6:
        if (lessonId === 'lesson_0') return 'Het volledige investeringsproces';
        return locale === 'nl' ? 'Wat je geleerd hebt' : 'What you learned';
      default:
        return `${copy.labels.part} ${step}`;
    }
  }, [content, copy.labels.part, lessonId, locale, step]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      navigation.push('LessonStep', { lessonId, step: step + 1, entrySource });
    }
  };

  // Completion bridge
  const [isCompleting, setIsCompleting] = useState(false);
  const bridgeOverlayOpacity = useSharedValue(0);
  const bridgeBadgeScale = useSharedValue(0.5);
  const bridgeBadgeOpacity = useSharedValue(0);

  const bridgeOverlayStyle = useAnimatedStyle(() => ({
    opacity: bridgeOverlayOpacity.value,
  }));
  const bridgeBadgeStyle = useAnimatedStyle(() => ({
    opacity: bridgeBadgeOpacity.value,
    transform: [{ scale: bridgeBadgeScale.value }],
  }));

  const handleComplete = async () => {
    await completeLesson(lessonId);
    setIsCompleting(true);
    bridgeOverlayOpacity.value = withTiming(1, { duration: 220 });
    bridgeBadgeOpacity.value = withDelay(120, withTiming(1, { duration: 200 }));
    bridgeBadgeScale.value = withDelay(120, withSpring(1, { damping: 12, stiffness: 150 }));
    setTimeout(() => navigation.navigate('LessonSuccess', { lessonId }), 800);
  };

  const handleTermPress = (term) => {
    if (glossary?.openTerm) glossary.openTerm(term);
  };

  const handleLessonTermPress = (term) => {
    setLessonGlossaryOpen(false);
    if (glossary?.openTerm) {
      setTimeout(() => glossary.openTerm(term), 180);
    }
  };

  const disableOuterScroll = lessonId === 'lesson_0' && step === 5;
  let flowPhaseLabel = copy.labels.lessonFlowPhases?.[step] || copy.labels.part;
  if (lessonId === 'lesson_0' && step === 6) {
    flowPhaseLabel = 'Samenvatting';
  }
  const flowMetaLabel = `${flowPhaseLabel} · ${step}/${TOTAL_STEPS}`.toUpperCase();
  const topSectionSubtitle = useMemo(() => {
    if (step === 6 && lessonId !== 'lesson_0') {
      return locale === 'nl'
        ? 'Tik op elk inzicht om te bevestigen dat het is blijven hangen.'
        : 'Tap each insight to confirm what stuck with you.';
    }
    if (lessonId !== 'lesson_0') return null;
    if (step === 2) return INTRO_VISUALIZATION_SUBTITLE;
    if (step === 3) return copy.introScenario.headerHelper;
    if (step === 4) return 'Plaats de stappen van het beleggingsproces in de juiste volgorde.';
    if (step === 6) return 'Herken je het proces in een echte situatie?';
  }, [copy.introScenario.headerHelper, lessonId, locale, step]);

  return (
    <View style={styles.root}>
    <ScreenBackground variant="bg3">
      <LessonStepContainer
        scrollEnabled={!disableOuterScroll && !isLessonGlossaryOpen}
        containerStyle={styles.transparentScreen}
      >
      <TOPSECTION
        step={step}
        total={TOTAL_STEPS}
        title={stepTitle}
        onBack={() => navigation.goBack()}
        onOpenGlossary={() => setLessonGlossaryOpen(true)}
        glossaryLabel={copy.labels.termsInLesson}
        onPressTerm={handleTermPress}
        stepLabel={flowMetaLabel}
        subtitle={topSectionSubtitle}
        showTitle={!(lessonId === 'lesson_0' && step === 1) && step !== 5}
      />

      {step === 1 && (
        <ConceptStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 2 && (
        <VisualizationStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 3 && (lessonId === 'lesson_0' ? (
        <IntroScenarioStep
          content={content}
          onboardingContext={onboardingContext}
          userContext={userContext}
          onNext={handleNext}
          copy={copy}
        />
      ) : (
        <ScenarioStep
          content={content}
          userContext={userContext}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      ))}
      {step === 4 && (
        <ExerciseStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 5 && (
        <ReflectionStep
          content={content}
          onSubmit={async (text, response) => {
            await addReflection(text, lessonId, response);
            handleNext();
          }}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 6 && (
        lessonId === 'lesson_0' ? (
          <IntroSummaryStep
            content={content}
            onComplete={handleComplete}
            onPressTerm={handleTermPress}
            copy={copy}
            language={preferences?.language}
          />
        ) : (
          <SummaryStep
            content={content}
            onComplete={handleComplete}
            onPressTerm={handleTermPress}
            copy={copy}
          />
        )
      )}

      <BottomSheet
        visible={isLessonGlossaryOpen}
        onClose={() => setLessonGlossaryOpen(false)}
        title={copy.labels.termsInLesson}
        sheetStyle={{
          height: lessonGlossarySheetMaxHeight,
          paddingBottom: components.layout.spacing.md,
        }}
        contentStyle={styles.lessonGlossaryContent}
        scrimOpacity={0}
      >
        <FlatList
          data={displayedLessonTerms}
          keyExtractor={(item) => item.id}
          style={styles.lessonGlossaryList}
          contentContainerStyle={styles.lessonGlossaryListContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View style={styles.lessonGlossaryHeader}>
              <View style={styles.lessonGlossarySearch}>
                <Ionicons
                  name="search-outline"
                  size={components.sizes.icon.sm}
                  color={colors.text.secondary}
                />
                <AppTextInput
                  value={lessonTermQuery}
                  onChangeText={setLessonTermQuery}
                  placeholder={copy.labels.searchAllTerms}
                  placeholderTextColor={colors.text.secondary}
                  style={styles.lessonGlossarySearchInput}
                />
                {lessonTermQuery ? (
                  <Pressable
                    onPress={() => setLessonTermQuery('')}
                    hitSlop={components.layout.spacing.xs}
                    style={({ pressed }) => [
                      styles.lessonGlossaryClear,
                      pressed && styles.lessonGlossaryClearPressed,
                    ]}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={components.sizes.icon.sm}
                      color={colors.text.secondary}
                    />
                  </Pressable>
                ) : null}
              </View>
              {isLessonSearchActive ? (
                <AppText style={styles.lessonGlossarySearchLabel}>
                  {copy.labels.fullGlossaryResults}
                </AppText>
              ) : null}
            </View>
          }
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleLessonTermPress(item)}
              style={[
                styles.lessonGlossaryRow,
                index < displayedLessonTerms.length - 1 && styles.lessonGlossaryDivider,
              ]}
            >
              <View style={styles.lessonGlossaryRowTop}>
                <AppText style={styles.lessonGlossaryTitle}>{item.term}</AppText>
                <Ionicons
                  name="chevron-forward"
                  size={components.sizes.icon.sm}
                  color={colors.text.secondary}
                />
              </View>
              <AppText style={styles.lessonGlossaryDescription} numberOfLines={1}>
                {item.definition}
              </AppText>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.lessonGlossaryEmpty}>
              <AppText style={styles.lessonGlossaryEmptyTitle}>
                {isLessonSearchActive
                  ? 'No matching terms found.'
                  : 'No terms defined for this lesson yet.'}
              </AppText>
            </View>
          }
        />
      </BottomSheet>

      </LessonStepContainer>
    </ScreenBackground>

    {/* Completion bridge overlay */}
    {isCompleting && (
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.bridgeOverlay, { backgroundColor: colors.background.app }, bridgeOverlayStyle]}
        pointerEvents="box-only"
      >
        <Animated.View style={[styles.bridgeBadge, { backgroundColor: colors.accent.primary }, bridgeBadgeStyle]}>
          <AppText style={[styles.bridgeCheck, { color: colors.text.onAccent }]}>✓</AppText>
        </Animated.View>
      </Animated.View>
    )}
    </View>
  );
}

function ConceptStep({ content, lessonId, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();

  if (lessonId === 'lesson_0') {
    return <IntroConceptStep content={content} onNext={onNext} copy={copy} />;
  }

  return (
    <View style={styles.stepBody}>
      <Card style={styles.conceptCard}>
        <GlossaryText
          text={content?.steps?.concept?.body}
          style={styles.bodyText}
          onPressTerm={onPressTerm}
        />
        <View style={styles.visualHint}>
          <View style={[styles.hintBar, styles.hintBarXs]} />
          <View style={[styles.hintBar, styles.hintBarSm]} />
          <View style={[styles.hintBar, styles.hintBarMd]} />
          <View style={[styles.hintBar, styles.hintBarLg]} />
        </View>
        <GlossaryText
          text={content?.steps?.concept?.visualHint}
          style={styles.caption}
          onPressTerm={onPressTerm}
        />
      </Card>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function IntroConceptStep({ content, onNext, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const intro = content?.steps?.concept?.intro;
  const introSubtitleNl =
    'Investeren werkt wanneer elke beslissing voortbouwt op de vorige.';
  const isLessonSubtitle = intro === introSubtitleNl;
  const steps = copy.introConcept.steps;
  const [activeIndex, setActiveIndex] = useState(null);
  const paragraph = copy.introConcept.paragraph;

  return (
    <View style={styles.stepBody}>
      <View style={styles.conceptDef}>
        <AppText style={styles.conceptDefTitle}>{copy.introConcept.title}</AppText>
        <AppText style={styles.conceptDefBody}>{paragraph}</AppText>
      </View>

      <View style={styles.conceptTrackWrap}>
        <View style={styles.conceptTrackHeader}>
          <AppText style={styles.conceptTrackHeaderLabel}>{copy.introConcept.processTitle}</AppText>
          <AppText style={styles.conceptTrackHeaderHint}>{copy.introConcept.processHint}</AppText>
        </View>
        <View style={styles.conceptTrack}>
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            return (
              <View key={step.id}>
                <Pressable
                  onPress={() =>
                    setActiveIndex((prev) => (prev === index ? null : index))
                  }
                  style={styles.conceptTrackRow}
                >
                  <View
                    style={[
                      styles.conceptTrackBar,
                      isActive && styles.conceptTrackBarActive,
                      isFirst && styles.conceptTrackBarFirst,
                      isLast && styles.conceptTrackBarLast,
                    ]}
                  />
                  <View style={styles.conceptTrackBody}>
                    <View style={styles.conceptTrackBodyRow}>
                      <AppText
                        style={[
                          styles.conceptTrackIndex,
                          isActive && styles.conceptTrackIndexActive,
                        ]}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </AppText>
                      <View style={styles.conceptTrackContent}>
                        <AppText style={styles.conceptTrackName}>{step.label}</AppText>
                      </View>
                      <Ionicons
                        name={isActive ? 'chevron-down' : 'chevron-forward'}
                        size={components.sizes.icon.sm}
                        color={isActive ? colors.accent.primary : colors.text.secondary}
                      />
                    </View>
                    {isActive ? (
                      <AppText style={styles.conceptTrackDetail}>{step.detail}</AppText>
                    ) : null}
                  </View>
                </Pressable>
                {!isLast ? <View style={styles.conceptTrackDivider} /> : null}
              </View>
            );
          })}
        </View>
      </View>

      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function IntroVisualizationStep({ onNext, copy, lessonId }) {
  return <Lesson1VisualizationStep onNext={onNext} copy={copy} lessonId={lessonId} />;
}

function JourneyFlipCard({ step, index, copy, styles, colors, components }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);

  useEffect(() => {
    flipProgress.value = withTiming(isFlipped ? 1 : 0, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });
  }, [flipProgress, isFlipped]);

  const frontStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipProgress.value, [0, 1], [0, 180]);
    const opacity = interpolate(
      flipProgress.value,
      [0, 0.48, 0.55, 1],
      [1, 1, 0, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotate}deg` }],
      opacity,
      zIndex: flipProgress.value < 0.5 ? 2 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipProgress.value, [0, 1], [180, 360]);
    const opacity = interpolate(
      flipProgress.value,
      [0, 0.45, 0.52, 1],
      [0, 0, 1, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotate}deg` }],
      opacity,
      zIndex: flipProgress.value >= 0.5 ? 2 : 0,
    };
  });

  return (
    <Pressable onPress={() => setIsFlipped((prev) => !prev)} style={styles.journeyCardShell}>
      <View style={styles.journeyFlipCard}>
        <Animated.View style={[styles.journeyFace, styles.journeyPage, frontStyle]}>
          <View style={styles.journeyHeaderRow}>
            <View style={styles.journeyStepChip}>
              <AppText style={styles.journeyStepText}>
                {`${index + 1}`.padStart(2, '0')}
              </AppText>
            </View>
            <View style={styles.journeyAccent} />
          </View>
          <AppText style={styles.journeyLabel}>{step.label}</AppText>
          <AppText style={styles.journeyQuestion}>{step.question}</AppText>
          <View style={styles.journeyVisual}>
            <JourneyStepAnimation
              stepId={step.id}
              styles={styles}
              colors={colors}
            />
          </View>
          <AppText style={styles.journeyWhy}>{step.why}</AppText>
          <AppText style={styles.journeyTapHint}>{copy.labels.tapDetails}</AppText>
        </Animated.View>

        <Animated.View style={[styles.journeyFace, styles.journeyPage, styles.journeyBackFace, backStyle]}>
          <View style={styles.journeyHeaderRow}>
            <View style={styles.journeyStepChip}>
              <AppText style={styles.journeyStepText}>
                {`${index + 1}`.padStart(2, '0')}
              </AppText>
            </View>
            <View style={styles.journeyBackBadge}>
              <Ionicons
                name="sparkles-outline"
                size={components.sizes.icon.sm}
                color={colors.text.secondary}
              />
              <AppText style={styles.journeyBackBadgeText}>{copy.labels.insight}</AppText>
            </View>
          </View>
          <AppText style={styles.journeyLabel}>{step.label}</AppText>
          <AppText style={styles.journeyDetail}>{step.detail}</AppText>
          <AppText style={styles.journeyTapHint}>{copy.labels.tapReturn}</AppText>
        </Animated.View>
      </View>
    </Pressable>
  );
}

function JourneyStepAnimation({ stepId, styles, colors }) {
  switch (stepId) {
    case 'goal':
      return <GoalStepAnimation styles={styles} colors={colors} />;
    case 'risk':
      return <RiskStepAnimation styles={styles} colors={colors} />;
    case 'strategy':
      return <StrategyStepAnimation styles={styles} colors={colors} />;
    case 'allocation':
      return <AllocationStepAnimation styles={styles} colors={colors} />;
    case 'vehicle':
      return <VehicleStepAnimation styles={styles} colors={colors} />;
    case 'execution':
      return <ExecutionStepAnimation styles={styles} colors={colors} />;
    default:
      return (
        <View style={styles.journeyAnimCanvas}>
          <AppText style={styles.journeyPlaceholderText}>{stepId}</AppText>
        </View>
      );
  }
}

function GoalStepAnimation({ styles, colors }) {
  const pulse = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    drift.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [drift, pulse]);

  const pulseRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.88, 1.26]) }],
    opacity: interpolate(pulse.value, [0, 1], [0.42, 0.12]),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(drift.value, [0, 1], [-36, 36]) }],
  }));

  return (
    <View style={styles.journeyAnimCanvas}>
      <View style={styles.goalTrack} />
      <Animated.View
        style={[
          styles.goalPulseRing,
          { borderColor: toRgba(colors.accent.primary, 0.45) },
          pulseRingStyle,
        ]}
      />
      <View style={styles.goalTarget} />
      <Animated.View style={[styles.goalDot, dotStyle]} />
    </View>
  );
}

function RiskStepAnimation({ styles }) {
  const swing = useSharedValue(0);

  useEffect(() => {
    swing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [swing]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(swing.value, [0, 1], [-22, 22])}deg` }],
  }));

  const leftBarStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: interpolate(swing.value, [0, 1], [1.2, 0.72]) }],
    opacity: interpolate(swing.value, [0, 1], [1, 0.5]),
  }));

  const rightBarStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: interpolate(swing.value, [0, 1], [0.72, 1.2]) }],
    opacity: interpolate(swing.value, [0, 1], [0.5, 1]),
  }));

  return (
    <View style={styles.journeyAnimCanvas}>
      <View style={styles.riskBarRow}>
        <Animated.View style={[styles.riskBar, leftBarStyle]} />
        <Animated.View style={[styles.riskBar, rightBarStyle]} />
      </View>
      <View style={styles.riskGaugeBase} />
      <View style={styles.riskGaugePivot} />
      <Animated.View style={[styles.riskNeedle, needleStyle]} />
    </View>
  );
}

function StrategyStepAnimation({ styles }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, [progress]);

  const tokenStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-52, 52]) },
      { translateY: interpolate(progress.value, [0, 0.5, 1], [4, -8, 4]) },
    ],
  }));

  const nodeOneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.1, 0.3], [0.35, 1, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 0.1, 0.3], [0.84, 1.12, 1]) }],
  }));
  const nodeTwoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.2, 0.5, 0.7], [0.35, 1, 1]),
    transform: [{ scale: interpolate(progress.value, [0.2, 0.5, 0.7], [0.84, 1.12, 1]) }],
  }));
  const nodeThreeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.6, 0.85, 1], [0.35, 1, 1]),
    transform: [{ scale: interpolate(progress.value, [0.6, 0.85, 1], [0.84, 1.12, 1]) }],
  }));

  return (
    <View style={styles.journeyAnimCanvas}>
      <View style={styles.strategyRail} />
      <View style={styles.strategyNodeRow}>
        <Animated.View style={[styles.strategyNode, nodeOneStyle]} />
        <Animated.View style={[styles.strategyNode, nodeTwoStyle]} />
        <Animated.View style={[styles.strategyNode, nodeThreeStyle]} />
      </View>
      <Animated.View style={[styles.strategyToken, tokenStyle]} />
    </View>
  );
}

function AllocationStepAnimation({ styles }) {
  const mix = useSharedValue(0);

  useEffect(() => {
    mix.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [mix]);

  const segmentAStyle = useAnimatedStyle(() => ({
    flex: interpolate(mix.value, [0, 1], [5.2, 4.1]),
  }));
  const segmentBStyle = useAnimatedStyle(() => ({
    flex: interpolate(mix.value, [0, 1], [3.2, 4.4]),
  }));
  const segmentCStyle = useAnimatedStyle(() => ({
    flex: interpolate(mix.value, [0, 1], [1.6, 2.2]),
  }));

  return (
    <View style={styles.journeyAnimCanvas}>
      <View style={styles.allocationBar}>
        <Animated.View style={[styles.allocationSegmentPrimary, segmentAStyle]} />
        <Animated.View style={[styles.allocationSegmentSecondary, segmentBStyle]} />
        <Animated.View style={[styles.allocationSegmentTertiary, segmentCStyle]} />
      </View>
      <View style={styles.allocationLegend}>
        <View style={styles.allocationLegendItem}>
          <View style={styles.allocationDotPrimary} />
          <AppText style={styles.allocationLegendText}>A</AppText>
        </View>
        <View style={styles.allocationLegendItem}>
          <View style={styles.allocationDotSecondary} />
          <AppText style={styles.allocationLegendText}>B</AppText>
        </View>
        <View style={styles.allocationLegendItem}>
          <View style={styles.allocationDotTertiary} />
          <AppText style={styles.allocationLegendText}>C</AppText>
        </View>
      </View>
    </View>
  );
}

function VehicleStepAnimation({ styles, colors }) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [float]);

  const firstCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [8, -8]) }],
    opacity: interpolate(float.value, [0, 1], [0.7, 1]),
  }));
  const secondCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [-2, 4]) }],
    opacity: interpolate(float.value, [0, 1], [1, 0.78]),
  }));
  const thirdCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [4, -4]) }],
    opacity: interpolate(float.value, [0, 1], [0.72, 1]),
  }));

  return (
    <View style={styles.journeyAnimCanvas}>
      <View style={styles.vehicleRow}>
        <Animated.View style={[styles.vehicleChip, firstCardStyle]}>
          <Ionicons name="trending-up-outline" size={18} color={colors.text.primary} />
        </Animated.View>
        <Animated.View style={[styles.vehicleChip, secondCardStyle]}>
          <Ionicons name="stats-chart-outline" size={18} color={colors.text.primary} />
        </Animated.View>
        <Animated.View style={[styles.vehicleChip, thirdCardStyle]}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.text.primary} />
        </Animated.View>
      </View>
      <View style={styles.vehicleTrack} />
    </View>
  );
}

function ExecutionStepAnimation({ styles }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, [progress]);

  const runnerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-56, 56]) }],
  }));

  const checkOneStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 0.2, 0.4], [0.85, 1.12, 1]) }],
    opacity: interpolate(progress.value, [0, 0.2, 0.4], [0.4, 1, 1]),
  }));
  const checkTwoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0.25, 0.5, 0.75], [0.85, 1.12, 1]) }],
    opacity: interpolate(progress.value, [0.25, 0.5, 0.75], [0.4, 1, 1]),
  }));
  const checkThreeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0.6, 0.85, 1], [0.85, 1.12, 1]) }],
    opacity: interpolate(progress.value, [0.6, 0.85, 1], [0.4, 1, 1]),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 0.5, 1], [0.94, 1.05, 0.94]) }],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.75, 1, 0.75]),
  }));

  return (
    <View style={styles.journeyAnimCanvas}>
      <View style={styles.executionRail} />
      <View style={styles.executionCheckpointRow}>
        <Animated.View style={[styles.executionCheckpoint, checkOneStyle]} />
        <Animated.View style={[styles.executionCheckpoint, checkTwoStyle]} />
        <Animated.View style={[styles.executionCheckpoint, checkThreeStyle]} />
      </View>
      <Animated.View style={[styles.executionRunner, runnerStyle]} />
      <Animated.View style={[styles.executionPulse, pulseStyle]} />
    </View>
  );
}

// ─── Lesson 1: Process Visualization Grid ─────────────────────────────────────

function Lesson1VisualizationStep({ onNext, copy, lessonId }) {
  const { styles, colors } = useLessonStepStyles();
  const isGuidedSequence = lessonId === 'lesson_0';
  const steps = isGuidedSequence ? INTRO_VISUALIZATION_STEPS : copy.introVisualization.steps;
  const [completedSteps, setCompletedSteps] = useState(() => steps.map(() => false));

  useEffect(() => {
    setCompletedSteps(steps.map(() => false));
  }, [steps.length, isGuidedSequence]);

  const firstIncompleteIndex = completedSteps.findIndex((isDone) => !isDone);
  const activeIndex = firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex;
  const allCompleted = !isGuidedSequence || (steps.length > 0 && completedSteps.every(Boolean));

  const handleStepCompleted = (index) => {
    if (!isGuidedSequence) return;
    setCompletedSteps((previous) => {
      if (previous[index]) return previous;
      const next = [...previous];
      next[index] = true;
      return next;
    });
  };

  return (
    <View style={[styles.stepBody, styles.l1VisBody]}>
      <View style={styles.l1VisGrid}>
        {steps.map((step, index) => {
          const isCompleted = isGuidedSequence ? completedSteps[index] : false;
          const isLocked = isGuidedSequence ? !isCompleted && index > activeIndex : false;
          const isActive = isGuidedSequence ? !isCompleted && index === activeIndex : true;

          return (
            <ProcessGridFlipCard
              key={step.id}
              step={step}
              index={index}
              styles={styles}
              colors={colors}
              isActive={isActive}
              isCompleted={isCompleted}
              isLocked={isLocked}
              onStepCompleted={() => handleStepCompleted(index)}
            />
          );
        })}
      </View>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} disabled={!allCompleted} />
    </View>
  );
}

function ProcessGridFlipCard({
  step,
  index,
  styles,
  colors,
  isActive,
  isCompleted,
  isLocked,
  onStepCompleted,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);
  const activePulse = useSharedValue(0);

  useEffect(() => {
    if (isLocked && isFlipped) setIsFlipped(false);
  }, [isLocked, isFlipped]);

  useEffect(() => {
    flipProgress.value = withTiming(isFlipped ? 1 : 0, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });
  }, [flipProgress, isFlipped]);

  useEffect(() => {
    if (!isActive) {
      activePulse.value = 0;
      return;
    }
    activePulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [activePulse, isActive]);

  const frontStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipProgress.value, [0, 1], [0, 180]);
    const opacity = interpolate(
      flipProgress.value,
      [0, 0.48, 0.55, 1],
      [1, 1, 0, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotate}deg` }],
      opacity,
      zIndex: flipProgress.value < 0.5 ? 2 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipProgress.value, [0, 1], [180, 360]);
    const opacity = interpolate(
      flipProgress.value,
      [0, 0.45, 0.52, 1],
      [0, 0, 1, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotate}deg` }],
      opacity,
      zIndex: flipProgress.value >= 0.5 ? 2 : 0,
    };
  });

  const activePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(activePulse.value, [0, 1], [0.82, 1.45]) }],
    opacity: interpolate(activePulse.value, [0, 1], [0.38, 0]),
  }));

  const handlePress = () => {
    if (isLocked) return;
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && !isCompleted) onStepCompleted?.();
  };

  const stepCode = `STEP ${`${index + 1}`.padStart(2, '0')}`;
  const frontCtaLabel = isLocked ? 'Bekijk eerst de stappen hierboven' : 'Bekijk';
  const backCtaLabel = 'Terug';

  const renderStatusIndicator = () => {
    if (isCompleted) {
      return (
        <View style={[styles.l1StatusBadge, styles.l1StatusBadgeCompleted]}>
          <Ionicons name="checkmark" size={14} color={colors.accent.primary} />
        </View>
      );
    }
    if (isLocked) {
      return (
        <View style={[styles.l1StatusBadge, styles.l1StatusBadgeLocked]}>
          <Ionicons name="lock-closed" size={12} color={colors.text.secondary} />
        </View>
      );
    }
    return (
      <View style={[styles.l1StatusBadge, styles.l1StatusBadgeActive]}>
        <Animated.View style={[styles.l1StatusPulse, activePulseStyle]} />
        <View style={styles.l1StatusDot} />
      </View>
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLocked}
      style={[
        styles.l1CardShell,
        isActive && styles.l1CardShellActive,
        isCompleted && styles.l1CardShellCompleted,
        isLocked && styles.l1CardShellLocked,
      ]}
    >
      <View style={styles.l1FlipCard}>
        <Animated.View
          style={[
            styles.l1Face,
            styles.l1Page,
            styles.l1FrontPage,
            isActive && styles.l1PageActive,
            isCompleted && styles.l1PageCompleted,
            isLocked && styles.l1PageLocked,
            frontStyle,
          ]}
        >
          <View style={styles.l1CardHeaderRow}>
            <View style={styles.l1StepMeta}>
              <AppText style={styles.l1StepKicker}>{stepCode}</AppText>
              <AppText style={styles.l1CardLabel} numberOfLines={2}>
                {step.label}
              </AppText>
            </View>
            {renderStatusIndicator()}
          </View>
          <View
            style={[
              styles.l1AnimStateWrap,
              isCompleted && styles.l1AnimStateCompleted,
              isLocked && styles.l1AnimStateLocked,
            ]}
          >
            <ProcessGridStepAnimation stepId={step.id} styles={styles} colors={colors} />
          </View>
          <AppText style={[styles.l1TapHint, isLocked && styles.l1TapHintLocked]}>
            {frontCtaLabel}
          </AppText>
        </Animated.View>

        <Animated.View
          style={[
            styles.l1Face,
            styles.l1Page,
            styles.l1BackPage,
            isCompleted && styles.l1PageCompleted,
            backStyle,
          ]}
        >
          <View style={styles.l1CardHeaderRow}>
            <View style={styles.l1StepMeta}>
              <AppText style={styles.l1StepKicker}>{stepCode}</AppText>
              <AppText style={styles.l1BackLabel}>{step.question}</AppText>
            </View>
            {renderStatusIndicator()}
          </View>
          <AppText style={styles.l1BackDetail}>{step.detail}</AppText>
          <AppText style={styles.l1TapHint}>{backCtaLabel}</AppText>
        </Animated.View>
      </View>
    </Pressable>
  );
}

function ProcessGridStepAnimation({ stepId, styles, colors }) {
  switch (stepId) {
    case 'goal':
      return <GoalGridAnim styles={styles} colors={colors} />;
    case 'risk':
      return <RiskGridAnim styles={styles} />;
    case 'strategy':
      return <StrategyGridAnim styles={styles} />;
    case 'allocation':
      return <AllocationGridAnim styles={styles} colors={colors} />;
    case 'vehicle':
      return <VehicleGridAnim styles={styles} />;
    case 'execution':
      return <ExecutionGridAnim styles={styles} />;
    default:
      return null;
  }
}

// ─ 1. GOAL: a dot spirals inward and shrinks until it locks on the goal ────────
function GoalGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 3600, easing: Easing.linear }), -1, false);
  }, [phase]);

  const orbitDotStyle = useAnimatedStyle(() => {
    const travel = interpolate(phase.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    const turns = 2.2;
    const angle = travel * Math.PI * 2 * turns + Math.PI * 0.15;
    const radius = interpolate(travel, [0, 0.78, 1], [34, 8, 0], Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: Math.cos(angle) * radius },
        { translateY: Math.sin(angle) * radius },
        { scale: interpolate(travel, [0, 0.78, 1], [1, 0.55, 0.3], Extrapolation.CLAMP) },
      ],
    };
  });

  const lockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0, 0.72, 0.84, 1], [1, 1, 1.25, 1], Extrapolation.CLAMP) }],
  }));

  const centerDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0, 0.78, 0.9, 1], [0.9, 0.9, 1.1, 1], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={styles.l1AnimCanvas}>
      <Animated.View style={[styles.l1GoalLockRing, lockStyle]} />
      <Animated.View style={[styles.l1GoalChosenDot, styles.l1GoalChosenDotAccent, centerDotStyle]} />
      <Animated.View style={[styles.l1GoalChosenDot, orbitDotStyle]} />
    </View>
  );
}

// ─ 2. RISK: clean and simple chart motion ──────────────────────────────────────
function RiskGridAnim({ styles }) {
  const phase = useSharedValue(0);
  const volatilePoints = useMemo(
    () => [
      { x: -42, y: 16 },
      { x: -30, y: -4 },
      { x: -18, y: 10 },
      { x: -6, y: -8 },
      { x: 8, y: 6 },
      { x: 22, y: -12 },
      { x: 34, y: -2 },
      { x: 42, y: -8 },
    ],
    []
  );
  const stablePoints = useMemo(
    () => [
      { x: -42, y: 14 },
      { x: -30, y: 11 },
      { x: -18, y: 8 },
      { x: -6, y: 5 },
      { x: 8, y: 2 },
      { x: 22, y: -1 },
      { x: 34, y: -4 },
      { x: 42, y: -6 },
    ],
    []
  );

  const toSegments = (points, keyPrefix) =>
    points.slice(0, -1).map((point, index) => {
      const next = points[index + 1];
      const dx = next.x - point.x;
      const dy = next.y - point.y;
      return {
        key: `${keyPrefix}-${index}`,
        width: Math.hypot(dx, dy),
        x: point.x + dx / 2,
        y: point.y + dy / 2,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      };
    });

  const volatileSegments = useMemo(() => toSegments(volatilePoints, 'risk-vol'), [volatilePoints]);
  const stableSegments = useMemo(() => toSegments(stablePoints, 'risk-stable'), [stablePoints]);

  const volatileInput = useMemo(
    () => volatilePoints.map((_, index) => index / (volatilePoints.length - 1)),
    [volatilePoints]
  );
  const stableInput = useMemo(
    () => stablePoints.map((_, index) => index / (stablePoints.length - 1)),
    [stablePoints]
  );
  const volatileX = useMemo(() => volatilePoints.map((point) => point.x), [volatilePoints]);
  const volatileY = useMemo(() => volatilePoints.map((point) => point.y), [volatilePoints]);
  const stableX = useMemo(() => stablePoints.map((point) => point.x), [stablePoints]);
  const stableY = useMemo(() => stablePoints.map((point) => point.y), [stablePoints]);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.linear }), -1, false);
  }, [phase]);

  const volatileDotStyle = useAnimatedStyle(() => {
    const travel = interpolate(phase.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: interpolate(travel, volatileInput, volatileX, Extrapolation.CLAMP) },
        { translateY: interpolate(travel, volatileInput, volatileY, Extrapolation.CLAMP) },
      ],
    };
  });

  const stableDotStyle = useAnimatedStyle(() => {
    const travel = interpolate(phase.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: interpolate(travel, stableInput, stableX, Extrapolation.CLAMP) },
        { translateY: interpolate(travel, stableInput, stableY, Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1RiskSingleChart}>
        <View style={[styles.l1RiskGridH, { transform: [{ translateY: -16 }] }]} />
        <View style={styles.l1RiskGridH} />
        <View style={[styles.l1RiskGridH, { transform: [{ translateY: 16 }] }]} />
        {stableSegments.map((segment) => (
          <View
            key={segment.key}
            style={[
              styles.l1RiskStableSegment,
              {
                width: segment.width,
                transform: [
                  { translateX: segment.x },
                  { translateY: segment.y },
                  { rotate: `${segment.angle}deg` },
                ],
              },
            ]}
          />
        ))}
        {volatileSegments.map((segment) => (
          <View
            key={segment.key}
            style={[
              styles.l1RiskVolSegment,
              {
                width: segment.width,
                transform: [
                  { translateX: segment.x },
                  { translateY: segment.y },
                  { rotate: `${segment.angle}deg` },
                ],
              },
            ]}
          />
        ))}
        <Animated.View style={[styles.l1RiskStableDot, stableDotStyle]} />
        <Animated.View style={[styles.l1RiskVolDot, volatileDotStyle]} />
      </View>
    </View>
  );
}

// ─ 3. STRATEGY: scattered nodes converge, then routes connect into a plan ─────
function StrategyGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 4800, easing: Easing.linear }), -1, false);
  }, [phase]);

  // 4 nodes appear with staggered pop, then connector lines draw between them
  const n0 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.08, 0.16], [0, 1], Extrapolation.CLAMP) }],
  }));
  const n1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.22, 0.30], [0, 1], Extrapolation.CLAMP) }],
  }));
  const n2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.36, 0.44], [0, 1], Extrapolation.CLAMP) }],
  }));
  const n3 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.50, 0.58], [0, 1], Extrapolation.CLAMP) }],
  }));

  // Connector lines draw in (scaleX from 0→1) after each pair of nodes appears
  const l0 = useAnimatedStyle(() => ({
    transform: [{ scaleX: interpolate(phase.value, [0.16, 0.26], [0, 1], Extrapolation.CLAMP) }],
  }));
  const l1 = useAnimatedStyle(() => ({
    transform: [{ scaleX: interpolate(phase.value, [0.30, 0.40], [0, 1], Extrapolation.CLAMP) }],
  }));
  const l2 = useAnimatedStyle(() => ({
    transform: [{ scaleX: interpolate(phase.value, [0.44, 0.54], [0, 1], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1StratRow}>
        <Animated.View style={[styles.l1StratNodeDot, n0]} />
        <Animated.View style={[styles.l1StratConnLine, l0]} />
        <Animated.View style={[styles.l1StratNodeDot, n1]} />
        <Animated.View style={[styles.l1StratConnLine, l1]} />
        <Animated.View style={[styles.l1StratNodeDot, styles.l1StratNodeAccent, n2]} />
        <Animated.View style={[styles.l1StratConnLine, l2]} />
        <Animated.View style={[styles.l1StratNodeDot, n3]} />
      </View>
    </View>
  );
}

// ─ 4. ALLOCATION: filled pie slices assemble into one full circle ───────────────
function AllocationGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);
  const slicePaths = useMemo(() => {
    const c = L1_ALLOC_PIE_SIZE / 2;
    return [
      createPieSlicePath(c, c, L1_ALLOC_PIE_RADIUS, -90, 30),
      createPieSlicePath(c, c, L1_ALLOC_PIE_RADIUS, 30, 150),
      createPieSlicePath(c, c, L1_ALLOC_PIE_RADIUS, 150, 270),
    ];
  }, []);
  const sliceColors = useMemo(
    () => [
      toRgba(colors.text.primary, 0.96),
      toRgba(colors.accent.primary, 0.38),
      toRgba(colors.text.primary, 0.62),
    ],
    [colors.accent.primary, colors.text.primary]
  );

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, [phase]);

  const piece1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(phase.value, [0, 0.62, 1], [-34, 0, 0], Extrapolation.CLAMP) },
      { translateY: interpolate(phase.value, [0, 0.62, 1], [-26, 0, 0], Extrapolation.CLAMP) },
      { rotate: `${interpolate(phase.value, [0, 0.62, 1], [-20, 0, 0], Extrapolation.CLAMP)}deg` },
    ],
  }));
  const piece2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(phase.value, [0, 0.62, 1], [34, 0, 0], Extrapolation.CLAMP) },
      { translateY: interpolate(phase.value, [0, 0.62, 1], [-14, 0, 0], Extrapolation.CLAMP) },
      { rotate: `${interpolate(phase.value, [0, 0.62, 1], [18, 0, 0], Extrapolation.CLAMP)}deg` },
    ],
  }));
  const piece3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(phase.value, [0, 0.62, 1], [-10, 0, 0], Extrapolation.CLAMP) },
      { translateY: interpolate(phase.value, [0, 0.62, 1], [36, 0, 0], Extrapolation.CLAMP) },
      { rotate: `${interpolate(phase.value, [0, 0.62, 1], [14, 0, 0], Extrapolation.CLAMP)}deg` },
    ],
  }));
  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1AllocWrap}>
        <Animated.View style={[styles.l1AllocSliceLayer, piece1Style]}>
          <Svg width={L1_ALLOC_PIE_SIZE} height={L1_ALLOC_PIE_SIZE}>
            <Path d={slicePaths[0]} fill={sliceColors[0]} />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.l1AllocSliceLayer, piece2Style]}>
          <Svg width={L1_ALLOC_PIE_SIZE} height={L1_ALLOC_PIE_SIZE}>
            <Path d={slicePaths[1]} fill={sliceColors[1]} />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.l1AllocSliceLayer, piece3Style]}>
          <Svg width={L1_ALLOC_PIE_SIZE} height={L1_ALLOC_PIE_SIZE}>
            <Path d={slicePaths[2]} fill={sliceColors[2]} />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

// ─ 5. VEHICLE: 3 instrument tokens, one selected at a time in rotation ────────
function VehicleGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 4800, easing: Easing.linear }), -1, false);
  }, [phase]);

  // Each token is highlighted in turn: BOND 0.08–0.38, ETF 0.38–0.68, STOCK 0.68–0.92
  const t0 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.08, 0.14, 0.32, 0.38], [0.86, 1.06, 1.06, 0.86], Extrapolation.CLAMP) }],
  }));
  const t1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.38, 0.44, 0.62, 0.68], [0.86, 1.06, 1.06, 0.86], Extrapolation.CLAMP) }],
  }));
  const t2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.68, 0.74, 0.86, 0.92], [0.86, 1.06, 1.06, 0.86], Extrapolation.CLAMP) }],
  }));

  // Selection indicator — accent dot below selected token
  const sel0 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.08, 0.14, 0.32, 0.38], [0, 1, 1, 0], Extrapolation.CLAMP) }],
  }));
  const sel1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.38, 0.44, 0.62, 0.68], [0, 1, 1, 0], Extrapolation.CLAMP) }],
  }));
  const sel2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.68, 0.74, 0.86, 0.92], [0, 1, 1, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1VehicleTokenRow}>
        <View style={styles.l1VehicleTokenWrap}>
          <Animated.View style={[styles.l1VehicleToken, t0]}>
            <AppText style={styles.l1VehicleTokenLabel}>BOND</AppText>
          </Animated.View>
          <Animated.View style={[styles.l1VehicleSelDot, sel0]} />
        </View>
        <View style={styles.l1VehicleTokenWrap}>
          <Animated.View style={[styles.l1VehicleToken, t1]}>
            <AppText style={styles.l1VehicleTokenLabel}>ETF</AppText>
          </Animated.View>
          <Animated.View style={[styles.l1VehicleSelDot, sel1]} />
        </View>
        <View style={styles.l1VehicleTokenWrap}>
          <Animated.View style={[styles.l1VehicleToken, t2]}>
            <AppText style={styles.l1VehicleTokenLabel}>STOCK</AppText>
          </Animated.View>
          <Animated.View style={[styles.l1VehicleSelDot, sel2]} />
        </View>
      </View>
    </View>
  );
}

// ─ 6. EXECUTION: 5 prior steps check off, then one precise fire action ────────
function ExecutionGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 4600, easing: Easing.linear }), -1, false);
  }, [phase]);

  // 5 check dots appear in sequence — each pops in with a crisp scale
  const c0 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.06, 0.10, 0.72, 0.82], [0, 1.5, 1, 0], Extrapolation.CLAMP) }],
  }));
  const c1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.16, 0.20, 0.72, 0.82], [0, 1.5, 1, 0], Extrapolation.CLAMP) }],
  }));
  const c2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.26, 0.30, 0.72, 0.82], [0, 1.5, 1, 0], Extrapolation.CLAMP) }],
  }));
  const c3 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.36, 0.40, 0.72, 0.82], [0, 1.5, 1, 0], Extrapolation.CLAMP) }],
  }));
  const c4 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.46, 0.50, 0.72, 0.82], [0, 1.5, 1, 0], Extrapolation.CLAMP) }],
  }));

  // After all 5 are lit: one decisive execute flash
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.64, 0.70, 0.78, 0.84, 0.92], [0, 1.8, 0.9, 1.1, 0], Extrapolation.CLAMP) }],
  }));
  const fireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.value, [0.70, 0.76, 0.88, 0.96], [0, 2.8, 0.6, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1ExecCheckRow}>
        <Animated.View style={[styles.l1ExecCheckDot, c0]} />
        <Animated.View style={[styles.l1ExecCheckDot, c1]} />
        <Animated.View style={[styles.l1ExecCheckDot, c2]} />
        <Animated.View style={[styles.l1ExecCheckDot, c3]} />
        <Animated.View style={[styles.l1ExecCheckDot, c4]} />
      </View>
      <View style={styles.l1ExecFireWrap}>
        <Animated.View style={[styles.l1ExecFireRing, fireStyle]} />
        <Animated.View style={[styles.l1ExecFireCore, coreStyle]} />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function IntroScenarioStep({ onNext, copy }) {
  const { styles, colors, components } = useLessonStepStyles();
  const steps = copy.introScenario.steps;
  const reactiveMissingIds = ['goal', 'risk', 'strategy', 'allocation'];

  const [selected, setSelected] = useState(null);
  const showComparison = selected !== null;

  // ── Animated values ──────────────────────────────────────────────────────────
  const reactiveScale   = useSharedValue(1);
  const planScale       = useSharedValue(1);
  const reactiveOpacity = useSharedValue(1);
  const planOpacity     = useSharedValue(1);
  // Chart flash-in — brief opacity dip when a panel first becomes active
  const reactiveChartOpacity = useSharedValue(1);
  const planChartOpacity     = useSharedValue(1);

  useEffect(() => {
    if (selected === 'reactive') {
      // Pulse + activate ZONDER PLAN
      reactiveScale.value = withSequence(
        withTiming(1.03, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1.02, { duration: 120, easing: Easing.inOut(Easing.quad) })
      );
      reactiveOpacity.value = withTiming(1, { duration: 180 });
      reactiveChartOpacity.value = withSequence(
        withTiming(0.35, { duration: 0 }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
      );
      // Dim MET PLAN
      planScale.value   = withTiming(1,    { duration: 200 });
      planOpacity.value = withTiming(0.55, { duration: 180 });
    } else if (selected === 'plan') {
      // Pulse + activate MET PLAN
      planScale.value = withSequence(
        withTiming(1.03, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1.02, { duration: 120, easing: Easing.inOut(Easing.quad) })
      );
      planOpacity.value = withTiming(1, { duration: 180 });
      planChartOpacity.value = withSequence(
        withTiming(0.35, { duration: 0 }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
      );
      // Dim ZONDER PLAN
      reactiveScale.value   = withTiming(1,    { duration: 200 });
      reactiveOpacity.value = withTiming(0.55, { duration: 180 });
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const reactiveCardAnim  = useAnimatedStyle(() => ({
    transform: [{ scale: reactiveScale.value }],
    opacity: reactiveOpacity.value,
  }));
  const planCardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: planScale.value }],
    opacity: planOpacity.value,
  }));
  const reactiveChartAnim = useAnimatedStyle(() => ({
    opacity: reactiveChartOpacity.value,
  }));
  const planChartAnim = useAnimatedStyle(() => ({
    opacity: planChartOpacity.value,
  }));

  // Precompute step data
  const planSteps = steps.map((step) => ({ ...step, isActive: true }));
  const reactiveSteps = steps.map((step) => {
    const isMissing = reactiveMissingIds.includes(step.id);
    return { ...step, isActive: !isMissing, isMissing };
  });

  // Connector dot color per side
  const reactiveDotColor = selected === 'reactive'
    ? toRgba(colors.text.primary, 0.45)
    : toRgba(colors.ui.divider, 0.28);
  const planDotColor = selected === 'plan'
    ? toRgba(colors.accent.primary, 0.55)
    : toRgba(colors.ui.divider, 0.28);

  return (
    <View style={styles.stepBody}>
      <View style={styles.narrativeTopSection}>
        {/* Lars — always visible */}
        <Card style={styles.narrativeCard}>
          <View style={styles.narrativeCharacterRow}>
            <View style={styles.narrativeAvatar}>
              <Ionicons
                name="person-outline"
                size={components.sizes.icon.md}
                color={colors.text.secondary}
              />
            </View>
            <AppText style={styles.narrativeCharacterName}>Lars</AppText>
          </View>
          <AppText style={styles.narrativeQuote}>
            "Ik heb €5.000 klaarstaan. Ik heb een goed gevoel over dit aandeel."
          </AppText>
        </Card>

        <AppText style={styles.narrativePrompt}>Wat doet Lars?</AppText>
      </View>

      {/* Choice cards + connector + comparison — tightly grouped */}
      <View style={styles.narrativeFlowWrap}>
        <View style={styles.narrativeChoiceRow}>
          <Pressable
            onPress={() => setSelected('reactive')}
            style={({ pressed }) => [
              styles.narrativeChoiceCard,
              styles.narrativeChoiceCardReactive,
              selected === 'reactive' && styles.narrativeChoiceCardActiveReactive,
              pressed && styles.narrativeChoiceCardPressed,
            ]}
          >
            <Ionicons
              name="flash-outline"
              size={components.sizes.icon.lg}
              color={colors.text.secondary}
            />
            <AppText style={styles.narrativeChoiceLabel}>Nu uitvoeren</AppText>
            <AppText style={styles.narrativeChoiceHint}>Zonder voorbereiding</AppText>
          </Pressable>

          <Pressable
            onPress={() => setSelected('plan')}
            style={({ pressed }) => [
              styles.narrativeChoiceCard,
              styles.narrativeChoiceCardPlan,
              selected === 'plan' && styles.narrativeChoiceCardActivePlan,
              pressed && styles.narrativeChoiceCardPressed,
            ]}
          >
            <Ionicons
              name="layers-outline"
              size={components.sizes.icon.lg}
              color={colors.accent.primary}
            />
            <AppText style={[styles.narrativeChoiceLabel, styles.narrativeChoiceLabelPlan]}>
              Volg het proces
            </AppText>
            <AppText style={styles.narrativeChoiceHint}>6 stappen doorlopen</AppText>
          </Pressable>
        </View>

        {showComparison && (
          <>
            {/* Dotted connector lines — visually links each choice to its outcome */}
            <View style={styles.narrativeConnectorRow}>
              <View style={styles.narrativeConnectorCol}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={[styles.narrativeConnectorDot, { backgroundColor: reactiveDotColor }]}
                  />
                ))}
              </View>
              <View style={styles.narrativeConnectorCol}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={[styles.narrativeConnectorDot, { backgroundColor: planDotColor }]}
                  />
                ))}
              </View>
            </View>

            {/* Comparison panels — animated active/inactive states */}
            <View style={[styles.scenarioCompareGrid, styles.narrativeCompareGridOverride]}>
              {/* ZONDER PLAN */}
              <Animated.View style={[styles.narrativeComparePanelWrap, reactiveCardAnim]}>
                <Card
                  style={[
                    styles.scenarioComparePanel,
                    {
                      flex: 1,
                      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
                      borderColor: selected === 'reactive'
                        ? toRgba(colors.text.primary, 0.55)
                        : toRgba(colors.ui.divider, colors.opacity.stroke),
                    },
                  ]}
                >
                  <View style={styles.scenarioCompareHeader}>
                    <AppText style={styles.scenarioCompareLabel}>ZONDER PLAN</AppText>
                  </View>
                  <Animated.View style={reactiveChartAnim}>
                    <ScenarioCurve variant="volatile" progress={1} label="ONZEKER" />
                  </Animated.View>
                  <View style={styles.scenarioCompareSteps}>
                    {reactiveSteps.map((step, index) => {
                      const isLast = index === reactiveSteps.length - 1;
                      return (
                        <View key={step.id} style={styles.scenarioCompareRow}>
                          <View style={styles.scenarioCompareTrack}>
                            <View
                              style={[
                                styles.scenarioCompareNode,
                                step.isMissing && styles.scenarioCompareNodeMissing,
                                step.isActive && styles.scenarioCompareNodeActiveReactive,
                              ]}
                            />
                            {!isLast ? (
                              <View
                                style={[
                                  styles.scenarioCompareLine,
                                  step.isMissing && styles.scenarioCompareLineMissing,
                                  step.isActive && styles.scenarioCompareLineActiveReactive,
                                ]}
                              />
                            ) : null}
                          </View>
                          <AppText
                            style={[
                              styles.scenarioCompareStepLabel,
                              step.isMissing && styles.scenarioCompareStepLabelMissing,
                              step.isActive && styles.scenarioCompareStepLabelActive,
                            ]}
                          >
                            {step.label}
                          </AppText>
                        </View>
                      );
                    })}
                  </View>
                </Card>
              </Animated.View>

              {/* MET PLAN */}
              <Animated.View style={[styles.narrativeComparePanelWrap, planCardAnim]}>
                <Card
                  style={[
                    styles.scenarioComparePanel,
                    {
                      flex: 1,
                      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
                      borderColor: selected === 'plan'
                        ? colors.accent.primary
                        : toRgba(colors.ui.divider, colors.opacity.stroke),
                    },
                  ]}
                >
                  <View style={styles.scenarioCompareHeader}>
                    <AppText style={styles.scenarioCompareLabel}>MET PLAN</AppText>
                  </View>
                  <Animated.View style={planChartAnim}>
                    <ScenarioCurve variant="stable" progress={1} label="STABIEL" />
                  </Animated.View>
                  <View style={styles.scenarioCompareSteps}>
                    {planSteps.map((step, index) => {
                      const isLast = index === planSteps.length - 1;
                      return (
                        <View key={step.id} style={styles.scenarioCompareRow}>
                          <View style={styles.scenarioCompareTrack}>
                            <View
                              style={[
                                styles.scenarioCompareNode,
                                styles.scenarioCompareNodeActive,
                              ]}
                            />
                            {!isLast ? (
                              <View
                                style={[
                                  styles.scenarioCompareLine,
                                  styles.scenarioCompareLineActive,
                                ]}
                              />
                            ) : null}
                          </View>
                          <AppText
                            style={[
                              styles.scenarioCompareStepLabel,
                              styles.scenarioCompareStepLabelActive,
                            ]}
                          >
                            {step.label}
                          </AppText>
                        </View>
                      );
                    })}
                  </View>
                </Card>
              </Animated.View>
            </View>
          </>
        )}
      </View>

      {showComparison && (
        <View style={styles.narrativeOutcomeSection}>
          <AppText style={styles.scenarioInsightLine}>{copy.introScenario.insightLine}</AppText>
          <PrimaryButton label={copy.buttons.next} onPress={onNext} />
        </View>
      )}
    </View>
  );
}

function ScenarioCurve({ variant, progress, label }) {
  const { styles, colors, components } = useLessonStepStyles();
  const [size, setSize] = useState({ width: components.layout.spacing.none, height: components.layout.spacing.none });
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const points =
    variant === 'stable' ? STABLE_CURVE_POINTS : VOLATILE_CURVE_POINTS;
  const smoothPoints = useMemo(() => getSmoothPoints(points, 14), [points]);
  const lineBase = variant === 'stable' ? colors.accent.primary : colors.text.secondary;
  const lineAlpha =
    colors.opacity.stroke + (1 - colors.opacity.stroke) * clampedProgress;

  const { segments, totalLength } = useMemo(() => {
    if (!size.width || !size.height) return { segments: [], totalLength: 0 };
    let running = 0;
    const nextSegments = smoothPoints.slice(0, -1).map((point, index) => {
      const next = smoothPoints[index + 1];
      const x1 = (point.x / 100) * size.width;
      const y1 = (point.y / 100) * size.height;
      const x2 = (next.x / 100) * size.width;
      const y2 = (next.y / 100) * size.height;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      const start = running;
      running += length;
      return { x: x1, y: y1, length, angle, start, key: `seg-${index}` };
    });
    return { segments: nextSegments, totalLength: running };
  }, [smoothPoints, size]);

  return (
    <View style={styles.scenarioCurveWrap}>
      <View
        style={styles.scenarioCurveChart}
        onLayout={(event) =>
          setSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
      >
        <View style={styles.scenarioCurveLine}>
          {segments.map((segment) => {
            if (!totalLength) return null;
            const visibleLength = Math.max(
              0,
              Math.min(segment.length, clampedProgress * totalLength - segment.start)
            );
            if (visibleLength <= 0) return null;
            return (
              <View
                key={segment.key}
                style={[
                  styles.scenarioCurveSegment,
                  {
                    width: visibleLength,
                    left: segment.x,
                    top: segment.y,
                    backgroundColor: toRgba(lineBase, lineAlpha),
                    transform: [{ rotate: `${segment.angle}deg` }],
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
      <AppText style={styles.scenarioCurveLabel}>{label}</AppText>
    </View>
  );
}

function VisualizationStep({ content, lessonId, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const [selected, setSelected] = useState(null);

  if (lessonId === 'lesson_0') {
    return <IntroVisualizationStep onNext={onNext} copy={copy} lessonId={lessonId} />;
  }

  if (lessonId === 'lesson_1') {
    return <Lesson1VisualizationStep onNext={onNext} copy={copy} lessonId={lessonId} />;
  }

  return (
    <View style={styles.stepBody}>
      <Card style={styles.visualCard}>
        <GlossaryText
          text={content?.steps?.visualization?.title}
          style={styles.bodyText}
          onPressTerm={onPressTerm}
        />
        <AppText style={styles.caption}>{copy.labels.tapElements}</AppText>
        <View style={styles.segmentRow}>
          {content?.steps?.visualization?.segments?.map((segment) => (
            <Pressable
              key={segment.id}
              style={[styles.segment, { flex: segment.value * 10 }]}
              onPress={() => setSelected(segment)}
            >
              <GlossaryText
                text={segment.label}
                style={styles.segmentLabel}
                onPressTerm={onPressTerm}
              />
            </Pressable>
          ))}
        </View>
      </Card>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />

      <BottomSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.label}
      >
        <AppText style={styles.sheetText}>{selected?.description}</AppText>
      </BottomSheet>
    </View>
  );
}

function ScenarioStep({ content, userContext, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const variantKey = getScenarioVariant(userContext);
  const variant = content?.steps?.scenario?.variants?.[variantKey];
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.scenarioCard}>
        <GlossaryText text={variant?.prompt} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.optionList}>
          {variant?.options?.map((option) => {
            const isActive = selected === option;
            return (
              <Pressable
                key={option}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelected(option)}
              >
                <GlossaryText
                  text={option}
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>
      {selected ? (
        <Card style={styles.insightCard}>
          <AppText style={styles.insightTitle}>{copy.labels.insight}</AppText>
          <GlossaryText
            text={variant?.insight}
            style={styles.caption}
            onPressTerm={onPressTerm}
          />
        </Card>
      ) : null}
      <PrimaryButton label={copy.buttons.continue} onPress={onNext} disabled={!selected} />
    </View>
  );
}

function ExerciseStep({ content, lessonId, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const exercise = content?.steps?.exercise;

  if (!exercise) {
    return (
      <View style={styles.stepBody}>
        <Card style={styles.exerciseCard}>
          <AppText style={styles.bodyText}>{copy.messages.noExercise}</AppText>
        </Card>
        <PrimaryButton label={copy.buttons.continue} onPress={onNext} />
      </View>
    );
  }

  if (lessonId === 'lesson_0') {
    return (
      <IntroExerciseStep
        exercise={exercise}
        onNext={onNext}
        onPressTerm={onPressTerm}
        copy={copy}
      />
    );
  }

  switch (exercise.type) {
    case 'sequence':
      return (
        <SequenceExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'choice':
      return (
        <ChoiceExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'multi':
      return (
        <MultiExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'tradeoff':
    default:
      return (
        <TradeoffExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
  }
}

function SequenceExercise({ exercise, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const { description, items = [], correctOrder = [], feedback = {} } = exercise;
  const [order, setOrder] = useState([]);

  const isComplete = order.length === items.length;
  const isCorrect =
    isComplete && correctOrder.every((stepId, index) => order[index] === stepId);
  const message = isComplete ? (isCorrect ? feedback.correct : feedback.incorrect) : null;

  const handleAdd = (stepId) => {
    if (order.includes(stepId)) return;
    setOrder((prev) => [...prev, stepId]);
  };

  const handleRemove = (stepId) => {
    setOrder((prev) => prev.filter((item) => item !== stepId));
  };

  const reset = () => setOrder([]);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <AppText style={styles.exerciseLabel}>{copy.labels.yourOrder}</AppText>
        <View style={styles.sequenceList}>
          {order.length === 0 ? (
            <AppText style={styles.caption}>{copy.messages.tapActions}</AppText>
          ) : (
            order.map((stepId, index) => {
              const item = items.find((entry) => entry.id === stepId);
              return (
                <Pressable
                  key={stepId}
                  onPress={() => handleRemove(stepId)}
                  style={styles.sequenceItem}
                >
                  <View style={styles.sequenceIndex}>
                    <AppText style={styles.sequenceIndexText}>{index + 1}</AppText>
                  </View>
                  <GlossaryText
                    text={item?.label}
                    style={styles.sequenceText}
                    onPressTerm={onPressTerm}
                  />
                </Pressable>
              );
            })
          )}
        </View>
        <AppText style={styles.exerciseLabel}>{copy.labels.actions}</AppText>
        <View style={styles.optionList}>
          {items.map((item) => {
            const isSelected = order.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => handleAdd(item.id)}
                style={[styles.option, isSelected && styles.optionDisabled]}
              >
                <GlossaryText
                  text={item.label}
                  style={[styles.optionText, isSelected && styles.optionTextDisabled]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      {message ? (
        <Card style={styles.insightCard}>
          <AppText style={styles.insightTitle}>
            {isCorrect ? copy.labels.aligned : copy.labels.recheckFlow}
          </AppText>
          <GlossaryText text={message} style={styles.caption} onPressTerm={onPressTerm} />
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!isComplete}
        />
      </View>
    </View>
  );
}

function IntroExerciseStep({ exercise, onNext, onPressTerm, copy }) {
  const { styles, colors, components, mode } = useLessonStepStyles();
  const { items = [], correctOrder = [] } = exercise;
  const lastStepId = correctOrder[correctOrder.length - 1];

  const [placements, setPlacements] = useState(() => {
    const initial = items.reduce((acc, item) => ({ ...acc, [item.id]: null }), {});
    if (lastStepId) initial[lastStepId] = items.length - 1;
    return initial;
  });
  const [hintActive, setHintActive] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const slotHighlight = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const slots = useMemo(() => {
    const next = Array(items.length).fill(null);
    items.forEach((item) => {
      const slotIndex = placements[item.id];
      if (slotIndex !== null && slotIndex !== undefined) {
        next[slotIndex] = item;
      }
    });
    return next;
  }, [items, placements]);

  const available = items.filter((item) => placements[item.id] === null);
  const isComplete = slots.every(Boolean);
  const isCorrect =
    isComplete && correctOrder.every((stepId, index) => slots[index]?.id === stepId);
  const showError = isComplete && !isCorrect;
  const wrongSlots = showError
    ? slots.map((item, index) => item?.id !== correctOrder[index])
    : [];

  useEffect(() => {
    if (showError) {
      shakeX.value = withSequence(
        withTiming(-7, { duration: 55 }),
        withTiming(7, { duration: 55 }),
        withTiming(-5, { duration: 55 }),
        withTiming(5, { duration: 55 }),
        withTiming(-3, { duration: 55 }),
        withTiming(0, { duration: 55 })
      );
    }
  }, [showError]);

  const activeHighlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(slotHighlight.value, [0, 1], [0, 0.20]),
  }));
  const dimHighlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(slotHighlight.value, [0, 1], [0, 0.08]),
  }));
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handlePlace = (id) => {
    if (placements[id] !== null && placements[id] !== undefined) return;
    const nextIndex = slots.findIndex((item) => !item);
    if (nextIndex === -1) return;
    setPlacements((prev) => ({ ...prev, [id]: nextIndex }));
  };

  const handleRemove = (id) => {
    if (id === lastStepId) return;
    setPlacements((prev) => ({ ...prev, [id]: null }));
  };

  const handleHint = () => {
    setHintActive(true);
    setShowHint(true);
    setTimeout(() => setHintActive(false), 1500);
  };

  return (
    <View style={[styles.stepBody, styles.exerciseBody]}>
      <View style={styles.exerciseContent}>

        {/* Status — inline, only when all slots are filled */}
        {isComplete ? (
          <AppText
            style={[
              styles.exerciseStatusText,
              isCorrect ? styles.exerciseStatusCorrect : styles.exerciseStatusWrong,
            ]}
          >
            {isCorrect ? copy.messages.correctOrder : copy.messages.incorrectOrder}
          </AppText>
        ) : null}

        {/* Slot stack */}
        <View style={[styles.exerciseSection, styles.introExercisePrimarySection]}>
          <View style={styles.introSlotStack}>
            {slots.map((item, index) => {
              const isLocked = item?.id === lastStepId;
              const isNextEmpty = !item && slots.slice(0, index).every(Boolean);
              const isWrong = wrongSlots[index];
              return (
                <Animated.View key={`slot-wrap-${index}`} style={[isWrong && shakeStyle]}>
                  <Pressable
                    style={[
                      styles.introSlot,
                      item ? styles.introSlotFilled : styles.introSlotEmpty,
                      isLocked && styles.introSlotLocked,
                      isNextEmpty && styles.introSlotNext,
                      isWrong && styles.introSlotWrong,
                      isCorrect && item && styles.introSlotCorrect,
                      hintActive && index === 0 && !item && styles.introSlotHint,
                    ]}
                    onPress={() => handleRemove(item?.id)}
                    disabled={isLocked || !item}
                  >
                    {/* Highlight overlay on next slot while a card is held */}
                    {isNextEmpty ? (
                      <Animated.View
                        style={[StyleSheet.absoluteFill, styles.introSlotHighlight, activeHighlightStyle]}
                        pointerEvents="none"
                      />
                    ) : null}

                    {/* Step number badge */}
                    <View
                      style={[
                        styles.introSlotBadge,
                        isNextEmpty && styles.introSlotBadgeNext,
                        item && styles.introSlotBadgeFilled,
                        isLocked && styles.introSlotBadgeLocked,
                        isWrong && styles.introSlotBadgeWrong,
                        isCorrect && item && styles.introSlotBadgeCorrect,
                      ]}
                    >
                      {isLocked && !isCorrect ? (
                        <Ionicons
                          name="lock-closed"
                          size={9}
                          color={mode === 'light' ? colors.text.onAccent : colors.text.primary}
                        />
                      ) : (
                        <AppText
                          style={[
                            styles.introSlotBadgeText,
                            isNextEmpty && styles.introSlotBadgeTextNext,
                            item && styles.introSlotBadgeTextFilled,
                            isCorrect && item && styles.introSlotBadgeTextCorrect,
                          ]}
                        >
                          {index + 1}
                        </AppText>
                      )}
                    </View>

                    {/* Label or placeholder */}
                    {item ? (
                      <Animated.View key={item.id} entering={FadeInDown.duration(180)} style={styles.introSlotLabelRow}>
                        <AppText
                          style={[
                            styles.introSlotLabel,
                            isWrong && styles.introSlotLabelWrong,
                            isLocked && styles.introSlotLabelLocked,
                            isCorrect && item && styles.introSlotLabelCorrect,
                          ]}
                        >
                          {item.label}
                        </AppText>
                        {isWrong ? (
                          <Ionicons name="close" size={14} color={colors.text.primary} />
                        ) : isCorrect && item ? (
                          <Ionicons name="checkmark-circle" size={15} color={colors.accent.primary} />
                        ) : !isLocked ? (
                          <Ionicons name="close" size={13} color={toRgba(colors.text.secondary, 0.45)} />
                        ) : null}
                      </Animated.View>
                    ) : (
                      <AppText
                        style={[
                          styles.introSlotPlaceholder,
                          isNextEmpty && styles.introSlotPlaceholderNext,
                        ]}
                      >
                        {copy.labels.placeStepHere}
                      </AppText>
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Card pool */}
        {available.length > 0 ? (
          <View style={styles.exerciseSection}>
            <AppText style={styles.exerciseSectionLabel}>{copy.labels.availableSteps}</AppText>
            <View style={styles.introCardGrid}>
              {available.map((item) => (
                <SurfacePillButton
                  key={item.id}
                  onPressIn={() => { slotHighlight.value = withTiming(1, { duration: 120 }); }}
                  onPressOut={() => { slotHighlight.value = withTiming(0, { duration: 250 }); }}
                  onPress={() => handlePlace(item.id)}
                  label={item.label}
                  style={styles.introCardPillActive}
                />
              ))}
            </View>
          </View>
        ) : null}

      </View>

      <View style={[styles.exerciseFooter, styles.introExerciseFooter]}>
        <View style={styles.exerciseActionRow}>
          <SecondaryButton
            label={copy.labels.needHint}
            onPress={handleHint}
            style={styles.exerciseHintButton}
          />
          <PrimaryButton
            label={copy.buttons.next}
            onPress={onNext}
            disabled={!isCorrect}
            style={styles.exerciseNextButton}
          />
        </View>
      </View>

      <BottomSheet
        visible={showHint}
        onClose={() => setShowHint(false)}
        title={copy.labels.hint}
        scrimOpacity={0}
      >
        <AppText style={styles.exerciseHintBody}>
          {copy.messages.hintBody}
        </AppText>
      </BottomSheet>
    </View>
  );
}

function ExerciseOutcomeLine({ mode }) {
  const { styles, components } = useLessonStepStyles();
  const [size, setSize] = useState({ width: components.layout.spacing.none, height: components.layout.spacing.none });
  const points =
    mode === 'stable'
      ? [
          { x: 0, y: 70 },
          { x: 20, y: 62 },
          { x: 40, y: 56 },
          { x: 60, y: 48 },
          { x: 80, y: 40 },
          { x: 100, y: 34 },
        ]
      : [
          { x: 0, y: 62 },
          { x: 18, y: 42 },
          { x: 36, y: 82 },
          { x: 54, y: 36 },
          { x: 72, y: 86 },
          { x: 90, y: 46 },
          { x: 100, y: 58 },
        ];
  const segments = useMemo(() => {
    if (!size.width || !size.height) return [];
    return points.slice(0, -1).map((point, index) => {
      const next = points[index + 1];
      const x1 = (point.x / 100) * size.width;
      const y1 = (point.y / 100) * size.height;
      const x2 = (next.x / 100) * size.width;
      const y2 = (next.y / 100) * size.height;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      return { x: x1, y: y1, length, angle, key: `ex-seg-${index}` };
    });
  }, [points, size]);

  return (
    <View
      style={styles.exerciseOutcomeLine}
      onLayout={(event) =>
        setSize({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        })
      }
    >
      {segments.map((segment) => (
        <View
          key={segment.key}
          style={[
            styles.exerciseOutcomeLineSegment,
            {
              width: segment.length,
              left: segment.x,
              top: segment.y,
              transform: [{ rotate: `${segment.angle}deg` }],
              backgroundColor:
                mode === 'stable'
                  ? styles.exerciseLineStable.backgroundColor
                  : styles.exerciseLineReactive.backgroundColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

function ChoiceExercise({ exercise, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const { description, options = [], revealTitle = copy.labels.outcome } = exercise;
  const [selectedId, setSelectedId] = useState(null);
  const selected = options.find((option) => option.id === selectedId);

  const reset = () => setSelectedId(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.optionList}>
          {options.map((option) => {
            const isActive = option.id === selectedId;
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelectedId(option.id)}
              >
                <GlossaryText
                  text={option.label}
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      {selected ? (
        <Card style={styles.insightCard}>
          <AppText style={styles.insightTitle}>{selected.revealTitle || revealTitle}</AppText>
          <GlossaryText text={selected.reveal} style={styles.caption} onPressTerm={onPressTerm} />
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!selected}
        />
      </View>
    </View>
  );
}

function TradeoffExercise({ exercise, onNext, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const {
    description,
    sliders = [],
    requiresRun = false,
    ctaLabel = copy.labels.revealImpact,
    scoreLabel = copy.labels.signal,
    insight = {},
    insightMode = 'score',
    insightBySlider = {},
    scoreMode = 'average',
  } = exercise;

  const initialValues = useMemo(() => {
    return sliders.reduce((acc, slider) => {
      const fallback = slider.min + (slider.max - slider.min) / 2;
      acc[slider.id] = slider.defaultValue ?? fallback;
      return acc;
    }, {});
  }, [sliders]);

  const [values, setValues] = useState(initialValues);
  const [hasRun, setHasRun] = useState(!requiresRun);

  const reset = () => {
    setValues(initialValues);
    setHasRun(!requiresRun);
  };

  const handleValueChange = (id, nextValue) => {
    setValues((prev) => ({ ...prev, [id]: nextValue }));
  };

  const normalized = sliders.map((slider) => {
    const raw = values[slider.id] ?? slider.min;
    const range = slider.max - slider.min || 1;
    const ratio = (raw - slider.min) / range;
    return slider.invert ? 1 - ratio : ratio;
  });

  const score = (() => {
    if (normalized.length === 0) return 0;
    if (scoreMode === 'range') {
      const max = Math.max(...normalized);
      const min = Math.min(...normalized);
      return Math.round((max - min) * 100);
    }
    const total = normalized.reduce((sum, value) => sum + value, 0);
    return Math.round((total / normalized.length) * 100);
  })();

  const insightText = (() => {
    if (insightMode === 'dominant' && sliders.length) {
      const dominant = sliders.reduce((winner, slider) =>
        (values[slider.id] ?? 0) > (values[winner.id] ?? 0) ? slider : winner
      );
      return insightBySlider[dominant.id] || insight.mid || '';
    }
    if (score <= 35) return insight.low || '';
    if (score >= 66) return insight.high || '';
    return insight.mid || '';
  })();

  const formatSliderValue = (slider, value) => {
    const prefix = slider.prefix || '';
    const suffix = slider.suffix || '';
    return `${prefix}${value}${suffix}`;
  };

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.exerciseSection}>
          {sliders.map((slider) => (
            <View key={slider.id} style={styles.sliderRow}>
              <GlossaryText
                text={slider.label}
                style={styles.sliderTitle}
                onPressTerm={onPressTerm}
              />
              <AppText style={styles.sliderValue}>
                {formatSliderValue(slider, values[slider.id])}
              </AppText>
              <Slider
                value={values[slider.id]}
                minimumValue={slider.min}
                maximumValue={slider.max}
                step={slider.step}
                minimumTrackTintColor={colors.accent.primary}
                maximumTrackTintColor={colors.background.surfaceActive}
                thumbTintColor={colors.accent.primary}
                onValueChange={(nextValue) => handleValueChange(slider.id, nextValue)}
              />
              {slider.leftLabel || slider.rightLabel ? (
                <View style={styles.sliderHintRow}>
                  <GlossaryText
                    text={slider.leftLabel}
                    style={styles.sliderHintText}
                    onPressTerm={onPressTerm}
                  />
                  <GlossaryText
                    text={slider.rightLabel}
                    style={styles.sliderHintText}
                    onPressTerm={onPressTerm}
                  />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.exerciseCard}>
        {requiresRun ? (
          <PrimaryButton label={ctaLabel} onPress={() => setHasRun(true)} />
        ) : null}
        {hasRun ? (
          <View style={styles.resultsBlock}>
            <View style={styles.resultRow}>
              <AppText style={styles.resultLabel}>{scoreLabel}</AppText>
              <AppText style={styles.resultValue}>{`${score}/100`}</AppText>
            </View>
            <View style={styles.scoreTrack}>
              <View style={[styles.scoreFill, { width: `${score}%` }]} />
            </View>
            {insightText ? (
              <GlossaryText text={insightText} style={styles.caption} onPressTerm={onPressTerm} />
            ) : null}
            {exercise.resultHint ? (
              <GlossaryText
                text={exercise.resultHint}
                style={styles.caption}
                onPressTerm={onPressTerm}
              />
            ) : null}
          </View>
        ) : null}
      </Card>

      <View style={styles.exerciseActions}>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!hasRun}
        />
      </View>
    </View>
  );
}

function MultiExercise({ exercise, onNext, onPressTerm, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const {
    description,
    options = [],
    baseScore = 100,
    scoreLabel = copy.labels.coverage,
    unit = '%',
    insight = {},
    emptyMessage = copy.messages.selectItems,
  } = exercise;
  const [selectedIds, setSelectedIds] = useState([]);

  const toggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const reset = () => setSelectedIds([]);

  const totalImpact = selectedIds.reduce((sum, id) => {
    const option = options.find((item) => item.id === id);
    return sum + (option?.impact || 0);
  }, 0);

  const remaining = Math.max(0, baseScore - totalImpact);
  const insightText = (() => {
    if (remaining <= 35) return insight.low || '';
    if (remaining >= 66) return insight.high || '';
    return insight.mid || '';
  })();

  const hasSelection = selectedIds.length > 0;

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.optionList}>
          {options.map((option) => {
            const isActive = selectedIds.includes(option.id);
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => toggle(option.id)}
              >
                <GlossaryText
                  text={option.label}
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.insightCard}>
        <AppText style={styles.insightTitle}>{scoreLabel}</AppText>
        <View style={styles.resultRow}>
          <AppText style={styles.resultLabel}>{scoreLabel}</AppText>
          <AppText style={styles.resultValue}>{`${Math.round(remaining)}${unit}`}</AppText>
        </View>
        {insightText ? (
          <GlossaryText text={insightText} style={styles.caption} onPressTerm={onPressTerm} />
        ) : null}
        {hasSelection ? (
          <View style={styles.impactList}>
            {selectedIds.map((id) => {
              const option = options.find((item) => item.id === id);
              if (!option) return null;
              return (
                <View key={id} style={styles.impactRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={components.sizes.icon.sm}
                    color={colors.accent.primary}
                  />
                  <GlossaryText
                    text={option.detail}
                    style={styles.impactText}
                    onPressTerm={onPressTerm}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <GlossaryText text={emptyMessage} style={styles.caption} onPressTerm={onPressTerm} />
        )}
      </Card>

      <View style={styles.exerciseActions}>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!hasSelection}
        />
      </View>
    </View>
  );
}

function ReflectionStep({ content, onSubmit, onPressTerm, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [response, setResponse] = useState(null);
  const question =
    content?.steps?.reflection?.question || copy.messages.reflectionQuestion;
  const placeholder =
    content?.steps?.reflection?.placeholder || copy.messages.reflectionPlaceholder;
  const canSubmit = text.trim().length > 0;
  const isSubmitted = !!response;

  const buildResponse = (input) => {
    const normalized = (input || '').toLowerCase().trim();
    if (!normalized || normalized.length < 6) {
      return copy.messages.reflectionShort;
    }
    const structureWords = [
      'order', 'sequence', 'step', 'process', 'structure',
      'framework', 'flow', 'plan', 'planning', 'prior', 'before', 'clarity',
      'volgorde', 'stap', 'proces', 'structuur', 'kader', 'planning',
    ];
    const emotionWords = [
      'fear', 'anxiety', 'panic', 'stress', 'nervous', 'worry',
      'emotional', 'impulse', 'impulsive', 'reactive', 'react', 'fomo',
      'angst', 'zenuwachtig', 'zorgen', 'emotioneel', 'impulsief', 'reactief',
    ];
    const hasStructure = structureWords.some((word) => normalized.includes(word));
    const hasEmotion = emotionWords.some((word) => normalized.includes(word));
    if (hasStructure) return copy.messages.reflectionStructure;
    if (hasEmotion) return copy.messages.reflectionEmotion;
    return copy.messages.reflectionDefault;
  };

  const handleSubmit = () => {
    if (isSubmitted || !canSubmit) return;
    const trimmed = text.trim();
    setSubmittedText(trimmed);
    setResponse(buildResponse(trimmed));
    setText('');
  };

  const handleContinue = () => {
    if (!isSubmitted) {
      handleSubmit();
      return;
    }
    onSubmit(submittedText, response);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.stepBody}>
        <View style={styles.reflectionHeader}>
          <AppText style={styles.reflectionQuestion}>{question}</AppText>
          <AppText style={styles.reflectionSubtitle}>
            {copy.messages.reflectionSubtitle}
          </AppText>
        </View>
        {isSubmitted ? (
          <Animated.View
            entering={FadeInDown.duration(350)}
            style={styles.reflectionResultCard}
          >
            <AppText style={styles.reflectionAnswerText}>{submittedText}</AppText>
            <View style={styles.reflectionResultDivider} />
            <View style={styles.reflectionInsightBlock}>
              <AppText style={styles.reflectionInsightLabel}>
                {copy.labels.eqtyInsight}
              </AppText>
              <AppText style={styles.reflectionInsightText}>{response}</AppText>
            </View>
          </Animated.View>
        ) : (
          <View>
            <View style={styles.reflectionTextAreaWrap}>
              <AppTextInput
                style={styles.reflectionTextArea}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor={colors.text.secondary}
                multiline
                autoCorrect
                textAlignVertical="top"
              />
            </View>
            <AppText style={styles.reflectionPersonalizationHint}>
              {copy.messages.reflectionPersonalizationHint}
            </AppText>
          </View>
        )}
        <PrimaryButton
          label={isSubmitted ? copy.buttons.next : copy.buttons.submitReflection}
          onPress={handleContinue}
          disabled={!isSubmitted && !canSubmit}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

function SummaryStep({ content, onComplete, onPressTerm, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const [confirmed, setConfirmed] = useState(new Set());

  const takeaways = content?.steps?.summary?.takeaways || [];
  const allConfirmed = confirmed.size === takeaways.length && takeaways.length > 0;

  const handleConfirm = (index) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <View style={styles.stepBody}>
      {/* Journey strip — all 5 steps completed */}
      <View style={styles.summaryJourneyRow}>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <React.Fragment key={n}>
            <View style={styles.summaryJourneyNode}>
              <Ionicons name="checkmark" size={10} color={colors.accent.primary} />
            </View>
            {i < 4 && <View style={styles.summaryJourneyConnector} />}
          </React.Fragment>
        ))}
      </View>

      {/* Section label */}
      <AppText style={styles.summaryInsightsLabel}>{copy.labels.keyTakeaways}</AppText>

      {/* Interactive insight cards */}
      <View style={styles.summaryInsightList}>
        {takeaways.map((item, index) => {
          const isConfirmed = confirmed.has(index);
          return (
            <Pressable
              key={item}
              onPress={() => handleConfirm(index)}
              style={[
                styles.summaryInsightCard,
                isConfirmed && styles.summaryInsightCardConfirmed,
              ]}
            >
              <View
                style={[
                  styles.summaryInsightIndex,
                  isConfirmed && styles.summaryInsightIndexConfirmed,
                ]}
              >
                <AppText
                  style={[
                    styles.summaryInsightNumber,
                    isConfirmed && styles.summaryInsightNumberConfirmed,
                  ]}
                >
                  {String(index + 1).padStart(2, '0')}
                </AppText>
              </View>
              <AppText style={styles.summaryInsightText}>{item}</AppText>
              <Ionicons
                name={isConfirmed ? 'checkmark-circle' : 'ellipse-outline'}
                size={components.sizes.icon.lg}
                color={
                  isConfirmed
                    ? colors.accent.primary
                    : toRgba(colors.ui.divider, colors.opacity.stroke)
                }
              />
            </Pressable>
          );
        })}
      </View>

      {/* Status line */}
      {allConfirmed ? (
        <Animated.View entering={FadeInDown.duration(280)}>
          <AppText style={styles.summaryReadyText}>
            {copy.labels.allInsightsConfirmed}
          </AppText>
        </Animated.View>
      ) : (
        <AppText style={styles.summaryNudgeText}>
          {copy.labels.tapInsightToConfirm}
        </AppText>
      )}

      <PrimaryButton label={copy.buttons.completeLesson} onPress={onComplete} />
    </View>
  );
}


function IntroSummaryStep({ content, onComplete, onPressTerm, copy, userReflection, language }) {
  const { colors, components, styles } = useLessonStepStyles();
  const [picked, setPicked] = useState(null);
  const isDutch = getLocaleKey(language) === 'nl';
  const scenarioLabel = isDutch ? 'Scenario' : 'Scenario';
  const scenarioText = isDutch
    ? 'Bert koopt impulsief aandelen in de groene energiesector voor €3.000. Drie maanden later staat hij op -18%. Een vriend zegt: hold. Een collega zegt: verkoop. Bert weet niet wat te doen.'
    : 'Bert impulsively buys 3,000 EUR worth of green energy stocks. Three months later, he is down 18%. A friend says: hold. A colleague says: sell. Bert does not know what to do.';
  const questionText = isDutch
    ? 'Wat zegt het beleggingsproces?'
    : 'What does the investment process say?';
  const revealExactLabel = isDutch ? 'Goed' : 'Exactly';
  const revealNudgeLabel = isDutch ? 'Bijna juist - maar' : 'Almost right, but';
  const processResetText = isDutch
    ? 'Het proces zegt, ga terug naar stap 1. Zonder een doel is elke vervolgbeslissing willekeurig.'
    : 'The process says: go back to step one. Without a goal, every next decision is arbitrary.';

  const options = [
    {
      id: 'sell',
      label: isDutch ? 'Verkopen en verlies nemen' : 'Sell and take the loss',
      reveal: isDutch
        ? 'Verkopen is niet per se fout.\nMaar zonder doel weet Bert niet of dit de juiste keuze is.'
        : 'Not necessarily wrong, but without a goal Bert does not know if this is the right choice. Selling on instinct is just as arbitrary as buying on instinct.',
    },
    {
      id: 'hold',
      label: isDutch ? 'Houden en wachten op herstel' : 'Hold and wait for recovery',
      reveal: isDutch
        ? 'Misschien herstelt het aandeel.\nMaar zonder doel is de keuze willekeurig.'
        : 'Patience can be smart, but only if there is a reason to hold. Without a goal, waiting is not a strategy, it is procrastination.',
    },
    {
      id: 'process',
      label: isDutch
        ? 'Terug naar stap één – wat is het doel?'
        : 'Go back to step one: what was the goal?',
      reveal: isDutch
        ? 'Dat is wat het proces zegt. Zonder doel is elke vervolgbeslissing willekeurig.'
        : 'This is what the process says. Without a goal, every next decision is arbitrary. Reconsider the goal first, then decide.',
      isKey: true,
    },
  ];

  const handlePick = (id) => {
    if (picked) return;
    setPicked(id);
  };

  const pickedOption = options.find((o) => o.id === picked);
  const isAnswered = picked !== null;

  return (
    <View style={[styles.stepBody, { marginTop: components.layout.spacing.xxl }]}>

      {/* Scenario */}
      <View style={styles.scenarioStoryCard}>
        <AppText style={styles.scenarioStoryLabel}>{scenarioLabel}</AppText>
        <AppText style={styles.scenarioStoryText}>
          {scenarioText}
        </AppText>
      </View>

      <View style={styles.scenarioQuestionBlock}>
        {/* Question */}
        <AppText style={styles.scenarioQuestion}>{questionText}</AppText>

        {/* Options */}
        <View style={styles.scenarioOptionList}>
          {options.map((opt) => {
            const isPicked    = picked === opt.id;
            const isKey       = isAnswered && opt.isKey;
            const isWrongPick = isPicked && !opt.isKey;
            const isDimmed    = isAnswered && !isPicked && !opt.isKey;
            return (
              <SelectableOptionButton
                key={opt.id}
                onPress={() => handlePick(opt.id)}
                disabled={isAnswered}
                label={opt.label}
                state={isKey ? 'correct' : isWrongPick ? 'incorrect' : isDimmed ? 'dimmed' : 'default'}
                accessory={
                  isKey ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent.primary} />
                  ) : isWrongPick ? (
                    <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                  ) : null
                }
              />
            );
          })}
        </View>
      </View>

      {/* Feedback card — appears immediately after tap */}
      {isAnswered && pickedOption && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.scenarioRevealCard}
        >
          <View style={styles.scenarioRevealHeader}>
            <Ionicons
              name={pickedOption.isKey ? 'checkmark-circle' : 'information-circle'}
              size={18}
              color={pickedOption.isKey ? colors.accent.primary : colors.text.secondary}
            />
            <AppText style={[styles.scenarioRevealLabel, pickedOption.isKey && styles.scenarioRevealLabelKey]}>
              {pickedOption.isKey
                ? revealExactLabel
                : isDutch && pickedOption.id === 'hold'
                  ? 'Logisch idee - maar'
                  : revealNudgeLabel}
            </AppText>
          </View>
          <AppText style={styles.scenarioRevealText}>{pickedOption.reveal}</AppText>
          {!pickedOption.isKey && (
            <>
              <View style={styles.scenarioRevealDivider} />
              <AppText style={styles.scenarioRevealText}>{processResetText}</AppText>
            </>
          )}
        </Animated.View>
      )}

      {isAnswered && <PrimaryButton label={copy.buttons.next} onPress={onComplete} />}
    </View>
  );
}

const createStyles = (colors, components, mode = 'dark') =>
  StyleSheet.create({
  root: {
    flex: 1,
  },
  bridgeOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgeBadge: {
    width: 68,
    height: 68,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgeCheck: {
    ...typography.styles.h1,
    lineHeight: 34,
  },
  stepBody: {
    gap: components.layout.spacing.lg,
  },
  conceptCard: {
    gap: components.layout.spacing.md,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  introAccent: {
    width: components.sizes.track.sm,
    height: components.sizes.line.thin,
    backgroundColor: colors.accent.primary,
    borderRadius: components.radius.pill,
  },
  introLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  introTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  stepIntro: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  stepIntroSecondary: {
    color: colors.text.secondary,
  },
  introText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  introDefinitionText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  bodyText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  caption: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  visualHint: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: components.layout.spacing.xs,
  },
  hintBar: {
    width: components.sizes.track.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
  },
  hintBarXs: {
    height: components.sizes.hintBar.xs,
  },
  hintBarSm: {
    height: components.sizes.hintBar.sm,
  },
  hintBarMd: {
    height: components.sizes.hintBar.md,
  },
  hintBarLg: {
    height: components.sizes.hintBar.lg,
  },
  visualCard: {
    gap: components.layout.spacing.md,
  },
  journeyTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  journeySubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  journeyBody: {
  },
  journeyContent: {
    marginTop: components.layout.spacing.sm,
    gap: components.layout.spacing.sm,
  },
  journeyNextWrap: {
    marginTop: components.layout.spacing.md,
  },
  journeyCardShell: {
    marginBottom: components.layout.spacing.md,
  },
  journeyFlipCard: {
    height: 420,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: components.radius.card,
  },
  journeyFace: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
    borderRadius: components.radius.card,
  },
  journeyPage: {
    borderRadius: components.radius.card,
    padding: components.layout.spacing.lg,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.md,
    justifyContent: 'flex-start',
  },
  journeyBackFace: {
    backgroundColor: toRgba(colors.background.surfaceActive, 0.88),
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journeyStepChip: {
    paddingHorizontal: components.layout.spacing.md,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, 0.95),
  },
  journeyStepText: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  journeyAccent: {
    width: components.sizes.square.xs,
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.surface),
  },
  journeyBackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    paddingHorizontal: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
  },
  journeyBackBadgeText: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  journeyLabel: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  journeyQuestion: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  journeyWhy: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  journeyDetail: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  journeyTapHint: {
    ...typography.styles.small,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  journeyVisual: {
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    padding: components.layout.spacing.md,
    height: components.sizes.chart.lg,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  journeyAnimCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: components.radius.input,
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  journeyPlaceholder: {
    flex: 1,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    alignItems: 'center',
    justifyContent: 'center',
    gap: components.layout.spacing.xs,
  },
  journeyPlaceholderText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  goalTrack: {
    position: 'absolute',
    width: '78%',
    height: 2,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  goalPulseRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: components.borderWidth.thin,
  },
  goalTarget: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent.primary,
  },
  goalDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text.primary,
  },
  riskBarRow: {
    width: '78%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: components.layout.spacing.md,
  },
  riskBar: {
    width: 28,
    height: 38,
    borderRadius: components.radius.input,
    backgroundColor: toRgba(colors.accent.primary, 0.42),
  },
  riskGaugeBase: {
    position: 'absolute',
    bottom: components.layout.spacing.md,
    width: '78%',
    height: 3,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  riskGaugePivot: {
    position: 'absolute',
    bottom: components.layout.spacing.md - 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.primary,
  },
  riskNeedle: {
    position: 'absolute',
    bottom: components.layout.spacing.md,
    width: 58,
    height: 3,
    borderRadius: components.radius.pill,
    backgroundColor: colors.text.primary,
  },
  strategyRail: {
    position: 'absolute',
    width: '74%',
    height: 2,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  strategyNodeRow: {
    width: '74%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strategyNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent.primary,
  },
  strategyToken: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.text.primary,
  },
  allocationBar: {
    width: '82%',
    height: 18,
    borderRadius: components.radius.pill,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: toRgba(colors.ui.divider, 0.16),
  },
  allocationSegmentPrimary: {
    backgroundColor: toRgba(colors.accent.primary, 0.85),
  },
  allocationSegmentSecondary: {
    backgroundColor: toRgba(colors.accent.primary, 0.55),
  },
  allocationSegmentTertiary: {
    backgroundColor: toRgba(colors.accent.primary, 0.32),
  },
  allocationLegend: {
    marginTop: components.layout.spacing.md,
    width: '82%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  allocationLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  allocationLegendText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  allocationDotPrimary: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: toRgba(colors.accent.primary, 0.85),
  },
  allocationDotSecondary: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: toRgba(colors.accent.primary, 0.55),
  },
  allocationDotTertiary: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: toRgba(colors.accent.primary, 0.32),
  },
  vehicleRow: {
    flexDirection: 'row',
    gap: components.layout.spacing.sm,
    alignItems: 'center',
  },
  vehicleChip: {
    width: 44,
    height: 44,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleTrack: {
    marginTop: components.layout.spacing.sm,
    width: '76%',
    height: 2,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  executionRail: {
    position: 'absolute',
    width: '80%',
    height: 3,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  executionCheckpointRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  executionCheckpoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: toRgba(colors.accent.primary, 0.8),
  },
  executionRunner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.text.primary,
  },
  executionPulse: {
    marginTop: components.layout.spacing.lg,
    width: 82,
    height: 22,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.accent.primary, 0.28),
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, 0.5),
  },
  processCard: {
    gap: components.layout.spacing.md,
  },
  processHeader: {
    gap: components.layout.spacing.sm,
  },
  processTitle: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  processSubline: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  /* ── Concept screen: definition block ── */
  conceptDef: {
    gap: components.layout.spacing.sm,
    paddingTop: components.layout.spacing.xl,
  },
  conceptDefLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  conceptDefTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  conceptDefBody: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  /* ── Concept screen: process track ── */
  conceptTrackWrap: {
    gap: components.layout.spacing.md,
    marginTop: components.layout.spacing.sm,
  },
  conceptTrackHeader: {
    gap: components.layout.spacing.xs,
  },
  conceptTrackHeaderLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  conceptTrackHeaderHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  conceptTrack: {
    borderRadius: components.radius.card,
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    overflow: 'hidden',
  },
  conceptTrackRow: {
    flexDirection: 'row',
  },
  conceptTrackBar: {
    width: components.sizes.line.thin,
    backgroundColor: 'transparent',
  },
  conceptTrackBarActive: {
    backgroundColor: colors.accent.primary,
  },
  conceptTrackBarFirst: {
    marginTop: components.layout.spacing.xs,
    borderTopLeftRadius: components.radius.pill,
    borderTopRightRadius: components.radius.pill,
  },
  conceptTrackBarLast: {
    marginBottom: components.layout.spacing.xs,
    borderBottomLeftRadius: components.radius.pill,
    borderBottomRightRadius: components.radius.pill,
  },
  conceptTrackBody: {
    flex: 1,
    paddingVertical: components.layout.spacing.md,
    paddingLeft: components.layout.spacing.md,
    paddingRight: components.layout.spacing.lg,
    gap: components.layout.spacing.sm,
  },
  conceptTrackBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  conceptTrackIndex: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
    width: components.sizes.square.xs,
  },
  conceptTrackIndexActive: {
    color: colors.accent.primary,
  },
  conceptTrackContent: {
    flex: 1,
  },
  conceptTrackName: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  conceptTrackDetail: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  conceptTrackDivider: {
    height: components.borderWidth.thin,
    marginHorizontal: components.layout.spacing.lg,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  segmentRow: {
    flexDirection: 'row',
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.sm,
  },
  segment: {
    paddingVertical: components.layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  segmentLabel: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  sheetText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  lessonGlossarySearch: {
    ...components.input.container,
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.sm,
  },
  lessonGlossarySearchInput: {
    flex: 1,
    ...components.input.text,
  },
  lessonGlossarySearchLabel: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  lessonGlossaryHeader: {
    backgroundColor: colors.background.surfaceActive,
    paddingBottom: components.layout.spacing.sm,
    gap: components.layout.spacing.xs,
  },
  lessonGlossaryClear: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonGlossaryClearPressed: {
    opacity: colors.opacity.emphasis,
  },
  lessonGlossaryContent: {
    flex: 1,
    minHeight: 0,
    gap: components.layout.spacing.sm,
  },
  lessonGlossaryList: {
    flex: 1,
    minHeight: 0,
  },
  lessonGlossaryListContent: {
    paddingBottom: components.layout.spacing.none,
  },
  lessonGlossaryRow: {
    ...components.list.row,
    paddingVertical: components.layout.spacing.md,
  },
  lessonGlossaryDivider: {
    borderBottomWidth: components.borderWidth.thin,
    borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  lessonGlossaryRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: components.layout.spacing.sm,
  },
  lessonGlossaryTitle: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
    flex: 1,
  },
  lessonGlossaryDescription: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  lessonGlossaryEmpty: {
    gap: components.layout.spacing.xs,
    paddingVertical: components.layout.spacing.sm,
  },
  lessonGlossaryEmptyTitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  scenarioCard: {
    gap: components.layout.spacing.md,
  },
  scenarioMeaning: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioCompareGrid: {
    flexDirection: 'row',
    gap: components.layout.spacing.md,
    alignItems: 'stretch',
    marginTop: components.layout.spacing.sm,
  },
  scenarioComparePanel: {
    flex: 1,
    minWidth: components.layout.spacing.none,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.lg,
  },
  scenarioComparePanelReactive: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  scenarioCompareHeader: {
    gap: components.layout.spacing.xs,
  },
  scenarioCompareLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioCompareSubline: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scenarioCompareSteps: {
    flexGrow: 1,
    gap: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
  },
  scenarioCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  scenarioCompareTrack: {
    alignItems: 'center',
    width: components.sizes.track.sm,
  },
  scenarioCompareNode: {
    width: components.sizes.dot.md,
    height: components.sizes.dot.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  scenarioCompareNodeActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  scenarioCompareNodeActiveReactive: {
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.surface),
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareNodeCurrent: {
    backgroundColor: colors.text.primary,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareNodeMissing: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareLine: {
    width: components.sizes.line.thin,
    height: components.sizes.track.sm,
    marginTop: components.layout.spacing.xs,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareLineActive: {
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.surface),
  },
  scenarioCompareLineActiveReactive: {
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.surface),
  },
  scenarioCompareLineMissing: {
    backgroundColor: 'transparent',
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareStepLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioCompareStepLabelActive: {
    color: colors.text.primary,
  },
  scenarioCompareStepLabelCurrent: {
    color: colors.text.primary,
  },
  scenarioCompareStepLabelMissing: {
    color: colors.text.secondary,
  },
  scenarioSliderWrap: {
    marginTop: components.layout.spacing.xl,
    gap: components.layout.spacing.sm,
  },
  scenarioSliderLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioSliderHelper: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  // ─── Narrative scenario ───────────────────────────────────────────────────────
  narrativeTopSection: {
    marginTop: 32,
    gap: components.layout.spacing.sm,
  },
  narrativeCard: {
    gap: components.layout.spacing.sm,
  },
  narrativeCharacterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  narrativeAvatar: {
    width: components.sizes.square.md,
    height: components.sizes.square.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  narrativeCharacterName: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  narrativeQuote: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  narrativePrompt: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  narrativeChoiceRow: {
    flexDirection: 'row',
    gap: components.layout.spacing.md,
  },
  narrativeChoiceCard: {
    flex: 1,
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    padding: components.layout.spacing.lg,
    gap: components.layout.spacing.xs,
    alignItems: 'flex-start',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  narrativeChoiceCardReactive: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  narrativeChoiceCardPlan: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  narrativeChoiceCardActiveReactive: {
    borderColor: colors.text.primary,
  },
  narrativeChoiceCardActivePlan: {
    borderColor: colors.accent.primary,
  },
  narrativeChoiceCardPressed: {
    opacity: colors.opacity.emphasis,
    transform: [{ scale: components.transforms.scalePressed }],
  },
  narrativeChoiceLabel: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  narrativeChoiceLabelPlan: {
    color: colors.accent.primary,
  },
  narrativeChoiceHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  narrativeComparePanelHighlight: {
    borderColor: colors.accent.primary,
  },
  narrativeFlowWrap: {
    gap: components.layout.spacing.md,
  },
  narrativeConnectorRow: {
    flexDirection: 'row',
    gap: components.layout.spacing.md,
    height: components.layout.spacing.lg,
  },
  narrativeConnectorCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  narrativeConnectorDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  narrativeComparePanelWrap: {
    flex: 1,
    minWidth: 0,
  },
  narrativeCompareGridOverride: {
    marginTop: components.layout.spacing.none,
  },
  narrativeOutcomeSection: {
    gap: components.layout.spacing.md,
  },
  // ─── Step-tap selector (replaces slider) ────────────────────────────────────
  scenarioSelectorWrap: {
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    padding: components.layout.spacing.lg,
    gap: components.layout.spacing.md,
  },
  scenarioSelectorLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioStepTrail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scenarioStepPip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioStepPipDone: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  scenarioStepPipCurrent: {
    borderColor: colors.text.primary,
    borderWidth: 2,
  },
  scenarioStepPipNum: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  scenarioStepPipNumDone: {
    color: colors.text.onAccent,
  },
  scenarioStepPipNumCurrent: {
    color: colors.text.primary,
  },
  scenarioStepBridge: {
    flex: 1,
    height: 2,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioStepBridgeDone: {
    backgroundColor: toRgba(colors.accent.primary, 0.5),
  },
  scenarioStepCurrentRow: {
    minHeight: components.layout.spacing.xl,
    justifyContent: 'center',
  },
  scenarioStepCurrentLabel: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  scenarioStepCurrentHint: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  scenarioCurveWrap: {
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.sm,
  },
  scenarioCurveChart: {
    height: components.sizes.chart.md,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    overflow: 'hidden',
  },
  scenarioCurveLine: {
    flex: 1,
  },
  scenarioCurveSegment: {
    position: 'absolute',
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
  },
  scenarioCurveLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioOutcomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.md,
  },
  outcomePressable: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: components.layout.spacing.none,
    borderRadius: components.radius.input,
  },
  outcomePressablePressed: {
    opacity: colors.opacity.emphasis,
    transform: [{ scale: components.transforms.scalePressed }],
  },
  scenarioPanel: {
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    gap: components.layout.spacing.md,
  },
  scenarioPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scenarioPanelTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scenarioBadge: {
    paddingHorizontal: components.layout.spacing.md,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  scenarioBadgeMuted: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  scenarioBadgeText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  scenarioRail: {
    gap: components.layout.spacing.sm,
  },
  scenarioRailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.layout.spacing.sm,
  },
  scenarioRailTrack: {
    alignItems: 'center',
    width: components.sizes.track.sm,
  },
  scenarioNode: {
    width: components.sizes.dot.md,
    height: components.sizes.dot.md,
    borderRadius: components.radius.input,
    backgroundColor: colors.text.secondary,
  },
  scenarioNodeActive: {
    backgroundColor: colors.accent.primary,
  },
  scenarioNodeDegraded: {
    backgroundColor: toRgba(colors.text.secondary, colors.opacity.surface),
  },
  scenarioNodeMissing: {
    backgroundColor: 'transparent',
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioRailLine: {
    width: components.sizes.line.thin,
    height: components.sizes.track.sm,
    marginTop: components.layout.spacing.xs,
    backgroundColor: toRgba(colors.text.secondary, colors.opacity.surface),
  },
  scenarioRailLineBroken: {
    backgroundColor: 'transparent',
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioRailLineDegraded: {
    backgroundColor: toRgba(colors.text.secondary, colors.opacity.stroke),
  },
  scenarioRailLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioRailLabelMuted: {
    color: colors.text.secondary,
  },
  scenarioRailLabelStrong: {
    color: colors.text.primary,
  },
  scenarioRailLabelDegraded: {
    color: colors.text.secondary,
  },
  scenarioRailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  scenarioRailLabelColumn: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  scenarioConsequence: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  scenarioPrematureBadge: {
    paddingHorizontal: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
  },
  scenarioPrematureText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  outcomePanel: {
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  outcomePanelActive: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  outcomeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: components.layout.spacing.sm,
  },
  outcomeTitleStack: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  outcomeScenarioLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  outcomeLabel: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  outcomeFocusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
    paddingHorizontal: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.text.secondary, colors.opacity.tint),
  },
  outcomeFocusPillActive: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  outcomeFocusText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  outcomeFocusTextActive: {
    color: colors.text.primary,
  },
  outcomeChart: {
    height: components.sizes.chart.lg,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    overflow: 'hidden',
  },
  outcomeLine: {
    flex: 1,
  },
  outcomeLineSegment: {
    position: 'absolute',
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: colors.text.secondary,
  },
  outcomeCaption: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  scenarioFocusLine: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioInsightLine: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  optionList: {
    gap: components.layout.spacing.sm,
  },
  option: {
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  optionActive: {
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
  },
  optionText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  optionTextActive: {
    ...typography.styles.small,
    color: colors.text.primary,
    fontFamily: typography.fonts.interSemiBold,
  },
  insightCard: {
    gap: components.layout.spacing.xs,
  },
  insightTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  exerciseCard: {
    gap: components.layout.spacing.md,
  },
  exerciseBody: {
    flex: 1,
  },
  exerciseContent: {
    gap: components.layout.spacing.lg,
  },
  exerciseSection: {
    gap: components.layout.spacing.md,
  },
  introExercisePrimarySection: {
    marginTop: components.layout.sectionGap,
  },
  exerciseInstruction: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  exerciseStatusText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  exerciseStatusCorrect: {
    color: colors.text.primary,
  },
  exerciseStatusWrong: {
    color: colors.text.secondary,
  },
  exerciseSectionLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  exerciseSlots: {
    gap: components.layout.spacing.sm,
  },
  exerciseSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    minHeight: components.sizes.list.minItemHeight,
  },
  exerciseSlotExecution: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
  },
  exerciseSlotWrong: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  exerciseSlotHint: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
  },
  exerciseSlotIndex: {
    width: components.sizes.square.sm,
    height: components.sizes.square.sm,
    borderRadius: components.radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  exerciseSlotIndexText: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  exerciseSlotText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  exerciseSlotEmptyText: {
    color: colors.text.secondary,
  },
  exerciseSlotTextMuted: {
    ...typography.styles.body,
    color: colors.text.secondary,
    flex: 1,
  },
  exerciseChipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.sm,
  },
  exerciseChip: {
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  exerciseChipText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  exerciseActionRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: components.layout.spacing.sm,
  },
  exerciseHintButton: {
    width: '100%',
  },
  exerciseNextButton: {
    width: '100%',
  },
  exerciseFooter: {
    gap: components.layout.spacing.sm,
  },
  introExerciseFooter: {
    marginTop: components.layout.sectionGap,
  },
  exerciseHintBody: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  // ─── Intro exercise — Vertical slot stack design ──────────────────────────
  introSlotStack: {
    gap: components.layout.spacing.xs,
  },
  introSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
    paddingHorizontal: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    minHeight: 44,
    overflow: 'hidden',
  },
  introSlotEmpty: {
    borderColor: toRgba(colors.ui.divider, 0.3),
    borderStyle: 'dashed',
    backgroundColor: toRgba(colors.background.surface, 0.4),
  },
  introSlotFilled: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    borderStyle: 'solid',
    backgroundColor: colors.background.surface,
  },
  introSlotNext: {
    borderColor: toRgba(colors.ui.divider, 0.55),
    backgroundColor: toRgba(colors.background.surface, 0.7),
  },
  introSlotLocked: {
    borderStyle: 'solid',
    borderColor:
      mode === 'light'
        ? toRgba(colors.accent.primary, colors.opacity.stroke)
        : toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: mode === 'light' ? colors.accent.primary : colors.background.surface,
  },
  introSlotWrong: {
    borderStyle: 'solid',
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  introSlotCorrect: {
    borderStyle: 'solid',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  introSlotHint: {
    borderStyle: 'solid',
    borderColor: toRgba(colors.ui.divider, 0.55),
  },
  introSlotHighlight: {
    borderRadius: components.radius.input,
    backgroundColor: colors.ui.divider,
    opacity: 0,
  },
  introSlotBadge: {
    width: 24,
    height: 24,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text.secondary,
  },
  introSlotBadgeFilled: {
    backgroundColor: colors.text.secondary,
  },
  introSlotBadgeNext: {
    backgroundColor: colors.text.secondary,
  },
  introSlotBadgeLocked: {
    backgroundColor: mode === 'light' ? colors.accent.primary : colors.background.surface,
    borderWidth: components.borderWidth.thin,
    borderColor:
      mode === 'light'
        ? toRgba(colors.accent.primary, colors.opacity.stroke)
        : toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  introSlotBadgeWrong: {
    backgroundColor: colors.text.secondary,
  },
  introSlotBadgeCorrect: {
    backgroundColor: colors.background.surface,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  introSlotBadgeText: {
    fontFamily: typography.fonts.filsonBold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.background.surface,
  },
  introSlotBadgeTextFilled: {
    color: colors.background.surface,
  },
  introSlotBadgeTextNext: {
    color: colors.background.surface,
  },
  introSlotBadgeTextCorrect: {
    color: colors.text.primary,
  },
  introSlotLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  introSlotLabel: {
    ...typography.styles.small,
    color: colors.text.primary,
    flex: 1,
  },
  introSlotLabelLocked: {
    color: mode === 'light' ? colors.text.onAccent : colors.text.primary,
  },
  introSlotLabelCorrect: {
    color: colors.text.primary,
  },
  introSlotLabelWrong: {
    color: colors.accent.primary,
  },
  introSlotPlaceholder: {
    ...typography.styles.small,
    color: toRgba(colors.text.secondary, 0.4),
    flex: 1,
  },
  introSlotPlaceholderNext: {
    color: toRgba(colors.text.secondary, 0.65),
  },
  introCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.sm,
  },
  introCardPillActive: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  // ──────────────────────────────────────────────────────────────────────────
  exerciseOutcome: {
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  exerciseOutcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseOutcomeLabel: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  exerciseOutcomeChart: {
    height: components.sizes.chart.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surface,
    overflow: 'hidden',
  },
  exerciseOutcomeLineWrap: {
    flex: 1,
  },
  exerciseOutcomeLine: {
    flex: 1,
  },
  exerciseOutcomeLineSegment: {
    position: 'absolute',
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: colors.text.secondary,
  },
  exerciseLineStable: {
    backgroundColor: colors.text.secondary,
  },
  exerciseLineReactive: {
    backgroundColor: toRgba(colors.text.secondary, colors.opacity.surface),
  },
  exerciseOutcomeText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  exerciseLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  sequenceList: {
    gap: components.layout.spacing.sm,
    marginBottom: components.layout.spacing.sm,
  },
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  sequenceIndex: {
    width: components.sizes.square.xs,
    height: components.sizes.square.xs,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sequenceIndexText: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  sequenceText: {
    ...typography.styles.small,
    color: colors.text.primary,
    flex: 1,
  },
  sliderRow: {
    gap: components.layout.spacing.xs,
  },
  sliderTitle: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  sliderValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  sliderHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderHintText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  optionDisabled: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.stroke),
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  optionTextDisabled: {
    color: colors.text.secondary,
  },
  resultsBlock: {
    gap: components.layout.spacing.sm,
    marginTop: components.layout.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  resultValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scoreTrack: {
    height: components.sizes.hintBar.xs,
    borderRadius: components.radius.input,
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
  },
  scoreFill: {
    height: components.sizes.hintBar.xs,
    backgroundColor: colors.accent.primary,
  },
  impactList: {
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.xs,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  impactText: {
    ...typography.styles.small,
    flex: 1,
    color: colors.text.primary,
  },
  exerciseActions: {
    gap: components.layout.spacing.md,
  },
  reflectionHeader: {
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.md,
  },
  reflectionQuestion: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  reflectionSubtitle: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  reflectionTextAreaWrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, 0.6),
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  reflectionTextArea: {
    ...typography.styles.body,
    color: colors.text.primary,
    minHeight: components.sizes.input.multilineMinHeight,
    textAlignVertical: 'top',
  },
  reflectionPersonalizationHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    marginTop: components.layout.spacing.xs,
    paddingHorizontal: components.layout.spacing.xs,
  },
  reflectionResultCard: {
    borderRadius: components.radius.card,
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    padding: components.layout.spacing.lg,
    gap: components.layout.spacing.md,
  },
  reflectionAnswerText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  reflectionResultDivider: {
    height: components.borderWidth.thin,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  reflectionInsightBlock: {
    gap: components.layout.spacing.xs,
  },
  reflectionInsightLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  reflectionInsightText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  summaryCard: {
    gap: components.layout.spacing.md,
  },
  summaryHeaderBlock: {
    gap: components.layout.spacing.xs,
  },
  summaryTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  summarySubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  summaryHelper: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  summaryBody: {
    flex: 1,
  },
  summaryContent: {
    gap: components.layout.spacing.lg,
    flex: 1,
  },
  summaryScroll: {
    flex: 1,
  },
  summaryScrollContent: {
    paddingBottom: components.layout.spacing.md,
  },
  systemInsight: {
    ...typography.styles.body,
    textAlign: 'center',
    color: colors.text.primary,
  },
  summaryFooter: {
    marginTop: 'auto',
  },
  transparentScreen: {
    backgroundColor: 'transparent',
  },
  processMap: {
    position: 'relative',
    gap: components.layout.spacing.md,
    paddingLeft: components.layout.spacing.lg,
  },
  summaryProcessMap: {
    paddingLeft: components.layout.spacing.none,
    gap: components.layout.spacing.lg,
  },
  processLine: {
    position: 'absolute',
    left: components.offsets.lesson.processLineLeft,
    top: components.layout.spacing.xs,
    bottom: components.layout.spacing.xs,
    width: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  processStationBlock: {
    gap: components.layout.spacing.xs,
  },
  summaryStationBlock: {
    gap: components.layout.spacing.sm,
  },
  processStationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  processStationRowActive: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderRadius: components.radius.input,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.sm,
  },
  summaryStationRow: {
    paddingVertical: components.layout.spacing.md,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.md,
  },
  summaryStationRowActive: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  processNode: {
    width: components.sizes.dot.lg,
    height: components.sizes.dot.lg,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  processNodeActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary,
  },
  processStationText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  summaryStationText: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  processStationIndicator: {
    width: components.sizes.square.xs,
    height: components.sizes.square.xs,
    borderRadius: components.radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  summaryStationIndicator: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  summaryStationIndicatorActive: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  processStationIndex: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  processStationTitle: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
    flexShrink: 1,
  },
  summaryStationTitleActive: {
    color: colors.text.primary,
  },
  summaryIndexChip: {
    width: components.sizes.square.md,
    height: components.sizes.square.md,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  summaryIndexChipActive: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  summaryIndexText: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  summaryIndexTextActive: {
    color: colors.text.primary,
  },
  processPanel: {
    marginLeft: components.layout.spacing.lg,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.sm,
  },
  summaryProcessPanel: {
    marginLeft: components.sizes.square.md + components.layout.spacing.md,
    paddingVertical: components.layout.spacing.md,
    paddingHorizontal: components.layout.spacing.md,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  processDescription: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  processSubsteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.xs,
  },
  processChip: {
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  summaryProcessChip: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  processChipText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  takeawayList: {
    gap: components.layout.spacing.sm,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  takeawayText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surface,
  },
  videoText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  // ─── Summary step — interactive redesign ────────────────────────────────────
  summaryJourneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryJourneyNode: {
    width: components.sizes.square.sm,
    height: components.sizes.square.sm,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryJourneyConnector: {
    flex: 1,
    height: components.borderWidth.thin,
    backgroundColor: toRgba(colors.accent.primary, 0.25),
  },
  summaryInsightsLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  summaryInsightList: {
    gap: components.layout.spacing.sm,
  },
  summaryInsightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.md,
    padding: components.layout.spacing.lg,
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  summaryInsightCardConfirmed: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  summaryInsightIndex: {
    width: components.sizes.square.md,
    height: components.sizes.square.md,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: toRgba(colors.background.surfaceActive, 0.9),
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  summaryInsightIndexConfirmed: {
    backgroundColor: toRgba(colors.accent.primary, 0.15),
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
  },
  summaryInsightNumber: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  summaryInsightNumberConfirmed: {
    color: colors.accent.primary,
  },
  summaryInsightText: {
    ...typography.styles.body,
    flex: 1,
    color: colors.text.primary,
  },
  summaryRevealedContent: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  summaryRevealedTitle: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  summaryRevealedDesc: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  summaryRevealHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    flex: 1,
  },
  // ─── Intro summary — personalised scenario ──────────────────────────────────
  scenarioStoryCard: {
    borderRadius: 16,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    padding: components.layout.spacing.lg,
    gap: components.layout.spacing.xs,
  },
  scenarioStoryLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioStoryText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioQuestion: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scenarioQuestionBlock: {
    gap: components.layout.spacing.md,
  },
  scenarioOptionList: {
    gap: components.layout.spacing.sm,
  },
  scenarioRevealCard: {
    marginTop: components.layout.spacing.xs / 2,
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    padding: components.layout.spacing.lg,
    gap: components.layout.spacing.md,
  },
  scenarioRevealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  scenarioRevealLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioRevealLabelKey: {
    color: colors.accent.primary,
  },
  scenarioRevealText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioRevealDivider: {
    height: components.borderWidth.thin,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioRevealPersonal: {
    ...typography.styles.body,
    color: colors.accent.primary,
  },
  summaryNudgeText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  summaryReadyText: {
    ...typography.styles.meta,
    color: colors.accent.primary,
    textAlign: 'center',
  },

  // ─── Lesson 1 visualization: grid layout ────────────────────────────────────
  l1VisBody: {
    gap: components.layout.spacing.lg,
  },
  l1VisGrid: {
    width: '100%',
    flexDirection: 'column',
    gap: components.layout.spacing.md,
    marginTop: components.layout.spacing.sm,
  },
  l1CardShell: {
    width: '100%',
    borderRadius: components.radius.card,
  },
  l1CardShellActive: {
    transform: [{ scale: 1.01 }],
  },
  l1CardShellCompleted: {},
  l1CardShellLocked: {},
  l1FlipCard: {
    height: 264,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: components.radius.card,
  },
  l1Face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
    borderRadius: components.radius.card,
  },
  l1Page: {
    borderRadius: components.radius.card,
    padding: components.layout.spacing.lg,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.sm,
    justifyContent: 'flex-start',
  },
  l1FrontPage: {
    gap: components.layout.spacing.md,
    justifyContent: 'space-between',
  },
  l1PageActive: {
    borderColor: toRgba(colors.text.primary, 0.24),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  l1PageCompleted: {
    backgroundColor: toRgba(colors.background.surfaceActive, 0.92),
  },
  l1PageLocked: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  l1BackPage: {
    backgroundColor: toRgba(colors.background.surfaceActive, 0.96),
  },
  l1CardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: components.layout.spacing.sm,
  },
  l1StepMeta: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  l1StepKicker: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  l1CardLabel: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  l1StatusBadge: {
    width: components.sizes.square.sm,
    height: components.sizes.square.sm,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    overflow: 'hidden',
  },
  l1StatusBadgeActive: {
    borderColor: toRgba(colors.text.primary, 0.24),
  },
  l1StatusBadgeCompleted: {
    borderColor: toRgba(colors.text.primary, 0.24),
  },
  l1StatusBadgeLocked: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  l1StatusPulse: {
    position: 'absolute',
    width: components.sizes.dot.lg,
    height: components.sizes.dot.lg,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.text.primary, 0.2),
  },
  l1StatusDot: {
    width: components.sizes.dot.xs,
    height: components.sizes.dot.xs,
    borderRadius: components.radius.pill,
    backgroundColor: colors.text.primary,
  },
  l1AnimStateWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: components.sizes.chart.md,
  },
  l1AnimStateCompleted: {
    opacity: 0.86,
  },
  l1AnimStateLocked: {
    opacity: 0.34,
  },
  l1AnimCanvas: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: components.sizes.chart.md,
  },
  l1TapHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  l1TapHintLocked: {
    color: toRgba(colors.text.secondary, 0.92),
  },
  l1BackLabel: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  l1BackDetail: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  // ─── Goal animation ───────────────────────────────────────────────────────────
  l1GoalOptDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: toRgba(colors.text.primary, 0.78),
  },
  l1GoalChosenDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.text.primary,
  },
  l1GoalChosenDotAccent: {
    backgroundColor: toRgba(colors.accent.primary, 0.88),
  },
  l1GoalLockRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: toRgba(colors.text.primary, 0.9),
  },
  // ─── Risk animation ───────────────────────────────────────────────────────────
  l1RiskSingleChart: {
    width: '100%',
    height: 70,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: components.layout.spacing.xs,
  },
  l1RiskGridH: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    borderRadius: 1,
    backgroundColor: toRgba(colors.ui.divider, 0.22),
  },
  l1RiskVolSegment: {
    position: 'absolute',
    height: 2.5,
    borderRadius: 2,
    backgroundColor: toRgba(colors.text.primary, 0.92),
  },
  l1RiskStableSegment: {
    position: 'absolute',
    height: 2.5,
    borderRadius: 2,
    backgroundColor: toRgba(colors.text.primary, 0.62),
  },
  l1RiskVolDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: toRgba(colors.accent.primary, 0.86),
  },
  l1RiskStableDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: toRgba(colors.text.primary, 0.72),
  },
  // ─── Strategy animation ───────────────────────────────────────────────────────
  l1StratRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  l1StratNodeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.text.primary,
  },
  l1StratNodeAccent: {
    backgroundColor: toRgba(colors.accent.primary, 0.86),
  },
  l1StratConnLine: {
    height: 2,
    width: 28,
    backgroundColor: toRgba(colors.text.primary, 0.78),
  },
  // ─── Allocation animation ─────────────────────────────────────────────────────
  l1AllocWrap: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  l1AllocSliceLayer: {
    position: 'absolute',
    width: L1_ALLOC_PIE_SIZE,
    height: L1_ALLOC_PIE_SIZE,
  },
  // ─── Vehicle animation ────────────────────────────────────────────────────────
  l1VehicleTokenRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  l1VehicleTokenWrap: {
    alignItems: 'center',
    gap: 5,
  },
  l1VehicleToken: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, 0.9),
  },
  l1VehicleTokenLabel: {
    fontFamily: typography.fonts.interMedium,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8,
    color: colors.text.primary,
  },
  l1VehicleSelDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: toRgba(colors.accent.primary, 0.9),
  },
  // ─── Execution animation ──────────────────────────────────────────────────────
  l1ExecCheckRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 12,
  },
  l1ExecCheckDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text.primary,
  },
  l1ExecFireWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  l1ExecFireRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: toRgba(colors.text.primary, 0.9),
  },
  l1ExecFireCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: toRgba(colors.accent.primary, 0.9),
  },
  });

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
