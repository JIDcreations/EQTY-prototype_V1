import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, useTheme } from '../theme';
import ProgressBar from './ProgressBar';
import AppText from './AppText';
import SurfacePillButton from './SurfacePillButton';

export default function StepHeader({
  step,
  total,
  title,
  onBack,
  onOpenGlossary,
  glossaryLabel = 'Terms in this lesson',
  onPressTerm,
  stepLabel,
  progressText,
  secondaryProgressText,
  helperText,
  helperTextBelowTitle = false,
  showTitle = true,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const isPlainTitle = typeof title === 'string' || typeof title === 'number';
  const titleNode = isPlainTitle ? (
    <AppText style={styles.title}>{String(title)}</AppText>
  ) : (
    title
  );
  const progressLabel = progressText || `Step ${step} of ${total}`;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={components.sizes.icon.lg}
            color={colors.text.primary}
          />
        </Pressable>
        {onOpenGlossary ? (
          <SurfacePillButton label={glossaryLabel} onPress={onOpenGlossary} />
        ) : null}
      </View>
      {stepLabel ? <AppText style={styles.stepLabel}>{stepLabel}</AppText> : null}
      {progressText ? <AppText style={styles.progressInline}>{progressLabel}</AppText> : null}
      {secondaryProgressText ? (
        <AppText style={styles.progressInline}>{secondaryProgressText}</AppText>
      ) : null}
      <ProgressBar progress={step / total} />
      {showTitle ? (
        <View
          style={[
            styles.titleWrap,
            helperTextBelowTitle && helperText ? styles.titleWrapWithHelper : null,
          ]}
        >
          {titleNode}
          {helperTextBelowTitle && helperText ? (
            <AppText style={styles.helperText}>{helperText}</AppText>
          ) : null}
        </View>
      ) : null}
      {!helperTextBelowTitle && helperText ? (
        <AppText style={styles.helperText}>{helperText}</AppText>
      ) : null}
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      gap: components.layout.spacing.md,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonPressed: {
      backgroundColor: colors.background.surfaceActive,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    progressInline: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    titleWrap: {
    },
    titleWrapWithHelper: {
      gap: components.layout.spacing.xs,
    },
    helperText: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    stepLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.primary,
    },
    title: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
  });
