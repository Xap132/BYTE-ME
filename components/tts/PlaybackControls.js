import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

export function PlaybackControls({
  isPlaying,
  isLoading = false,
  onPlay,
  onPause,
  onStop,
  onSave,
  disabled = false,
}) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#F3F4F6', dark: '#1F2937' }, 'background');

  const handlePress = async (action) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Main Play/Pause Button */}
      <TouchableOpacity
        style={[
          styles.mainButton,
          { backgroundColor: tintColor },
          (disabled || isLoading) && styles.disabledButton,
        ]}
        onPress={() => handlePress(isPlaying ? onPause : onPlay)}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <LucideIcon
            name={isPlaying ? 'Pause' : 'Play'}
            size={48}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>

      {/* Secondary Controls */}
      <View style={styles.secondaryControls}>
        {/* Stop Button */}
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor }]}
          onPress={() => handlePress(onStop)}
          disabled={!isPlaying || disabled}
          activeOpacity={0.7}
        >
          <LucideIcon
            name="Square"
            size={24}
            color={!isPlaying || disabled ? undefined : tintColor}
          />
          <ThemedText style={[styles.buttonLabel, (!isPlaying || disabled) && styles.disabledText]}>
            Stop
          </ThemedText>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor }]}
          onPress={() => handlePress(onSave)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <LucideIcon
            name="Save"
            size={24}
            color={disabled ? undefined : tintColor}
          />
          <ThemedText style={[styles.buttonLabel, disabled && styles.disabledText]}>
            Save
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  mainButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.4,
  },
});
