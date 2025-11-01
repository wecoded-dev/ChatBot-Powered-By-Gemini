export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const CHAT_CONFIG = {
  MAX_MESSAGES: 100,
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  TOP_K: 40,
  TOP_P: 0.95,
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  PREMIUM: 'premium',
  NEON: 'neon',
};

export const ANIMATION_PRESETS = {
  QUICK: 'quick',
  SMOOTH: 'smooth',
  BOUNCY: 'bouncy',
  ELEGANT: 'elegant',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system',
  ERROR: 'error',
};

export const STORAGE_KEYS = {
  CHAT_HISTORY: 'gemini_chat_history',
  THEME: 'gemini_chat_theme',
  SETTINGS: 'gemini_chat_settings',
  USER_PREFERENCES: 'gemini_user_preferences',
};
