import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { storageService } from './storageService';

// Use FileSystem constants - will be set after initialization
let AUDIO_DIR = '';

class AudioManager {
  constructor() {
    this.sound = null;
    this.recording = null;
    this.initializeAudioDirectory();
  }

  /**
   * Initialize audio directory
   */
  async initializeAudioDirectory() {
    // Skip file system on web
    if (Platform.OS === 'web') {
      console.log('Running on web - file system disabled');
      AUDIO_DIR = 'tts_audio/';
      return;
    }
    
    try {
      // Try to get documentDirectory, fallback to cacheDirectory
      let baseDir;
      try {
        baseDir = FileSystem.documentDirectory;
      } catch {
        baseDir = FileSystem.cacheDirectory;
      }
      
      if (!baseDir) {
        console.error('FileSystem directory not available');
        AUDIO_DIR = 'tts_audio/'; // Fallback
        return;
      }
      
      AUDIO_DIR = `${baseDir}tts_audio/`;
      
      const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing audio directory:', error);
      AUDIO_DIR = 'tts_audio/'; // Fallback
    }
  }

  /**
   * Save TTS settings and text for later replay
   */
  async saveAudioFile(text, options, format = 'wav') {
    try {
      const timestamp = Date.now();
      const filename = `tts_${timestamp}.${format}`;

      const audioFile = {
        id: timestamp.toString(),
        name: filename,
        uri: null, // No actual audio file - will replay using TTS
        duration: 0,
        dateCreated: timestamp,
        language: options.language,
        voiceType: options.voice,
        format: format,
        size: 0,
        pitch: options.pitch,
        speed: options.speed,
        text: text,
      };

      // Save metadata
      await this.saveAudioMetadata(audioFile);

      return audioFile;
    } catch (error) {
      console.error('Error saving audio file:', error);
      throw error;
    }
  }

  /**
   * Save audio metadata
   */
  async saveAudioMetadata(audioFile) {
    try {
      const metadata = await storageService.loadAudioMetadata();
      metadata.push(audioFile);
      console.log('Saving audio metadata:', metadata);
      await storageService.saveAudioMetadata(metadata);
      console.log('Audio metadata saved successfully');
    } catch (error) {
      console.error('Error saving audio metadata:', error);
      throw error;
    }
  }

  /**
   * Get all saved audio files
   */
  async getAllAudioFiles() {
    try {
      const metadata = await storageService.loadAudioMetadata();
      return metadata;
    } catch (error) {
      console.error('Error getting audio files:', error);
      return [];
    }
  }

  /**
   * Delete audio file
   */
  async deleteAudioFile(audioFile) {
    try {
      // Delete file from file system
      const fileInfo = await FileSystem.getInfoAsync(audioFile.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(audioFile.uri);
      }

      // Remove from metadata
      const metadata = await storageService.loadAudioMetadata();
      const updatedMetadata = metadata.filter((file) => file.id !== audioFile.id);
      await storageService.saveAudioMetadata(updatedMetadata);
    } catch (error) {
      console.error('Error deleting audio file:', error);
      throw error;
    }
  }

  /**
   * Update audio file metadata
   */
  async updateAudioMetadata(audioFileId, updates) {
    try {
      const metadata = await storageService.loadAudioMetadata();
      const index = metadata.findIndex((file) => file.id === audioFileId);
      
      if (index !== -1) {
        metadata[index] = { ...metadata[index], ...updates };
        await storageService.saveAudioMetadata(metadata);
      }
    } catch (error) {
      console.error('Error updating audio metadata:', error);
      throw error;
    }
  }

  /**
   * Play audio file or replay via TTS
   */
  async playAudio(audioFileOrUri, audioData = null) {
    try {
      // If we have audio data (from Library), use TTS to replay
      if (audioData) {
        // Import ttsService dynamically to avoid circular dependency
        const { ttsService } = await import('./ttsService');
        await ttsService.speak({
          text: audioData.text,
          language: audioData.language,
          voice: audioData.voiceType,
          pitch: audioData.pitch,
          speed: audioData.speed,
        });
        return;
      }

      // If it's a real URI (from actual recording), try to play it
      if (typeof audioFileOrUri === 'string' && audioFileOrUri.startsWith('file://')) {
        // Unload previous sound if exists
        if (this.sound) {
          await this.sound.unloadAsync();
        }

        // Set audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Load and play
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioFileOrUri },
          { shouldPlay: true }
        );
        
        this.sound = sound;
        
        // Set up playback status update
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            this.sound?.unloadAsync();
            this.sound = null;
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  /**
   * Pause audio playback
   */
  async pauseAudio() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
      throw error;
    }
  }

  /**
   * Resume audio playback
   */
  async resumeAudio() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error('Error resuming audio:', error);
      throw error;
    }
  }

  /**
   * Stop audio playback
   */
  async stopAudio() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
      throw error;
    }
  }

  /**
   * Get audio file size
   */
  async getFileSize(uri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.exists && fileInfo.size ? fileInfo.size : 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }

  /**
   * Skip forward in audio (default 10 seconds)
   */
  async skipForward(milliseconds = 10000) {
    try {
      if (this.sound) {
        const status = await this.sound.getStatusAsync();
        if (status.isLoaded) {
          const newPosition = Math.min(
            status.positionMillis + milliseconds,
            status.durationMillis || 0
          );
          await this.sound.setPositionAsync(newPosition);
        }
      }
    } catch (error) {
      console.error('Error skipping forward:', error);
      throw error;
    }
  }

  /**
   * Skip backward in audio (default 10 seconds)
   */
  async skipBackward(milliseconds = 10000) {
    try {
      if (this.sound) {
        const status = await this.sound.getStatusAsync();
        if (status.isLoaded) {
          const newPosition = Math.max(status.positionMillis - milliseconds, 0);
          await this.sound.setPositionAsync(newPosition);
        }
      }
    } catch (error) {
      console.error('Error skipping backward:', error);
      throw error;
    }
  }

  /**
   * Get current playback status
   */
  async getPlaybackStatus() {
    try {
      if (this.sound) {
        return await this.sound.getStatusAsync();
      }
      return null;
    } catch (error) {
      console.error('Error getting playback status:', error);
      return null;
    }
  }
}

export const audioManager = new AudioManager();
