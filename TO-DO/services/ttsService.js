import * as Speech from 'expo-speech';
import { LANGUAGE_CODES } from '@/constants/voices';
import { Platform } from 'react-native';

/**
 * TTS Service using expo-speech
 * Simplified for English and Filipino
 * 
 * Male/Female voices handled via pitch adjustment
 */
class TTSService {
  constructor() {
    this.isSpeaking = false;
  }

  /**
   * Speak text with language, voice, pitch and speed
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
    let languageCode = LANGUAGE_CODES[language] || 'en-US';
    
    // For Filipino, use correct code
    if (language === 'fil') {
      languageCode = 'fil-PH';
    }

    // Use pitch and speed as-is (no manipulation)
    // Both male and female use normal pitch
    let finalPitch = pitch;

    // Clamp to valid ranges
    finalPitch = Math.max(0.5, Math.min(2.0, finalPitch));
    const finalSpeed = Math.max(0.1, Math.min(2.0, speed));

    console.log(`[TTS] Speaking: "${text.substring(0, 40)}..." | Lang: ${languageCode} | Voice: ${voice} | Pitch: ${finalPitch.toFixed(1)} | Speed: ${finalSpeed.toFixed(1)}`);

    return new Promise((resolve, reject) => {
      try {
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
            console.log('[TTS] ✓ Finished');
            resolve();
          },
          onStopped: () => {
            this.isSpeaking = false;
            console.log('[TTS] ⏹ Stopped');
            resolve();
          },
          onError: (error) => {
            this.isSpeaking = false;
            console.error('[TTS] Error:', error);
            reject(error);
          },
        };

        Speech.speak(text, speechOptions);
      } catch (error) {
        this.isSpeaking = false;
        reject(error);
      }
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
        console.log('[TTS] Stopped');
      } catch (error) {
        console.error('[TTS] Error stopping:', error);
      }
    }
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking() {
    return this.isSpeaking;
  }
}

export const ttsService = new TTSService();
