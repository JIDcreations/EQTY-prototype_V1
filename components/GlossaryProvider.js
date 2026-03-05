import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import { typography, useTheme } from '../theme';
import AppText from './AppText';
import { useApp } from '../utils/AppContext';
import { getGlossaryCopy } from '../utils/localization';

export const GlossaryContext = createContext(null);

const DEFAULT_GLOSSARY_COPY = {
  definition: 'Definition',
  example: 'Example',
  watchVideo: 'Watch 2-minute video',
};

export function GlossaryProvider({ children }) {
  const { preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const glossaryCopy = useMemo(
    () => getGlossaryCopy?.(preferences?.language) || DEFAULT_GLOSSARY_COPY,
    [preferences?.language]
  );
  const sheetBorderStyle = useMemo(() => {
    if (mode !== 'light') return null;
    return {
      borderColor: colors.ui.border,
    };
  }, [colors.ui.border, mode]);
  const [activeTerm, setActiveTerm] = useState(null);

  const openTerm = useCallback((term) => {
    if (!term) return;
    setActiveTerm(term);
  }, []);

  const closeTerm = useCallback(() => {
    setActiveTerm(null);
  }, []);

  const getVideoUrl = useCallback((term) => {
    if (!term?.term) return null;
    return (
      term.learnMoreUrl ||
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${term.term} investing explained`
      )}`
    );
  }, []);

  const handleLearnMore = useCallback(async () => {
    const videoUrl = getVideoUrl(activeTerm);
    if (!videoUrl) return;
    await Linking.openURL(videoUrl);
  }, [activeTerm, getVideoUrl]);

  const value = useMemo(
    () => ({
      openTerm,
    }),
    [openTerm]
  );

  return (
    <GlossaryContext.Provider value={value}>
      {children}
      <BottomSheet
        visible={!!activeTerm}
        onClose={closeTerm}
        title={activeTerm?.term}
        scrimOpacity={0}
        sheetStyle={sheetBorderStyle}
      >
        <View style={styles.glossarySection}>
          <AppText style={styles.sheetLabel}>{glossaryCopy.definition}</AppText>
          <AppText style={styles.sheetDefinition}>{activeTerm?.definition}</AppText>
        </View>
        {activeTerm?.example ? (
          <View style={styles.glossarySection}>
            <AppText style={styles.sheetLabel}>{glossaryCopy.example}</AppText>
            <AppText style={styles.sheetExample}>{activeTerm?.example}</AppText>
          </View>
        ) : null}
        {activeTerm?.term ? (
          <Pressable style={styles.learnMoreRow} onPress={handleLearnMore}>
            <Ionicons
              name="play-circle-outline"
              size={components.sizes.icon.sm}
              color={colors.text.secondary}
            />
            <AppText style={styles.learnMoreText}>{glossaryCopy.watchVideo}</AppText>
          </Pressable>
        ) : null}
      </BottomSheet>
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return React.useContext(GlossaryContext);
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    sheetDefinition: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    sheetLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    sheetExample: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    glossarySection: {
      gap: components.layout.spacing.xs,
    },
    learnMoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      paddingTop: components.layout.spacing.sm,
    },
    learnMoreText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
