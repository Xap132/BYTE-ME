# TTS App - Text to Speech with Audio Recording

A React Native mobile application built with Expo that converts text to speech with customizable voice options, pitch, and speed controls. Includes audio recording and management features.

## Features

### 🎙️ Text-to-Speech
- Natural-sounding speech synthesis
- Support for English and Filipino languages
- Male and female voice options
- Adjustable pitch (0.5x - 2.0x)
- Adjustable speed (0.5x - 2.0x)
- Real-time playback controls (Play, Pause, Stop)

### 💾 Audio Management
- Save TTS output as audio files (WAV or MP3)
- Audio library with all saved files
- Search and filter saved audio
- Play saved audio files
- Delete unwanted audio files
- Edit audio file metadata

### ⚙️ Settings & Preferences
- Customizable default voice (male/female)
- Default language selection (English/Filipino)
- Audio format preference (WAV/MP3)
- Haptic feedback toggle
- Light/Dark theme support

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router (file-based routing)
- **Audio:** expo-speech, expo-av
- **Storage:** AsyncStorage, expo-file-system
- **Icons:** Lucide React Native
- **UI Components:** Custom themed components with light/dark mode

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main TTS screen
│   │   ├── explore.tsx        # Audio library screen
│   │   └── _layout.tsx        # Tab navigation
│   └── settings.tsx           # Settings screen
├── components/
│   ├── tts/                   # TTS-related components
│   │   ├── TextInputArea.tsx
│   │   ├── VoiceSelector.tsx
│   │   ├── PitchControl.tsx
│   │   ├── SpeedControl.tsx
│   │   └── PlaybackControls.tsx
│   ├── audio/                 # Audio management components
│   │   ├── AudioListItem.tsx
│   │   └── EmptyState.tsx
│   └── ui/                    # Reusable UI components
│       └── lucide-icon.tsx
├── services/
│   ├── ttsService.ts          # TTS functionality
│   ├── audioManager.ts        # Audio file management
│   └── storageService.ts      # Preferences & metadata storage
├── constants/
│   └── voices.ts              # Voice and language configuration
└── types/
    └── audio.ts               # TypeScript interfaces
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TO-DO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on Android**
   ```bash
   npm run android
   ```

## Usage

### Converting Text to Speech

1. Open the **TTS** tab
2. Enter your text in the input area
3. Select language (English or Filipino)
4. Choose voice type (Male or Female)
5. Adjust pitch and speed sliders as desired
6. Press the **Play** button to hear the speech
7. Press **Save** to record and save the audio file

### Managing Saved Audio

1. Navigate to the **Library** tab
2. View all saved audio files
3. Use the search bar to find specific files
4. Tap the play button on any item to play it
5. Tap the edit button to modify metadata
6. Tap the delete button to remove files

### Configuring Settings

1. Navigate to **Settings** from the modal
2. Adjust default voice and language preferences
3. Choose preferred audio format (WAV or MP3)
4. Toggle haptic feedback
5. Press **Reset to Defaults** to restore default settings

## Dependencies

### Core Dependencies
- `expo` - Expo SDK framework
- `react-native` - React Native core
- `expo-router` - File-based navigation
- `expo-speech` - Text-to-speech synthesis
- `expo-av` - Audio playback
- `expo-file-system` - File management
- `@react-native-async-storage/async-storage` - Local storage
- `lucide-react-native` - Icon library
- `@react-native-community/slider` - Slider component
- `expo-haptics` - Haptic feedback

## Platform Support

- ✅ Android (Primary target)
- ⚠️ iOS (Compatible but not optimized)
- ⚠️ Web (Limited functionality)

## Known Limitations

1. **Audio Recording:** Currently, TTS output recording is a placeholder. Full recording functionality requires additional implementation with platform-specific audio capture.

2. **Voice Availability:** Available voices depend on the device's TTS engine. Some Android versions may have limited voice options for Filipino language.

3. **File Formats:** MP3 encoding may require additional native modules. WAV format is recommended for simplicity.

## Future Enhancements

- Full audio recording implementation from TTS output
- Cloud backup for audio files
- Share audio files via social media
- Audio editing features (trim, merge)
- Custom voice training
- Playback speed control for saved audio
- Batch operations on audio files

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the BYTE-ME college coursework.

## Contact

For questions or support, please contact the development team.
