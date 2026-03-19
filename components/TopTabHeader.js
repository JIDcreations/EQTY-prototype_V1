import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { typography, useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function TopTabHeader({
  title,
  subtitle,
  subtitleStyle,
  onBack,
  onPressProfile,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.iconButton}
            hitSlop={components.layout.spacing.sm}
          >
            <Ionicons
              name="chevron-back"
              size={components.sizes.icon.lg}
              color={colors.text.primary}
            />
          </Pressable>
        ) : null}
        <View style={styles.titleWrap}>
          <AppText style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
        </View>
        {onPressProfile ? (
          <Pressable
            onPress={onPressProfile}
            style={styles.iconButton}
            hitSlop={components.layout.spacing.sm}
          >
            <Ionicons
              name="person-outline"
              size={components.sizes.icon.lg}
              color={colors.text.primary}
            />
          </Pressable>
        ) : null}
        {!onPressProfile && onBack ? <View style={styles.iconSpacer} /> : null}
      </View>
      {subtitle ? (
        <AppText style={[styles.subtitle, subtitleStyle]}>{subtitle}</AppText>
      ) : null}
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      gap: components.layout.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    titleWrap: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    iconButton: {
      flexShrink: 0,
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    iconSpacer: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      flexShrink: 0,
    },
  });
