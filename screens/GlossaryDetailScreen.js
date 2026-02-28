import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getGlossaryExplanation } from '../utils/helpers';
import { getGlossaryCopy } from '../utils/localization';

export default function GlossaryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { termId } = route.params || {};
  const { userContext, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const glossaryCopy = useMemo(
    () => getGlossaryCopy(preferences?.language),
    [preferences?.language]
  );
  const [explanation, setExplanation] = useState(null);

  const term = useMemo(
    () => glossaryTerms.find((item) => item.id === termId) || glossaryTerms[0],
    [termId]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={styles.title}>{term.term}</AppText>
          <AppText style={styles.subtitle}>{term.definition}</AppText>
        </View>

        <Card style={styles.explainCard}>
          <AppText style={styles.cardTitle}>{glossaryCopy.explainForMeTitle || 'Explain for me'}</AppText>
          <AppText style={styles.cardText}>
            {explanation || glossaryCopy.explainForMeBody || 'Tap below for a tailored explanation.'}
          </AppText>
          <PrimaryButton
            label={glossaryCopy.explainForMeButton || 'Explain for me'}
            onPress={() => setExplanation(getGlossaryExplanation(term, userContext))}
          />
        </Card>

        <SecondaryButton label={glossaryCopy.back || 'Back'} onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, components) =>
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
      paddingBottom: components.layout.safeArea.bottom,
    },
    header: {
      gap: components.layout.spacing.sm,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    explainCard: {
      gap: components.layout.cardGap,
    },
    cardTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    cardText: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
