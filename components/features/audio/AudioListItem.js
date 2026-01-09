import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Audio List Item Component
 * Display individual saved audio file
 */
export const AudioListItem = ({ 
  id,
  title, 
  duration, 
  date,
  isPlaying = false,
  onPress,
  onDelete,
  onMoreOptions,
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      fontFamily: 'Inter',
      marginBottom: 4,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    duration: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Inter',
    },
    date: {
      fontSize: 13,
      color: '#9CA3AF',
      fontFamily: 'Inter',
    },
    playIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    moreButton: {
      padding: 8,
    },
    moreText: {
      fontSize: 18,
      color: '#6B7280',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {isPlaying && <Text style={styles.playIcon}>▶️</Text>}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.meta}>
          <Text style={styles.duration}>{duration}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={onMoreOptions}>
        <Text style={styles.moreText}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AudioListItem;
