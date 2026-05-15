import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingLoginScreen({ navigation }) {
  const { updateAuthUser, updatePreferences, preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components, mode), [colors, components, mode]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const passwordShake = useSharedValue(0);
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();
  const passwordErrorMessage = useMemo(() => {
    if (!passwordTouched || trimmedPassword) {
      return '';
    }

    return copy.login.passwordRequired;
  }, [copy.login.passwordRequired, passwordTouched, trimmedPassword]);
  const showPasswordError = Boolean(passwordErrorMessage);
  const passwordShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: passwordShake.value }],
  }));

  const triggerShake = (shakeValue) => {
    shakeValue.value = 0;
    shakeValue.value = withSequence(
      withTiming(-8, { duration: 45 }),
      withTiming(7, { duration: 55 }),
      withTiming(-5, { duration: 55 }),
      withTiming(4, { duration: 55 }),
      withTiming(0, { duration: 45 })
    );
  };

  const handleDone = async () => {
    const nextPasswordError = !trimmedPassword ? copy.login.passwordRequired : '';

    if (nextPasswordError) {
      setPasswordTouched(true);
      triggerShake(passwordShake);
      return;
    }

    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    } else {
      await updateAuthUser({});
    }
    await updatePreferences({ hasOnboarded: true });
  };

  const handleApple = async () => {
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    } else {
      await updateAuthUser({});
    }
    await updatePreferences({ hasOnboarded: true });
  };

  const handleGoogle = async () => {
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    } else {
      await updateAuthUser({});
    }
    await updatePreferences({ hasOnboarded: true });
  };

  const loginLinkParts = splitFooterLink(copy.login.link);

  return (
    <OnboardingScreen
      backgroundVariant="bg3"
      contentContainerStyle={styles.screen}
      showGlow={false}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.layout}>
          <Animated.View entering={FadeInDown.duration(220)} style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={components.sizes.icon.lg}
                color={colors.text.secondary}
              />
            </Pressable>
            <AppText style={styles.headerTitle}>{copy.login.title}</AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(70).duration(220)} style={styles.contentBlock}>
            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.login.usernameLabel}</AppText>
                <AppTextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder={copy.login.usernamePlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  style={[styles.input, focusedField === 'username' && styles.inputFocused]}
                />
              </View>
              <Animated.View style={[styles.field, passwordShakeStyle]}>
                <AppText style={[styles.label, showPasswordError && styles.labelError]}>
                  {copy.login.passwordLabel}
                </AppText>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === 'password' && styles.inputRowFocused,
                    showPasswordError && styles.inputError,
                  ]}
                >
                  <AppTextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => {
                      setFocusedField(null);
                      setPasswordTouched(true);
                    }}
                    placeholder={copy.login.passwordPlaceholder}
                    placeholderTextColor={colors.text.secondary}
                    secureTextEntry={!showPassword}
                    style={styles.inputField}
                  />
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    style={({ pressed }) => [
                      styles.eyeButton,
                      pressed && styles.utilityButtonPressed,
                    ]}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={components.sizes.icon.sm}
                      color={colors.text.secondary}
                    />
                  </Pressable>
                </View>
                {showPasswordError ? (
                  <Animated.View
                    entering={FadeInDown.duration(180)}
                    exiting={FadeOutUp.duration(120)}
                    style={styles.errorRow}
                  >
                    <Ionicons
                      name="alert-circle"
                      size={components.sizes.icon.sm}
                      color={colors.feedback.error}
                    />
                    <AppText style={styles.errorText}>{passwordErrorMessage}</AppText>
                  </Animated.View>
                ) : null}
                <Pressable
                  onPress={() => navigation.navigate('ResetPassword')}
                  style={({ pressed }) => [
                    styles.forgotLinkPressable,
                    pressed && styles.inlineLinkPressed,
                  ]}
                >
                  <AppText numberOfLines={1} style={styles.forgotLink}>
                    {copy.login.forgotPassword}
                  </AppText>
                </Pressable>
              </Animated.View>
            </View>

            <Animated.View entering={FadeInDown.delay(140).duration(220)} style={styles.actions}>
              <PrimaryButton
                label={copy.login.button}
                onPress={handleDone}
              />
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>{copy.login.divider}</AppText>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.socialRow}>
                <Pressable
                  onPress={handleApple}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.socialButtonPressed,
                  ]}
                >
                  <Ionicons
                    name="logo-apple"
                    size={components.sizes.icon.md}
                    color={colors.background.app}
                  />
                  <AppText style={styles.socialText}>{copy.login.socialApple}</AppText>
                </Pressable>
                <Pressable
                  onPress={handleGoogle}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.socialButtonPressed,
                  ]}
                >
                  <Ionicons
                    name="logo-google"
                    size={components.sizes.icon.md}
                    color={colors.background.app}
                  />
                  <AppText style={styles.socialText}>{copy.login.socialGoogle}</AppText>
                </Pressable>
              </View>
              <View style={styles.footer}>
                <Pressable
                  onPress={() => navigation.navigate('OnboardingEmail')}
                  style={({ pressed }) => [
                    styles.linkInline,
                    pressed && styles.inlineLinkPressed,
                  ]}
                >
                  <AppText style={styles.loginLink}>
                    {loginLinkParts.prefix}
                    {loginLinkParts.prefix ? ' ' : ''}
                    <AppText style={styles.loginLinkUnderline}>{loginLinkParts.cta}</AppText>
                  </AppText>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

