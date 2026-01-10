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

import * as Speech from 'expo-speech';
import { storageService } from './storageService';

const LANG_CONFIG = {
  en_us_f: { lang: 'en-US', prefKey: 'voiceUS' },
  en_uk_m: { lang: 'en-GB', prefKey: 'voiceUK' },
  fil_f: { lang: 'fil-PH', prefKey: 'voiceFil' },
  
  // Legacy
  en: { lang: 'en-US', prefKey: 'voiceUS' },
  fil: { lang: 'fil-PH', prefKey: 'voiceFil' },
};

// Priority languages (always show first if available)
const PRIORITY_LANGUAGES = ['en-US', 'en-GB', 'fil-PH', 'fil', 'tl-PH', 'tl'];

// Blacklist of languages to exclude from available voices (empty for now)
const BLACKLISTED_LANGUAGES = [];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Language display names with full country info
const LANGUAGE_DISPLAY_NAMES = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'en-AU': 'English (Australia)',
  'en-ZA': 'English (South Africa)',
  'en-IE': 'English (Ireland)',
  'en-CA': 'English (Canada)',
  'en-NZ': 'English (New Zealand)',
  'fil-PH': 'Filipino',
  'fil': 'Filipino',
  'tl-PH': 'Tagalog',
  'tl': 'Tagalog',
  'es-ES': 'Spanish (Spain)',
  'es-MX': 'Spanish (Mexico)',
  'es-US': 'Spanish (US)',
  'es-AR': 'Spanish (Argentina)',
  'fr-FR': 'French (France)',
  'fr-CA': 'French (Canada)',
  'de-DE': 'German',
  'de-AT': 'German (Austria)',
  'de-CH': 'German (Switzerland)',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'zh-HK': 'Chinese (Hong Kong)',
  'ru-RU': 'Russian',
  'ar-SA': 'Arabic (Saudi)',
  'ar-EG': 'Arabic (Egypt)',
  'ar-AE': 'Arabic (UAE)',
  'hi-IN': 'Hindi',
  'th-TH': 'Thai',
  'vi-VN': 'Vietnamese',
  'id-ID': 'Indonesian',
  'ms-MY': 'Malay',
  'tr-TR': 'Turkish',
  'pl-PL': 'Polish',
  'nl-NL': 'Dutch',
  'nl-BE': 'Dutch (Belgium)',
  'sv-SE': 'Swedish',
  'da-DK': 'Danish',
  'no-NO': 'Norwegian',
  'nb-NO': 'Norwegian (Bokmål)',
  'nn-NO': 'Norwegian (Nynorsk)',
  'fi-FI': 'Finnish',
  'el-GR': 'Greek',
  'cs-CZ': 'Czech',
  'hu-HU': 'Hungarian',
  'ro-RO': 'Romanian',
  'sk-SK': 'Slovak',
  'uk-UA': 'Ukrainian',
  'he-IL': 'Hebrew',
  'bn-IN': 'Bengali (India)',
  'bn-BD': 'Bengali (Bangladesh)',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'mr-IN': 'Marathi',
  'ur-PK': 'Urdu (Pakistan)',
  'ur-IN': 'Urdu (India)',
  'et-EE': 'Estonian',
  'lv-LV': 'Latvian',
  'lt-LT': 'Lithuanian',
  'hr-HR': 'Croatian',
  'sr-RS': 'Serbian',
  'sl-SI': 'Slovenian',
  'bg-BG': 'Bulgarian',
  'ca-ES': 'Catalan',
  'eu-ES': 'Basque',
  'gl-ES': 'Galician',
  'af-ZA': 'Afrikaans',
  'sw-KE': 'Swahili',
  'am-ET': 'Amharic',
  'ne-NP': 'Nepali',
  'si-LK': 'Sinhala',
  'km-KH': 'Khmer',
  'lo-LA': 'Lao',
  'my-MM': 'Myanmar (Burmese)',
  'ka-GE': 'Georgian',
  'hy-AM': 'Armenian',
  'az-AZ': 'Azerbaijani',
  'kk-KZ': 'Kazakh',
  'uz-UZ': 'Uzbek',
  'fa-IR': 'Persian (Farsi)',
  'pa-IN': 'Punjabi',
  'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'or-IN': 'Odia',
};

