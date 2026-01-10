import { useTheme } from '@/contexts/ThemeContext';
import { storageService } from '@/services/storageService';
import { ttsService } from '@/services/ttsService';
import { Check, ChevronRight, Play, Trash2, Volume2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(isDarkMode);

  // Voice browser state
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceData, setVoiceData] = useState(null);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [expandedLang, setExpandedLang] = useState(null);
  const [testingVoice, setTestingVoice] = useState(null);
  const [selectedVoices, setSelectedVoices] = useState({
    voiceUS: null,
    voiceUK: null,
    voiceFil: null,
  });

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleToggle = async (key, value, setter) => {
    setter(value);
    if (key === 'darkMode') {
      await toggleTheme(value);
    }
  };

  const handleOpenVoiceBrowser = async () => {
    setShowVoiceModal(true);
    setLoadingVoices(true);
    try {
      const [data, prefs] = await Promise.all([
        ttsService.getAvailableVoices(),
        ttsService.getVoicePreferences(),
      ]);
      setVoiceData(data);
      setSelectedVoices(prefs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load voices');
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleTestVoice = async (voiceId, language) => {
    setTestingVoice(voiceId);
    try {
      await ttsService.testVoice(voiceId, language);
    } catch (error) {
      console.error('Error testing voice:', error);
    } finally {
      setTestingVoice(null);
    }
  };

  const handleSelectVoice = async (langKey, voiceId) => {
    const success = await ttsService.setVoicePreference(langKey, voiceId);
    if (success) {
      setSelectedVoices(prev => ({ ...prev, [langKey]: voiceId }));
    }
  };

  const toggleLanguage = (langCode) => {
    setExpandedLang(expandedLang === langCode ? null : langCode);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all your preferences, saved voices, and audio library. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.resetPreferences();
              await storageService.clearAudioMetadata();
              setSelectedVoices({ voiceUS: null, voiceUK: null, voiceFil: null });
              Alert.alert('Done', 'All data has been cleared. Restart the app for changes to take full effect.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  // Generate dynamic styles
  const styles = getStyles(theme, isDarkMode);

  const renderVoiceItem = (voice, langKey) => {
    const isSelected = selectedVoices[langKey] === voice.id;

    return (
      <TouchableOpacity
        key={voice.id}
        style={[styles.voiceItem, isSelected && styles.voiceItemSelected]}
        onPress={() => handleSelectVoice(langKey, voice.id)}
      >
        <View style={styles.voiceInfo}>
          <View style={styles.voiceNameRow}>
            <Text style={[styles.voiceName, isSelected && styles.voiceNameSelected]} numberOfLines={1}>
              {voice.displayName || voice.name}
            </Text>
            {isSelected && <Check size={16} color="#2563EB" style={{ marginLeft: 8 }} />}
          </View>
          <Text style={styles.voiceDetails}>
            {voice.quality ? `${voice.quality} quality` : 'Voice'}
          </Text>
          {voice.technicalName && (
            <Text style={styles.voiceId} numberOfLines={1}>{voice.technicalName}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.testButton}
          onPress={(e) => {
            e.stopPropagation();
            handleTestVoice(voice.id, voice.language);
          }}
          disabled={testingVoice === voice.id}
        >
          {testingVoice === voice.id ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Play size={16} color="#2563EB" fill="#2563EB" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderLanguageGroup = ({ item }) => {
    const currentVoice = selectedVoices[item.langKey];
    // Default to "Voice A" (first voice) when no specific voice is selected
    const selectedVoiceName = currentVoice
      ? item.voices.find(v => v.id === currentVoice)?.displayName ||
      item.voices.find(v => v.id === currentVoice)?.name ||
      'Selected'
      : item.voices[0]?.displayName || 'Voice A';

    const isExpanded = expandedLang === item.langCode;

    return (
      <View style={[styles.langGroup, isExpanded && styles.langGroupExpanded]}>
        <TouchableOpacity
          style={styles.langHeader}
          onPress={() => toggleLanguage(item.langCode)}
        >
          <View style={styles.langInfo}>
            <View style={styles.langNameRow}>
              <Text style={styles.langFlag}>{item.flag || '🌐'}</Text>
              <Text style={styles.langName}>{item.language}</Text>
            </View>
            <Text style={styles.langCount}>
              {item.count} voice{item.count !== 1 ? 's' : ''} • Using: {selectedVoiceName}
            </Text>
          </View>
          <ChevronRight
            size={20}
            color="#9CA3AF"
            style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.voiceList}>
            {item.voices.map(voice => renderVoiceItem(voice, item.langKey))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences Section */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Enable dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(val) => handleToggle('darkMode', val, setDarkMode)}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={darkMode ? '#2563EB' : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleOpenVoiceBrowser}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Volume2 size={18} color="#2563EB" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Voice Library</Text>
                <Text style={styles.settingDesc}>Browse available TTS voices</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

        </View>

        {/* Data Section */}
        <Text style={styles.sectionLabel}>DATA</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionItem} onPress={handleClearData}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Trash2 size={18} color="#DC2626" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Clear All Data</Text>
                <Text style={styles.settingDesc}>Reset preferences and saved audio</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* TTS Info Section */}
        <Text style={styles.sectionLabel}>TEXT-TO-SPEECH INFO</Text>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>
              Available voices and languages depend on your device's installed TTS engines. Different devices may have different voice options.
            </Text>
          </View>
        </View>



        {/* About Section */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.section}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Developer</Text>

            <Text style={styles.aboutValue}>BYTE-ME</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>BSCS 3-1 for DCIT 26 - Tech Talk</Text>
        <Text style={styles.footer}>MARVELOUS GONZALES{"\n"}LYZETTE DOMINUGES{"\n"}HONEY GRAVE AQUINO</Text>
      </ScrollView>

      {/* Voice Browser Modal */}
      <Modal
        visible={showVoiceModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Voice Library</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVoiceModal(false)}
            >
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {loadingVoices ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Scanning voices...</Text>
            </View>
          ) : voiceData ? (
            <>
              <View style={styles.voiceSummary}>
                <Text style={styles.summaryText}>
                  Found {voiceData.totalVoices} voice{voiceData.totalVoices !== 1 ? 's' : ''} in {voiceData.languages.length} languages
                </Text>
                <Text style={styles.summaryHint}>
                  Tap ▶ to test • Tap a voice to select it
                </Text>
              </View>
              <FlatList
                data={voiceData.languages}
                renderItem={renderLanguageGroup}
                keyExtractor={(item) => item.langCode}
                contentContainerStyle={styles.voiceListContainer}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>No voices found</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Bold',
    color: theme.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Medium',
    color: theme.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  section: {
    backgroundColor: theme.tabBarBg,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: theme.text,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: theme.textSecondary,
  },
  dangerText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginLeft: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  aboutLabel: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: theme.textSecondary,
  },
  aboutValue: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: theme.text,
  },
  footer: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.tabBarBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor || '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Bold',
    color: theme.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
  },
  voiceSummary: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.tabBarBg,
  },
  summaryText: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Medium',
    color: theme.text,
  },
  summaryHint: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  voiceListContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  langGroup: {
    backgroundColor: theme.tabBarBg,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderColor || '#374151',
  },
  langGroupExpanded: {
    borderColor: theme.orangeBtn,
    borderWidth: 2,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  langInfo: {
    flex: 1,
  },
  langNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  langName: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: theme.text,
  },
  langCount: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  voiceList: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingBottom: 8,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  voiceItemSelected: {
    backgroundColor: 'rgba(205, 133, 70, 0.1)',
  },
  voiceInfo: {
    flex: 1,
    marginRight: 12,
  },
  voiceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceName: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Medium',
    color: theme.text,
  },
  voiceNameSelected: {
    color: theme.orangeBtn,
  },
  voiceDetails: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  voiceId: {
    fontSize: 10,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  testButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
  },
});
