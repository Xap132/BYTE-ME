import * as Speech from 'expo-speech';
import { storageService } from './storageService';

/**
 * TTS Service with User Voice Selection
 * 
 * 3 Languages only:
 * - US: English (US)
 * - UK: English (UK/GB) 
 * - Filipino: fil-PH
 * 
 * Users can select their preferred voice for each language in Settings.
 */

const LANG_CONFIG = {
  en_us_f: { lang: 'en-US', prefKey: 'voiceUS' },
  en_uk_m: { lang: 'en-GB', prefKey: 'voiceUK' },
  fil_f: { lang: 'fil-PH', prefKey: 'voiceFil' },
  
  // Legacy
  en: { lang: 'en-US', prefKey: 'voiceUS' },
  fil: { lang: 'fil-PH', prefKey: 'voiceFil' },
};

// Only show these languages in voice browser
const SUPPORTED_LANGUAGES = ['en-US', 'en-GB', 'fil-PH', 'fil', 'tl-PH', 'tl'];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

class TTSService {
  constructor() {
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentText = '';
    this.words = [];
    this.currentWordIndex = 0;
    this.currentSettings = null;
    this.cachedVoices = null;
  }

  /**
   * Get user's selected voice for a language, or auto-detect
   */
  async _getVoiceForLanguage(langCode, prefKey) {
    try {
      const prefs = await storageService.loadPreferences();
      const userVoice = prefs[prefKey];
      
      if (userVoice) {
        console.log(`[TTS] Using user-selected voice: ${userVoice}`);
        return userVoice;
      }
      
      // Auto-detect: find first matching voice
      const voices = await Speech.getAvailableVoicesAsync();
      const matching = voices.find(v => 
        v.language === langCode ||
        v.language?.startsWith(langCode.split('-')[0])
      );
      
      return matching?.identifier || null;
    } catch (err) {
      console.warn('[TTS] Error getting voice:', err);
      return null;
    }
  }

