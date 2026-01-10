# Tech Talk: Text-to-Speech Application

## Project Documentation & Defense Guide

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [React Native Basics](#react-native-basics)
3. [File Structure & Explanations](#file-structure--explanations)
4. [Target Users](#target-users)
5. [Core Features](#core-features)
6. [Technical Architecture](#technical-architecture)
7. [UI/UX Design Philosophy](#uiux-design-philosophy)
8. [Code Structure & Modularity](#code-structure--modularity)
9. [Development Methodology](#development-methodology)
10. [Workflow](#workflow)
11. [Key Components Breakdown](#key-components-breakdown)
12. [Defense Q&A](#defense-qa)

---

## Project Overview

**Tech Talk** is a modern, cross-platform Text-to-Speech (TTS) mobile application built with React Native and Expo. The app enables users to convert text into spoken audio using device-native TTS engines, with support for multiple languages, voices, and customizable playback settings.

### Key Highlights
- 🎙️ **Multi-language TTS** - Support for 50+ languages and regional voices
- 🎨 **Dark/Light Mode** - Fully themed UI with orange accent colors
- 💾 **Audio Library** - Save, manage, and replay generated audio files
- ⚙️ **Customization** - Adjustable pitch, speed, and voice selection
- 📱 **Cross-Platform** - Works on both Android and iOS devices
- 🚀 **Animated Splash Screen** - Professional "Tech Talk" loading screen

---

## React Native Basics

### What is React Native?
React Native is a framework created by Facebook (Meta) that allows developers to build mobile applications using JavaScript and React. Instead of writing separate code for Android and iOS, you write once and deploy to both platforms.

### Core Concepts Used in This App

#### 1. **Components**
Components are the building blocks of React Native apps. They are reusable pieces of UI.

```javascript
// A simple component example
function MyButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

#### 2. **JSX (JavaScript XML)**
JSX lets you write HTML-like syntax in JavaScript:

```javascript
// JSX example
return (
  <View style={styles.container}>
    <Text>Hello World</Text>
  </View>
);
```

#### 3. **State (useState)**
State is data that can change over time. When state changes, the component re-renders.

```javascript
const [text, setText] = useState(''); // Initialize empty string
// text = current value
// setText = function to update value
```

#### 4. **Effects (useEffect)**
useEffect runs side effects (API calls, subscriptions) when components mount or state changes.

```javascript
useEffect(() => {
  // This runs when component mounts
  loadData();
}, []); // Empty array = run once on mount

useEffect(() => {
  // This runs when 'text' changes
  console.log('Text changed:', text);
}, [text]); // Dependency array
```

#### 5. **Props**
Props are data passed from parent to child components:

```javascript
// Parent
<ChildComponent title="Hello" color="red" />

// Child
function ChildComponent({ title, color }) {
  return <Text style={{ color }}>{title}</Text>;
}
```

#### 6. **StyleSheet**
React Native uses JavaScript objects for styling (similar to CSS):

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,              // Flexbox - take full space
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

#### 7. **Context API**
Context provides a way to share data across components without passing props manually:

```javascript
// Create context
const ThemeContext = createContext();

// Provide value
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  {children}
</ThemeContext.Provider>

// Consume in any child
const { theme } = useContext(ThemeContext);
```

#### 8. **Navigation (Expo Router)**
Expo Router uses file-based routing - file names become routes:

```
app/
  (tabs)/           → Tab navigator group
    index.js        → "/" route (Create tab)
    explore.js      → "/explore" route (Library tab)
    settings.js     → "/settings" route (Settings tab)
    _layout.js      → Tab bar configuration
  _layout.js        → Root layout (wraps everything)
```

---

## File Structure & Explanations

### 📁 Root Configuration Files

#### `app.json`
**Purpose**: Expo configuration file
**What it does**: Defines app name, version, icons, splash screen, permissions

```json
{
  "expo": {
    "name": "Tech Talk",
    "slug": "tech-talk",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": { ... }
  }
}
```

#### `package.json`
**Purpose**: Node.js project manifest
**What it does**: Lists all dependencies (libraries) the app uses

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-speech": "~12.0.0",    // TTS library
    "expo-file-system": "~17.0.0", // File storage
    "react-native": "0.74.0"
  }
}
```

#### `tsconfig.json`
**Purpose**: TypeScript configuration
**What it does**: Configures path aliases like `@/` for cleaner imports

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // @/services means ./services
    }
  }
}
```

---

### 📁 `/app` - Screen Components (Expo Router)

#### `app/_layout.js` - Root Layout
**Purpose**: Entry point - wraps entire app
**What it does**:
1. Loads custom fonts (SF Pro Display)
2. Shows animated splash screen ("Tech Talk")
3. Provides theme context to all screens
4. Sets up navigation structure

**Key Code Explained**:
```javascript
// Load fonts before showing app
const [fontsLoaded] = useFonts({
  'SF-Pro-Regular': require('../assets/sf-pro-display/...'),
});

// Show splash screen while loading
if (showSplash) {
  return <AppSplashScreen onFinish={handleSplashFinish} />;
}

// Wrap app with providers (Context)
return (
  <SafeAreaProvider>         {/* Handles notch/safe areas */}
    <CustomThemeProvider>    {/* Dark/Light mode */}
      <ThemeProvider>        {/* Navigation theme */}
        <Stack>              {/* Stack navigator */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </CustomThemeProvider>
  </SafeAreaProvider>
);
```

#### `app/(tabs)/_layout.js` - Tab Bar Layout
**Purpose**: Configures bottom tab navigation
**What it does**:
1. Defines 3 tabs (Create, Library, Settings)
2. Handles responsive sizing for different phones
3. Animates tab icons when selected

**Key Code Explained**:
```javascript
// Responsive tab bar height based on screen size
const getTabBarHeight = (screenHeight) => {
  if (screenHeight < 700) return 50;  // Small phones
  if (screenHeight < 800) return 54;  // Medium
  return 58;                           // Large phones
};

// Tab configuration
<Tabs screenOptions={{
  tabBarStyle: {
    height: actualTabBarHeight,
    backgroundColor: theme.tabBarBg,
  }
}}>
  <Tabs.Screen name="index" />     {/* Create tab */}
  <Tabs.Screen name="explore" />   {/* Library tab */}
  <Tabs.Screen name="settings" />  {/* Settings tab */}
</Tabs>
```

#### `app/(tabs)/index.js` - Create Screen (Main TTS Screen)
**Purpose**: Main screen for creating TTS audio
**What it does**:
1. Text input for entering/pasting text
2. File upload for importing .txt files
3. Language and voice selection
4. Pitch/Speed controls
5. Play and Save buttons
6. Sticky player for playback control

**Key States**:
```javascript
const [text, setText] = useState('');        // User's text input
const [mode, setMode] = useState('TEXT_INPUT'); // Input mode
const [language, setLanguage] = useState('en-US');
const [pitch, setPitch] = useState(1.0);     // Voice pitch
const [speed, setSpeed] = useState(1.0);     // Playback speed
const [isSpeaking, setIsSpeaking] = useState(false);
```

#### `app/(tabs)/explore.js` - Library Screen
**Purpose**: Browse and manage saved audio
**What it does**:
1. Lists all saved TTS recordings
2. Play any saved audio
3. Delete or share recordings
4. "Now Playing" bar with progress slider

#### `app/(tabs)/settings.js` - Settings Screen
**Purpose**: App configuration
**What it does**:
1. Dark/Light mode toggle
2. About section
3. Clear data option

---

### 📁 `/contexts` - State Management

#### `contexts/ThemeContext.js`
**Purpose**: Global theme state (dark/light mode)
**What it does**:
1. Stores current theme preference
2. Provides `theme` object to all components
3. Persists theme choice to storage

**Key Code Explained**:
```javascript
// Create context with default values
const ThemeContext = createContext({
  theme: Colors.techTalk,
  isDarkMode: true,
  toggleTheme: () => {},
});

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Choose theme based on mode
  const theme = isDarkMode ? Colors.techTalk : Colors.techTalkLight;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Usage in any component**:
```javascript
const { theme, isDarkMode, toggleTheme } = useTheme();
// theme.background, theme.text, theme.orangeBtn, etc.
```

---

### 📁 `/services` - Business Logic

#### `services/ttsService.js`
**Purpose**: All Text-to-Speech operations
**What it does**:
1. `speak(text, options)` - Start TTS playback
2. `stop()` - Stop playback
3. `pause()` / `resume()` - Pause/resume
4. `getAvailableVoices()` - Get device voices
5. `getAvailableLanguages()` - Get supported languages
6. Filters out invalid/malformed voice IDs

**Key Code Explained**:
```javascript
// Speak text with options
async speak(text, options = {}) {
  const { language, pitch, rate, voice } = options;
  
  await Speech.speak(text, {
    language: language || 'en-US',
    pitch: pitch || 1.0,
    rate: rate || 1.0,
    voice: voice,  // Specific voice ID
    onStart: () => console.log('Started'),
    onDone: () => console.log('Finished'),
    onError: (error) => console.error(error),
  });
}

// Filter bad voice IDs (some devices return invalid ones)
const isValidVoiceId = (identifier) => {
  const invalidPatterns = ['-language', '-voice'];
  return !invalidPatterns.some(p => 
    identifier.toLowerCase().endsWith(p)
  );
};
```

#### `services/audioManager.js`
**Purpose**: Audio file management
**What it does**:
1. Save TTS as audio file metadata
2. Load saved audio list
3. Delete audio files
4. Initialize audio directory

**Key Code Explained**:
```javascript
// Save audio metadata (not actual audio - uses TTS for replay)
async saveAudioFile(text, options) {
  const audioFile = {
    id: Date.now().toString(),
    name: `tts_${Date.now()}.wav`,
    text: text,           // Store text for replay
    language: options.language,
    pitch: options.pitch,
    speed: options.speed,
  };
  
  await this.saveAudioMetadata(audioFile);
  return audioFile;
}
```

#### `services/storageService.js`
**Purpose**: Persistent data storage
**What it does**:
1. Save/load user preferences
2. Save/load audio metadata
3. Uses AsyncStorage (like localStorage for mobile)

**Key Code Explained**:
```javascript
// Save preferences
async savePreferences(preferences) {
  await AsyncStorage.setItem(
    '@tts_user_preferences',
    JSON.stringify(preferences)
  );
}

// Load preferences
async loadPreferences() {
  const data = await AsyncStorage.getItem('@tts_user_preferences');
  return data ? JSON.parse(data) : DEFAULT_PREFERENCES;
}
```

---

### 📁 `/constants` - App Constants

#### `constants/theme.ts`
**Purpose**: Color definitions
**What it does**: Defines all colors for dark and light themes

```javascript
export const Colors = {
  techTalk: {  // Dark theme
    background: '#101828',
    tabBarBg: '#3C3C43',
    orangeBtn: '#CD8546',
    text: '#FFFFFF',
    textSecondary: '#D4D4D8',
  },
  techTalkLight: {  // Light theme
    background: '#FFFFFF',
    tabBarBg: '#F8F9FA',
    orangeBtn: '#CD8546',
    text: '#1F2937',
    textSecondary: '#6B7280',
  },
};
```

#### `constants/voices.js`
**Purpose**: Voice and language definitions
**What it does**: Maps language codes to display names, flags, default voices

---

### 📁 `/components` - Reusable UI Components

#### Structure:
```
components/
├── ui/
│   ├── base/          # Basic building blocks
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   └── Slider.js
│   └── layout/        # Layout components
│       ├── Header.js
│       └── ScreenLayout.js
├── features/          # Feature-specific
│   ├── audio/
│   ├── tts/
│   └── settings/
└── audio/             # Audio player components
```

---

### 📁 `/hooks` - Custom React Hooks

#### `hooks/useTTS/useTTS.js`
**Purpose**: Encapsulate TTS logic
**What it does**: Provides easy-to-use TTS functions

```javascript
const { speak, stop, isSpeaking, voices } = useTTS();
```

#### `hooks/useAudio/useAudio.js`
**Purpose**: Encapsulate audio playback logic

---

### 📁 `/assets` - Static Files

```
assets/
├── images/              # App images
└── sf-pro-display/      # Custom fonts
    ├── SFPRODISPLAYREGULAR.otf
    ├── SFPRODISPLAYMEDIUM.otf
    └── SFPRODISPLAYBOLD.otf
```

---

## Target Users

### Primary Users
1. **Students & Learners**
   - Learn pronunciation in foreign languages
   - Listen to study materials while multitasking
   - Accessibility for reading difficulties

2. **Content Creators**
   - Generate voiceovers for videos/presentations
   - Prototype audio content before professional recording
   - Quick audio clips for social media

3. **Professionals**
   - Proofread written content by listening
   - Convert documents to audio for commute listening
   - Accessibility accommodation in workplace

4. **Visually Impaired Users**
   - Convert any text content to audio
   - Better accessibility than built-in screen readers
   - Customizable voice preferences

### Use Cases
- Converting articles/documents to audio
- Language learning and pronunciation practice
- Creating audio notes and reminders
- Accessibility tool for reading impairments
- Content creation and prototyping

---

## Core Features

### 1. Text-to-Speech Creation
```
Location: app/(tabs)/index.js
```
- **Text Input Mode**: Type or paste text directly
- **File Upload Mode**: Import .txt files from device
- **Character Counter**: Real-time character count display
- **Play/Save Actions**: Instant playback or save for later

### 2. Voice & Language Selection
```
Location: services/ttsService.js, constants/voices.js
```
- **50+ Languages**: Comprehensive language support
- **Multiple Voices**: Regional variants (US, UK, AU English, etc.)
- **Voice Filtering**: Removes invalid/malformed voice IDs
- **Smart Defaults**: Remembers user's preferred voice

### 3. Audio Playback Controls
```
Location: app/(tabs)/index.js (Sticky Player)
```
- **Pitch Control**: Range 0.5x to 2.0x
- **Speed Control**: Range 0.5x to 2.0x
- **Play/Pause/Stop**: Full playback control
- **Progress Display**: Shows current playback status

### 4. Audio Library
```
Location: app/(tabs)/explore.js
```
- **Saved Recordings**: Browse all saved TTS audio
- **Playback**: Play any saved audio with controls
- **Management**: Delete, share, or export audio files
- **Search/Filter**: Find recordings quickly

### 5. Settings & Preferences
```
Location: app/(tabs)/settings.js
```
- **Theme Toggle**: Dark/Light mode switch
- **About Section**: App version and developer info
- **Data Management**: Clear cache, reset preferences

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React Native + Expo | Cross-platform mobile development |
| Navigation | Expo Router | File-based routing with tabs |
| TTS Engine | expo-speech | Native TTS integration |
| Storage | expo-file-system | Audio file management |
| State | React Context + Hooks | Global state management |
| Styling | StyleSheet + Theme Context | Dynamic theming |

### Directory Structure
```
TechTalk/
├── app/                    # Screen components (Expo Router)
│   ├── _layout.js          # Root layout with providers
│   └── (tabs)/             # Tab-based navigation
│       ├── _layout.js      # Tab bar configuration
│       ├── index.js        # Create TTS screen
│       ├── explore.js      # Audio library screen
│       └── settings.js     # Settings screen
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   │   ├── base/           # Button, Card, Input, etc.
│   │   └── layout/         # Header, ScreenLayout
│   ├── features/           # Feature-specific components
│   │   ├── audio/          # Audio-related components
│   │   ├── tts/            # TTS-specific components
│   │   └── settings/       # Settings components
│   └── audio/              # Audio player components
├── constants/              # App constants
│   ├── theme.ts            # Color themes (dark/light)
│   └── voices.js           # Language & voice definitions
├── contexts/               # React Context providers
│   └── ThemeContext.js     # Theme state management
├── hooks/                  # Custom React hooks
│   ├── useAudio/           # Audio playback hook
│   └── useTTS/             # TTS functionality hook
├── services/               # Business logic services
│   ├── ttsService.js       # TTS operations
│   ├── audioManager.js     # Audio file management
│   └── storageService.js   # Persistent storage
└── assets/                 # Static assets
    ├── images/             # App images
    └── sf-pro-display/     # Custom fonts
```

---

## UI/UX Design Philosophy

### Design Principles

#### 1. Minimal and Consistent Design
- **Orange Accent Theme**: Consistent use of `#CD8546` across buttons, highlights, and active states
- **Clean Typography**: SF Pro Display font family throughout
- **Generous Spacing**: 20-24px padding for comfortable touch targets
- **Rounded Elements**: 24-30px border radius for modern aesthetic

#### 2. User-Friendly Navigation
- **Tab-Based Structure**: Three main tabs (Create, Library, Settings)
- **Clear Labels**: Each tab has icon + text label
- **Visual Feedback**: Animated tab icons with scale and translate effects
- **Sticky Player**: Persistent playback controls when audio is playing

#### 3. Accessibility
- **High Contrast**: Text/background ratios meet WCAG guidelines
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Theme Support**: Dark/Light mode for user preference
- **Clear Feedback**: Visual states for all interactive elements

### Color System

#### Dark Theme (`techTalk`)
```javascript
{
  background: '#101828',      // Deep navy background
  tabBarBg: '#3C3C43',        // Elevated surface
  orangeBtn: '#CD8546',       // Primary action color
  text: '#FFFFFF',            // Primary text
  textSecondary: '#D4D4D8',   // Secondary text
  inputBg: '#FFF0DB',         // Input field background
}
```

#### Light Theme (`techTalkLight`)
```javascript
{
  background: '#FFFFFF',      // Clean white background
  tabBarBg: '#F8F9FA',        // Subtle gray surface
  orangeBtn: '#CD8546',       // Primary action (same)
  text: '#1F2937',            // Dark text for contrast
  textSecondary: '#6B7280',   // Muted gray text
  inputBg: '#FFF8F0',         // Warm cream input background
}
```

---

## Code Structure & Modularity

### Component Organization

#### 1. Base UI Components (`components/ui/base/`)
Reusable, theme-aware building blocks:
- `Button.js` - Styled buttons with variants
- `Card.js` - Container component
- `Input.js` - Text input fields
- `Slider.js` - Range slider control
- `SegmentedControl.js` - Tab-like selector

#### 2. Layout Components (`components/ui/layout/`)
Structural components:
- `Header.js` - Screen headers with back navigation
- `ScreenLayout.js` - Safe area wrapper

#### 3. Feature Components (`components/features/`)
Domain-specific components:
- `audio/` - AudioListItem, AudioPlayerControls, EmptyState
- `tts/` - LanguageSelector, VoiceSelector, PlaybackControls
- `settings/` - SettingsActionItem, SettingsSwitchItem

### Service Layer Architecture

#### ttsService.js
```javascript
// Core TTS operations
const ttsService = {
  speak(text, options)           // Start TTS playback
  stop()                         // Stop current playback
  pause()                        // Pause playback
  resume()                       // Resume playback
  getAvailableVoices()           // Get filtered voice list
  setVoicePreference(voiceId)    // Save voice preference
  getVoicePreference()           // Load voice preference
}
```

**Voice Filtering Logic:**
```javascript
// Filters out malformed voice IDs from device
const isValidVoiceId = (identifier) => {
  if (!identifier) return false;
  // Filter out IDs ending with -language, -voice, etc.
  const invalidPatterns = ['-language', '-voice', '-lang'];
  return !invalidPatterns.some(pattern => 
    identifier.toLowerCase().endsWith(pattern)
  );
};
```

#### audioManager.js
```javascript
// Audio file operations
const audioManager = {
  saveAudio(text, voice, settings)  // Save TTS as audio file
  loadAudioList()                   // Get all saved audio
  deleteAudio(id)                   // Remove audio file
  shareAudio(id)                    // Export/share audio
}
```

#### storageService.js
```javascript
// Persistent storage
const storageService = {
  saveSettings(key, value)    // Store preference
  loadSettings(key)           // Retrieve preference
  clearAll()                  // Reset all data
}
```

### Custom Hooks

#### useTTS Hook
```javascript
const {
  speak,
  stop,
  isSpeaking,
  isPaused,
  voices,
  selectedVoice,
  setSelectedVoice,
  pitch,
  setPitch,
  rate,
  setRate,
} = useTTS();
```

#### useAudio Hook
```javascript
const {
  audioList,
  currentPlaying,
  playAudio,
  pauseAudio,
  stopAudio,
  deleteAudio,
  refreshList,
} = useAudio();
```

---

## Development Methodology

### Agile Approach
We followed an iterative development process:

1. **Sprint 1: Core Setup**
   - Project initialization with Expo
   - Basic navigation structure
   - Theme system foundation

2. **Sprint 2: TTS Implementation**
   - expo-speech integration
   - Voice selection logic
   - Playback controls

3. **Sprint 3: Audio Library**
   - File system integration
   - Save/load functionality
   - Library UI

4. **Sprint 4: Polish & Optimization**
   - Theme refinement (dark/light)
   - Animation improvements
   - Bug fixes and edge cases

### Key Design Decisions

#### Why Expo?
- **Faster Development**: Pre-built APIs for TTS, file system, etc.
- **Cross-Platform**: Single codebase for Android & iOS
- **Managed Workflow**: No native code configuration needed
- **OTA Updates**: Push updates without app store review

#### Why expo-speech over alternatives?
- **Native Integration**: Uses device's built-in TTS engine
- **No API Costs**: Free, unlimited TTS usage
- **Offline Support**: Works without internet connection
- **Voice Variety**: Access to all device-installed voices

#### Why Context API over Redux?
- **Simplicity**: Minimal boilerplate for our scale
- **Native React**: No additional dependencies
- **Sufficient**: Our state needs are straightforward
- **Performance**: Adequate for our component tree depth

---

## Workflow

### User Flow Diagram
```
┌─────────────┐
│   Launch    │
│    App      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Create    │◄────────────────────┐
│    Tab      │                     │
└──────┬──────┘                     │
       │                            │
       ▼                            │
┌─────────────┐    ┌─────────────┐  │
│ Enter Text  │    │ Upload File │  │
│   or        │◄──►│             │  │
└──────┬──────┘    └──────┬──────┘  │
       │                  │         │
       └────────┬─────────┘         │
                │                   │
                ▼                   │
       ┌─────────────┐              │
       │   Select    │              │
       │   Language  │              │
       └──────┬──────┘              │
              │                     │
              ▼                     │
       ┌─────────────┐              │
       │   Adjust    │              │
       │ Pitch/Speed │              │
       └──────┬──────┘              │
              │                     │
              ▼                     │
       ┌─────────────┐              │
       │   Play or   │              │
       │    Save     │              │
       └──────┬──────┘              │
              │                     │
    ┌─────────┴─────────┐           │
    │                   │           │
    ▼                   ▼           │
┌─────────┐      ┌─────────────┐    │
│  Play   │      │   Saved to  │    │
│ (Modal) │      │   Library   │    │
└────┬────┘      └──────┬──────┘    │
     │                  │           │
     │                  ▼           │
     │           ┌─────────────┐    │
     │           │   Library   │    │
     │           │    Tab      │────┘
     │           └─────────────┘
     │
     └──────────────────────────────┘
```

### Data Flow
```
User Input
    │
    ▼
┌──────────────┐
│  Component   │ (index.js, explore.js)
│   State      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │ (ttsService, audioManager)
│    Layer     │
└──────┬───────┘
       │
       ├────────────────────┐
       │                    │
       ▼                    ▼
┌──────────────┐    ┌──────────────┐
│  expo-speech │    │ expo-file-   │
│    (TTS)     │    │   system     │
└──────────────┘    └──────────────┘
```

---

## Key Components Breakdown

### 1. Create Screen (`index.js`)

**Purpose**: Main TTS creation interface

**Key States**:
```javascript
const [text, setText] = useState('');           // User input text
const [mode, setMode] = useState('TEXT_INPUT'); // Input mode
const [language, setLanguage] = useState('en-US');
const [voice, setVoice] = useState(null);
const [pitch, setPitch] = useState(1.0);
const [speed, setSpeed] = useState(1.0);
const [isSpeaking, setIsSpeaking] = useState(false);
```

**Key Functions**:
- `handlePlay()` - Start TTS playback
- `handleSave()` - Save audio to library
- `handleImportFile()` - Load text from file

### 2. Library Screen (`explore.js`)

**Purpose**: Browse and manage saved audio

**Key Features**:
- FlatList for audio items
- Swipe actions (delete, share)
- Now Playing bar with slider
- Pull-to-refresh

### 3. Settings Screen (`settings.js`)

**Purpose**: App configuration

**Key Features**:
- Dark/Light mode toggle
- Clear data option
- About section

### 4. Tab Layout (`_layout.js`)

**Purpose**: Navigation structure

**Key Features**:
- Animated tab icons (scale, opacity, translateY)
- Theme-aware styling
- Safe area handling

---

## Defense Q&A

### Technical Questions

**Q1: Why did you choose React Native over native development?**
> We chose React Native with Expo for several reasons:
> - **Cross-platform efficiency**: One codebase serves both Android and iOS
> - **Faster development**: Hot reload and Expo's managed workflow
> - **Cost-effective**: Single team can maintain both platforms
> - **expo-speech**: Provides excellent TTS integration without native code

**Q2: How do you handle different voice IDs across devices?**
> Different Android/iOS devices return voice IDs in various formats. Some devices return malformed IDs like "en-IN-language" instead of proper identifiers. We implemented a `isValidVoiceId()` filter in `ttsService.js` that removes invalid patterns before displaying voices to users.

**Q3: How does your theming system work?**
> We use React Context (`ThemeContext.js`) to provide theme state globally. Each screen calls `getStyles(theme)` function that returns a StyleSheet with theme-aware colors. This allows instant theme switching without app restart.

**Q4: Why use StyleSheet.create inside a function instead of at module level?**
> Since our styles depend on theme colors, we need to regenerate styles when theme changes. The `getStyles(theme)` pattern ensures styles always reflect current theme. The slight performance cost is negligible for our use case.

**Q5: How do you ensure the app works offline?**
> expo-speech uses the device's native TTS engine, which works offline. Saved audio files are stored locally using expo-file-system. Only voice list fetching requires initial setup, but cached voices persist.

### Design Questions

**Q6: Why did you choose orange as the accent color?**
> Orange conveys energy, creativity, and warmth - perfect for a content creation app. It provides excellent contrast against both dark (#101828) and light (#FFFFFF) backgrounds while being distinctive and memorable.

**Q7: How do you ensure accessibility?**
> - Color contrast ratios meet WCAG AA standards
> - Touch targets are minimum 44x44px
> - Text is scalable with system settings
> - Dark/Light mode accommodates user preferences
> - Clear visual feedback on all interactions

**Q8: Why use a sticky player instead of a new screen?**
> The sticky player provides:
> - Context preservation - users see their text while playing
> - Quick controls - no navigation required to pause/stop
> - Modern UX pattern - familiar from music apps like Spotify

### Architecture Questions

**Q9: What's the benefit of your service layer architecture?**
> Separating business logic into services (`ttsService`, `audioManager`, `storageService`) provides:
> - **Testability**: Services can be unit tested independently
> - **Reusability**: Multiple components can use same service
> - **Maintainability**: Changes isolated to one location
> - **Separation of concerns**: UI doesn't know implementation details

**Q10: How would you scale this app for more users?**
> For scaling:
> - Add cloud sync with Firebase/Supabase for cross-device access
> - Implement user authentication
> - Add cloud TTS APIs (Google Cloud, AWS Polly) for premium voices
> - Use CDN for audio file hosting
> - Add analytics for usage patterns

### Future Improvements

**Q11: What features would you add next?**
> Priority improvements:
> 1. **Cloud Sync**: Save audio across devices
> 2. **Premium Voices**: Integration with Google/AWS TTS APIs
> 3. **Audio Export**: MP3/WAV export options
> 4. **Batch Processing**: Convert multiple files at once
> 5. **Voice Cloning**: Custom voice creation (AI-based)

**Q12: How would you monetize this app?**
> Potential monetization:
> - **Freemium model**: Basic features free, premium voices paid
> - **Subscription**: Monthly plan for unlimited high-quality TTS
> - **One-time purchase**: Remove ads, unlock all voices
> - **API integration**: Charge for cloud-based processing

---

## Conclusion

Tech Talk demonstrates a well-architected, modular React Native application following industry best practices:

- ✅ **Modular Code Structure** - Clear separation of concerns
- ✅ **Intuitive UI/UX** - Consistent design with accessibility
- ✅ **Efficient Functionality** - Optimized performance and storage
- ✅ **Cross-Platform** - Works on Android and iOS
- ✅ **Scalable Architecture** - Ready for future enhancements

The application successfully addresses the needs of students, content creators, and accessibility users while maintaining clean, maintainable code that can be extended for future requirements.

---

*Documentation prepared for DCIT 26 - Application Development and Emerging Technologies*
*Last Updated: January 2026*
