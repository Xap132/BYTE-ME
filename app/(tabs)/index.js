import { DEFAULT_SETTINGS, getLanguage } from '@/constants/voices';
import { useTheme } from '@/contexts/ThemeContext';
import { audioManager } from '@/services/audioManager';
import { storageService } from '@/services/storageService';
import { ttsService } from '@/services/ttsService';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  FileText,
  Pause,
  Play,
  Save,
  Square,
  Upload
} from 'lucide-react-native';
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
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from './_layout';

const MODES = {
  SELECTION: 'SELECTION',
  TEXT_INPUT: 'TEXT_INPUT',
  FILE_IMPORT: 'FILE_IMPORT',
};

export default function TTSScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [mode, setMode] = useState(MODES.SELECTION);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en_us_f');
  const [pitch, setPitch] = useState(DEFAULT_SETTINGS.pitch);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
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
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileName = file.name || '';
        const fileExtension = fileName.split('.').pop().toLowerCase();

        let content = '';

        if (fileExtension === 'txt') {
          if (Platform.OS === 'web') {
            const response = await fetch(file.uri);
            content = await response.text();
          } else {
            content = await FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' });
          }
        } else if (fileExtension === 'pdf') {
          Alert.alert('PDF Support', 'PDF extraction requires a development build.');
          return;
        } else if (fileExtension === 'docx') {
          Alert.alert('DOCX Support', 'DOCX files require a development build.');
          return;
        } else {
          Alert.alert('Unsupported Format', `${fileExtension.toUpperCase()} not supported.`);
          return;
        }

        if (content.trim()) {
          setText(content);
          setFileName(file.name);
          setMode(MODES.FILE_IMPORT);
        } else {
          Alert.alert('Warning', 'File is empty.');
        }
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', 'Failed to import file.');
    }
  };

  const getSentences = (inputText) => {
    return inputText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  };

  const getSentenceDuration = (sentence) => {
    const words = sentence.trim().split(/\s+/).length;
    return (words * 400) / speed;
  };

  const startSentenceHighlighting = (fromIndex = 0, elapsedOffset = 0) => {
    sentencesRef.current = getSentences(text);
    setCurrentWordIndex(fromIndex);
    startTimeRef.current = Date.now() - elapsedOffset;

    if (sentenceTimerRef.current) clearInterval(sentenceTimerRef.current);

    let cumulativeDurations = [];
    let total = 0;
    sentencesRef.current.forEach((sentence, idx) => {
      total += getSentenceDuration(sentence);
      cumulativeDurations.push(total);
    });

    const totalDuration = total;

    sentenceTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
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
      if (newProgress >= 1) handlePlaybackComplete();
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
    // DON'T hide player - let user see it finished
    // setIsAudioReady(false); // Removed - keep player visible
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
      setIsAudioReady(false);

      ttsService.setOnStartCallback(() => {
        setIsAudioReady(true);
        startSentenceHighlighting(0, 0);
      });

      ttsService.setOnDoneCallback(() => {
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
      setIsPaused(false);
      setIsPlaying(true);
      startSentenceHighlighting(currentWordIndex, pausedTimeRef.current);
      await ttsService.resume();
    } else if (isPlaying) {
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
    setIsAudioReady(false);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Empty Text', 'Please enter some text before saving');
      return;
    }
    try {
      setIsLoading(true);
      const prefs = await storageService.loadPreferences();
      await audioManager.saveAudioFile(text, { language, pitch, speed }, prefs.audioFormat || 'mp3');
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

  const renderHighlightedText = () => {
    if (!text) return null;
    const sentences = getSentences(text);
    return sentences.map((sentence, idx) => {
      const isHighlighted = idx === currentWordIndex && (isPlaying || isPaused);
      return (
        <Text key={idx} style={[styles.textSentence, isHighlighted && styles.textSentenceHighlighted]}>
          {sentence}{idx < sentences.length - 1 ? ' ' : ''}
        </Text>
      );
    });
  };

  const currentLang = availableLanguages.find(l => l.id === language) || getLanguage(language);
  
  // Generate dynamic styles
  const styles = getStyles(theme, insets);

  // Mode: SELECTION
  if (mode === MODES.SELECTION) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTech}>Tech</Text>
          <Text style={styles.logoTalk}>-Talk</Text>
        </View>
        <View style={styles.selectionGrid}>
          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: theme.orangeBtn }]}
            onPress={() => { setText(''); setFileName(''); setMode(MODES.TEXT_INPUT); }}
          >
            <FileText size={48} color="#FFFFFF" strokeWidth={1.5} />
            <Text style={styles.modeButtonTitle}>Input Text</Text>
            <Text style={styles.modeButtonSub}>Input text manually</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: theme.goldBtn }]}
            onPress={() => { setText(''); setFileName(''); setMode(MODES.FILE_IMPORT); }}
          >
            <Upload size={48} color="#FFFFFF" strokeWidth={1.5} />
            <Text style={styles.modeButtonTitle}>Import File</Text>
            <Text style={styles.modeButtonSub}>Use text file from storage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Modes: TEXT_INPUT & FILE_IMPORT
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { handleStop(); setText(''); setFileName(''); setMode(MODES.SELECTION); }}>
            <ArrowLeft size={28} color={theme.orangeBtn} />
          </TouchableOpacity>
          <Text style={styles.modeTitle}>
            {mode === MODES.TEXT_INPUT ? 'Create Text-to-Speech' : 'Create File-to-Speech'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Language</Text>
            <TouchableOpacity style={styles.languageSelector} onPress={() => setShowLanguageModal(true)}>
              <Text style={styles.selectorFlag}>{currentLang?.flag || '🇺🇸'}</Text>
              <Text style={styles.selectorText}>{currentLang?.name || 'US'}</Text>
              <ChevronDown size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {mode === MODES.TEXT_INPUT ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter a text..."
                placeholderTextColor={theme.placeholderText || '#9CA3AF'}
                value={text}
                onChangeText={setText}
                multiline
                textAlignVertical="top"
              />
              <View style={styles.charCountContainer}>
                <Text style={styles.charCountText}>{text.length} characters</Text>
              </View>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <Upload size={48} color={theme.textSecondary} opacity={0.5} />
              <Text style={styles.uploadTitle}>
                {fileName ? 'File Loaded' : 'Upload Text File'}
              </Text>
              <Text style={styles.uploadSub}>
                {fileName ? `Loaded: ${fileName}` : 'Drag and drop or click to browse'}
              </Text>
              <TouchableOpacity style={styles.browseButton} onPress={handleImportFile}>
                <Text style={styles.browseButtonText}>
                  {fileName ? 'Change File' : 'Browse Files'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.playbackActions}>
            <TouchableOpacity style={styles.playBtn} onPress={handlePlay} disabled={isLoading}>
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.actionBtnText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isLoading}>
              <Save size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

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
              minimumTrackTintColor={theme.orangeBtn}
              maximumTrackTintColor="#1F2937"
              thumbTintColor={theme.orangeBtn}
            />
          </View>

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
              minimumTrackTintColor={theme.orangeBtn}
              maximumTrackTintColor="#1F2937"
              thumbTintColor={theme.orangeBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowLanguageModal(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.tabBarBg }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.languageItem, language === item.id && styles.languageItemSelected]}
                  onPress={() => handleLanguageSelect(item.id)}
                >
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text style={[styles.languageName, language === item.id && styles.languageNameSelected]}>
                    {item.name}
                  </Text>
                  {language === item.id && <Check size={20} color={theme.orangeBtn} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {isAudioReady && (
        <View style={[styles.stickyPlayer, { paddingBottom: insets.bottom + 10 }]}>
          <View style={styles.playerInfo}>
            <Text style={styles.playerTitle} numberOfLines={1}>{text}</Text>
            <Text style={styles.playerSubtitle}>{currentLang?.name} • {Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.playerControls}>
            <TouchableOpacity style={styles.playerMainBtn} onPress={handlePause}>
              {isPaused ? <Play size={28} color="#FFFFFF" fill="#FFFFFF" /> : <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerStopBtn} onPress={handleStop}>
              <Square size={18} color="#EF4444" fill="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoTech: {
    fontSize: 72,
    fontFamily: 'SF-Pro-Bold',
    color: theme.orangeBtn,
    lineHeight: 70,
  },
  logoTalk: {
    fontSize: 64,
    fontFamily: 'SF-Pro-Bold',
    color: theme.goldBtn,
    marginLeft: 60,
    marginTop: -20,
  },
  selectionGrid: {
    paddingHorizontal: 24,
    gap: 20,
  },
  modeButton: {
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  modeButtonTitle: {
    fontSize: 32,
    fontFamily: 'SF-Pro-Bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  modeButtonSub: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modeTitle: {
    fontSize: 22,
    fontFamily: 'SF-Pro-Bold',
    color: theme.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: theme.textSecondary,
    marginBottom: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.tabBarBg,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  selectorFlag: {
    fontSize: 22,
  },
  selectorText: {
    flex: 1,
    fontSize: 18,
    color: theme.text,
    fontFamily: 'SF-Pro-Medium',
  },
  inputContainer: {
    backgroundColor: theme.inputBg,
    borderRadius: 24,
    padding: 16,
    height: 220,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Regular',
    color: '#1F2937',
    flex: 1,
  },
  charCountContainer: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(205, 133, 70, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  charCountText: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Medium',
    color: '#CD8546',
  },
  uploadContainer: {
    backgroundColor: theme.background,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.textSecondary,
    borderStyle: 'dashed',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Bold',
    color: theme.text,
    marginTop: 16,
  },
  uploadSub: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: theme.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 14,
    marginTop: 24,
  },
  browseButtonText: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Bold',
    color: '#374151',
  },
  playbackActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  playBtn: {
    flex: 1,
    backgroundColor: theme.orangeBtn,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: theme.goldBtn,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Bold',
    color: '#FFFFFF',
  },
  sliderSection: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    color: theme.textSecondary,
    fontFamily: 'SF-Pro-Medium',
  },
  sliderValue: {
    fontSize: 16,
    color: theme.text,
    fontFamily: 'SF-Pro-Medium',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.tabBarBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Bold',
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageItemSelected: {
    backgroundColor: '#374151',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 18,
    color: theme.text,
    fontFamily: 'SF-Pro-Regular',
  },
  languageNameSelected: {
    fontFamily: 'SF-Pro-Bold',
    color: theme.orangeBtn,
  },
  stickyPlayer: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + insets.bottom,
    left: 0,
    right: 0,
    backgroundColor: theme.tabBarBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 2,
    borderBottomColor: theme.divider || 'rgba(255,255,255,0.1)',
    padding: 24,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerTitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: theme.text,
    marginBottom: 4,
  },
  playerSubtitle: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Regular',
    color: theme.textSecondary,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  playerMainBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.orangeBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerStopBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3C3C43',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
