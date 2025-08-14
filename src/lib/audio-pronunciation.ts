import { isBrowserAPI, getBrowserAPI } from './hydration-safe';

// Enhanced Audio Pronunciation System
// Provides realistic, relaxed text-to-speech with natural pauses and voice selection

export interface AudioSettings {
  voice: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0.0 to 1.0
  autoPlay: boolean;
  showPhonetics: boolean;
  highlightWords: boolean;
  isInfiniteLoop?: boolean;
  // New enhanced settings
  naturalPauses: boolean;
  emphasisLevel: 'subtle' | 'moderate' | 'strong';
  breathingSpace: boolean;
  sentenceRhythm: boolean;
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

export interface EnhancedVoice {
  voice: SpeechSynthesisVoice;
  quality: 'premium' | 'standard' | 'basic';
  naturalness: number; // 0-10 scale
  clarity: number; // 0-10 scale
  recommended: boolean;
}

export class AudioPronunciationSystem {
  private static instance: AudioPronunciationSystem;
  private audioQueue: AudioQueueItem[] = [];
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private speechSynthesis: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private enhancedVoices: EnhancedVoice[] = [];

  // Enhanced default settings for more natural speech
  private defaultSettings: AudioSettings = {
    voice: 'en-US',
    speed: 0.75, // Slightly slower for more natural pace
    pitch: 0.95, // Slightly lower for more relaxed tone
    volume: 0.85,
    autoPlay: false,
    showPhonetics: true,
    highlightWords: true,
    naturalPauses: true,
    emphasisLevel: 'moderate',
    breathingSpace: true,
    sentenceRhythm: true
  };

  // Voice quality mapping for better selection
  private voiceQualityMap: { [key: string]: { quality: 'premium' | 'standard' | 'basic', naturalness: number, clarity: number } } = {
    // Premium voices (high quality, natural)
    'en-US-Neural2-A': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-C': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-D': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-E': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-F': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-G': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-H': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-I': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Neural2-J': { quality: 'premium', naturalness: 9, clarity: 9 },
    'en-US-Standard-A': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-B': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-C': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-D': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-E': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-F': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-G': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-H': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-I': { quality: 'standard', naturalness: 7, clarity: 8 },
    'en-US-Standard-J': { quality: 'standard', naturalness: 7, clarity: 8 },
    // Basic voices (fallback)
    'en-US': { quality: 'basic', naturalness: 5, clarity: 6 },
    'en-GB': { quality: 'basic', naturalness: 5, clarity: 6 }
  };

