# VoiceWave - Design & Implementation

## 🎯 Overview

VoiceWave is a modular, component-driven Text-to-Speech mobile application built with React Native, Tamagui, and Expo. The app is designed following modern UX principles with a focus on **modularity**, **accessibility**, and **scalability**.

### Key Features
- ✅ Text-to-Speech conversion with multiple languages
- ✅ Adjustable pitch and speed controls
- ✅ Male/Female voice selection
- ✅ Audio library for saved files
- ✅ Customizable settings
- ✅ Dark mode support
- ✅ Fully accessible (WCAG 2.1 AA)

---

## 📁 Project Structure

### Core Directories

```
components/
├── ui/                          # Base UI components (Tamagui-based)
│   ├── base/                   # Atomic components
│   │   ├── Button.js           # Button with variants
│   │   ├── Input.js            # Text input
│   │   ├── Slider.js           # Numeric slider
│   │   ├── Card.js             # Container component
│   │   ├── Box.js              # Layout box
│   │   ├── SegmentedControl.js # Toggle control
│   │   └── index.js            # Barrel export
│   ├── layout/                  # Layout components
│   │   ├── ScreenLayout.js     # Screen wrapper
│   │   ├── Header.js           # Screen header
│   │   └── index.js            # Barrel export
│   └── index.js                # Main UI export

features/
├── tts/                         # Text-to-Speech feature
│   ├── TextInputArea.js        # Text input with counter
│   ├── LanguageSelector.js     # Language selection
│   ├── VoiceSelector.js        # Male/Female toggle
│   └── PlaybackControls.js     # Pitch/Speed controls

├── audio/                       # Audio management feature
│   ├── AudioListItem.js        # List item component
│   ├── AudioPlayerControls.js  # Player controls
│   └── EmptyState.js           # Empty state display

├── settings/                    # Settings feature
│   ├── SettingsSwitchItem.js   # Toggle setting
│   ├── SettingsActionItem.js   # Action setting
│   └── index.js                # Feature export

hooks/
├── useAudio/                   # Audio playback hook
│   └── useAudio.js
├── useTTS/                     # Text-to-speech hook
│   └── useTTS.js
└── index.js                    # Hooks export

config/
└── tamagui.config.ts           # Tamagui theme config

services/
├── ttsService.js               # TTS API wrapper
├── audioManager.js             # Audio file management
└── storageService.js           # AsyncStorage wrapper
```

---

## 🎨 Design System

### Colors

**Primary Colors**:
- Indigo 500: `#6366F1` (Main brand color)
- Indigo 400: `#818CF8` (Light variant)
- Indigo 600: `#4F46E5` (Dark variant)

**Secondary Colors**:
- Cyan 500: `#06B6D4` (Secondary actions)
- Cyan 300: `#22D3EE` (Light variant)

**Semantic Colors**:
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Info: `#3B82F6` (Blue)

**Neutral Scale**:
- White: `#FFFFFF`
- Gray 50-900: For text and backgrounds
- Black: `#000000`

### Typography

**Font**: Inter (Google Fonts)

**Sizes**:
- Display: 48px (App title)
- Heading 1: 32px (Screen titles)
- Heading 2: 24px (Card titles)
- Body: 16px (Default text)
- Small: 14px (Secondary text)
- Caption: 13px (Labels)

**Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)

### Spacing

4px grid system:
- 0px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 112px, 128px

### Border Radius

- Small: 4px - 8px
- Medium: 12px - 16px
- Large: 20px - 32px
- Circle: 9999px

### Shadows

- Small: `shadowOpacity: 0.1, shadowRadius: 2`
- Medium: `shadowOpacity: 0.1, shadowRadius: 8` (cards)
- Large: `shadowOpacity: 0.15, shadowRadius: 16` (modals)

---

## 🧩 Component System

### Base Components (`components/ui/base/`)

1. **Button**
   - Variants: primary, secondary, outline, ghost
   - Sizes: sm (32px), md (44px), lg (56px)
   - Props: variant, size, disabled, loading, fullWidth, icon

