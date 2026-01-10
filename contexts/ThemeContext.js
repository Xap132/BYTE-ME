import { Colors } from '@/constants/theme';
import { storageService } from '@/services/storageService';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: Colors.techTalk,
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const prefs = await storageService.loadPreferences();
      if (prefs.darkMode !== undefined) {
        setIsDarkMode(prefs.darkMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async (value) => {
    setIsDarkMode(value);
    try {
      const prefs = await storageService.loadPreferences();
      await storageService.savePreferences({ ...prefs, darkMode: value });
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? Colors.techTalk : Colors.techTalkLight;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
