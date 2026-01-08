import Button from '@/components/ui/base/Button';
import Card from '@/components/ui/base/Card';
import Input from '@/components/ui/base/Input';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * TextInput Feature Component with Word Highlighting
 * Handles text input for TTS with visual highlighting of current word
 */
export const TextInputArea = ({ 
  value, 
  onChangeText, 
  maxCharacters = 5000,
  onClear,
  currentWordIndex = -1, // Index of currently playing word
  isPlaying = false, // Whether TTS is currently playing
}) => {
  const charCount = value?.length || 0;
  const percentage = (charCount / maxCharacters) * 100;
  const isNearLimit = percentage > 80;

  // Split text into words for highlighting
  const words = value ? value.split(/(\s+)/) : [];
  let wordIndex = -1;

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
    highlightOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      minHeight: 180,
      paddingVertical: 16,
      paddingHorizontal: 16,
      pointerEvents: 'none',
      backgroundColor: 'transparent',
    },
    highlightText: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'System',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    word: {
      fontSize: 16,
      lineHeight: 24,
      color: 'transparent',
    },
    highlightedWord: {
      fontSize: 16,
      lineHeight: 24,
      backgroundColor: '#FDE047', // Yellow highlight
      color: '#1F2937',
      fontWeight: '600',
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
        
        {/* Word highlight overlay - only show when playing */}
        {isPlaying && currentWordIndex >= 0 && (
          <View style={styles.highlightOverlay}>
            <Text style={styles.highlightText}>
              {words.map((segment, idx) => {
                // Only count non-whitespace segments as words
                if (segment.trim().length > 0) {
                  wordIndex++;
                  const isHighlighted = wordIndex === currentWordIndex;
                  return (
                    <Text
                      key={idx}
                      style={isHighlighted ? styles.highlightedWord : styles.word}
                    >
                      {segment}
                    </Text>
                  );
                } else {
                  // Preserve whitespace
                  return <Text key={idx} style={styles.word}>{segment}</Text>;
                }
              })}
            </Text>
          </View>
        )}
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
