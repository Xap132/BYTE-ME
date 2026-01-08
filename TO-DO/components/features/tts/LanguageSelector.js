import Card from '@/components/ui/base/Card';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Language Selector Feature Component
 * Select TTS language
 */
export const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange,
  languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
    { id: 'de', label: 'German' },
    { id: 'it', label: 'Italian' },
    { id: 'pt', label: 'Portuguese' },
    { id: 'ja', label: 'Japanese' },
    { id: 'ko', label: 'Korean' },
    { id: 'zh', label: 'Mandarin' },
    { id: 'fil', label: 'Filipino' },
  ],
}) => {
  const styles = StyleSheet.create({
    container: {
      marginVertical: 12,
    },
    header: {
      marginBottom: 12,
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    languageButton: {
      flex: 1,
      minWidth: '48%',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    languageButtonActive: {
      backgroundColor: '#6366F1',
      borderColor: '#6366F1',
    },
    languageButtonInactive: {
      backgroundColor: '#F3F4F6',
      borderColor: '#E5E7EB',
    },
    languageText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Inter',
    },
    languageTextActive: {
      color: '#FFFFFF',
    },
    languageTextInactive: {
      color: '#4B5563',
    },
  });

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>Language</Text>
      </View>
      <View style={styles.languageGrid}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            style={[
              styles.languageButton,
              selectedLanguage === lang.id
                ? styles.languageButtonActive
                : styles.languageButtonInactive,
            ]}
            onPress={() => onLanguageChange(lang.id)}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === lang.id
                  ? styles.languageTextActive
                  : styles.languageTextInactive,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

export default LanguageSelector;
