# VoiceWave - Text-to-Speech App Architecture

## Design Overview

The app is built with a **modular, scalable architecture** using **Tamagui** for UI components and **React Native** for platform support.

### Design Principles

1. **Modularity**: Each feature is isolated and can be developed/tested independently
2. **Reusability**: Common UI patterns are abstracted into reusable components
3. **Consistency**: Unified theme and design system across the app
4. **Accessibility**: WCAG-compliant components with proper contrast and labels
5. **Responsiveness**: Flexible layouts that work on various screen sizes

---

## Folder Structure

```
components/
├── ui/                          # Base UI components
│   ├── base/                    # Atomic components
│   │   ├── Button.js           # Reusable button with variants
│   │   ├── Input.js            # Text input field
│   │   ├── Slider.js           # Numeric slider
│   │   ├── Card.js             # Container component
│   │   ├── Box.js              # Layout box
│   │   └── SegmentedControl.js # Toggle between options
│   └── layout/                  # Layout components
│       ├── ScreenLayout.js     # Screen wrapper with safe area
│       └── Header.js           # Screen header
├── features/                    # Feature-specific components
│   ├── tts/                    # Text-to-Speech feature
│   │   ├── TextInputArea.js    # Text input with char counter
│   │   ├── LanguageSelector.js # Language selection
│   │   ├── VoiceSelector.js    # Male/Female voice toggle
│   │   └── PlaybackControls.js # Pitch and speed controls
│   ├── audio/                  # Audio playback feature
│   │   ├── AudioListItem.js    # Individual audio file item
│   │   ├── AudioPlayerControls.js # Player controls
│   │   └── EmptyState.js       # Empty state display
│   └── settings/               # Settings feature
│       ├── SettingsSwitchItem.js # Toggle settings
│       └── SettingsActionItem.js # Clickable settings
└── common/                      # Shared components (dialogs, modals, etc.)

hooks/
├── useAudio/                   # Audio playback hook
│   └── useAudio.js            # Manages audio state and playback
└── useTTS/                     # Text-to-speech hook
    └── useTTS.js              # Manages TTS state and speaking

services/
├── ttsService.js              # TTS API integration
├── audioManager.js            # Audio file management
└── storageService.js          # AsyncStorage wrapper

config/
└── tamagui.config.ts          # Tamagui theme & tokens configuration

constants/
├── theme.ts                   # Theme values (colors, fonts)
└── voices.js                  # Voice language data
```

---

## UI Component System

### Base Components (`components/ui/base/`)

These are atomic, unstyled components that form the foundation:

- **Button**: Primary, secondary, outline, ghost variants with sm/md/lg sizes
- **Input**: Multi-line text input with max length support
- **Slider**: Numeric slider with labels and value display
- **Card**: Container with title, subtitle, and shadow
- **Box**: Flexible layout container
- **SegmentedControl**: Toggle between options

### Layout Components (`components/ui/layout/`)

- **ScreenLayout**: Wraps screen content with safe area and padding
- **Header**: Consistent header with title, back button, and actions

---

## Feature Modules

### TTS Module (`components/features/tts/`)

**Purpose**: Text-to-speech conversion and playback configuration

Components:
- `TextInputArea`: Text input with character counter and clear button
- `LanguageSelector`: Grid of language options
- `VoiceSelector`: Male/Female toggle using SegmentedControl
- `PlaybackControls`: Pitch and speed adjustment sliders

### Audio Module (`components/features/audio/`)

**Purpose**: Manage and display saved audio files

Components:
- `AudioListItem`: Individual audio file with play indicator and options
- `AudioPlayerControls`: Player with progress bar, time, and controls
- `EmptyState`: Placeholder when no audio files exist

### Settings Module (`components/features/settings/`)

**Purpose**: User preferences and app configuration

Components:
- `SettingsSwitchItem`: Toggle setting with icon and description
- `SettingsActionItem`: Clickable setting with optional destructive styling

---

## Custom Hooks

### useAudio

**Location**: `hooks/useAudio/useAudio.js`

**Purpose**: Manage audio playback state and controls

**API**:
```javascript
const {
  sound,              // Current Sound object
  isPlaying,          // Boolean
  currentTime,        // Seconds (number)
  duration,           // Seconds (number)
  loadSound,          // (uri) => Promise
  play,               // () => Promise
  pause,              // () => Promise
  togglePlayPause,    // () => Promise
  seek,               // (position) => Promise
  cleanup,            // () => Promise
} = useAudio();
```

### useTTS

**Location**: `hooks/useTTS/useTTS.js`

**Purpose**: Manage text-to-speech settings and speaking state

**API**:
```javascript
const {
  isSpeaking,        // Boolean
  error,             // Error message or null
  currentSettings,   // { text, language, gender, pitch, speed }
  speak,             // (text, settings?) => Promise
  stop,              // () => Promise
  updateSettings,    // (settings) => void
} = useTTS();
```

---

## Theming System

### Tamagui Configuration (`config/tamagui.config.ts`)