  async speak(options) {
    const { 
      text, 
      language = 'en_us_f', 
      pitch = 1.0, 
      speed = 1.0 
    } = options;

    if (!text || text.trim().length === 0) {
      throw new Error('No text provided');
    }

    await this.stop();

    this.currentText = text;
    this.words = text.split(/\s+/);
    this.currentWordIndex = 0;
    this.currentSettings = { text, language, pitch, speed };

    const config = LANG_CONFIG[language] || LANG_CONFIG.en_us_f;
    
    // Get user's selected voice or auto-detect
    const voiceId = await this._getVoiceForLanguage(config.lang, config.prefKey);
    
    const finalPitch = clamp(Number(pitch) || 1.0, 0.5, 2.0);
    const finalRate = clamp(Number(speed) || 1.0, 0.5, 2.0);

    console.log(`[TTS] Speaking: lang=${config.lang}, voice=${voiceId}, pitch=${finalPitch}, rate=${finalRate}`);

    return new Promise((resolve, reject) => {
      Speech.speak(text, {
        language: config.lang,
        voice: voiceId,
        pitch: finalPitch,
        rate: finalRate,
        onStart: () => {
          this.isSpeaking = true;
          this.isPaused = false;
        },
        onDone: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          resolve();
        },
        onStopped: () => {
          this.isSpeaking = false;
          resolve();
        },
        onError: (err) => {
          this.isSpeaking = false;
          this.isPaused = false;
          reject(err);
        },
      });
    });
  }

  async pause() {
    if (!this.isSpeaking) return false;
    try {
      await Speech.stop();
      this.isSpeaking = false;
      this.isPaused = true;
      return true;
    } catch {
      return false;
    }
  }

  async resume() {
    if (!this.isPaused || !this.currentSettings) return false;
    this.isPaused = false;
    await this.speak(this.currentSettings);
    return true;
  }

  async togglePause() {
    if (this.isPaused) {
      return this.resume();
    } else if (this.isSpeaking) {
      return this.pause();
    }
    return false;
  }

  async stop() {
    try {
      await Speech.stop();
    } catch {
      // Ignore
    }
    this.isSpeaking = false;
    this.isPaused = false;
  }

  async skipForward() {
    if (!this.currentSettings || !this.currentText) return;
    
    await this.stop();
    this.currentWordIndex = Math.min(this.words.length - 1, this.currentWordIndex + 10);
    const remaining = this.words.slice(this.currentWordIndex).join(' ');
    
    if (remaining.trim()) {
      const { language, pitch, speed } = this.currentSettings;
      return this.speak({ text: remaining, language, pitch, speed });
    }
  }

  async skipBackward() {
    if (!this.currentSettings || !this.currentText) return;
    
    await this.stop();
    this.currentWordIndex = Math.max(0, this.currentWordIndex - 10);
    const remaining = this.words.slice(this.currentWordIndex).join(' ');
    
    if (remaining.trim()) {
      const { language, pitch, speed } = this.currentSettings;
      return this.speak({ text: remaining, language, pitch, speed });
    }
  }

  getIsSpeaking() { return this.isSpeaking; }
  getIsPaused() { return this.isPaused; }

  /**
   * Get available voices - FILTERED to only US, UK, Filipino
   */
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      
      // Filter to only supported languages
      const filtered = voices.filter(v => {
        const lang = v.language || '';
        return SUPPORTED_LANGUAGES.some(supported => 
          lang.startsWith(supported.split('-')[0]) ||
          lang === supported
        );
      });

      // Group by our 3 categories
      const groups = {
        'English (US)': [],
        'English (UK)': [],
        'Filipino': [],
      };

      filtered.forEach((voice, index) => {
        const lang = voice.language || '';
        const id = voice.identifier || `voice_${index}`;
        let displayName = voice.name || id;
        
        // Clean up display name
        if (id.includes('#')) {
          const parts = id.split('#');
          displayName = parts[parts.length - 1] || displayName;
        }
        
        // Detect gender
        let gender = '';
        const idLower = id.toLowerCase();
        if (idLower.includes('female')) gender = 'Female';
        else if (idLower.includes('male')) gender = 'Male';

        const voiceObj = {
          id: id,
          name: displayName,
          language: lang,
          gender: gender,
          quality: voice.quality || '',
        };

        // Categorize
        if (lang.includes('GB') || lang.includes('UK')) {
          groups['English (UK)'].push(voiceObj);
        } else if (lang.startsWith('en')) {
          groups['English (US)'].push(voiceObj);
        } else if (lang.startsWith('fil') || lang.startsWith('tl')) {
          groups['Filipino'].push(voiceObj);
        }
      });

      // Convert to array format
      const result = Object.entries(groups)
        .filter(([_, voices]) => voices.length > 0)
        .map(([language, voiceList]) => ({
          language,
          langKey: language === 'English (US)' ? 'voiceUS' : 
                   language === 'English (UK)' ? 'voiceUK' : 'voiceFil',
          voices: voiceList.sort((a, b) => a.name.localeCompare(b.name)),
          count: voiceList.length,
        }));

      const totalVoices = result.reduce((sum, g) => sum + g.count, 0);

      return {
        totalVoices,
        languages: result,
      };
    } catch (err) {
      console.error('[TTS] Error getting voices:', err);
      return { totalVoices: 0, languages: [] };
    }
  }

  /**
   * Test a specific voice
   */
  async testVoice(voiceId, language = 'en-US') {
    await this.stop();
    
    // Use language-appropriate test text
    let testText = 'Hello, this is a voice test.';
    if (language.startsWith('fil') || language.startsWith('tl')) {
      testText = 'Kumusta, ito ay isang pagsubok ng boses.';
    } else if (language.includes('GB') || language.includes('UK')) {
      testText = 'Hello, this is a British voice test.';
    }
    
    return new Promise((resolve, reject) => {
      Speech.speak(testText, {
        voice: voiceId,
        language: language,
        onStart: () => {
          this.isSpeaking = true;
        },
        onDone: () => {
          this.isSpeaking = false;
          resolve();
        },
        onStopped: () => {
          this.isSpeaking = false;
          resolve();
        },
        onError: (err) => {
          this.isSpeaking = false;
          reject(err);
        },
      });
    });
  }

  /**
   * Save user's voice preference for a language
   */
  async setVoicePreference(langKey, voiceId) {
    try {
      const prefs = await storageService.loadPreferences();
      prefs[langKey] = voiceId;
      await storageService.savePreferences(prefs);
      console.log(`[TTS] Saved voice preference: ${langKey} = ${voiceId}`);
      return true;
    } catch (err) {
      console.error('[TTS] Error saving voice preference:', err);
      return false;
    }
  }

  /**
   * Get current voice preferences
   */
  async getVoicePreferences() {
    try {
      const prefs = await storageService.loadPreferences();
      return {
        voiceUS: prefs.voiceUS || null,
        voiceUK: prefs.voiceUK || null,
        voiceFil: prefs.voiceFil || null,
      };
    } catch {
      return { voiceUS: null, voiceUK: null, voiceFil: null };
    }
  }
}

export const ttsService = new TTSService();

