import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

export function AudioListItem({
  audioFile,
  onPlay,
  onDelete,
  onEdit,
  isPlaying = false,
}) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');

  const handleDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Delete Audio',
      'Are you sure you want to delete this audio file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(audioFile),
        },
      ]
    );
  };

  const handlePlay = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPlay(audioFile);
  };

  const handleEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit(audioFile);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor, borderColor }]}>
      {/* Play Button */}
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: isPlaying ? tintColor : 'transparent' }]}
        onPress={handlePlay}
        activeOpacity={0.7}
      >
        <LucideIcon
          name={isPlaying ? 'Pause' : 'Play'}
          size={24}
          color={isPlaying ? '#FFFFFF' : tintColor}
        />
      </TouchableOpacity>

      {/* Audio Info */}
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {audioFile.name}
        </ThemedText>
        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <LucideIcon name="Calendar" size={12} />
            <ThemedText style={styles.metadataText}>
              {formatDate(audioFile.dateCreated)}
            </ThemedText>
          </View>
          <View style={styles.metadataItem}>
            <LucideIcon name="Clock" size={12} />
            <ThemedText style={styles.metadataText}>
              {formatDuration(audioFile.duration)}
            </ThemedText>
          </View>
          <View style={styles.metadataItem}>
            <LucideIcon name="Languages" size={12} />
            <ThemedText style={styles.metadataText}>
              {audioFile.language === 'en' ? 'English' : 'Filipino'}
            </ThemedText>
          </View>
        </View>
        {audioFile.text && (
          <ThemedText style={styles.preview} numberOfLines={1}>
            {audioFile.text}
          </ThemedText>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEdit}
          activeOpacity={0.7}
        >
          <LucideIcon name="Edit" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <LucideIcon name="Trash2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'currentColor',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    opacity: 0.6,
  },
  preview: {
    fontSize: 12,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
