import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import { PrimaryButton } from '../../components/Button';
import OnboardingScreen from '../../components/OnboardingScreen';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';

export default function OnboardingWhatIsEqtyScreen({ navigation }) {
  const { updatePreferences, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const normalizedLanguage = String(preferences?.language || '').toLowerCase();
  const isDutch =
    normalizedLanguage === 'nl' ||
    normalizedLanguage.includes('dutch') ||
    normalizedLanguage.includes('neder');
  const title = 'Beleggen als een proces';
  const subtitle =
    'Equity begeleidt je stap voor stap door de kennis en afwegingen die voorafgaan aan elke belegging.\nElk thema behandelt een essentieel onderdeel van dat proces.';
  const ctaLabel = isDutch ? 'Account aanmaken' : 'Create account';

  const handleCreateAccount = async () => {
    await updatePreferences({ hasOnboarded: false });
    navigation.navigate('OnboardingEmail');
  };

  return (
    <OnboardingScreen
      backgroundVariant="bg3"
      showGlow={false}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={components.sizes.icon.lg}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>
        <View style={styles.logoWrap}>
          <AppText style={styles.logo}>EQTY</AppText>
        </View>
        <View style={styles.copyBlock}>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.subtitle}>{subtitle}</AppText>
        </View>
        <View style={styles.actions}>
          <PrimaryButton
            label={ctaLabel}
            onPress={handleCreateAccount}
          />
        </View>
      </View>
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
    screen: {
      paddingBottom: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    header: {
      position: 'absolute',
      top: components.layout.spacing.sm,
      left: components.layout.spacing.none,
      right: components.layout.spacing.none,
      zIndex: 1,
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
      position: 'relative',
    },
    logoWrap: {
      marginTop: components.layout.spacing.xxl,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logo: {
      ...typography.styles.display,
      color: colors.text.primary,
    },
    copyBlock: {
      width: '100%',
      gap: components.layout.spacing.sm,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
      textAlign: 'left',
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
      textAlign: 'left',
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
