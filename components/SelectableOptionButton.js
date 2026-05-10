import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

export default function SelectableOptionButton({
  label,
  onPress,
  accessory,
  state = 'default',
  disabled = false,
  style,
  labelStyle,
}) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, mode), [colors, mode]);
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';
  const isDimmed = state === 'dimmed';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isIncorrect && styles.buttonIncorrect,
        isCorrect && styles.buttonCorrect,
        isDimmed && styles.buttonDimmed,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      <AppText
        style={[
          styles.label,
          isIncorrect && styles.labelIncorrect,
          isCorrect && styles.labelCorrect,
          isDimmed && styles.labelDimmed,
          labelStyle,
        ]}
      >
        {label}
      </AppText>
      {accessory}
    </Pressable>
  );
}

const createStyles = (colors, mode) =>
  StyleSheet.create({
    button: {
      height: 64,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    buttonPressed: {
      opacity: 0.65,
      borderColor: toRgba(colors.text.primary, 0.35),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    buttonIncorrect: {
      borderColor: toRgba(colors.text.primary, 0.35),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    buttonCorrect: {
      borderColor: colors.accent.primary,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    buttonDimmed: {
      borderColor: toRgba(colors.ui.divider, 0.15),
      backgroundColor: toRgba(colors.background.surface, 0.35),
    },
    label: {
      ...typography.styles.body,
      flex: 1,
      color: colors.text.primary,
    },
    labelIncorrect: {
      color: colors.text.primary,
    },
    labelCorrect: {
      color: colors.text.primary,
    },
    labelDimmed: {
      color: toRgba(colors.text.secondary, 0.5),
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
