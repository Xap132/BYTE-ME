import * as Speech from 'expo-speech';
import { LANGUAGE_CODES, getVoice } from '@/constants/voices';

class TTSService {
  constructor() {
    this.isSpeaking = false;
    this.isPaused = false;
  }

  /**
   * Speak text with specified options
   */
  async speak(options) {
    const { text, language, voice, pitch, speed } = options;

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for TTS');
    }

    // Stop any ongoing speech
    if (this.isSpeaking) {
      await this.stop();
    }

    const languageCode = LANGUAGE_CODES[language];
    
    // Adjust pitch based on gender selection
    // Male voices typically have lower pitch (0.7-0.9), female higher (1.0-1.2)
    let adjustedPitch = pitch;
    if (voice === 'male') {
      adjustedPitch = pitch * 0.8; // Lower pitch for male voice
    } else {
      adjustedPitch = pitch * 1.1; // Slightly higher for female voice
    }
    
    // Clamp pitch to valid range
    adjustedPitch = Math.max(0.5, Math.min(2.0, adjustedPitch));

    const speechOptions = {
      language: languageCode,
      pitch: adjustedPitch,
      rate: speed,
      onStart: () => {
        this.isSpeaking = true;
        this.isPaused = false;
      },
      onDone: () => {
        this.isSpeaking = false;
        this.isPaused = false;
      },
      onStopped: () => {
        this.isSpeaking = false;
        this.isPaused = false;
      },
      onError: (error) => {
        console.error('TTS Error:', error);
        this.isSpeaking = false;
        this.isPaused = false;
      },
    };

    console.log('Speaking with options:', { language: languageCode, pitch: adjustedPitch, rate: speed, voice });
    await Speech.speak(text, speechOptions);
  }

  /**
   * Stop current speech
   */
  async stop() {
    if (this.isSpeaking) {
      await Speech.stop();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  /**
   * Pause current speech
   */
  async pause() {
    if (this.isSpeaking && !this.isPaused) {
      await Speech.pause();
      this.isPaused = true;
    }
  }

  /**
   * Resume paused speech
   */
  async resume() {
    if (this.isSpeaking && this.isPaused) {
      await Speech.resume();
      this.isPaused = false;
    }
  }

  /**
   * Check if TTS is currently speaking
   */
  getIsSpeaking() {
    return this.isSpeaking;
  }

  /**
   * Check if TTS is paused
   */
  getIsPaused() {
    return this.isPaused;
  }

  /**
   * Get available voices for a language
   */
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (err) {
      console.error('Error getting available voices:', err);
      return [];
    }
  }

  /**
   * Check if speech is available on the device
   */
  async isSpeechAvailable() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.length > 0;
    } catch {
      return false;
    }
  }
}

export const ttsService = new TTSService();
