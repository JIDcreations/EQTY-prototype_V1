import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SegmentedControl from '../components/SegmentedControl';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import {
  getAppearanceOptions,
  getLanguageOptions,
  getSettingsCopy,
} from '../utils/localization';
import useToast from '../utils/useToast';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SettingsPreferencesScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const toast = useToast();
  const options = useMemo(
    () => getLanguageOptions(preferences?.language),
    [preferences?.language]
  );
  const appearanceOptions = useMemo(
    () => getAppearanceOptions(preferences?.language),
    [preferences?.language]
  );
  const settingsCopy = useMemo(
    () => getSettingsCopy(preferences?.language),
    [preferences?.language]
  );

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <SettingsHeader
          title={settingsCopy.preferences.title}
          subtitle={settingsCopy.preferences.subtitle}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.block}>
          <AppText style={styles.cardTitle}>{settingsCopy.preferences.languageLabel}</AppText>
          <View style={styles.languageList}>
            {options.map((option) => {
              const isActive = preferences?.language === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    updatePreferences({ language: option.value });
                    toast.show(settingsCopy.saved);
                  }}
                  style={[styles.languageRow, isActive && styles.languageRowActive]}
                >
                  <View style={styles.rowLeft}>
                    <View style={[styles.radio, isActive && styles.radioActive]}>
                      {isActive ? <View style={styles.radioDot} /> : null}
                    </View>
                    <AppText style={styles.rowLabel}>{option.label}</AppText>
                  </View>
                  {isActive ? (
                    <AppText style={styles.activeLabel}>{settingsCopy.selected}</AppText>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.appearanceBlock}>
          <AppText style={styles.cardTitle}>{settingsCopy.preferences.appearanceLabel}</AppText>
          <View style={styles.appearanceContainer}>
            <SegmentedControl
              options={appearanceOptions}
              value={preferences?.appearance || 'Dark'}
              onChange={(next) => {
                updatePreferences({ appearance: next });
                toast.show(settingsCopy.saved);
              }}
            />
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
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    block: {
      gap: components.layout.spacing.sm,
    },
    cardTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    languageList: {
      gap: components.layout.spacing.sm,
    },
    languageRow: {
      ...components.input.container,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    languageRowActive: {
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
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
    appearanceBlock: {
      gap: components.layout.spacing.sm,
    },
    appearanceContainer: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.xs,
    },
  });
