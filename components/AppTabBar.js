import React, { useMemo } from 'react';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme';

const buildDescriptors = (descriptors, tabBarStyle) => {
  const next = {};
  Object.entries(descriptors).forEach(([key, descriptor]) => {
    next[key] = {
      ...descriptor,
      options: {
        ...descriptor.options,
        tabBarStyle: [tabBarStyle, descriptor.options?.tabBarStyle],
      },
    };
  });
  return next;
};

export default function AppTabBar(props) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const descriptors = useMemo(
    () => buildDescriptors(props.descriptors, styles.tabBar),
    [props.descriptors, styles.tabBar]
  );

  return (
    <Animated.View entering={FadeInDown.duration(260).delay(40)} style={styles.container}>
      <BottomTabBar {...props} descriptors={descriptors} />
    </Animated.View>
  );
}

const createStyles = (colors, components) => {
  const tabBarBottom =
    components.layout.safeArea.bottom + components.tabBar.bottomOffset;

  return {
    container: {
      flexShrink: 0,
    },
    tabBar: {
      position: 'absolute',
      left: components.tabBar.inset,
      right: components.tabBar.inset,
      bottom: tabBarBottom,
      height: components.tabBar.height,
      paddingTop: components.tabBar.paddingTop,
      paddingBottom: components.tabBar.paddingBottom,
      paddingHorizontal: components.tabBar.paddingHorizontal,
      borderRadius: components.tabBar.radius,
      backgroundColor: components.tabBar.background,
      borderWidth: components.tabBar.borderWidth,
      borderColor: components.tabBar.borderColor,
      shadowColor: colors.ui.divider,
      shadowOpacity: components.shadows.tabBar.opacity,
      shadowRadius: components.shadows.tabBar.radius,
      shadowOffset: {
        width: components.shadows.tabBar.offsetX,
        height: components.shadows.tabBar.offsetY,
      },
      elevation: components.shadows.tabBar.elevation,
    },
  };
};
