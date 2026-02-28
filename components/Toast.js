import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Toast({ message, visible, onHide, duration = 1600 }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.96,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onHide, opacity, scale, visible]);

  if (!visible || !message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { opacity, transform: [{ scale }] }]}
    >
      <View style={styles.popupCard}>
        <View style={styles.iconBadge}>
          <Ionicons
            name="checkmark"
            size={components.sizes.icon.md}
            color={colors.text.onAccent}
          />
        </View>
        <AppText style={styles.toastText}>{message}</AppText>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      left: components.layout.pagePaddingHorizontal,
      right: components.layout.pagePaddingHorizontal,
      top: components.layout.safeArea.top,
      bottom: components.layout.safeArea.bottom,
      alignItems: 'center',
      justifyContent: 'center',
    },
    popupCard: {
      width: '100%',
      maxWidth: components.layout.contentWidth,
      backgroundColor: toRgba(colors.background.surface, 0.95),
      borderRadius: components.radius.card,
      paddingVertical: components.layout.spacing.lg,
      paddingHorizontal: components.layout.spacing.lg,
      gap: components.layout.spacing.sm,
      alignItems: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8,
    },
    iconBadge: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastText: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      textAlign: 'center',
    },
  });
