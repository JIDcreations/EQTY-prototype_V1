import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy, getTextSizeOptions } from '../utils/localization';
import { getSettingsOnboardingContentStyle } from '../utils/settingsLayout';
import useToast from '../utils/useToast';

export default function SettingsAccessibilityScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const toast = useToast();
  const settingsCopy = useMemo(
    () => getSettingsCopy(preferences?.language),
    [preferences?.language]
  );
  const textSizeOptions = useMemo(
    () => getTextSizeOptions(preferences?.language),
    [preferences?.language]
  );

  const renderTextSizeOption = (option) => {
    const isActive = preferences?.textSize === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() => {
          updatePreferences({ textSize: option.value });
          toast.show(settingsCopy.saved);
        }}
        style={[styles.textSizeRow, isActive && styles.textSizeRowActive]}
      >
        <View style={styles.textSizeLeft}>
          <View style={[styles.radio, isActive && styles.radioActive]}>
            {isActive ? <View style={styles.radioDot} /> : null}
          </View>
          <AppText style={styles.textSizeLabel}>{option.label}</AppText>
        </View>
        <AppText
          style={[
            styles.textSizeSample,
            option.value === 'Comfort' && styles.textSizeSampleComfort,
            option.value === 'Large' && styles.textSizeSampleLarge,
          ]}
        >
          Aa
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <SettingsHeader
          title={settingsCopy.accessibility.title}
          subtitle={settingsCopy.accessibility.subtitle}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.section}>
          <View style={styles.textSizeList}>{textSizeOptions.map(renderTextSizeOption)}</View>
          <View style={styles.previewCard}>
            <AppText style={styles.previewTitle}>{settingsCopy.accessibility.previewTitle}</AppText>
            <AppText style={styles.previewText}>
              {settingsCopy.accessibility.previewText}
            </AppText>
          </View>
        </View>
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
      ...getSettingsOnboardingContentStyle(components, tabBarHeight),
    },
    section: {
      gap: components.layout.spacing.lg,
    },
    textSizeList: {
      gap: components.layout.spacing.sm,
    },
    textSizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    textSizeRowActive: {
      borderColor: colors.accent.primary,
    },
    textSizeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    textSizeLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    textSizeSample: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    textSizeSampleComfort: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    textSizeSampleLarge: {
      ...typography.styles.h2,
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
    previewCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      gap: components.layout.spacing.xs,
    },
    previewTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    previewText: {
      ...typography.styles.body,
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
