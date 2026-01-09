import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Card Component
 * Container for grouped content with consistent styling
 */
export const Card = ({
  children,
  title,
  subtitle,
  style,
  contentStyle,
  headerStyle,
  padding = 16,
  borderRadius = 16,
  backgroundColor = '#FFFFFF',
  shadow = true,
}) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor,
      borderRadius,
      padding,
      ...(shadow && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }),
    },
    header: {
      marginBottom: title || subtitle ? 12 : 0,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1F2937',
      fontFamily: 'Inter',
      marginBottom: subtitle ? 4 : 0,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '400',
      color: '#6B7280',
      fontFamily: 'Inter',
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={[styles.card, style]}>
      {(title || subtitle) && (
        <View style={[styles.header, headerStyle]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

export default Card;
