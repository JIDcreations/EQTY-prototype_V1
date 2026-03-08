import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

export default function SurfacePillButton({
  label,
  onPress,
  onPressIn,
  onPressOut,
  style,
  labelStyle,
  disabled = false,
  labelNumberOfLines = 1,
  ellipsizeMode = 'tail',
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <AppText
        style={[styles.label, disabled && styles.labelDisabled, labelStyle]}
        numberOfLines={labelNumberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    button: {
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.xs,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    buttonPressed: {
      opacity: colors.opacity.emphasis,
    },
    buttonDisabled: {
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.stroke),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    label: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    labelDisabled: {
      color: colors.text.secondary,
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
