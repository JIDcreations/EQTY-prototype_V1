import React, { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { PrimaryButton } from '../components/Button';
import { useTheme } from '../theme';
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

const SETTINGS_CATEGORIES = [
  {
    key: 'account',
    route: 'SettingsAccount',
  },
  {
    key: 'security',
    route: 'SettingsSecurity',
  },
  {
    key: 'preferences',
    route: 'SettingsPreferences',
  },
  {
    key: 'accessibility',
    route: 'SettingsAccessibility',
  },
  {
    key: 'support',
    route: 'SettingsSupport',
  },
];

export default function SettingsHomeScreen({ navigation }) {
  const { logOut, preferences } = useApp();
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

  const handleLogOut = () => {
    Alert.alert(settingsCopy.settingsHome.logoutAlertTitle, settingsCopy.settingsHome.logoutAlertMessage, [
      { text: settingsCopy.settingsHome.logoutAlertCancel, style: 'cancel' },
      {
        text: settingsCopy.settingsHome.logoutAlertConfirm,
        style: 'destructive',
        onPress: async () => {
          await logOut();
        },
      },
    ]);
  };

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <View style={styles.layout}>
        <View style={styles.topContent}>
          <SettingsHeader
            title={settingsCopy.settingsHome.title}
            subtitle={settingsCopy.settingsHome.subtitle}
            onBack={() => navigation.goBack()}
          />
          <View style={styles.section}>
            {SETTINGS_CATEGORIES.map((item) => (
              <SettingsRow
                key={item.key}
                label={settingsCopy.settingsHome.categories[item.key]?.label || item.key}
                subtitle={settingsCopy.settingsHome.categories[item.key]?.subtitle}
                subtitleNumberOfLines={item.key === 'account' ? 1 : undefined}
                onPress={() => navigation.navigate(item.route)}
                isLast
                containerStyle={styles.rowCard}
              />
            ))}
          </View>
        </View>
        <PrimaryButton
          label={settingsCopy.settingsHome.logoutButton}
          onPress={handleLogOut}
          style={styles.logoutButton}
        />
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    content: {
      ...getSettingsOnboardingContentStyle(components, tabBarHeight),
      flexGrow: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'space-between',
    },
    topContent: {
      gap: components.layout.contentGap,
    },
    section: {
      gap: components.layout.spacing.sm,
    },
    rowCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    logoutButton: {
      marginTop: components.layout.spacing.sm,
    },
  });
