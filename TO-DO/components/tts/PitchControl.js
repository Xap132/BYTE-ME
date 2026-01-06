import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEFAULT_SETTINGS } from '@/constants/voices';

export function PitchControl({ value, onChange }) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <LucideIcon name="Music" size={20} color={iconColor} />
          <ThemedText type="defaultSemiBold">Pitch</ThemedText>
        </View>
        <ThemedText style={styles.value}>{value.toFixed(2)}x</ThemedText>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={DEFAULT_SETTINGS.minPitch}
        maximumValue={DEFAULT_SETTINGS.maxPitch}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={tintColor}
        maximumTrackTintColor={iconColor}
        thumbTintColor={tintColor}
        step={0.1}
      />

      <View style={styles.labels}>
        <ThemedText style={styles.labelText}>
          {DEFAULT_SETTINGS.minPitch}x (Low)
        </ThemedText>
        <ThemedText style={styles.labelText}>
          {DEFAULT_SETTINGS.maxPitch}x (High)
        </ThemedText>
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  labelText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
