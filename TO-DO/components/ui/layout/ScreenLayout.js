import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

/**
 * Screen Layout Component
 * Wrapper for screen content with consistent padding and safe area
 */
export const ScreenLayout = ({
  children,
  backgroundColor = '#FFFFFF',
  padding = 16,
  scrollable = false,
  contentContainerStyle,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    content: {
      padding,
    },
    scrollContent: {
      paddingVertical: padding,
      paddingHorizontal: padding,
    },
  });

  const Content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        scrollEnabled={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );

  return <SafeAreaView style={styles.container}>{Content}</SafeAreaView>;
};

export default ScreenLayout;
