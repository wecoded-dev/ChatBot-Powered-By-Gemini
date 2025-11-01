import axios from 'axios';
import { GEMINI_API_KEY, GEMINI_API_URL, CHAT_CONFIG } from '../utils/constants';
import { validateApiKey, validateMessage } from '../utils/validators';

class GeminiService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseURL = GEMINI_API_URL;
    this.conversationHistory = [];
  }

  setApiKey(apiKey) {
    const validation = validateApiKey(apiKey);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    this.apiKey = apiKey;
  }

  async generateContent(prompt, options = {}) {
    try {
      // Validate input
      const messageValidation = validateMessage(prompt);
      if (!messageValidation.isValid) {
        throw new Error(messageValidation.error);
      }

      const apiKeyValidation = validateApiKey(this.apiKey);
      if (!apiKeyValidation.isValid) {
        throw new Error('Invalid API key. Please check your configuration.');
      }

      const {
        temperature = CHAT_CONFIG.TEMPERATURE,
        maxTokens = CHAT_CONFIG.MAX_TOKENS,
        topK = CHAT_CONFIG.TOP_K,
        topP = CHAT_CONFIG.TOP_P,
      } = options;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          topK: topK,
          topP: topP,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        
        // Store in conversation history
        this.conversationHistory.push({
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString()
        });
        
        this.conversationHistory.push({
          role: 'model',
          content: generatedText,
          timestamp: new Date().toISOString()
        });

        // Keep only last 50 messages to prevent memory issues
        if (this.conversationHistory.length > 50) {
          this.conversationHistory = this.conversationHistory.slice(-50);
        }

        return {
          success: true,
          data: generatedText,
          usage: response.data.usageMetadata || {}
        };
      } else {
        throw new Error('No response generated from the model');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data.error?.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Invalid API key. Please check your configuration.';
            break;
          case 403:
            errorMessage = 'Access denied. Please check your API key permissions.';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded. Please try again later.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = data.error?.message || `API Error: ${status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async streamContent(prompt, onChunk, onComplete, onError, options = {}) {
    try {
      const messageValidation = validateMessage(prompt);
      if (!messageValidation.isValid) {
        throw new Error(messageValidation.error);
      }

      // For streaming, we'll simulate it since Gemini streaming might require different endpoint
      // This is a placeholder for actual streaming implementation
      const response = await this.generateContent(prompt, options);
      
      if (response.success) {
        // Simulate streaming by breaking response into chunks
        const text = response.data;
        const words = text.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
          currentText += words[i] + ' ';
          onChunk(currentText.trim());
          
          // Simulate typing delay
          await new Promise(resolve => 
            setTimeout(resolve, Math.random() * 50 + 30)
          );
        }
        
        onComplete(text);
      } else {
        onError(response.error);
      }
    } catch (error) {
      onError(error.message);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return [...this.conversationHistory];
  }

  exportHistory(format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(this.conversationHistory, null, 2);
      case 'txt':
        return this.conversationHistory
          .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join('\n\n');
      default:
        return this.conversationHistory;
    }
  }
}

export const geminiService = new GeminiService();
export default GeminiService;
