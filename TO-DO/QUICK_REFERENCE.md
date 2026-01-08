# VoiceWave - Quick Reference Card

## 🎯 Component Imports

### UI Components
```javascript
import {
  Button,
  Input,
  Slider,
  Card,
  Box,
  SegmentedControl,
  ScreenLayout,
  Header,
} from '@/components/ui';
```

### Feature Components
```javascript
import {
  // TTS
  TextInputArea,
  LanguageSelector,
  VoiceSelector,
  PlaybackControls,
  // Audio
  AudioListItem,
  AudioPlayerControls,
  EmptyState,
  // Settings
  SettingsSwitchItem,
  SettingsActionItem,
} from '@/components/features';
```

### Custom Hooks
```javascript
import { useAudio, useTTS } from '@/hooks';
```

---

## 🔨 Component Snippets

### Button
```javascript
<Button
  variant="primary"    // primary | secondary | outline | ghost
  size="md"            // sm | md | lg
  onPress={() => {}}
  disabled={false}
  loading={false}
  fullWidth={false}
>
  Click Me
</Button>
```

### Input
```javascript
<Input
  placeholder="Type here..."
  value={text}
  onChangeText={setText}
  multiline={false}
  maxLength={1000}
/>
```

### Slider
```javascript
<Slider
  label="Pitch"
  value={1.0}
  onValueChange={setPitch}
  minimumValue={0.5}
  maximumValue={2.0}
  step={0.1}
  suffix="x"
/>
```

### Card
```javascript
<Card title="Settings" subtitle="Configure app">
  {/* Content */}
</Card>
```

### SegmentedControl
```javascript
<SegmentedControl
  options={['Option 1', 'Option 2']}
  selectedIndex={0}
  onValueChange={(index) => {}}
/>
```

### Header
```javascript
<Header
  title="Screen Title"
  onBackPress={() => {}}
  rightAction={<Button>Help</Button>}
/>
```

---

## 🧩 Feature Components

### TextInputArea
```javascript
<TextInputArea
  value={text}
  onChangeText={setText}
  maxCharacters={5000}
  onClear={() => setText('')}
/>
```

### LanguageSelector
```javascript
<LanguageSelector
  selectedLanguage="en"
  onLanguageChange={setLanguage}
/>
```

### VoiceSelector
```javascript
<VoiceSelector
  selectedVoice="female"
  onVoiceChange={setVoice}
/>
```

### PlaybackControls
```javascript
<PlaybackControls
  pitch={1.0}
  onPitchChange={setPitch}
  speed={1.0}
  onSpeedChange={setSpeed}
/>
```

### AudioListItem
```javascript
<AudioListItem
  id="audio-1"
  title="Audio Name"
  duration="1:23"
  date="Jan 8"
  isPlaying={false}
  onPress={() => {}}
  onDelete={() => {}}
  onMoreOptions={() => {}}
/>
```

### AudioPlayerControls
```javascript
<AudioPlayerControls
  isPlaying={true}
  currentTime={45}
  duration={120}
  audioTitle="Now Playing"
  onPlayPause={() => {}}
/>
```

### SettingsSwitchItem
```javascript
<SettingsSwitchItem
  label="Auto-play"
  description="Auto-play saved audio"
  value={true}
  onValueChange={setAutoPlay}
  icon="🔊"
/>
```

### SettingsActionItem
```javascript
<SettingsActionItem
  label="Clear Library"
  description="Remove all saved audio"
  onPress={() => {}}
  icon="🗑️"
  destructive={true}
  rightText="5 files"
/>
```

---

## 🪝 Custom Hooks

### useAudio
```javascript
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

// Load sound
await loadSound(audioUri);

// Play/Pause
await play();
await pause();
await togglePlayPause();

// Seek to position
await seek(30); // 30 seconds

// Cleanup
await cleanup();
```

### useTTS
```javascript
const {
  isSpeaking,
  error,
  currentSettings,
  speak,
  stop,
  updateSettings,
} = useTTS();

// Speak with options
await speak('Hello', {
  language: 'en',
  voice: 'female',
  pitch: 1.0,
  speed: 1.0,
});

// Update settings
updateSettings({ pitch: 1.5 });

// Stop speaking
await stop();
```

