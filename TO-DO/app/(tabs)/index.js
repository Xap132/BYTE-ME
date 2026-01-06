import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TextInputArea } from '@/components/tts/TextInputArea';
import { VoiceSelector } from '@/components/tts/VoiceSelector';
import { PitchControl } from '@/components/tts/PitchControl';
import { SpeedControl } from '@/components/tts/SpeedControl';
import { PlaybackControls } from '@/components/tts/PlaybackControls';
import { ttsService } from '@/services/ttsService';
import { audioManager } from '@/services/audioManager';
import { storageService } from '@/services/storageService';
import { DEFAULT_SETTINGS } from '@/constants/voices';

export default function TTSScreen() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('female');
  const [pitch, setPitch] = useState(DEFAULT_SETTINGS.pitch);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await storageService.loadPreferences();
      setLanguage(prefs.defaultLanguage);
      setVoice(prefs.defaultVoice);
      setPitch(prefs.defaultPitch);
      setSpeed(prefs.defaultSpeed);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handlePlay = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text to speak');
      return;
    }

    try {
      setIsLoading(true);
      await ttsService.speak({
        text,
        language,
        voice,
        pitch,
        speed,
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Error', 'Failed to speak text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      await ttsService.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Pause Error:', error);
    }
  };

  const handleStop = async () => {
    try {
      await ttsService.stop();
      setIsPlaying(false);
    } catch (error) {
      console.error('Stop Error:', error);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text before saving');
      return;
    }

    try {
      setIsLoading(true);
      
      // Save the text and settings
      const prefs = await storageService.loadPreferences();
      const audioFile = await audioManager.saveAudioFile(
        text,
        { language, voice, pitch, speed },
        prefs.audioFormat
      );
      
      console.log('Audio file saved:', audioFile);
      Alert.alert(
        'Saved!', 
        `"${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" saved to Library!\n\nYou can replay it anytime from the Library tab.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Save Error:', error);
      Alert.alert('Error', `Failed to save: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title">Text to Speech</ThemedText>
          <ThemedText style={styles.subtitle}>
            Convert your text to natural-sounding speech
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <TextInputArea
            value={text}
            onChangeText={setText}
            placeholder="Enter text to speak..."
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <VoiceSelector
            selectedVoice={voice}
            onVoiceChange={setVoice}
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <PitchControl value={pitch} onChange={setPitch} />
        </ThemedView>

        <ThemedView style={styles.section}>
          <SpeedControl value={speed} onChange={setSpeed} />
        </ThemedView>

        <ThemedView style={styles.section}>
          <PlaybackControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSave={handleSave}
            disabled={!text.trim()}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
});
