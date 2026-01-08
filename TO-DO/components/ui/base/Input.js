import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

/**
 * Input Component
 * Reusable text input field with consistent styling
 */
export const Input = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  style,
  editable = true,
  ...props
}) => {
  const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#1F2937',
      fontFamily: 'Inter',
      minHeight: multiline ? 120 : 44,
    },
  });

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      keyboardType={keyboardType}
      editable={editable}
      style={[styles.input, style]}
      {...props}
    />
  );
};

export default Input;
