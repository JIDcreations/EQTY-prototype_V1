import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
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
  Text,
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
  FadeOutUp,
  LinearTransition,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, G, Circle, Ellipse } from 'react-native-svg';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import ConceptDropdownMenu from '../components/ConceptDropdownMenu';
import ConceptInfoCard from '../components/ConceptInfoCard';
import OnboardingProgress from '../components/OnboardingProgress';
import ProcessGridFlipCard from '../components/ProcessGridFlipCard';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import ReflectionResultCard from '../components/ReflectionResultCard';
import { useGlossary } from '../components/GlossaryProvider';
import GlossaryText from '../components/GlossaryText';
import LessonStepContainer from '../components/LessonStepContainer';
import ScreenBackground from '../components/ScreenBackground';
import SelectableOptionButton from '../components/SelectableOptionButton';
import SplitInsightCard from '../components/SplitInsightCard';
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
const L1_ALLOC_SVG_SIZE = 90;
const L1_ALLOC_CX = 45;
const L1_ALLOC_CY = 45;
const L1_ALLOC_R = 33;
// Slice start angles: -90°, 30°, 150°. Each sweeps 120°.
const INTRO_VISUALIZATION_TITLE = '6 stappen vóór beleggen';
const INTRO_VISUALIZATION_SUBTITLE =
  'Klik op een stap voor de uitleg van een animatie.';
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
      'Risicoanalyse bepaalt hoeveel risico jij aankan. Dat hangt af van hoe lang je wil investeren en hoe je reageert als je geld daalt.',
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
const INTRO_PROCESS_GLOSSARY_TERM_IDS = [
  'eqty_goal_definition',
  'eqty_risk_analysis',
  'eqty_capital_allocation',
  'eqty_investment_strategy',
  'eqty_investment_vehicle',
  'eqty_execution',
];


const glossaryTermIndex = glossaryTerms.reduce((acc, term) => {
  if (term?.id) acc[term.id] = term;
  return acc;
}, {});

const sortTermsAlphabetically = (terms, language) =>
  [...terms].sort((left, right) =>
    (left?.term || '').localeCompare(right?.term || '', language || 'nl', {
      sensitivity: 'base',
    })
  );

