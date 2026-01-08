import { useState, useCallback } from 'react';
import { ttsService } from '@/services/ttsService';

/**
 * useTTS Hook
 * Manages text-to-speech functionality
 */
export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [currentSettings, setCurrentSettings] = useState({
    text: '',
    language: 'en',
    voice: 'female',
    pitch: 1.0,
    speed: 1.0,
  });

  const speak = useCallback(async (text, settings = {}) => {
    try {
      setError(null);
      setIsSpeaking(true);

      const finalSettings = {
        ...currentSettings,
        text,
        ...settings,
      };

      await ttsService.speak(finalSettings);

      setCurrentSettings(finalSettings);
    } catch (err) {
      console.error('[useTTS] Error speaking:', err);
      setError(err.message);
    } finally {
      setIsSpeaking(false);
    }
  }, [currentSettings]);

  const stop = useCallback(async () => {
    try {
      await ttsService.stop();
      setIsSpeaking(false);
    } catch (err) {
      console.error('[useTTS] Error stopping:', err);
      setError(err.message);
    }
  }, []);

  const updateSettings = useCallback((settings) => {
    setCurrentSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  }, []);

  return {
    isSpeaking,
    error,
    currentSettings,
    speak,
    stop,
    updateSettings,
  };
};

export default useTTS;
