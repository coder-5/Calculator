import { useState, useEffect } from 'react';
import { Theme } from '../../shared/types';
import { storage } from '../utils/storage';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => storage.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Listen for theme toggle from electron menu
  useEffect(() => {
    if (window.electron) {
      window.electron.onToggleTheme(() => {
        toggleTheme();
      });
    }
  }, []);

  return { theme, setTheme, toggleTheme };
}