const extractGlossaryTermIds = (content) => {
  const explicitTermIds = Array.isArray(content?.glossaryTerms)
    ? content.glossaryTerms
        .map((entry) => {
          if (typeof entry === 'string') return entry;
          return entry?.termId || entry?.id || null;
        })
        .filter(Boolean)
    : [];

  return Array.from(new Set([...explicitTermIds, ...collectGlossaryTermIds(content || {})]));
};

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
  const stepScrollRef = useRef(null);
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
    () => extractGlossaryTermIds(content),
    [content]
  );
  const lessonTerms = useMemo(() => {
    const termIds = lessonId === 'lesson_0' ? INTRO_PROCESS_GLOSSARY_TERM_IDS : lessonTermIds;
    return sortTermsAlphabetically(
      termIds.map((termId) => glossaryTermIndex[termId]).filter(Boolean),
      preferences?.language
    );
  }, [lessonId, lessonTermIds, preferences?.language]);
  const isLessonSearchActive = lessonTermQuery.trim().length > 0;
  const globalSearchResults = useMemo(() => {
    const query = lessonTermQuery.trim().toLowerCase();
    if (!query) return [];
    return sortTermsAlphabetically(
      glossaryTerms.filter((term) => {
        const name = term.term?.toLowerCase() || '';
        const definition = term.definition?.toLowerCase() || '';
        return name.includes(query) || definition.includes(query);
      }),
      preferences?.language
    );
  }, [lessonTermQuery, preferences?.language]);
  const displayedLessonTerms = isLessonSearchActive ? globalSearchResults : lessonTerms;
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  const lessonGlossaryResultsLabel = isLessonSearchActive
    ? copy.labels.lessonGlossaryResultsCount(displayedLessonTerms.length)
    : null;
  
  useEffect(() => {
    if (!isLessonGlossaryOpen) setLessonTermQuery('');
  }, [isLessonGlossaryOpen]);
  const stepTitle = useMemo(() => {
    if (!content) return `${copy.labels.part} ${step}`;
    const introTitle = getIntroStepTitle(preferences?.language, step);
    switch (step) {
      case 1:
        if (lessonId === 'lesson_0') {
          return locale === 'nl'
            ? 'Wat is beleggen als een proces?'
            : 'What is investing as a process?';
        }
        return content.steps.concept.title;
      case 2:
        return lessonId === 'lesson_0'
          ? INTRO_VISUALIZATION_TITLE
          : content.steps.visualization.title || introTitle;
      case 3:
        return content.steps.scenario.title;
      case 4:
        return content?.steps?.exercise?.title || introTitle || 'Build the process';
      case 5:
        return content?.steps?.reflection?.title || introTitle || 'Reflection';
      case 6:
        if (lessonId === 'lesson_0') return 'Het volledige investeringsproces';
        return content?.steps?.summary?.title || (locale === 'nl' ? 'Wat je geleerd hebt' : 'What you learned');
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

  const scrollToAnswerReveal = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        stepScrollRef.current?.scrollToEnd?.({ animated: true });
      }, 120);
    });
  }, []);

  const disableOuterScroll = lessonId === 'lesson_0' && step === 5;
  let flowPhaseLabel = copy.labels.lessonFlowPhases?.[step] || copy.labels.part;
  if (lessonId === 'lesson_0' && step === 6) {
    flowPhaseLabel = 'Samenvatting';
  }
  const flowMetaLabel = `${flowPhaseLabel} · ${step}/${TOTAL_STEPS}`.toUpperCase();
  const topSectionSubtitle = useMemo(() => {
    if (step === 1 && lessonId === 'lesson_0') {
      return locale === 'nl'
        ? 'Een stappenplan dat je volgt ter voorbereiding op investeren.'
        : 'A step-by-step plan you follow in preparation for investing.';
    }
    if (step === 1 && lessonId !== 'lesson_0') {
      return content?.steps?.concept?.intro || null;
    }
    if (step === 2 && lessonId !== 'lesson_0') {
      return content?.steps?.visualization?.subtitle || null;
    }
    if (step === 3 && (lessonId === 'lesson_1' || lessonId === 'lesson_2')) {
      return content?.steps?.scenario?.intro || null;
    }
    if (step === 4 && lessonId !== 'lesson_0') {
      return content?.steps?.exercise?.subtitle || null;
    }
    if (step === 6 && lessonId !== 'lesson_0') {
      return content?.steps?.summary?.subtitle || (lessonId === 'lesson_1'
        ? (locale === 'nl' ? 'Herken je het ontbrekende element?' : 'Can you spot what is missing?')
        : (locale === 'nl'
          ? 'Tik op elk inzicht om te bevestigen dat het is blijven hangen.'
          : 'Tap each insight to confirm what stuck with you.'));
    }
    if (lessonId !== 'lesson_0') return null;
    if (step === 2) return INTRO_VISUALIZATION_SUBTITLE;
    if (step === 3) return copy.introScenario.headerHelper;
    if (step === 4) {
      return 'Plaats de stappen van het beleggingsproces in de juiste volgorde. Klik op de volgende stap.';
    }
    if (step === 6) return 'Herken je het proces in een echte situatie?';
  }, [content, copy.introScenario.headerHelper, lessonId, locale, step]);

  return (
    <View style={styles.root}>
    <ScreenBackground variant="bg3">
      <LessonStepContainer
        scrollRef={stepScrollRef}
        scrollEnabled={!disableOuterScroll && !isLessonGlossaryOpen}
        containerStyle={styles.transparentScreen}
        fillViewport={step === 2}
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
        showTitle={step !== 5}
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
          onAnswerReveal={scrollToAnswerReveal}
        />
      ) : (lessonId === 'lesson_1' || lessonId === 'lesson_2') ? (
        <Lesson1ContextualScenarioStep
          content={content}
          onNext={handleNext}
          copy={copy}
          onAnswerReveal={scrollToAnswerReveal}
        />
      ) : (
        <ScenarioStep
          content={content}
          userContext={userContext}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
          onAnswerReveal={scrollToAnswerReveal}
        />
      ))}
      {step === 4 && (
        <ExerciseStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          onOpenLessonGlossary={() => setLessonGlossaryOpen(true)}
          copy={copy}
          onAnswerReveal={scrollToAnswerReveal}
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
        lessonId === 'lesson_0' || lessonId === 'lesson_2' ? (
          <IntroSummaryStep
            content={content}
            onComplete={handleComplete}
            onPressTerm={handleTermPress}
            copy={copy}
            language={preferences?.language}
            onAnswerReveal={scrollToAnswerReveal}
          />
        ) : lessonId === 'lesson_1' ? (
          <Lesson1SummaryStep
            content={content}
            onComplete={handleComplete}
            copy={copy}
            onAnswerReveal={scrollToAnswerReveal}
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
                <View style={styles.lessonGlossarySearchMeta}>
                  <AppText style={styles.lessonGlossarySearchLabel}>
                    {copy.labels.fullGlossaryResults}
                  </AppText>
                  <AppText style={styles.lessonGlossarySearchCount}>
                    {lessonGlossaryResultsLabel}
                  </AppText>
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleLessonTermPress(item)}
              style={({ pressed }) => [
                styles.lessonGlossaryRow,
                index < displayedLessonTerms.length - 1 && styles.lessonGlossaryDivider,
                pressed && styles.lessonGlossaryRowPressed,
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
                  ? copy.messages.lessonGlossaryEmptySearch
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

  if (lessonId === 'lesson_1' || lessonId === 'lesson_2') {
    return <GoalConceptStep content={content} onNext={onNext} copy={copy} />;
  }

  if (content?.steps?.concept?.drivers?.length) {
    return (
      <AnchorConceptStep
        content={content}
        lessonId={lessonId}
        onNext={onNext}
        copy={copy}
      />
    );
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
  const { styles } = useLessonStepStyles();
  const steps = copy.introConcept.steps;
  const processLeadTitle = 'Dit zijn de stappen';
  const processLeadBody = 'Verspreid over 26 lessen';
  const iconById = {
    goal: 'flag-outline',
    risk: 'pulse-outline',
    strategy: 'git-branch-outline',
    allocation: 'pie-chart-outline',
    vehicle: 'layers-outline',
    execution: 'flash-outline',
  };

  return (
    <View style={styles.bottomPinnedStepBody}>
      <View style={styles.introConceptLead}>
        <AppText style={styles.introConceptLeadLabel}>{processLeadTitle}</AppText>
        <AppText style={styles.introConceptLeadBody}>{processLeadBody}</AppText>
      </View>

      <View style={styles.goalConceptImpactList}>
        {steps.map((step) => (
          <ConceptInfoCard
            key={step.id}
            iconName={iconById[step.id] || 'ellipse-outline'}
            label={step.label}
            detail={step.detail}
          />
        ))}
      </View>

      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function GoalConceptStep({ content, onNext, copy }) {
  const { styles } = useLessonStepStyles();
  const concept = content?.steps?.concept;
  const drivers = concept?.drivers || [];
  const conceptLeadLabel = concept?.leadLabel || 'Je doel heeft invloed op';
  const conceptLeadBody = concept?.leadBody || 'Drie onderdelen van je plan';
  const iconById = {
    time: 'time-outline',
    risk: 'pulse-outline',
    personal: 'person-outline',
    short: 'hourglass-outline',
    medium: 'swap-horizontal-outline',
    long: 'trending-up-outline',
  };

  return (
    <View style={styles.bottomPinnedStepBody}>
      <View style={styles.introConceptLead}>
        <AppText style={styles.introConceptLeadLabel}>{conceptLeadLabel}</AppText>
        <AppText style={styles.introConceptLeadBody}>{conceptLeadBody}</AppText>
      </View>

      <View style={styles.goalConceptImpactList}>
        {drivers.map((driver) => (
          <ConceptInfoCard
            key={driver.id}
            iconName={iconById[driver.id] || 'ellipse-outline'}
            label={driver.label}
            detail={driver.detail}
          />
        ))}
      </View>

      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function DropdownConceptStep({ content, lessonId, onNext, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const concept = content?.steps?.concept;
  const topSpacing = lessonId === 'lesson_1' ? 32 : components.layout.spacing.xxl;

  return (
    <View style={[styles.bottomPinnedStepBody, { marginTop: topSpacing }]}>
      <ConceptDropdownMenu
        headerLabel={concept?.sectionLabel}
        headerHint={concept?.sectionHint}
        items={concept?.drivers}
        styles={styles}
        colors={colors}
        components={components}
        wrapStyle={lessonId === 'lesson_1' ? { marginTop: 0 } : null}
      />

      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function AnchorConceptStep({ content, lessonId, onNext, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const concept = content?.steps?.concept;
  const drivers = concept?.drivers || [];
  const [forkWidth, setForkWidth] = useState(0);

  const anchorAnim = useSharedValue(0);
  const contentAnim = useSharedValue(0);

  useEffect(() => {
    anchorAnim.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
    contentAnim.value = withDelay(260, withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }));
  }, []);

  const anchorStyle = useAnimatedStyle(() => ({
    opacity: anchorAnim.value,
    transform: [{ scale: interpolate(anchorAnim.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentAnim.value,
    transform: [{ translateY: interpolate(contentAnim.value, [0, 1], [12, 0], Extrapolation.CLAMP) }],
  }));

  const forkPositions =
    drivers.length === 3 ? [0.165, 0.5, 0.835] :
    drivers.length === 2 ? [0.25, 0.75] :
    [0.5];

  return (
    <View style={styles.bottomPinnedAnchorStepBody}>
      {/* Anchor card — the concept hero */}
      <Animated.View style={[styles.anchorCard, anchorStyle]}>
        <View style={styles.anchorCardIcon}>
          <Ionicons name="flag" size={16} color={colors.text.onAccent} />
        </View>
        <AppText style={styles.anchorCardPunchline}>{concept?.visualHint}</AppText>
      </Animated.View>

      {/* Fork connector + tiles */}
      <Animated.View style={[styles.anchorContent, contentStyle]}>
        <View
          style={styles.anchorForkContainer}
          onLayout={(e) => setForkWidth(e.nativeEvent.layout.width)}
        >
          {forkWidth > 0 && drivers.length <= 3 && (
            <Svg width={forkWidth} height={36}>
              {/* Vertical stem */}
              <Path
                d={`M ${forkWidth * 0.5} 0 L ${forkWidth * 0.5} 16`}
                stroke={colors.accent.primary}
                strokeWidth={1.5}
                strokeOpacity={0.3}
              />
              {/* Horizontal crossbar */}
              <Path
                d={`M ${forkWidth * forkPositions[0]} 16 L ${forkWidth * forkPositions[forkPositions.length - 1]} 16`}
                stroke={colors.accent.primary}
                strokeWidth={1.5}
                strokeOpacity={0.3}
              />
              {/* Drops to each tile */}
              {forkPositions.map((pos, i) => (
                <Path
                  key={i}
                  d={`M ${forkWidth * pos} 16 L ${forkWidth * pos} 36`}
                  stroke={colors.accent.primary}
                  strokeWidth={1.5}
                  strokeOpacity={0.3}
                />
              ))}
            </Svg>
          )}
          {forkWidth > 0 && drivers.length === 4 && (
            <Svg width={forkWidth} height={24}>
              <Path
                d={`M ${forkWidth * 0.5} 0 L ${forkWidth * 0.5} 24`}
                stroke={colors.accent.primary}
                strokeWidth={1.5}
                strokeOpacity={0.3}
              />
            </Svg>
          )}
        </View>

        {/* Attribute tiles */}
        <View style={[styles.anchorTiles, drivers.length === 4 && styles.anchorTilesGrid]}>
          {drivers.map((driver) => (
            <View
              key={driver.id}
              style={[styles.anchorTile, drivers.length === 4 && styles.anchorTileWide]}
            >
              <AppText style={styles.anchorTileLabel}>{driver.label}</AppText>
              <AppText style={styles.anchorTileDetail}>{driver.detail}</AppText>
            </View>
          ))}
        </View>
      </Animated.View>

      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function IntroVisualizationStep({ content, onNext, copy, lessonId }) {
  return (
    <Lesson1VisualizationStep
      content={content}
      onNext={onNext}
      copy={copy}
      lessonId={lessonId}
    />
  );
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

function Lesson1VisualizationStep({ content, onNext, copy, lessonId }) {
  const { styles, colors, components } = useLessonStepStyles();
  const isProcessSequence = lessonId === 'lesson_0';
  const isGoalSequence = lessonId === 'lesson_1';
  const isGoalTypeSequence = lessonId === 'lesson_2';
  const contentCards = content?.steps?.visualization?.cards || [];
  const hasContentCards = contentCards.length > 0;
  const pagerRef = useRef(null);
  const steps = isProcessSequence
    ? INTRO_VISUALIZATION_STEPS
    : hasContentCards
      ? contentCards
      : copy.introVisualization.steps;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);
  const [viewedStepIds, setViewedStepIds] = useState(() => new Set());

  useEffect(() => {
    setCurrentCardIndex(0);
    setMaxReachedIndex(0);
    setViewedStepIds(new Set());
  }, [lessonId, steps.length]);

  const pageWidth = Dimensions.get('window').width;
  const CARD_GAP = 8;
  const CARD_PEEK = 10;
  const snapInterval = pageWidth - (2 * components.layout.pagePaddingHorizontal) - CARD_PEEK + CARD_GAP;

  const handlePageChange = useCallback((event) => {
    const nextIndex = Math.max(0, Math.min(Math.round(event.nativeEvent.contentOffset.x / snapInterval), steps.length - 1));
    setCurrentCardIndex(nextIndex);
    setMaxReachedIndex((prev) => Math.max(prev, nextIndex));
  }, [steps.length, snapInterval]);

  const handleScrollFailed = useCallback((info) => {
    requestAnimationFrame(() => {
      pagerRef.current?.scrollToIndex({
        index: info.index,
        animated: false,
      });
    });
  }, []);

  const handleStepCompleted = useCallback((stepId) => {
    setViewedStepIds((prev) => {
      if (prev.has(stepId)) return prev;
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }, []);

  const stepCodePrefix =
    content?.steps?.visualization?.cardCodePrefix || (isGoalSequence ? 'VOORBEELD' : 'STEP');
  const progressLabel = `${stepCodePrefix} ${`${currentCardIndex + 1}`.padStart(2, '0')}`;
  const hasViewedAllCards = maxReachedIndex >= steps.length - 1;

  return (
    <View style={[styles.stepBody, styles.l1VisBody]}>
      <View style={styles.l1VisContent}>
        <View
          style={[
            styles.l1VisPagerWrap,
            {
              width: pageWidth,
              marginHorizontal: -components.layout.pagePaddingHorizontal,
            },
          ]}
        >
          <FlatList
            ref={pagerRef}
            data={steps}
            keyExtractor={(item) => item.id}
            style={styles.l1VisPagerList}
            contentContainerStyle={[
              styles.l1VisPagerTrack,
              {
                paddingLeft: components.layout.pagePaddingHorizontal,
                paddingRight: components.layout.pagePaddingHorizontal + CARD_PEEK,
              },
            ]}
            horizontal
            snapToInterval={snapInterval}
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onMomentumScrollEnd={handlePageChange}
            onScrollEndDrag={handlePageChange}
            onScrollToIndexFailed={handleScrollFailed}
            renderItem={({ item: step, index }) => (
              <View style={[styles.l1VisPage, { width: snapInterval, paddingRight: CARD_GAP }]}>
                <ProcessGridFlipCard
                  step={step}
                  index={index}
                  stepCodePrefix={stepCodePrefix}
                  styles={styles}
                  colors={colors}
                  isActive={index === currentCardIndex}
                  isCompleted={viewedStepIds.has(step.id)}
                  isLocked={false}
                  onStepCompleted={() => handleStepCompleted(step.id)}
                  renderAnimation={() => (
                    isProcessSequence ? (
                      <ProcessGridStepAnimation stepId={step.id} styles={styles} colors={colors} />
                    ) : isGoalSequence ? (
                      <GoalExampleStepAnimation stepId={step.id} styles={styles} colors={colors} />
                    ) : isGoalTypeSequence ? (
                      <GoalTypeStepAnimation stepId={step.id} styles={styles} colors={colors} />
                    ) : (
                      null
                    )
                  )}
                />
              </View>
            )}
          />
        </View>
        <View style={styles.l1VisDotsWrap}>
          <OnboardingProgress
            current={currentCardIndex + 1}
            total={steps.length}
            style={styles.l1VisDots}
          />
          <Animated.View
            key={hasViewedAllCards ? 'ready' : 'view-all'}
            entering={FadeInDown.duration(180)}
            exiting={FadeOutUp.duration(120)}
          >
            <AppText
              style={[
                styles.l1VisHelperText,
                hasViewedAllCards && styles.l1VisHelperTextReady,
              ]}
            >
              {hasViewedAllCards
                ? copy.messages.readyToContinue
                : copy.messages.viewAllCardsToContinue}
            </AppText>
          </Animated.View>
        </View>
      </View>
      <View style={styles.l1VisActionWrap}>
        <PrimaryButton label={copy.buttons.next} onPress={onNext} disabled={maxReachedIndex < steps.length - 1} />
      </View>
    </View>
  );
}

function ProcessGridStepAnimation({ stepId, styles, colors }) {
  switch (stepId) {
    case 'goal':
      return <GoalGridAnim styles={styles} colors={colors} />;
    case 'risk':
      return <RiskGridAnim styles={styles} colors={colors} />;
    case 'strategy':
      return <StrategyGridAnim styles={styles} colors={colors} />;
    case 'allocation':
      return <AllocationGridAnim styles={styles} colors={colors} />;
    case 'vehicle':
      return <VehicleGridAnim styles={styles} />;
    case 'execution':
      return <ExecutionGridAnim styles={styles} colors={colors} />;
    default:
      return null;
  }
}

function GoalExampleStepAnimation({ stepId, styles, colors }) {
  switch (stepId) {
    case 'house':
      return <HouseGoalAnim styles={styles} colors={colors} />;
    case 'car':
      return <CarGoalAnim styles={styles} colors={colors} />;
    case 'travel':
      return <TravelGoalAnim styles={styles} colors={colors} />;
    case 'retirement':
      return <RetirementGoalAnim styles={styles} colors={colors} />;
    default:
      return null;
  }
}

function GoalTypeStepAnimation({ stepId, styles, colors }) {
  switch (stepId) {
    case 'short':
      return <ShortTermAnim styles={styles} colors={colors} />;
    case 'medium':
      return <MediumTermAnim styles={styles} colors={colors} />;
    case 'long':
      return <LongTermAnim styles={styles} colors={colors} />;
    default:
      return null;
  }
}

// ─── Huis: European front-facing house, warm lights come on in windows ──────────
function HouseGoalAnim({ styles, colors }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 7200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        withDelay(300, withTiming(0, { duration: 0 }))
      ),
      -1, false
    );
  }, [progress]);

  const bodyProps   = useAnimatedProps(() => ({ opacity: interpolate(progress.value, [0, 0.10], [0, 1], Extrapolation.CLAMP) }));
  const detailProps = useAnimatedProps(() => ({ opacity: interpolate(progress.value, [0.07, 0.20], [0, 1], Extrapolation.CLAMP) }));
  const glowProps   = useAnimatedProps(() => ({
    opacity: interpolate(
      progress.value,
      [0.18, 0.34, 0.52, 0.68, 0.84, 1],
      [0,    0.52, 0.28, 0.48, 0.28, 0],
      Extrapolation.CLAMP
    ),
  }));

  const facade    = toRgba(colors.background.surfaceActive, 0.88);
  const facadeS   = toRgba(colors.text.primary, 0.28);
  const roofCol   = toRgba(colors.text.primary, 0.80);
  const frameCol  = toRgba(colors.text.primary, 0.54);
  const glassDark = toRgba(colors.background.surface, 0.80);
  const glowCol   = toRgba(colors.accent.primary, 1);
  const shutterC  = toRgba(colors.text.primary, 0.45);
  const doorCol   = toRgba(colors.text.primary, 0.68);
  const stepCol   = toRgba(colors.text.primary, 0.20);
  const panelLine = toRgba(colors.text.primary, 0.26);

  return (
    <View style={styles.l1AnimCanvas}>
      <Svg width={160} height={96}>

        {/* ── Structure: facade + roof + chimney + steps ── */}
        <AnimatedG animatedProps={bodyProps}>
          {/* Main facade wall */}
          <Path d="M 24 30 L 136 30 L 136 86 L 24 86 Z"
            stroke={facadeS} strokeWidth={0.8} fill={facade} />
          {/* Roof */}
          <Path d="M 22 31 L 138 31 L 80 5 Z" fill={roofCol} />
          {/* Chimney shaft */}
          <Path d="M 95 9 L 95 31 L 106 31 L 106 9 Z" fill={roofCol} />
          {/* Chimney cap */}
          <Path d="M 92 9 L 109 9"
            stroke={roofCol} strokeWidth={3.5} strokeLinecap="round" fill="none" />
          {/* Steps */}
          <Path d="M 60 86 L 100 86 L 105 91 L 55 91 Z" fill={stepCol} />
          <Path d="M 55 91 L 105 91 L 111 96 L 49 96 Z" fill={stepCol} />
        </AnimatedG>

        {/* ── Details: shutters + window frames + door ── */}
        <AnimatedG animatedProps={detailProps}>

          {/* LEFT WINDOW GROUP */}
          {/* Shutter left */}
          <Path d="M 26 38 L 26 60 L 33 60 L 33 38 Z" fill={shutterC} />
          <Path d="M 27 42 L 32 42 M 27 46 L 32 46 M 27 50 L 32 50 M 27 54 L 32 54 M 27 58 L 32 58"
            stroke={facade} strokeWidth={0.8} fill="none" />
          {/* Shutter right */}
          <Path d="M 57 38 L 57 60 L 64 60 L 64 38 Z" fill={shutterC} />
          <Path d="M 58 42 L 63 42 M 58 46 L 63 46 M 58 50 L 63 50 M 58 54 L 63 54 M 58 58 L 63 58"
            stroke={facade} strokeWidth={0.8} fill="none" />
          {/* Window frame + dark glass */}
          <Path d="M 34 40 L 34 58 L 56 58 L 56 40 Z"
            stroke={frameCol} strokeWidth={1.5} fill={glassDark} />
          {/* Pane divisions */}
          <Path d="M 45 40 L 45 58 M 34 49 L 56 49"
            stroke={frameCol} strokeWidth={1} fill="none" />

          {/* RIGHT WINDOW GROUP */}
          <Path d="M 96 38 L 96 60 L 103 60 L 103 38 Z" fill={shutterC} />
          <Path d="M 97 42 L 102 42 M 97 46 L 102 46 M 97 50 L 102 50 M 97 54 L 102 54 M 97 58 L 102 58"
            stroke={facade} strokeWidth={0.8} fill="none" />
          <Path d="M 127 38 L 127 60 L 134 60 L 134 38 Z" fill={shutterC} />
          <Path d="M 128 42 L 133 42 M 128 46 L 133 46 M 128 50 L 133 50 M 128 54 L 133 54 M 128 58 L 133 58"
            stroke={facade} strokeWidth={0.8} fill="none" />
          <Path d="M 104 40 L 104 58 L 126 58 L 126 40 Z"
            stroke={frameCol} strokeWidth={1.5} fill={glassDark} />
          <Path d="M 115 40 L 115 58 M 104 49 L 126 49"
            stroke={frameCol} strokeWidth={1} fill="none" />

          {/* DOOR: arched top */}
          <Path d="M 68 86 L 68 70 A 12 12 0 0 1 92 70 L 92 86 Z"
            fill={doorCol} />
          {/* Door panels */}
          <Path d="M 70 84 L 70 72 L 79 72 L 79 84 Z"
            fill="none" stroke={panelLine} strokeWidth={0.8} />
          <Path d="M 81 84 L 81 72 L 90 72 L 90 84 Z"
            fill="none" stroke={panelLine} strokeWidth={0.8} />
          {/* Door handle */}
          <Circle cx={89} cy={77} r={1.5} fill={toRgba(colors.accent.primary, 0.70)} />
        </AnimatedG>

        {/* ── Warm window glow (breathes) ── */}
        <AnimatedG animatedProps={glowProps}>
          <Path d="M 35 41 L 35 57 L 55 57 L 55 41 Z" fill={glowCol} />
          <Path d="M 105 41 L 105 57 L 125 57 L 125 41 Z" fill={glowCol} />
        </AnimatedG>

      </Svg>
    </View>
  );
}

// ─── Auto: Lottie car animation ───────────────────────────────────────────────
function CarGoalAnim({ styles, colors }) {
  const outlineColor = colors.ui.divider;
  return (
    <View style={styles.l1AnimCanvas}>
      <LottieView
        source={require('../assets/animations/carr.json')}
        autoPlay
        loop
        style={styles.goalCarLottie}
        resizeMode="contain"
        colorFilters={[
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 1', color: outlineColor },
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 2', color: outlineColor },
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 3', color: outlineColor },
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 4', color: outlineColor },
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 5', color: outlineColor },
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 8', color: outlineColor },
          { keypath: 'Layer 2/CarTypes_t Outlines - Group 9', color: outlineColor },
          { keypath: 'Shape Layer 1', color: outlineColor },
          { keypath: 'Shape Layer 2', color: outlineColor },
          { keypath: 'Shape Layer 3', color: outlineColor },
          { keypath: 'Shape Layer 4', color: outlineColor },
          { keypath: 'Shape Layer 5', color: outlineColor },
          { keypath: 'Shape Layer 6', color: outlineColor },
          { keypath: 'Shape Layer 7', color: outlineColor },
          { keypath: 'Shape Layer 8', color: outlineColor },
          { keypath: 'WhR', color: outlineColor },
          { keypath: 'WhL', color: outlineColor },
          { keypath: 'Base', color: outlineColor },
        ]}
      />
    </View>
  );
}

// ─── Reis: spinning globe with animated longitude lines + flight path reveal ────
function TravelGoalAnim({ styles, colors }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 5200, easing: Easing.linear }),
      -1, false
    );
  }, [progress]);

  const ell1Props = useAnimatedProps(() => ({
    rx: Math.abs(32 * Math.cos(progress.value * Math.PI * 2.5)),
  }));
  const ell2Props = useAnimatedProps(() => ({
    rx: Math.abs(32 * Math.cos(progress.value * Math.PI * 2.5 + (2 * Math.PI / 3))),
  }));
  const ell3Props = useAnimatedProps(() => ({
    rx: Math.abs(32 * Math.cos(progress.value * Math.PI * 2.5 + (4 * Math.PI / 3))),
  }));

  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.04, 0.54], [112, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.04, 0.10, 0.72, 0.84], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const dotProps = useAnimatedProps(() => {
    const t = interpolate(progress.value, [0.04, 0.54], [0, 1], Extrapolation.CLAMP);
    return {
      cx: (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 82 + t * t * 120,
      cy: (1 - t) * (1 - t) * 28 + 2 * (1 - t) * t * 10 + t * t * 60,
      opacity: interpolate(progress.value, [0.04, 0.10, 0.72, 0.84], [0, 1, 1, 0], Extrapolation.CLAMP),
    };
  });

  const globeStroke = toRgba(colors.text.primary, 0.50);
  const lonStroke   = toRgba(colors.text.primary, 0.20);
  const latStroke   = toRgba(colors.text.primary, 0.14);
  const pathStroke  = toRgba(colors.accent.primary, 0.88);
  const dotFill     = toRgba(colors.accent.primary, 1);

  return (
    <View style={styles.l1AnimCanvas}>
      <Svg width={160} height={88}>
        {/* Globe circle */}
        <Circle cx={80} cy={44} r={32} stroke={globeStroke} strokeWidth={1} fill="none" />

        {/* Latitude lines (static) */}
        <Ellipse cx={80} cy={44} rx={32} ry={7}
          stroke={latStroke} strokeWidth={0.8} fill="none" />
        <Ellipse cx={80} cy={34} rx={28} ry={5}
          stroke={latStroke} strokeWidth={0.6} fill="none" />

        {/* Animated longitude lines */}
        <AnimatedEllipse cx={80} cy={44} ry={32}
          stroke={lonStroke} strokeWidth={0.8} fill="none"
          animatedProps={ell1Props} />
        <AnimatedEllipse cx={80} cy={44} ry={32}
          stroke={lonStroke} strokeWidth={0.8} fill="none"
          animatedProps={ell2Props} />
        <AnimatedEllipse cx={80} cy={44} ry={32}
          stroke={lonStroke} strokeWidth={0.8} fill="none"
          animatedProps={ell3Props} />

        {/* Flight path */}
        <AnimatedPath
          d="M 50 28 Q 82 10 120 60"
          stroke={pathStroke}
          strokeWidth={1.5}
          fill="none"
          strokeDasharray={112}
          animatedProps={pathProps}
        />

        {/* Moving dot along path */}
        <AnimatedCircle r={4} fill={dotFill} animatedProps={dotProps} />

        {/* Origin marker */}
        <Circle cx={50} cy={28} r={3} fill={toRgba(colors.text.primary, 0.35)} />
        {/* Destination marker */}
        <Circle cx={120} cy={60} r={4} fill={toRgba(colors.accent.primary, 0.55)} />
      </Svg>
    </View>
  );
}

// ─── Pensioen: compound growth curve drawn progressively, endpoint glows ────────
const GROWTH_PATH_D = 'M 14 72 C 30 70, 50 58, 70 44 S 110 20, 146 10';
const GROWTH_FILL_D = 'M 14 72 C 30 70, 50 58, 70 44 S 110 20, 146 10 L 146 72 Z';
const GROWTH_LEN    = 165;

function RetirementGoalAnim({ styles, colors }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        withDelay(900, withTiming(0, { duration: 0 }))
      ),
      -1, false
    );
  }, [progress]);

  const curveProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 0.82], [GROWTH_LEN, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0, 0.04, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const fillProps = useAnimatedProps(() => ({
    opacity: interpolate(progress.value, [0.12, 0.36, 0.88, 1], [0, 0.18, 0.18, 0], Extrapolation.CLAMP),
  }));

  const dotProps = useAnimatedProps(() => {
    const t = interpolate(progress.value, [0, 0.82], [0, 1], Extrapolation.CLAMP);
    return {
      cx: (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 80 + t * t * 146,
      cy: (1 - t) * (1 - t) * 72 + 2 * (1 - t) * t * 20 + t * t * 10,
      opacity: interpolate(progress.value, [0.04, 0.10, 0.86, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    };
  });

  const glowProps = useAnimatedProps(() => {
    const t = interpolate(progress.value, [0, 0.82], [0, 1], Extrapolation.CLAMP);
    return {
      cx: (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 80 + t * t * 146,
      cy: (1 - t) * (1 - t) * 72 + 2 * (1 - t) * t * 20 + t * t * 10,
      r: interpolate(progress.value, [0.76, 0.86, 0.92, 1], [0, 14, 14, 0], Extrapolation.CLAMP),
      opacity: interpolate(progress.value, [0.76, 0.84, 0.92, 1], [0, 0.28, 0.28, 0], Extrapolation.CLAMP),
    };
  });

  const grid    = toRgba(colors.ui.divider, 0.20);
  const axis    = toRgba(colors.ui.divider, 0.28);
  const curve   = toRgba(colors.accent.primary, 0.92);
  const fill    = toRgba(colors.accent.primary, 1);
  const dot     = toRgba(colors.accent.primary, 1);

  return (
    <View style={styles.l1AnimCanvas}>
      <Svg width={160} height={84}>
        {/* Grid */}
        <Path d="M 14 18 L 146 18" stroke={grid} strokeWidth={0.7} />
        <Path d="M 14 36 L 146 36" stroke={grid} strokeWidth={0.7} />
        <Path d="M 14 54 L 146 54" stroke={grid} strokeWidth={0.7} />
        <Path d="M 14 72 L 146 72" stroke={axis} strokeWidth={0.8} />
        <Path d="M 14 12 L 14 72"  stroke={axis} strokeWidth={0.8} />

        {/* Fill area under curve */}
        <AnimatedPath d={GROWTH_FILL_D} fill={fill} animatedProps={fillProps} />

        {/* Growth curve */}
        <AnimatedPath
          d={GROWTH_PATH_D}
          stroke={curve}
          strokeWidth={2}
          fill="none"
          strokeDasharray={GROWTH_LEN}
          animatedProps={curveProps}
        />

        {/* Endpoint glow */}
        <AnimatedCircle fill={dot} animatedProps={glowProps} />

        {/* Endpoint dot */}
        <AnimatedCircle r={4.5} fill={dot} animatedProps={dotProps} />
      </Svg>
    </View>
  );
}

// ─── Korte termijn: calendar with a specific nearby date circled ─────────────
// Calendar body x=44–116, y=22–78. Header y=22–34. Grid: 3 rows × 5 cols.
// Target date at row 1, col 1 (cx=66, cy=54) — early in the calendar = soon.
const CAL_RING_LEN = 44; // circumference of r=7 ≈ 2π*7 ≈ 44

function ShortTermAnim({ styles, colors }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        withDelay(900, withTiming(0, { duration: 0 }))
      ),
      -1, false
    );
  }, [progress]);

  const calProps = useAnimatedProps(() => ({
    opacity: interpolate(progress.value, [0, 0.12, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.38, 0.68], [CAL_RING_LEN, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.38, 0.44, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const glowProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0.68, 0.80, 0.88, 1], [0, 13, 13, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.68, 0.74, 0.86, 1], [0, 0.26, 0.26, 0], Extrapolation.CLAMP),
  }));

  const calStroke  = toRgba(colors.ui.divider, 0.32);
  const headerFill = toRgba(colors.ui.divider, 0.14);
  const dayCol     = toRgba(colors.text.primary, 0.22);
  const targetCol  = toRgba(colors.accent.primary, 1);
  const bindCol    = toRgba(colors.text.primary, 0.38);
  const bgCol      = toRgba(colors.background.surface, 1);

  return (
    <View style={styles.l1AnimCanvas}>
      <Svg width={160} height={88}>
        <AnimatedG animatedProps={calProps}>
          {/* Calendar body */}
          <Path d="M 44 22 L 44 78 L 116 78 L 116 22 Z"
            stroke={calStroke} strokeWidth={1.5} fill="none" />
          {/* Header fill */}
          <Path d="M 44.75 22 L 44.75 34 L 115.25 34 L 115.25 22 Z"
            fill={headerFill} />
          {/* Header divider */}
          <Path d="M 44 34 L 116 34" stroke={calStroke} strokeWidth={0.8} />
          {/* Binding clips */}
          <Circle cx={66} cy={22} r={4} fill={bgCol} stroke={bindCol} strokeWidth={1.2} />
          <Circle cx={94} cy={22} r={4} fill={bgCol} stroke={bindCol} strokeWidth={1.2} />

          {/* Day grid — 3 rows × 5 cols */}
          {/* Row 0 (y=44) */}
          <Circle cx={56} cy={44} r={2.5} fill={dayCol} />
          <Circle cx={68} cy={44} r={2.5} fill={dayCol} />
          <Circle cx={80} cy={44} r={2.5} fill={dayCol} />
          <Circle cx={92} cy={44} r={2.5} fill={dayCol} />
          <Circle cx={104} cy={44} r={2.5} fill={dayCol} />
          {/* Row 1 (y=56) — target is col 1 (cx=68) */}
          <Circle cx={56} cy={56} r={2.5} fill={dayCol} />
          <Circle cx={68} cy={56} r={2.5} fill={targetCol} />
          <Circle cx={80} cy={56} r={2.5} fill={dayCol} />
          <Circle cx={92} cy={56} r={2.5} fill={dayCol} />
          <Circle cx={104} cy={56} r={2.5} fill={dayCol} />
          {/* Row 2 (y=68) */}
          <Circle cx={56} cy={68} r={2.5} fill={dayCol} />
          <Circle cx={68} cy={68} r={2.5} fill={dayCol} />
          <Circle cx={80} cy={68} r={2.5} fill={dayCol} />
          <Circle cx={92} cy={68} r={2.5} fill={dayCol} />
          <Circle cx={104} cy={68} r={2.5} fill={dayCol} />
        </AnimatedG>

        {/* Circle drawing around the target date */}
        <AnimatedCircle
          cx={68} cy={56} r={7}
          stroke={targetCol} strokeWidth={2} fill="none"
          strokeDasharray={CAL_RING_LEN}
          animatedProps={ringProps}
        />

        {/* Glow pulse when circle completes */}
        <AnimatedCircle cx={68} cy={56} fill={targetCol} animatedProps={glowProps} />
      </Svg>
    </View>
  );
}

// ─── Middellange termijn: zigzag growth line — upward trend with dips ────────
function MediumTermAnim({ styles, colors }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3600, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        withDelay(700, withTiming(0, { duration: 0 }))
      ),
      -1, false
    );
  }, [progress]);

  const LINE_LEN = 144;

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 0.86], [LINE_LEN, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0, 0.03, 0.90, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const dotProps = useAnimatedProps(() => ({
    opacity: interpolate(progress.value, [0.82, 0.88, 0.94, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const axis = toRgba(colors.ui.divider, 0.28);
  const grid = toRgba(colors.ui.divider, 0.14);
  const line = toRgba(colors.accent.primary, 0.88);
  const endDot = toRgba(colors.accent.primary, 1);

  return (
    <View style={styles.l1AnimCanvas}>
      <Svg width={160} height={88}>
        {/* Grid */}
        <Path d="M 14 28 L 146 28" stroke={grid} strokeWidth={0.6} />
        <Path d="M 14 48 L 146 48" stroke={grid} strokeWidth={0.6} />
        {/* Axes */}
        <Path d="M 14 68 L 146 68" stroke={axis} strokeWidth={0.8} />
        <Path d="M 14 12 L 14 68" stroke={axis} strokeWidth={0.8} />

        {/* Zigzag growth line — goes up, slight dip, up, slight dip, strong finish */}
        <AnimatedPath
          d="M 14 64 L 38 52 L 62 58 L 86 40 L 110 48 L 140 26"
          stroke={line} strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" fill="none"
          strokeDasharray={LINE_LEN}
          animatedProps={lineProps}
        />

        {/* End dot */}
        <AnimatedCircle cx={140} cy={26} r={4} fill={endDot} animatedProps={dotProps} />
      </Svg>
    </View>
  );
}

// ─── Lange termijn: compound growth bars grow in sequence, final bar glows ────
function LongTermAnim({ styles, colors }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        withDelay(700, withTiming(0, { duration: 0 }))
      ),
      -1, false
    );
  }, [progress]);

  const bar1Props = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.00, 0.18], [8, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.00, 0.04, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const bar2Props = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.10, 0.30], [16, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.10, 0.14, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const bar3Props = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.20, 0.44], [28, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.20, 0.24, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const bar4Props = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.32, 0.60], [46, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.32, 0.36, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const bar5Props = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.44, 0.80], [68, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.44, 0.48, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const glowProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0.80, 0.88, 0.94, 1], [0, 12, 12, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.80, 0.86, 0.92, 1], [0, 0.28, 0.28, 0], Extrapolation.CLAMP),
  }));

  const axis    = toRgba(colors.ui.divider, 0.28);
  const barMute = toRgba(colors.text.primary, 0.22);
  const barAcce = toRgba(colors.accent.primary, 0.92);
  const glow    = toRgba(colors.accent.primary, 1);

  return (
    <View style={styles.l1AnimCanvas}>
      <Svg width={160} height={88}>
        {/* X-axis */}
        <Path d="M 14 72 L 150 72" stroke={axis} strokeWidth={0.8} />

        {/* Bar 1 — height 8 */}
        <AnimatedPath d="M 29 72 L 29 64" stroke={barMute} strokeWidth={16}
          strokeLinecap="butt" fill="none"
          strokeDasharray={8} animatedProps={bar1Props} />

        {/* Bar 2 — height 16 */}
        <AnimatedPath d="M 53 72 L 53 56" stroke={barMute} strokeWidth={16}
          strokeLinecap="butt" fill="none"
          strokeDasharray={16} animatedProps={bar2Props} />

        {/* Bar 3 — height 28 */}
        <AnimatedPath d="M 77 72 L 77 44" stroke={barMute} strokeWidth={16}
          strokeLinecap="butt" fill="none"
          strokeDasharray={28} animatedProps={bar3Props} />

        {/* Bar 4 — height 46 */}
        <AnimatedPath d="M 101 72 L 101 26" stroke={barMute} strokeWidth={16}
          strokeLinecap="butt" fill="none"
          strokeDasharray={46} animatedProps={bar4Props} />

        {/* Bar 5 — height 68, accent */}
        <AnimatedPath d="M 125 72 L 125 4" stroke={barAcce} strokeWidth={16}
          strokeLinecap="butt" fill="none"
          strokeDasharray={68} animatedProps={bar5Props} />

        {/* Glow at top of bar 5 */}
        <AnimatedCircle cx={125} cy={4} fill={glow} animatedProps={glowProps} />
      </Svg>
    </View>
  );
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

