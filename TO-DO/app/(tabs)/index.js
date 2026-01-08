import { DEFAULT_SETTINGS, getLanguage } from '@/constants/voices';
import { audioManager } from '@/services/audioManager';
import { storageService } from '@/services/storageService';
import { ttsService } from '@/services/ttsService';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Check, ChevronDown, Download, Pause, Play, Save, Square } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TTSScreen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en_us_f');
  const [pitch, setPitch] = useState(DEFAULT_SETTINGS.pitch);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  
  // Dynamic languages state
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  
  // Sentence timing ref
  const sentenceTimerRef = useRef(null);
  const sentencesRef = useRef([]);
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);

  useEffect(() => {
    loadPreferences();
    loadAvailableLanguages();
    
    return () => {
      if (sentenceTimerRef.current) clearInterval(sentenceTimerRef.current);
      ttsService.stop();
    };
  }, []);

  const loadAvailableLanguages = async () => {
    try {
      setLoadingLanguages(true);
      const languages = await ttsService.getLanguageOptions();
      setAvailableLanguages(languages);
    } catch (error) {
      console.error('Error loading languages:', error);
      setAvailableLanguages([
        { id: 'en_us_f', name: 'English (US)', flag: '🇺🇸', isPriority: true },
        { id: 'en_uk_m', name: 'English (UK)', flag: '🇬🇧', isPriority: true },
        { id: 'fil_f', name: 'Filipino', flag: '🇵🇭', isPriority: true },
      ]);
    } finally {
      setLoadingLanguages(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await storageService.loadPreferences();
      if (prefs.defaultPresetLanguage) setLanguage(prefs.defaultPresetLanguage);
      else if (prefs.defaultLanguage) setLanguage(prefs.defaultLanguage);
      if (prefs.defaultPitch) setPitch(prefs.defaultPitch);
      if (prefs.defaultSpeed) setSpeed(prefs.defaultSpeed);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleImportFile = async () => {
    try {
      // Allow multiple file types: TXT (full support), DOCX/PDF (development build required)
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain', // Only TXT files for now in Expo Go
      });
      
      if (result.canceled) return;
      
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileName = file.name || '';
        const fileExtension = fileName.split('.').pop().toLowerCase();
        
        console.log('Selected file:', fileName, 'Type:', fileExtension);
        
        let content = '';
        
        if (fileExtension === 'txt') {
          // Read TXT file directly - with web platform check
          if (Platform.OS === 'web') {
            // Web platform - use different approach
            const response = await fetch(file.uri);
            content = await response.text();
          } else {
            // Mobile platform - use file system
            content = await FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' });
          }
        } else if (fileExtension === 'pdf') {
          Alert.alert('PDF Support', 'PDF extraction requires a development build. Please use TXT or DOCX files for now.');
          return;
        } else if (fileExtension === 'docx') {
          // DOCX support requires development build
          Alert.alert(
            'DOCX Support', 
            'DOCX files require a development build with native dependencies. Please:\n\n1. Convert your DOCX to TXT first, or\n2. Copy and paste the text directly\n\nSupported formats: TXT, PDF (dev build)'
          );
          return;
        } else {
          Alert.alert('Unsupported Format', `${fileExtension.toUpperCase()} not supported. Use TXT, DOCX, or PDF.`);
          return;
        }
        
        if (content.trim()) {
          setText(content);
          Alert.alert('Success', `Imported: ${fileName}`);
        } else {
          Alert.alert('Warning', 'File is empty or couldn\'t extract text.');
        }
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', 'Failed to import file. Please select a .txt file.');
    }
  };

  // Split text into sentences
  const getSentences = (inputText) => {
    // Split by sentence endings (.!?) but keep the punctuation
    return inputText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  };

  // Calculate estimated duration per sentence based on word count
  const getSentenceDuration = (sentence) => {
    const words = sentence.trim().split(/\s+/).length;
    // ~150 words per minute at 1.0x speed = ~400ms per word
    return (words * 400) / speed;
  };

  // Start sentence highlighting
  const startSentenceHighlighting = (fromIndex = 0, elapsedOffset = 0) => {
    sentencesRef.current = getSentences(text);
    setCurrentWordIndex(fromIndex); // Using wordIndex for sentence index
    startTimeRef.current = Date.now() - elapsedOffset;
    
    if (sentenceTimerRef.current) clearInterval(sentenceTimerRef.current);
    
    // Calculate cumulative durations
    let cumulativeDurations = [];
    let total = 0;
    sentencesRef.current.forEach((sentence, idx) => {
      total += getSentenceDuration(sentence);
      cumulativeDurations.push(total);
    });
    
    const totalDuration = total;
    
    sentenceTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Find which sentence we're on based on elapsed time
      let currentSentence = fromIndex;
      for (let i = fromIndex; i < cumulativeDurations.length; i++) {
        if (elapsed < cumulativeDurations[i] - (fromIndex > 0 ? cumulativeDurations[fromIndex - 1] || 0 : 0)) {
          currentSentence = i;
          break;
        }
        currentSentence = i;
      }
      
      setCurrentWordIndex(currentSentence);
      const newProgress = Math.min(elapsed / totalDuration, 1);
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        handlePlaybackComplete();
      }
    }, 100);
  };

  const stopSentenceHighlighting = () => {
    if (sentenceTimerRef.current) {
      clearInterval(sentenceTimerRef.current);
      sentenceTimerRef.current = null;
    }
    setCurrentWordIndex(-1);
    setProgress(0);
  };

  const handlePlaybackComplete = () => {
    stopSentenceHighlighting();
    setIsPlaying(false);
    setIsPaused(false);
    setIsAudioReady(false); // Close player when audio completes
  };

  const handlePlay = async () => {
    if (!text.trim()) {
      Alert.alert('Empty Text', 'Please enter some text to speak');
      return;
    }

    if (isPlaying && !isPaused) return;

    try {
      setIsLoading(true);
      setIsPlaying(true);
      setIsPaused(false);
      pausedTimeRef.current = 0;
      setIsAudioReady(false); // Don't show UI until audio starts
      
      // Set callback for when audio actually starts
      ttsService.setOnStartCallback(() => {
        console.log('[TTS] Audio started, showing player');
        setIsAudioReady(true);
        startSentenceHighlighting(0, 0);
      });
      
      // Set callback for when audio finishes
      ttsService.setOnDoneCallback(() => {
        console.log('[TTS] Audio finished');
        handlePlaybackComplete();
      });
      
      await ttsService.speak({ text, language, pitch, speed });
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Error', 'Failed to speak text');
      setIsPlaying(false);
      setIsPaused(false);
      setIsAudioReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      setIsPlaying(true);
      startSentenceHighlighting(currentWordIndex, pausedTimeRef.current);
      await ttsService.resume();
    } else if (isPlaying) {
      // Pause - save current position
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      setIsPlaying(false);
      setIsPaused(true);
      if (sentenceTimerRef.current) {
        clearInterval(sentenceTimerRef.current);
        sentenceTimerRef.current = null;
      }
      await ttsService.pause();
    }
  };

  const handleStop = async () => {
    await ttsService.stop();
    stopSentenceHighlighting();
    setIsPlaying(false);
    setIsPaused(false);
    setIsAudioReady(false); // Close player when stop is pressed
  };

  const handleRestart = async () => {
    await handleStop();
    setTimeout(() => handlePlay(), 100);
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
        { language, pitch, speed },
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

  const handleLanguageSelect = async (langId) => {
    setLanguage(langId);
    setShowLanguageModal(false);
    try {
      const prefs = await storageService.loadPreferences();
      await storageService.savePreferences({ ...prefs, defaultPresetLanguage: langId });
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const estimateDuration = () => {
    const wordsPerMinute = 150 * speed;
    const words = text.trim().split(/\s+/).length;
    const seconds = Math.ceil((words / wordsPerMinute) * 60);
    return seconds > 0 ? `~${seconds}s` : '~0s';
  };

  // Render text with SENTENCE highlighting
  const renderHighlightedText = () => {
    if (!text) return null;
    
    const sentences = getSentences(text);
    
    return sentences.map((sentence, idx) => {
      const isHighlighted = idx === currentWordIndex && (isPlaying || isPaused);
      
      return (
        <Text 
          key={idx}
          style={[
            styles.textSentence,
            isHighlighted && styles.textSentenceHighlighted
          ]}
        >
          {sentence}{idx < sentences.length - 1 ? ' ' : ''}
        </Text>
      );
    });
  };

  const currentLang = availableLanguages.find(l => l.id === language) || getLanguage(language);

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
          {/* Text Input Card - with sentence highlighting when playing */}
          <View style={styles.inputCard}>
            {(isPlaying || isPaused) && text ? (
              <ScrollView style={styles.highlightContainer} nestedScrollEnabled>
                <Text style={styles.highlightText}>
                  {renderHighlightedText()}
                </Text>
              </ScrollView>
            ) : (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type or paste your text here..."
                  placeholderTextColor="#9CA3AF"
                  value={text}
                  onChangeText={setText}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            )}
            
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>{text.length} characters</Text>
              <Text style={styles.duration}>{estimateDuration()}</Text>
              <TouchableOpacity style={styles.importBtn} onPress={handleImportFile}>
                <Download size={14} color="#6B7280" />
                <Text style={styles.importBtnText}>Import</Text>
              </TouchableOpacity>
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

        {/* Sticky Playback Controls - Only show after audio is ready */}
        {isAudioReady && (
          <View style={[styles.stickyPlayer, { paddingBottom: insets.bottom + 70 }]}>
            <View style={styles.playerHeader}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerTitle} numberOfLines={1}>
                  {text.substring(0, 40)}{text.length > 40 ? '...' : ''}
                </Text>
                <Text style={styles.playerSubtitle}>
                  {currentLang?.name || 'English'} • {Math.round(progress * 100)}%
                </Text>
              </View>
            </View>
            
            {/* Control Buttons Row */}
            <View style={styles.playerControls}>
              {/* Play/Pause Main Button */}
              <TouchableOpacity style={styles.playerMainBtn} onPress={handlePause}>
                {isPaused ? (
                  <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>
              
              {/* Stop */}
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
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Language</Text>
            
            {loadingLanguages ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ color: '#6B7280' }}>Loading languages...</Text>
              </View>
            ) : (
              <FlatList
                data={availableLanguages}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 400 }}
                showsVerticalScrollIndicator={true}
                ListHeaderComponent={
                  availableLanguages.filter(l => l.isPriority).length > 0 ? (
                    <Text style={styles.modalSectionTitle}>RECOMMENDED</Text>
                  ) : null
                }
                renderItem={({ item, index }) => {
                  const isFirstOther = !item.isPriority && 
                    (index === 0 || availableLanguages[index - 1]?.isPriority);
                  return (
                    <>
                      {isFirstOther && (
                        <Text style={[styles.modalSectionTitle, { marginTop: 16 }]}>OTHER LANGUAGES</Text>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.languageItem,
                          language === item.id && styles.languageItemSelected
                        ]}
                        onPress={() => handleLanguageSelect(item.id)}
                      >
                        <Text style={styles.languageFlag}>{item.flag}</Text>
                        <Text style={[
                          styles.languageName,
                          language === item.id && styles.languageNameSelected
                        ]}>{item.name}</Text>
                        {language === item.id && (
                          <Check size={20} color="#2563EB" />
                        )}
                      </TouchableOpacity>
                    </>
                  );
                }}
              />
            )}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Bold',
    color: '#1F2937',
  },
  debugButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  debugButtonText: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
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
  textInputContainer: {
    minHeight: 140,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#1F2937',
    minHeight: 140,
    textAlignVertical: 'top',
  },
  // Sentence highlighting styles
  highlightContainer: {
    minHeight: 140,
    maxHeight: 200,
  },
  highlightText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#1F2937',
    lineHeight: 26,
  },
  textSentence: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
    lineHeight: 26,
  },
  textSentenceHighlighted: {
    backgroundColor: '#DBEAFE',
    color: '#1F2937',
    fontFamily: 'SF-Pro-Medium',
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
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'transparent',
    gap: 4,
  },
  importBtnText: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Medium',
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
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
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
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  languageItemSelected: {
    backgroundColor: '#EFF6FF',
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
  languageNameSelected: {
    fontFamily: 'SF-Pro-Medium',
    color: '#2563EB',
  },
  modalSectionTitle: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    paddingTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  playerHeader: {
    marginBottom: 16,
  },
  playerInfo: {
    alignItems: 'center',
  },
  playerTitle: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  playerSubtitle: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
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
