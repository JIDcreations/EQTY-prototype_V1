import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ConceptDropdownMenu({
  headerLabel,
  headerHint,
  items = [],
  styles,
  colors,
  components,
  wrapStyle,
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const borderColor = toRgba(colors.ui.divider, 0.35);

  if (!items.length) {
    return null;
  }

  return (
    <View style={[styles.conceptTrackWrap, wrapStyle]}>
      <View style={styles.conceptTrackHeader}>
        <AppText style={styles.conceptTrackHeaderLabel}>{headerLabel}</AppText>
        <AppText style={styles.conceptTrackHeaderHint}>{headerHint}</AppText>
      </View>
      <View
        style={[
          styles.conceptTrack,
          {
            borderWidth: components.borderWidth.thin,
            borderColor,
          },
        ]}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <View key={item.id || `${item.label}-${index}`}>
              <Pressable
                onPress={() =>
                  setActiveIndex((prev) => (prev === index ? null : index))
                }
                style={styles.conceptTrackRow}
              >
                <View
                  style={[
                    styles.conceptTrackBar,
                    isActive && styles.conceptTrackBarActive,
                    isFirst && styles.conceptTrackBarFirst,
                    isLast && styles.conceptTrackBarLast,
                  ]}
                />
                <View style={styles.conceptTrackBody}>
                  <View style={styles.conceptTrackBodyRow}>
                    <AppText
                      style={[
                        styles.conceptTrackIndex,
                        isActive && styles.conceptTrackIndexActive,
                      ]}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </AppText>
                    <View style={styles.conceptTrackContent}>
                      <AppText style={styles.conceptTrackName}>{item.label}</AppText>
                    </View>
                    <Ionicons
                      name={isActive ? 'chevron-down' : 'chevron-forward'}
                      size={components.sizes.icon.sm}
                      color={isActive ? colors.accent.primary : colors.text.secondary}
                    />
                  </View>
                  {isActive ? (
                    <AppText style={styles.conceptTrackDetail}>{item.detail}</AppText>
                  ) : null}
                </View>
              </Pressable>
              {!isLast ? <View style={styles.conceptTrackDivider} /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
