import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export function TextInputArea({
  value,
  onChangeText,
  placeholder = 'Enter text to speak...',
  maxLength = 5000,
}) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Text to Speak</ThemedText>
        <ThemedText style={styles.counter}>
          {value.length}/{maxLength}
        </ThemedText>
      </View>
      
      <View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={[styles.input, { backgroundColor, color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={useThemeColor({ light: '#9CA3AF', dark: '#6B7280' }, 'icon')}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <LucideIcon name="X" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  counter: {
    fontSize: 12,
    opacity: 0.6,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 120,
    position: 'relative',
  },
  input: {
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
