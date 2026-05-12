import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

export default function SegmentedControl({ options, value, onChange }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <AppText style={[styles.segmentText, isActive && styles.segmentTextActive]}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.input,
      padding: components.layout.spacing.xs,
      gap: components.layout.spacing.xs,
    },
    segment: {
      flex: 1,
      paddingVertical: components.layout.spacing.xs,
      borderRadius: Math.max(0, components.radius.input - components.layout.spacing.xs),
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: colors.accent.primary,
    },
    segmentText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    segmentTextActive: {
      color: colors.text.onAccent,
    },
  });
