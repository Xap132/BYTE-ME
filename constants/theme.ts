

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  // Custom Tech-Talk Palette (Dark Mode)
  techTalk: {
    background: '#101828',
    tabBarBg: '#3C3C43',
    orangeBtn: '#CD8546',
    goldBtn: '#C2A070',
    inputBg: '#FFF0DB',
    text: '#FFFFFF',
    textSecondary: '#D4D4D8',
    icon: '#FFFFFF',
    placeholderText: '#A8A29E',
    charCountBg: 'rgba(205, 133, 70, 0.15)',
    charCountText: '#CD8546',
    divider: 'rgba(255,255,255,0.1)',
  },
  // Light Mode with Orange Theme
  techTalkLight: {
    background: '#FFFFFF',
    tabBarBg: '#F8F9FA',
    orangeBtn: '#CD8546',
    goldBtn: '#C2A070',
    inputBg: '#FFF8F0',
    text: '#1F2937',
    textSecondary: '#6B7280',
    icon: '#1F2937',
    borderColor: '#E5E7EB',
    cardBg: '#FFFFFF',
    placeholderText: '#9CA3AF',
    charCountBg: 'rgba(205, 133, 70, 0.1)',
    charCountText: '#CD8546',
    divider: 'rgba(0,0,0,0.08)',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
