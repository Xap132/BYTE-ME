// Preset language options (one voice per option)
// - US Female
// - UK Male
// - Filipino Female
export const LANGUAGE_CODES = {
  en_us_f: 'en-US',
  en_uk_m: 'en-GB',
  fil_f: 'fil-PH',

  // Backward-compatible legacy ids
  en: 'en-US',
  fil: 'fil-PH',
};

// Available language presets for the UI
// 3 options: US (female), UK (male), Filipino (female)
export const LANGUAGES = [
  { id: 'en_us_f', name: 'US', flag: '🇺🇸' },
  { id: 'en_uk_m', name: 'UK', flag: '🇬🇧' },
  { id: 'fil_f', name: 'Filipino', flag: '🇵🇭' },
];

// Default TTS settings
export const DEFAULT_SETTINGS = {
  pitch: 1.0,
  speed: 1.0,
  minPitch: 0.5,
  maxPitch: 2.0,
  minSpeed: 0.25,
  maxSpeed: 2.0,
};

// Get language by ID
export const getLanguage = (id) => {
  return LANGUAGES.find(lang => lang.id === id) || LANGUAGES[0];
};

// Map preset language id to a fixed gender.
// Used to keep saving/playing consistent without a separate voice toggle.
export const getPresetVoice = (languageId) => {
  if (languageId === 'en_uk_m') return 'male';
  return 'female';
};
