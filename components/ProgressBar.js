import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

export default function ProgressBar({ progress, animated = false }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const clamped = Math.min(1, Math.max(0, progress));

  const fillAnim = useSharedValue(animated ? 0 : clamped);

  useEffect(() => {
    if (animated) {
      fillAnim.value = withTiming(clamped, { duration: 900 });
    } else {
      fillAnim.value = clamped;
    }
  }, [clamped]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${fillAnim.value * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, animStyle]} />
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    track: {
      height: components.layout.spacing.sm,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.accent.primary,
    },
  });
