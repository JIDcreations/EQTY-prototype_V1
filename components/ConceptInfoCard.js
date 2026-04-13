import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import Card from './Card';
import { typography, useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ConceptInfoCard({
  iconName = 'ellipse-outline',
  label,
  detail,
  style,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={iconName}
            size={16}
            color={colors.accent.primary}
          />
        </View>
        <AppText style={styles.label}>{label}</AppText>
      </View>
      <AppText style={styles.detail}>{detail}</AppText>
    </Card>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    card: {
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      gap: components.layout.spacing.xs,
      padding: components.layout.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: toRgba(colors.accent.primary, 0.12),
    },
    label: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    detail: {
      ...typography.styles.meta,
      color: colors.text.secondary,
    },
  });
