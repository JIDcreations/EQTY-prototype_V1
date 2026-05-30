import React, { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton } from '../components/Button';
import SegmentedControl from '../components/SegmentedControl';
import SettingsRow from '../components/SettingsRow';
import SettingsSection from '../components/SettingsSection';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

const APPEARANCE_OPTIONS = [
  { label: 'Dark', value: 'Dark' },
  { label: 'Light', value: 'Light' },
  { label: 'System', value: 'System' },
];

const TEXT_SIZE_OPTIONS = [
  { label: 'Default', value: 'Default' },
  { label: 'Comfort', value: 'Comfort' },
  { label: 'Large', value: 'Large' },
];

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ProfileOverviewScreen() {
  const navigation = useNavigation();
  const { authUser, preferences, updatePreferences, logOut } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const toast = useToast();

  const handleLogOut = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logOut();
        },
      },
    ]);
  };

  const renderTextSizeOption = (option, index) => {
    const isActive = preferences?.textSize === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() => {
          if (!isActive) {
            updatePreferences({ textSize: option.value });
            toast.show('Saved');
          }
        }}
        style={({ pressed }) => [
          styles.textSizeRow,
          index !== TEXT_SIZE_OPTIONS.length - 1 && styles.rowDivider,
          isActive && styles.textSizeRowActive,
          pressed && !isActive && styles.textSizeRowPressed,
          pressed && isActive && styles.textSizeRowActivePressed,
        ]}
      >
        <View style={styles.textSizeLeft}>
          <View style={[styles.radio, isActive && styles.radioActive]}>
            {isActive ? <View style={styles.radioDot} /> : null}
          </View>
          <AppText style={styles.textSizeLabel}>{option.label}</AppText>
        </View>
        <AppText
          style={[
            styles.textSizeSample,
            option.value === 'Comfort' && styles.textSizeSampleComfort,
            option.value === 'Large' && styles.textSizeSampleLarge,
          ]}
        >
          Aa
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={styles.title}>Profile</AppText>
          <AppText style={styles.subtitle}>Account & preferences</AppText>
        </View>

        <SettingsSection title="Account">
          <Card style={styles.card}>
            <SettingsRow
              label="Username"
              value={authUser?.username || '—'}
              onPress={() => navigation.navigate('EditUsername')}
            />
            <SettingsRow
              label="Email address"
              value={authUser?.email || '—'}
              onPress={() => navigation.navigate('EditEmail')}
              isLast
            />
          </Card>
        </SettingsSection>

        <SettingsSection title="Security">
          <Card style={styles.card}>
            <SettingsRow
              label="Reset password"
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <SettingsRow
              label="Two-factor authentication"
              subtitle="Extra security for your account"
              value="Off"
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
            />
            <AppText style={styles.inlineHint}>Coming later</AppText>
          </Card>
        </SettingsSection>

        <SettingsSection title="Preferences">
          <Card style={styles.card}>
            <SettingsRow
              label="Language"
              value={preferences?.language || 'Dutch'}
              onPress={() => navigation.navigate('Language')}
              isLast
            />
          </Card>
          <Card style={styles.card}>
            <AppText style={styles.cardTitle}>Appearance</AppText>
            <SegmentedControl
              options={APPEARANCE_OPTIONS}
              value={preferences?.appearance || 'Dark'}
              onChange={(next) => {
                updatePreferences({ appearance: next });
                toast.show('Saved');
              }}
            />
          </Card>
        </SettingsSection>

        <SettingsSection title="Accessibility">
          <Card style={styles.card}>
            <View style={styles.textSizeHeader}>
              <AppText style={styles.cardTitle}>Text size</AppText>
              <AppText style={styles.cardSubtitle}>Adjust text size for better readability</AppText>
            </View>
            <View style={styles.textSizeList}>
              {TEXT_SIZE_OPTIONS.map(renderTextSizeOption)}
            </View>
            <View style={styles.previewCard}>
              <AppText style={styles.previewTitle}>Preview</AppText>
              <AppText style={styles.previewText}>
                Investing is a long-term journey. Adjust the text size to match your comfort.
              </AppText>
            </View>
          </Card>
        </SettingsSection>

        <SettingsSection title="Help & support">
          <Card style={styles.card}>
            <SettingsRow
              label="Help center"
              showChevron
            />
            <SettingsRow
              label="Contact support"
              showChevron
            />
            <SettingsRow label="FAQ" showChevron isLast />
          </Card>
        </SettingsSection>

        <PrimaryButton label="Log out" onPress={handleLogOut} style={styles.logoutButton} />
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      ...components.screen.containerScroll,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.safeArea.bottom,
    },
    header: {
      gap: components.layout.spacing.xs,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    card: {
      gap: components.layout.cardGap,
    },
    inlineHint: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    cardTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    cardSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    textSizeHeader: {
      gap: components.layout.spacing.xs,
    },
    textSizeList: {
      borderRadius: components.radius.card,
      overflow: 'hidden',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    textSizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...components.list.row,
      paddingHorizontal: components.layout.spacing.lg,
      backgroundColor: colors.background.surfaceActive,
    },
    textSizeRowActive: {
      borderWidth: components.borderWidth.thin,
      borderColor: colors.accent.primary,
      borderRadius: components.radius.input,
    },
    textSizeRowPressed: {
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      transform: [{ scale: components.transforms.scalePressed }],
    },
    textSizeRowActivePressed: {
      transform: [{ scale: components.transforms.scalePressed }],
      opacity: colors.opacity.emphasis,
    },
    rowDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    textSizeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    textSizeLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    textSizeSample: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    textSizeSampleComfort: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    textSizeSampleLarge: {
      ...typography.styles.h2,
      color: colors.text.secondary,
    },
    radio: {
      width: components.sizes.track.sm,
      height: components.sizes.track.sm,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: colors.accent.primary,
    },
    radioDot: {
      width: components.sizes.dot.sm,
      height: components.sizes.dot.sm,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
    previewCard: {
      backgroundColor: colors.background.surfaceActive,
      padding: components.layout.spacing.md,
      borderRadius: components.radius.card,
      gap: components.layout.spacing.xs,
    },
    previewTitle: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    previewText: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    logoutButton: {
      marginTop: components.layout.spacing.sm,
    },
  });
