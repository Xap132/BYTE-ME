import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */
export const Button = ({
  children,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: '#6366F1',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: '#06B6D4',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: '#6366F1',
      borderWidth: 2,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
    },
  };

  const sizeStyles = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      minHeight: 32,
    },
    md: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      minHeight: 44,
    },
    lg: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      minHeight: 56,
    },
  };

  const textColorStyles = {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    outline: '#6366F1',
    ghost: '#6366F1',
  };

  const disabledStyles = disabled ? {
    opacity: 0.5,
  } : {};

  const styles = StyleSheet.create({
    button: {
      ...variantStyles[variant],
      ...sizeStyles[size],
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      width: fullWidth ? '100%' : 'auto',
      ...disabledStyles,
    },
    text: {
      color: textColorStyles[variant],
      fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18,
      fontWeight: '600',
      marginLeft: icon ? 8 : 0,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColorStyles[variant]} size={size === 'sm' ? 'small' : 'large'} />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.text, textStyle]}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
