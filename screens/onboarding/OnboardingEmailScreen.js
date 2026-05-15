import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { validateEmailAddress } from '../../utils/emailValidation';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingEmailScreen({ navigation }) {
  const { updateAuthUser, updatePreferences, preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, mode),
    [colors, components, mode]
  );
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const emailShake = useSharedValue(0);
  const emailValidation = useMemo(() => validateEmailAddress(email), [email]);
  const showEmailError = emailTouched && !emailValidation.isValid;
  const emailErrorMessage = useMemo(() => {
    if (!showEmailError) {
      return '';
    }

    if (emailValidation.reason === 'required') {
      return copy.email.emailRequired;
    }

    if (emailValidation.reason === 'typo' && emailValidation.suggestion) {
      return copy.email.emailTypo.replace('{email}', emailValidation.suggestion);
    }

    return copy.email.emailInvalid;
  }, [copy.email.emailInvalid, copy.email.emailRequired, copy.email.emailTypo, emailValidation, showEmailError]);
  const emailShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: emailShake.value }],
  }));

  const triggerEmailErrorFeedback = () => {
    emailShake.value = 0;
    emailShake.value = withSequence(
      withTiming(-8, { duration: 45 }),
      withTiming(7, { duration: 55 }),
      withTiming(-5, { duration: 55 }),
      withTiming(4, { duration: 55 }),
      withTiming(0, { duration: 45 })
    );
  };

  const handleContinue = async () => {
    const nextEmailValidation = validateEmailAddress(email);
    if (!nextEmailValidation.isValid) {
      setEmailTouched(true);
      triggerEmailErrorFeedback();
      return;
    }

    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    const trimmed = nextEmailValidation.normalizedEmail;
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    }
    if (trimmed) {
      await updateAuthUser({ email: trimmed });
    }
    navigation.navigate('OnboardingWhatIsEqty');
  };

  const handleApple = async () => {
    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    }
    navigation.navigate('OnboardingWhatIsEqty');
  };

  const handleGoogle = async () => {
    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    }
    navigation.navigate('OnboardingWhatIsEqty');
  };

  const loginLinkParts = splitFooterLink(copy.email.link);

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
            <AppText style={styles.headerTitle}>{copy.email.title}</AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(70).duration(220)} style={styles.contentBlock}>
            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.nameLabel}>{copy.email.usernameLabel}</AppText>
                <AppTextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder={copy.email.usernamePlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  style={[styles.input, focusedField === 'username' && styles.inputFocused]}
                />
              </View>
              <Animated.View style={[styles.field, emailShakeStyle]}>
                <AppText style={[styles.label, showEmailError && styles.labelError]}>
                  {copy.email.emailLabel}
                </AppText>
                <AppTextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setEmailTouched(true)}
                  placeholder={copy.email.emailPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => {
                    setFocusedField(null);
                    setEmailTouched(true);
                  }}
                  style={[
                    styles.input,
                    focusedField === 'email' && styles.inputFocused,
                    showEmailError && styles.inputError,
                  ]}
                />
                {showEmailError ? (
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
                    <AppText style={styles.errorText}>{emailErrorMessage}</AppText>
                  </Animated.View>
                ) : null}
              </Animated.View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.passwordLabel}</AppText>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === 'password' && styles.inputRowFocused,
                  ]}
                >
                  <AppTextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={copy.email.passwordPlaceholder}
                    placeholderTextColor={colors.text.secondary}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
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
                <AppText style={styles.hint}>{copy.email.passwordHint}</AppText>
              </View>
            </View>

            <Animated.View entering={FadeInDown.delay(140).duration(220)} style={styles.actions}>
              <PrimaryButton
                label={copy.email.button}
                onPress={handleContinue}
                style={styles.primaryButton}
              />
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>{copy.email.divider}</AppText>
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
                  <AppText style={styles.socialText}>{copy.email.socialApple}</AppText>
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
                  <AppText style={styles.socialText}>{copy.email.socialGoogle}</AppText>
                </Pressable>
              </View>
              <View style={styles.footer}>
                <Pressable
                  onPress={() => navigation.navigate('OnboardingLogin')}
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
    labelError: {
      color: colors.feedback.error,
    },
    screen: {
      flex: 1,
      paddingBottom: components.layout.spacing.none,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
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
    nameLabel: {
      ...components.input.helper,
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
    hint: {
      ...components.input.helper,
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
    primaryButton: {
      paddingVertical: components.layout.spacing.md,
      minHeight: components.sizes.input.minHeight,
    },
    contentBlock: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
  });
