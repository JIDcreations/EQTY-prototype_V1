import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';

export default function LessonStepContainer({
  children,
  scrollEnabled = true,
  scrollRef,
  contentStyle,
  containerStyle,
  fillViewport = false,
}) {
  const { colors, components } = useTheme();
  const tabBarHeight = useContext(BottomTabBarHeightContext) || 0;
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const contentContainerStyle = scrollEnabled
    ? [styles.content, styles.contentScroll, fillViewport && styles.contentFill, contentStyle]
    : [styles.content, styles.contentFixed, contentStyle];
  const wrapperStyle = scrollEnabled
    ? [styles.containerScroll, containerStyle]
    : [styles.safeArea, containerStyle];

  return (
    <View style={wrapperStyle}>
      <View style={contentContainerStyle}>
        <Animated.View
          style={scrollEnabled ? styles.contentInnerScroll : styles.contentInnerFixed}
          entering={FadeInDown.duration(280)}
        >
          {children}
        </Animated.View>
      </View>
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    safeArea: {
      ...components.screen.container,
      width: '100%',
    },
    containerScroll: {
      ...components.screen.containerScroll,
      width: '100%',
    },
    content: {
      paddingTop: components.layout.spacing.lg,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingBottom: components.layout.spacing.none,
      gap: components.layout.contentGap,
    },
    contentScroll: {
      flexGrow: 1,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.md,
    },
    contentFixed: {
      flex: 1,
      paddingBottom: tabBarHeight + components.layout.spacing.md,
    },
    contentFill: {
      flexGrow: 1,
    },
    contentInnerScroll: {
      width: '100%',
    },
    contentInnerFixed: {
      flex: 1,
    },
  });
