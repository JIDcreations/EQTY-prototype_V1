import React, { useContext, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { validateEmailAddress } from '../utils/emailValidation';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsOnboardingContentStyle } from '../utils/settingsLayout';
import useToast from '../utils/useToast';

export default function ResetPasswordScreen({ navigation }) {
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useContext(BottomTabBarHeightContext) || 0;
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
  const [emailTouched, setEmailTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();
  const emailValidation = useMemo(() => validateEmailAddress(email), [email]);
  const showEmailError = emailTouched && !emailValidation.isValid;
  const canSend = !isSending && emailValidation.isValid;
  const helperText = showEmailError ? resetCopy.emailInvalid : resetCopy.hint;

  const handleSend = async () => {
    if (!emailValidation.isValid) {
      setEmailTouched(true);
      return;
    }
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    toast.show(resetCopy.sentToast);
    setIsSending(false);
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
          <View style={styles.layout}>
            <Animated.View entering={FadeInDown.duration(220)} style={styles.topContent}>
              <SettingsHeader
                title={resetCopy.title}
                subtitle={resetCopy.subtitle}
                onBack={() => navigation.goBack()}
              />
              <Animated.View entering={FadeInDown.delay(70).duration(220)} style={styles.section}>
                <View style={styles.field}>
                  <AppText style={styles.label}>{resetCopy.emailLabel}</AppText>
                  <AppTextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setIsFocused(false);
                      setEmailTouched(true);
                    }}
                    placeholder={resetCopy.emailPlaceholder}
                    placeholderTextColor={colors.text.secondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      isFocused && styles.inputFocused,
                      showEmailError && styles.inputError,
                    ]}
                  />
                </View>
                <Animated.View
                  key={showEmailError ? 'error' : 'hint'}
                  entering={FadeInDown.duration(180)}
                  exiting={FadeOutUp.duration(120)}
                >
                  <AppText style={[styles.hint, showEmailError && styles.hintError]}>{helperText}</AppText>
                </Animated.View>
              </Animated.View>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(140).duration(220)} style={styles.actions}>
              <PrimaryButton
                label={isSending ? resetCopy.sendingResetLink : resetCopy.sendResetLink}
                onPress={handleSend}
                disabled={!canSend}
              />
              <SecondaryButton label={resetCopy.cancel} onPress={() => navigation.goBack()} />
            </Animated.View>
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
    inputFocused: {
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    inputError: {
      borderColor: colors.feedback.error,
      backgroundColor: toRgba(colors.feedback.error, colors.opacity.tint),
    },
    hint: {
      ...components.input.helper,
    },
    hintError: {
      color: colors.feedback.error,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
