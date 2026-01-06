import { DEFAULT_SETTINGS } from '@/constants/voices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@tts_user_preferences';
const AUDIO_METADATA_KEY = '@tts_audio_metadata';

const DEFAULT_PREFERENCES = {
  defaultVoice: 'female',
  defaultLanguage: 'en',
  defaultPitch: DEFAULT_SETTINGS.pitch,
  defaultSpeed: DEFAULT_SETTINGS.speed,
  audioFormat: 'wav',
  hapticEnabled: true,
  theme: 'system',
};

class StorageService {
  /**
   * Load user preferences from storage
   */
  async loadPreferences() {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Save user preferences to storage
   */
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
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
