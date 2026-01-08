import * as Speech from 'expo-speech';
import { LANGUAGE_CODES } from '@/constants/voices';

/**
 * TTS Service
 * 
 * Attempts to use actual male/female voices from the device.
 * No pitch manipulation - relies on device's native voices.
 */
class TTSService {
  constructor() {
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentText = '';
    this.words = [];
    this.currentWordIndex = 0;
    this.availableVoices = null;
  }

  /**
   * Get and cache available voices
   */
  async getAvailableVoices() {
    if (!this.availableVoices) {
      try {
        this.availableVoices = await Speech.getAvailableVoicesAsync();
        console.log('[TTS] ===== DEVICE VOICES =====');
        this.availableVoices.forEach((v, i) => {
          console.log(`[TTS] ${i + 1}. ${v.identifier} | ${v.language}`);
        });
        console.log('[TTS] ==========================');
      } catch (error) {
        console.error('[TTS] Error getting voices:', error);
        this.availableVoices = [];
      }
    }
    return this.availableVoices;
  }

  /**
   * Find appropriate voice for language and gender
   */
  async findVoiceForGender(languageCode, gender) {
    const allVoices = await this.getAvailableVoices();
    
    // Filter voices by language
    const langCode = languageCode.split('-')[0].toLowerCase();
    const matchingVoices = allVoices.filter(v => {
      if (!v.language) return false;
      return v.language.toLowerCase().startsWith(langCode);
    });

    if (matchingVoices.length === 0) {
      console.log(`[TTS] No voices found for ${languageCode}, using default`);
      return null;
    }

    console.log(`[TTS] Found ${matchingVoices.length} voice(s) for ${langCode}:`, 
      matchingVoices.map(v => v.identifier).join(', '));

    // For iOS - look for gender-specific patterns
    const malePatterns = /male|man|aaron|albert|bad|bruce|carlos|daniel|diego|felipe|fred|jorge|juan|ralph|thomas|victor/i;
    const femalePatterns = /female|woman|kate|kathy|samantha|serena|susan|tessa|vicki|victoria|karen|kyoko|moira|nora|siri|ting/i;

    let selectedVoice = null;

    if (gender === 'female') {
      // Try to find explicit female voice
      selectedVoice = matchingVoices.find(v => 
        femalePatterns.test(v.identifier) || femalePatterns.test(v.name || '')
      );
      
      // If not found, use first voice (often female on most devices)
      if (!selectedVoice) {
        selectedVoice = matchingVoices[0];
      }
    } else if (gender === 'male') {
      // Try to find explicit male voice
      selectedVoice = matchingVoices.find(v => 
        malePatterns.test(v.identifier) || malePatterns.test(v.name || '')
      );
      
      // If not found, try second voice (if available)
      if (!selectedVoice && matchingVoices.length > 1) {
        selectedVoice = matchingVoices[1];
      }
      
      // If still not found and there's only one voice, try to find any non-female
      if (!selectedVoice) {
        selectedVoice = matchingVoices.find(v => 
          !femalePatterns.test(v.identifier) && !femalePatterns.test(v.name || '')
        );
      }
      
      // Last resort: use first voice
      if (!selectedVoice) {
        selectedVoice = matchingVoices[0];
      }
    }

    if (selectedVoice) {
      console.log(`[TTS] Selected ${gender} voice: ${selectedVoice.identifier}`);
    }

    return selectedVoice;
  }

  /**
   * Main speak function
   * @param {Object} options - { text, language, voice, pitch, speed }
   */
  async speak(options) {
    const { 
      text, 
      language = 'en', 
      voice = 'female', 
      pitch = 1.0, 
      speed = 1.0 
    } = options;

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided');
    }

    // Stop any existing speech
    await this.stop();

    // Prepare for word-based navigation
    this.currentText = text;
    this.words = text.split(/\s+/);
    this.currentWordIndex = 0;

    // Get language code
    let languageCode = LANGUAGE_CODES[language] || 'en-US';
    if (language === 'fil') {
      languageCode = 'fil-PH';
    }

