import { ThemedText } from '@/components/themed-text';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * Audio player controls with play/pause, skip forward/backward
 */
export function AudioPlayerControls({
  isPlaying = false,
  isLoading = false,
  onPlay,
  onPause,
  onSkipForward,
  onSkipBackward,
  onStop,
  disabled = false,
  currentTime = 0,
  duration = 0,
}) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');

  const handlePlayPause = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const handleSkipBackward = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkipBackward?.();
  };

  const handleSkipForward = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkipForward?.();
  };

  const handleStop = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onStop?.();
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Time Display */}
      {duration > 0 && (
        <View style={styles.timeContainer}>
          <ThemedText style={styles.timeText}>
            {formatTime(currentTime)}
          </ThemedText>
          <ThemedText style={styles.timeText}>/</ThemedText>
          <ThemedText style={styles.timeText}>
            {formatTime(duration)}
          </ThemedText>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Skip Backward -10s */}
        <TouchableOpacity
          onPress={handleSkipBackward}
          disabled={disabled || !isPlaying}
          style={[
            styles.secondaryButton,
            (disabled || !isPlaying) && styles.disabledButton,
          ]}
        >
          <LucideIcon
            name="RotateCcw"
            size={24}
            color={(disabled || !isPlaying) ? borderColor : textColor}
          />
          <ThemedText style={[
            styles.skipLabel,
            (disabled || !isPlaying) && styles.disabledText,
          ]}>
            10s
          </ThemedText>
        </TouchableOpacity>

        {/* Main Play/Pause Button */}
        <TouchableOpacity
          onPress={handlePlayPause}
          disabled={disabled}
          style={[
            styles.mainButton,
            { backgroundColor: disabled ? borderColor : tintColor },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <LucideIcon
              name={isPlaying ? 'Pause' : 'Play'}
              size={32}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>

        {/* Skip Forward +10s */}
        <TouchableOpacity
          onPress={handleSkipForward}
          disabled={disabled || !isPlaying}
          style={[
            styles.secondaryButton,
            (disabled || !isPlaying) && styles.disabledButton,
          ]}
        >
          <LucideIcon
            name="RotateCw"
            size={24}
            color={(disabled || !isPlaying) ? borderColor : textColor}
          />
          <ThemedText style={[
            styles.skipLabel,
            (disabled || !isPlaying) && styles.disabledText,
          ]}>
            10s
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Stop Button */}
      {isPlaying && (
        <TouchableOpacity
          onPress={handleStop}
          disabled={disabled}
          style={[
            styles.stopButton,
            { borderColor: disabled ? borderColor : tintColor },
          ]}
        >
          <LucideIcon
            name="Square"
            size={20}
            color={disabled ? borderColor : tintColor}
          />
          <ThemedText style={[
            styles.stopLabel,
            { color: disabled ? borderColor : tintColor },
          ]}>
            Stop
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  secondaryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  disabledButton: {
    opacity: 0.3,
  },
  skipLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  disabledText: {
    opacity: 0.3,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  stopLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
