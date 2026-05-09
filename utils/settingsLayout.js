export function getSettingsOnboardingContentStyle(components, tabBarHeight) {
  return {
    paddingBottom:
      components.layout.safeArea.bottom +
      tabBarHeight +
      components.layout.spacing.md,
    gap: components.layout.contentGap,
  };
}

export function getSettingsScrollContentStyle(components, tabBarHeight) {
  return {
    paddingHorizontal: components.layout.pagePaddingHorizontal,
    paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
    gap: components.layout.contentGap,
    paddingBottom:
      components.layout.safeArea.bottom +
      tabBarHeight +
      components.layout.spacing.md,
  };
}
