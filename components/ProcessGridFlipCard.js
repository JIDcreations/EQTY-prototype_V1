import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import AppText from './AppText';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ProcessGridFlipCard({
  step,
  index,
  stepCodePrefix = 'STEP',
  styles,
  colors,
  isActive,
  isCompleted,
  isLocked,
  controlledFlipped,
  onToggleFlipped,
  onStepCompleted,
  renderAnimation,
}) {
  const [uncontrolledFlipped, setUncontrolledFlipped] = useState(false);
  const isControlled = typeof controlledFlipped === 'boolean';
  const isFlipped = isControlled ? controlledFlipped : uncontrolledFlipped;
  const flipProgress = useSharedValue(0);
  const activePulse = useSharedValue(0);
  const isSubtleCompleted = isCompleted && !isFlipped;
  const cardBorderColor = toRgba(colors.ui.divider, 0.35);

  useEffect(() => {
    if (isLocked && uncontrolledFlipped) setUncontrolledFlipped(false);
  }, [isLocked, uncontrolledFlipped]);

  useEffect(() => {
    if (isControlled) {
      if (isFlipped) {
        flipProgress.value = withTiming(1, {
          duration: 520,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        flipProgress.value = 0;
      }
      return;
    }
    flipProgress.value = withTiming(isFlipped ? 1 : 0, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });
  }, [flipProgress, isControlled, isFlipped]);

  useEffect(() => {
    if (!isActive) {
      activePulse.value = 0;
      return;
    }
    activePulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [activePulse, isActive]);

  const frontStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipProgress.value, [0, 1], [0, 180]);
    const opacity = interpolate(
      flipProgress.value,
      [0, 0.48, 0.55, 1],
      [1, 1, 0, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotate}deg` }],
      opacity,
      zIndex: flipProgress.value < 0.5 ? 2 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipProgress.value, [0, 1], [180, 360]);
    const opacity = interpolate(
      flipProgress.value,
      [0, 0.45, 0.52, 1],
      [0, 0, 1, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotate}deg` }],
      opacity,
      zIndex: flipProgress.value >= 0.5 ? 2 : 0,
    };
  });

  const activePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(activePulse.value, [0, 1], [0.82, 1.45]) }],
    opacity: interpolate(activePulse.value, [0, 1], [0.38, 0]),
  }));

  const handlePress = () => {
    if (isLocked) return;
    if (isControlled) {
      onToggleFlipped?.(!isFlipped);
      return;
    }
    const nextFlipped = !uncontrolledFlipped;
    setUncontrolledFlipped(nextFlipped);
    if (nextFlipped && !isCompleted) onStepCompleted?.();
  };

  const stepCode = `${stepCodePrefix} ${`${index + 1}`.padStart(2, '0')}`;
  const frontCtaLabel = stepCodePrefix === 'VOORBEELD' ? 'Ontdek voorbeeld' : 'Ontdek stap';
  const lockedCtaLabel =
    stepCodePrefix === 'VOORBEELD'
      ? 'Ontdek eerst de voorbeelden hierboven'
      : 'Bekijk eerst de volgende stappen hierboven';
  const backCtaLabel = 'Terug';

  const renderStatusIndicator = () => {
    if (isCompleted) {
      return (
        <View style={[styles.l1StatusBadge, styles.l1StatusBadgeCompleted]}>
          <Ionicons name="checkmark" size={14} color={colors.accent.primary} />
        </View>
      );
    }
    if (isLocked) {
      return (
        <View style={[styles.l1StatusBadge, styles.l1StatusBadgeLocked]}>
          <Ionicons name="lock-closed" size={12} color={colors.text.secondary} />
        </View>
      );
    }
    return (
      <View style={[styles.l1StatusBadge, styles.l1StatusBadgeActive]}>
        <Animated.View style={[styles.l1StatusPulse, activePulseStyle]} />
        <View style={styles.l1StatusDot} />
      </View>
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLocked}
      style={[
        styles.l1CardShell,
        isActive && styles.l1CardShellActive,
        isCompleted && styles.l1CardShellCompleted,
        isLocked && styles.l1CardShellLocked,
      ]}
    >
      <View style={styles.l1FlipCard}>
        <Animated.View
          style={[
            styles.l1Face,
            styles.l1Page,
            styles.l1FrontPage,
            isActive && styles.l1PageActive,
            isCompleted && styles.l1PageCompleted,
            isLocked && styles.l1PageLocked,
            isSubtleCompleted && styles.l1PageSubtle,
            isSubtleCompleted && {
              backgroundColor: toRgba(colors.background.surface, 0.6),
            },
            { borderColor: cardBorderColor },
            frontStyle,
          ]}
        >
          <View style={styles.l1CardHeaderRow}>
            <View style={styles.l1StepMeta}>
              <AppText style={[styles.l1StepKicker, isSubtleCompleted && styles.l1StepKickerSubtle]}>
                {stepCode}
              </AppText>
              <AppText
                style={[styles.l1CardLabel, isSubtleCompleted && styles.l1CardLabelSubtle]}
                numberOfLines={2}
              >
                {step.label}
              </AppText>
            </View>
            {renderStatusIndicator()}
          </View>
          <View
            style={[
              styles.l1AnimStateWrap,
              isCompleted && styles.l1AnimStateCompleted,
              isLocked && styles.l1AnimStateLocked,
              isSubtleCompleted && styles.l1AnimStateSubtle,
            ]}
          >
            {renderAnimation?.()}
          </View>
          {isLocked ? (
            <AppText
              style={[
                styles.l1TapHint,
                styles.l1TapHintLocked,
              ]}
            >
              {lockedCtaLabel}
            </AppText>
          ) : isSubtleCompleted ? (
            <View style={styles.l1CtaPill}>
              <AppText style={styles.l1CtaPillLabel}>{frontCtaLabel}</AppText>
              <AppText style={styles.l1CtaPillArrow}>{'→'}</AppText>
            </View>
          ) : (
            <View style={styles.l1CtaPill}>
              <AppText style={styles.l1CtaPillLabel}>{frontCtaLabel}</AppText>
              <AppText style={styles.l1CtaPillArrow}>{'→'}</AppText>
            </View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.l1Face,
            styles.l1Page,
            styles.l1BackPage,
            isCompleted && styles.l1PageCompleted,
            { borderColor: cardBorderColor },
            backStyle,
          ]}
        >
          <View style={styles.l1CardHeaderRow}>
            <View style={styles.l1StepMeta}>
              <AppText style={styles.l1StepKicker}>{stepCode}</AppText>
              <AppText style={styles.l1BackLabel}>{step.question}</AppText>
            </View>
            {renderStatusIndicator()}
          </View>
          <AppText style={styles.l1BackDetail}>{step.detail}</AppText>
          <View style={styles.l1CtaPill}>
            <AppText style={styles.l1CtaPillArrow}>{'←'}</AppText>
            <AppText style={styles.l1CtaPillLabel}>{backCtaLabel}</AppText>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}
