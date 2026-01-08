import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

/**
 * Slider Component
 * Reusable slider for numeric values (pitch, speed, volume, etc.)
 */
export const SliderComponent = ({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.1,
  suffix = '',
  showValue = true,
  style,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginVertical: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#1F2937',
      fontFamily: 'Inter',
    },
    value: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6366F1',
      fontFamily: 'Inter',
    },
    slider: {
      width: '100%',
      height: 40,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {showValue && (
            <Text style={styles.value}>
              {(typeof value === 'number' ? value.toFixed(1) : value)}{suffix}
            </Text>
          )}
        </View>
      )}
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onValueChange={onValueChange}
        step={step}
        minimumTrackTintColor="#6366F1"
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor="#6366F1"
      />
    </View>
  );
};

export default SliderComponent;
