import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Settings Action Item Component
 * Clickable setting item with optional destructive styling
 */
export const SettingsActionItem = ({
  label,
  description,
  onPress,
  icon = '⚙️',
  destructive = false,
  rightText,
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
      color: destructive ? '#EF4444' : '#1F2937',
      fontFamily: 'Inter',
      marginBottom: description ? 2 : 0,
    },
    description: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Inter',
    },
    rightContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
    },
    rightText: {
      fontSize: 14,
      color: '#9CA3AF',
      fontFamily: 'Inter',
      marginRight: 8,
    },
    arrow: {
      fontSize: 16,
      color: '#D1D5DB',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
      <View style={styles.rightContent}>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsActionItem;
