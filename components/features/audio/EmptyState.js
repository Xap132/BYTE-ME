import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Empty State Component
 * Display when no saved audio files exist
 */
export const EmptyState = ({ 
  title = 'No Saved Audio',
  description = 'Start by creating and saving your first audio file!',
  icon = '🎙️',
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 60,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
    },
    icon: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1F2937',
      fontFamily: 'Inter',
      marginBottom: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: '#6B7280',
      fontFamily: 'Inter',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default EmptyState;
