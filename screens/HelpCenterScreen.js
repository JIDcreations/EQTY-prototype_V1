import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import { SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import SettingsHeader from '../components/SettingsHeader';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsScrollContentStyle } from '../utils/settingsLayout';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function HelpCenterScreen({ navigation }) {
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
  const helpCopy = settingsCopy.helpCenter;
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGuides = useMemo(() => {
    if (!normalizedQuery) return helpCopy.guides;
    return helpCopy.guides.filter((item) => {
      const haystack = `${item.title} ${item.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [helpCopy.guides, normalizedQuery]);
  const searchFeedback = normalizedQuery
    ? helpCopy.resultsCount(filteredGuides.length)
    : helpCopy.helperText;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsHeader
          title={helpCopy.title}
          subtitle={helpCopy.subtitle}
          onBack={() => navigation.goBack()}
        />
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{helpCopy.searchTitle}</AppText>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder={helpCopy.searchPlaceholder}
          />
          <AppText style={styles.helperText}>{searchFeedback}</AppText>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{helpCopy.browseTopicsTitle}</AppText>
          <View style={styles.list}>
            {helpCopy.topics.map((topic, index) => (
              <View
                key={`${topic.title}-${index}`}
                style={[styles.listItem, index < helpCopy.topics.length - 1 && styles.listDivider]}
              >
                <AppText style={styles.itemTitle}>{topic.title}</AppText>
                <AppText style={styles.itemText}>{topic.description}</AppText>
              </View>
            ))}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{helpCopy.popularGuidesTitle}</AppText>
          <View style={styles.list}>
            {filteredGuides.length === 0 ? (
              <View style={styles.emptyState}>
                <AppText style={styles.emptyText}>{helpCopy.noGuides}</AppText>
                <AppText style={styles.emptyHint}>{helpCopy.emptySearchHint}</AppText>
              </View>
            ) : (
              filteredGuides.map((guide, index) => (
                <View
                  key={`${guide.title}-${index}`}
                  style={[styles.listItem, index < filteredGuides.length - 1 && styles.listDivider]}
                >
                  <AppText style={styles.itemTitle}>{guide.title}</AppText>
                  <AppText style={styles.itemText}>{guide.description}</AppText>
                </View>
              ))
            )}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{helpCopy.needMoreHelpTitle}</AppText>
          <AppText style={styles.text}>{helpCopy.needMoreHelpText}</AppText>
          <SecondaryButton
            label={helpCopy.contactSupportCta}
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
    card: {
      gap: components.layout.cardGap,
    },
    sectionTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    helperText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    list: {
      gap: components.layout.spacing.sm,
    },
    listItem: {
      ...components.list.row,
    },
    listDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    itemTitle: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    itemText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyState: {
      gap: components.layout.spacing.xs,
    },
    emptyHint: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
