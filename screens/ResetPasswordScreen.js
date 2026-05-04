import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsOnboardingContentStyle } from '../utils/settingsLayout';
import useToast from '../utils/useToast';

export default function ResetPasswordScreen({ navigation }) {
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
  const resetCopy = settingsCopy.resetPassword;
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSend = () => {
    toast.show(resetCopy.sentToast);
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <OnboardingScreen
          scroll
          backgroundVariant="bg3"
          contentContainerStyle={styles.content}
          showGlow={false}
        >
          <SettingsHeader
            title={resetCopy.title}
            subtitle={resetCopy.subtitle}
            onBack={() => navigation.goBack()}
          />
          <View style={styles.section}>
            <View style={styles.field}>
              <AppText style={styles.label}>{resetCopy.emailLabel}</AppText>
              <AppTextInput
                value={email}
                onChangeText={setEmail}
                placeholder={resetCopy.emailPlaceholder}
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <AppText style={styles.hint}>{resetCopy.hint}</AppText>
          </View>
          <View style={styles.actions}>
            <PrimaryButton
              label={resetCopy.sendResetLink}
              onPress={handleSend}
              disabled={!email.trim()}
            />
            <SecondaryButton label={resetCopy.cancel} onPress={() => navigation.goBack()} />
          </View>
        </OnboardingScreen>
      </KeyboardAvoidingView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
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

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      ...getSettingsOnboardingContentStyle(components, tabBarHeight),
    },
    section: {
      gap: components.layout.spacing.sm,
    },
    field: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...components.input.label,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    hint: {
      ...components.input.helper,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
