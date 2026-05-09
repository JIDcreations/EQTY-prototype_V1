import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getLanguageOptions, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingLanguageScreen({ navigation, route }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const options = useMemo(
    () => getLanguageOptions(preferences?.language),
    [preferences?.language]
  );
  const [selected, setSelected] = useState(preferences?.language || 'Dutch');

  const nextRoute = route?.params?.nextRoute || 'OnboardingEntry';

  const handleContinue = async () => {
    await updatePreferences({ language: selected });
    navigation.navigate(nextRoute);
  };

  return (
    <OnboardingScreen
      backgroundVariant="bg3"
      contentContainerStyle={styles.screen}
      showGlow={false}
    >
      <View style={styles.layout}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons
                  name="chevron-back"
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
              </Pressable>
              <AppText style={styles.headerTitle}>{copy.language.title}</AppText>
            </View>
            <AppText style={styles.subtitle}>{copy.language.subtitle}</AppText>
          </View>
        </View>

        <View style={styles.contentBlock}>
          <View style={styles.list}>
            {options.map((option) => {
              const isActive = selected === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSelected(option.value)}
                  style={[styles.row, isActive && styles.rowActive]}
                >
                  <View style={styles.rowLeft}>
                    <View style={[styles.radio, isActive && styles.radioActive]}>
                      {isActive ? <View style={styles.radioDot} /> : null}
                    </View>
                    <AppText style={styles.rowLabel}>{option.label}</AppText>
                  </View>
                  {isActive ? (
                    <AppText style={styles.activeLabel}>{copy.language.selected}</AppText>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={copy.language.button}
              onPress={handleContinue}
              style={styles.primaryButton}
            />
          </View>
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
      flex: 1,
      paddingBottom: components.layout.spacing.none,
    },
    layout: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
    header: {
      gap: components.layout.spacing.none,
      paddingTop: components.layout.spacing.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    titleBlock: {
      gap: components.layout.spacing.xs,
    },
    headerTitle: {
      ...typography.styles.h1,
      color: colors.text.primary,
      textAlign: 'left',
      flex: 1,
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
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'left',
    },
    list: {
      gap: components.layout.cardGap,
      marginTop: components.layout.spacing.sm,
    },
    row: {
      ...components.input.container,
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    rowActive: {
      borderColor: colors.accent.primary,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      flex: 1,
    },
    rowLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    activeLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
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
    actions: {
      gap: components.layout.spacing.md,
    },
    primaryButton: {
      paddingVertical: components.layout.spacing.md,
      minHeight: components.sizes.input.minHeight,
    },
    contentBlock: {
      flex: 1,
      justifyContent: 'space-between',
      gap: components.layout.spacing.lg,
    },
  });