2. **Input**
   - Single and multiline support
   - Props: placeholder, value, onChangeText, maxLength, multiline

3. **Slider**
   - Numeric input with visual feedback
   - Props: label, value, onValueChange, min/max, step, suffix

4. **Card**
   - Container with optional title/subtitle
   - Props: title, subtitle, padding, borderRadius, shadow

5. **Box**
   - Flexible layout container
   - Props: row, center, padding, margin, gap, flex

6. **SegmentedControl**
   - Toggle between options
   - Props: options, selectedIndex, onValueChange

### Layout Components (`components/ui/layout/`)

1. **ScreenLayout**
   - Screen wrapper with safe area and padding
   - Props: backgroundColor, padding, scrollable

2. **Header**
   - Consistent screen header
   - Props: title, subtitle, onBackPress, rightAction, centerTitle

### Feature Components (`components/features/`)

**TTS Module**:
- `TextInputArea` - Text input with character counter
- `LanguageSelector` - Language selection grid
- `VoiceSelector` - Male/Female toggle
- `PlaybackControls` - Pitch and speed sliders

**Audio Module**:
- `AudioListItem` - Individual audio file
- `AudioPlayerControls` - Player with progress bar
- `EmptyState` - No audio placeholder

**Settings Module**:
- `SettingsSwitchItem` - Toggle setting
- `SettingsActionItem` - Clickable setting

---

## 🪝 Custom Hooks

### useAudio

Manages audio playback state and controls.

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

Manages text-to-speech settings and speaking state.

```javascript
const {
  isSpeaking,        // Boolean
  error,             // Error message or null
  currentSettings,   // { text, language, voice, pitch, speed }
  speak,             // (text, settings?) => Promise
  stop,              // () => Promise
  updateSettings,    // (settings) => void
} = useTTS();
```

---

## 📱 Screen Architecture

### Index Screen (TTS)
```
┌─────────────────────┐
│ Header "Text to Speech"
├─────────────────────┤
│ TextInputArea       │
├─────────────────────┤
│ LanguageSelector    │
├─────────────────────┤
│ VoiceSelector       │
├─────────────────────┤
│ PlaybackControls    │
├─────────────────────┤
│ Play Button         │
│ Save Button         │
└─────────────────────┘
```

### Library Screen
```
┌─────────────────────┐
│ Header "Library"    │
├─────────────────────┤
│ AudioPlayerControls │
├─────────────────────┤
│ AudioListItem[]     │
│ AudioListItem[]     │
│ AudioListItem[]     │
│                     │
│ or EmptyState       │
└─────────────────────┘
```

### Settings Screen
```
┌─────────────────────┐
│ Header "Settings"   │
├─────────────────────┤
│ PREFERENCES         │
│ ┌─────────────────┐ │
│ │ Auto-play Toggle│ │
│ │ Notifications   │ │
│ │ Dark Mode       │ │
│ └─────────────────┘ │
├─────────────────────┤
│ STORAGE             │
│ ┌─────────────────┐ │
│ │ Clear Library   │ │
│ └─────────────────┘ │
├─────────────────────┤
│ ABOUT               │
│ ┌─────────────────┐ │
│ │ Version 1.0.0   │ │
│ │ Help & Support  │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 💾 Data Flow

### TTS to Playback
```
TextInputArea → useTTS.updateSettings
LanguageSelector → useTTS.updateSettings
VoiceSelector → useTTS.updateSettings
PlaybackControls → useTTS.updateSettings
                ↓
Play Button → useTTS.speak()
                ↓
ttsService.speak()
                ↓
expo-speech API
```

### Audio Playback
```
AudioListItem (tap)
        ↓
useAudio.loadSound(uri)
        ↓
useAudio.play()
        ↓
Audio.Sound.playAsync()
        ↓
