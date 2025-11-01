import { useState, useCallback, useRef, useEffect } from 'react';
import { useChatHistory, useSettings } from './useLocalStorage';
import { useGemini } from './useGemini';
import { generateId, formatTimestamp } from '../utils/helpers';
import { MESSAGE_TYPES } from '../utils/constants';

export const useChat = () => {
  const {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    deleteMessage,
    setMessages
  } = useChatHistory();

  const { settings } = useSettings();
  const {
    generateResponse,
    cancelGeneration,
    clearError,
    isLoading,
    error,
    streamingText,
    isStreaming
  } = useGemini(settings);

  const messagesEndRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (isAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: settings.enableAnimations ? 'smooth' : 'auto' 
      });
    }
  }, [isAutoScroll, settings.enableAnimations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = {
      id: generateId(),
      type: MESSAGE_TYPES.USER,
      content: content.trim(),
      timestamp: Date.now(),
      isStreaming: false
    };

    addMessage(userMessage);

    const aiMessageId = generateId();
    const aiMessage = {
      id: aiMessageId,
      type: MESSAGE_TYPES.AI,
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    addMessage(aiMessage);

    const onStreamUpdate = (chunk, isComplete = false) => {
      updateMessage(aiMessageId, {
        content: chunk,
        isStreaming: !isComplete,
        timestamp: Date.now()
      });
    };

    const response = await generateResponse(content, onStreamUpdate);

    if (!response.success) {
      updateMessage(aiMessageId, {
        type: MESSAGE_TYPES.ERROR,
        content: `Error: ${response.error}`,
        isStreaming: false,
        timestamp: Date.now()
      });
    } else if (!settings.streaming) {
      updateMessage(aiMessageId, {
        content: response.data,
        isStreaming: false,
        timestamp: Date.now()
      });
    }
  }, [addMessage, updateMessage, generateResponse, isLoading, settings.streaming]);

  const regenerateResponse = useCallback(async (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.type !== MESSAGE_TYPES.USER) return;

    // Remove the existing AI response
    const updatedMessages = messages.slice(0, messageIndex);
    setMessages(updatedMessages);

    // Send the message again
    await sendMessage(userMessage.content);
  }, [messages, setMessages, sendMessage]);

  const editMessage = useCallback((messageId, newContent) => {
    updateMessage(messageId, { content: newContent });
  }, [updateMessage]);

  const clearChat = useCallback(() => {
    clearMessages();
    clearError();
  }, [clearMessages, clearError]);

  const exportChat = useCallback((format = 'json') => {
    const chatData = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        ...msg,
        timestamp: formatTimestamp(msg.timestamp)
      }))
    };

    switch (format) {
      case 'json':
        return JSON.stringify(chatData, null, 2);
      case 'txt':
        return messages
          .map(msg => `${msg.type.toUpperCase()} [${formatTimestamp(msg.timestamp)}]: ${msg.content}`)
          .join('\n\n');
      default:
        return chatData;
    }
  }, [messages]);

  const importChat = useCallback((data) => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsedData.messages && Array.isArray(parsedData.messages)) {
        setMessages(parsedData.messages.map(msg => ({
          ...msg,
          id: msg.id || generateId(),
          timestamp: msg.timestamp || Date.now()
        })));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing chat:', error);
      return false;
    }
  }, [setMessages]);

  const toggleAutoScroll = useCallback(() => {
    setIsAutoScroll(prev => !prev);
  }, []);

  return {
    // State
    messages,
    isLoading,
    error,
    streamingText,
    isStreaming,
    isAutoScroll,
    
    // Refs
    messagesEndRef,
    
    // Actions
    sendMessage,
    regenerateResponse,
    editMessage,
    deleteMessage,
    clearChat,
    exportChat,
    importChat,
    cancelGeneration,
    clearError,
    toggleAutoScroll,
    
    // Utilities
    hasMessages: messages.length > 0,
    totalMessages: messages.length,
    userMessages: messages.filter(msg => msg.type === MESSAGE_TYPES.USER).length,
    aiMessages: messages.filter(msg => msg.type === MESSAGE_TYPES.AI).length,
  };
};
