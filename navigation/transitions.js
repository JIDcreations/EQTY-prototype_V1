export const subtleTransitionSpec = {
  open: { animation: 'timing', config: { duration: 260 } },
  close: { animation: 'timing', config: { duration: 210 } },
};

export const forSubtleSlide = ({ current }) => ({
  cardStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 0.55, 1],
      outputRange: [0.35, 0.82, 1],
    }),
  },
});
