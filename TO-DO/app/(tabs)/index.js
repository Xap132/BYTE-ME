import { LANGUAGES, DEFAULT_SETTINGS, getLanguage } from '@/constants/voices';
import { audioManager } from '@/services/audioManager';
import { storageService } from '@/services/storageService';
import { ttsService } from '@/services/ttsService';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function TTSScreen() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('female');
  const [pitch, setPitch] = useState(DEFAULT_SETTINGS.pitch);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await storageService.loadPreferences();
      if (prefs.defaultLanguage) setLanguage(prefs.defaultLanguage);
      if (prefs.defaultVoice) setVoice(prefs.defaultVoice);
      if (prefs.defaultPitch) setPitch(prefs.defaultPitch);
      if (prefs.defaultSpeed) setSpeed(prefs.defaultSpeed);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handlePlay = async () => {
    if (!text.trim()) {
      Alert.alert('Empty Text', 'Please enter some text to speak');
      return;
    }

    try {
      setIsLoading(true);
      setIsPlaying(true);
      await ttsService.speak({ text, language, voice, pitch, speed });
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Error', 'Failed to speak text');
    } finally {
      setIsLoading(false);
      setIsPlaying(false);
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
      Alert.alert('Empty Text', 'Please enter some text before saving');
      return;
    }

    try {
      setIsLoading(true);
      const prefs = await storageService.loadPreferences();
      await audioManager.saveAudioFile(
        text,
        { language, voice, pitch, speed },
        prefs.audioFormat || 'mp3'
      );
      Alert.alert('Saved!', 'Added to your Library');
    } catch (error) {
      console.error('Save Error:', error);
      Alert.alert('Error', 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const currentLang = getLanguage(language);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎙️ Text to Speech</Text>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type or paste your text here..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{text.length} characters</Text>
          </View>

          {/* Quick Settings Row */}
          <View style={styles.quickSettings}>
            {/* Language Selector */}
            <View style={styles.settingBox}>
              <Text style={styles.settingLabel}>Language</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {LANGUAGES.map((lang) => (
                    <Pressable
                      key={lang.id}
                      style={[
                        styles.pill,
                        language === lang.id && styles.pillActive,
                      ]}
                      onPress={() => setLanguage(lang.id)}
                    >
                      <Text style={styles.pillEmoji}>{lang.flag}</Text>
                      <Text
                        style={[
                          styles.pillText,
                          language === lang.id && styles.pillTextActive,
                        ]}
                      >
                        {lang.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Voice Type */}
            <View style={styles.settingBox}>
              <Text style={styles.settingLabel}>Voice</Text>
              <View style={styles.voiceButtons}>
                <Pressable
                  style={[
                    styles.voiceBtn,
                    voice === 'male' && styles.voiceBtnActive,
                  ]}
                  onPress={() => setVoice('male')}
                >
                  <Text style={styles.voiceEmoji}>👨</Text>
                  <Text
                    style={[
                      styles.voiceBtnText,
                      voice === 'male' && styles.voiceBtnTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.voiceBtn,
                    voice === 'female' && styles.voiceBtnActive,
                  ]}
                  onPress={() => setVoice('female')}
                >
                  <Text style={styles.voiceEmoji}>👩</Text>
                  <Text
                    style={[
                      styles.voiceBtnText,
                      voice === 'female' && styles.voiceBtnTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Sliders */}
          <View style={styles.slidersContainer}>
            {/* Speed Slider */}
            <View style={styles.sliderBox}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>⚡ Speed</Text>
                <Text style={styles.sliderValue}>{speed.toFixed(1)}x</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.25}
                maximumValue={2.0}
                step={0.1}
                value={speed}
                onValueChange={setSpeed}
                minimumTrackTintColor="#6366F1"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#6366F1"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderMinMax}>Slow</Text>
                <Text style={styles.sliderMinMax}>Fast</Text>
              </View>
            </View>

            {/* Pitch Slider */}
            <View style={styles.sliderBox}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>🎵 Pitch</Text>
                <Text style={styles.sliderValue}>{pitch.toFixed(1)}x</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.1}
                value={pitch}
                onValueChange={setPitch}
                minimumTrackTintColor="#6366F1"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#6366F1"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderMinMax}>Low</Text>
                <Text style={styles.sliderMinMax}>High</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Controls */}
        <View style={styles.bottomControls}>
          <Pressable
            style={[styles.saveBtn, !text.trim() && styles.btnDisabled]}
            onPress={handleSave}
            disabled={!text.trim() || isLoading}
          >
            <Text style={styles.saveBtnText}>💾 Save</Text>
          </Pressable>

          <Pressable
            style={[
              styles.playBtn,
              isPlaying && styles.stopBtn,
              !text.trim() && styles.btnDisabled,
            ]}
            onPress={isPlaying ? handleStop : handlePlay}
            disabled={!text.trim() || isLoading}
          >
            <Text style={styles.playBtnText}>
              {isLoading ? '⏳' : isPlaying ? '⏹️ Stop' : '▶️ Play'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    maxHeight: 200,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  quickSettings: {
    marginBottom: 16,
  },
  settingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  pillActive: {
    backgroundColor: '#6366F1',
  },
  pillEmoji: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  voiceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  voiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  voiceBtnActive: {
    backgroundColor: '#6366F1',
  },
  voiceEmoji: {
    fontSize: 20,
  },
  voiceBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  voiceBtnTextActive: {
    color: '#FFFFFF',
  },
  slidersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sliderBox: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderMinMax: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  playBtn: {
    flex: 2,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  stopBtn: {
    backgroundColor: '#EF4444',
  },
  playBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
