import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import AppText from './AppText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale() {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.98, { duration: 120 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  return { animatedStyle, onPressIn, onPressOut };
}

export function PrimaryButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[styles.primaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText style={styles.primaryLabel}>{label}</AppText>
    </AnimatedPressable>
  );
}

export function CtaButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[
        styles.primaryButton,
        styles.ctaPageButton,
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText style={styles.primaryLabel}>{label}</AppText>
    </AnimatedPressable>
  );
}

export function CtaInsideButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[
        styles.primaryButton,
        styles.ctaInsideButton,
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText style={styles.primaryLabel}>{label}</AppText>
    </AnimatedPressable>
  );
}

export function CtaSecondaryButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[
        styles.secondaryButton,
        styles.ctaPageButton,
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.secondaryBorder} />
      <AppText style={styles.secondaryLabel}>{label}</AppText>
    </AnimatedPressable>
  );
}

export function SecondaryButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[styles.secondaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.secondaryBorder} />
      <AppText style={styles.secondaryLabel}>{label}</AppText>
    </AnimatedPressable>
  );
}

const createStyles = (components) =>
  StyleSheet.create({
    primaryButton: {
      ...components.button.base,
      ...components.button.primary,
    },
    ctaPageButton: {
      width: '100%',
      maxWidth: components.sizes.button.ctaPageWidth,
      height: components.sizes.button.ctaPageHeight,
      alignSelf: 'center',
      paddingVertical: 0,
    },
    ctaInsideButton: {
      width: components.sizes.button.ctaInsideWidth,
      height: components.sizes.button.ctaInsideHeight,
      alignSelf: 'center',
      paddingVertical: 0,
    },
    primaryLabel: {
      ...components.button.labelOnAccent,
    },
    secondaryButton: {
      ...components.button.base,
      ...components.button.secondary,
      position: 'relative',
      overflow: 'hidden',
    },
    secondaryBorder: {
      position: 'absolute',
      inset: 0,
      borderRadius: components.radius.button,
      borderWidth: components.borderWidth.thin,
      borderColor: 'transparent',
    },
    secondaryLabel: {
      ...components.button.label,
    },
    disabled: {
      ...components.button.disabled,
    },
  });
