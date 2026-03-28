import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingEmailScreen({ navigation }) {
  const { updateAuthUser, updatePreferences, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleContinue = async () => {
    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    const trimmed = email.trim();
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
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons
                name="chevron-back"
                size={components.sizes.icon.lg}
                color={colors.text.secondary}
              />
            </Pressable>
            <AppText style={styles.headerTitle}>{copy.email.title}</AppText>
          </View>

          <View style={styles.contentBlock}>
            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.nameLabel}>{copy.email.usernameLabel}</AppText>
                <AppTextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder={copy.email.usernamePlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.emailLabel}</AppText>
                <AppTextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={copy.email.emailPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.passwordLabel}</AppText>
                <View style={styles.inputRow}>
                  <AppTextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={copy.email.passwordPlaceholder}
                    placeholderTextColor={colors.text.secondary}
                    secureTextEntry={!showPassword}
                    style={styles.inputField}
                  />
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    style={styles.eyeButton}
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

            <View style={styles.actions}>
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
                <Pressable onPress={handleApple} style={styles.socialButton}>
                  <Ionicons
                    name="logo-apple"
                    size={components.sizes.icon.md}
                    color={colors.background.app}
                  />
                  <AppText style={styles.socialText}>{copy.email.socialApple}</AppText>
                </Pressable>
                <Pressable onPress={handleGoogle} style={styles.socialButton}>
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
                  style={styles.linkInline}
                >
                  <AppText style={styles.loginLink}>{copy.email.link}</AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
      backgroundColor: colors.background.app,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    fields: {
      gap: components.layout.cardGap,
    },
    field: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...components.input.label,
    },
    nameLabel: {
      ...components.input.helper,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
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
    },
    hint: {
      ...components.input.helper,
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
    socialText: {
      ...typography.styles.small,
      color: colors.background.app,
    },
    linkInline: {
      paddingTop: components.layout.spacing.sm,
    },
    loginLink: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
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
