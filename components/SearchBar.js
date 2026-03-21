import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppTextInput from './AppTextInput';
import { useTheme } from '../theme';

function toRgba(hex, alpha) {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Reusable search bar — shared across all screens.
 * Slightly taller than 45 via padding and input normalization for better optical centering.
 */
export default function SearchBar({ value, onChangeText, placeholder, style }) {
  const { colors, components } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
          borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
          borderWidth: components.borderWidth.thin,
        },
        style,
      ]}
    >
      <Ionicons
        name="search"
        size={components.sizes.icon.md}
        color={colors.text.secondary}
      />
      <AppTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
        style={[styles.input, { color: colors.text.primary }]}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons
            name="close-circle"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 11,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 18,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
