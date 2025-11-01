import { useState, useCallback, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { validateMessage } from '../utils/validators';
import { generateId } from '../utils/helpers';

export const useGemini = (settings) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const abortControllerRef = useRef(null);

  const generateResponse = useCallback(async (prompt, onStreamUpdate = null) => {
    // Validate input
    const validation = validateMessage(prompt);
    if (!validation.isValid) {
      setError(validation.error);
      return { success: false, error: validation.error };
    }

    setIsLoading(true);
    setError(null);
    setStreamingText('');

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      if (settings.streaming && onStreamUpdate) {
        // Use streaming approach
        await new Promise((resolve, reject) => {
          geminiService.streamContent(
            prompt,
            (chunk) => {
              setStreamingText(chunk);
              onStreamUpdate(chunk, false);
            },
            (completeText) => {
              setStreamingText(completeText);
              onStreamUpdate(completeText, true);
              resolve(completeText);
            },
            (error) => {
              setError(error);
              reject(new Error(error));
            },
            {
              temperature: settings.temperature,
              maxTokens: settings.maxTokens,
              topK: settings.topK,
              topP: settings.topP,
            }
          );
        });

        return { success: true, data: streamingText };
      } else {
        // Use regular generation
        const response = await geminiService.generateContent(prompt, {
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          topK: settings.topK,
          topP: settings.topP,
        });

        if (response.success) {
          return response;
        } else {
          setError(response.error);
          return response;
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [settings, streamingText]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setError('Generation cancelled');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearStreamingText = useCallback(() => {
    setStreamingText('');
  }, []);

  return {
    generateResponse,
    cancelGeneration,
    clearError,
    clearStreamingText,
    isLoading,
    error,
    streamingText,
    isStreaming: isLoading && streamingText,
  };
};
