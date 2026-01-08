import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Header Component
 * Consistent header for all screens
 */
export const Header = ({
  title,
  subtitle,
  onBackPress,
  rightAction,
  centerTitle = false,
  backgroundColor = '#FFFFFF',
  borderBottomColor = '#E5E7EB',
  showBorder = true,
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor,
      borderBottomColor: showBorder ? borderBottomColor : 'transparent',
      borderBottomWidth: showBorder ? 1 : 0,
    },
    leftSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: onBackPress ? 'flex-start' : 'center',
    },
    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    titleText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      fontFamily: 'Inter',
    },
    subtitleText: {
      fontSize: 14,
      fontWeight: '400',
      color: '#6B7280',
      fontFamily: 'Inter',
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Text style={{ fontSize: 24 }}>←</Text>
          </TouchableOpacity>
        )}
        {!centerTitle && (
          <View>
            <Text style={styles.titleText}>{title}</Text>
            {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
          </View>
        )}
      </View>

      {centerTitle && (
        <View style={styles.centerSection}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        </View>
      )}

      {rightAction && <View style={styles.rightSection}>{rightAction}</View>}
    </View>
  );
};

export default Header;