Provides:
- **Colors**: Primary (indigo), secondary (cyan), semantic colors
- **Spacing**: 0-15 scale (0=0px, 1=4px, up to 15=128px)
- **Radius**: 0-8 + circle
- **Size Tokens**: xs, sm, md, lg, xl, 2xl, full
- **Z-Index Tokens**: For layering

### Light & Dark Themes

Both themes include:
- Background colors (bg, bgAlt, bgAlt2)
- Text colors (color, colorHover, colorPress)
- Semantic colors (primary, secondary, success, error, warning)

---

## Screen Structure

### Index Screen (TTS)
```
Header
└─ ScrollView
   ├─ TextInputArea
   ├─ LanguageSelector
   ├─ VoiceSelector
   ├─ PlaybackControls
   └─ Action Buttons (Play, Save)
```

### Library Screen
```
Header
└─ FlatList or ScrollView
   ├─ AudioPlayerControls (if playing)
   ├─ AudioListItem[]
   └─ EmptyState (if no audio)
```

### Settings Screen
```
Header
└─ ScrollView
   ├─ SettingsSwitchItem[] (Preferences)
   ├─ SettingsActionItem[] (Storage)
   └─ SettingsActionItem[] (About)
```

---

## Data Flow

### TTS to Audio Playback

```
User Input
  ↓
TextInputArea.onChangeText → useTTS.updateSettings
  ↓
LanguageSelector.onLanguageChange → useTTS.updateSettings
  ↓
VoiceSelector.onVoiceChange → useTTS.updateSettings
  ↓
PlaybackControls (pitch/speed) → useTTS.updateSettings
  ↓
Play Button
  ↓
useTTS.speak(text, settings)
  ↓
ttsService.speak()
  ↓
expo-speech / tts library
```

### Audio Playback

```
AudioListItem (press)
  ↓
useAudio.loadSound(uri)
  ↓
useAudio.play()
  ↓
Audio.Sound.playAsync()
  ↓
AudioPlayerControls updates UI with playback status
```

---

## Styling Approach

### Color System

**Primary Colors**:
- Primary: `#6366F1` (Indigo)
- Primary Light: `#818CF8`
- Primary Dark: `#4F46E5`

**Secondary Colors**:
- Secondary: `#06B6D4` (Cyan)
- Secondary Light: `#22D3EE`

**Neutral Scale**:
- White: `#FFFFFF`
- Gray: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Black: `#000000`

**Semantic Colors**:
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Info: `#3B82F6` (Blue)

### Typography

**Font**: Inter (from `@tamagui/font-inter`)

**Sizes**:
- Body text: 16px
- Small: 14px
- Large: 20px
- Heading: 24-48px

**Weights**:
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extra Bold: 800

### Spacing Scale

| Token | Value |
|-------|-------|
| 0     | 0     |
| 1     | 4px   |
| 2     | 8px   |
| 3     | 12px  |
| 4     | 16px  |
| 5     | 20px  |
| 6     | 24px  |
| 7     | 32px  |
| 8     | 40px  |

---

## Component Composition Examples

### Creating a New Screen

```javascript
import ScreenLayout from '@/components/ui/layout/ScreenLayout';
import Header from '@/components/ui/layout/Header';
import Button from '@/components/ui/base/Button';
import Card from '@/components/ui/base/Card';

export default function NewScreen() {
  return (
    <ScreenLayout>
      <Header title="New Screen" />
      <Card title="Content">
        <Button onPress={() => {}}>Action</Button>
      </Card>
    </ScreenLayout>
  );
}
```

### Using Custom Hooks

```javascript
import { useTTS } from '@/hooks/useTTS/useTTS';
import { useAudio } from '@/hooks/useAudio/useAudio';

export default function MyComponent() {
  const tts = useTTS();
  const audio = useAudio();

  const handleSpeak = async () => {
    await tts.speak('Hello World', {
      language: 'en',
      pitch: 1.0,
      speed: 1.0,
    });
  };

  return (
    <Button onPress={handleSpeak} disabled={tts.isSpeaking}>
      {tts.isSpeaking ? 'Speaking...' : 'Speak'}
    </Button>
  );
}
```

---

## Best Practices

1. **Import Paths**: Use absolute imports with `@/` alias
2. **Component Naming**: PascalCase for components, camelCase for hooks/utils
3. **Props Validation**: Include prop defaults for optional props
4. **Error Handling**: Use try-catch in async functions, set error state
5. **Performance**: Memoize callbacks with `useCallback`, use `useMemo` for computed values
6. **Accessibility**: Include labels, descriptions, and semantic meanings
7. **Testing**: Components should be isolated and testable

---

## Next Steps

1. Update `app/_layout.js` to integrate TamaguiProvider
2. Refactor existing screens to use new modular components
3. Create index, library, and settings screens
4. Integrate ttsService with useTTS hook
5. Add error boundaries and loading states
6. Implement dark mode support
7. Add animations and transitions

---

**Last Updated**: January 8, 2026
**Version**: 1.0.0
