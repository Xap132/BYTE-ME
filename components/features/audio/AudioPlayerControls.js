import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Audio Player Controls Component
 * Controls for playing, pausing, and seeking audio
 */
export const AudioPlayerControls = ({ 
  isPlaying = false, 
  onPlayPause,
  currentTime = 0,
  duration = 0,
  onSeek,
  audioTitle = 'Now Playing',
}) => {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: '#F3F4F6',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      fontFamily: 'Inter',
      marginBottom: 8,
    },
    audioTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1F2937',
      fontFamily: 'Inter',
      marginBottom: 12,
    },
    progressBar: {
      height: 4,
      backgroundColor: '#E5E7EB',
      borderRadius: 2,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#6366F1',
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    time: {
      fontSize: 12,
      color: '#6B7280',
      fontFamily: 'Inter',
      fontWeight: '500',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 44,
    },
    playButton: {
      flex: 1,
      backgroundColor: '#6366F1',
      minHeight: 48,
    },
    closeButton: {
      backgroundColor: '#E5E7EB',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    buttonText: {
      fontSize: 18,
    },
  });

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOW PLAYING</Text>
      <Text style={styles.audioTitle} numberOfLines={1}>{audioTitle}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={onPlayPause}
        >
          <Text style={styles.buttonText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.closeButton]}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayerControls;
