import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getSettingsCopy } from '../utils/localization';
import { getSettingsScrollContentStyle } from '../utils/settingsLayout';
import useToast from '../utils/useToast';

export default function ContactSupportScreen({ navigation }) {
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
  const supportCopy = settingsCopy.contactSupport;
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();
  const canSend =
    !isSending &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  const handleSend = async () => {
    if (!canSend) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.show(supportCopy.sentToast);
    setSubject('');
    setMessage('');
    setIsSending(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsHeader
          title={supportCopy.title}
          subtitle={supportCopy.subtitle}
          onBack={() => navigation.goBack()}
        />
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{supportCopy.contactOptionsTitle}</AppText>
          <View style={styles.list}>
            {supportCopy.channels.map((channel, index) => (
              <SettingsRow
                key={`${channel.label}-${index}`}
                label={channel.label}
                subtitle={channel.subtitle}
                isLast={index === supportCopy.channels.length - 1}
              />
            ))}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{supportCopy.beforeReachOutTitle}</AppText>
          <AppText style={styles.text}>{supportCopy.beforeReachOutText}</AppText>
          <View style={styles.bulletList}>
            {supportCopy.checklist.map((item, index) => (
              <AppText key={`${item}-${index}`} style={styles.bulletText}>
                - {item}
              </AppText>
            ))}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>{supportCopy.sendRequestTitle}</AppText>
          <AppText style={styles.label}>{supportCopy.subjectLabel}</AppText>
          <AppTextInput
            value={subject}
            onChangeText={setSubject}
            placeholder={supportCopy.subjectPlaceholder}
            placeholderTextColor={colors.text.secondary}
            style={styles.input}
          />
          <AppText style={styles.label}>{supportCopy.messageLabel}</AppText>
          <AppTextInput
            value={message}
            onChangeText={setMessage}
            placeholder={supportCopy.messagePlaceholder}
            placeholderTextColor={colors.text.secondary}
            style={[styles.input, styles.messageInput]}
            multiline
            textAlignVertical="top"
          />
          <AppText style={styles.helperText}>{supportCopy.helperText}</AppText>
          <PrimaryButton
            label={isSending ? supportCopy.sendingButton : supportCopy.sendButton}
            onPress={handleSend}
            disabled={!canSend}
          />
        </Card>
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
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
    list: {
      gap: components.layout.spacing.xs,
    },
    bulletList: {
      gap: components.layout.spacing.xs,
    },
    bulletText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
    messageInput: {
      ...components.input.multiline,
    },
    helperText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
