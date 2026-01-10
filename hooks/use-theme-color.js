import { useColorScheme } from './use-color-scheme';
import { Colors } from '@/constants/theme';

export function useThemeColor(
  props,
  colorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (!colorFromProps) {
    return Colors[theme][colorName];
  } else {
    return colorFromProps;
  }
}
