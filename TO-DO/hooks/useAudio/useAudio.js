import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

/**
 * useAudio Hook
 * Manages audio playback functionality
 */
export const useAudio = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playbackSubscriptionRef = useRef(null);

  const loadSound = useCallback(async (uri) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis / 1000 || 0);

      return newSound;
    } catch (error) {
      console.error('[useAudio] Error loading sound:', error);
      throw error;
    }
  }, [sound]);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000 || 0);
      setDuration(status.durationMillis / 1000 || 0);
      setIsPlaying(status.isPlaying);
    } else if (status.error) {
      console.error(`Playback error: ${status.error}`);
    }
  }, []);

  const play = useCallback(async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }, [sound]);

  const pause = useCallback(async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }, [sound]);

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback(async (position) => {
    if (sound) {
      await sound.setPositionAsync(position * 1000);
    }
  }, [sound]);

  const cleanup = useCallback(async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [sound]);

  return {
    sound,
    isPlaying,
    currentTime,
    duration,
    loadSound,
    play,
    pause,
    togglePlayPause,
    seek,
    cleanup,
  };
};

export default useAudio;
