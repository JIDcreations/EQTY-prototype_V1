import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

const backgroundImages = {
  bg2: require('../assets/backgrounds/BG-2.png'),
  bg3: require('../assets/backgrounds/BG-3.png'),
  light: require('../assets/backgrounds/WHITE-BLUR.png'),
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ScreenBackground({
  children,
  variant = 'bg3',
  showGlow = false,
  style,
}) {
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const resolvedBackground =
    mode === 'light'
      ? backgroundImages.light
      : backgroundImages[variant] || backgroundImages.bg3;

  return (
    <View style={[styles.background, style]}>
      <Image
        source={resolvedBackground}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.gradient}>
        {showGlow ? (
          <>
            <View pointerEvents="none" style={styles.glowTop} />
            <View pointerEvents="none" style={styles.glowMid} />
            <View pointerEvents="none" style={styles.glowBottom} />
          </>
        ) : null}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    background: {
      height: '100vh',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: colors.background.app,
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    gradient: {
      minHeight: '100%',
      backgroundColor: toRgba(colors.background.app, 0),
    },
    content: {
      minHeight: '100%',
      width: '100%',
    },
    glowTop: {
      position: 'absolute',
      top: components.offsets.glow.top,
      right: components.offsets.glow.rightLg,
      width: components.sizes.illustration.xxxl,
      height: components.sizes.illustration.xxxl,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    },
    glowMid: {
      position: 'absolute',
      top: '30%',
      left: components.offsets.glow.leftLg,
      width: components.sizes.illustration.xxl,
      height: components.sizes.illustration.xxl,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
    },
    glowBottom: {
      position: 'absolute',
      bottom: components.offsets.glow.bottomLg,
      right: components.offsets.glow.rightSm,
      width: components.sizes.illustration.lg,
      height: components.sizes.illustration.lg,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    },
  });