  private constructor() {
    // Only initialize on client side
    if (isBrowserAPI('speechSynthesis')) {
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
   * Initialize speech synthesis with enhanced voice selection
   */
  private initializeSpeechSynthesis(): void {
    if (isBrowserAPI('speechSynthesis')) {
      const synthesis = getBrowserAPI<SpeechSynthesis>('speechSynthesis');
      if (synthesis) {
        this.speechSynthesis = synthesis;
        this.loadAvailableVoices();
        
        // Listen for voice changes
        this.speechSynthesis.addEventListener('voiceschanged', () => {
          this.loadAvailableVoices();
        });
      }
    }
  }

  /**
   * Load and categorize available voices by quality
   */
  private loadAvailableVoices(): void {
    if (this.speechSynthesis) {
      this.availableVoices = this.speechSynthesis.getVoices();
      this.categorizeVoices();
    }
  }

  /**
   * Categorize voices by quality and naturalness
   */
  private categorizeVoices(): void {
    this.enhancedVoices = this.availableVoices
      .filter(voice => voice.lang.startsWith('en'))
      .map(voice => {
        const voiceInfo = this.voiceQualityMap[voice.name] || 
                         this.voiceQualityMap[voice.lang] || 
                         { quality: 'basic' as const, naturalness: 5, clarity: 6 };
        
        return {
          voice,
          quality: voiceInfo.quality,
          naturalness: voiceInfo.naturalness,
          clarity: voiceInfo.clarity,
          recommended: voiceInfo.quality === 'premium' || 
                      (voiceInfo.quality === 'standard' && voiceInfo.naturalness >= 7)
        };
      })
      .sort((a, b) => {
        // Sort by quality, then by naturalness, then by clarity
        const qualityOrder = { premium: 3, standard: 2, basic: 1 };
        if (qualityOrder[b.quality] !== qualityOrder[a.quality]) {
          return qualityOrder[b.quality] - qualityOrder[a.quality];
        }
        if (b.naturalness !== a.naturalness) {
          return b.naturalness - a.naturalness;
        }
        return b.clarity - a.clarity;
      });
  }

  /**
   * Get the best available voice for natural speech
   */
  public getBestNaturalVoice(language: string = 'en'): SpeechSynthesisVoice | null {
    const recommendedVoices = this.enhancedVoices.filter(v => v.recommended);
    
    if (recommendedVoices.length > 0) {
      // Prefer premium voices, then high-quality standards
      const premium = recommendedVoices.find(v => v.quality === 'premium');
      if (premium) return premium.voice;
      
      return recommendedVoices[0].voice;
    }
    
    // Fallback to any available voice
    return this.availableVoices.find(voice => voice.lang.startsWith(language)) || null;
  }

  /**
   * Enhance text with natural pauses and rhythm
   */
  private enhanceTextWithPauses(text: string): string {
    if (!this.defaultSettings.naturalPauses) return text;
    
    let enhancedText = text;
    
    // Add pauses after sentences
    enhancedText = enhancedText.replace(/([.!?])\s+/g, '$1 <break time="500ms"/> ');
    
    // Add pauses after commas
    enhancedText = enhancedText.replace(/,/g, ', <break time="200ms"/>');
    
    // Add pauses after colons and semicolons
    enhancedText = enhancedText.replace(/([:;])\s*/g, '$1 <break time="300ms"/> ');
    
    // Add breathing space between paragraphs
    if (this.defaultSettings.breathingSpace) {
      enhancedText = enhancedText.replace(/\n\s*\n/g, '\n<break time="800ms"/>\n');
    }
    
    // Add emphasis for important words (capitalized or in quotes)
    if (this.defaultSettings.emphasisLevel !== 'subtle') {
      enhancedText = enhancedText.replace(/"([^"]+)"/g, '<emphasis level="$1">$1</emphasis>');
      enhancedText = enhancedText.replace(/\b([A-Z][a-z]+)\b/g, (match) => {
        if (this.defaultSettings.emphasisLevel === 'strong') {
          return `<prosody rate="0.9" pitch="+10%">${match}</prosody>`;
        }
        return match;
      });
    }
    
    // Add natural rhythm for longer sentences
    if (this.defaultSettings.sentenceRhythm && text.length > 100) {
      const sentences = enhancedText.split(/([.!?])\s+/);
      enhancedText = sentences.map((part, index) => {
        if (index % 2 === 0 && part.length > 50) {
          // Add mid-sentence pause for very long sentences
          const words = part.split(' ');
          if (words.length > 15) {
            const midPoint = Math.floor(words.length / 2);
            words.splice(midPoint, 0, '<break time="150ms"/>');
            return words.join(' ');
          }
        }
        return part;
      }).join('');
    }
    
    return enhancedText;
  }

  /**
   * Get available voices for a specific language with quality information
   */
  public getVoicesForLanguage(language: string): EnhancedVoice[] {
    return this.enhancedVoices.filter(enhancedVoice => 
      enhancedVoice.voice.lang.startsWith(language) || 
      enhancedVoice.voice.lang.includes(language)
    );
  }

  /**
   * Get default voice for a language
   */
  public getDefaultVoice(language: string): SpeechSynthesisVoice | null {
    return this.getBestNaturalVoice(language);
  }

  /**
   * Enhanced pronunciation with natural speech patterns
   */
  public async playPronunciation(
    text: string,
    language: string = 'en',
    settings?: Partial<AudioSettings>
  ): Promise<void> {
    const finalSettings = { ...this.defaultSettings, ...settings };
    
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      throw new Error('Speech synthesis not supported in this browser');
    }

    // Check if speech synthesis is ready
    if (this.speechSynthesis.paused || this.speechSynthesis.pending) {
      console.warn('Speech synthesis is paused or pending, waiting...');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // For infinite loops, don't stop current audio - let it finish naturally
    const shouldStopCurrent = !settings?.isInfiniteLoop;
    if (shouldStopCurrent) {
      this.stopCurrentAudio();
    }

    // Check if we're already speaking and wait a bit
    if (this.speechSynthesis.speaking) {
      console.warn('Speech synthesis already speaking, waiting for completion...');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    try {
      // Enhance text with natural pauses and rhythm
      const enhancedText = this.enhanceTextWithPauses(text);
      
      const utterance = new SpeechSynthesisUtterance(enhancedText);
      
      // Set the best available voice for natural speech
      const voice = this.getBestNaturalVoice(language);
      if (voice) {
        utterance.voice = voice;
        console.log(`Using voice: ${voice.name} (${voice.lang})`);
      }

      // Enhanced properties for more natural speech
      utterance.rate = finalSettings.speed;
      utterance.pitch = finalSettings.pitch;
      utterance.volume = finalSettings.volume;
      utterance.lang = language;

      // Set event handlers
      utterance.onstart = () => {
        this.isPlaying = true;
        this.emitAudioEvent('start', { text, language, enhancedText });
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.emitAudioEvent('end', { text, language, enhancedText });
        this.processNextInQueue();
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        console.error('Speech synthesis error:', {
          error: event.error,
          errorMessage: event.error || 'Unknown error',
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          language,
          timestamp: new Date().toISOString()
        });
        
        this.emitAudioEvent('error', { 
          text: text.substring(0, 100), 
          language, 
          error: event.error || 'interrupted',
          errorType: 'speech_synthesis'
        });
        
        this.processNextInQueue();
      };

      // Speak the enhanced text
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
   * Get voice information and recommendations
   */
  public getVoiceInfo(): {
    availableVoices: EnhancedVoice[];
    recommendedVoices: EnhancedVoice[];
    currentVoice: SpeechSynthesisVoice | null;
    voiceCapabilities: {
      premium: number;
      standard: number;
      basic: number;
    };
  } {
    const recommendedVoices = this.enhancedVoices.filter(v => v.recommended);
    const currentVoice = this.getBestNaturalVoice();
    
    const voiceCapabilities = {
      premium: this.enhancedVoices.filter(v => v.quality === 'premium').length,
      standard: this.enhancedVoices.filter(v => v.quality === 'standard').length,
      basic: this.enhancedVoices.filter(v => v.quality === 'basic').length
    };

    return {
      availableVoices: this.enhancedVoices,
      recommendedVoices,
      currentVoice,
      voiceCapabilities
    };
  }

  /**
   * Set specific voice by name or quality preference
   */
  public setVoicePreference(preference: 'premium' | 'standard' | 'basic' | 'auto'): SpeechSynthesisVoice | null {
    if (preference === 'auto') {
      return this.getBestNaturalVoice();
    }
    
    const availableVoices = this.enhancedVoices.filter(v => v.quality === preference);
    if (availableVoices.length > 0) {
      // Sort by naturalness and clarity
      availableVoices.sort((a, b) => {
        if (b.naturalness !== a.naturalness) return b.naturalness - a.naturalness;
        return b.clarity - a.clarity;
      });
      
      return availableVoices[0].voice;
    }
    
    return null;
  }

  /**
   * Update audio settings with enhanced options
   */
  public updateSettings(newSettings: Partial<AudioSettings>): void {
    this.defaultSettings = { ...this.defaultSettings, ...newSettings };
    
    // If voice quality preference changed, update voice selection
    if (newSettings.voice && newSettings.voice !== this.defaultSettings.voice) {
      const newVoice = this.setVoicePreference(newSettings.voice as any);
      if (newVoice) {
        console.log(`Voice updated to: ${newVoice.name} (${newVoice.lang})`);
      }
    }
    
    // Emit settings change event
    this.emitAudioEvent('settingsChanged', { 
      settings: this.defaultSettings,
      voiceInfo: this.getVoiceInfo()
    });
  }

  /**
   * Get current settings with voice information
   */
  public getSettings(): AudioSettings & { voiceInfo: ReturnType<typeof this.getVoiceInfo> } {
    return { 
      ...this.defaultSettings,
      voiceInfo: this.getVoiceInfo()
    };
  }

  /**
   * Reset settings to enhanced defaults
   */
  public resetSettings(): void {
    this.defaultSettings = {
      voice: 'en-US',
      speed: 0.75, // Slightly slower for more natural pace
      pitch: 0.95, // Slightly lower for more relaxed tone
      volume: 0.85,
      autoPlay: false,
      showPhonetics: true,
      highlightWords: true,
      naturalPauses: true,
      emphasisLevel: 'moderate',
      breathingSpace: true,
      sentenceRhythm: true
    };
    
    this.emitAudioEvent('settingsChanged', { 
      settings: this.defaultSettings,
      voiceInfo: this.getVoiceInfo()
    });
  }

  /**
   * Test voice quality with sample text
   */
  public async testVoiceQuality(voice: SpeechSynthesisVoice, sampleText: string = "Hello, this is a test of the voice quality. How natural does it sound?"): Promise<{
    voice: SpeechSynthesisVoice;
    quality: 'premium' | 'standard' | 'basic';
    naturalness: number;
    clarity: number;
    sampleAudio?: string;
  }> {
    const voiceInfo = this.enhancedVoices.find(v => v.voice === voice);
    
    if (!voiceInfo) {
      return {
        voice,
        quality: 'basic',
        naturalness: 5,
        clarity: 6
      };
    }

    // Play sample text to test voice
    try {
      await this.playPronunciation(sampleText, voice.lang, {
        voice: voice.name,
        speed: 0.8,
        pitch: 1.0,
        naturalPauses: true,
        emphasisLevel: 'moderate'
      });
    } catch (error) {
      console.warn('Could not test voice quality:', error);
    }

    return voiceInfo;
  }

  /**
   * Check if audio is supported
   */
  public isSupported(): boolean {
    return 'speechSynthesis' in window || 'Audio' in window;
  }

  /**
   * Get audio capabilities with enhanced voice information
   */
  public getCapabilities(): {
    speechSynthesis: boolean;
    audioPlayback: boolean;
    voiceSelection: boolean;
    speedControl: boolean;
    pitchControl: boolean;
    naturalPauses: boolean;
    voiceQuality: {
      premium: boolean;
      standard: boolean;
      basic: boolean;
    };
  } {
    const voiceInfo = this.getVoiceInfo();
    
    return {
      speechSynthesis: 'speechSynthesis' in window,
      audioPlayback: 'Audio' in window,
      voiceSelection: this.enhancedVoices.length > 0,
      speedControl: 'speechSynthesis' in window,
      pitchControl: 'speechSynthesis' in window,
      naturalPauses: true,
      voiceQuality: {
        premium: voiceInfo.voiceCapabilities.premium > 0,
        standard: voiceInfo.voiceCapabilities.standard > 0,
        basic: voiceInfo.voiceCapabilities.basic > 0
      }
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
  public addAudioEventListener(callback: (event: CustomEvent) => void): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('audioEvent' as any, callback as EventListener);
    }
  }

  /**
   * Remove event listener for audio events
   */
  public removeAudioEventListener(callback: (event: CustomEvent) => void): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('audioEvent' as any, callback as EventListener);
    }
  }
}

// Export singleton instance
export const audioPronunciation = AudioPronunciationSystem.getInstance(); 