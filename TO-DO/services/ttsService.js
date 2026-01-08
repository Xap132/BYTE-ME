import * as Speech from 'expo-speech';
import { LANGUAGE_CODES } from '@/constants/voices';
import { Platform } from 'react-native';

/**
 * TTS Service using expo-speech
 * Works on both Mobile (Android/iOS) and Web
 * 
 * For Male/Female voices:
 * - Tries to get ACTUAL different voices from system
 * - Falls back to pitch if system doesn't support gender voices
 */
class TTSService {
  constructor() {
    this.isSpeaking = false;
    this.availableVoices = [];
    this.loadVoicesAsync();
  }

  /**
   * Load available voices on app start
   */
  async loadVoicesAsync() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = voices || [];
      console.log(`[TTS] Loaded ${this.availableVoices.length} system voices`);
      
      // Log available voices for debugging
      this.availableVoices.forEach((v, i) => {
        console.log(`  [${i}] ${v.name} (${v.language})`);
      });
    } catch (error) {
      console.error('[TTS] Error loading voices:', error);
      this.availableVoices = [];
    }
  }

  /**
   * Get the best matching voice for language and gender
   * Note: Android may not support voice IDs well, will use pitch fallback
   */
  async getBestVoiceId(language, gender) {
    try {
      // If no voices loaded, try to load them
      if (this.availableVoices.length === 0) {
        await this.loadVoicesAsync();
      }

      if (this.availableVoices.length === 0) {
        console.log('[TTS] No voices available, will use pitch-based differentiation');
        return null;
      }

      // Get language prefix (en, fil, etc)
      const langCode = LANGUAGE_CODES[language];
      const langPrefix = langCode ? langCode.split('-')[0] : 'en';

      console.log(`[TTS] Finding voice for: ${language} (${langPrefix}), ${gender}`);

      // Filter voices by language
      let langVoices = this.availableVoices.filter(v => {
        const voiceLang = (v.language || '').substring(0, 2).toLowerCase();
        return voiceLang === langPrefix.toLowerCase();
      });

      if (langVoices.length === 0) {
        // Try English as fallback
        langVoices = this.availableVoices.filter(v => {
          const voiceLang = (v.language || '').substring(0, 2).toLowerCase();
          return voiceLang === 'en';
        });
        console.log(`[TTS] No ${langPrefix} voices, fallback to ${langVoices.length} English voices`);
      }

      if (langVoices.length === 0) {
        console.log('[TTS] No voices found at all');
        return null;
      }

      console.log(`[TTS] Available voices for ${langPrefix}:`, langVoices.map(v => v.name).join(', '));

      // Try to find voice matching gender
      const maleTerms = ['male', 'man', 'david', 'james', 'john', 'google uk english male'];
      const femaleTerms = ['female', 'woman', 'victoria', 'samantha', 'karen', 'google uk english female'];
      const genderTerms = gender === 'male' ? maleTerms : femaleTerms;

      let selectedVoice = null;
      for (const term of genderTerms) {
        selectedVoice = langVoices.find(v =>
          (v.name || '').toLowerCase().includes(term)
        );
        if (selectedVoice) {
          console.log(`[TTS] ✓ Found ${gender} voice: ${selectedVoice.name}`);
          return selectedVoice.identifier;
        }
      }

      // Android workaround: If no gender-specific voice, use index-based selection
      // Index 0 usually male-ish, index 1+ usually female-ish
      if (gender === 'male') {
        selectedVoice = langVoices[0];
      } else {
        selectedVoice = langVoices[langVoices.length > 1 ? 1 : 0];
      }

      console.log(`[TTS] No perfect match, using index-based: ${selectedVoice?.name}`);
      return selectedVoice ? selectedVoice.identifier : null;
    } catch (error) {
      console.error('[TTS] Error getting voice:', error);
      return null;
    }
  }

  /**
   * Speak text with options
   * @param {Object} options - { text, language, voice, pitch, speed }
   */
  async speak(options) {
    const { text, language = 'en', voice = 'female', pitch = 1.0, speed = 1.0 } = options;

    if (!text || text.trim().length === 0) {
      throw new Error('No text provided');
    }

    // Stop any current speech
    await this.stop();

    // Get language code
    const languageCode = LANGUAGE_CODES[language] || 'en-US';

    // Try to get a voice with proper gender
    const voiceId = await this.getBestVoiceId(language, voice);

    // Calculate pitch adjustment
    let finalPitch = pitch;
    
    if (!voiceId) {
      // No suitable voice found - use aggressive pitch adjustment for gender
      console.log('[TTS] No gender-specific voice available, using pitch adjustment');
      if (voice === 'male') {
        // Much lower pitch for male (0.5x) - very deep voice
        finalPitch = pitch * 0.5;
      } else {
        // Much higher pitch for female (1.8x) - very high voice
        finalPitch = pitch * 1.8;
      }
    } else {
      // We have a specific voice, use subtle pitch adjustment if needed
      if (voice === 'male') {
        finalPitch = pitch * 0.9; // Slightly lower
      } else {
        finalPitch = pitch * 1.1; // Slightly higher
      }
    }

    // Clamp to valid ranges
    finalPitch = Math.max(0.5, Math.min(2.0, finalPitch));
    const finalSpeed = Math.max(0.1, Math.min(2.0, speed));

    console.log(`[TTS] Speaking: "${text.substring(0, 30)}..." voice=${voice} pitch=${finalPitch.toFixed(2)} speed=${finalSpeed.toFixed(2)}`);

    return new Promise((resolve, reject) => {
      const speechOptions = {
        language: languageCode,
        pitch: finalPitch,
        rate: finalSpeed,
        onStart: () => {
          this.isSpeaking = true;
          console.log('[TTS] ▶ Started');
        },
        onDone: () => {
          this.isSpeaking = false;
          console.log('[TTS] ✓ Done');
          resolve();
        },
        onStopped: () => {
          this.isSpeaking = false;
          console.log('[TTS] ⏹ Stopped');
          resolve();
        },
        onError: (error) => {
          this.isSpeaking = false;
          console.error('[TTS] ✗ Error:', error);
          reject(error);
        },
      };

      // Add voice ID if found
      if (voiceId) {
        speechOptions.voice = voiceId;
        console.log(`[TTS] Using voice ID: ${voiceId}`);
      }

      Speech.speak(text, speechOptions);
    });
  }

  /**
   * Stop current speech
   */
  async stop() {
    if (this.isSpeaking) {
      try {
        await Speech.stop();
        this.isSpeaking = false;
      } catch (error) {
        console.error('[TTS] Error stopping:', error);
      }
    }
  }

  /**
   * Check if speaking
   */
  getIsSpeaking() {
    return this.isSpeaking;
  }

  /**
   * Get available voices
   */
  async getVoices() {
    if (this.availableVoices.length === 0) {
      await this.loadVoicesAsync();
    }
    return this.availableVoices;
  }
}

export const ttsService = new TTSService();
