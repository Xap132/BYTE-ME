### TTS App - Important Notes

## Platform Support
**This is a MOBILE app built with React Native + Expo.**
- ✅ Works on: Android phones/tablets, iOS (with Expo Go app)
- ❌ Does NOT work on: Windows PC, Web browsers
- 📱 To test: Install "Expo Go" app on your phone, scan the QR code from terminal

## How to Run
1. In terminal: `npx expo start`
2. On your phone:
   - Install "Expo Go" from Play Store (Android) or App Store (iOS)
   - Open Expo Go and scan the QR code from terminal
3. App will load on your phone

## Known Limitations

### Voice Selection
- **Male/Female voices work via pitch adjustment**
- Male = lower pitch (0.8x), Female = higher pitch (1.1x)
- Android TTS doesn't reliably support custom voice identifiers
- The system's default voice for each language is used

### Audio Saving
- **Saves text + settings metadata only**
- Does NOT create actual audio files yet
- expo-speech doesn't provide audio file export
- Saved items appear in Library tab with the text and settings
- To implement real audio recording, you need:
  - A different TTS library (react-native-tts with file export)
  - Or platform-specific audio capture during playback

### Filipino Language
- Requires Filipino TTS voice installed on your Android device
- May fall back to English if Filipino voice not available
- Check: Settings > Language & input > Text-to-speech output on Android

## Features That Work
- ✅ Text-to-speech playback (English & Filipino)
- ✅ Pitch control (0.5x - 2.0x)
- ✅ Speed control (0.5x - 2.0x)
- ✅ Male/Female voice simulation via pitch
- ✅ Save text + settings to Library
- ✅ Audio player controls (play/pause/skip 10s forward/back)
- ✅ Search saved items
- ✅ Delete saved items
- ✅ Light/Dark mode toggle (requires app restart)

## To Run on Web (Optional)
If you want web support, you need to:
1. Install: `npx expo install react-native-web react-dom @expo/metro-runtime`
2. Add web platform support to app.json
3. Run: `npx expo start --web`

But TTS features may not work properly on web!
