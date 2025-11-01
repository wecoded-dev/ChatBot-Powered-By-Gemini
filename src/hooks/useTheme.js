import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { THEMES } from '../utils/constants';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('theme', THEMES.DARK);
  const [isDark, setIsDark] = useState(theme === THEMES.DARK);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove(
      THEMES.LIGHT,
      THEMES.DARK,
      THEMES.PREMIUM,
      THEMES.NEON
    );
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update dark mode state
    setIsDark(theme === THEMES.DARK || theme === THEMES.PREMIUM);
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      switch (theme) {
        case THEMES.LIGHT:
          metaThemeColor.setAttribute('content', '#ffffff');
          break;
        case THEMES.PREMIUM:
          metaThemeColor.setAttribute('content', '#1a1a2e');
          break;
        case THEMES.NEON:
          metaThemeColor.setAttribute('content', '#0a0a0a');
          break;
        default:
          metaThemeColor.setAttribute('content', '#0f172a');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => 
      current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    );
  };

  const setCustomTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return {
    theme,
    setTheme: setCustomTheme,
    toggleTheme,
    isDark,
    themes: THEMES
  };
};
