import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

export default function EditUsernameScreen({ navigation }) {
  const { authUser, updateAuthUser } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [username, setUsername] = useState(authUser?.username || '');
  const toast = useToast();

  const handleSave = async () => {
    await updateAuthUser({ username: username.trim() });
    toast.show('Saved');
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Username" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <AppText style={styles.label}>Username</AppText>
          <AppTextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.text.secondary}
            style={styles.input}
          />
        </Card>
        <View style={styles.actions}>
          <PrimaryButton label="Save changes" onPress={handleSave} disabled={!username.trim()} />
          <SecondaryButton label="Cancel" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
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
    card: {
      gap: components.layout.cardGap,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
