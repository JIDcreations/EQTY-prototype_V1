import { useMemo } from 'react';
import { useApp } from '../utils/AppContext';
import { colors } from './colors';
import { typography } from './typography';
import { layout } from './layout';
import { spacing } from './spacing';
import { createComponents } from './components';

type Appearance = 'Light' | 'Dark';
type AppPreferences = {
  appearance?: Appearance;
};
type AppContextValue = {
  preferences?: AppPreferences;
};

export const getTheme = (appearance?: Appearance) => {
  const mode = appearance === 'Light' ? 'light' : 'dark';
  const palette = colors[mode];
  return {
    mode,
    colors: palette,
    typography,
    layout,
    spacing,
    components: createComponents(palette, mode),
  };
};

export const useTheme = () => {
  const { preferences } = useApp() as AppContextValue;
  return useMemo(() => getTheme(preferences?.appearance), [preferences?.appearance]);
};

export { colors, typography, layout, spacing, createComponents };