AudioPlayerControls updates UI
```

---

## 🎯 Usage Examples

### Creating a Screen

```javascript
import {
  ScreenLayout,
  Header,
  Button,
  Card,
} from '@/components/ui';
import {
  TextInputArea,
  LanguageSelector,
  VoiceSelector,
  PlaybackControls,
} from '@/components/features';
import { useTTS } from '@/hooks';
import { useState } from 'react';

export default function TTSScreen() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const { isSpeaking, speak } = useTTS();

  return (
    <ScreenLayout scrollable>
      <Header title="Text to Speech" />

      <TextInputArea
        value={text}
        onChangeText={setText}
        onClear={() => setText('')}
      />

      <LanguageSelector
        selectedLanguage={language}
        onLanguageChange={setLanguage}
      />

      <Card>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => speak(text, { language })}
          loading={isSpeaking}
        >
          Speak
        </Button>
      </Card>
    </ScreenLayout>
  );
}
```

### Using Custom Hooks

```javascript
import { useTTS } from '@/hooks';
import { Button } from '@/components/ui';

export default function TTSButton() {
  const { isSpeaking, error, speak } = useTTS();

  return (
    <>
      <Button
        onPress={() => speak('Hello World')}
        loading={isSpeaking}
      >
        Speak
      </Button>
      {error && <Text style={{ color: '#EF4444' }}>{error}</Text>}
    </>
  );
}
```

---

## ♿ Accessibility

The app follows WCAG 2.1 AA standards:

- ✓ Color contrast ratios of at least 4.5:1
- ✓ Touch targets of at least 44x44px
- ✓ Semantic component structure
- ✓ Keyboard navigation support
- ✓ Screen reader compatibility
- ✓ Clear labels and descriptions
- ✓ No auto-playing content

---

## 🔄 Responsive Design

- **Small Phones** (320px): Full width, single column
- **Standard Phones** (375px): Primary design target
- **Large Phones** (414px+): Full width with constraints
- **Tablets** (768px+): Multi-column layouts

All components scale proportionally using percentage-based widths and scalable fonts.

---

## 📚 Documentation Files

1. **ARCHITECTURE.md** - Detailed folder structure and component documentation
2. **DESIGN_SYSTEM.md** - Colors, typography, spacing, shadows
3. **COMPONENT_GUIDE.md** - API reference and usage examples
4. **README.md** - General project information

---

## 🚀 Next Steps

1. **Integrate Tamagui Provider**
   ```javascript
   // app/_layout.js
   import { TamaguiProvider } from 'tamagui';
   import tamaguiConfig from '@/config/tamagui.config';
   
   export default function RootLayout() {
     return (
       <TamaguiProvider config={tamaguiConfig}>
         {/* Navigation and screens */}
       </TamaguiProvider>
     );
   }
   ```

2. **Refactor Existing Screens**
   - Use new modular components
   - Apply consistent styling
   - Implement custom hooks

3. **Add State Management** (Optional)
   - Context API for global state
   - Redux or Zustand for complex state

4. **Testing**
   - Unit tests for components
   - Integration tests for screens
   - E2E tests for user flows

5. **Performance Optimization**
   - Memoize expensive computations
   - Lazy load screens
   - Optimize images and assets

---

## 📦 Dependencies

- **react-native**: Core framework
- **expo**: Mobile development platform
- **react-navigation**: Screen navigation
- **tamagui**: UI component library
- **expo-speech**: Text-to-speech API
- **expo-av**: Audio playback
- **@react-native-async-storage**: Local storage

---

## 🤝 Contributing

When adding new components:

1. Create in appropriate feature/ui folder
2. Follow naming conventions (PascalCase for components)
3. Include JSDoc comments
4. Export from index.js file
5. Add to appropriate documentation

---

## 📄 License

This project is part of the BYTE-ME collection.

---

**Last Updated**: January 8, 2026  
**Version**: 1.0.0  
**Status**: Ready for Implementation

---

## Quick Links

- [Architecture Documentation](./ARCHITECTURE.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Component Guide](./COMPONENT_GUIDE.md)
- [App Entry Point](./app/_layout.js)
- [Tamagui Config](./config/tamagui.config.ts)
