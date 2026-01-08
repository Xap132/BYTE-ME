# Component Implementation Guide

## Quick Start

This guide shows how to use the modular components to build screens and features.

---

## Table of Contents

1. [Base UI Components](#base-ui-components)
2. [Layout Components](#layout-components)
3. [Feature Components](#feature-components)
4. [Custom Hooks](#custom-hooks)
5. [Screen Examples](#screen-examples)
6. [Best Practices](#best-practices)

---

## Base UI Components

### Button

Versatile button component with multiple variants.

**Import**:
```javascript
import { Button } from '@/components/ui';
```

**Props**:
```javascript
<Button
  variant="primary"      // 'primary' | 'secondary' | 'outline' | 'ghost'
  size="md"              // 'sm' | 'md' | 'lg'
  onPress={() => {}}     // Required
  disabled={false}       // Optional
  loading={false}        // Optional
  fullWidth={false}      // Optional
  icon={<Icon />}        // Optional icon element
>
  Button Text
</Button>
```

**Variants**:
- **Primary** (blue, solid) - Main actions
- **Secondary** (cyan, solid) - Alternative actions
- **Outline** (transparent with border) - Less prominent
- **Ghost** (transparent) - Minimal style

**Example**:
```javascript
import { Button } from '@/components/ui';

export default function Example() {
  return (
    <>
      <Button variant="primary" size="lg" fullWidth onPress={handleSpeak}>
        Play
      </Button>
      <Button variant="outline" size="md" onPress={handleSave}>
        Save
      </Button>
      <Button variant="ghost" size="sm" onPress={handleDelete}>
        Delete
      </Button>
    </>
  );
}
```

---

### Input

Text input field with multiline support.

**Import**:
```javascript
import { Input } from '@/components/ui';
```

**Props**:
```javascript
<Input
  placeholder="Type here..."  // Required
  value={value}              // Required
  onChangeText={setText}     // Required
  multiline={false}          // Optional
  numberOfLines={1}          // Optional (for multiline)
  maxLength={100}            // Optional
  keyboardType="default"     // Optional
  editable={true}            // Optional
/>
```

**Keyboard Types**:
- `'default'` - Standard keyboard
- `'email-address'` - Email keyboard
- `'numeric'` - Numbers only
- `'phone-pad'` - Phone number

**Example**:
```javascript
import { Input } from '@/components/ui';
import { useState } from 'react';

export default function TextForm() {
  const [text, setText] = useState('');

  return (
    <Input
      placeholder="Enter your text..."
      value={text}
      onChangeText={setText}
      multiline={true}
      numberOfLines={5}
      maxLength={1000}
    />
  );
}
```

---

### Slider

Numeric slider for adjusting values.

**Import**:
```javascript
import { Slider } from '@/components/ui';
```

**Props**:
```javascript
<Slider
  label="Pitch"              // Optional
  value={1.0}               // Required
  onValueChange={setPitch}  // Required
  minimumValue={0.5}        // Optional
  maximumValue={2.0}        // Optional
  step={0.1}                // Optional
  suffix="x"                // Optional (e.g., "1.0x")
  showValue={true}          // Optional
/>
```

**Example**:
```javascript
import { Slider } from '@/components/ui';
import { useState } from 'react';

export default function AudioControls() {
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);

  return (
    <>
      <Slider
        label="Pitch"
        value={pitch}
        onValueChange={setPitch}
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
      />
      <Slider
        label="Speed"
        value={speed}
        onValueChange={setSpeed}
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
        suffix="x"
      />
    </>
  );
}
```

---

### Card

Container component for grouped content.

**Import**:
```javascript
import { Card } from '@/components/ui';
```

**Props**:
```javascript
<Card
  title="Card Title"      // Optional
  subtitle="Subtitle"     // Optional
  padding={16}            // Optional (default: 16)
  borderRadius={16}       // Optional
  backgroundColor="#FFF"  // Optional
  shadow={true}           // Optional
>
  Card content goes here
</Card>
```

**Example**:
```javascript
import { Card, Button } from '@/components/ui';

export default function Example() {
  return (
    <Card title="Settings" subtitle="Configure your preferences">
      <Button variant="outline" onPress={() => {}}>
        Edit Settings
      </Button>
    </Card>
  );
}
```

---

### SegmentedControl

Toggle between multiple options.

**Import**:
```javascript
import { SegmentedControl } from '@/components/ui';
```

**Props**:
```javascript
<SegmentedControl
  options={['Option 1', 'Option 2', 'Option 3']}  // Required
  selectedIndex={0}                                 // Required
  onValueChange={(index) => {}}                    // Required
/>
```

**Example**:
```javascript
import { SegmentedControl } from '@/components/ui';
import { useState } from 'react';

export default function VoiceSelector() {
  const [voice, setVoice] = useState(0); // 0 = female, 1 = male

  return (
    <SegmentedControl
      options={['Female', 'Male']}
      selectedIndex={voice}
      onValueChange={setVoice}
    />
  );
}
```

---

### Box

Flexible layout container.

**Import**:
```javascript
import { Box } from '@/components/ui';
```

**Props**:
```javascript
<Box
  row={false}            // Optional - flex direction
  center={false}         // Optional - center content
  padding={16}           // Optional
  margin={8}             // Optional
  gap={12}               // Optional - gap between children
  flex={1}               // Optional
  backgroundColor="#FFF" // Optional
  borderRadius={12}      // Optional
>
  Content here
</Box>
```

---

## Layout Components

### ScreenLayout

Wrapper for screen content with safe area and consistent spacing.

**Import**:
```javascript
import { ScreenLayout } from '@/components/ui';
```

**Props**:
```javascript
<ScreenLayout
  backgroundColor="#FFFFFF"  // Optional
  padding={16}               // Optional
  scrollable={true}          // Optional - enables scrolling
>
  Screen content
</ScreenLayout>
```

**Example**:
```javascript
import { ScreenLayout, Header } from '@/components/ui';

export default function MyScreen() {
  return (
    <ScreenLayout scrollable>
      <Header title="My Screen" />
      {/* Content here */}
    </ScreenLayout>
  );
}
```

---

### Header

Consistent screen header with title and actions.

**Import**:
```javascript
import { Header } from '@/components/ui';
```

**Props**:
```javascript
<Header
  title="Screen Title"              // Required
  subtitle="Optional subtitle"      // Optional
  onBackPress={() => {}}           // Optional - shows back button
  rightAction={<Button>...</Button>} // Optional - right side action
  centerTitle={false}              // Optional - center the title
  backgroundColor="#FFFFFF"        // Optional
  showBorder={true}                // Optional
/>
```

**Example**:
```javascript
import { Header, Button } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Header
      title="Settings"
      onBackPress={() => router.back()}
      rightAction={
        <Button variant="ghost" size="sm" onPress={() => {}}>
          Help
        </Button>
      }
    />
  );
}
```

---

## Feature Components

### TextInputArea (TTS)

Text input with character counter.

**Import**:
```javascript
import { TextInputArea } from '@/components/features';
```

**Props**:
```javascript
<TextInputArea
  value={text}                // Required
  onChangeText={setText}      // Required
  maxCharacters={5000}        // Optional
  onClear={() => setText('')} // Optional
/>
```

---

### LanguageSelector (TTS)

Language selection with grid layout.

**Import**:
```javascript
import { LanguageSelector } from '@/components/features';
```

**Props**:
```javascript
<LanguageSelector
  selectedLanguage="en"           // Required
  onLanguageChange={setLanguage}  // Required
  languages={[...]}               // Optional - custom languages
/>
```

---

### VoiceSelector (TTS)

Toggle between male and female voices.

**Import**:
```javascript
import { VoiceSelector } from '@/components/features';
```

**Props**:
```javascript
<VoiceSelector
  selectedVoice="female"      // Required
  onVoiceChange={setVoice}    // Required
/>
```

---

### PlaybackControls (TTS)

Pitch and speed adjustment sliders.

**Import**:
```javascript
import { PlaybackControls } from '@/components/features';
```

**Props**:
```javascript
<PlaybackControls
  pitch={1.0}              // Required
  onPitchChange={setPitch} // Required
  speed={1.0}              // Required
  onSpeedChange={setSpeed} // Required
/>
```

---

### AudioListItem (Audio)

Individual audio file in library.

**Import**:
```javascript
import { AudioListItem } from '@/components/features';
```

**Props**:
```javascript
<AudioListItem
  id="audio-1"                    // Required
  title="Audio Title"             // Required
  duration="1:23"                 // Required
  date="Jan 8"                    // Required
  isPlaying={false}               // Optional
  onPress={() => {}}              // Optional
  onDelete={() => {}}             // Optional
  onMoreOptions={() => {}}        // Optional
/>
```

---

### AudioPlayerControls (Audio)

Player with progress bar and controls.

**Import**:
```javascript
import { AudioPlayerControls } from '@/components/features';
```

**Props**:
```javascript
<AudioPlayerControls
  isPlaying={true}           // Optional
  onPlayPause={() => {}}     // Optional
  currentTime={45}           // Optional - seconds
  duration={120}             // Optional - seconds
  onSeek={(time) => {}}      // Optional
  audioTitle="Audio Name"    // Optional
/>
```

---

### EmptyState (Audio)

Placeholder when no audio files exist.

**Import**:
```javascript
import { EmptyState } from '@/components/features';
```

**Props**:
```javascript
<EmptyState
  title="No Audio"                      // Optional
  description="Create your first audio" // Optional
  icon="🎙️"                            // Optional
/>
```

---

### SettingsSwitchItem (Settings)

Toggle setting with label.

**Import**:
```javascript
import { SettingsSwitchItem } from '@/components/features';
```

**Props**:
```javascript
<SettingsSwitchItem
  label="Auto-play"                      // Required
  description="Auto-play saved audio"    // Optional
  value={true}                           // Required
  onValueChange={setAutoPlay}            // Required
  icon="🔊"                             // Optional
/>
```

---

### SettingsActionItem (Settings)

Clickable setting item.

**Import**:
```javascript
import { SettingsActionItem } from '@/components/features';
```

**Props**:
```javascript
<SettingsActionItem
  label="Clear Library"                // Required
  description="Remove all saved audio" // Optional
  onPress={() => {}}                   // Required
  icon="🗑️"                           // Optional
  destructive={true}                   // Optional - red styling
  rightText="5 files"                  // Optional - text on right
/>
```

---

## Custom Hooks

### useAudio

Manage audio playback.

**Import**:
```javascript
import { useAudio } from '@/hooks';
```

**Usage**:
```javascript
import { useAudio } from '@/hooks';
import { Button } from '@/components/ui';

export default function AudioPlayer({ audioUri }) {
  const {
    isPlaying,
    currentTime,
    duration,
    loadSound,
    play,
    pause,
    togglePlayPause,
    seek,
    cleanup,
  } = useAudio();

  // Load audio when component mounts
  React.useEffect(() => {
    loadSound(audioUri);
    return cleanup;
  }, [audioUri]);

  return (
    <>
      <Text>{currentTime}s / {duration}s</Text>
      <Button onPress={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </>
  );
}
```

---

### useTTS

Manage text-to-speech.

**Import**:
```javascript
import { useTTS } from '@/hooks';
```

**Usage**:
```javascript
import { useTTS } from '@/hooks';
import { Button, Input } from '@/components/ui';
import { useState } from 'react';

export default function TTSEngine() {
  const [text, setText] = useState('');
  const { isSpeaking, error, speak, stop, updateSettings } = useTTS();

  const handleSpeak = async () => {
    await speak(text, {
      language: 'en',
      voice: 'female',
      pitch: 1.0,
      speed: 1.0,
    });
  };

  return (
    <>
      <Input
        placeholder="Text to speak..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button
        onPress={handleSpeak}
        disabled={isSpeaking || !text}
        loading={isSpeaking}
      >
        {isSpeaking ? 'Speaking...' : 'Speak'}
      </Button>
      {error && <Text style={{ color: '#EF4444' }}>{error}</Text>}
    </>
  );
}
```

---

## Screen Examples

### Complete TTS Screen

```javascript
import { useState } from 'react';
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
import { useRouter } from 'expo-router';

export default function TTSScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('female');
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);

  const { isSpeaking, speak, updateSettings } = useTTS();

  // Update settings when values change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    updateSettings({ language: lang });
  };

  const handleVoiceChange = (v) => {
    setVoice(v);
    updateSettings({ voice: v });
  };

  const handlePitchChange = (p) => {
    setPitch(p);
    updateSettings({ pitch: p });
  };

  const handleSpeedChange = (s) => {
    setSpeed(s);
    updateSettings({ speed: s });
  };

  const handleSpeak = async () => {
    await speak(text, {
      language,
      voice,
      pitch,
      speed,
    });
  };

  const handleSave = () => {
    // Save audio to library
    console.log('Save to library');
  };

  return (
    <ScreenLayout scrollable>
      <Header
        title="Text to Speech"
        onBackPress={() => router.back()}
      />

      <TextInputArea
        value={text}
        onChangeText={setText}
        onClear={() => setText('')}
      />

      <LanguageSelector
        selectedLanguage={language}
        onLanguageChange={handleLanguageChange}
      />

      <VoiceSelector
        selectedVoice={voice}
        onVoiceChange={handleVoiceChange}
      />

      <PlaybackControls
        pitch={pitch}
        onPitchChange={handlePitchChange}
        speed={speed}
        onSpeedChange={handleSpeedChange}
      />

      <Card style={{ marginVertical: 16 }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSpeak}
          loading={isSpeaking}
          disabled={!text}
        >
          {isSpeaking ? 'Speaking...' : 'Play'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleSave}
          style={{ marginTop: 12 }}
          disabled={isSpeaking}
        >
          Save
        </Button>
      </Card>
    </ScreenLayout>
  );
}
```

---

## Best Practices

### 1. **Use Absolute Imports**
```javascript
// ✓ Good
import { Button } from '@/components/ui';
import { useTTS } from '@/hooks';

// ✗ Avoid
import { Button } from '../../../components/ui/base/Button';
```

### 2. **Organize State Effectively**
```javascript
// ✓ Group related state
const [text, setText] = useState('');
const [language, setLanguage] = useState('en');
const [voice, setVoice] = useState('female');

// Or use a reducer for complex state
const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
```

### 3. **Memoize Callbacks**
```javascript
import { useCallback } from 'react';

// ✓ Prevent unnecessary re-renders
const handleSpeak = useCallback(async () => {
  await speak(text);
}, [text, speak]);

// Use in dependencies
useEffect(() => {
  // effect
}, [handleSpeak]);
```

### 4. **Error Handling**
```javascript
const [error, setError] = useState(null);

const handleAction = async () => {
  try {
    setError(null);
    await performAction();
  } catch (err) {
    setError(err.message);
  }
};

if (error) {
  return <Text style={{ color: '#EF4444' }}>{error}</Text>;
}
```

### 5. **Loading States**
```javascript
const [isLoading, setIsLoading] = useState(false);

const handleLoad = async () => {
  try {
    setIsLoading(true);
    await loadData();
  } finally {
    setIsLoading(false);
  }
};

<Button loading={isLoading} onPress={handleLoad}>
  Load
</Button>
```

### 6. **Cleanup in useEffect**
```javascript
useEffect(() => {
  const subscription = setupListener();

  // Cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

**Last Updated**: January 8, 2026
**Version**: 1.0.0