function splitFooterLink(text) {
  const separatorIndex = text.lastIndexOf('?');
  if (separatorIndex === -1) {
    return { prefix: '', cta: text };
  }

  return {
    prefix: text.slice(0, separatorIndex + 1),
    cta: text.slice(separatorIndex + 1).trim(),
  };
}

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components, mode) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
    contentBlock: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
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
      backgroundColor: mode === 'light' ? colors.background.surface : colors.background.app,
      borderWidth: components.borderWidth.thin,
      borderColor:
        mode === 'light'
          ? toRgba(colors.ui.divider, 0.35)
          : toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    backButtonPressed: {
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      borderColor: toRgba(colors.text.primary, colors.opacity.stroke),
      transform: [{ scale: components.transforms.scalePressed }],
    },
    fields: {
      gap: components.layout.cardGap,
    },
    field: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...components.input.label,
      color: colors.text.primary,
    },
    labelError: {
      color: colors.feedback.error,
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
    inputRow: {
      ...components.input.container,
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      height: components.layout.spacing.md * 2 + typography.styles.body.lineHeight,
      minHeight: components.layout.spacing.md * 2 + typography.styles.body.lineHeight,
      paddingVertical: components.layout.spacing.none,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    inputRowFocused: {
      borderColor: toRgba(colors.accent.primary, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    inputField: {
      ...components.input.text,
      flex: 1,
      paddingVertical: components.layout.spacing.none,
      paddingHorizontal: components.layout.spacing.none,
    },
    eyeButton: {
      width: components.sizes.square.md,
      height: components.sizes.square.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: components.radius.pill,
    },
    utilityButtonPressed: {
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      transform: [{ scale: components.transforms.scalePressed }],
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: components.layout.spacing.xs,
      paddingLeft: components.layout.spacing.xs,
    },
    errorText: {
      ...components.input.helper,
      color: colors.feedback.error,
      flex: 1,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      paddingVertical: components.layout.spacing.sm,
    },
    dividerLine: {
      flex: 1,
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    dividerText: {
      ...typography.styles.meta,
      color: colors.text.secondary,
    },
    socialRow: {
      flexDirection: 'row',
      gap: components.layout.spacing.sm,
    },
    socialButton: {
      flex: 1,
      paddingVertical: components.layout.spacing.xs,
      paddingHorizontal: components.layout.spacing.sm,
      borderRadius: components.radius.input,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: colors.text.primary,
      minHeight: components.sizes.input.minHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: components.layout.spacing.sm,
    },
    socialButtonPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    socialText: {
      ...typography.styles.small,
      color: colors.background.app,
    },
    forgotLink: {
      ...typography.styles.small,
      color: colors.text.secondary,
      alignSelf: 'flex-start',
    },
    forgotLinkPressable: {
      marginTop: components.layout.spacing.xs,
      alignSelf: 'flex-start',
      borderRadius: components.radius.pill,
      paddingHorizontal: components.layout.spacing.xs,
      paddingVertical: components.layout.spacing.xs / 2,
    },
    linkInline: {
      paddingTop: components.layout.spacing.sm,
      borderRadius: components.radius.pill,
      paddingHorizontal: components.layout.spacing.sm,
      paddingBottom: components.layout.spacing.xs,
    },
    inlineLinkPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    loginLink: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    loginLinkUnderline: {
      textDecorationLine: 'underline',
    },
    footer: {
      paddingTop: components.layout.spacing.sm,
      alignItems: 'center',
    },
  });