    // Find voice for gender
    const selectedVoice = await this.findVoiceForGender(languageCode, voice);

    console.log(`[TTS] Speaking as ${voice.toUpperCase()} | Language: ${languageCode} | Voice: ${selectedVoice?.identifier || 'default'} | Pitch: 1.0 | Speed: 1.0`);

    return this._performSpeak(text, languageCode, selectedVoice?.identifier);
  }

  /**
   * Internal function to handle actual speech
   * @private
   */
  _performSpeak(text, languageCode, voiceIdentifier) {
    return new Promise((resolve, reject) => {
      const speechOptions = {
        language: languageCode,
        pitch: 1.0,  // Always 1.0 - no manipulation
        rate: 1.0,   // Always 1.0 - no manipulation
        onStart: () => {
          this.isSpeaking = true;
          this.isPaused = false;
          console.log('[TTS] ▶ Speaking started');
        },
        onDone: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          console.log('[TTS] ✓ Finished');
          resolve();
        },
        onStopped: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          console.log('[TTS] ⏹ Stopped');
          resolve();
        },
        onError: (error) => {
          this.isSpeaking = false;
          this.isPaused = false;
          console.error('[TTS] ✗ Error:', error);
          reject(error);
        },
      };

      // Add voice identifier if we found one
      if (voiceIdentifier) {
        speechOptions.voice = voiceIdentifier;
      }

      try {
        Speech.speak(text, speechOptions);
      } catch (error) {
        this.isSpeaking = false;
        this.isPaused = false;
        reject(error);
      }
    });
  }

  /**
   * Pause current speech
   */
  async pause() {
    if (this.isSpeaking && !this.isPaused) {
      try {
        await Speech.pause();
        this.isPaused = true;
        console.log('[TTS] ⏸ Paused');
      } catch (error) {
        console.error('[TTS] Error pausing:', error);
      }
    }
  }

  /**
   * Resume paused speech
   */
  async resume() {
    if (this.isPaused) {
      try {
        await Speech.resume();
        this.isPaused = false;
        console.log('[TTS] ▶ Resumed');
      } catch (error) {
        console.error('[TTS] Error resuming:', error);
      }
    }
  }

  /**
   * Skip backward (~10 words)
   */
  async skipBackward() {
    if (this.currentText && this.isSpeaking) {
      this.currentWordIndex = Math.max(0, this.currentWordIndex - 10);
      await this.stop();
      
      // Get the remaining text from current word index
      const textToSpeak = this.words.slice(this.currentWordIndex).join(' ');
      console.log(`[TTS] Skipped backward. Starting from word ${this.currentWordIndex + 1}`);
      
      // Continue speaking from new position
      // Note: We'll need to re-initiate with same settings
      // This is a simplified version - full implementation would need session state
    }
  }

  /**
   * Skip forward (~10 words)
   */
  async skipForward() {
    if (this.currentText && this.isSpeaking) {
      this.currentWordIndex = Math.min(this.words.length - 1, this.currentWordIndex + 10);
      await this.stop();
      
      // Get the remaining text from current word index
      const textToSpeak = this.words.slice(this.currentWordIndex).join(' ');
      console.log(`[TTS] Skipped forward. Starting from word ${this.currentWordIndex + 1}`);
      
      // Continue speaking from new position
      // Note: We'll need to re-initiate with same settings
    }
  }

  /**
   * Stop all speech
   */
  async stop() {
    if (this.isSpeaking || this.isPaused) {
      try {
        await Speech.stop();
        this.isSpeaking = false;
        this.isPaused = false;
        console.log('[TTS] ⏹ Stopped');
      } catch (error) {
        console.error('[TTS] Error stopping:', error);
      }
    }
  }

  /**
   * Get current speaking state
   */
  isSpeakingNow() {
    return this.isSpeaking;
  }

  /**
   * Get current pause state
   */
  isPausedNow() {
    return this.isPaused;
  }
}

export const ttsService = new TTSService();