import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';
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

export default function SettingsAccountScreen({ navigation }) {
  const { authUser, updateAuthUser, preferences } = useApp();
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
  const toast = useToast();
  const [activeField, setActiveField] = useState(null);
  const [username, setUsername] = useState(authUser?.username || '');
  const [email, setEmail] = useState(authUser?.email || '');

  useEffect(() => {
    if (!activeField) {
      setUsername(authUser?.username || '');
      setEmail(authUser?.email || '');
    }
  }, [activeField, authUser]);

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();
  const hasUsernameChange = trimmedUsername !== (authUser?.username || '');
  const hasEmailChange = trimmedEmail !== (authUser?.email || '');
  const hasChanges = hasUsernameChange || hasEmailChange;
  const saveDisabled =
    !hasChanges ||
    (hasUsernameChange && !trimmedUsername) ||
    (hasEmailChange && !trimmedEmail);

  const handleCancel = () => {
    setUsername(authUser?.username || '');
    setEmail(authUser?.email || '');
    setActiveField(null);
  };

  const handleSave = async () => {
    const updates = {};
    if (hasUsernameChange) updates.username = trimmedUsername;
    if (hasEmailChange) updates.email = trimmedEmail;
    if (Object.keys(updates).length) {
      await updateAuthUser(updates);
      toast.show(settingsCopy.saved);
    }
    setActiveField(null);
  };

  const renderField = ({
    key,
    label,
    value,
    placeholder,
    onChangeText,
    inputProps,
  }) => {
    if (activeField === key) {
      const shouldCollapse = !hasChanges;
      return (
        <View style={styles.inlineField}>
          <AppText style={styles.label}>{label}</AppText>
          <AppTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text.secondary}
            style={styles.input}
            onBlur={() => {
              if (shouldCollapse) setActiveField(null);
            }}
            {...inputProps}
          />
        </View>
      );
    }

    const displayValue = value?.trim() ? value.trim() : settingsCopy.account.emptyValue;
    return (
      <View style={styles.inlineField}>
        <AppText style={styles.label}>{label}</AppText>
        <Pressable
          onPress={() => setActiveField(key)}
          style={styles.valueRow}
        >
          <AppText style={styles.valueText}>{displayValue}</AppText>
          <Ionicons
            name="pencil-outline"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <View style={styles.layout}>
          <View style={styles.topContent}>
            <SettingsHeader
              title={settingsCopy.account.title}
              subtitle={settingsCopy.account.subtitle}
              onBack={() => navigation.goBack()}
            />
            <View style={styles.section}>
              {renderField({
                key: 'username',
                label: settingsCopy.account.usernameLabel,
                value: username,
                placeholder: settingsCopy.account.usernamePlaceholder,
                onChangeText: setUsername,
              })}
              {renderField({
                key: 'email',
                label: settingsCopy.account.emailLabel,
                value: email,
                placeholder: settingsCopy.account.emailPlaceholder,
                onChangeText: setEmail,
                inputProps: {
                  keyboardType: 'email-address',
                  autoCapitalize: 'none',
                },
              })}
              <SettingsRow
                label={settingsCopy.account.resetPasswordLabel}
                onPress={() => navigation.navigate('ChangePassword')}
                labelNumberOfLines={1}
                isLast
                containerStyle={styles.rowCard}
              />
            </View>
          </View>
          <View style={styles.actions}>
            <PrimaryButton
              label={settingsCopy.account.saveChanges}
              onPress={handleSave}
              disabled={saveDisabled}
            />
            <SecondaryButton label={settingsCopy.account.cancel} onPress={handleCancel} />
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
      gap: components.layout.spacing.md,
    },
    rowCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      marginTop: components.layout.spacing.md,
    },
    inlineField: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    valueRow: {
      ...components.input.container,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    valueText: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
