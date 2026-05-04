import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import EqtyLogo from '../components/EqtyLogo';
import OnboardingScreen from '../components/OnboardingScreen';
import OnboardingStackedCard from '../components/OnboardingStackedCard';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getOnboardingCopy } from '../utils/localization';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function OnboardingRequiredScreen({ navigation, route }) {
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const entrySource = route?.params?.entrySource;

  const handleExit = () => {
    if (entrySource === 'Lessons') {
      navigation.navigate('Tabs', { screen: 'Lessons' });
      return;
    }
    if (entrySource === 'Home') {
      navigation.navigate('Tabs', { screen: 'Home' });
      return;
    }
    navigation.goBack();
  };

  return (
    <OnboardingScreen>
      <View style={styles.layout}>
        <View style={styles.topRow}>
          <Pressable onPress={handleExit} style={styles.backButton}>
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
              <AppText style={styles.badgeText}>{copy.gate.badge}</AppText>
            </View>
            <AppText style={styles.title}>{copy.gate.title}</AppText>
            <AppText style={styles.subtitle}>{copy.gate.subtitle}</AppText>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={copy.gate.primaryButton}
              onPress={() =>
                navigation.navigate({
                  name: 'OnboardingQuestionExperience',
                  params: {
                    returnTo: 'Tabs',
                    returnParams:
                      entrySource === 'Lessons'
                        ? { screen: 'Lessons' }
                        : { screen: 'Home' },
                  },
                  merge: true,
                })
              }
            />
            <SecondaryButton
              label={copy.gate.secondaryButton}
              onPress={handleExit}
            />
          </View>
        </OnboardingStackedCard>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    layout: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: components.layout.spacing.lg,
      paddingBottom: components.layout.spacing.md,
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
    actions: {
      gap: components.layout.spacing.sm,
    },
  });
