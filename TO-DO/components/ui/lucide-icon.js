import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Themed Lucide icon component that adapts to light/dark mode
 */
export function LucideIcon({
  name,
  size = 24,
  color,
  lightColor,
  darkColor,
  style,
}) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'icon'
  );

  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color || themeColor}
      style={style}
    />
  );
}
