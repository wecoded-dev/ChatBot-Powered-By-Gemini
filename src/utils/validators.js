export const validateApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, error: 'API key is required' };
  }
  
  if (apiKey.length < 10) {
    return { isValid: false, error: 'API key appears to be invalid' };
  }
  
  return { isValid: true, error: null };
};

export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }
  
  if (message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 5000) {
    return { isValid: false, error: 'Message is too long (max 5000 characters)' };
  }
  
  // Check for excessive repetition
  const words = message.split(' ');
  const uniqueWords = new Set(words);
  if (uniqueWords.size / words.length < 0.3 && words.length > 10) {
    return { isValid: false, error: 'Message contains too much repetition' };
  }
  
  return { isValid: true, error: null };
};

export const validateSettings = (settings) => {
  const errors = {};
  
  if (settings.temperature < 0 || settings.temperature > 1) {
    errors.temperature = 'Temperature must be between 0 and 1';
  }
  
  if (settings.maxTokens < 1 || settings.maxTokens > 8192) {
    errors.maxTokens = 'Max tokens must be between 1 and 8192';
  }
  
  if (settings.topK < 1 || settings.topK > 40) {
    errors.topK = 'Top K must be between 1 and 40';
  }
  
  if (settings.topP <= 0 || settings.topP > 1) {
    errors.topP = 'Top P must be between 0 and 1';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
