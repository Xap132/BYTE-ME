import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * SegmentedControl Component
 * Toggle between multiple options
 */
export const SegmentedControl = ({
  options,
  selectedIndex,
  onValueChange,
  style,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      padding: 4,
      gap: 0,
    },
    segment: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    segmentActive: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    segmentInactive: {
      backgroundColor: 'transparent',
    },
    text: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Inter',
    },
    textActive: {
      color: '#6366F1',
    },
    textInactive: {
      color: '#6B7280',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            selectedIndex === index ? styles.segmentActive : styles.segmentInactive,
          ]}
          onPress={() => onValueChange(index)}
        >
          <Text
            style={[
              styles.text,
              selectedIndex === index ? styles.textActive : styles.textInactive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SegmentedControl;
