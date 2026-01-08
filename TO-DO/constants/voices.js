// Language codes for expo-speech
export const LANGUAGE_CODES = {
  en: 'en-US',
  fil: 'fil-PH',
};

// Available languages for the UI
export const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'fil', name: 'Filipino', flag: '🇵🇭' },
];

// Voice types
export const VOICE_TYPES = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
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
