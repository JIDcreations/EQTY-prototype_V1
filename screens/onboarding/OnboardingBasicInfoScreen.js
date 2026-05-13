import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import EqtyLogo from '../../components/EqtyLogo';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingBasicInfoScreen({ navigation }) {
  const { updateAuthUser, updatePreferences, preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components, mode), [colors, components, mode]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (trimmed) {
      await updateAuthUser({ username: trimmed, name: trimmed, birthdate: birthdate.trim() });
    }
    await updatePreferences({ hasOnboarded: true });
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
      >
        <View style={styles.layout}>
          <View style={styles.topArea}>
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons
                  name="chevron-back"
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
              </Pressable>
              <EqtyLogo width={84} color={colors.text.primary} />
            </View>
          </View>

          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText style={styles.badgeText}>{copy.basicInfo.badge}</AppText>
              </View>
              <AppText style={styles.title}>{copy.basicInfo.title}</AppText>
              <AppText style={styles.subtitle}>{copy.basicInfo.subtitle}</AppText>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.basicInfo.nameLabel}</AppText>
                <AppTextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={copy.basicInfo.namePlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.basicInfo.birthLabel}</AppText>
                <AppTextInput
                  value={birthdate}
                  onChangeText={setBirthdate}
                  placeholder={copy.basicInfo.birthPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  style={styles.input}
                />
              </View>
            </View>

            <PrimaryButton label={copy.basicInfo.button} onPress={handleContinue} />
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

const createStyles = (colors, components, mode) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: components.layout.safeArea.bottom,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: components.layout.spacing.lg,
      paddingBottom: components.layout.spacing.none,
    },
    topArea: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    topRow: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: components.layout.spacing.md,
      minHeight: components.sizes.input.minHeight,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      borderWidth: mode === 'light' ? components.borderWidth.thin : 0,
      borderColor: mode === 'light' ? toRgba(colors.ui.divider, 0.35) : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: components.layout.spacing.none,
    },
    cardHeader: {
      gap: components.layout.spacing.xs,
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
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
  });
