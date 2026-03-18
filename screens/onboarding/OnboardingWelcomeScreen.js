import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import { PrimaryButton, SecondaryButton } from '../../components/Button';
import OnboardingScreen from '../../components/OnboardingScreen';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingWelcomeScreen({ navigation }) {
  const { preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  const handleCreateAccount = () => navigation.navigate('OnboardingWhatIsEqty');

  return (
    <OnboardingScreen
      backgroundVariant={mode === 'dark' ? 'bg2' : 'whiteNoBlur'}
      showGlow={false}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <AppText style={styles.logo}>EQTY</AppText>
        </View>
        <View style={styles.copyBlock}>
          <AppText style={styles.title}>{copy.welcome.title}</AppText>
          <AppText style={styles.subtitle}>{copy.welcome.subtitle}</AppText>
        </View>
        <View style={styles.actions}>
          <PrimaryButton
            label={copy.welcome.primaryCta}
            onPress={handleCreateAccount}
          />
          <SecondaryButton
            label={copy.welcome.secondaryCta}
            onPress={() => navigation.navigate('OnboardingLogin')}
            style={styles.secondaryButton}
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
    secondaryButton: {
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
  });
