import { getPresetVoice } from '@/constants/voices';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { storageService } from './storageService';

// Use FileSystem constants - will be set after initialization
let AUDIO_DIR = '';

class AudioManager {
  constructor() {
    this.sound = null;
    this.recording = null;
    this.initialized = false;
    // Don't call async in constructor
  }

  /**
   * Initialize audio directory (call this before using)
   */
  async initializeAudioDirectory() {
    if (this.initialized) return;
    
    // Skip file system on web
    if (Platform.OS === 'web') {
      console.log('Running on web - file system disabled');
      AUDIO_DIR = 'tts_audio/';
      this.initialized = true;
      return;
    }
    
    try {
      // Use FileSystem directly - it's available on mobile
      const baseDir = FileSystem.documentDirectory;
      
      if (!baseDir) {
        console.warn('FileSystem directory not available, using fallback');
        AUDIO_DIR = 'tts_audio/';
        this.initialized = true;
        return;
      }
      
      AUDIO_DIR = `${baseDir}tts_audio/`;
      
      const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
      }
      
      console.log('Audio directory initialized:', AUDIO_DIR);
      this.initialized = true;
    } catch (error) {
      console.warn('Error initializing audio directory:', error);
      AUDIO_DIR = 'tts_audio/'; // Fallback
      this.initialized = true;
    }
  }

  /**
   * Save TTS settings and text for later replay
   */
  async saveAudioFile(text, options, format = 'wav') {
    // Make sure directory is initialized
    await this.initializeAudioDirectory();
    
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
        voiceType: options.voice || getPresetVoice(options.language),
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

  // Get all saved audio files
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
      // Only delete file from file system if URI exists
      if (audioFile.uri) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(audioFile.uri);
          if (fileInfo?.exists) {
            await FileSystem.deleteAsync(audioFile.uri);
          }
        } catch (fsError) {
          // Ignore file system errors - metadata removal is what matters
          console.warn('Error deleting audio file from storage:', fsError);
        }
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