// Flag emojis for countries
const LANGUAGE_FLAGS = {
  'en-US': '🇺🇸',
  'en-GB': '🇬🇧',
  'en-AU': '🇦🇺',
  'en-ZA': '🇿🇦',
  'en-IE': '🇮🇪',
  'en-CA': '🇨🇦',
  'en-NZ': '🇳🇿',
  'fil-PH': '🇵🇭',
  'fil': '🇵🇭',
  'tl-PH': '🇵🇭',
  'tl': '🇵🇭',
  'es-ES': '🇪🇸',
  'es-MX': '🇲🇽',
  'es-US': '🇺🇸',
  'es-AR': '🇦🇷',
  'fr-FR': '🇫🇷',
  'fr-CA': '🇨🇦',
  'de-DE': '🇩🇪',
  'de-AT': '🇦🇹',
  'de-CH': '🇨🇭',
  'it-IT': '🇮🇹',
  'pt-BR': '🇧🇷',
  'pt-PT': '🇵🇹',
  'ja-JP': '🇯🇵',
  'ko-KR': '🇰🇷',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  'zh-HK': '🇭🇰',
  'ru-RU': '🇷🇺',
  'ar-SA': '🇸🇦',
  'ar-EG': '🇪🇬',
  'ar-AE': '🇦🇪',
  'hi-IN': '🇮🇳',
  'th-TH': '🇹🇭',
  'vi-VN': '🇻🇳',
  'id-ID': '🇮🇩',
  'ms-MY': '🇲🇾',
  'tr-TR': '🇹🇷',
  'pl-PL': '🇵🇱',
  'nl-NL': '🇳🇱',
  'nl-BE': '🇧🇪',
  'sv-SE': '🇸🇪',
  'da-DK': '🇩🇰',
  'no-NO': '🇳🇴',
  'nb-NO': '🇳🇴',
  'nn-NO': '🇳🇴',
  'fi-FI': '🇫🇮',
  'el-GR': '🇬🇷',
  'cs-CZ': '🇨🇿',
  'hu-HU': '🇭🇺',
  'ro-RO': '🇷🇴',
  'sk-SK': '🇸🇰',
  'uk-UA': '🇺🇦',
  'he-IL': '🇮🇱',
  'bn-IN': '🇮🇳',
  'bn-BD': '🇧🇩',
  'ta-IN': '🇮🇳',
  'te-IN': '🇮🇳',
  'mr-IN': '🇮🇳',
  'ur-PK': '🇵🇰',
  'ur-IN': '🇮🇳',
  'et-EE': '🇪🇪',
  'lv-LV': '🇱🇻',
  'lt-LT': '🇱🇹',
  'hr-HR': '🇭🇷',
  'sr-RS': '🇷🇸',
  'sl-SI': '🇸🇮',
  'bg-BG': '🇧🇬',
  'ca-ES': '🇪🇸',
  'eu-ES': '🇪🇸',
  'gl-ES': '🇪🇸',
  'af-ZA': '🇿🇦',
  'sw-KE': '🇰🇪',
  'am-ET': '🇪🇹',
  'ne-NP': '🇳🇵',
  'si-LK': '🇱🇰',
  'km-KH': '🇰🇭',
  'lo-LA': '🇱🇦',
  'my-MM': '🇲🇲',
  'ka-GE': '🇬🇪',
  'hy-AM': '🇦🇲',
  'az-AZ': '🇦🇿',
  'kk-KZ': '🇰🇿',
  'uz-UZ': '🇺🇿',
  'fa-IR': '🇮🇷',
  'pa-IN': '🇮🇳',
  'gu-IN': '🇮🇳',
  'kn-IN': '🇮🇳',
  'ml-IN': '🇮🇳',
  'or-IN': '🇮🇳',
};

