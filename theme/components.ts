import { layout } from './layout';
import { typography } from './typography';

const toRgba = (hex: string, alpha: number) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const radius = {
  button: 16,
  card: 24,
  input: 16,
  pill: 999,
};

const borderWidth = {
  thin: 1,
};

const tabBar = {
  height: layout.spacing.xxl * 2,
  inset: layout.spacing.lg,
  bottomOffset: 0,
  paddingTop: layout.spacing.xs,
  paddingBottom: layout.spacing.xs,
  paddingHorizontal: layout.spacing.lg,
  radius: radius.card,
};

const sizes = {
  icon: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
  },
  square: {
    xs: 24,
    sm: 28,
    md: 34,
    lg: 36,
  },
  dot: {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 14,
  },
  line: {
    thin: 2,
    thick: 3,
  },
  track: {
    sm: 18,
  },
  hintBar: {
    xs: 8,
    sm: 14,
    md: 22,
    lg: 30,
  },
  chart: {
    sm: 90,
    md: 96,
    lg: 120,
    xl: 190,
  },
  card: {
    stackHeight: 160,
  },
  illustration: {
    sm: 180,
    smAlt: 190,
    md: 200,
    lg: 220,
    xl: 230,
    xxl: 240,
    xxxl: 260,
  },
  input: {
    minHeight: 48,
    multilineMinHeight: 96,
    composerMaxHeight: 120,
  },
  list: {
    minItemHeight: 56,
  },
  screen: {
    minPanelHeight: 330,
    maxContentWidth: 320,
  },
  button: {
    ctaPageWidth: 454,
    ctaPageHeight: 54,
    ctaInsideWidth: 314,
    ctaInsideHeight: 48,
  },
  handle: {
    width: 40,
    widthLg: 44,
    height: 4,
  },
};

const offsets = {
  stackedCard: {
    insetSm: 10,
    insetMd: 18,
    insetLg: 22,
  },
  onboarding: {
    orbTopSm: 40,
    orbTopMd: 60,
    orbBottomSm: 80,
    orbBottomMd: 90,
    orbBottomLg: 120,
    orbLeftSm: -60,
    orbLeftLg: -80,
    orbRightSm: -80,
    orbRightLg: -90,
    orbRightMd: -70,
  },
  glow: {
    top: -80,
    rightLg: -120,
    rightSm: -80,
    leftLg: -120,
    bottomLg: -120,
  },
  lesson: {
    processLineLeft: 9,
  },
  translate: {
    sm: -10,
    lg: -190,
  },
};

const transforms = {
  scalePressed: 0.99,
  scalePressedStrong: 0.96,
};

export const createComponents = (colors, mode = 'dark') => {
  const isLight = mode === 'light';
  return {
  radius,
  borderWidth,
  sizes,
  offsets,
  shadows: {
    stackedCard: {
      opacity: colors.opacity.stroke,
      radius: 16,
      offsetX: 0,
      offsetY: 10,
      elevation: 6,
    },
    tabBar: {
      opacity: colors.opacity.stroke,
      radius: 20,
      offsetX: 0,
      offsetY: 12,
      elevation: 14,
    },
  },
  transforms,
  tabBar: {
    height: tabBar.height,
    inset: tabBar.inset,
    bottomOffset: tabBar.bottomOffset,
    paddingTop: tabBar.paddingTop,
    paddingBottom: tabBar.paddingBottom,
    paddingHorizontal: tabBar.paddingHorizontal,
    radius: tabBar.radius,
    background: colors.background.surface,
    borderWidth: borderWidth.thin,
    borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
  },
  layout,
  screen: {
    safeArea: {
      paddingTop: layout.safeArea.top,
      paddingBottom: layout.safeArea.bottom,
      paddingLeft: layout.safeArea.left,
      paddingRight: layout.safeArea.right,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
      paddingTop: layout.safeArea.top,
      paddingBottom: layout.safeArea.bottom,
      paddingLeft: layout.safeArea.left,
      paddingRight: layout.safeArea.right,
    },
    containerScroll: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
  },
  button: {
    base: {
      borderRadius: radius.button,
      paddingVertical: layout.spacing.lg,
      paddingHorizontal: layout.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: colors.accent.primary,
      borderWidth: isLight ? 0 : borderWidth.thin,
      borderColor: isLight
        ? 'transparent'
        : toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    secondary: {
      backgroundColor: colors.background.surface,
      borderWidth: borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    label: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    labelOnAccent: {
      ...typography.styles.bodyStrong,
      color: colors.text.onAccent,
    },
    disabled: {
      opacity: colors.opacity.surface,
    },
  },
  card: {
    base: {
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderWidth: isLight ? borderWidth.thin : 0,
      borderColor: isLight
        ? colors.ui.divider
        : 'transparent',
      borderRadius: radius.card,
      padding: layout.spacing.lg,
      gap: layout.spacing.md,
    },
    title: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    body: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    supporting: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  },
  input: {
    container: {
      borderRadius: radius.input,
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.lg,
      backgroundColor: colors.background.surfaceActive,
      borderWidth: borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      minHeight: sizes.input.minHeight,
    },
    multiline: {
      minHeight: sizes.input.multilineMinHeight,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    helper: {
      ...typography.styles.meta,
      color: colors.text.secondary,
    },
  },
  list: {
    row: {
      paddingVertical: layout.spacing.md,
      gap: layout.spacing.sm,
    },
    divider: {
      borderBottomWidth: borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    headerText: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    itemTitle: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    itemSubtext: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  },
};
};