// ─ 2. RISK: chart builds up like daytrading, then crashes dramatically ──────────

const CRASH_CHART_POINTS = [
  { x: -42, y: 20 },
  { x: -35, y: 15 },
  { x: -28, y: 18 },
  { x: -20, y: 10 },
  { x: -13, y: 13 },
  { x: -6,  y:  4 },
  { x:   1, y:  7 },
  { x:   8, y: -4 },
  { x:  15, y: -1 },
  { x:  22, y: -16 },
  { x:  28, y:  10 },
  { x:  35, y:  22 },
  { x:  42, y:  28 },
];
const CRASH_START_SEG = 9;

const CRASH_CHART_SEGS = CRASH_CHART_POINTS.slice(0, -1).map((point, i) => {
  const next = CRASH_CHART_POINTS[i + 1];
  const dx = next.x - point.x;
  const dy = next.y - point.y;
  const isCrash = i >= CRASH_START_SEG;
  const revealStart = isCrash
    ? 0.64 + (i - CRASH_START_SEG) * 0.05
    : 0.04 + i * 0.065;
  return {
    key: `cc-${i}`,
    width: Math.hypot(dx, dy),
    cx: point.x + dx / 2,
    cy: point.y + dy / 2,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    isCrash,
    revealStart,
    revealEnd: revealStart + (isCrash ? 0.022 : 0.020),
    endX: next.x,
    endY: next.y,
  };
});
const CRASH_DOT_PHASE_INPUTS = CRASH_CHART_SEGS.map((s) => s.revealEnd);
const CRASH_DOT_X_OUTPUTS = CRASH_CHART_SEGS.map((s) => s.endX);
const CRASH_DOT_Y_OUTPUTS = CRASH_CHART_SEGS.map((s) => s.endY);
const CRASH_START_PHASE = CRASH_CHART_SEGS[CRASH_START_SEG].revealStart;

function CrashChartSeg({ phase, seg, styles }) {
  const revealStart = seg.revealStart;
  const revealEnd = seg.revealEnd;
  const segStyle = useAnimatedStyle(() => {
    const appear = interpolate(phase.value, [revealStart, revealEnd], [0, 1], Extrapolation.CLAMP);
    const fade = interpolate(phase.value, [0.87, 0.97], [1, 0], Extrapolation.CLAMP);
    return { opacity: appear * fade };
  });
  return (
    <Animated.View
      style={[
        seg.isCrash ? styles.l1RiskCrashSegment : styles.l1RiskBuildSegment,
        {
          width: seg.width,
          transform: [
            { translateX: seg.cx },
            { translateY: seg.cy },
            { rotate: `${seg.angle}deg` },
          ],
        },
        segStyle,
      ]}
    />
  );
}

function CrashChartDot({ phase, styles, colors }) {
  const accentColor = toRgba(colors.accent.primary, 0.92);
  const dotStyle = useAnimatedStyle(() => {
    const p = phase.value;
    const tx = interpolate(p, CRASH_DOT_PHASE_INPUTS, CRASH_DOT_X_OUTPUTS, Extrapolation.CLAMP);
    const ty = interpolate(p, CRASH_DOT_PHASE_INPUTS, CRASH_DOT_Y_OUTPUTS, Extrapolation.CLAMP);
    const appear = interpolate(p, [0.04, 0.07], [0, 1], Extrapolation.CLAMP);
    const fade = interpolate(p, [0.87, 0.97], [1, 0], Extrapolation.CLAMP);
    const isCrashing = p >= CRASH_START_PHASE;
    return {
      transform: [{ translateX: tx }, { translateY: ty }],
      opacity: appear * fade,
      backgroundColor: isCrashing ? '#FF3B30' : accentColor,
    };
  });
  return <Animated.View style={[styles.l1RiskChartDot, dotStyle]} />;
}

function RiskGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(1, { duration: 4800, easing: Easing.linear }),
      -1,
      false
    );
  }, [phase]);

  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1RiskSingleChart}>
        <View style={[styles.l1RiskGridH, { transform: [{ translateY: -16 }] }]} />
        <View style={styles.l1RiskGridH} />
        <View style={[styles.l1RiskGridH, { transform: [{ translateY: 16 }] }]} />
        {CRASH_CHART_SEGS.map((seg) => (
          <CrashChartSeg key={seg.key} phase={phase} seg={seg} styles={styles} />
        ))}
        <CrashChartDot phase={phase} styles={styles} colors={colors} />
      </View>
    </View>
  );
}

// ─ 3. STRATEGY: two lines from same start — flat/noisy vs steady growth ─────────

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const STRAT_SVG_W = 90;
const STRAT_SVG_H = 70;
const STRAT_SVG_CX = 45;
const STRAT_SVG_CY = 35;

const STRAT_GROWTH_POINTS = [
  { x: -42, y: 18 },
  { x: -33, y: 13 },
  { x: -24, y:  9 },
  { x: -15, y:  4 },
  { x:  -6, y:  0 },
  { x:   3, y: -4 },
  { x:  12, y: -9 },
  { x:  21, y: -13 },
  { x:  30, y: -17 },
  { x:  42, y: -21 },
];
const STRAT_FLAT_POINTS = [
  { x: -42, y: 18 },
  { x: -33, y: 13 },
  { x: -24, y: 20 },
  { x: -15, y: 12 },
  { x:  -6, y: 18 },
  { x:   3, y: 10 },
  { x:  12, y: 16 },
  { x:  21, y:  9 },
  { x:  30, y: 14 },
  { x:  42, y:  9 },
];