// Helper to get readable display name
function getReadableLanguageName(langCode) {
  // Try exact match first
  if (LANGUAGE_DISPLAY_NAMES[langCode]) return LANGUAGE_DISPLAY_NAMES[langCode];
  
  // Try base language code
  const baseCode = langCode.split('-')[0];
  const baseLangMap = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'fil': 'Filipino',
    'tl': 'Filipino',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'tr': 'Turkish',
    'pl': 'Polish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'nb': 'Norwegian',
    'nn': 'Norwegian',
    'fi': 'Finnish',
    'el': 'Greek',
    'cs': 'Czech',
    'hu': 'Hungarian',
    'ro': 'Romanian',
    'sk': 'Slovak',
    'uk': 'Ukrainian',
    'he': 'Hebrew',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'mr': 'Marathi',
    'ur': 'Urdu',
    'et': 'Estonian',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'hr': 'Croatian',
    'sr': 'Serbian',
    'sl': 'Slovenian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'eu': 'Basque',
    'gl': 'Galician',
    'af': 'Afrikaans',
    'sw': 'Swahili',
    'am': 'Amharic',
    'ne': 'Nepali',
    'si': 'Sinhala',
    'km': 'Khmer',
    'lo': 'Lao',
    'my': 'Myanmar',
    'ka': 'Georgian',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'kk': 'Kazakh',
    'uz': 'Uzbek',
    'fa': 'Persian',
    'pa': 'Punjabi',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'or': 'Odia',
  };
  
  // If we have a base language name but also a region, show both
  if (baseLangMap[baseCode]) {
    const regionCode = langCode.split('-')[1];
    if (regionCode) {
      return `${baseLangMap[baseCode]} (${regionCode})`;
    }
    return baseLangMap[baseCode];
  }
  
  return langCode;
}

// Get flag emoji for language code
function getLanguageFlag(langCode) {
  if (LANGUAGE_FLAGS[langCode]) return LANGUAGE_FLAGS[langCode];
  
  // Try to derive from region code
  const regionCode = langCode.split('-')[1];
  if (regionCode && regionCode.length === 2) {
    // Convert country code to flag emoji
    const codePoints = [...regionCode.toUpperCase()].map(
      char => 127397 + char.charCodeAt(0)
    );
    try {
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌐';
    }
  }
  return '🌐';
}

