// Audio Pronunciation System
// Provides text-to-speech functionality and audio management for language learning

export interface AudioSettings {
  voice: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0.0 to 1.0
  autoPlay: boolean;
  showPhonetics: boolean;
  highlightWords: boolean;
  isInfiniteLoop?: boolean; // Flag to prevent interrupting current audio
}

export interface PronunciationData {
  word: string;
  phonetic: string;
  audioUrl?: string;
  language: string;
  accent?: string;
  speed: number;
  pitch: number;
}

export interface AudioQueueItem {
  id: string;
  text: string;
  pronunciation: PronunciationData;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
}

export class AudioPronunciationSystem {
  private static instance: AudioPronunciationSystem;
  private audioQueue: AudioQueueItem[] = [];
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private speechSynthesis: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  // Default settings
  private defaultSettings: AudioSettings = {
    voice: 'en-US',
    speed: 0.8,
    pitch: 1.0,
    volume: 0.8,
    autoPlay: false,
    showPhonetics: true,
    highlightWords: true
  };

  private constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initializeSpeechSynthesis();
    }
  }

  public static getInstance(): AudioPronunciationSystem {
    if (!AudioPronunciationSystem.instance) {
      AudioPronunciationSystem.instance = new AudioPronunciationSystem();
    }
    return AudioPronunciationSystem.instance;
  }

  /**
   * Initialize speech synthesis
   */
  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.loadAvailableVoices();
      
      // Listen for voice changes
      this.speechSynthesis.addEventListener('voiceschanged', () => {
        this.loadAvailableVoices();
      });
    }
  }

  /**
   * Load available voices
   */
  private loadAvailableVoices(): void {
    if (this.speechSynthesis) {
      this.availableVoices = this.speechSynthesis.getVoices();
    }
  }

  /**
   * Get available voices for a specific language
   */
  public getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    return this.availableVoices.filter(voice => 
      voice.lang.startsWith(language) || voice.lang.includes(language)
    );
  }

  /**
   * Get default voice for a language
   */
  public getDefaultVoice(language: string): SpeechSynthesisVoice | null {
    const voices = this.getVoicesForLanguage(language);
    if (voices.length === 0) return null;

    // Prefer voices with 'preferred' attribute
    const preferred = voices.find(voice => voice.default);
    if (preferred) return preferred;

    // Return first available voice
    return voices[0];
  }

  /**
   * Play pronunciation using text-to-speech
   */
  public async playPronunciation(
    text: string,
    language: string = 'en',
    settings?: Partial<AudioSettings>
  ): Promise<void> {
    const finalSettings = { ...this.defaultSettings, ...settings };
    
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // For infinite loops, don't stop current audio - let it finish naturally
    const shouldStopCurrent = !settings?.isInfiniteLoop;
    if (shouldStopCurrent) {
      this.stopCurrentAudio();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      const voice = this.getDefaultVoice(language);
      if (voice) {
        utterance.voice = voice;
      }

      // Set properties
      utterance.rate = finalSettings.speed;
      utterance.pitch = finalSettings.pitch;
      utterance.volume = finalSettings.volume;
      utterance.lang = language;

      // Set event handlers
      utterance.onstart = () => {
        this.isPlaying = true;
        this.emitAudioEvent('start', { text, language });
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.emitAudioEvent('end', { text, language });
        this.processNextInQueue();
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        console.error('Speech synthesis error:', event);
        this.emitAudioEvent('error', { text, language, error: event.error });
        this.processNextInQueue();
      };

      // Speak the text
      this.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error playing pronunciation:', error);
      this.emitAudioEvent('error', { text, language, error });
    }
  }

  /**
   * Play pronunciation with custom pronunciation data
   */
  public async playPronunciationWithData(pronunciation: PronunciationData): Promise<void> {
    // If we have a custom audio URL, use that instead of TTS
    if (pronunciation.audioUrl) {
      await this.playCustomAudio(pronunciation.audioUrl);
    } else {
      await this.playPronunciation(
        pronunciation.word,
        pronunciation.language,
        {
          speed: pronunciation.speed,
          pitch: pronunciation.pitch
        }
      );
    }
  }

  /**
   * Play custom audio file
   */
  private async playCustomAudio(audioUrl: string): Promise<void> {
    try {
      this.stopCurrentAudio();

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.volume = this.defaultSettings.volume;

      audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.emitAudioEvent('start', { audioUrl });
      });

      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.emitAudioEvent('end', { audioUrl });
        this.processNextInQueue();
      });

      audio.addEventListener('error', (error) => {
        this.isPlaying = false;
        console.error('Audio playback error:', error);
        this.emitAudioEvent('error', { audioUrl, error });
        this.processNextInQueue();
      });

      await audio.play();

    } catch (error) {
      console.error('Error playing custom audio:', error);
      this.emitAudioEvent('error', { audioUrl, error });
    }
  }

  /**
   * Stop current audio playback
   */
  public stopCurrentAudio(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    this.isPlaying = false;
  }

  /**
   * Pause current audio
   */
  public pauseAudio(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      this.speechSynthesis.pause();
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  /**
   * Resume paused audio
   */
  public resumeAudio(): void {
    if (this.speechSynthesis && this.speechSynthesis.paused) {
      this.speechSynthesis.resume();
    }

    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
    }
  }

  /**
   * Add audio to queue
   */
  public addToQueue(item: Omit<AudioQueueItem, 'id' | 'timestamp'>): string {
    const queueItem: AudioQueueItem = {
      ...item,
      id: this.generateId(),
      timestamp: Date.now()
    };

    this.audioQueue.push(queueItem);
    
    // Sort queue by priority
    this.audioQueue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // If nothing is playing, start processing
    if (!this.isPlaying) {
      this.processNextInQueue();
    }

    return queueItem.id;
  }

  /**
   * Remove item from queue
   */
  public removeFromQueue(id: string): boolean {
    const index = this.audioQueue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.audioQueue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clear audio queue
   */
  public clearQueue(): void {
    this.audioQueue = [];
  }

  /**
   * Get current queue status
   */
  public getQueueStatus(): {
    isPlaying: boolean;
    queueLength: number;
    currentItem: AudioQueueItem | null;
    nextItems: AudioQueueItem[];
  } {
    return {
      isPlaying: this.isPlaying,
      queueLength: this.audioQueue.length,
      currentItem: this.audioQueue[0] || null,
      nextItems: this.audioQueue.slice(1, 4) // Next 3 items
    };
  }

  /**
   * Process next item in queue
   */
  private async processNextInQueue(): Promise<void> {
    if (this.audioQueue.length === 0 || this.isPlaying) {
      return;
    }

    const nextItem = this.audioQueue.shift();
    if (nextItem) {
      await this.playPronunciationWithData(nextItem.pronunciation);
    }
  }

  /**
   * Generate unique ID for queue items
   */
  private generateId(): string {
    return `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update audio settings
   */
  public updateSettings(newSettings: Partial<AudioSettings>): void {
    this.defaultSettings = { ...this.defaultSettings, ...newSettings };
    
    // Emit settings change event
    this.emitAudioEvent('settingsChanged', { settings: this.defaultSettings });
  }

  /**
   * Get current settings
   */
  public getSettings(): AudioSettings {
    return { ...this.defaultSettings };
  }

  /**
   * Reset settings to defaults
   */
  public resetSettings(): void {
    this.defaultSettings = {
      voice: 'en-US',
      speed: 0.8,
      pitch: 1.0,
      volume: 0.8,
      autoPlay: false,
      showPhonetics: true,
      highlightWords: true
    };
    
    this.emitAudioEvent('settingsChanged', { settings: this.defaultSettings });
  }

  /**
   * Check if audio is supported
   */
  public isSupported(): boolean {
    return 'speechSynthesis' in window || 'Audio' in window;
  }

  /**
   * Get audio capabilities
   */
  public getCapabilities(): {
    speechSynthesis: boolean;
    audioPlayback: boolean;
    voiceSelection: boolean;
    speedControl: boolean;
    pitchControl: boolean;
  } {
    return {
      speechSynthesis: 'speechSynthesis' in window,
      audioPlayback: 'Audio' in window,
      voiceSelection: this.availableVoices.length > 0,
      speedControl: 'speechSynthesis' in window,
      pitchControl: 'speechSynthesis' in window
    };
  }

  /**
   * Emit audio events for external listeners
   */
  private emitAudioEvent(type: string, data: any): void {
    const event = new CustomEvent('audioEvent', {
      detail: { type, data, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  /**
   * Add event listener for audio events
   */
  public addEventListener(type: string, callback: (event: CustomEvent) => void): void {
    window.addEventListener('audioEvent', (event: CustomEvent) => {
      if (event.detail.type === type) {
        callback(event);
      }
    });
  }

  /**
   * Remove event listener
   */
  public removeEventListener(type: string, callback: (event: CustomEvent) => void): void {
    window.removeEventListener('audioEvent', callback);
  }
}

// Export singleton instance
export const audioPronunciation = AudioPronunciationSystem.getInstance(); 