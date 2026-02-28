import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';
import { getSettingsCopy } from '../utils/localization';

export default function SettingsPersonalContextScreen({ navigation }) {
  const { onboardingContext, updateOnboardingContext, preferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const settingsCopy = useMemo(
    () => getSettingsCopy(preferences?.language),
    [preferences?.language]
  );
  const personalCopy = settingsCopy.personalContext;
  const toast = useToast();
  const [experienceAnswer, setExperienceAnswer] = useState(
    onboardingContext?.experienceAnswer || ''
  );
  const [knowledgeAnswer, setKnowledgeAnswer] = useState(
    onboardingContext?.knowledgeAnswer || ''
  );
  const [motivationAnswer, setMotivationAnswer] = useState(
    onboardingContext?.motivationAnswer || ''
  );

  const storedExperience = onboardingContext?.experienceAnswer || '';
  const storedKnowledge = onboardingContext?.knowledgeAnswer || '';
  const storedMotivation = onboardingContext?.motivationAnswer || '';

  const hasChanges =
    experienceAnswer.trim() !== storedExperience.trim() ||
    knowledgeAnswer.trim() !== storedKnowledge.trim() ||
    motivationAnswer.trim() !== storedMotivation.trim();

  const handleCancel = () => {
    setExperienceAnswer(storedExperience);
    setKnowledgeAnswer(storedKnowledge);
    setMotivationAnswer(storedMotivation);
  };

  const handleSave = async () => {
    await updateOnboardingContext({
      experienceAnswer: experienceAnswer.trim(),
      knowledgeAnswer: knowledgeAnswer.trim(),
      motivationAnswer: motivationAnswer.trim(),
    });
    toast.show(settingsCopy.saved);
  };

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <SettingsHeader
          title={personalCopy.title}
          subtitle={personalCopy.subtitle}
          onBack={() => navigation.goBack()}
        />
        <View style={[styles.questionBlock, styles.questionDivider]}>
          <AppText style={styles.questionLabel}>{personalCopy.questions[0].label}</AppText>
          <AppText style={styles.question}>{personalCopy.questions[0].prompt}</AppText>
          <AppTextInput
            value={experienceAnswer}
            onChangeText={setExperienceAnswer}
            placeholder={personalCopy.questions[0].placeholder}
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={[styles.questionBlock, styles.questionDivider]}>
          <AppText style={styles.questionLabel}>{personalCopy.questions[1].label}</AppText>
          <AppText style={styles.question}>{personalCopy.questions[1].prompt}</AppText>
          <AppTextInput
            value={knowledgeAnswer}
            onChangeText={setKnowledgeAnswer}
            placeholder={personalCopy.questions[1].placeholder}
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.questionBlock}>
          <AppText style={styles.questionLabel}>{personalCopy.questions[2].label}</AppText>
          <AppText style={styles.question}>{personalCopy.questions[2].prompt}</AppText>
          <AppTextInput
            value={motivationAnswer}
            onChangeText={setMotivationAnswer}
            placeholder={personalCopy.questions[2].placeholder}
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.noteCard}>
          <AppText style={styles.noteText}>
            {personalCopy.note}
          </AppText>
        </View>

        {hasChanges ? (
          <View style={styles.actions}>
            <SecondaryButton
              label={personalCopy.cancel}
              onPress={handleCancel}
              style={styles.flex}
            />
            <PrimaryButton
              label={personalCopy.saveChanges}
              onPress={handleSave}
              style={styles.flex}
            />
          </View>
        ) : null}
      </OnboardingScreen>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    questionBlock: {
      gap: components.layout.spacing.sm,
    },
    questionDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      paddingBottom: components.layout.spacing.lg,
      marginBottom: components.layout.spacing.lg,
    },
    questionLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    question: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.multiline,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      textAlignVertical: 'top',
    },
    noteCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.md,
    },
    noteText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    actions: {
      flexDirection: 'row',
      gap: components.layout.spacing.sm,
    },
    flex: {
      flex: 1,
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
