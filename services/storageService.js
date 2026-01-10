import { DEFAULT_SETTINGS } from '@/constants/voices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@tts_user_preferences';
const AUDIO_METADATA_KEY = '@tts_audio_metadata';

const DEFAULT_PREFERENCES = {
  // New: single preset selection (3 options)
  defaultPresetLanguage: 'en_us_f',

  // User-selected voice IDs for each language
  voiceUS: null,    // null = auto-detect
  voiceUK: null,
  voiceFil: null,

  // Legacy (kept for compatibility)
  defaultVoice: 'female',
  defaultLanguage: 'en',
  defaultPitch: DEFAULT_SETTINGS.pitch,
  defaultSpeed: DEFAULT_SETTINGS.speed,
  audioFormat: 'wav',
  hapticEnabled: true,
  theme: 'system',
};

function migratePreferences(preferences) {
  if (!preferences || typeof preferences !== 'object') return { ...DEFAULT_PREFERENCES };

  const merged = { ...DEFAULT_PREFERENCES, ...preferences };

  // If preset not present yet, derive from legacy fields.
  if (!merged.defaultPresetLanguage) {
    const legacyLanguage = merged.defaultLanguage || 'en';
    const legacyVoice = merged.defaultVoice || 'female';

    if (legacyLanguage === 'fil') merged.defaultPresetLanguage = 'fil_f';
    else if (legacyLanguage === 'en' && legacyVoice === 'male') merged.defaultPresetLanguage = 'en_uk_m';
    else merged.defaultPresetLanguage = 'en_us_f';
  }

  // Clean up any invalid voice IDs that may have been saved
  // These are malformed IDs like "en-IN-language" that some devices return
  Object.keys(merged).forEach(key => {
    if (key.startsWith('voice') && merged[key]) {
      const voiceId = merged[key];
      if (typeof voiceId === 'string' && 
          (voiceId.endsWith('-language') || voiceId.endsWith('-voice'))) {
        console.log(`[Storage] Removing invalid voice ID: ${key} = ${voiceId}`);
        delete merged[key];
      }
    }
  });

  return merged;
}

class StorageService {
  /**
   * Load user preferences from storage
   */
  async loadPreferences() {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (data) {
        return migratePreferences(JSON.parse(data));
      }
      return { ...DEFAULT_PREFERENCES };
    } catch (error) {
      console.error('Error loading preferences:', error);
      return { ...DEFAULT_PREFERENCES };
    }
  }

  /**
   * Save user preferences to storage
   */
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify(migratePreferences(preferences))
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Update specific preference
   */
  async updatePreference(key, value) {
    try {
      const preferences = await this.loadPreferences();
      preferences[key] = value;
      await this.savePreferences(preferences);
    } catch (error) {
      console.error('Error updating preference:', error);
      throw error;
    }
  }

  /**
   * Reset preferences to defaults
   */
  async resetPreferences() {
    try {
      await this.savePreferences(DEFAULT_PREFERENCES);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  }

  /**
   * Save audio metadata list
   */
  async saveAudioMetadata(metadata) {
    try {
      await AsyncStorage.setItem(AUDIO_METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving audio metadata:', error);
      throw error;
    }
  }

  /**
   * Load audio metadata list
   */
  async loadAudioMetadata() {
    try {
      const data = await AsyncStorage.getItem(AUDIO_METADATA_KEY);
      console.log('Loading audio metadata, raw data:', data);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('Parsed audio metadata:', parsed);
        return parsed;
      }
      console.log('No audio metadata found, returning empty array');
      return [];
    } catch (error) {
      console.error('Error loading audio metadata:', error);
      return [];
    }
  }

  /**
   * Clear audio metadata only
   */
  async clearAudioMetadata() {
    try {
      await AsyncStorage.removeItem(AUDIO_METADATA_KEY);
      console.log('Audio metadata cleared');
    } catch (error) {
      console.error('Error clearing audio metadata:', error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([PREFERENCES_KEY, AUDIO_METADATA_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
