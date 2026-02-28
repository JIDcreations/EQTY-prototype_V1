import React, { useMemo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsOnboardingContentStyle } from '../utils/settingsLayout';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SettingsSecurityScreen({ navigation }) {
  const { preferences } = useApp();
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

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <SettingsHeader
        title={settingsCopy.security.title}
        subtitle={settingsCopy.security.subtitle}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.section}>
        <SettingsRow
          label={settingsCopy.security.twoFactorLabel}
          right={
            <Switch
              value={false}
              disabled
              trackColor={{
                false: colors.background.surface,
                true: colors.accent.primary,
              }}
              thumbColor={colors.background.app}
            />
          }
          isLast
          disabled
          containerStyle={styles.rowCard}
        />
        <AppText style={styles.inlineHint}>{settingsCopy.common.comingLater}</AppText>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    content: {
      ...getSettingsOnboardingContentStyle(components, tabBarHeight),
    },
    section: {
      gap: components.layout.spacing.sm,
    },
    rowCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    inlineHint: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
