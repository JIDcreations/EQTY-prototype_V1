export const subtleTransitionSpec = {
  open: { animation: 'timing', config: { duration: 260 } },
  close: { animation: 'timing', config: { duration: 210 } },
};

export const forSubtleSlide = ({ current, layouts }) => ({
  cardStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 0.55, 1],
      outputRange: [0.35, 0.82, 1],
    }),
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [Math.min(layouts.screen.width * 0.08, 34), 0],
        }),
      },
      {
        translateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [6, 0],
        }),
      },
    ],
  },
});
