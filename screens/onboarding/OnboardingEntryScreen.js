import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import BottomSheet from '../../components/BottomSheet';
import EqtyLogo from '../../components/EqtyLogo';
import OnboardingAuthButton from '../../components/OnboardingAuthButton';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingEntryScreen({ navigation }) {
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  const handleApple = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingBasicInfo');
  };

  const handleGoogle = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingBasicInfo');
  };

  const handleEmail = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingEmail');
  };

  return (
    <OnboardingScreen backgroundVariant="bg3">
      <View style={styles.container}>
        <View style={styles.header}>
          <EqtyLogo width={92} color={colors.text.primary} />
          <View style={styles.kickerRow}>
            <View style={styles.kickerDot} />
            <AppText style={styles.kicker}>{copy.entry.kicker}</AppText>
          </View>
          <AppText style={styles.title}>{copy.entry.title}</AppText>
          <AppText style={styles.subtitle}>{copy.entry.subtitle}</AppText>
        </View>

        <OnboardingStackedCard>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>{copy.entry.cardTitle}</AppText>
            <AppText style={styles.cardSubtitle}>{copy.entry.cardSubtitle}</AppText>
          </View>
          <View style={styles.actions}>
            <PrimaryButton label={copy.entry.button} onPress={() => setSheetVisible(true)} />
            <Pressable onPress={() => navigation.navigate('OnboardingLogin')}>
              <AppText style={styles.link}>{copy.entry.loginLink}</AppText>
            </Pressable>
          </View>
        </OnboardingStackedCard>
      </View>

      <BottomSheet
        visible={sheetVisible}
        title={copy.entry.sheetTitle}
        onClose={() => setSheetVisible(false)}
        scrimOpacity={0}
      >
        <OnboardingAuthButton
          label={copy.entry.apple}
          iconName="logo-apple"
          iconSize={components.sizes.icon.lg}
          iconContainerSize={components.sizes.square.lg}
          bordered
          variant="light"
          onPress={handleApple}
        />
        <OnboardingAuthButton
          label={copy.entry.google}
          iconName="logo-google"
          iconSize={components.sizes.icon.lg}
          iconContainerSize={components.sizes.square.lg}
          bordered
          onPress={handleGoogle}
        />
        <OnboardingAuthButton
          label={copy.entry.email}
          iconName="mail-outline"
          onPress={handleEmail}
        />
      </BottomSheet>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: components.layout.spacing.xl,
    },
    header: {
      gap: components.layout.spacing.sm,
      maxWidth: components.sizes.screen.maxContentWidth,
    },
    kickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    kickerDot: {
      width: components.sizes.dot.xs,
      height: components.sizes.dot.xs,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
    kicker: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    cardHeader: {
      gap: components.layout.spacing.xs,
    },
    cardTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    cardSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
    link: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });
