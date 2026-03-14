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
 * Dimensions: paddingHorizontal 22, paddingVertical 14, gap 12, borderRadius 16.
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
        style={{ flex: 1, color: colors.text.primary }}
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
    paddingVertical: 22,
    gap: 12,
  },
});
