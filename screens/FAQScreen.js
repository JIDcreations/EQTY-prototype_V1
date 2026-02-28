import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import { SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsScrollContentStyle } from '../utils/settingsLayout';

export default function FAQScreen({ navigation }) {
  const { preferences } = useApp();
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
  const faqCopy = settingsCopy.faq;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader
          title={faqCopy.title}
          subtitle={faqCopy.subtitle}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.list}>
          {faqCopy.items.map((item, index) => (
            <Card key={`${item.question}-${index}`} style={styles.card}>
              <AppText style={styles.question}>{item.question}</AppText>
              <AppText style={styles.answer}>{item.answer}</AppText>
            </Card>
          ))}
        </View>
        <Card style={styles.card}>
          <AppText style={styles.question}>{faqCopy.stillNeedHelpTitle}</AppText>
          <AppText style={styles.answer}>{faqCopy.stillNeedHelpText}</AppText>
          <SecondaryButton
            label={faqCopy.contactSupportCta}
            onPress={() => navigation.navigate('ContactSupport')}
          />
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
      ...getSettingsScrollContentStyle(components, tabBarHeight),
    },
    list: {
      gap: components.layout.spacing.sm,
    },
    card: {
      gap: components.layout.cardGap,
    },
    question: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    answer: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
