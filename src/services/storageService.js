import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  constructor() {
    this.prefix = 'gemini_chat_';
  }

  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clear() {
    try {
      // Only clear items with our prefix
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Specific methods for chat data
  saveChatHistory(messages) {
    return this.set(STORAGE_KEYS.CHAT_HISTORY, messages);
  }

  loadChatHistory() {
    return this.get(STORAGE_KEYS.CHAT_HISTORY, []);
  }

  saveTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  }

  loadTheme() {
    return this.get(STORAGE_KEYS.THEME, 'dark');
  }

  saveSettings(settings) {
    return this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  loadSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      temperature: 0.7,
      maxTokens: 2048,
      topK: 40,
      topP: 0.95,
      enableSpeech: false,
      enableAnimations: true,
      autoScroll: true,
    });
  }

  saveUserPreferences(preferences) {
    return this.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  loadUserPreferences() {
    return this.get(STORAGE_KEYS.USER_PREFERENCES, {
      favoriteColor: '#667eea',
      readingTime: true,
      messageEffects: true,
    });
  }

  // Export all data
  exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const cleanKey = key.replace(this.prefix, '');
        data[cleanKey] = this.get(cleanKey);
      }
    }
    return data;
  }

  // Import data
  importData(data) {
    try {
      Object.keys(data).forEach(key => {
        this.set(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Get storage usage
  getStorageUsage() {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        totalSize += key.length + (value ? value.length : 0);
      }
    }
    return totalSize;
  }
}

export const storageService = new StorageService();
export default StorageService;
