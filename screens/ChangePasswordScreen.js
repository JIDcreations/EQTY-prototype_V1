import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsScrollContentStyle } from '../utils/settingsLayout';
import useToast from '../utils/useToast';

export default function ChangePasswordScreen({ navigation }) {
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
  const passwordCopy = settingsCopy.changePassword;
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const toast = useToast();
  const forgotPasswordParts = splitFooterLink(passwordCopy.forgotPasswordCta);

  const hasMismatch = confirmPassword.length > 0 && nextPassword !== confirmPassword;
  const canSave =
    currentPassword.trim().length > 0 &&
    nextPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    !hasMismatch;

  const handleSave = () => {
    toast.show(settingsCopy.saved);
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.layout}>
          <View style={styles.topContent}>
            <SettingsHeader
              title={passwordCopy.title}
              subtitle={passwordCopy.subtitle}
              onBack={() => navigation.goBack()}
            />
            <View style={styles.section}>
              <View style={styles.field}>
                <AppText style={styles.label}>{passwordCopy.currentPasswordLabel}</AppText>
                <AppTextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder={passwordCopy.currentPasswordPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry
                  style={[styles.input, focusedField === 'currentPassword' && styles.inputFocused]}
                  onFocus={() => setFocusedField('currentPassword')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{passwordCopy.newPasswordLabel}</AppText>
                <AppTextInput
                  value={nextPassword}
                  onChangeText={setNextPassword}
                  placeholder={passwordCopy.newPasswordPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry
                  style={[styles.input, focusedField === 'nextPassword' && styles.inputFocused]}
                  onFocus={() => setFocusedField('nextPassword')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{passwordCopy.confirmPasswordLabel}</AppText>
                <AppTextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={passwordCopy.confirmPasswordPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry
                  style={[
                    styles.input,
                    focusedField === 'confirmPassword' && styles.inputFocused,
                    hasMismatch && styles.inputInvalid,
                  ]}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                />
                {hasMismatch ? (
                  <AppText style={[styles.helperText, styles.helperTextError]}>
                    {passwordCopy.passwordMismatch}
                  </AppText>
                ) : focusedField === 'confirmPassword' || confirmPassword.length > 0 ? (
                  <AppText style={styles.helperText}>{passwordCopy.confirmPasswordHelper}</AppText>
                ) : null}
              </View>
              <Pressable
                onPress={() => navigation.navigate('ResetPassword')}
                style={({ pressed }) => [
                  styles.forgotRow,
                  pressed && styles.forgotRowPressed,
                ]}
              >
                <AppText style={styles.forgotText}>
                  {forgotPasswordParts.prefix}
                  {forgotPasswordParts.prefix ? ' ' : ''}
                  <AppText style={styles.forgotTextUnderline}>{forgotPasswordParts.cta}</AppText>
                </AppText>
              </Pressable>
            </View>
          </View>
          <View style={styles.actions}>
            <PrimaryButton
              label={passwordCopy.saveChanges}
              onPress={handleSave}
              disabled={!canSave}
            />
            <SecondaryButton label={passwordCopy.cancel} onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
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

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      ...components.screen.containerScroll,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      ...getSettingsScrollContentStyle(components, tabBarHeight),
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
      borderColor: colors.accent.primary,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    inputInvalid: {
      borderColor: colors.feedback.error,
    },
    helperText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    helperTextError: {
      color: colors.feedback.error,
    },
    forgotRow: {
      alignSelf: 'flex-start',
      marginTop: components.layout.spacing.xs,
    },
    forgotRowPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    forgotText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    forgotTextUnderline: {
      textDecorationLine: 'underline',
    },
    actions: {
      gap: components.layout.spacing.md,
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
