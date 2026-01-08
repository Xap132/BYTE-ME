import { audioManager } from '@/services/audioManager';
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
  const [autoPlay, setAutoPlay] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
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
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const prefs = await storageService.loadPreferences();
      if (prefs.autoPlay !== undefined) setAutoPlay(prefs.autoPlay);
      if (prefs.notifications !== undefined) setNotifications(prefs.notifications);
      if (prefs.darkMode !== undefined) setDarkMode(prefs.darkMode);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleToggle = async (key, value, setter) => {
    setter(value);
    try {
      const prefs = await storageService.loadPreferences();
      await storageService.savePreferences({ ...prefs, [key]: value });
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleClearLibrary = () => {
    Alert.alert(
      'Clear Library',
      'Are you sure you want to delete all saved audio files? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await audioManager.clearAllAudioFiles();
              Alert.alert('Done', 'Library cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear library');
            }
          },
        },
      ]
    );
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
              <Text style={styles.settingTitle}>Auto-play</Text>
              <Text style={styles.settingDesc}>Play audio automatically after saving</Text>
            </View>
            <Switch
              value={autoPlay}
              onValueChange={(val) => handleToggle('autoPlay', val, setAutoPlay)}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={autoPlay ? '#2563EB' : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDesc}>Get notified when audio is ready</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(val) => handleToggle('notifications', val, setNotifications)}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={notifications ? '#2563EB' : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

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
        </View>

        {/* Storage Section */}
        <Text style={styles.sectionLabel}>STORAGE</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionItem} onPress={handleClearLibrary}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Trash2 size={18} color="#DC2626" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, styles.dangerText]}>Clear Library</Text>
                <Text style={styles.settingDesc}>Delete all saved audio files</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Voice Section */}
        <Text style={styles.sectionLabel}>TEXT-TO-SPEECH</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionItem} onPress={handleOpenVoiceBrowser}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Volume2 size={18} color="#2563EB" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Installed Voices</Text>
                <Text style={styles.settingDesc}>View and test TTS voices on your device</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
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
            <Text style={styles.aboutValue}>BYTE-ME Team</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Made with ❤️ by BYTE-ME</Text>
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
            <Text style={styles.modalTitle}>Installed Voices</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowVoiceModal(false)}
            >
              <X size={24} color="#1F2937" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
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
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
  },
  dangerText: {
    color: '#DC2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#FEE2E2',
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
    color: '#6B7280',
  },
  aboutValue: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
  },
  footer: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
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
    color: '#6B7280',
  },
  voiceSummary: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryText: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langGroupExpanded: {
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    color: '#1F2937',
  },
  langCount: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  voiceList: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  voiceItemSelected: {
    backgroundColor: '#EFF6FF',
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
    color: '#1F2937',
  },
  voiceNameSelected: {
    color: '#2563EB',
  },
  voiceDetails: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  voiceId: {
    fontSize: 10,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  testButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
