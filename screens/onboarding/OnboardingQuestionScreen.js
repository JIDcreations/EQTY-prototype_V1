import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import SelectableOptionButton from '../../components/SelectableOptionButton';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import {
  formatOnboardingQuestionLabel,
  getLocaleKey,
  getOnboardingCopy,
} from '../../utils/localization';

const QUESTION_VARIANTS = {
  en: {
    experienceAnswer: {
      title: 'Choose what feels closest to your situation',
      selectionMode: 'single',
      options: [
        'Never invested before',
        'Looked into it a bit',
        'Invested before',
      ],
    },
    knowledgeAnswer: {
      title: 'What already sounds familiar?',
      selectionMode: 'multi',
      options: [
        'Stocks',
        'ETFs',
        'Spreading risk',
        'Long-term investing',
        'Honestly no idea',
      ],
    },
  },
  nl: {
    experienceAnswer: {
      title: 'Kies wat het dichtst bij jouw situatie ligt',
      selectionMode: 'single',
      options: [
        'Nog nooit geinvesteerd',
        'Al wat opgezocht',
        'Al eens geinvesteerd',
      ],
    },
    knowledgeAnswer: {
      title: 'Wat klinkt jou al bekend?',
      selectionMode: 'multi',
      options: [
        'Aandelen',
        "ETF's",
        'Risico spreiden',
        'Lange termijn investeren',
        'Geen van deze bovenste',
      ],
    },
  },
};

export default function OnboardingQuestionScreen({ navigation, route }) {
  const { question, field, step, total, nextRoute, isLast, returnTo, returnParams, exitToTabs, setHasOnboardedOnComplete } =
    route.params;
  const { onboardingContext, updateOnboardingContext, updatePreferences, updateAuthUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const locale = getLocaleKey(preferences?.language);
  const questionVariant = QUESTION_VARIANTS[locale]?.[field] || QUESTION_VARIANTS.en[field] || null;
  const [answer, setAnswer] = useState(() =>
    getInitialAnswer(onboardingContext?.[field], questionVariant)
  );
  const localizedQuestion = questionVariant?.title || copy.question.questions[field] || question;
  const primaryLabel = isLast ? copy.question.finishButton : copy.question.button;
  const canContinue = questionVariant
    ? questionVariant.selectionMode === 'multi'
      ? answer.length > 0
      : Boolean(answer)
    : true;

  const handleNext = async () => {
    const trimmed = serializeAnswer(answer, questionVariant).trim();
    const updates = { [field]: trimmed };
    if (isLast) {
      updates.onboardingComplete = true;
    }
    await updateOnboardingContext(updates);
    if (isLast) {
      if (setHasOnboardedOnComplete) {
        await updatePreferences({ hasOnboarded: true });
      }
      if (returnTo) {
        navigation.navigate(returnTo, returnParams || {});
        return;
      }
      if (exitToTabs || setHasOnboardedOnComplete) {
        await updateAuthUser({});
        navigation.navigate('Tabs', { screen: 'Home' });
        return;
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      navigation.navigate('Tabs', { screen: 'Home' });
      return;
    }
    navigation.navigate({
      name: nextRoute,
      params: {
        returnTo,
        returnParams,
        exitToTabs,
        setHasOnboardedOnComplete,
      },
      merge: true,
    });
  };

  const handleSelectOption = (optionLabel) => {
    if (!questionVariant) return;
    if (questionVariant.selectionMode === 'multi') {
      setAnswer((current) =>
        current.includes(optionLabel)
          ? current.filter((item) => item !== optionLabel)
          : [...current, optionLabel]
      );
      return;
    }
    setAnswer(optionLabel);
  };

  return (
    <OnboardingScreen backgroundVariant="bg3" contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={components.layout.safeArea.top}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={components.sizes.icon.lg}
              color={colors.text.secondary}
            />
          </Pressable>
          <OnboardingProgress
            current={step}
            total={total}
            label={formatOnboardingQuestionLabel(preferences?.language, step)}
            style={styles.progress}
          />
        </View>
        <View style={styles.contentBlock}>
          <View style={styles.content}>
            <AppText style={styles.title}>{localizedQuestion}</AppText>
            {questionVariant ? (
              <View style={styles.optionList}>
                {questionVariant.options.map((optionLabel) => {
                  const isSelected =
                    questionVariant.selectionMode === 'multi'
                      ? answer.includes(optionLabel)
                      : answer === optionLabel;

                  return (
                    <SelectableOptionButton
                      key={optionLabel}
                      label={optionLabel}
                      onPress={() => handleSelectOption(optionLabel)}
                      state={isSelected ? 'correct' : 'default'}
                      accessory={
                        <View style={[styles.radio, isSelected && styles.radioActive]}>
                          {isSelected ? <View style={styles.radioDot} /> : null}
                        </View>
                      }
                      style={styles.optionButton}
                    />
                  );
                })}
              </View>
            ) : (
              <AppTextInput
                value={answer}
                onChangeText={setAnswer}
                placeholder={copy.question.placeholder}
                placeholderTextColor={colors.text.secondary}
                multiline
                style={styles.input}
              />
            )}
          </View>
          <PrimaryButton
            label={primaryLabel}
            onPress={handleNext}
            style={styles.primaryButton}
            disabled={!canContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

function getInitialAnswer(value, questionVariant) {
  const storedValue = typeof value === 'string' ? value.trim() : '';
  if (!questionVariant) return storedValue;
  if (questionVariant.selectionMode === 'multi') {
    if (!storedValue) return [];
    const tokens = storedValue
      .split(/,|\n|•/)
      .map((item) => item.trim())
      .filter(Boolean);
    return questionVariant.options.filter((option) => tokens.includes(option));
  }
  return questionVariant.options.includes(storedValue) ? storedValue : '';
}

function serializeAnswer(value, questionVariant) {
  if (!questionVariant) return value;
  if (questionVariant.selectionMode === 'multi') {
    return questionVariant.options.filter((option) => value.includes(option)).join(', ');
  }
  return value;
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
    screen: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.app,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {
      flex: 1,
    },
    contentBlock: {
      flex: 1,
      justifyContent: 'space-between',
      gap: components.layout.spacing.xxl,
    },
    content: {
      gap: components.layout.spacing.lg,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    optionList: {
      gap: components.layout.spacing.sm,
    },
    optionButton: {
      height: 64,
      paddingVertical: components.layout.spacing.none,
    },
    radio: {
      width: components.sizes.track.sm,
      height: components.sizes.track.sm,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: colors.accent.primary,
    },
    radioDot: {
      width: components.sizes.dot.sm,
      height: components.sizes.dot.sm,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.multiline,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      textAlignVertical: 'top',
    },
    primaryButton: {
      paddingVertical: components.layout.spacing.md,
      minHeight: components.sizes.input.minHeight,
    },
  });
