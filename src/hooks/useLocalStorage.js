import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storageService.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageService.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useChatHistory = () => {
  const [messages, setMessages] = useLocalStorage('chat_history', []);
  
  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (id, updates) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    deleteMessage,
    setMessages
  };
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage('chat_settings', {
    temperature: 0.7,
    maxTokens: 2048,
    topK: 40,
    topP: 0.95,
    enableSpeech: false,
    enableAnimations: true,
    autoScroll: true,
    streaming: true,
    markdown: true,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings({
      temperature: 0.7,
      maxTokens: 2048,
      topK: 40,
      topP: 0.95,
      enableSpeech: false,
      enableAnimations: true,
      autoScroll: true,
      streaming: true,
      markdown: true,
    });
  };

  return {
    settings,
    setSettings,
    updateSetting,
    resetSettings
  };
};
