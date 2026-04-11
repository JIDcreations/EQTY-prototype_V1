import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { typography, useTheme } from '../theme';

export default function ReflectionResultCard({
  answer,
  insightLabel,
  insightText,
  style,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <View style={[styles.card, style]}>
      <AppText style={styles.answerText}>{answer}</AppText>
      <View style={styles.divider} />
      <View style={styles.insightBlock}>
        <AppText style={styles.insightLabel}>{insightLabel}</AppText>
        <AppText style={styles.insightText}>{insightText}</AppText>
      </View>
    </View>
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
    card: {
      borderRadius: components.radius.card,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    answerText: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    divider: {
      height: components.borderWidth.thin,
      backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    insightBlock: {
      gap: components.layout.spacing.xs,
    },
    insightLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    insightText: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
  });
