import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControl from '@/components/ui/base/SegmentedControl';
import Card from '@/components/ui/base/Card';

/**
 * Voice Selector Feature Component
 * Select male or female voice
 */
export const VoiceSelector = ({ 
  selectedVoice = 'female', 
  onVoiceChange,
}) => {
  const styles = StyleSheet.create({
    container: {
      marginVertical: 12,
    },
    header: {
      marginBottom: 12,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      fontFamily: 'Inter',
    },
  });

  const voiceOptions = ['Female', 'Male'];
  const selectedIndex = selectedVoice === 'female' ? 0 : 1;

  const handleVoiceChange = (index) => {
    onVoiceChange(index === 0 ? 'female' : 'male');
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voice</Text>
      </View>
      <SegmentedControl
        options={voiceOptions}
        selectedIndex={selectedIndex}
        onValueChange={handleVoiceChange}
      />
    </Card>
  );
};

export default VoiceSelector;
