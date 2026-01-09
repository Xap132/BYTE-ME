import { View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...rest
}) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <View
      style={[
        { backgroundColor },
        style,
      ]}
      {...rest}
    />
  );
}