// Helper to generate voice labels (Voice A, Voice B, Voice C, etc.)
function getVoiceLabel(index) {
  // Use letters A-Z for first 26 voices, then AA, AB, etc.
  if (index < 26) {
    return `Voice ${String.fromCharCode(65 + index)}`; // A-Z
  }
  const first = Math.floor((index - 26) / 26);
  const second = (index - 26) % 26;
  return `Voice ${String.fromCharCode(65 + first)}${String.fromCharCode(65 + second)}`; // AA, AB, etc.
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
    this.wordUpdateCallback = null; // Callback for word updates
    this.onStartCallback = null; // Callback when audio starts
    this.onDoneCallback = null; // Callback when audio finishes
  }

  // Set callback for when audio starts
  setOnStartCallback(callback) {
    this.onStartCallback = callback;
  }

  // Set callback for when audio finishes
  setOnDoneCallback(callback) {
    this.onDoneCallback = callback;
  }

  // Set callback for word highlighting
  setWordUpdateCallback(callback) {
    this.wordUpdateCallback = callback;
  }

  // Get current word index
  getCurrentWordIndex() {
    return this.currentWordIndex;
  }

  // Get all words
  getWords() {
    return this.words;
  }

  /**
   * Get user's selected voice for a language, or use first available (Voice A)
   * Also saves the default voice if none was previously selected
   */
  async _getVoiceForLanguage(langCode, prefKey) {
    try {
      const prefs = await storageService.loadPreferences();
      const userVoice = prefs[prefKey];
      
      // Get all available voices first
      const voices = await Speech.getAvailableVoicesAsync();
      
      // Helper to check if voice identifier is valid
      const isValidVoiceId = (id) => {
        if (!id || typeof id !== 'string') return false;
        // Filter out malformed identifiers that end with -language, -voice, etc.
        if (id.endsWith('-language') || id.endsWith('-voice')) return false;
        return true;
      };
      
      // If user has a saved voice, validate it exists in available voices
      if (userVoice && isValidVoiceId(userVoice)) {
        const voiceExists = voices.some(v => v.identifier === userVoice);
        if (voiceExists) {
          console.log(`[TTS] Using user-selected voice: ${userVoice} for ${langCode}`);
          return userVoice;
        } else {
          console.log(`[TTS] User voice ${userVoice} not found, finding default`);
        }
      }
      
      // Find voices matching this language (only with valid identifiers)
      // Try exact match first, then base language match
      let matchingVoices = voices.filter(v => 
        v.language === langCode && isValidVoiceId(v.identifier)
      );
      
      // If no exact match, try base language (e.g., 'en' for 'en-US')
      if (matchingVoices.length === 0) {
        const baseCode = langCode.split('-')[0];
        matchingVoices = voices.filter(v => 
          v.language && v.language.startsWith(baseCode + '-') && isValidVoiceId(v.identifier)
        );
      }
      
      // Sort by name for consistent "Voice A" selection
      matchingVoices.sort((a, b) => 
        (a.name || a.identifier || '').localeCompare(b.name || b.identifier || '')
      );
      
      // Return first voice's identifier (Voice A) or null
      const firstVoice = matchingVoices[0];
      if (firstVoice && firstVoice.identifier) {
        console.log(`[TTS] Using default Voice A: ${firstVoice.identifier} for ${langCode}`);
        
        // Auto-save this as the default voice for this language so it's used next time
        try {
          const currentPrefs = await storageService.loadPreferences();
          if (!currentPrefs[prefKey]) {
            currentPrefs[prefKey] = firstVoice.identifier;
            await storageService.savePreferences(currentPrefs);
            console.log(`[TTS] Auto-saved default voice: ${prefKey} = ${firstVoice.identifier}`);
          }
        } catch (saveErr) {
          console.warn('[TTS] Could not auto-save voice preference:', saveErr);
        }
        
        return firstVoice.identifier;
      }
      
      // No voice found for this language - let system use default
      console.log(`[TTS] No valid voice found for ${langCode}, using system default`);
      return null;
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

    // Determine the actual language code
    let langCode;
    let prefKey;
    
    if (LANG_CONFIG[language]) {
      // Use predefined config
      langCode = LANG_CONFIG[language].lang;
      prefKey = LANG_CONFIG[language].prefKey;
    } else if (language.startsWith('lang_')) {
      // Dynamic language ID (e.g., 'lang_es_ES' -> 'es-ES')
      langCode = language.replace('lang_', '').replace(/_/g, '-');
      // Use underscores in prefKey to match what's saved in getAvailableVoices
      prefKey = `voice_${langCode.replace(/[^a-zA-Z0-9]/g, '_')}`;
    } else {
      // Fallback to US English
      langCode = 'en-US';
      prefKey = 'voiceUS';
    }
    
    // Get user's selected voice or auto-detect
    let voiceId = await this._getVoiceForLanguage(langCode, prefKey);
    
    // VALIDATE voice ID - if it looks invalid, set to null to use system default
    if (voiceId && typeof voiceId === 'string') {
      // Check if it looks like a constructed string like "en-IN-language" (invalid)
      if (voiceId.includes('-language') || voiceId.includes('-voice') || !voiceId.includes('-')) {
        console.warn(`[TTS] Invalid voice ID detected: ${voiceId}, using system default`);
        voiceId = null;
      }
    }
    
    const finalPitch = clamp(Number(pitch) || 1.0, 0.5, 2.0);
    const finalRate = clamp(Number(speed) || 1.0, 0.5, 2.0);

    console.log(`[TTS] Speaking: lang=${langCode}, voice=${voiceId || 'system-default'}, pitch=${finalPitch}, rate=${finalRate}`);

    return new Promise((resolve, reject) => {
      Speech.speak(text, {
        language: langCode,
        voice: voiceId || undefined, // Use undefined if null, not empty string
        pitch: finalPitch,
        rate: finalRate,
        onStart: () => {
          this.isSpeaking = true;
          this.isPaused = false;
          // Call the onStart callback to show UI
          if (this.onStartCallback) {
            this.onStartCallback();
          }
        },
        onDone: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          // Call the onDone callback to handle completion
          if (this.onDoneCallback) {
            this.onDoneCallback();
          }
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
    // Skip forward by 1 word
    this.currentWordIndex = Math.min(this.words.length - 1, this.currentWordIndex + 1);
    const remaining = this.words.slice(this.currentWordIndex).join(' ');
    
    if (remaining.trim()) {
      const { language, pitch, speed } = this.currentSettings;
      if (this.wordUpdateCallback) {
        this.wordUpdateCallback(this.currentWordIndex);
      }
      return this.speak({ text: remaining, language, pitch, speed });
    }
  }

  async skipBackward() {
    if (!this.currentSettings || !this.currentText) return;
    
    await this.stop();
    // Skip backward by 1 word
    this.currentWordIndex = Math.max(0, this.currentWordIndex - 1);
    const remaining = this.words.slice(this.currentWordIndex).join(' ');
    
    if (remaining.trim()) {
      const { language, pitch, speed } = this.currentSettings;
      if (this.wordUpdateCallback) {
        this.wordUpdateCallback(this.currentWordIndex);
      }
      return this.speak({ text: remaining, language, pitch, speed });
    }
  }

  getIsSpeaking() { return this.isSpeaking; }
  getIsPaused() { return this.isPaused; }

  /**
   * Get available voices - ALL languages, prioritize US, UK, Filipino
   */
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      
      // Filter out blacklisted languages AND voices with malformed identifiers
      // Some devices return identifiers like "en-IN-language" which are invalid
      const filteredVoices = voices.filter(voice => {
        // Skip blacklisted languages
        if (BLACKLISTED_LANGUAGES.includes(voice.language)) return false;
        
        // Skip voices with malformed identifiers (ending in -language, -voice, etc.)
        const id = voice.identifier || '';
        if (id.endsWith('-language') || id.endsWith('-voice') || id.endsWith('-network-language')) {
          console.log(`[TTS] Filtering out malformed voice: ${id}`);
          return false;
        }
        
        return true;
      });
      
      // Group voices by language
      const languageGroups = {};
      
      filteredVoices.forEach((voice, index) => {
        const lang = voice.language || 'unknown';
        const id = voice.identifier || `voice_${index}`;
        
        // Get language display name and flag
        const langDisplayName = getReadableLanguageName(lang);
        const flag = getLanguageFlag(lang);
        
        if (!languageGroups[lang]) {
          languageGroups[lang] = {
            language: langDisplayName,
            langCode: lang,
            flag: flag,
            voices: [],
            isPriority: PRIORITY_LANGUAGES.some(pl => 
              lang === pl || lang.startsWith(pl.split('-')[0] + '-')
            ),
          };
        }
        
        // FIX: Use identifier (id) not language property for voice ID
        languageGroups[lang].voices.push({
          id: id,  // This is the actual voice identifier
          name: voice.name || id,
          language: lang,  // This is just the language code, NOT the voice ID
          quality: voice.quality || '',
        });
      });

      // Convert to array and assign voice labels (Voice A, Voice B, etc.)
      const allLanguages = Object.values(languageGroups).map(group => {
        // Sort voices within each language group
        const sortedVoices = group.voices.sort((a, b) => a.name.localeCompare(b.name));
        
        // Give them Voice A, Voice B, etc. labels
        const voicesWithLabels = sortedVoices.map((voice, idx) => ({
          ...voice,
          displayName: getVoiceLabel(idx),
          technicalName: voice.name,
        }));
        
        // Determine langKey for preferences
        let langKey = `voice_${group.langCode.replace(/[^a-zA-Z0-9]/g, '_')}`;
        if (group.langCode === 'en-US') {
          langKey = 'voiceUS';
        } else if (group.langCode === 'en-GB') {
          langKey = 'voiceUK';
        } else if (group.langCode.startsWith('fil') || group.langCode.startsWith('tl')) {
          langKey = 'voiceFil';
        }
        
        return {
          ...group,
          voices: voicesWithLabels,
          count: voicesWithLabels.length,
          langKey: langKey,
        };
      });

      // Separate priority and other languages
      const priorityLangs = allLanguages.filter(g => g.isPriority);
      const otherLangs = allLanguages.filter(g => !g.isPriority);
      
      // Sort priority languages by specific order (US first, UK second, Filipino third)
      const priorityOrder = { 'en-US': 1, 'en-GB': 2, 'fil-PH': 3, 'fil': 3, 'tl-PH': 4, 'tl': 4 };
      priorityLangs.sort((a, b) => {
        const orderA = priorityOrder[a.langCode] || 999;
        const orderB = priorityOrder[b.langCode] || 999;
        return orderA - orderB;
      });
      
      // Sort other languages alphabetically by display name
      otherLangs.sort((a, b) => a.language.localeCompare(b.language));

      const result = [...priorityLangs, ...otherLangs];
      const totalVoices = result.reduce((sum, g) => sum + g.count, 0);

      return {
        totalVoices,
        languages: result,
        priorityLanguages: priorityLangs,
        otherLanguages: otherLangs,
      };
    } catch (err) {
      console.error('[TTS] Error getting voices:', err);
      return { totalVoices: 0, languages: [], priorityLanguages: [], otherLanguages: [] };
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
      // Validate the voice ID before saving
      if (!voiceId || voiceId.endsWith('-language') || voiceId.endsWith('-voice')) {
        console.warn(`[TTS] Not saving invalid voice ID: ${voiceId}`);
        return false;
      }
      
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
   * Get current voice preferences (all languages)
   */
  async getVoicePreferences() {
    try {
      const prefs = await storageService.loadPreferences();
      // Return all voice-related preferences (voiceUS, voiceUK, voiceFil, voice_*)
      const voicePrefs = {};
      Object.keys(prefs).forEach(key => {
        if (key.startsWith('voice') || key.startsWith('voice_')) {
          voicePrefs[key] = prefs[key];
        }
      });
      return voicePrefs;
    } catch {
      return {};
    }
  }

  /**
   * Get available language options for language selector
   * Returns priority languages first (US, UK, Filipino), then others
   */
  async getLanguageOptions() {
    try {
      const voiceData = await this.getAvailableVoices();
      
      // Build language options with unique IDs
      const options = [];
      const seenLangCodes = new Set();
      
      // Add priority languages first
      voiceData.priorityLanguages.forEach(lang => {
        if (seenLangCodes.has(lang.langCode)) return; // Skip duplicates
        seenLangCodes.add(lang.langCode);
        
        // Map to language code for compatibility
        let langId = `lang_${lang.langCode.replace(/[^a-zA-Z0-9]/g, '_')}`;
        if (lang.langCode === 'en-US') langId = 'en_us_f';
        else if (lang.langCode === 'en-GB') langId = 'en_uk_m';
        else if (lang.langCode.startsWith('fil') || lang.langCode.startsWith('tl')) langId = 'fil_f';
        
        options.push({
          id: langId,
          name: lang.language,
          flag: lang.flag || '🌐',
          langCode: lang.langCode,
          isPriority: true,
        });
      });
      
      // Add other languages
      voiceData.otherLanguages.forEach(lang => {
        if (seenLangCodes.has(lang.langCode)) return; // Skip duplicates
        seenLangCodes.add(lang.langCode);
        
        // Create a unique ID for this language
        const langId = `lang_${lang.langCode.replace(/[^a-zA-Z0-9]/g, '_')}`;
        
        options.push({
          id: langId,
          name: lang.language,
          flag: lang.flag || '🌐',
          langCode: lang.langCode,
          isPriority: false,
        });
      });
      
      return options;
    } catch (err) {
      console.error('[TTS] Error getting language options:', err);
      // Fallback to default
      return [
        { id: 'en_us_f', name: 'English (US)', flag: '🇺🇸', langCode: 'en-US', isPriority: true },
        { id: 'en_uk_m', name: 'English (UK)', flag: '🇬🇧', langCode: 'en-GB', isPriority: true },
        { id: 'fil_f', name: 'Filipino', flag: '🇵🇭', langCode: 'fil-PH', isPriority: true },
      ];
    }
  }
}

export const ttsService = new TTSService();

