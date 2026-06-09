import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

const backgroundImages = {
  bg2: require('../../assets/backgrounds/BG-2.png'),
  bg3: require('../../assets/backgrounds/BG-3.png'),
  light: require('../../assets/backgrounds/WHITE-BLUR.png'),
  whiteNoBlur: require('../../assets/backgrounds/White_NO-BLUR.png'),
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function OnboardingScreen({
  children,
  variant = 'default',
  backgroundVariant = 'bg2',
  scroll = false,
  contentContainerStyle,
  style,
  showGlow = false,
  scrollProps,
  scrollRef,
}) {
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const useExplicitBackground = backgroundVariant === 'whiteNoBlur';
  const resolvedBackground = useExplicitBackground
    ? backgroundImages.whiteNoBlur
    : mode === 'light'
      ? backgroundImages.light
      : backgroundImages[backgroundVariant] || backgroundImages.bg2;
  if (scroll) {
    const { contentContainerStyle: scrollContentStyle, ...restScrollProps } =
      scrollProps || {};
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
          <View style={styles.scrollContainer}>
            <ScrollView
              ref={scrollRef}
              style={styles.scroll}
              contentContainerStyle={[
                styles.scrollContent,
                contentContainerStyle,
                scrollContentStyle,
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              {...restScrollProps}
            >
              {children}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

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
        <View style={styles.safeArea}>
          <View style={[styles.content, contentContainerStyle]}>{children}</View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    background: {
      flex: 1,
      minHeight: '100vh',
      width: '100%',
      backgroundColor: colors.background.app,
      overflow: 'visible',
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    gradient: {
      flex: 1,
      minHeight: '100vh',
      backgroundColor: toRgba(colors.background.app, 0),
    },
    safeArea: {
      flex: 1,
      minHeight: '100%',
      ...components.screen.safeArea,
    },
    scrollContainer: {
      flex: 1,
      height: '100vh',
      maxHeight: '100vh',
      minHeight: '100vh',
    },
    scroll: {
      flex: 1,
      height: '100vh',
      maxHeight: '100vh',
      minHeight: '100vh',
      overflow: 'auto',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
    scrollContent: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      paddingBottom: components.layout.safeArea.bottom,
      gap: components.layout.contentGap,
      minHeight: '100%',
    },
    content: {
      flex: 1,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.spacing.xl,
      paddingBottom: components.layout.spacing.none,
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
