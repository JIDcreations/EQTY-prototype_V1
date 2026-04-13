import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OnboardingScreen from '../components/OnboardingScreen';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getPremiumCopy } from '../utils/localization';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function PremiumScreen() {
  const navigation = useNavigation();
  const { preferences, unlockPremium } = useApp();
  const { colors, components, mode } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const copy = useMemo(() => getPremiumCopy(preferences?.language), [preferences?.language]);
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );

  const handleUnlock = () => {
    unlockPremium();
    navigation.goBack();
  };

  return (
    <OnboardingScreen
      backgroundVariant={mode === 'dark' ? 'bg2' : 'whiteNoBlur'}
      showGlow={false}
      contentContainerStyle={styles.content}
    >
      {/* Back button */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons
          name="chevron-back"
          size={components.sizes.icon.lg}
          color={colors.text.primary}
        />
      </Pressable>

      <View style={styles.body}>
        {/* Icon badge */}
        <View style={styles.badgeWrapper}>
          <View
            style={[
              styles.badgeGlow,
              { backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint) },
            ]}
          />
          <View style={[styles.badge, { backgroundColor: colors.accent.primary }]}>
            <AppText style={[styles.badgeIcon, { color: colors.text.onAccent }]}>★</AppText>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <AppText style={[styles.title, { color: colors.text.primary }]}>
            {copy.title}
          </AppText>
          <AppText style={[styles.subtitle, { color: colors.text.secondary }]}>
            {copy.subtitle}
          </AppText>
        </View>

        {/* Benefits */}
        <View
          style={[
            styles.benefitsCard,
            {
              backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
              borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
            },
          ]}
        >
          {copy.benefits.map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons
                name="checkmark"
                size={components.sizes.icon.sm}
                color={colors.accent.primary}
              />
              <AppText style={[styles.benefitText, { color: colors.text.primary }]}>
                {benefit}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View
          style={[
            styles.priceCard,
            {
              backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
              borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
            },
          ]}
        >
          <AppText style={[styles.priceNote, { color: colors.text.secondary }]}>
            {copy.priceNote}
          </AppText>
        </View>
        <PrimaryButton label={copy.cta} onPress={handleUnlock} style={styles.ctaButton} />
        <Pressable style={styles.dismissAction} onPress={() => navigation.goBack()}>
          <AppText style={[styles.dismissLabel, { color: colors.text.secondary }]}>
            {copy.dismiss}
          </AppText>
        </Pressable>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.xl,
      flex: 1,
      justifyContent: 'space-between',
    },

    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },

    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: components.layout.spacing.xl,
    },

    // Badge
    badgeWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeGlow: {
      position: 'absolute',
      width: 108,
      height: 108,
      borderRadius: components.radius.pill,
    },
    badge: {
      width: 68,
      height: 68,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeIcon: {
      ...typography.styles.h1,
      lineHeight: 34,
    },

    // Hero
    hero: {
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      paddingHorizontal: components.layout.spacing.md,
    },
    title: {
      ...typography.styles.display,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.styles.body,
      textAlign: 'center',
    },

    // Benefits card
    benefitsCard: {
      width: '100%',
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      paddingVertical: components.layout.spacing.md,
      paddingHorizontal: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    benefitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    benefitText: {
      ...typography.styles.body,
      flex: 1,
    },

    // Footer
    footer: {
      gap: components.layout.spacing.md,
      width: '100%',
      alignItems: 'stretch',
    },
    priceCard: {
      width: '100%',
      maxWidth: components.sizes.button.ctaPageWidth,
      alignSelf: 'center',
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      paddingVertical: components.layout.spacing.sm,
      paddingHorizontal: components.layout.spacing.lg,
    },
    priceNote: {
      ...typography.styles.small,
      textAlign: 'center',
    },
    ctaButton: {
      width: '100%',
      maxWidth: components.sizes.button.ctaPageWidth,
      alignSelf: 'center',
    },
    dismissAction: {
      paddingVertical: components.layout.spacing.xs,
      paddingHorizontal: components.layout.spacing.md,
      alignSelf: 'center',
    },
    dismissLabel: {
      ...typography.styles.small,
    },
  });
