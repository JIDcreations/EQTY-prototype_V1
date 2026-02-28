import React, { useContext, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
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
  const toast = useToast();

  const handleSend = () => {
    toast.show(resetCopy.sentToast);
    setTimeout(() => navigation.goBack(), 500);
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
            <AppText style={styles.headerTitle}>{resetCopy.title}</AppText>
          </View>

          <View style={styles.contentBlock}>
            <View style={styles.fields}>
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
          </View>
        </View>
      </KeyboardAvoidingView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
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

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      paddingBottom: tabBarHeight,
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
      gap: components.layout.spacing.none,
    },
    headerTitle: {
      ...typography.styles.h1,
      color: colors.text.primary,
      textAlign: 'left',
      marginTop: components.layout.spacing.xxl,
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