---

## 🎨 Colors

### Primary
- Indigo 500: `#6366F1` (buttons, focus)
- Indigo 400: `#818CF8` (hover)
- Indigo 600: `#4F46E5` (pressed)

### Secondary
- Cyan 500: `#06B6D4` (secondary actions)
- Cyan 300: `#22D3EE` (light variant)

### Semantic
- Success: `#10B981`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Info: `#3B82F6`

### Neutral
- White: `#FFFFFF`
- Gray 100: `#F3F4F6`
- Gray 200: `#E5E7EB`
- Gray 400: `#9CA3AF`
- Gray 600: `#4B5563`
- Gray 900: `#1F2937`
- Black: `#000000`

---

## 📏 Spacing Scale

| Token | Value |
|-------|-------|
| 0 | 0px |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 7 | 32px |
| 8 | 40px |

---

## 📐 Common Sizes

### Button Heights
- sm: 32px
- md: 44px
- lg: 56px

### Border Radius
- Small: 4px - 8px
- Medium: 12px - 16px
- Large: 20px - 32px
- Circle: 9999px

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px

---

## 🎭 Screen Template

```javascript
import { ScreenLayout, Header, Button, Card } from '@/components/ui';
import { useState } from 'react';

export default function MyScreen() {
  const [state, setState] = useState();

  return (
    <ScreenLayout scrollable>
      <Header title="Screen Title" />
      
      <Card title="Content">
        {/* Component content */}
      </Card>

      <Button variant="primary" fullWidth onPress={() => {}}>
        Action
      </Button>
    </ScreenLayout>
  );
}
```

---

## 📚 Documentation Map

| Need | File | Section |
|------|------|---------|
| Component API | COMPONENT_GUIDE.md | Component sections |
| Colors/Fonts | DESIGN_SYSTEM.md | Color/Typography |
| Folder Structure | ARCHITECTURE.md | Folder Structure |
| Examples | DESIGN_IMPLEMENTATION.md | Screen Examples |
| Overview | DESIGN_SUMMARY.md | What's Included |

---

## 🔗 File Paths

```
@/components/ui        → components/ui/index.js
@/components/features  → components/features/index.js
@/hooks               → hooks/index.js
@/config              → config/
@/services            → services/
@/constants           → constants/
@/assets              → assets/
```

---

## ✨ Key Features

- ✅ 17 pre-built components
- ✅ 2 custom hooks
- ✅ Complete design system
- ✅ WCAG 2.1 AA compliant
- ✅ Responsive layouts
- ✅ Dark mode ready
- ✅ Modular architecture
- ✅ Well documented

---

## 🚀 Getting Started

1. **Import components**: `import { Button } from '@/components/ui';`
2. **Use in screen**: Wrap with `<ScreenLayout>`
3. **Add header**: Use `<Header>` component
4. **Add content**: Use feature or UI components
5. **Reference docs**: Check COMPONENT_GUIDE.md for API

---

## 💡 Pro Tips

- Use barrel exports (`@/components/ui`) for cleaner imports
- Check DESIGN_SYSTEM.md for exact color/size values
- Copy component snippets from COMPONENT_GUIDE.md
- Use ScreenLayout for consistent screen structure
- Memoize callbacks with useCallback to optimize
- Use try-catch for async operations

---

## ❓ Common Questions

**Q: Where are button variants?**  
A: Button component has 4 variants: primary, secondary, outline, ghost

**Q: How do I use custom hooks?**  
A: Import from `@/hooks` and call like `const { ... } = useAudio();`

**Q: What colors should I use?**  
A: See DESIGN_SYSTEM.md for complete color palette

**Q: How do I add a new component?**  
A: Create in appropriate feature folder and export from index.js

**Q: Where's the Tamagui config?**  
A: `/config/tamagui.config.ts` - contains theme and tokens

---

**Last Updated**: January 8, 2026  
**Version**: 1.0.0

---

**Print this for quick reference during development! 📋**
