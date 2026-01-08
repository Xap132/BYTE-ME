import { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { storageService } from '@/services/storageService';
import { audioManager } from '@/services/audioManager';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [autoPlay, setAutoPlay] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
});
