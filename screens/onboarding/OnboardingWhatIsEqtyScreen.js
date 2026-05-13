import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import { PrimaryButton } from '../../components/Button';
import EqtyLogo from '../../components/EqtyLogo';
import OnboardingScreen from '../../components/OnboardingScreen';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingWhatIsEqtyScreen({ navigation }) {
  const { updatePreferences, preferences } = useApp();
  const { colors, components, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors, components, mode), [colors, components, mode]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  const handleCreateAccount = async () => {
    await updatePreferences({ hasOnboarded: false });
    navigation.navigate('OnboardingQuestionsIntro');
  };

  return (
    <OnboardingScreen
      backgroundVariant="bg3"
      showGlow={false}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={components.sizes.icon.lg}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>
        <View style={styles.logoWrap}>
          <EqtyLogo width={108} color={colors.text.primary} />
        </View>
        <View style={styles.editorialWrap}>
          <View style={styles.copyBlock}>
            <AppText style={styles.title}>{copy.whatIsEqty.title}</AppText>
            <View style={styles.paragraphBlock}>
              <AppText style={styles.paragraph}>{copy.whatIsEqty.intro}</AppText>
              <AppText style={styles.emphasis}>{copy.whatIsEqty.emphasis}</AppText>
              <AppText style={styles.paragraph}>{copy.whatIsEqty.outro}</AppText>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <PrimaryButton
            label={copy.whatIsEqty.button}
            onPress={handleCreateAccount}
          />
        </View>
      </View>
    </OnboardingScreen>
  );
}

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components, mode) =>
  StyleSheet.create({
    screen: {
      paddingBottom: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    editorialWrap: {
      flex: 1,
      justifyContent: 'center',
      paddingBottom: components.layout.spacing.xl,
    },
    logoWrap: {
      marginTop: components.layout.spacing.xxl,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    header: {
      position: 'absolute',
      top: components.layout.spacing.sm,
      left: components.layout.spacing.none,
      right: components.layout.spacing.none,
      zIndex: 1,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: mode === 'light' ? colors.background.surface : colors.background.app,
      borderWidth: components.borderWidth.thin,
      borderColor:
        mode === 'light'
          ? toRgba(colors.ui.divider, 0.35)
          : toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    copyBlock: {
      width: '100%',
      gap: components.layout.spacing.lg,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
      textAlign: 'left',
    },
    paragraphBlock: {
      gap: components.layout.spacing.md,
    },
    paragraph: {
      ...typography.styles.body,
      color: colors.text.secondary,
      textAlign: 'left',
    },
    emphasis: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      textAlign: 'left',
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
