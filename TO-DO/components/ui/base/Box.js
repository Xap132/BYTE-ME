import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Base Box Component
 * Generic container for layout composition
 */
export const Box = ({
  children,
  style,
  row = false,
  center = false,
  padding = 0,
  margin = 0,
  gap = 0,
  flex = 0,
  backgroundColor,
  borderRadius = 0,
  borderColor,
  borderWidth = 0,
  ...props
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: row ? 'row' : 'column',
      alignItems: center ? 'center' : 'flex-start',
      justifyContent: center ? 'center' : 'flex-start',
      padding,
      margin,
      gap,
      flex: flex || 0,
      backgroundColor,
      borderRadius,
      borderColor,
      borderWidth,
    },
  });

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

export default Box;
