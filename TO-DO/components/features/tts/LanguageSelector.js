import Card from '@/components/ui/base/Card';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Language Selector Feature Component
 * Select TTS language with dynamic detection
 * Priority languages (US, UK, Filipino) shown first, then others
 */
export const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange,
  languages = [],
  loading = false,
}) => {
  // Separate priority and other languages
  const priorityLanguages = languages.filter(lang => lang.isPriority);
  const otherLanguages = languages.filter(lang => !lang.isPriority);

  const styles = StyleSheet.create({
    container: {
      marginVertical: 12,
    },
    header: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      fontFamily: 'Inter',
      marginTop: 12,
      marginBottom: 8,
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    languageButton: {
      minWidth: '48%',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
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
      marginLeft: 6,
    },
    languageTextActive: {
      color: '#FFFFFF',
    },
    languageTextInactive: {
      color: '#4B5563',
    },
    loadingText: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
      paddingVertical: 16,
    },
    emptyText: {
      fontSize: 14,
      color: '#9CA3AF',
      textAlign: 'center',
      paddingVertical: 16,
      fontStyle: 'italic',
    },
  });

  if (loading) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>Language</Text>
        </View>
        <Text style={styles.loadingText}>Loading available languages...</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>Language</Text>
      </View>
      
      {/* Priority Languages */}
      {priorityLanguages.length > 0 && (
        <View style={styles.languageGrid}>
          {priorityLanguages.map((lang) => (
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
              <Text style={{ fontSize: 18 }}>{lang.flag}</Text>
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === lang.id
                    ? styles.languageTextActive
                    : styles.languageTextInactive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Other Languages Section */}
      {otherLanguages.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>OTHER LANGUAGES</Text>
          <ScrollView 
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.languageGrid}>
              {otherLanguages.map((lang) => (
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
                  <Text style={{ fontSize: 18 }}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      selectedLanguage === lang.id
                        ? styles.languageTextActive
                        : styles.languageTextInactive,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {/* No languages available */}
      {languages.length === 0 && (
        <Text style={styles.emptyText}>No languages available</Text>
      )}
    </Card>
  );
};

export default LanguageSelector;