const toStratSvgPath = (pts) =>
  pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${STRAT_SVG_CX + pt.x} ${STRAT_SVG_CY + pt.y}`).join(' ');

const calcPathLen = (pts) =>
  pts.slice(0, -1).reduce((sum, pt, i) => {
    const next = pts[i + 1];
    return sum + Math.hypot(next.x - pt.x, next.y - pt.y);
  }, 0);

const STRAT_GROWTH_PATH_D = toStratSvgPath(STRAT_GROWTH_POINTS);
const STRAT_FLAT_PATH_D = toStratSvgPath(STRAT_FLAT_POINTS);
const STRAT_GROWTH_LEN = calcPathLen(STRAT_GROWTH_POINTS);
const STRAT_FLAT_LEN = calcPathLen(STRAT_FLAT_POINTS);

// Last point of the growth line in SVG coords — where the tip dot sits
const STRAT_TIP_X = STRAT_SVG_CX + STRAT_GROWTH_POINTS[STRAT_GROWTH_POINTS.length - 1].x;
const STRAT_TIP_Y = STRAT_SVG_CY + STRAT_GROWTH_POINTS[STRAT_GROWTH_POINTS.length - 1].y;

function StrategyGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 4600, easing: Easing.linear }), -1, false);
  }, [phase]);

  const accentColor = toRgba(colors.accent.primary, 0.92);
  const dimColor = toRgba(colors.text.primary, 0.38);
  const growthLen = STRAT_GROWTH_LEN;
  const flatLen = STRAT_FLAT_LEN;

  const growthProps = useAnimatedProps(() => {
    const t = interpolate(phase.value, [0.05, 0.72], [0, 1], Extrapolation.CLAMP);
    return { strokeDashoffset: growthLen * (1 - t) };
  });

  const flatProps = useAnimatedProps(() => {
    const t = interpolate(phase.value, [0.05, 0.72], [0, 1], Extrapolation.CLAMP);
    return { strokeDashoffset: flatLen * (1 - t) };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(phase.value, [0, 0.04, 0.84, 0.96], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const tipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(phase.value, [0.70, 0.76, 0.84, 0.96], [0, 1, 1, 0], Extrapolation.CLAMP),
    backgroundColor: accentColor,
  }));

  return (
    <View style={styles.l1AnimCanvas}>
      <Animated.View style={[styles.l1RiskSingleChart, containerStyle]}>
        <View style={[styles.l1RiskGridH, { transform: [{ translateY: -16 }] }]} />
        <View style={styles.l1RiskGridH} />
        <View style={[styles.l1RiskGridH, { transform: [{ translateY: 16 }] }]} />
        <Svg
          width={STRAT_SVG_W}
          height={STRAT_SVG_H}
          style={{ position: 'absolute' }}
        >
          <AnimatedPath
            d={STRAT_FLAT_PATH_D}
            stroke={dimColor}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={flatLen}
            animatedProps={flatProps}
          />
          <AnimatedPath
            d={STRAT_GROWTH_PATH_D}
            stroke={accentColor}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={growthLen}
            animatedProps={growthProps}
          />
        </Svg>
        <Animated.View
          style={[
            styles.l1StratTipDot,
            { transform: [{ translateX: STRAT_TIP_X - STRAT_SVG_CX }, { translateY: STRAT_TIP_Y - STRAT_SVG_CY }] },
            tipStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
}

// ─ 4. ALLOCATION: 3 filled pie slices sweep in one-by-one then pulse ─────────
function AllocationGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  const col1 = toRgba(colors.text.primary, 0.9);
  const col2 = toRgba(colors.accent.primary, 0.95);
  const col3 = toRgba(colors.text.primary, 0.5);
  const cx = L1_ALLOC_CX;
  const cy = L1_ALLOC_CY;
  const r = L1_ALLOC_R;

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(1, { duration: 4400, easing: Easing.linear }),
      -1,
      false
    );
  }, [phase]);

  // Each slice sweeps from its startAngle to startAngle+120°
  // Path built inside worklet: M cx cy L startX startY A r r 0 largeArc 1 endX endY Z
  const slice1Props = useAnimatedProps(() => {
    const prog = interpolate(phase.value, [0.04, 0.32], [0, 1], Extrapolation.CLAMP);
    if (prog <= 0.001) return { d: `M ${cx} ${cy}` };
    const sRad = (-90 * Math.PI) / 180;
    const eRad = ((-90 + prog * 120) * Math.PI) / 180;
    const sx = cx + r * Math.cos(sRad);
    const sy = cy + r * Math.sin(sRad);
    const ex = cx + r * Math.cos(eRad);
    const ey = cy + r * Math.sin(eRad);
    return { d: `M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z` };
  });

  const slice2Props = useAnimatedProps(() => {
    const prog = interpolate(phase.value, [0.32, 0.60], [0, 1], Extrapolation.CLAMP);
    if (prog <= 0.001) return { d: `M ${cx} ${cy}` };
    const sRad = (30 * Math.PI) / 180;
    const eRad = ((30 + prog * 120) * Math.PI) / 180;
    const sx = cx + r * Math.cos(sRad);
    const sy = cy + r * Math.sin(sRad);
    const ex = cx + r * Math.cos(eRad);
    const ey = cy + r * Math.sin(eRad);
    return { d: `M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z` };
  });

  const slice3Props = useAnimatedProps(() => {
    const prog = interpolate(phase.value, [0.60, 0.88], [0, 1], Extrapolation.CLAMP);
    if (prog <= 0.001) return { d: `M ${cx} ${cy}` };
    const sRad = (150 * Math.PI) / 180;
    const eRad = ((150 + prog * 120) * Math.PI) / 180;
    const sx = cx + r * Math.cos(sRad);
    const sy = cy + r * Math.sin(sRad);
    const ex = cx + r * Math.cos(eRad);
    const ey = cy + r * Math.sin(eRad);
    return { d: `M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z` };
  });

  // Whole pie pulses once complete, then fades out
  const wrapStyle = useAnimatedStyle(() => {
    const scale = interpolate(phase.value, [0.88, 0.93, 0.97, 1.0], [1, 1.07, 1, 1], Extrapolation.CLAMP);
    const opacity = interpolate(phase.value, [0, 0.04, 0.95, 1.0], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={styles.l1AnimCanvas}>
      <Animated.View style={wrapStyle}>
        <Svg width={L1_ALLOC_SVG_SIZE} height={L1_ALLOC_SVG_SIZE}>
          <AnimatedPath fill={col1} animatedProps={slice1Props} />
          <AnimatedPath fill={col2} animatedProps={slice2Props} />
          <AnimatedPath fill={col3} animatedProps={slice3Props} />
        </Svg>
      </Animated.View>
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

// ─ 6. EXECUTION: download broker → deposit coin → place order ────────────────
function ExecutionGridAnim({ styles, colors }) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.linear }), -1, false);
  }, [phase]);

  // Phone fades in with everything, fades out at end
  const phoneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(phase.value, [0, 0.05, 0.84, 0.96], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  // Phase 1 (0.06–0.36): download progress bar grows left→right
  // Bar width=18, half=9. translateX(-9*(1-t)) + scaleX(t) anchors the left edge.
  const progressStyle = useAnimatedStyle(() => {
    const t = interpolate(phase.value, [0.06, 0.36], [0, 1], Extrapolation.CLAMP);
    const fade = interpolate(phase.value, [0.36, 0.42], [1, 0], Extrapolation.CLAMP);
    return {
      opacity: fade,
      transform: [{ translateX: -9 * (1 - t) }, { scaleX: t }],
    };
  });

  // Phase 2 (0.44–0.62): € coin drops from above phone into it
  const coinStyle = useAnimatedStyle(() => {
    const ty = interpolate(phase.value, [0.44, 0.60], [0, 16], Extrapolation.CLAMP);
    const opacity = interpolate(phase.value, [0.44, 0.48, 0.58, 0.62], [0, 1, 1, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY: ty }], opacity };
  });

  // Phase 3 (0.64–0.84): screen flashes accent = order confirmed
  const flashStyle = useAnimatedStyle(() => ({
    opacity: interpolate(phase.value, [0.64, 0.70, 0.80, 0.84], [0, 0.92, 0.4, 0], Extrapolation.CLAMP),
  }));

  // Phase 3: pulse ring expands out from phone center
  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(phase.value, [0.64, 0.84], [0.3, 2.6], Extrapolation.CLAMP);
    const opacity = interpolate(phase.value, [0.64, 0.68, 0.78, 0.84], [0, 0.75, 0.25, 0], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={styles.l1AnimCanvas}>
      <View style={styles.l1ExecScene}>
        {/* € coin — sits above phone in flex flow, drops down into it */}
        <Animated.View style={[styles.l1ExecCoin, coinStyle]}>
          <AppText style={styles.l1ExecCoinLabel}>€</AppText>
        </Animated.View>

        {/* Phone body */}
        <Animated.View style={[styles.l1ExecPhone, phoneStyle]}>
          <View style={styles.l1ExecScreen}>
            <View style={styles.l1ExecProgressTrack}>
              <Animated.View style={[styles.l1ExecProgressBar, progressStyle]} />
            </View>
            <Animated.View style={[styles.l1ExecScreenFlash, flashStyle]} />
          </View>
        </Animated.View>

        {/* Confirm pulse ring centered on phone */}
        <Animated.View style={[styles.l1ExecPulseRing, pulseStyle]} />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function IntroScenarioStep({ onNext, copy, onAnswerReveal }) {
  const { styles, colors, components, mode } = useLessonStepStyles();
  const steps = copy.introScenario.steps;
  const reactiveMissingIds = ['goal', 'risk', 'strategy', 'allocation'];
  const scenarioName = 'Bert';
  const scenarioSubtitle = copy.labels.scenarioExampleSub;

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
        <Card style={styles.narrativeCard}>
          <View style={styles.narrativeCharacterRow}>
            <View style={styles.narrativeAvatar}>
              <Ionicons
                name="person-outline"
                size={components.sizes.icon.md}
                color={colors.text.secondary}
              />
            </View>
            <View style={styles.narrativeCharacterText}>
              <AppText style={styles.narrativeCharacterName}>{scenarioName}</AppText>
              <AppText style={styles.narrativeCharacterSubtitle}>
                {scenarioSubtitle}
              </AppText>
            </View>
          </View>
          <AppText style={styles.narrativeQuote}>
            "Ik heb €5.000 klaarstaan. Ik heb een goed gevoel over dit aandeel."
          </AppText>
        </Card>

        <AppText style={styles.narrativePrompt}>Wat zou Bert best doen?</AppText>
      </View>

      {/* Choice cards + connector + comparison — tightly grouped */}
      <View style={styles.narrativeFlowWrap}>
        <View style={styles.narrativeChoiceRow}>
          <Pressable
            onPress={() => {
              setSelected('reactive');
              onAnswerReveal?.();
            }}
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
            onPress={() => {
              setSelected('plan');
              onAnswerReveal?.();
            }}
            style={({ pressed }) => [
              styles.narrativeChoiceCard,
              styles.narrativeChoiceCardPlan,
              selected !== null && (
                mode === 'dark'
                  ? {
                      borderColor:
                        selected === 'plan'
                          ? colors.accent.primary
                          : toRgba(colors.accent.primary, colors.opacity.stroke),
                      backgroundColor:
                        selected === 'plan'
                          ? toRgba(colors.accent.primary, colors.opacity.tint)
                          : toRgba(colors.accent.primary, colors.opacity.tint),
                    }
                  : styles.narrativeChoiceCardActivePlan
              ),
              pressed && styles.narrativeChoiceCardPressed,
            ]}
          >
            <Ionicons
              name="layers-outline"
              size={components.sizes.icon.lg}
              color={
                selected !== null
                  ? mode === 'dark'
                    ? colors.accent.primary
                    : colors.text.secondary
                  : colors.text.primary
              }
            />
            <AppText
              style={[
                styles.narrativeChoiceLabel,
                styles.narrativeChoiceLabelPlan,
                mode === 'dark' && selected !== null && styles.narrativeChoiceLabelPlanActiveDark,
              ]}
            >
              Volg het proces
            </AppText>
            <AppText style={styles.narrativeChoiceHint}>6 stappen doorlopen</AppText>
          </Pressable>
        </View>

        {showComparison && (
          <>
            {/* Feedback — appears immediately after selection, in viewport */}
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={[
                styles.scenarioRevealCard,
                selected === 'plan' && styles.scenarioRevealCardCorrect,
              ]}
            >
              <View style={styles.scenarioRevealHeader}>
                {selected === 'plan' ? (
                  <View style={[styles.scenarioRevealIconBubble, mode === 'dark' && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary }]}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={mode === 'dark' ? colors.background.surface : colors.text.primary}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name="information-circle"
                    size={18}
                    color={colors.text.secondary}
                  />
                )}
                <AppText style={[styles.scenarioRevealLabel, selected === 'plan' && styles.scenarioRevealLabelKey]}>
                  {selected === 'plan'
                    ? copy.introScenario.feedbackCorrectTitle
                    : copy.introScenario.feedbackIncorrectTitle}
                </AppText>
              </View>
              <AppText style={styles.scenarioRevealText}>
                {selected === 'plan'
                  ? copy.introScenario.feedbackCorrectBody
                  : copy.introScenario.feedbackIncorrectBody}
              </AppText>
            </Animated.View>

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
              <ScenarioCompareCard
                title="ZONDER PLAN"
                animatedStyle={reactiveCardAnim}
                cardStyle={{
                  flex: 1,
                  backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
                  borderColor: selected === 'reactive'
                    ? toRgba(colors.text.primary, 0.55)
                    : toRgba(colors.ui.divider, colors.opacity.stroke),
                }}
                visual={(
                  <Animated.View style={reactiveChartAnim}>
                    <ScenarioCurve variant="volatile" progress={1} label="ONZEKER" />
                  </Animated.View>
                )}
                rows={reactiveSteps.map((step) => ({
                  id: step.id,
                  label: step.label,
                  nodeStyles: [
                    step.isMissing && styles.scenarioCompareNodeMissing,
                    step.isActive && styles.scenarioCompareNodeActiveReactive,
                  ],
                  lineStyles: [
                    step.isMissing && styles.scenarioCompareLineMissing,
                    step.isActive && styles.scenarioCompareLineActiveReactive,
                  ],
                  labelStyles: [
                    step.isMissing && styles.scenarioCompareStepLabelMissing,
                    step.isActive && styles.scenarioCompareStepLabelActive,
                  ],
                }))}
              />

              <ScenarioCompareCard
                title="MET PLAN"
                animatedStyle={planCardAnim}
                cardStyle={{
                  flex: 1,
                  backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
                  borderColor: selected === 'plan'
                    ? colors.accent.primary
                    : toRgba(colors.ui.divider, colors.opacity.stroke),
                }}
                visual={(
                  <Animated.View style={planChartAnim}>
                    <ScenarioCurve variant="stable" progress={1} label="STABIEL" />
                  </Animated.View>
                )}
                rows={planSteps.map((step) => ({
                  id: step.id,
                  label: step.label,
                  nodeStyles: [styles.scenarioCompareNodeActive],
                  lineStyles: [styles.scenarioCompareLineActive],
                  labelStyles: [styles.scenarioCompareStepLabelActive],
                }))}
              />
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

function ScenarioCompareCard({ title, animatedStyle, cardStyle, visual, rows }) {
  const { styles } = useLessonStepStyles();

  return (
    <Animated.View style={[styles.narrativeComparePanelWrap, animatedStyle]}>
      <Card style={[styles.scenarioComparePanel, cardStyle]}>
        <View style={styles.scenarioCompareHeader}>
          <AppText style={styles.scenarioCompareLabel}>{title}</AppText>
        </View>
        {visual}
        <View style={styles.scenarioCompareSteps}>
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            return (
              <View key={row.id} style={styles.scenarioCompareRow}>
                <View style={styles.scenarioCompareTrack}>
                  <View style={[styles.scenarioCompareNode, ...(row.nodeStyles || [])]} />
                  {!isLast ? (
                    <View style={[styles.scenarioCompareLine, ...(row.lineStyles || [])]} />
                  ) : null}
                </View>
                <AppText style={[styles.scenarioCompareStepLabel, ...(row.labelStyles || [])]}>
                  {row.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>
    </Animated.View>
  );
}

function Lesson1ContextualScenarioStep({ content, onNext, copy, onAnswerReveal }) {
  const { styles, colors, components, mode } = useLessonStepStyles();
  const scenario = content?.steps?.scenario || {};
  const choices = scenario?.choices || [];
  const leftChoice = choices[0];
  const rightChoice = choices[1];
  const leftItems = scenario?.comparison?.left?.items || [];
  const rightItems = scenario?.comparison?.right?.items || [];
  const [selected, setSelected] = useState(null);
  const showComparison = selected !== null;
  const isLeftSelected = selected === leftChoice?.id;
  const isRightSelected = selected === rightChoice?.id;
  const isCorrect = choices.find((choice) => choice.id === selected)?.isKey;
  const scenarioName = 'Bert';
  const scenarioSubtitle = copy.labels.scenarioExampleSub;

  const leftScale = useSharedValue(1);
  const rightScale = useSharedValue(1);
  const leftOpacity = useSharedValue(1);
  const rightOpacity = useSharedValue(1);
  const leftVisualOpacity = useSharedValue(1);
  const rightVisualOpacity = useSharedValue(1);

  useEffect(() => {
    if (isLeftSelected) {
      leftScale.value = withSequence(
        withTiming(1.03, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1.02, { duration: 120, easing: Easing.inOut(Easing.quad) })
      );
      leftOpacity.value = withTiming(1, { duration: 180 });
      leftVisualOpacity.value = withSequence(
        withTiming(0.35, { duration: 0 }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
      );
      rightScale.value = withTiming(1, { duration: 200 });
      rightOpacity.value = withTiming(0.55, { duration: 180 });
    } else if (isRightSelected) {
      rightScale.value = withSequence(
        withTiming(1.03, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1.02, { duration: 120, easing: Easing.inOut(Easing.quad) })
      );
      rightOpacity.value = withTiming(1, { duration: 180 });
      rightVisualOpacity.value = withSequence(
        withTiming(0.35, { duration: 0 }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
      );
      leftScale.value = withTiming(1, { duration: 200 });
      leftOpacity.value = withTiming(0.55, { duration: 180 });
    }
  }, [
    isLeftSelected,
    isRightSelected,
    leftVisualOpacity,
    leftOpacity,
    leftScale,
    rightVisualOpacity,
    rightOpacity,
    rightScale,
  ]);

  const leftPanelAnim = useAnimatedStyle(() => ({
    transform: [{ scale: leftScale.value }],
    opacity: leftOpacity.value,
  }));
  const rightPanelAnim = useAnimatedStyle(() => ({
    transform: [{ scale: rightScale.value }],
    opacity: rightOpacity.value,
  }));
  const leftVisualAnim = useAnimatedStyle(() => ({
    opacity: leftVisualOpacity.value,
  }));
  const rightVisualAnim = useAnimatedStyle(() => ({
    opacity: rightVisualOpacity.value,
  }));

  const leftDotColor = isLeftSelected
    ? toRgba(colors.text.primary, 0.45)
    : toRgba(colors.ui.divider, 0.28);
  const rightDotColor = showComparison && rightChoice?.isKey
    ? toRgba(colors.accent.primary, 0.55)
    : toRgba(colors.ui.divider, 0.28);

  return (
    <View style={styles.stepBody}>
      <View style={styles.narrativeTopSection}>
        <Card style={styles.narrativeCard}>
          <View style={styles.narrativeCharacterRow}>
            <View style={styles.narrativeAvatar}>
              <Ionicons
                name="person-outline"
                size={components.sizes.icon.md}
                color={colors.text.secondary}
              />
            </View>
            <View style={styles.narrativeCharacterText}>
              <AppText style={styles.narrativeCharacterName}>
                {scenarioName}
              </AppText>
              <AppText style={styles.narrativeCharacterSubtitle}>
                {scenarioSubtitle}
              </AppText>
            </View>
          </View>
          <AppText style={styles.narrativeQuote}>{scenario?.text}</AppText>
        </Card>

        <AppText style={styles.narrativePrompt}>
          {scenario?.prompt || 'Wat doe je eerst?'}
        </AppText>
      </View>

      <View style={styles.narrativeFlowWrap}>
        <View style={styles.narrativeChoiceRow}>
          {leftChoice ? (
            <Pressable
              onPress={() => {
                setSelected(leftChoice.id);
                onAnswerReveal?.();
              }}
              style={({ pressed }) => [
                styles.narrativeChoiceCard,
                styles.narrativeChoiceCardReactive,
                isLeftSelected && styles.narrativeChoiceCardActiveReactive,
                pressed && styles.narrativeChoiceCardPressed,
              ]}
            >
              <Ionicons
                name={leftChoice.icon || 'flash-outline'}
                size={components.sizes.icon.lg}
                color={colors.text.secondary}
              />
              <AppText style={styles.narrativeChoiceLabel}>{leftChoice.label}</AppText>
              <AppText style={styles.narrativeChoiceHint}>{leftChoice.sublabel}</AppText>
            </Pressable>
          ) : null}

          {rightChoice ? (
            <Pressable
              onPress={() => {
                setSelected(rightChoice.id);
                onAnswerReveal?.();
              }}
              style={({ pressed }) => [
                styles.narrativeChoiceCard,
                styles.narrativeChoiceCardPlan,
                showComparison && rightChoice?.isKey && (
                  mode === 'dark'
                    ? {
                        borderColor:
                          isRightSelected
                            ? colors.accent.primary
                            : toRgba(colors.accent.primary, colors.opacity.stroke),
                        backgroundColor:
                          isRightSelected
                            ? toRgba(colors.accent.primary, colors.opacity.tint)
                            : toRgba(colors.accent.primary, colors.opacity.tint),
                      }
                    : styles.narrativeChoiceCardActivePlan
                ),
                pressed && styles.narrativeChoiceCardPressed,
              ]}
            >
              <Ionicons
                name={rightChoice.icon || 'flag-outline'}
                size={components.sizes.icon.lg}
                color={
                  showComparison && rightChoice?.isKey
                    ? mode === 'dark'
                      ? colors.accent.primary
                      : colors.text.secondary
                    : colors.text.primary
                }
              />
              <AppText
                style={[
                  styles.narrativeChoiceLabel,
                  styles.narrativeChoiceLabelPlan,
                  mode === 'dark' && showComparison && rightChoice?.isKey && styles.narrativeChoiceLabelPlanActiveDark,
                ]}
              >
                {rightChoice.label}
              </AppText>
              <AppText style={styles.narrativeChoiceHint}>{rightChoice.sublabel}</AppText>
            </Pressable>
          ) : null}
        </View>

        {showComparison ? (
          <>
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={[
                styles.scenarioRevealCard,
                isCorrect && styles.scenarioRevealCardCorrect,
              ]}
            >
              <View style={styles.scenarioRevealHeader}>
                {isCorrect && mode === 'light' ? (
                  <View style={styles.scenarioRevealIconBubble}>
                    <Ionicons
                      name="checkmark"
                      size={components.sizes.icon.sm}
                      color={colors.text.primary}
                    />
                  </View>
                ) : isCorrect && mode === 'dark' ? (
                  <View style={[styles.scenarioRevealIconBubble, { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary }]}>
                    <Ionicons
                      name="checkmark"
                      size={components.sizes.icon.sm}
                      color={colors.background.surface}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'information-circle'}
                    size={18}
                    color={isCorrect ? colors.accent.primary : colors.text.secondary}
                  />
                )}
                <AppText
                  style={[
                    styles.scenarioRevealLabel,
                    isCorrect && styles.scenarioRevealLabelKey,
                  ]}
                >
                  {isCorrect
                    ? scenario?.feedback?.correctLabel || copy.introScenario.feedbackCorrectTitle
                    : scenario?.feedback?.incorrectLabel || copy.introScenario.feedbackIncorrectTitle}
                </AppText>
              </View>
              <AppText style={styles.scenarioRevealText}>
                {isCorrect ? scenario?.feedback?.correct : scenario?.feedback?.incorrect}
              </AppText>
            </Animated.View>

            <View style={styles.narrativeConnectorRow}>
              <View style={styles.narrativeConnectorCol}>
                {[0, 1, 2, 3, 4].map((dotIndex) => (
                  <View
                    key={`left-dot-${dotIndex}`}
                    style={[styles.narrativeConnectorDot, { backgroundColor: leftDotColor }]}
                  />
                ))}
              </View>
              <View style={styles.narrativeConnectorCol}>
                {[0, 1, 2, 3, 4].map((dotIndex) => (
                  <View
                    key={`right-dot-${dotIndex}`}
                    style={[styles.narrativeConnectorDot, { backgroundColor: rightDotColor }]}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.scenarioCompareGrid, styles.narrativeCompareGridOverride]}>
              <ScenarioCompareCard
                title={scenario?.comparison?.left?.title}
                animatedStyle={leftPanelAnim}
                cardStyle={{
                  flex: 1,
                  backgroundColor: isLeftSelected
                    ? toRgba(colors.background.surfaceActive, 0.6)
                    : toRgba(colors.background.surface, colors.opacity.surface),
                  borderColor: isLeftSelected
                    ? colors.text.primary
                    : toRgba(colors.ui.divider, colors.opacity.stroke),
                }}
                visual={(
                  <Animated.View style={leftVisualAnim}>
                    <ComparisonSymbolVisual variant={scenario?.comparison?.left?.visualVariant || 'uncertain'} />
                  </Animated.View>
                )}
                rows={leftItems.map((item, index) => ({
                  id: `${scenario?.comparison?.left?.title}-${index}`,
                  label: item,
                  nodeStyles: [styles.scenarioCompareNodeActiveReactive],
                  lineStyles: [styles.scenarioCompareLineDotted],
                  labelStyles: [
                    isLeftSelected
                      ? styles.scenarioCompareStepLabelActive
                      : styles.scenarioCompareStepLabelMissing,
                  ],
                }))}
              />

              <ScenarioCompareCard
                title={scenario?.comparison?.right?.title}
                animatedStyle={rightPanelAnim}
                cardStyle={{
                  flex: 1,
                  backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
                  borderColor: isRightSelected
                    ? colors.accent.primary
                    : toRgba(colors.ui.divider, colors.opacity.stroke),
                }}
                visual={(
                  <Animated.View style={rightVisualAnim}>
                    <ComparisonSymbolVisual variant={scenario?.comparison?.right?.visualVariant || 'goal'} />
                  </Animated.View>
                )}
                rows={rightItems.map((item, index) => ({
                  id: `${scenario?.comparison?.right?.title}-${index}`,
                  label: item,
                  nodeStyles: [styles.scenarioCompareNodeActive],
                  lineStyles: [styles.scenarioCompareLineActive],
                  labelStyles: [styles.scenarioCompareStepLabelActive],
                }))}
              />
            </View>
          </>
        ) : null}
      </View>

      {showComparison ? (
        <View style={styles.narrativeOutcomeSection}>
          <AppText style={styles.scenarioInsightLine}>{scenario?.insightLine}</AppText>
          <PrimaryButton label={copy.buttons.next} onPress={onNext} />
        </View>
      ) : null}
    </View>
  );
}

function ComparisonSymbolVisual({ variant }) {
  const { styles, colors } = useLessonStepStyles();
  const drift = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, [drift, progress]);

  const symbolAnim = useAnimatedStyle(() => {
    if (variant === 'uncertain') {
      return {
        transform: [
          { translateY: interpolate(drift.value, [0, 1], [2, -3], Extrapolation.CLAMP) },
          { translateX: interpolate(drift.value, [0, 0.5, 1], [-1, 2, -1], Extrapolation.CLAMP) },
          { rotate: `${interpolate(drift.value, [0, 0.5, 1], [-2, 2, -2], Extrapolation.CLAMP)}deg` },
        ],
      };
    }

    return {
      transform: [
        { translateY: interpolate(drift.value, [0, 1], [1, -1], Extrapolation.CLAMP) },
      ],
    };
  });

  const particleOneAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-2, 5], Extrapolation.CLAMP) },
      { translateY: interpolate(progress.value, [0, 1], [2, -4], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.25, 0.65, 0.25], Extrapolation.CLAMP),
  }));
  const particleTwoAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [3, -4], Extrapolation.CLAMP) },
      { translateY: interpolate(progress.value, [0, 1], [-3, 4], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.2, 0.45, 0.2], Extrapolation.CLAMP),
  }));
  const progressDotAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, 44], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(progress.value, [0, 0.15, 1], [0, 1, 1], Extrapolation.CLAMP),
  }));
  const riskLineProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 0.78], [132, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0, 0.08, 0.9, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const riskPulseProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0.58, 0.72, 0.9, 1], [0, 14, 14, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.58, 0.7, 0.88, 1], [0, 0.22, 0.22, 0], Extrapolation.CLAMP),
  }));
  const stableLineProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 0.62], [74, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0, 0.08, 0.92, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const stableRingProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.36, 0.68], [38, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.36, 0.44, 0.9, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));
  const stablePulseProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0.68, 0.82, 0.92, 1], [0, 13, 13, 0], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.68, 0.78, 0.9, 1], [0, 0.22, 0.22, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.compareVisualWrap}>
      {variant === 'shortRisk' ? (
        <View style={styles.compareVisualStage}>
          <Svg width={116} height={82}>
            <Path
              d="M 12 64 L 104 64"
              stroke={toRgba(colors.ui.divider, 0.22)}
              strokeWidth={1}
            />
            <Path
              d="M 12 18 L 12 64"
              stroke={toRgba(colors.ui.divider, 0.22)}
              strokeWidth={1}
            />
            <AnimatedPath
              d="M 14 56 L 28 28 L 42 62 L 58 34 L 74 66 L 96 40"
              stroke={toRgba(colors.text.secondary, 0.82)}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={132}
              animatedProps={riskLineProps}
              fill="none"
            />
            <AnimatedCircle cx={96} cy={40} fill={toRgba(colors.text.secondary, 0.9)} animatedProps={riskPulseProps} />
            <Path
              d="M 96 24 L 110 50 L 82 50 Z"
              fill={toRgba(colors.background.surface, 0.92)}
              stroke={toRgba(colors.text.secondary, 0.7)}
              strokeWidth={1.4}
            />
            <Path
              d="M 96 32 L 96 42"
              stroke={toRgba(colors.text.secondary, 0.85)}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Circle cx={96} cy={46} r={1.8} fill={toRgba(colors.text.secondary, 0.85)} />
          </Svg>
        </View>
      ) : variant === 'shortStable' ? (
        <View style={styles.compareVisualStage}>
          <Svg width={116} height={82}>
            <Path
              d="M 18 24 L 18 64 L 78 64 L 78 24 Z"
              stroke={toRgba(colors.ui.divider, 0.32)}
              strokeWidth={1.3}
              fill="none"
            />
            <Path
              d="M 18.7 24 L 18.7 34 L 77.3 34 L 77.3 24 Z"
              fill={toRgba(colors.ui.divider, 0.13)}
            />
            <Path
              d="M 18 34 L 78 34"
              stroke={toRgba(colors.ui.divider, 0.25)}
              strokeWidth={0.8}
            />
            <Circle cx={36} cy={24} r={3.4} fill={colors.background.surface} stroke={toRgba(colors.text.primary, 0.34)} strokeWidth={1.1} />
            <Circle cx={60} cy={24} r={3.4} fill={colors.background.surface} stroke={toRgba(colors.text.primary, 0.34)} strokeWidth={1.1} />
            {[30, 42, 54, 66].map((x) => (
              <Circle key={`stable-day-top-${x}`} cx={x} cy={44} r={2.1} fill={toRgba(colors.text.primary, 0.18)} />
            ))}
            {[30, 42, 54, 66].map((x) => (
              <Circle key={`stable-day-bottom-${x}`} cx={x} cy={56} r={2.1} fill={toRgba(colors.text.primary, 0.18)} />
            ))}
            <AnimatedPath
              d="M 20 70 L 92 70"
              stroke={toRgba(colors.accent.primary, 0.8)}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeDasharray={74}
              animatedProps={stableLineProps}
            />
            <AnimatedCircle cx={66} cy={56} fill={toRgba(colors.accent.primary, 0.85)} animatedProps={stablePulseProps} />
            <AnimatedCircle
              cx={66}
              cy={56}
              r={6}
              stroke={toRgba(colors.accent.primary, 0.95)}
              strokeWidth={1.8}
              strokeDasharray={38}
              animatedProps={stableRingProps}
              fill="none"
            />
            <Path
              d="M 88 38 L 100 34 L 100 50 C 100 58 94 64 88 67 C 82 64 76 58 76 50 L 76 34 Z"
              fill={toRgba(colors.background.surface, 0.9)}
              stroke={toRgba(colors.accent.primary, 0.72)}
              strokeWidth={1.5}
            />
            <Path
              d="M 82 50 L 86 54 L 94 44"
              stroke={toRgba(colors.accent.primary, 0.9)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>
      ) : variant === 'uncertain' ? (
        <View style={styles.compareVisualStage}>
          <Animated.View style={[styles.compareVisualParticle, styles.compareVisualParticleOne, particleOneAnim]} />
          <Animated.View style={[styles.compareVisualParticle, styles.compareVisualParticleTwo, particleTwoAnim]} />
          <Animated.View style={[styles.compareVisualCore, styles.compareVisualCoreMuted, symbolAnim]}>
            <AppText style={styles.compareVisualQuestionMark}>?</AppText>
          </Animated.View>
          <View style={styles.compareVisualCaptionRow}>
            <View style={[styles.compareVisualCaptionDash, styles.compareVisualCaptionDashMuted]} />
            <View style={[styles.compareVisualCaptionDash, styles.compareVisualCaptionDashShort]} />
          </View>
        </View>
      ) : (
        <View style={styles.compareVisualStage}>
          <View style={styles.compareProgressRail}>
            <Animated.View
              style={[
                styles.compareProgressDot,
                { backgroundColor: colors.accent.primary },
                progressDotAnim,
              ]}
            />
          </View>
          <Animated.View style={[styles.compareGoalWrap, symbolAnim]}>
            <Ionicons name="home-outline" size={22} color={colors.accent.primary} />
          </Animated.View>
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
  const hasSwipeCards = (content?.steps?.visualization?.cards || []).length > 0;

  if (lessonId === 'lesson_0' || lessonId === 'lesson_1' || hasSwipeCards) {
    return (
      <IntroVisualizationStep
        content={content}
        onNext={onNext}
        copy={copy}
        lessonId={lessonId}
      />
    );
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

function ScenarioStep({ content, userContext, onNext, onPressTerm, copy, onAnswerReveal }) {
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
                onPress={() => {
                  setSelected(option);
                  onAnswerReveal?.();
                }}
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

function ExerciseStep({ content, lessonId, onNext, onPressTerm, onOpenLessonGlossary, copy, onAnswerReveal }) {
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
        onOpenLessonGlossary={onOpenLessonGlossary}
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
          onAnswerReveal={onAnswerReveal}
        />
      );
    case 'choice':
      return (
        <ChoiceExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
          onAnswerReveal={onAnswerReveal}
        />
      );
    case 'guidedGoal':
      return (
        <GuidedGoalExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'goalInput':
      return (
        <GoalInputExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'buildGoal':
      return (
        <BuildGoalExercise
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
    case 'scenario':
      return (
        <ScenarioExercise
          exercise={exercise}
          onNext={onNext}
          copy={copy}
          onAnswerReveal={onAnswerReveal}
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

function ScenarioExercise({ exercise, onNext, copy, onAnswerReveal }) {
  const { onboardingContext } = useApp();
  const { colors, components, styles, mode } = useLessonStepStyles();
  const {
    sections = [],
    story,
    name,
    personalized,
    storyLead,
    storyQuoteField,
    storyQuoteFallback,
    storyTail,
    question,
    options = [],
    cardLabel,
    cardSubtitle,
    feedback = {},
    nextQuestionLabel,
    nextLabel,
    completionLabel,
  } = exercise;
  const hasSections = sections.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState(() =>
    hasSections
      ? sections.reduce((acc, section) => ({ ...acc, [section.id]: null }), {})
      : { single: null }
  );

  const activeSection = hasSections ? sections[activeIndex] : exercise;
  const answerKey = hasSections ? activeSection?.id : 'single';
  const picked = answerKey ? answers[answerKey] : null;
  const isAnswered = picked !== null;
  const storyQuote = resolveScenarioStoryQuote(
    onboardingContext,
    activeSection?.storyQuoteField ?? storyQuoteField,
    activeSection?.storyQuoteFallback ?? storyQuoteFallback
  );
  const scenarioName = activeSection?.name || name;
  const headerLabel =
    activeSection?.cardLabel ??
    cardLabel ??
    scenarioName ??
    'Scenario';
  const showPersonalizationHint = Boolean(
    activeSection?.personalized ||
    personalized ||
    activeSection?.storyQuoteField ||
    storyQuoteField
  );
  const headerSubtitle =
    activeSection?.cardSubtitle ??
    cardSubtitle ??
    (showPersonalizationHint ? copy.labels.scenarioPersonalisedSub : null);
  const activeOptions = (activeSection?.options || options).map((option, index) => {
    if (typeof option === 'string') {
      return {
        id: `${activeSection?.id || 'option'}-${index}`,
        label: option,
        isKey: option === activeSection?.correctOption,
      };
    }
    return {
      ...option,
      isKey:
        option.isKey ||
        option.label === activeSection?.correctOption ||
        option.id === activeSection?.correctOption,
    };
  });

  const handlePick = (id) => {
    if (!answerKey || picked) return;
    setAnswers((prev) => ({ ...prev, [answerKey]: id }));
    onAnswerReveal?.();
  };

  const handleNext = () => {
    if (!isAnswered) return;
    if (hasSections && activeIndex < sections.length - 1) {
      setActiveIndex((prev) => prev + 1);
      return;
    }
    onNext();
  };

  const pickedOption = activeOptions.find((option) => option.id === picked);
  const activeFeedback = activeSection?.feedback || feedback;
  const feedbackLabel = pickedOption?.isKey
    ? activeFeedback.correctLabel || copy.labels.aligned
    : activeFeedback.incorrectLabel || copy.labels.recheckFlow;
  const feedbackText = pickedOption?.isKey
    ? activeFeedback.correctText || pickedOption?.reveal
    : activeFeedback.incorrectText || pickedOption?.reveal;
  const actionLabel = hasSections && activeIndex < sections.length - 1
    ? nextQuestionLabel || copy.buttons.nextQuestion || copy.buttons.next
    : completionLabel || nextLabel || copy.buttons.next;

  return (
    <View style={[styles.stepBody, styles.scenarioTopSpacing, styles.scenarioExerciseBody]}>
      <Animated.View
        key={activeSection?.id || 'single'}
        entering={FadeInDown.duration(220)}
        style={styles.scenarioExercisePanel}
      >
        <Card style={styles.narrativeCard}>
          {scenarioName ? (
            <View style={styles.narrativeCharacterRow}>
              <View style={styles.narrativeAvatar}>
                <Ionicons
                  name="person-outline"
                  size={components.sizes.icon.md}
                  color={colors.text.secondary}
                />
              </View>
              <View style={styles.narrativeCharacterText}>
                <AppText style={styles.narrativeCharacterName}>
                  {headerLabel}
                </AppText>
                {headerSubtitle ? (
                  <AppText style={styles.narrativeCharacterSubtitle}>
                    {headerSubtitle}
                  </AppText>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.scenarioStoryHeader}>
              <AppText style={styles.scenarioStoryLabel}>{headerLabel}</AppText>
              {headerSubtitle ? (
                <AppText style={styles.scenarioStorySubtitle}>
                  {headerSubtitle}
                </AppText>
              ) : null}
            </View>
          )}
          {activeSection?.storyLead && activeSection?.storyTail ? (
            <AppText style={styles.narrativeQuote}>
              {`${activeSection.storyLead} `}
              <Text style={styles.scenarioStoryTextUser}>{storyQuote}</Text>
              {'.\n'}
              {activeSection.storyTail}
            </AppText>
          ) : storyLead && storyTail ? (
            <AppText style={styles.narrativeQuote}>
              {`${storyLead} `}
              <Text style={styles.scenarioStoryTextUser}>{storyQuote}</Text>
              {'.\n'}
              {storyTail}
            </AppText>
          ) : (
            <AppText style={styles.narrativeQuote}>{activeSection?.story || story}</AppText>
          )}
        </Card>

        <View style={styles.scenarioQuestionBlock}>
          <AppText style={styles.scenarioQuestion}>{activeSection?.question || question}</AppText>
          <View style={styles.scenarioOptionList}>
            {activeOptions.map((opt) => {
              const isPicked = picked === opt.id;
              const isKey = isAnswered && opt.isKey;
              const isWrongPick = isPicked && !opt.isKey;
              const isDimmed = isAnswered && !isPicked && !opt.isKey;
              return (
                <SelectableOptionButton
                  key={opt.id}
                  onPress={() => handlePick(opt.id)}
                  disabled={isAnswered}
                  label={opt.label}
                  state={isKey ? 'correct' : isWrongPick ? 'incorrect' : isDimmed ? 'dimmed' : 'default'}
                  style={isKey ? styles.scenarioOptionButtonActive : null}
                  labelStyle={isKey ? styles.scenarioOptionLabelActive : null}
                  accessory={
                    isKey ? (
                      <View
                        style={[
                          styles.scenarioOptionCheckBadge,
                          {
                            width: components.sizes.icon.lg,
                            height: components.sizes.icon.lg,
                            borderRadius: components.sizes.icon.lg / 2,
                          },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={components.sizes.icon.sm}
                          color={mode === 'light' ? colors.text.secondary : colors.background.surface}
                        />
                      </View>
                    ) : isWrongPick ? (
                      <Ionicons name="close-circle" size={components.sizes.icon.lg} color={colors.text.secondary} />
                    ) : null
                  }
                />
              );
            })}
          </View>
        </View>
      </Animated.View>

      {isAnswered && pickedOption ? (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[
            styles.scenarioRevealCard,
            pickedOption.isKey && styles.scenarioRevealCardCorrect,
          ]}
        >
          <View style={styles.scenarioRevealHeader}>
            {pickedOption.isKey ? (
              <View style={[styles.scenarioRevealIconBubble, mode === 'dark' && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary }]}>
                <Ionicons
                  name="checkmark"
                  size={components.sizes.icon.sm}
                  color={mode === 'dark' ? colors.background.surface : colors.text.primary}
                />
              </View>
            ) : (
              <Ionicons
                name="information-circle"
                size={components.sizes.icon.lg}
                color={colors.text.secondary}
              />
            )}
            <AppText
              style={[
                styles.scenarioRevealLabel,
                pickedOption.isKey && styles.scenarioRevealLabelKey,
              ]}
            >
              {feedbackLabel}
            </AppText>
          </View>
          <AppText style={styles.scenarioRevealText}>{feedbackText}</AppText>
        </Animated.View>
      ) : null}

      <PrimaryButton label={actionLabel} onPress={handleNext} disabled={!isAnswered} />
    </View>
  );
}

function resolveScenarioStoryQuote(onboardingContext, quoteField, fallback = '') {
  if (!quoteField) return fallback;
  const onboardingAnswers = onboardingContext?.onboardingAnswers || {};
  const value =
    onboardingContext?.[quoteField] ||
    onboardingAnswers.q3 ||
    fallback;

  return String(value || fallback).trim() || fallback;
}

function SequenceExercise({ exercise, onNext, onPressTerm, copy, onAnswerReveal }) {
  const { styles } = useLessonStepStyles();
  const { description, items = [], correctOrder = [], feedback = {} } = exercise;
  const [order, setOrder] = useState([]);

  const isComplete = order.length === items.length;
  const isCorrect =
    isComplete && correctOrder.every((stepId, index) => order[index] === stepId);
  const message = isComplete ? (isCorrect ? feedback.correct : feedback.incorrect) : null;

  const handleAdd = (stepId) => {
    if (order.includes(stepId)) return;
    setOrder((prev) => {
      const nextOrder = [...prev, stepId];
      if (nextOrder.length === items.length) {
        onAnswerReveal?.();
      }
      return nextOrder;
    });
  };

  const handleRemove = (stepId) => {
    setOrder((prev) => prev.filter((item) => item !== stepId));
  };

  const reset = () => setOrder([]);
  const progressionHelper = isComplete
    ? copy.messages.readyToContinue
    : copy.messages.completeOrderToContinue;

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
                  style={({ pressed }) => [
                    styles.sequenceItem,
                    pressed && styles.sequenceItemPressed,
                  ]}
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
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionDisabled,
                  pressed && !isSelected && styles.optionPressed,
                ]}
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
        <Animated.View entering={FadeInDown.duration(220)}>
          <Card style={styles.insightCard}>
            <AppText style={styles.insightTitle}>
              {isCorrect ? copy.labels.aligned : copy.labels.recheckFlow}
            </AppText>
            <GlossaryText text={message} style={styles.caption} onPressTerm={onPressTerm} />
          </Card>
        </Animated.View>
      ) : null}

      <Animated.View style={styles.exerciseActions} layout={LinearTransition.duration(180)}>
        <Animated.View
          key={isComplete ? 'ready' : 'incomplete'}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(120)}
        >
          <AppText
            style={[
              styles.ctaStatusText,
              isComplete && styles.ctaStatusTextReady,
            ]}
          >
            {progressionHelper}
          </AppText>
        </Animated.View>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!isComplete}
        />
      </Animated.View>
    </View>
  );
}

function IntroExerciseStep({ exercise, onNext, onPressTerm, onOpenLessonGlossary, copy }) {
  const { styles, colors, components, mode } = useLessonStepStyles();
  const { items = [], correctOrder = [] } = exercise;

  const [placements, setPlacements] = useState(() =>
    items.reduce((acc, item) => ({ ...acc, [item.id]: null }), {})
  );
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
    setPlacements((prev) => ({ ...prev, [id]: null }));
  };

  return (
    <View style={[styles.stepBody, styles.exerciseBody]}>
      <View style={styles.exerciseContent}>

        {/* Slot stack */}
        <View style={[styles.exerciseSection, styles.introExercisePrimarySection]}>
          <View style={styles.introSlotStack}>
            {slots.map((item, index) => {
              const isNextEmpty = !item && slots.slice(0, index).every(Boolean);
              const isWrong = wrongSlots[index];
              return (
                <Animated.View key={`slot-wrap-${index}`} style={[isWrong && shakeStyle]}>
                  <Pressable
                    style={[
                      styles.introSlot,
                      item ? styles.introSlotFilled : styles.introSlotEmpty,
                      isNextEmpty && styles.introSlotNext,
                      isWrong && styles.introSlotWrong,
                      isCorrect && item && styles.introSlotCorrect,
                    ]}
                    onPress={() => handleRemove(item?.id)}
                    disabled={!item}
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
                        isWrong && styles.introSlotBadgeWrong,
                        isCorrect && item && styles.introSlotBadgeCorrect,
                      ]}
                    >
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
                    </View>

                    {/* Label or placeholder */}
                    {item ? (
                      <Animated.View key={item.id} entering={FadeInDown.duration(180)} style={styles.introSlotLabelRow}>
                        <AppText
                          style={[
                            styles.introSlotLabel,
                            isWrong && styles.introSlotLabelWrong,
                            isCorrect && item && styles.introSlotLabelCorrect,
                          ]}
                        >
                          {item.label}
                        </AppText>
                        {isWrong ? (
                          <View style={[styles.introSlotStateIcon, styles.introSlotStateIconWrong]}>
                            <Ionicons
                              name="close"
                              size={12}
                              color={mode === 'dark' ? colors.background.surface : colors.text.primary}
                            />
                          </View>
                        ) : isCorrect && item ? (
                          <View style={[styles.introSlotStateIcon, styles.introSlotStateIconCorrect]}>
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color={mode === 'dark' ? colors.background.surface : colors.text.primary}
                            />
                          </View>
                        ) : (
                          <Ionicons name="close" size={13} color={toRgba(colors.text.secondary, 0.45)} />
                        )}
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
        </View>

        {/* Card pool */}
        {available.length > 0 ? (
          <View style={[styles.exerciseSection, styles.introExercisePoolSection]}>
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
            label={copy.labels.viewTerms}
            onPress={onOpenLessonGlossary}
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

function ChoiceExercise({ exercise, onNext, onPressTerm, copy, onAnswerReveal }) {
  const { styles } = useLessonStepStyles();
  const { description, options = [], revealTitle = copy.labels.outcome } = exercise;
  const [selectedId, setSelectedId] = useState(null);
  const selected = options.find((option) => option.id === selectedId);

  const reset = () => setSelectedId(null);
  const canContinue = selected !== null;

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
                style={({ pressed }) => [
                  styles.option,
                  isActive && styles.optionActive,
                  pressed && !isActive && styles.optionPressed,
                  pressed && isActive && styles.optionActivePressed,
                ]}
                onPress={() => {
                  setSelectedId(option.id);
                  onAnswerReveal?.();
                }}
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
        <Animated.View entering={FadeInDown.duration(220)}>
          <Card style={styles.insightCard}>
            <AppText style={styles.insightTitle}>{selected.revealTitle || revealTitle}</AppText>
            <GlossaryText text={selected.reveal} style={styles.caption} onPressTerm={onPressTerm} />
          </Card>
        </Animated.View>
      ) : null}

      <Animated.View style={styles.exerciseActions} layout={LinearTransition.duration(180)}>
        <Animated.View
          key={canContinue ? 'ready' : 'waiting'}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(120)}
        >
          <AppText
            style={[
              styles.ctaStatusText,
              canContinue && styles.ctaStatusTextReady,
            ]}
          >
            {canContinue ? copy.messages.readyToContinue : copy.messages.chooseAnswerFirst}
          </AppText>
        </Animated.View>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!canContinue}
        />
      </Animated.View>
    </View>
  );
}

function BuildGoalExercise({ exercise, onNext, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const {
    description,
    fields = [],
    previewLabel = copy.labels.outcome,
    previewTemplate = '',
    feedback = {},
  } = exercise;

  const [values, setValues] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );

  const trimmedValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value.trim()])
      ),
    [values]
  );

  const isComplete = fields.every((field) => trimmedValues[field.id]);
  const previewText = useMemo(() => {
    if (!previewTemplate) return '';
    return fields.reduce((text, field) => {
      return text.replaceAll(`{${field.id}}`, trimmedValues[field.id] || '');
    }, previewTemplate);
  }, [fields, previewTemplate, trimmedValues]);

  const handleChange = (id, nextValue) => {
    setValues((prev) => ({ ...prev, [id]: nextValue }));
  };

  const reset = () => {
    setValues(fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.stepBody}>
        <Card style={styles.exerciseCard}>
          <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
          <View style={styles.buildGoalFields}>
            {fields.map((field) => (
              <View key={field.id} style={styles.buildGoalField}>
                <AppText style={styles.buildGoalFieldLabel}>{field.label}</AppText>
                <View style={styles.buildGoalInputWrap}>
                  <AppTextInput
                    style={styles.buildGoalInput}
                    value={values[field.id]}
                    onChangeText={(nextValue) => handleChange(field.id, nextValue)}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.text.secondary}
                    autoCapitalize={field.id === 'goal' ? 'sentences' : 'none'}
                    autoCorrect={field.id === 'goal'}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {isComplete ? (
          <Card style={styles.insightCard}>
            <AppText style={styles.insightTitle}>{previewLabel}</AppText>
            <View style={styles.buildGoalPreview}>
              <AppText style={styles.buildGoalPreviewText}>{previewText}</AppText>
            </View>
            {feedback.complete ? (
              <GlossaryText text={feedback.complete} style={styles.caption} onPressTerm={onPressTerm} />
            ) : null}
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
    </TouchableWithoutFeedback>
  );
}

function GoalInputExercise({ exercise, onNext, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const {
    description,
    inputLabel = '',
    inputPlaceholder = '',
    guidanceLabel = '',
    guidanceItems = [],
    submitLabel = copy.buttons.continue,
    feedback = {},
  } = exercise;
  const [text, setText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const trimmedText = text.trim();
  const isValid = trimmedText.length > 0;

  const handlePrimary = () => {
    if (hasSubmitted && isValid) {
      onNext();
      return;
    }
    setHasSubmitted(true);
  };

  const primaryLabel = hasSubmitted && isValid ? copy.buttons.next : submitLabel;
  const feedbackText = hasSubmitted && isValid ? feedback.valid : null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.stepBody}>
        <Card style={styles.exerciseCard}>
          <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />

          <View style={styles.goalInputSection}>
            {inputLabel ? <AppText style={styles.buildGoalFieldLabel}>{inputLabel}</AppText> : null}
            <View style={styles.buildGoalInputWrap}>
              <AppTextInput
                style={styles.buildGoalInput}
                value={text}
                onChangeText={setText}
                placeholder={inputPlaceholder}
                placeholderTextColor={colors.text.secondary}
                autoCapitalize="sentences"
                autoCorrect
              />
            </View>
            {guidanceLabel ? (
              <View style={styles.goalGuidanceBlock}>
                <AppText style={styles.goalGuidanceLabel}>{guidanceLabel}</AppText>
                {guidanceItems.map((item) => (
                  <View key={item} style={styles.goalGuidanceRow}>
                    <AppText style={styles.goalGuidanceBullet}>-</AppText>
                    <GlossaryText text={item} style={styles.goalGuidanceText} onPressTerm={onPressTerm} />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </Card>

        {feedbackText ? (
          <Animated.View entering={FadeInDown.duration(250)}>
            <Card style={styles.insightCard}>
              <AppText style={styles.insightTitle}>
                {isValid ? copy.labels.insight : copy.labels.hint}
              </AppText>
              <GlossaryText text={feedbackText} style={styles.caption} onPressTerm={onPressTerm} />
            </Card>
          </Animated.View>
        ) : null}

        <PrimaryButton
          label={primaryLabel}
          onPress={handlePrimary}
          disabled={!hasSubmitted && !trimmedText}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

function GuidedGoalExercise({
  exercise,
  onNext,
  onPressTerm,
  copy,
  postSubmitLabel,
  showProgressDots = true,
  completeOnFirstSubmit = false,
  personalizationHint,
  onAnswerReveal,
  showProgressionHelper = true,
}) {
  const { colors, components, styles, mode } = useLessonStepStyles();
  const {
    sections = [],
    interpretations = {},
    submitLabel = copy.buttons.continue,
    feedback = {},
    interactionMode,
    prompt,
    nextQuestionLabel,
    nextLabel,
    completionLabel,
    lockAnswerAfterSelection = false,
  } = exercise;

  const [answers, setAnswers] = useState(() =>
    sections.reduce((acc, s) => ({ ...acc, [s.id]: null }), {})
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isSingleQuestionImmediate = interactionMode === 'singleQuestionImmediate';
  const activeSingleSection = isSingleQuestionImmediate ? sections[activeIndex] : null;
  const selectedSingleOption = activeSingleSection ? answers[activeSingleSection.id] : null;
  const isSingleAnswered = selectedSingleOption !== null;
  const isLastSingleSection = activeIndex === sections.length - 1;
  const answeredCount = Object.values(answers).filter((answer) => answer !== null).length;
  const previousAnsweredCountRef = useRef(answeredCount);

  useEffect(() => {
    if (answeredCount > previousAnsweredCountRef.current) {
      onAnswerReveal?.();
    }
    previousAnsweredCountRef.current = answeredCount;
  }, [answeredCount, onAnswerReveal]);

  const singleQuestionHelper = isSingleQuestionImmediate
    ? (isSingleAnswered ? copy.messages.readyToContinue : copy.messages.chooseAnswerFirst)
    : null;

  if (isSingleQuestionImmediate) {
    const activeSection = activeSingleSection;
    const selectedOption = selectedSingleOption;
    const isAnswered = isSingleAnswered;
    const isCorrect = isAnswered && selectedOption === activeSection?.correctOption;
    const feedbackConfig = isAnswered
      ? {
          title:
            (isCorrect
              ? activeSection?.feedback?.correctTitle
              : activeSection?.feedback?.incorrectTitle) || (isCorrect ? 'Correct' : 'Not quite'),
          text:
            (isCorrect
              ? activeSection?.feedback?.correct
              : activeSection?.feedback?.incorrect) || '',
        }
      : null;

    const handleSinglePick = (option) => {
      if (!activeSection) return;
      if (lockAnswerAfterSelection && answers[activeSection.id] !== null) return;
      setAnswers((prev) => ({ ...prev, [activeSection.id]: option }));
    };

    const handleSingleNext = () => {
      if (!isAnswered) return;
      if (activeIndex < sections.length - 1) {
        setActiveIndex((prev) => prev + 1);
        return;
      }
      onNext();
    };

    return (
      <View style={[styles.stepBody, styles.guidedGoalSingleBody]}>
        {activeSection ? (
          <Animated.View key={activeSection.id} entering={FadeInDown.duration(220)}>
            <Card style={styles.guidedGoalActiveCard}>
              <AppText style={styles.guidedGoalQuestion}>
                {activeSection.scenario || activeSection.question}
              </AppText>
              {prompt ? (
                <GlossaryText text={prompt} style={styles.bodyText} onPressTerm={onPressTerm} />
              ) : null}
              <View style={styles.goalOptionList}>
                {activeSection.options?.map((option) => {
                  const isPicked = selectedOption === option;
                  const isKey = isAnswered && option === activeSection.correctOption;
                  const isWrongPick = isPicked && option !== activeSection.correctOption;
                  const isDimmed = isAnswered && !isPicked && !isKey;
                  return (
                    <SelectableOptionButton
                      key={option}
                      onPress={() => handleSinglePick(option)}
                      disabled={isAnswered}
                      label={option}
                      state={isKey ? 'correct' : isWrongPick ? 'incorrect' : isDimmed ? 'dimmed' : 'default'}
                      style={isKey ? styles.scenarioOptionButtonActive : null}
                      labelStyle={isKey ? styles.scenarioOptionLabelActive : null}
                      accessory={
                        isKey ? (
                          <View
                            style={[
                              styles.scenarioOptionCheckBadge,
                              {
                                width: components.sizes.icon.lg,
                                height: components.sizes.icon.lg,
                                borderRadius: components.sizes.icon.lg / 2,
                              },
                            ]}
                          >
                            <Ionicons
                              name="checkmark"
                              size={components.sizes.icon.sm}
                              color={mode === 'light' ? colors.text.onAccent : colors.text.secondary}
                            />
                          </View>
                        ) : isWrongPick ? (
                          <Ionicons
                            name="close-circle"
                            size={components.sizes.icon.lg}
                            color={colors.text.secondary}
                          />
                        ) : null
                      }
                    />
                  );
                })}
              </View>
            </Card>
          </Animated.View>
        ) : null}

        {feedbackConfig?.text ? (
          <Animated.View
            entering={FadeInDown.duration(250)}
            style={[
              styles.scenarioRevealCard,
              isCorrect && styles.scenarioRevealCardCorrect,
            ]}
          >
            <View style={styles.scenarioRevealHeader}>
              {isCorrect ? (
                <View style={[styles.scenarioRevealIconBubble, mode === 'dark' && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary }]}>
                  <Ionicons
                    name="checkmark"
                    size={components.sizes.icon.sm}
                    color={mode === 'dark' ? colors.background.surface : colors.text.primary}
                  />
                </View>
              ) : (
                <Ionicons
                  name="information-circle"
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
              )}
              <AppText
                style={[
                  styles.scenarioRevealLabel,
                  isCorrect && styles.scenarioRevealLabelKey,
                ]}
              >
                {feedbackConfig.title}
              </AppText>
            </View>
            <AppText style={styles.scenarioRevealText}>{feedbackConfig.text}</AppText>
          </Animated.View>
        ) : null}

        <View style={styles.guidedGoalFooter}>
          {showProgressDots ? (
            <View style={styles.guidedGoalFooterProgressWrap}>
              <OnboardingProgress
                current={Math.min(activeIndex + 1, sections.length)}
                total={sections.length}
                style={styles.guidedGoalFooterProgress}
              />
            </View>
          ) : null}
          <Animated.View
            key={isAnswered ? 'single-ready' : 'single-waiting'}
            entering={FadeInDown.duration(180)}
            exiting={FadeOutUp.duration(120)}
          >
            <AppText
              style={[
                styles.ctaStatusText,
                isAnswered && styles.ctaStatusTextReady,
              ]}
            >
              {singleQuestionHelper}
            </AppText>
          </Animated.View>
          <PrimaryButton
            label={
              isLastSingleSection
                ? completionLabel || nextLabel || copy.buttons.next
                : nextQuestionLabel || copy.buttons.nextQuestion || nextLabel || copy.buttons.next
            }
            onPress={handleSingleNext}
            disabled={!isAnswered}
          />
        </View>
      </View>
    );
  }

  const isComplete = sections.every((s) => answers[s.id] !== null);
  const hasCorrectOptions = sections.some((s) => s.correctOption);
  const allCorrect =
    isComplete && sections.every((s) => !s.correctOption || answers[s.id] === s.correctOption);
  const canContinue = isComplete && (!hasCorrectOptions || allCorrect);

  const handlePick = (sectionId, option, sectionIndex) => {
    setAnswers((prev) => ({ ...prev, [sectionId]: option }));
    if (hasSubmitted) setHasSubmitted(false);
    if (sectionIndex === activeIndex && sectionIndex < sections.length - 1) {
      setActiveIndex(sectionIndex + 1);
    }
  };

  const handleChangeAnswer = (sectionIndex) => {
    setActiveIndex(sectionIndex);
    if (hasSubmitted) setHasSubmitted(false);
  };

  const handleSubmit = () => {
    if ((hasSubmitted || completeOnFirstSubmit) && canContinue) {
      onNext();
    } else {
      setHasSubmitted(true);
    }
  };

  // Build interpretation text from selected answers
  const buildInterpretation = () => {
    if (!isComplete) return null;
    const whyText = interpretations?.why?.[answers.why] ?? answers.why;
    const whenText = interpretations?.when?.[answers.when] ?? answers.when;
    const fitText = interpretations?.fit?.[answers.fit] ?? answers.fit;
    const prefix = interpretations.prefix ?? '';
    return `${prefix}${whyText} ${whenText}. ${fitText}`;
  };

  const interpretationText = isComplete ? buildInterpretation() : null;
  const feedbackText = hasCorrectOptions && !allCorrect ? feedback.invalid : feedback.valid;
  const summarySections = [
    interpretationText
      ? {
          label: copy.labels.goalInterpretationTitle,
          text: interpretationText,
        }
      : null,
    isComplete && feedbackText && (!hasCorrectOptions || hasSubmitted)
      ? {
          label: copy.labels.insight,
          text: feedbackText,
        }
      : null,
  ].filter(Boolean);
  const groupedProgressionHelper = isComplete
    ? copy.messages.readyToContinue
    : copy.messages.answerAllQuestionsToContinue;

  return (
    <View style={styles.stepBody}>
      {showProgressDots ? (
        <View style={styles.goalStepDots}>
          {sections.map((s, index) => {
            const isDone = answers[s.id] !== null;
            const isCurrent = index === activeIndex && !isDone;
            return (
              <View
                key={s.id}
                style={[
                  styles.goalDot,
                  isDone && styles.goalDotDone,
                  isCurrent && styles.goalDotActive,
                ]}
              />
            );
          })}
        </View>
      ) : null}

      {/* Question sections — progressive reveal */}
      <View style={styles.guidedGoalSections}>
        {sections.map((section, index) => {
          const isAnswered = answers[section.id] !== null;
          const isVisible = index <= activeIndex || isAnswered;
          if (!isVisible) return null;

          // Collapsed answered row
          if (isAnswered && index < activeIndex) {
            return (
              <Animated.View key={section.id} entering={FadeInDown.duration(200)}>
                <Pressable
                  style={({ pressed }) => [
                    styles.goalAnsweredRow,
                    pressed && styles.goalAnsweredRowPressed,
                  ]}
                  onPress={() => handleChangeAnswer(index)}
                >
                  <View style={styles.goalAnsweredContent}>
                    <AppText style={styles.goalAnsweredQuestion}>{section.question}</AppText>
                    <AppText style={styles.goalAnsweredValue}>{answers[section.id]}</AppText>
                  </View>
                  <AppText style={styles.goalChangeLink}>{copy.labels.change}</AppText>
                </Pressable>
              </Animated.View>
            );
          }

          // Active section
          return (
            <Animated.View
              key={section.id}
              entering={index > 0 ? FadeInDown.duration(300) : undefined}
            >
              <Card style={styles.guidedGoalActiveCard}>
                <AppText style={styles.guidedGoalQuestion}>{section.question}</AppText>
                <View style={styles.goalOptionList}>
                  {section.options?.map((option) => {
                    const isActive = answers[section.id] === option;
                    return (
                      <Pressable
                        key={option}
                        style={({ pressed }) => [
                          styles.goalOption,
                          isActive && styles.goalOptionActive,
                          pressed && !isActive && styles.goalOptionPressed,
                          pressed && isActive && styles.goalOptionActivePressed,
                        ]}
                        onPress={() => handlePick(section.id, option, index)}
                      >
                        <AppText
                          style={[styles.goalOptionText, isActive && styles.goalOptionTextActive]}
                        >
                          {option}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>
            </Animated.View>
          );
        })}
      </View>

      {summarySections.length > 0 && (
        <Animated.View
          key={`${answers.why || 'why'}-${answers.when || 'when'}-${answers.fit || 'fit'}-${hasSubmitted ? 'submitted' : 'draft'}`}
          entering={FadeInDown.duration(300)}
        >
          <SplitInsightCard
            sections={summarySections}
            onPressTerm={onPressTerm}
            disableGlossaryTerms
          />
        </Animated.View>
      )}

      {/* CTA */}
      <Animated.View style={styles.guidedGoalFooter} layout={LinearTransition.duration(180)}>
        {showProgressionHelper ? (
          <Animated.View
            key={isComplete ? 'grouped-ready' : 'grouped-waiting'}
            entering={FadeInDown.duration(180)}
            exiting={FadeOutUp.duration(120)}
          >
            <AppText
              style={[
                styles.ctaStatusText,
                isComplete && styles.ctaStatusTextReady,
              ]}
            >
              {groupedProgressionHelper}
            </AppText>
          </Animated.View>
        ) : null}
        {isComplete ? (
          <Animated.View entering={FadeInDown.duration(200)}>
            <PrimaryButton
              label={hasSubmitted && canContinue ? (postSubmitLabel || copy.buttons.next) : (submitLabel || copy.buttons.continue)}
              onPress={handleSubmit}
            />
          </Animated.View>
        ) : null}
      </Animated.View>
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const customInsightText = content?.steps?.reflection?.insightText;
  const question =
    content?.steps?.reflection?.question || copy.messages.reflectionQuestion;
  const subtitle =
    content?.steps?.reflection?.subtitle || copy.messages.reflectionSubtitle;
  const placeholder =
    content?.steps?.reflection?.placeholder || copy.messages.reflectionPlaceholder;
  const canSubmit = text.trim().length > 0;
  const isSubmitted = !!response;

  const buildResponse = (input) => {
    if (customInsightText) {
      return customInsightText;
    }
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

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.reflectionKeyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={components.layout.safeArea.top}
      >
        <View style={styles.bottomPinnedStepBody}>
          <View style={styles.reflectionContent}>
            <View style={styles.reflectionHeader}>
              <AppText style={styles.reflectionQuestion}>{question}</AppText>
              <AppText style={styles.reflectionSubtitle}>
                {subtitle}
              </AppText>
            </View>
            {isSubmitted ? (
              <Animated.View
                key="submitted-reflection"
                entering={FadeInDown.duration(260)}
                exiting={FadeOutUp.duration(140)}
              >
                <ReflectionResultCard
                  answer={submittedText}
                  insightLabel={copy.labels.eqtyInsight}
                  insightText={response}
                />
                <AppText style={styles.reflectionPersonalizationHint}>
                  {copy.messages.reflectionPersonalizationHint}
                </AppText>
              </Animated.View>
            ) : (
              <Animated.View
                key="draft-reflection"
                entering={FadeInDown.duration(220)}
                exiting={FadeOutUp.duration(140)}
                layout={LinearTransition.duration(180)}
              >
                <View
                  style={[
                    styles.reflectionTextAreaWrap,
                    isFocused && styles.reflectionTextAreaWrapFocused,
                  ]}
                >
                  <AppTextInput
                    style={styles.reflectionTextArea}
                    value={text}
                    onChangeText={setText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.text.secondary}
                    multiline
                    autoCorrect
                    textAlignVertical="top"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </View>
                <AppText style={styles.reflectionPersonalizationHint}>
                  {copy.messages.reflectionPersonalizationHint}
                </AppText>
              </Animated.View>
            )}
          </View>
          <View
            style={[
              styles.reflectionActionWrap,
              keyboardVisible && styles.reflectionActionWrapKeyboard,
            ]}
          >
            <PrimaryButton
              label={isSubmitted ? copy.buttons.next : copy.buttons.submitReflection}
              onPress={handleContinue}
              disabled={!isSubmitted && !canSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function SummaryStep({ content, onComplete, onPressTerm, copy }) {
  const { colors, components, styles, mode } = useLessonStepStyles();
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
              <Ionicons
                name="checkmark"
                size={10}
                color={mode === 'light' ? colors.accent.primary : colors.background.surface}
              />
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
              {isConfirmed ? (
                <View style={styles.summaryInsightCheckBadge}>
                  <Ionicons
                    name="checkmark"
                    size={components.sizes.icon.md}
                    color={mode === 'light' ? colors.text.primary : colors.background.surface}
                  />
                </View>
              ) : (
                <Ionicons
                  name="ellipse-outline"
                  size={components.sizes.icon.lg}
                  color={toRgba(colors.ui.divider, colors.opacity.stroke)}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Status line */}
      {allConfirmed ? (
        <Animated.View
          key="summary-ready"
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(120)}
        >
          <AppText style={styles.summaryReadyText}>
            {copy.labels.allInsightsConfirmed}
          </AppText>
        </Animated.View>
      ) : (
        <Animated.View
          key="summary-nudge"
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(120)}
        >
          <AppText style={styles.summaryNudgeText}>
            {copy.labels.tapInsightToConfirm}
          </AppText>
        </Animated.View>
      )}

      <PrimaryButton label={copy.buttons.completeLesson} onPress={onComplete} />
    </View>
  );
}


function Lesson1SummaryStep({ content, onComplete, copy, onAnswerReveal }) {
  const { styles } = useLessonStepStyles();
  const summary = content?.steps?.summary || {};

  // Build a synthetic exercise object from the summary data so GuidedGoalExercise can render it
  const exercise = {
    sections: summary.sections || [],
    interpretations: summary.interpretations || {},
    submitLabel: summary.submitLabel,
    feedback: summary.feedback || {},
  };

  return (
    <View style={[styles.stepBody, styles.summaryTopSpacing]}>
      <GuidedGoalExercise
        exercise={exercise}
        onNext={onComplete}
        copy={copy}
        postSubmitLabel={copy.buttons.completeLesson}
        showProgressDots={false}
        showProgressionHelper={false}
        completeOnFirstSubmit
        onAnswerReveal={onAnswerReveal}
      />
    </View>
  );
}

function IntroSummaryStep({ content, onComplete, onPressTerm, copy, userReflection, language, onAnswerReveal }) {
  const { colors, components, styles, mode } = useLessonStepStyles();
  const [picked, setPicked] = useState(null);
  const isDutch = getLocaleKey(language) === 'nl';
  const summary = content?.steps?.summary || {};
  const scenarioLabel = summary.scenarioLabel || (isDutch ? 'Scenario' : 'Scenario');
  const scenarioSubtitle = summary.scenarioSubtitle || copy.labels.scenarioPersonalisedSub;
  const scenarioText = summary.scenarioText || (isDutch
    ? 'Bert koopt impulsief aandelen in de groene energiesector voor €3.000. Drie maanden later staat hij op -18%. Een vriend zegt: hold. Een collega zegt: verkoop. Bert weet niet wat te doen.'
    : 'Bert impulsively buys 3,000 EUR worth of green energy stocks. Three months later, he is down 18%. A friend says: hold. A colleague says: sell. Bert does not know what to do.');
  const questionText = summary.question || (isDutch
    ? 'Wat zegt het beleggingsproces?'
    : 'What does the investment process say?');
  const revealExactLabel = summary.correctLabel || (isDutch ? 'Goed' : 'Exactly');
  const revealAlmostLabel = summary.almostLabel || (isDutch ? 'Bijna juist - maar' : 'Almost right, but');
  const revealIncorrectLabel = summary.incorrectLabel || (isDutch ? 'Niet de beste keuze' : 'Not the best choice');
  const nonKeyFollowupText = summary.nonKeyFollowupText || (isDutch
    ? 'Het proces zegt, ga terug naar stap 1. Zonder een doel is elke vervolgbeslissing willekeurig.'
    : 'The process says: go back to step one. Without a goal, every next decision is arbitrary.');

  const options = summary.options || [
    {
      id: 'sell',
      label: isDutch ? 'Verkopen en verlies nemen' : 'Sell and take the loss',
      reveal: isDutch
        ? 'Verkopen is niet per se fout.\nMaar zonder doel weet Bert niet of dit de juiste keuze is.'
        : 'Not necessarily wrong, but without a goal Bert does not know if this is the right choice. Selling on instinct is just as arbitrary as buying on instinct.',
      feedbackTone: 'incorrect',
    },
    {
      id: 'hold',
      label: isDutch ? 'Houden en wachten op herstel' : 'Hold and wait for recovery',
      reveal: isDutch
        ? 'Misschien herstelt het aandeel.\nMaar zonder doel is de keuze willekeurig.'
        : 'Patience can be smart, but only if there is a reason to hold. Without a goal, waiting is not a strategy, it is procrastination.',
      feedbackTone: 'almost',
    },
    {
      id: 'process',
      label: isDutch
        ? 'Je oorspronkelijke doel herbekijken'
        : 'Revisit your original goal',
      reveal: isDutch
        ? 'Dat is wat het proces zegt. Zonder doel is elke vervolgbeslissing willekeurig.'
        : 'This is what the process says. Without a goal, every next decision is arbitrary. Reconsider the goal first, then decide.',
      isKey: true,
      feedbackTone: 'correct',
    },
  ];

  const handlePick = (id) => {
    if (picked) return;
    setPicked(id);
  };

  const pickedOption = options.find((o) => o.id === picked);
  const isAnswered = picked !== null;
  const pickedTone = pickedOption?.isKey ? 'correct' : pickedOption?.feedbackTone || 'incorrect';
  const isCorrectPick = pickedTone === 'correct';
  const pickedLabel = pickedOption?.feedbackLabel || (
    isCorrectPick
      ? revealExactLabel
      : pickedTone === 'almost'
        ? revealAlmostLabel
        : revealIncorrectLabel
  );
  const completionLabel = summary.completionLabel || copy.buttons.next;
  const followupText = pickedOption?.followupText || nonKeyFollowupText;

  useEffect(() => {
    if (isAnswered) {
      onAnswerReveal?.();
    }
  }, [isAnswered, onAnswerReveal]);

  return (
    <View style={[styles.stepBody, styles.scenarioTopSpacing]}>

      {/* Scenario */}
      <Card style={styles.narrativeCard}>
        <View style={styles.narrativeCharacterRow}>
          <View style={styles.narrativeAvatar}>
            <Ionicons
              name="person-outline"
              size={components.sizes.icon.md}
              color={colors.text.secondary}
            />
          </View>
          <View style={styles.narrativeCharacterText}>
            <AppText style={styles.narrativeCharacterName}>{scenarioLabel}</AppText>
            {scenarioSubtitle ? (
              <AppText style={styles.narrativeCharacterSubtitle}>
                {scenarioSubtitle}
              </AppText>
            ) : null}
          </View>
        </View>
        <AppText style={styles.narrativeQuote}>
          {scenarioText}
        </AppText>
      </Card>

      <View style={styles.scenarioQuestionBlock}>
        {/* Question */}
        <AppText style={styles.scenarioQuestion}>{questionText}</AppText>

        {/* Options */}
        <View style={styles.scenarioOptionList}>
          {options.map((opt) => {
            const isPicked    = picked === opt.id;
            const optionIsCorrect = opt.isKey || opt.feedbackTone === 'correct';
            const isKey       = isAnswered && optionIsCorrect;
            const isWrongPick = isPicked && !optionIsCorrect;
            const isDimmed    = isAnswered && !isPicked && !optionIsCorrect;
            return (
              <SelectableOptionButton
                key={opt.id}
                onPress={() => handlePick(opt.id)}
                disabled={isAnswered}
                label={opt.label}
                state={isKey ? 'correct' : isWrongPick ? 'incorrect' : isDimmed ? 'dimmed' : 'default'}
                style={isKey ? [styles.scenarioOptionButtonActive, styles.summaryOptionButtonActive] : null}
                labelStyle={isKey ? styles.scenarioOptionLabelActive : null}
                accessory={
                  isKey ? (
                      <View
                        style={[
                          styles.scenarioOptionCheckBadge,
                          {
                            width: components.sizes.icon.lg,
                            height: components.sizes.icon.lg,
                            borderRadius: components.sizes.icon.lg / 2,
                            backgroundColor: colors.accent.primary,
                            borderColor: colors.accent.primary,
                          },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={components.sizes.icon.sm}
                          color={mode === 'dark' ? colors.background.surface : colors.text.onAccent}
                        />
                      </View>
                  ) : isWrongPick ? (
                    <Ionicons
                      name="close-circle"
                      size={components.sizes.icon.lg}
                      color={colors.text.secondary}
                    />
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
          style={[
            styles.scenarioRevealCard,
            styles.summaryRevealCard,
            isCorrectPick && styles.scenarioRevealCardCorrect,
          ]}
        >
          <View style={styles.scenarioRevealHeader}>
            {isCorrectPick ? (
              <View
                style={[
                  styles.scenarioRevealIconBubble,
                  mode === 'dark' && {
                    backgroundColor: colors.accent.primary,
                    borderColor: colors.accent.primary,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={mode === 'dark' ? colors.background.surface : colors.text.primary}
                />
              </View>
            ) : (
              <Ionicons
                name="information-circle"
                size={18}
                color={colors.text.secondary}
              />
            )}
            <AppText
              style={[
                styles.scenarioRevealLabel,
                isCorrectPick && styles.summaryRevealLabelKey,
              ]}
            >
              {pickedLabel}
            </AppText>
          </View>
          <AppText style={styles.scenarioRevealText}>{pickedOption.reveal}</AppText>
          {!isCorrectPick && followupText ? (
            <>
              <View style={styles.scenarioRevealDivider} />
              <AppText style={styles.scenarioRevealText}>{followupText}</AppText>
            </>
          ) : null}
        </Animated.View>
      )}

      {isAnswered ? (
        <View style={styles.guidedGoalFooter}>
          <PrimaryButton label={completionLabel} onPress={onComplete} />
        </View>
      ) : null}
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
  bottomPinnedStepBody: {
    flex: 1,
    justifyContent: 'space-between',
    gap: components.layout.spacing.lg,
  },
  scenarioTopSpacing: {
    marginTop: components.layout.spacing.xxl,
  },
  scenarioExerciseBody: {
    gap: components.layout.spacing.xl,
  },
  scenarioExercisePanel: {
    gap: components.layout.spacing.xl,
  },
  summaryTopSpacing: {
    marginTop: components.layout.spacing.xxl,
  },
  summaryPersonalizationPill: {
    alignSelf: 'flex-start',
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderRadius: components.radius.pill,
    paddingVertical: 5,
    paddingHorizontal: components.layout.spacing.sm,
    marginBottom: components.layout.spacing.md,
  },
  summaryPersonalizationHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
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
    gap: 12,
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
    backgroundColor: 'transparent',
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
    gap: 12,
  },
  conceptTrackBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  goalConceptSection: {
    gap: components.layout.spacing.xs,
  },
  goalConceptSectionIntro: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  goalConceptSectionTitle: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  introConceptLead: {
    marginTop: 32,
  },
  introConceptLeadLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  introConceptLeadBody: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  goalConceptImpactList: {
    gap: 12,
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
  lessonGlossarySearchCount: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  lessonGlossarySearchMeta: {
    gap: components.layout.spacing.xs / 2,
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
  lessonGlossaryRowPressed: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderRadius: components.radius.input,
    transform: [{ scale: components.transforms.scalePressed }],
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
    overflow: 'hidden',
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
    alignItems: 'flex-start',
    gap: components.layout.spacing.sm,
    minWidth: 0,
  },
  scenarioCompareTrack: {
    position: 'relative',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: components.sizes.track.sm,
  },
  scenarioCompareNode: {
    width: components.sizes.dot.md,
    height: components.sizes.dot.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
    flexShrink: 0,
  },
  scenarioCompareNodeActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  scenarioCompareNodeActiveReactive: {
    backgroundColor: mode === 'light'
      ? 'transparent'
      : toRgba(colors.ui.divider, colors.opacity.surface),
    borderColor: mode === 'light'
      ? colors.text.secondary
      : toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareNodeCurrent: {
    backgroundColor: colors.text.primary,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareNodeMissing: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: mode === 'light'
      ? colors.text.secondary
      : toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareLine: {
    position: 'absolute',
    left: (components.sizes.track.sm - components.sizes.line.thin) / 2,
    top: components.sizes.dot.md + 4,
    width: components.sizes.line.thin,
    bottom: -(components.layout.spacing.sm - 4),
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareLineActive: {
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.surface),
  },
  scenarioCompareLineDotted: {
    backgroundColor: 'transparent',
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: mode === 'light'
      ? colors.text.secondary
      : toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareLineActiveReactive: {
    backgroundColor: mode === 'light'
      ? colors.text.secondary
      : toRgba(colors.ui.divider, colors.opacity.surface),
  },
  scenarioCompareLineMissing: {
    backgroundColor: 'transparent',
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: mode === 'light'
      ? colors.text.secondary
      : toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  scenarioCompareStepLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    lineHeight: 22,
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
  narrativeCharacterText: {
    flexShrink: 1,
    gap: 2,
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
  narrativeCharacterSubtitle: {
    ...typography.styles.small,
    color: colors.text.secondary,
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
    alignItems: 'stretch',
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
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  narrativeChoiceCardActiveReactive: {
    borderColor: colors.text.primary,
  },
  narrativeChoiceCardActivePlan: {
    borderColor: colors.text.primary,
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
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
    color: colors.text.primary,
  },
  narrativeChoiceLabelPlanActiveDark: {
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
    overflow: 'hidden',
  },
  narrativeCompareGridOverride: {
    marginTop: components.layout.spacing.none,
  },
  narrativeOutcomeSection: {
    marginTop: 4,
    gap: components.layout.spacing.md,
  },
  compareVisualWrap: {
    width: '100%',
    minWidth: 0,
    marginTop: components.layout.spacing.sm,
  },
  compareVisualStage: {
    height: components.sizes.chart.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  compareVisualCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
  },
  compareVisualCoreMuted: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  compareVisualQuestionMark: {
    ...typography.styles.h2,
    color: colors.text.secondary,
  },
  compareVisualParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.surface),
  },
  compareVisualParticleOne: {
    top: 18,
    left: '32%',
  },
  compareVisualParticleTwo: {
    right: '28%',
    bottom: 20,
  },
  compareVisualCaptionRow: {
    position: 'absolute',
    bottom: components.layout.spacing.md,
    flexDirection: 'row',
    gap: components.layout.spacing.xs,
    alignItems: 'center',
  },
  compareVisualCaptionDash: {
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  compareVisualCaptionDashMuted: {
    width: 30,
  },
  compareVisualCaptionDashShort: {
    width: 14,
    opacity: 0.6,
  },
  compareGoalWrap: {
    position: 'absolute',
    right: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  compareProgressRail: {
    width: 74,
    height: 2,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.accent.primary, 0.18),
    position: 'absolute',
    left: 20,
  },
  compareProgressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: -4,
    left: 0,
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
    width: '100%',
    minWidth: 0,
  },
  scenarioCurveChart: {
    width: '100%',
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
  optionPressed: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderColor: toRgba(colors.text.primary, colors.opacity.stroke),
    transform: [{ scale: components.transforms.scalePressed }],
  },
  optionActivePressed: {
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.surface),
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    transform: [{ scale: components.transforms.scalePressed }],
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
    gap: components.layout.spacing.none,
  },
  exerciseSection: {
    gap: components.layout.spacing.md,
  },
  introExercisePoolSection: {
    marginTop: components.layout.spacing.xl,
  },
  guidedGoalSections: {
    gap: components.layout.spacing.md,
  },
  guidedGoalSection: {
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  guidedGoalQuestion: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  goalChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.sm,
  },
  goalChip: {
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  goalChipActive: {
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
  },
  goalChipText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  goalChipTextActive: {
    ...typography.styles.small,
    color: colors.text.primary,
    fontFamily: typography.fonts.interSemiBold,
  },
  // GuidedGoalExercise — progressive reveal styles
  goalStepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
    paddingBottom: components.layout.spacing.sm,
  },
  goalDot: {
    width: components.sizes.dot.sm,
    height: components.sizes.dot.sm,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  goalDotActive: {
    width: components.sizes.dot.md,
    height: components.sizes.dot.md,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    borderWidth: components.borderWidth.thin,
    borderColor: colors.accent.primary,
  },
  goalDotDone: {
    backgroundColor: colors.accent.primary,
  },
  goalAnsweredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.accent.primary,
    backgroundColor: mode === 'light'
      ? colors.background.surfaceActive
      : toRgba(colors.accent.primary, 0.06),
  },
  goalAnsweredRowPressed: {
    transform: [{ scale: components.transforms.scalePressed }],
    backgroundColor: mode === 'light'
      ? toRgba(colors.background.surfaceActive, colors.opacity.surface)
      : toRgba(colors.accent.primary, colors.opacity.tint),
  },
  goalAnsweredContent: {
    gap: 2,
    flex: 1,
  },
  goalAnsweredQuestion: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  goalAnsweredValue: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  goalChangeLink: {
    ...typography.styles.small,
    color: colors.text.secondary,
    marginLeft: components.layout.spacing.md,
  },
  guidedGoalActiveCard: {
    gap: components.layout.spacing.md,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  guidedGoalSingleBody: {
    marginTop: components.layout.spacing.xxl,
  },
  guidedGoalFooter: {
    gap: components.layout.spacing.md,
  },
  guidedGoalFooterProgressWrap: {
    alignItems: 'center',
  },
  guidedGoalFooterProgress: {
    justifyContent: 'center',
  },
  goalOptionList: {
    gap: components.layout.spacing.xs,
  },
  goalOption: {
    paddingVertical: components.layout.spacing.md,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
  },
  goalOptionActive: {
    backgroundColor: mode === 'light'
      ? colors.background.surfaceActive
      : toRgba(colors.accent.primary, colors.opacity.tint),
    borderColor: colors.accent.primary,
  },
  goalOptionPressed: {
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderColor: toRgba(colors.text.primary, colors.opacity.stroke),
    transform: [{ scale: components.transforms.scalePressed }],
  },
  goalOptionActivePressed: {
    backgroundColor: mode === 'light'
      ? colors.background.surfaceActive
      : toRgba(colors.accent.primary, colors.opacity.surface),
    borderColor: colors.accent.primary,
    transform: [{ scale: components.transforms.scalePressed }],
  },
  goalOptionText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  goalOptionTextActive: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontFamily: typography.fonts.interSemiBold,
  },
  guidedGoalSummaryBlock: {
    gap: components.layout.spacing.md,
  },
  goalSummaryCard: {
    gap: components.layout.spacing.sm,
  },
  goalSummaryLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  goalSummaryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.xs,
  },
  goalSummaryPill: {
    paddingVertical: components.layout.spacing.xs,
    paddingHorizontal: components.layout.spacing.sm,
    borderRadius: components.radius.pill,
    backgroundColor: colors.accent.primary,
  },
  goalSummaryPillText: {
    ...typography.styles.small,
    color: colors.text.onAccent,
    fontFamily: typography.fonts.interSemiBold,
  },
  goalInputSection: {
    gap: components.layout.spacing.sm,
  },
  goalGuidanceBlock: {
    gap: components.layout.spacing.xs,
  },
  goalGuidanceLabel: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  goalGuidanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.layout.spacing.xs,
  },
  goalGuidanceBullet: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  goalGuidanceText: {
    ...typography.styles.small,
    color: colors.text.secondary,
    flex: 1,
  },
  buildGoalFields: {
    gap: components.layout.spacing.md,
  },
  buildGoalField: {
    gap: components.layout.spacing.xs,
  },
  buildGoalFieldLabel: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  buildGoalInputWrap: {
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surfaceActive,
    paddingHorizontal: components.layout.spacing.sm,
  },
  buildGoalInput: {
    ...typography.styles.body,
    color: colors.text.primary,
    minHeight: components.sizes.input.minHeight,
    paddingVertical: components.layout.spacing.sm,
  },
  buildGoalPreview: {
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  buildGoalPreviewText: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  introExercisePrimarySection: {
    marginTop: components.layout.sectionGap,
    gap: components.layout.spacing.none,
  },
  exerciseInstruction: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  exerciseStatusText: {
    ...typography.styles.small,
    color: colors.text.primary,
    marginTop: components.layout.spacing.xs,
  },
  exerciseStatusCorrect: {
    color: colors.text.primary,
  },
  exerciseStatusWrong: {
    color: colors.text.primary,
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
    borderStyle: mode === 'dark' ? 'dashed' : 'solid',
    borderColor: colors.accent.primary,
    backgroundColor:
      mode === 'dark'
        ? toRgba(colors.background.surfaceActive, colors.opacity.surface)
        : colors.background.surface,
  },
  introSlotCorrect: {
    borderStyle: 'solid',
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor:
      mode === 'dark'
        ? toRgba(colors.background.surfaceActive, colors.opacity.surface)
        : colors.background.surface,
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
    backgroundColor: colors.text.secondary,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.text.secondary,
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
    color: colors.background.surface,
  },
  introSlotLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  introSlotStateIcon: {
    width: 18,
    height: 18,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  introSlotStateIconWrong: {
    backgroundColor: colors.accent.primary,
  },
  introSlotStateIconCorrect: {
    backgroundColor: colors.accent.primary,
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
    color: colors.text.primary,
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
  sequenceItemPressed: {
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    borderColor: toRgba(colors.text.primary, colors.opacity.stroke),
    transform: [{ scale: components.transforms.scalePressed }],
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
  ctaStatusText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  ctaStatusTextReady: {
    color: colors.accent.primary,
  },
  reflectionHeader: {
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.md,
  },
  reflectionKeyboard: {
    flex: 1,
  },
  reflectionContent: {
    gap: components.layout.spacing.lg,
  },
  reflectionActionWrap: {
    gap: components.layout.spacing.md,
  },
  reflectionActionWrapKeyboard: {
    paddingBottom: components.layout.spacing.md,
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
  reflectionTextAreaWrapFocused: {
    borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
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
    borderColor: mode === 'light' ? colors.accent.primary : colors.accent.primary,
    backgroundColor: mode === 'light'
      ? colors.accent.primary
      : toRgba(colors.background.surfaceActive, colors.opacity.surface),
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
    backgroundColor:
      mode === 'light'
        ? colors.background.surfaceActive
        : toRgba(colors.background.surfaceActive, colors.opacity.surface),
    borderColor:
      mode === 'light'
        ? colors.background.surfaceActive
        : colors.accent.primary,
  },
  summaryInsightNumber: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  summaryInsightNumberConfirmed: {
    color: mode === 'light' ? colors.text.primary : colors.accent.primary,
  },
  summaryInsightCheckBadge: {
    width: components.sizes.square.md,
    height: components.sizes.square.md,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      mode === 'light'
        ? colors.background.surfaceActive
        : colors.accent.primary,
    borderWidth: components.borderWidth.thin,
    borderColor:
      mode === 'light'
        ? colors.background.surfaceActive
        : colors.accent.primary,
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
  scenarioStoryHeader: {
    gap: 2,
  },
  scenarioStoryLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioStorySubtitle: {
    ...typography.styles.small,
    color: colors.text.secondary,
    marginTop: 0,
  },
  scenarioStoryText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioStoryTextUser: {
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
  scenarioOptionButtonActive: {
    borderColor: colors.accent.primary,
    backgroundColor: mode === 'light'
      ? colors.background.surfaceActive
      : toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  summaryOptionButtonActive: {
    backgroundColor: mode === 'light'
      ? colors.background.surfaceActive
      : toRgba(colors.background.surfaceActive, colors.opacity.surface),
  },
  scenarioOptionLabelActive: {
    color: colors.text.primary,
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
  scenarioRevealCardCorrect: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  summaryRevealCard: {
    backgroundColor: colors.background.surface,
  },
  scenarioRevealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  scenarioRevealIconBubble: {
    width: components.sizes.icon.lg,
    height: components.sizes.icon.lg,
    borderRadius: components.sizes.icon.lg / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.accent.primary,
  },
  scenarioRevealLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioRevealLabelKey: {
    color: colors.text.primary,
  },
  summaryRevealLabelKey: {
    color: colors.text.secondary,
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
  scenarioOptionCheckBadge: {
    width: components.sizes.square.sm,
    height: components.sizes.square.sm,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mode === 'light'
      ? colors.accent.primary
      : colors.accent.primary,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.accent.primary,
  },
  summaryOptionCheckBadge: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  scenarioOptionCheckBadgeLight: {
    borderColor: colors.background.surfaceActive,
  },

  // ─── Lesson 1 visualization: grid layout ────────────────────────────────────
  l1VisBody: {
    flex: 1,
    paddingTop: components.layout.spacing.xxl,
  },
  l1VisContent: {
    gap: components.layout.spacing.lg,
  },
  l1VisActionWrap: {
    marginTop: 'auto',
  },
  l1VisProgressWrap: {
    width: '100%',
    alignItems: 'center',
  },
  l1VisProgress: {
    width: '100%',
  },
  l1VisDotsWrap: {
    alignItems: 'center',
  },
  l1VisDots: {
    justifyContent: 'center',
  },
  l1VisHelperText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
  },
  l1VisHelperTextReady: {
    color: colors.accent.primary,
  },
  l1VisPagerWrap: {
    alignSelf: 'center',
    overflow: 'visible',
  },
  l1VisPagerList: {
    overflow: 'visible',
  },
  l1VisPagerTrack: {
    paddingTop: components.layout.spacing.none,
    paddingBottom: components.layout.spacing.xs,
  },
  l1VisPage: {
    paddingRight: components.layout.spacing.sm,
    paddingTop: components.layout.spacing.none,
    paddingBottom: components.layout.spacing.none,
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
  l1PageSubtle: {
    borderColor: toRgba(colors.ui.divider, 0.12),
    backgroundColor: toRgba(colors.background.surface, 0.94),
  },
  l1PageLocked: {
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: colors.background.surface,
  },
  l1BackPage: {
    backgroundColor: toRgba(colors.background.surfaceActive, 0.96),
  },
  l1BackContent: {
    flex: 1,
    gap: components.layout.spacing.sm,
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
  l1StepKickerSubtle: {
    color: toRgba(colors.text.secondary, 0.78),
  },
  l1CardLabel: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  l1CardLabelSubtle: {
    color: toRgba(colors.text.primary, 0.82),
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
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary,
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
  l1AnimStateSubtle: {
    opacity: 0.48,
    transform: [{ scale: 0.94 }],
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
  goalHouseHalo: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: toRgba(colors.accent.primary, 0.12),
  },
  goalHouseRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 38,
    borderRightWidth: 38,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: toRgba(colors.text.primary, 0.88),
    marginBottom: -2,
  },
  goalHouseBody: {
    width: 76,
    height: 58,
    borderRadius: 14,
    backgroundColor: toRgba(colors.background.surfaceActive, 0.94),
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  goalHouseFill: {
    width: '100%',
    backgroundColor: toRgba(colors.accent.primary, 0.22),
  },
  goalHouseBase: {
    width: 96,
    height: 6,
    borderRadius: 999,
    marginTop: 12,
    backgroundColor: toRgba(colors.ui.divider, 0.28),
  },
  goalCarInner: {
    width: 160,
    height: 60,
    position: 'relative',
  },
  goalCarTrack: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    width: 152,
    height: 2,
    borderRadius: 1,
    backgroundColor: toRgba(colors.ui.divider, 0.28),
  },
  goalCarTrackFill: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: toRgba(colors.accent.primary, 0.58),
  },
  goalCarDestMarker: {
    position: 'absolute',
    bottom: 3,
    left: 146,
    width: 2,
    height: 12,
    borderRadius: 1,
    backgroundColor: toRgba(colors.text.primary, 0.38),
  },
  goalCarUnit: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    alignItems: 'center',
  },
  goalCarRoof: {
    width: 22,
    height: 11,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: toRgba(colors.text.primary, 0.72),
    marginBottom: -2,
  },
  goalCarBody: {
    width: 54,
    height: 18,
    borderRadius: 8,
    backgroundColor: toRgba(colors.accent.primary, 0.82),
  },
  goalTravelInner: {
    width: 160,
    height: 80,
    position: 'relative',
  },
  goalTravelMarker: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: toRgba(colors.ui.divider, 0.45),
  },
  goalTravelDestMarker: {
    backgroundColor: toRgba(colors.accent.primary, 0.72),
  },
  goalTravelDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: toRgba(colors.accent.primary, 0.92),
  },
  goalCarSvgWrap: {
    position: 'absolute',
    left: 8,
    top: 0,
  },
  goalCarLottie: {
    width: '156%',
    height: '156%',
  },
  goalRetireBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  goalRetireBar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  goalRetireBarMuted: {
    backgroundColor: toRgba(colors.text.primary, 0.42),
  },
  goalRetireBarAccent: {
    backgroundColor: toRgba(colors.accent.primary, 0.72),
  },
  l1CtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  l1CtaPillLabel: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  l1CtaPillArrow: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  l1TapHint: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  l1TapHintLocked: {
    color: toRgba(colors.text.secondary, 0.92),
  },
  l1TapHintSubtle: {
    color: toRgba(colors.text.secondary, 0.68),
  },
  l1BackLabel: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
  },
  l1BackDetail: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  l1BackExample: {
    ...typography.styles.small,
    color: colors.text.secondary,
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
  l1RiskBuildSegment: {
    position: 'absolute',
    height: 2.5,
    borderRadius: 2,
    backgroundColor: toRgba(colors.text.primary, 0.88),
  },
  l1RiskCrashSegment: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FF3B30',
  },
  l1RiskChartDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // ─── Strategy animation ───────────────────────────────────────────────────────
  l1StratTipDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  // ─── Allocation animation ─────────────────────────────────────────────────────
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
  l1ExecScene: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  l1ExecPhone: {
    width: 36,
    height: 60,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: toRgba(colors.text.primary, 0.8),
    backgroundColor: toRgba(colors.text.primary, 0.06),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  l1ExecScreen: {
    width: 26,
    height: 44,
    borderRadius: 3,
    backgroundColor: toRgba(colors.text.primary, 0.08),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  l1ExecProgressTrack: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: toRgba(colors.text.primary, 0.15),
    overflow: 'hidden',
  },
  l1ExecProgressBar: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.primary,
  },
  l1ExecScreenFlash: {
    position: 'absolute',
    width: 26,
    height: 44,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
  },
  l1ExecCoin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    backgroundColor: toRgba(colors.accent.primary, 0.18),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -4,
    zIndex: 2,
  },
  l1ExecCoinLabel: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  l1ExecPulseRing: {
    position: 'absolute',
    width: 36,
    height: 60,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: toRgba(colors.accent.primary, 0.7),
  },
  // ─── Anchor concept step ──────────────────────────────────────────────────
  anchorStepBody: {
    gap: components.layout.spacing.xl,
  },
  bottomPinnedAnchorStepBody: {
    flex: 1,
    justifyContent: 'space-between',
    gap: components.layout.spacing.xl,
  },
  anchorCard: {
    borderRadius: components.radius.card,
    backgroundColor: colors.accent.primary,
    padding: components.layout.spacing.xl,
    gap: 12,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  anchorCardIcon: {
    width: 30,
    height: 30,
    borderRadius: components.radius.pill,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchorCardPunchline: {
    ...typography.styles.h2,
    color: colors.text.onAccent,
  },
  anchorContent: {
    gap: 12,
  },
  anchorForkContainer: {
    width: '100%',
  },
  anchorTiles: {
    flexDirection: 'row',
    gap: 12,
  },
  anchorTilesGrid: {
    flexWrap: 'wrap',
  },
  anchorTile: {
    flex: 1,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.card,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    gap: components.layout.spacing.xs,
  },
  anchorTileWide: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  anchorTileLabel: {
    ...typography.styles.stepLabel,
    color: colors.accent.primary,
  },
  anchorTileDetail: {
    ...typography.styles.small,
    color: colors.text.secondary,
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
