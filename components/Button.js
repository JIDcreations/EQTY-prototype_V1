import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import AppText from './AppText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale(disabled = false) {
  const scale = useSharedValue(1);
  const disabledProgress = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    disabledProgress.value = withTiming(disabled ? 1 : 0, { duration: 180 });
  }, [disabled, disabledProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(disabledProgress.value, [0, 1], [1, 0.72]),
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

function AnimatedButtonLabel({ label, textStyle }) {
  return (
    <View style={stylesShared.labelWrap} pointerEvents="none">
      <Animated.View
        key={label}
        entering={FadeIn.duration(160)}
        exiting={FadeOut.duration(120)}
      >
        <AppText style={textStyle}>{label}</AppText>
      </Animated.View>
    </View>
  );
}

export function PrimaryButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(disabled);

  return (
    <AnimatedPressable
      style={[styles.primaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <AnimatedButtonLabel label={label} textStyle={styles.primaryLabel} />
    </AnimatedPressable>
  );
}

export function CtaButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(disabled);

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
      <AnimatedButtonLabel label={label} textStyle={styles.primaryLabel} />
    </AnimatedPressable>
  );
}

export function CtaInsideButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(disabled);

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
      <AnimatedButtonLabel label={label} textStyle={styles.primaryLabel} />
    </AnimatedPressable>
  );
}

export function CtaSecondaryButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(disabled);

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
      <AnimatedButtonLabel label={label} textStyle={styles.secondaryLabel} />
    </AnimatedPressable>
  );
}

export function SecondaryButton({ label, onPress, style, disabled }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(disabled);

  return (
    <AnimatedPressable
      style={[styles.secondaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.secondaryBorder} />
      <AnimatedButtonLabel label={label} textStyle={styles.secondaryLabel} />
    </AnimatedPressable>
  );
}

const stylesShared = StyleSheet.create({
  labelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const createStyles = (components) =>
  StyleSheet.create({
    primaryButton: {
      ...components.button.base,
      ...components.button.primary,
      height: components.sizes.button.ctaPageHeight,
      paddingVertical: 0,
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
      transform: [{ translateY: -1 }],
    },
    secondaryButton: {
      ...components.button.base,
      ...components.button.secondary,
      height: components.sizes.button.ctaPageHeight,
      paddingVertical: 0,
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
      transform: [{ translateY: -1 }],
    },
    disabled: {
      ...components.button.disabled,
    },
  });
