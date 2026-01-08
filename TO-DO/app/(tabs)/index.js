import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Play, Pause, Save, ChevronDown, Check, SkipBack, SkipForward, Square } from 'lucide-react-native';
import { ttsService } from '@/services/ttsService';
import { audioManager } from '@/services/audioManager';
import { storageService } from '@/services/storageService';
import { LANGUAGES, DEFAULT_SETTINGS, getLanguage } from '@/constants/voices';

export default function TTSScreen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('female');
  const [pitch, setPitch] = useState(DEFAULT_SETTINGS.pitch);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
      setIsPaused(false);
      await ttsService.speak({ text, language, voice, pitch, speed });
      setIsPlaying(false);
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Error', 'Failed to speak text');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    if (isPaused) {
      await ttsService.resume();
      setIsPaused(false);
    } else {
      await ttsService.pause();
      setIsPaused(true);
    }
  };

  const handleStop = async () => {
    await ttsService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleSkipBackward = async () => {
    await ttsService.skipBackward();
  };

  const handleSkipForward = async () => {
    await ttsService.skipForward();
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

  const handleLanguageSelect = (langId) => {
    setLanguage(langId);
    setShowLanguageModal(false);
  };

  const estimateDuration = () => {
    const wordsPerMinute = 150 * speed;
    const words = text.trim().split(/\s+/).length;
    const seconds = Math.ceil((words / wordsPerMinute) * 60);
    return seconds > 0 ? `~${seconds}s` : '~0s';
  };

  const currentLang = getLanguage(language);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Text to Speech</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Text Input Card */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Type or paste your text here..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>{text.length} characters</Text>
              <Text style={styles.duration}>{estimateDuration()}</Text>
            </View>
          </View>

          {/* Language Selector - Dropdown */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LANGUAGE</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.selectorFlag}>{currentLang?.flag || '🇺🇸'}</Text>
              <Text style={styles.selectorText}>{currentLang?.name || 'English'}</Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Voice Selector - Fixed: Female first, Male second */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>VOICE</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segment,
                  voice === 'female' && styles.segmentActive,
                ]}
                onPress={() => setVoice('female')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    voice === 'female' && styles.segmentTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segment,
                  voice === 'male' && styles.segmentActive,
                ]}
                onPress={() => setVoice('male')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    voice === 'male' && styles.segmentTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pitch Slider */}
          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Pitch</Text>
              <Text style={styles.sliderValue}>{pitch.toFixed(1)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              value={pitch}
              onValueChange={setPitch}
              step={0.1}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#2563EB"
            />
          </View>

          {/* Speed Slider */}
          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Speed</Text>
              <Text style={styles.sliderValue}>{speed.toFixed(1)}x</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              value={speed}
              onValueChange={setSpeed}
              step={0.1}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#2563EB"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.playButton, isLoading && styles.buttonDisabled]}
              onPress={handlePlay}
              disabled={isLoading || isPlaying}
            >
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Save size={18} color="#1F2937" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Sticky Playback Controls */}
        {isPlaying && (
          <View style={[styles.stickyPlayer, { paddingBottom: insets.bottom + 70 }]}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerTitle} numberOfLines={1}>
                {text.substring(0, 50)}{text.length > 50 ? '...' : ''}
              </Text>
              <Text style={styles.playerSubtitle}>
                {getLanguage(language)?.name} • {voice === 'male' ? 'Male' : 'Female'}
              </Text>
            </View>
            <View style={styles.playerControls}>
              <TouchableOpacity style={styles.playerBtn} onPress={handleSkipBackward}>
                <SkipBack size={22} color="#1F2937" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playerMainBtn} onPress={handlePause}>
                {isPaused ? (
                  <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.playerBtn} onPress={handleSkipForward}>
                <SkipForward size={22} color="#1F2937" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playerStopBtn} onPress={handleStop}>
                <Square size={18} color="#EF4444" fill="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleLanguageSelect(item.id)}
                >
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text style={styles.languageName}>{item.name}</Text>
                  {language === item.id && (
                    <Check size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Bold',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  inputCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#1F2937',
    minHeight: 140,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  charCount: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Medium',
    color: '#2563EB',
  },
  duration: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  selectorFlag: {
    fontSize: 18,
    marginRight: 12,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#1F2937',
  },
  sliderSection: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
  },
  sliderValue: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  playButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#1F2937',
  },
  // Sticky Player Styles
  stickyPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  playerInfo: {
    marginBottom: 12,
  },
  playerTitle: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  playerSubtitle: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 8,
  },
  playerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMainBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerStopBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
