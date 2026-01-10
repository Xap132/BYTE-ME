import { createTamagui, createTokens, createTheme } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';

/**
 * VoiceWave Theme Configuration
 * Based on modern design principles with focus on accessibility
 */

// Font setup
const interFont = createInterFont({
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    9: 48,
    10: 60,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 22,
    4: 24,
    5: 28,
    6: 32,
    7: 40,
    8: 48,
    9: 56,
    10: 72,
  },
  weight: {
    4: '300',
    5: '400',
    6: '500',
    7: '600',
    8: '700',
    9: '800',
  },
  letterSpacing: {
    text: 0.2,
    tight: -1,
  },
});

// Custom colors matching VoiceWave design
const voiceWaveColors = {
  // Primary - Indigo Blue
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Secondary - Cyan
  secondary: '#06B6D4',
  secondaryLight: '#22D3EE',
  secondaryDark: '#0891B2',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
};

// Spacing tokens
const spacingTokens = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 56,
  11: 64,
  12: 80,
  13: 96,
  14: 112,
  15: 128,
};

// Border radius tokens
const radiusTokens = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  circle: 9999,
};

// Size tokens
const sizeTokens = {
  0: 0,
  xs: 20,
  sm: 32,
  md: 44,
  lg: 56,
  xl: 64,
  2xl: 80,
  full: '100%',
};

// Z-index tokens
const zTokens = {
  0: 0,
  1: 10,
  2: 20,
  3: 30,
  modal: 1000,
  tooltip: 1100,
};

export const tamaguiConfig = createTamagui({
  defaultFont: 'body',
  shouldAddPrefersColorClassesTo: 'html',
  themeClassPrefix: 'tmg-',
  shorthands,
  fonts: {
    body: interFont,
    heading: interFont,
    mono: interFont,
  },
  tokens: {
    color: voiceWaveColors,
    space: spacingTokens,
    radius: radiusTokens,
    size: sizeTokens,
    zIndex: zTokens,
  },
  themes: {
    light: createTheme({
      bg: voiceWaveColors.white,
      bgAlt: voiceWaveColors.gray50,
      bgAlt2: voiceWaveColors.gray100,
      borderColor: voiceWaveColors.gray200,
      color: voiceWaveColors.gray900,
      colorFocus: voiceWaveColors.primary,
      colorHover: voiceWaveColors.gray700,
      colorPress: voiceWaveColors.gray800,
      colorTranslucent: 'rgba(0, 0, 0, 0.5)',
      primary: voiceWaveColors.primary,
      primaryLight: voiceWaveColors.primaryLight,
      primaryDark: voiceWaveColors.primaryDark,
      secondary: voiceWaveColors.secondary,
      success: voiceWaveColors.success,
      error: voiceWaveColors.error,
      warning: voiceWaveColors.warning,
    }),
    dark: createTheme({
      bg: voiceWaveColors.gray900,
      bgAlt: voiceWaveColors.gray800,
      bgAlt2: voiceWaveColors.gray700,
      borderColor: voiceWaveColors.gray700,
      color: voiceWaveColors.gray100,
      colorFocus: voiceWaveColors.primaryLight,
      colorHover: voiceWaveColors.gray400,
      colorPress: voiceWaveColors.gray300,
      colorTranslucent: 'rgba(255, 255, 255, 0.5)',
      primary: voiceWaveColors.primaryLight,
      primaryLight: voiceWaveColors.primary,
      primaryDark: voiceWaveColors.primaryDark,
      secondary: voiceWaveColors.secondaryLight,
      success: voiceWaveColors.success,
      error: voiceWaveColors.error,
      warning: voiceWaveColors.warning,
    }),
  },
});

export default tamaguiConfig;
