// Available TTS voices for English and Filipino
export const VOICES = [
  // English voices - Using standard language codes for Android
  {
    id: 'en-male-1',
    name: 'English Male (US)',
    language: 'en',
    gender: 'male',
    identifier: 'en-us-x-sfg#male_1-local', // Android male voice
  },
  {
    id: 'en-female-1',
    name: 'English Female (US)',
    language: 'en',
    gender: 'female',
    identifier: 'en-us-x-sfg#female_1-local', // Android female voice
  },
  {
    id: 'en-male-2',
    name: 'English Male (UK)',
    language: 'en',
    gender: 'male',
    identifier: 'en-gb-x-rjs#male_1-local', // Android UK male
  },
  {
    id: 'en-female-2',
    name: 'English Female (UK)',
    language: 'en',
    gender: 'female',
    identifier: 'en-gb-x-rjs#female_1-local', // Android UK female
  },
  // Filipino voices - Using correct locale codes
  {
    id: 'fil-male-1',
    name: 'Filipino Male',
    language: 'fil',
    gender: 'male',
    identifier: 'fil-ph-x-cfc#male_1-local', // Android Filipino male
  },
  {
    id: 'fil-female-1',
    name: 'Filipino Female',
    language: 'fil',
    gender: 'female',
    identifier: 'fil-ph-x-cfc#female_1-local', // Android Filipino female
  },
];

// Language codes for expo-speech
export const LANGUAGE_CODES = {
  en: 'en-US',
  fil: 'fil-PH',
};

// Default TTS settings
export const DEFAULT_SETTINGS = {
  pitch: 1.0,
  speed: 1.0,
  minPitch: 0.5,
  maxPitch: 2.0,
  minSpeed: 0.5,
  maxSpeed: 2.0,
};

// Audio format options
export const AUDIO_FORMATS = ['mp3', 'wav'];

// Get voices by language
export const getVoicesByLanguage = (language) => {
  return VOICES.filter(voice => voice.language === language);
};

// Get voices by gender
export const getVoicesByGender = (gender) => {
  return VOICES.filter(voice => voice.gender === gender);
};

// Get specific voice
export const getVoice = (language, gender) => {
  return VOICES.find(voice => voice.language === language && voice.gender === gender);
};
