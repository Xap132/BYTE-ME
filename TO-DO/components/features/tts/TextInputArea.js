import Button from '@/components/ui/base/Button';
import Card from '@/components/ui/base/Card';
import Input from '@/components/ui/base/Input';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * TextInput Feature Component
 * Handles text input for TTS
 */
export const TextInputArea = ({ 
  value, 
  onChangeText, 
  maxCharacters = 5000,
  onClear,
}) => {
  const charCount = value?.length || 0;
  const percentage = (charCount / maxCharacters) * 100;
  const isNearLimit = percentage > 80;

  const styles = StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      minHeight: 180,
      paddingVertical: 16,
      paddingHorizontal: 16,
      textAlignVertical: 'top',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingHorizontal: 8,
    },
    charCounter: {
      fontSize: 12,
      fontWeight: '500',
      color: isNearLimit ? '#EF4444' : '#6B7280',
      fontFamily: 'Inter',
    },
    clearButton: {
      padding: 4,
    },
  });

  return (
    <Card style={styles.container} padding={0}>
      <View style={styles.inputWrapper}>
        <Input
          placeholder="Type or paste your text here..."
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={10}
          maxLength={maxCharacters}
          style={styles.input}
        />
      </View>
      <View style={styles.footer}>
        <View>
          <View style={{ marginBottom: 4, height: 4, width: 40, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
            <View
              style={{
                height: 4,
                width: `${percentage}%`,
                backgroundColor: isNearLimit ? '#EF4444' : '#6366F1',
                borderRadius: 2,
              }}
            />
          </View>
          <Text style={styles.charCounter}>
            {charCount} / {maxCharacters}
          </Text>
        </View>
        {charCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onPress={onClear}
            style={styles.clearButton}
          >
            Clear
          </Button>
        )}
      </View>
    </Card>
  );
};

export default TextInputArea;
