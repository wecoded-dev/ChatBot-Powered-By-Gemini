class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    
    this.loadVoices();
    
    // Re-load voices when they change
    if (this.synthesis) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (this.synthesis) {
      this.voices = this.synthesis.getVoices();
      // Prefer English voices
      this.selectedVoice = this.voices.find(voice => 
        voice.lang.includes('en') && voice.localService === false
      ) || this.voices[0];
    }
  }

  speak(text, options = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.voice = options.voice || this.selectedVoice;

    utterance.onstart = () => {
      this.isSpeaking = true;
      options.onStart && options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      options.onEnd && options.onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      options.onError && options.onError(event);
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
    
    return true;
  }

  stop() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  getVoices() {
    return this.voices;
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  getSpeakingState() {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
export default SpeechService;
