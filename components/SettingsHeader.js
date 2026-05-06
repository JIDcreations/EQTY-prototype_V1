import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

export default function SettingsHeader({ title, subtitle, onBack, rightAction }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={components.sizes.icon.lg}
              color={colors.text.primary}
            />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <View style={styles.titleWrap}>
          <AppText style={styles.title}>{title}</AppText>
        </View>
        {rightAction ? <View style={styles.rightActionWrap}>{rightAction}</View> : null}
      </View>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      gap: components.layout.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backSpacer: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      flexShrink: 0,
    },
    titleWrap: {
      flex: 1,
      minWidth: 0,
    },
    rightActionWrap: {
      flexShrink: 0,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
