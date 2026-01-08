import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Card from '@/components/ui/base/Card';

/**
 * Settings Switch Item Component
 * Toggle setting with label
 */
export const SettingsSwitchItem = ({
  label,
  description,
  value,
  onValueChange,
  icon = '⚙️',
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      fontSize: 20,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      fontFamily: 'Inter',
      marginBottom: description ? 2 : 0,
    },
    description: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Inter',
    },
    switch: {
      marginLeft: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
      <Switch
        style={styles.switch}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#A5F3FC' }}
        thumbColor={value ? '#06B6D4' : '#D1D5DB'}
      />
    </View>
  );
};

export default SettingsSwitchItem;
