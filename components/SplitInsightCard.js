import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { typography, useTheme } from '../theme';
import AppText from './AppText';
import GlossaryText from './GlossaryText';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SplitInsightCard({ sections = [], onPressTerm, style, disableGlossaryTerms = false }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const visibleSections = sections.filter((section) => section?.label && section?.text);

  if (!visibleSections.length) return null;

  return (
    <View style={[styles.card, style]}>
      {visibleSections.map((section, index) => (
        <React.Fragment key={`${section.label}-${index}`}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.section}>
            <AppText style={styles.label}>{section.label}</AppText>
            {disableGlossaryTerms ? (
              <AppText style={styles.text}>{section.text}</AppText>
            ) : (
              <GlossaryText
                text={section.text}
                style={styles.text}
                onPressTerm={onPressTerm}
              />
            )}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    card: {
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    section: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    divider: {
      height: components.borderWidth.thin,
      backgroundColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
  });
