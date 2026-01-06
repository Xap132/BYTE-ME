import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';

export function EmptyState({
  title = 'No Audio Files',
  message = 'Saved audio files will appear here',
  iconName = 'FileAudio',
}) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.iconContainer}>
        <LucideIcon name={iconName} size={64} color={iconColor} style={{ opacity: 0.3 }} />
      </View>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.6,
  },
});
