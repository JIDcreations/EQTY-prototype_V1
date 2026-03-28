import React, { useMemo } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useApp } from '../utils/AppContext';
import { typography } from '../theme';

function scaleTextStyle(style, scale) {
  const flattened = StyleSheet.flatten(style);
  if (!flattened) return style;
  const next = { ...flattened };
  if (typeof flattened.fontSize === 'number') {
    next.fontSize = Math.round(flattened.fontSize * scale);
  }
  if (typeof flattened.lineHeight === 'number') {
    next.lineHeight = Math.round(flattened.lineHeight * scale);
  }
  return next;
}

export default function AppTextInput({ style, multiline = false, ...props }) {
  const { textScale } = useApp();
  const scaledStyle = useMemo(
    () =>
      scaleTextStyle(
        [
          typography.styles.body,
          style,
        ],
        textScale || 1
      ),
    [style, textScale]
  );
  const normalizedStyle = useMemo(() => {
    if (multiline) {
      return [scaledStyle, styles.multiline];
    }

    const flattened = StyleSheet.flatten(scaledStyle) || {};
    const fontSize = flattened.fontSize || typography.styles.body.fontSize;
    const currentLineHeight = flattened.lineHeight || typography.styles.body.lineHeight;
    const verticalPadding =
      typeof flattened.paddingVertical === 'number' ? flattened.paddingVertical : null;
    const paddingTop =
      typeof flattened.paddingTop === 'number'
        ? flattened.paddingTop
        : verticalPadding ?? 0;
    const paddingBottom =
      typeof flattened.paddingBottom === 'number'
        ? flattened.paddingBottom
        : verticalPadding ?? 0;
    const totalVerticalSpace = currentLineHeight + paddingTop + paddingBottom;
    const targetLineHeight = Math.max(fontSize + 2, Math.round(fontSize * 1.125));
    const availablePadding = Math.max(0, totalVerticalSpace - targetLineHeight);

    return [
      scaledStyle,
      styles.singleLine,
      {
        lineHeight: targetLineHeight,
        paddingTop: Math.floor(availablePadding / 2),
        paddingBottom: Math.ceil(availablePadding / 2),
      },
    ];
  }, [multiline, scaledStyle]);

  return <TextInput multiline={multiline} style={normalizedStyle} {...props} />;
}

const styles = StyleSheet.create({
  singleLine: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  multiline: {
    textAlignVertical: 'top',
  },
});
