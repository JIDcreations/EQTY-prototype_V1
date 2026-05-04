import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import EqtyLogo from '../../components/EqtyLogo';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton, SecondaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionsScreen({ navigation, route }) {
  const { onboardingContext, updateOnboardingContext, updatePreferences, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const storedAnswers = onboardingContext?.onboardingAnswers || {};
  const [experienceAnswer, setExperienceAnswer] = useState(
    storedAnswers.q1 ?? onboardingContext?.experienceAnswer ?? ''
  );
  const [knowledgeAnswer, setKnowledgeAnswer] = useState(
    storedAnswers.q2 ?? onboardingContext?.knowledgeAnswer ?? ''
  );
  const [motivationAnswer, setMotivationAnswer] = useState(
    storedAnswers.q3 ?? onboardingContext?.motivationAnswer ?? ''
  );

  const handleReturn = async () => {
    if (route?.params?.setHasOnboardedOnExit) {
      await updatePreferences({ hasOnboarded: true });
    }
    if (route?.params?.exitToTabs) {
      return;
    }
    if (route?.params?.returnTo) {
      navigation.navigate(route.params.returnTo, route.params.returnParams || {});
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Tabs');
  };

  const handleSave = async () => {
    const nextAnswers = {
      q1: experienceAnswer.trim(),
      q2: knowledgeAnswer.trim(),
      q3: motivationAnswer.trim(),
    };
    await updateOnboardingContext({
      experienceAnswer: nextAnswers.q1,
      knowledgeAnswer: nextAnswers.q2,
      motivationAnswer: nextAnswers.q3,
      onboardingAnswers: nextAnswers,
      onboardingComplete: true,
    });
    await handleReturn();
  };

  return (
    <OnboardingScreen
      backgroundVariant="bg3"
      scroll
      contentContainerStyle={styles.scrollContent}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={components.layout.safeArea.top}
      >
        <View style={styles.layout}>
          <View style={styles.topRow}>
            <Pressable onPress={handleReturn} style={styles.backButton}>
              <Ionicons
                name="chevron-back"
                size={components.sizes.icon.lg}
                color={colors.text.secondary}
              />
            </Pressable>
            <EqtyLogo width={84} color={colors.text.primary} />
          </View>

          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText style={styles.badgeText}>{copy.questionsScreen.badge}</AppText>
              </View>
              <AppText style={styles.title}>{copy.questionsScreen.title}</AppText>
              <AppText style={styles.subtitle}>{copy.questionsScreen.subtitle}</AppText>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.label}>
                  {copy.question.questions.experienceAnswer}
                </AppText>
                <AppTextInput
                  value={experienceAnswer}
                  onChangeText={setExperienceAnswer}
                  placeholder={copy.question.placeholder}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>
                  {copy.question.questions.knowledgeAnswer}
                </AppText>
                <AppTextInput
                  value={knowledgeAnswer}
                  onChangeText={setKnowledgeAnswer}
                  placeholder={copy.question.placeholder}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>
                  {copy.question.questions.motivationAnswer}
                </AppText>
                <AppTextInput
                  value={motivationAnswer}
                  onChangeText={setMotivationAnswer}
                  placeholder={copy.question.placeholder}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <PrimaryButton label={copy.questionsScreen.primaryButton} onPress={handleSave} />
              <SecondaryButton
                label={copy.questionsScreen.secondaryButton}
                onPress={handleReturn}
              />
            </View>
          </OnboardingStackedCard>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
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

const createStyles = (colors, components) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xxl,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: components.layout.spacing.lg,
      paddingBottom: components.layout.spacing.md,
      gap: components.layout.spacing.lg,
    },
    topRow: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: components.sizes.input.minHeight,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: components.layout.spacing.none,
    },
    cardHeader: {
      gap: components.layout.spacing.sm,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.pill,
      paddingHorizontal: components.layout.spacing.sm,
      paddingVertical: components.layout.spacing.xs,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.border, colors.opacity.stroke),
    },
    badgeDot: {
      width: components.sizes.dot.xs,
      height: components.sizes.dot.xs,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
    badgeText: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    fields: {
      gap: components.layout.spacing.md,
    },
    field: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.multiline,
      ...components.input.text,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      textAlignVertical: 'top',
    },
    actions: {
      gap: components.layout.spacing.sm,
    },
  });
