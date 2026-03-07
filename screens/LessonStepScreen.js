import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
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
import StepHeader from '../components/StepHeader';
import { glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getScenarioVariant } from '../utils/helpers';
import { collectGlossaryTermIds } from '../utils/glossary';
import {
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
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  return { colors, components, styles };
}

export default function LessonStepScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, step = 1, entrySource } = route.params || {};
  const { userContext, onboardingContext, addReflection, completeLesson, preferences } = useApp();
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
  const isIntroScenario = lessonId === 'lesson_0' && step === 3;

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
        return lessonId === 'lesson_0'
          ? 'Het volledige investeringsproces'
          : introTitle || 'The full investing process';
      default:
        return `${copy.labels.part} ${step}`;
    }
  }, [content, copy.labels.part, lessonId, preferences?.language, step]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      navigation.push('LessonStep', { lessonId, step: step + 1, entrySource });
    }
  };

  const handleComplete = async () => {
    await completeLesson(lessonId);
    navigation.navigate('LessonSuccess', { lessonId });
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

  return (
    <ScreenBackground variant="bg3">
      <LessonStepContainer
        scrollEnabled={!disableOuterScroll && !isLessonGlossaryOpen}
        containerStyle={styles.transparentScreen}
      >
      <StepHeader
        step={step}
        total={TOTAL_STEPS}
        title={stepTitle}
        onBack={() => navigation.goBack()}
        onOpenGlossary={() => setLessonGlossaryOpen(true)}
        glossaryLabel={copy.labels.termsInLesson}
        onPressTerm={handleTermPress}
        stepLabel={flowMetaLabel}
        helperText={
          isIntroScenario ? copy.introScenario.headerHelper : null
        }
        showTitle={!(lessonId === 'lesson_0' && step === 1)}
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
          keyboardOffset={keyboardOffset}
        />
      )}
      {step === 6 && (
        lessonId === 'lesson_0' ? (
          <IntroSummaryStep
            content={content}
            onComplete={handleComplete}
            onPressTerm={handleTermPress}
            copy={copy}
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
  const subtitle = isGuidedSequence ? INTRO_VISUALIZATION_SUBTITLE : copy.introVisualization.subtitle;

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
      <AppText style={styles.journeySubtitle}>
        {subtitle}
      </AppText>
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
  const totalSteps = steps.length;
  const reactiveMissingIds = ['goal', 'risk', 'strategy', 'allocation'];

  // Phase flow: choice → consequence → process → reveal
  const [phase, setPhase] = useState('choice');
  const [completedSteps, setCompletedSteps] = useState([]);

  const processProgress = completedSteps.length / totalSteps;
  const allStepsDone = completedSteps.length === totalSteps;

  const handleCompleteStep = (stepId, index) => {
    if (completedSteps.includes(stepId)) return;
    if (completedSteps.length !== index) return;
    setCompletedSteps((prev) => [...prev, stepId]);
  };

  // ─── Phase: CHOICE ────────────────────────────────────────────────────────────
  if (phase === 'choice') {
    return (
      <View style={styles.stepBody}>
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

        <View style={styles.narrativeChoiceRow}>
          <Pressable
            onPress={() => setPhase('consequence')}
            style={({ pressed }) => [
              styles.narrativeChoiceCard,
              styles.narrativeChoiceCardReactive,
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
            onPress={() => setPhase('process')}
            style={({ pressed }) => [
              styles.narrativeChoiceCard,
              styles.narrativeChoiceCardPlan,
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
      </View>
    );
  }

  // ─── Phase: CONSEQUENCE ───────────────────────────────────────────────────────
  if (phase === 'consequence') {
    return (
      <View style={styles.stepBody}>
        <Card style={styles.narrativeConsequenceCard}>
          <AppText style={styles.narrativeConsequenceHeading}>
            Lars voert direct uit.
          </AppText>
          <AppText style={styles.narrativeConsequenceBody}>
            Geen doel. Geen risicoprofiel. Geen strategie. Wat heeft hij eigenlijk gekocht?
          </AppText>
        </Card>

        <View style={styles.narrativeFullChart}>
          <ScenarioCurve variant="volatile" progress={1} label="ONZEKER" />
        </View>

        <Card style={styles.narrativeInsightRow}>
          <Ionicons
            name="warning-outline"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
          <AppText style={styles.narrativeInsightText}>
            {copy.introScenario.insightLine}
          </AppText>
        </Card>

        <PrimaryButton
          label="Zie wat anders kon"
          onPress={() => {
            setCompletedSteps([]);
            setPhase('process');
          }}
        />
      </View>
    );
  }

  // ─── Phase: PROCESS ───────────────────────────────────────────────────────────
  if (phase === 'process') {
    return (
      <View style={styles.stepBody}>
        <View style={styles.narrativeFullChart}>
          <ScenarioCurve variant="stable" progress={processProgress} label="STABIEL" />
        </View>

        <View style={styles.narrativeProcessList}>
          {steps.map((step, index) => {
            const isDone = completedSteps.includes(step.id);
            const isNext = completedSteps.length === index;
            const isLocked = !isDone && !isNext;
            return (
              <Pressable
                key={step.id}
                onPress={() => handleCompleteStep(step.id, index)}
                disabled={isDone || isLocked}
                style={[
                  styles.narrativeProcessRow,
                  isDone && styles.narrativeProcessRowDone,
                  isNext && styles.narrativeProcessRowNext,
                  isLocked && styles.narrativeProcessRowLocked,
                ]}
              >
                <View
                  style={[
                    styles.narrativeProcessDot,
                    isDone && styles.narrativeProcessDotDone,
                    isNext && styles.narrativeProcessDotNext,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={12} color={colors.text.onAccent} />
                  ) : (
                    <AppText style={styles.narrativeProcessNum}>{index + 1}</AppText>
                  )}
                </View>
                <AppText
                  style={[
                    styles.narrativeProcessLabel,
                    isDone && styles.narrativeProcessLabelDone,
                    isLocked && styles.narrativeProcessLabelLocked,
                  ]}
                >
                  {step.label}
                </AppText>
                {isNext && (
                  <AppText style={styles.narrativeProcessCta}>Tik →</AppText>
                )}
              </Pressable>
            );
          })}
        </View>

        {allStepsDone && (
          <PrimaryButton
            label="Vergelijk de uitkomsten"
            onPress={() => setPhase('reveal')}
          />
        )}
      </View>
    );
  }

  // ─── Phase: REVEAL ────────────────────────────────────────────────────────────
  const revealStructuredSteps = steps.map((step) => ({
    ...step,
    isActive: true,
    isCurrent: false,
  }));
  const revealReactiveSteps = steps.map((step) => {
    const isMissing = reactiveMissingIds.includes(step.id);
    return { ...step, isActive: !isMissing, isCurrent: false, isMissing };
  });

  return (
    <View style={styles.stepBody}>
      <AppText style={styles.narrativeRevealHeading}>
        Dezelfde belegger. Twee keuzes.
      </AppText>

      <View style={styles.scenarioCompareGrid}>
        <Card
          style={[
            styles.scenarioComparePanel,
            {
              backgroundColor: toRgba(
                colors.background.surfaceActive,
                colors.opacity.surface
              ),
            },
          ]}
        >
          <View style={styles.scenarioCompareHeader}>
            <AppText style={styles.scenarioCompareLabel}>MET PLAN</AppText>
          </View>
          <ScenarioCurve variant="stable" progress={1} label="STABIEL" />
          <View style={styles.scenarioCompareSteps}>
            {revealStructuredSteps.map((step, index) => {
              const isLast = index === revealStructuredSteps.length - 1;
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

        <Card
          style={[
            styles.scenarioComparePanel,
            styles.scenarioComparePanelReactive,
            {
              backgroundColor: toRgba(
                colors.background.surface,
                colors.opacity.surface
              ),
            },
          ]}
        >
          <View style={styles.scenarioCompareHeader}>
            <AppText style={styles.scenarioCompareLabel}>ZONDER PLAN</AppText>
          </View>
          <ScenarioCurve variant="volatile" progress={1} label="ONZEKER" />
          <View style={styles.scenarioCompareSteps}>
            {revealReactiveSteps.map((step, index) => {
              const isLast = index === revealReactiveSteps.length - 1;
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
      </View>

      <AppText style={styles.scenarioInsightLine}>{copy.introScenario.insightLine}</AppText>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
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
  const { styles } = useLessonStepStyles();
  const { items = [], correctOrder = [] } = exercise;
  const [placements, setPlacements] = useState(
    () => items.reduce((acc, item) => ({ ...acc, [item.id]: null }), {})
  );
  const [hintActive, setHintActive] = useState(false);
  const [showHint, setShowHint] = useState(false);

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

  const handlePlace = (id) => {
    if (placements[id] !== null && placements[id] !== undefined) return;
    const nextIndex = slots.findIndex((item) => !item);
    if (nextIndex === -1) return;
    setPlacements((prev) => ({ ...prev, [id]: nextIndex }));
  };

  const handleRemove = (id) => {
    setPlacements((prev) => ({ ...prev, [id]: null }));
  };

  const handleHint = () => {
    setHintActive(true);
    setShowHint(true);
    setTimeout(() => {
      setHintActive(false);
    }, 1500);
  };

  return (
    <View style={[styles.stepBody, styles.exerciseBody]}>
      <View style={styles.exerciseContent}>
        <AppText style={styles.exerciseInstruction}>{copy.introExercise.instruction}</AppText>
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

        <View style={styles.exerciseSection}>
          <AppText style={styles.exerciseSectionLabel}>{copy.labels.yourProcess}</AppText>
          <View style={styles.exerciseSlots}>
            {slots.map((item, index) => {
              const isExecutionSlot = index === slots.length - 1;
              return (
                <View
                  key={`slot-${index}`}
                  style={[
                    styles.exerciseSlot,
                    isExecutionSlot && styles.exerciseSlotExecution,
                    wrongSlots[index] && styles.exerciseSlotWrong,
                    hintActive && index === 0 && styles.exerciseSlotHint,
                  ]}
                >
                  <View style={styles.exerciseSlotIndex}>
                    <AppText style={styles.exerciseSlotIndexText}>{index + 1}</AppText>
                  </View>
                  {item ? (
                    <Pressable onPress={() => handleRemove(item.id)}>
                      <View style={styles.exerciseChip}>
                        <AppText style={styles.exerciseChipText}>{item.label}</AppText>
                      </View>
                    </Pressable>
                  ) : (
                    <AppText style={styles.exerciseSlotTextMuted}>
                      {isExecutionSlot ? copy.labels.executionLast : copy.labels.emptySlot}
                    </AppText>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.exerciseSection}>
          <AppText style={styles.exerciseSectionLabel}>{copy.labels.availableSteps}</AppText>
          <View style={styles.exerciseChipList}>
            {available.map((item) => {
              return (
                <Pressable key={item.id} onPress={() => handlePlace(item.id)}>
                  <View style={styles.exerciseChip}>
                    <AppText style={styles.exerciseChipText}>{item.label}</AppText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.exerciseFooter}>
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

function ReflectionStep({ content, onSubmit, onPressTerm, copy, keyboardOffset }) {
  const { colors, components, styles } = useLessonStepStyles();
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [response, setResponse] = useState(null);
  const intro = content?.steps?.reflection?.intro;
  const question =
    copy.messages.reflectionQuestion || content?.steps?.reflection?.question;
  const placeholder =
    copy.messages.reflectionPlaceholder || content?.steps?.reflection?.placeholder;
  const canSend = text.trim().length > 0;
  const canContinue = !!response;
  const isClosed = !!response;

  const buildResponse = (input) => {
    const normalized = (input || '').toLowerCase().trim();
    if (!normalized || normalized.length < 6) {
      return copy.messages.reflectionShort;
    }
    const structureWords = [
      'order',
      'sequence',
      'step',
      'process',
      'structure',
      'framework',
      'flow',
      'plan',
      'planning',
      'prior',
      'before',
      'clarity',
    ];
    const emotionWords = [
      'fear',
      'anxiety',
      'panic',
      'stress',
      'nervous',
      'worry',
      'emotional',
      'impulse',
      'impulsive',
      'reactive',
      'react',
      'fomo',
    ];
    const hasStructure = structureWords.some((word) => normalized.includes(word));
    const hasEmotion = emotionWords.some((word) => normalized.includes(word));
    if (hasStructure) {
      return copy.messages.reflectionStructure;
    }
    if (hasEmotion) {
      return copy.messages.reflectionEmotion;
    }
    return copy.messages.reflectionDefault;
  };

  const handleSend = () => {
    if (isClosed) return;
    if (!canSend) return;
    const trimmed = text.trim();
    setSubmittedText(trimmed);
    setResponse(buildResponse(trimmed));
    setText('');
  };

  const handleContinue = () => {
    if (!response) {
      handleSend();
      return;
    }
    onSubmit(submittedText || text, response);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardOffset : 0}
      style={[styles.stepBody, styles.reflectionBody]}
    >
      {intro ? <AppText style={styles.stepIntro}>{intro}</AppText> : null}
      <ScrollView
        style={styles.reflectionScroll}
        contentContainerStyle={styles.reflectionScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.reflectionThread}>
          <View style={[styles.chatBubble, styles.chatBubbleSystem]}>
            <AppText style={styles.chatLabel}>EQTY</AppText>
            <GlossaryText text={question} style={styles.chatText} onPressTerm={onPressTerm} />
          </View>
          {submittedText ? (
            <View style={[styles.chatBubble, styles.chatBubbleUser]}>
              <AppText style={styles.chatText}>{submittedText}</AppText>
            </View>
          ) : null}
          {response ? (
            <View style={[styles.chatBubble, styles.chatBubbleSystem]}>
              <AppText style={styles.chatLabel}>{copy.labels.eqtyInsight}</AppText>
              <AppText style={styles.chatText}>{response}</AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.reflectionFooter}>
        {isClosed ? (
          <View style={styles.reflectionClosedCard}>
            <Ionicons
              name="lock-closed"
              size={components.sizes.icon.sm}
              color={colors.text.secondary}
            />
            <View style={styles.reflectionClosedTextWrap}>
              <AppText style={styles.reflectionClosedTitle}>
                {copy.messages.reflectionLockedTitle}
              </AppText>
              <AppText style={styles.reflectionClosedText}>
                {copy.messages.reflectionLockedBody}
              </AppText>
            </View>
          </View>
        ) : null}
        <PrimaryButton
          label={copy.buttons.continue}
          onPress={handleContinue}
          disabled={!canContinue}
        />
        {isClosed ? null : (
          <View style={styles.reflectionComposer}>
            <AppTextInput
              style={styles.reflectionInput}
              value={text}
              onChangeText={(value) => {
                if (isClosed) return;
                setText(value);
                setResponse(null);
              }}
              placeholder={placeholder}
              placeholderTextColor={colors.text.secondary}
              multiline
            />
            <Pressable
              onPress={handleSend}
              disabled={!canSend}
              style={({ pressed }) => [
                styles.reflectionSendButton,
                !canSend && styles.reflectionSendButtonDisabled,
                pressed && canSend && styles.reflectionSendButtonPressed,
              ]}
            >
              <Ionicons
                name="arrow-up"
                size={components.sizes.icon.sm}
                color={canSend ? colors.text.primary : colors.text.secondary}
              />
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function SummaryStep({ content, onComplete, onPressTerm, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  return (
    <View style={styles.stepBody}>
      <Card style={styles.summaryCard}>
        <AppText style={styles.bodyText}>{copy.labels.keyTakeaways}</AppText>
        <View style={styles.takeawayList}>
          {content?.steps?.summary?.takeaways?.map((item) => (
            <View key={item} style={styles.takeawayRow}>
              <Ionicons
                name="checkmark-circle"
                size={components.sizes.icon.md}
                color={colors.accent.primary}
              />
              <AppText style={styles.takeawayText}>{item}</AppText>
            </View>
          ))}
        </View>
      </Card>

      {content?.steps?.summary?.video ? (
        <Pressable
          onPress={() => Linking.openURL(content.steps.summary.video.url)}
          style={styles.videoRow}
        >
          <Ionicons
            name="play-circle"
            size={components.sizes.icon.lg}
            color={colors.accent.primary}
          />
          <AppText style={styles.videoText}>{content.steps.summary.video.label}</AppText>
        </Pressable>
      ) : null}

      <PrimaryButton label={copy.buttons.completeLesson} onPress={onComplete} />
    </View>
  );
}

function IntroSummaryStep({ content, onComplete, onPressTerm, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const summarySubtext =
    'Dit is het vaste stappenplan dat elke investering structureert.';
  const summaryHelper = 'Tik op de stappen voor meer info.';
  const stations = [
    {
      id: 'target',
      title: 'Doelbepaling',
      description: 'Definieer het doel en de grenzen voor uitvoering.',
      substeps: ['Doel', 'Tijdshorizon', 'Doeltype'],
    },
    {
      id: 'drivers',
      title: 'Individuele risicoanalyse',
      description: 'Verduidelijk de randvoorwaarden die elke beslissing vormen.',
      substeps: ['Risicocapaciteit', 'Risicotolerantie', 'Financiële middelen'],
    },
    {
      id: 'strategy',
      title: 'Financiële investeringsstrategie',
      description: 'Zet de regels vast die beslissingen onder onzekerheid sturen.',
      substeps: ['Liquiditeit', 'Kosten', 'Ethiek/ESG', 'Dividendvoorkeur'],
    },
    {
      id: 'allocation',
      title: 'Kapitaalallocatie',
      description: 'Verdeel kapitaal over gedefinieerde prioriteiten.',
      substeps: ['Activaklassen', 'Diversificatie', 'Voorbeeldallocaties'],
    },
    {
      id: 'vehicles',
      title: 'Beleggingsinstrumenten',
      description: 'Selecteer de tools die het plan uitdrukken.',
      substeps: ['Aandelen', 'Obligaties', "ETF's", 'Alternatieven'],
    },
    {
      id: 'execution',
      title: 'Uitvoering',
      description: 'Plaats orders pas wanneer het systeem duidelijk is.',
      substeps: ['Ordertypes', 'Transactiekosten', 'Uitvoering komt als laatste'],
    },
  ];
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <View style={[styles.stepBody, styles.summaryBody]}>
      <View style={styles.summaryHeaderBlock}>
        <AppText style={styles.summarySubtitle}>{summarySubtext}</AppText>
        <AppText style={styles.summaryHelper}>{summaryHelper}</AppText>
      </View>

      <View style={styles.summaryContent}>
        <View style={styles.summaryScroll}>
          <View style={[styles.processMap, styles.summaryProcessMap]}>
            {stations.map((station, index) => {
              const isActive = index === activeIndex;
              return (
                <View
                  key={station.id}
                  style={[styles.processStationBlock, styles.summaryStationBlock]}
                >
                  <Pressable
                    onPress={() =>
                      setActiveIndex((prev) => (prev === index ? null : index))
                    }
                    style={[
                      styles.processStationRow,
                      styles.summaryStationRow,
                      isActive && styles.summaryStationRowActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.summaryIndexChip,
                        isActive && styles.summaryIndexChipActive,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.summaryIndexText,
                          isActive && styles.summaryIndexTextActive,
                        ]}
                      >
                        {index + 1}
                      </AppText>
                    </View>
                    <View style={styles.summaryStationText}>
                      <AppText
                        style={[
                          styles.processStationTitle,
                          isActive && styles.summaryStationTitleActive,
                        ]}
                      >
                        {station.title}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.processStationIndicator,
                        styles.summaryStationIndicator,
                        isActive && styles.summaryStationIndicatorActive,
                      ]}
                    >
                      <Ionicons
                        name={isActive ? 'chevron-down' : 'chevron-forward'}
                        size={components.sizes.icon.sm}
                        color={isActive ? colors.accent.primary : colors.text.secondary}
                      />
                    </View>
                  </Pressable>
                  {isActive ? (
                    <View style={[styles.processPanel, styles.summaryProcessPanel]}>
                      <AppText style={styles.processDescription}>
                        {station.description}
                      </AppText>
                      <View style={styles.processSubsteps}>
                        {station.substeps?.map((item) => (
                          <View
                            key={`${station.id}-${item}`}
                            style={[styles.processChip, styles.summaryProcessChip]}
                          >
                            <AppText style={styles.processChipText}>{item}</AppText>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.summaryFooter}>
        <PrimaryButton label={copy.buttons.continue} onPress={onComplete} />
      </View>
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
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
  // ─── Narrative redesign ───────────────────────────────────────────────────────
  narrativeCard: {
    gap: components.layout.spacing.md,
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
    borderColor: toRgba(colors.accent.primary, 0.4),
    backgroundColor: toRgba(colors.accent.primary, 0.06),
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
  narrativeConsequenceCard: {
    gap: components.layout.spacing.sm,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  narrativeConsequenceHeading: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  narrativeConsequenceBody: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  narrativeFullChart: {
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    padding: components.layout.spacing.md,
    overflow: 'hidden',
  },
  narrativeInsightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.layout.spacing.sm,
  },
  narrativeInsightText: {
    ...typography.styles.small,
    color: colors.text.secondary,
    flex: 1,
  },
  narrativeProcessList: {
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    overflow: 'hidden',
  },
  narrativeProcessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.md,
    paddingVertical: components.layout.spacing.md,
    paddingHorizontal: components.layout.spacing.lg,
    borderBottomWidth: components.borderWidth.thin,
    borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  narrativeProcessRowDone: {
    opacity: 0.6,
  },
  narrativeProcessRowNext: {
    backgroundColor: toRgba(colors.background.surfaceActive, 0.7),
  },
  narrativeProcessRowLocked: {
    opacity: 0.35,
  },
  narrativeProcessDot: {
    width: components.sizes.square.xs,
    height: components.sizes.square.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  narrativeProcessDotDone: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  narrativeProcessDotNext: {
    borderColor: colors.text.primary,
    borderWidth: 2,
  },
  narrativeProcessNum: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  narrativeProcessLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  narrativeProcessLabelDone: {
    color: colors.text.secondary,
  },
  narrativeProcessLabelLocked: {
    color: colors.text.secondary,
  },
  narrativeProcessCta: {
    ...typography.styles.small,
    color: colors.accent.primary,
  },
  narrativeRevealHeading: {
    ...typography.styles.h3,
    color: colors.text.primary,
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
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  optionText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  optionTextActive: {
    color: colors.text.primary,
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
    marginTop: 'auto',
    gap: components.layout.spacing.sm,
  },
  exerciseHintBody: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
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
  reflectionThread: {
    gap: components.layout.spacing.lg,
  },
  reflectionBody: {
    flex: 1,
    gap: components.layout.spacing.md,
  },
  reflectionScroll: {
    flex: 1,
  },
  reflectionScrollContent: {
    paddingTop: components.layout.spacing.sm,
    paddingBottom: components.layout.spacing.xxl,
  },
  reflectionFooter: {
    gap: components.layout.spacing.md,
    marginTop: 'auto',
    paddingTop: components.layout.spacing.sm,
    borderTopWidth: components.borderWidth.thin,
    borderTopColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  reflectionClosedCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  reflectionClosedTextWrap: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  reflectionClosedTitle: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  reflectionClosedText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  chatBubble: {
    maxWidth: '92%',
    borderRadius: components.radius.input,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  chatBubbleSystem: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.surface,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
  },
  chatLabel: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    marginBottom: components.layout.spacing.xs,
  },
  chatText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  reflectionComposer: {
    ...components.input.container,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: components.layout.spacing.sm,
  },
  reflectionInput: {
    flex: 1,
    ...components.input.multiline,
    ...components.input.text,
    maxHeight: components.sizes.input.composerMaxHeight,
    textAlignVertical: 'top',
  },
  reflectionSendButton: {
    width: components.sizes.square.lg,
    height: components.sizes.square.lg,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
  },
  reflectionSendButtonPressed: {
    transform: [{ scale: components.transforms.scalePressedStrong }],
  },
  reflectionSendButtonDisabled: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  reflectionSavedPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  reflectionSavedText: {
    ...typography.styles.small,
    color: colors.text.secondary,
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
