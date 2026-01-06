import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function VoiceSelector({
  selectedVoice,
  onVoiceChange,
  selectedLanguage,
  onLanguageChange,
}) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#F3F4F6', dark: '#1F2937' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');

  return (
    <ThemedView style={styles.container}>
      {/* Language Selection */}
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Language
        </ThemedText>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor, borderColor },
              selectedLanguage === 'en' && { backgroundColor: tintColor, borderColor: tintColor },
            ]}
            onPress={() => onLanguageChange('en')}
            activeOpacity={0.7}
          >
            <LucideIcon
              name="Languages"
              size={20}
              color={selectedLanguage === 'en' ? '#FFFFFF' : undefined}
            />
            <ThemedText
              style={[
                styles.buttonText,
                selectedLanguage === 'en' && { color: '#FFFFFF' },
              ]}
            >
              English
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor, borderColor },
              selectedLanguage === 'fil' && { backgroundColor: tintColor, borderColor: tintColor },
            ]}
            onPress={() => onLanguageChange('fil')}
            activeOpacity={0.7}
          >
            <LucideIcon
              name="Languages"
              size={20}
              color={selectedLanguage === 'fil' ? '#FFFFFF' : undefined}
            />
            <ThemedText
              style={[
                styles.buttonText,
                selectedLanguage === 'fil' && { color: '#FFFFFF' },
              ]}
            >
              Filipino
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Voice Selection */}
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Voice Type
        </ThemedText>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor, borderColor },
              selectedVoice === 'male' && { backgroundColor: tintColor, borderColor: tintColor },
            ]}
            onPress={() => onVoiceChange('male')}
            activeOpacity={0.7}
          >
            <LucideIcon
              name="User"
              size={20}
              color={selectedVoice === 'male' ? '#FFFFFF' : undefined}
            />
            <ThemedText
              style={[
                styles.buttonText,
                selectedVoice === 'male' && { color: '#FFFFFF' },
              ]}
            >
              Male
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor, borderColor },
              selectedVoice === 'female' && { backgroundColor: tintColor, borderColor: tintColor },
            ]}
            onPress={() => onVoiceChange('female')}
            activeOpacity={0.7}
          >
            <LucideIcon
              name="UserCircle"
              size={20}
              color={selectedVoice === 'female' ? '#FFFFFF' : undefined}
            />
            <ThemedText
              style={[
                styles.buttonText,
                selectedVoice === 'female' && { color: '#FFFFFF' },
              ]}
            >
              Female
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
