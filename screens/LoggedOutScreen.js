import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import Card from '../components/Card';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';

export default function LoggedOutScreen({ navigation }) {
  const { updateAuthUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const settingsCopy = useMemo(
    () => getSettingsCopy(preferences?.language),
    [preferences?.language]
  );
  const loggedOutCopy = settingsCopy.loggedOut;

  const handleLogin = async () => {
    await updateAuthUser({});
    navigation.replace('SettingsHome');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <AppText style={styles.title}>{loggedOutCopy.title}</AppText>
          <AppText style={styles.text}>{loggedOutCopy.description}</AppText>
          <PrimaryButton label={loggedOutCopy.cta} onPress={handleLogin} />
        </Card>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      ...components.screen.containerScroll,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight,
    },
    card: {
      gap: components.layout.cardGap,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
