// Translation service using LibreTranslate (free and open-source)
// Alternative: Google Translate API (requires API key)

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
}

class TranslationService {
  private baseUrl = 'https://libretranslate.com/translate';
  private fallbackUrl = 'https://translate.googleapis.com/translate_a/single';
  
  // Sample translations for common words (fallback when APIs fail)
  public sampleTranslations: Record<string, string> = {
    'hello': 'hola',
    'goodbye': 'adiós',
    'thank you': 'gracias',
    'please': 'por favor',
    'yes': 'sí',
    'no': 'no',
    'water': 'agua',
    'food': 'comida',
    'house': 'casa',
    'car': 'coche',
    'book': 'libro',
    'time': 'tiempo',
    'work': 'trabajo',
    'family': 'familia',
    'friend': 'amigo',
    'love': 'amor',
    'happy': 'feliz',
    'sad': 'triste',
    'big': 'grande',
    'small': 'pequeño',
    'good': 'bueno',
    'bad': 'malo',
    'beautiful': 'hermoso',
    'ugly': 'feo',
    'fast': 'rápido',
    'slow': 'lento',
    'hot': 'caliente',
    'cold': 'frío',
    'new': 'nuevo',
    'old': 'viejo',
    'young': 'joven',
    // Add more common words from your vocabulary
    'accomplish': 'lograr, cumplir',
    'endeavor': 'esfuerzo, empeño',
    'perseverance': 'perseverancia, constancia',
    'sensible': 'sensato, razonable',
    'sensitive': 'sensible, delicado',
    'settle down': 'establecerse, asentarse',
    'shook': 'conmocionado, sorprendido',
    'silent support': 'apoyo silencioso',
    'slip one\'s mind': 'olvidarse',
    'smuggling': 'contrabando',
    'snatched': 'perfecto, estilizado',
    'sophomore': 'estudiante de segundo año',
    'soul healer': 'sanador del alma',
    'speak one\'s mind': 'decir lo que piensa',
    'start-up': 'empresa emergente',
    'steering wheel': 'volante',
    'stern': 'severo, estricto',
    'stopgap measure': 'medida temporal',
    'studs': 'pendientes',
    'suspect': 'sospechoso',
    'sustainable': 'sostenible',
    'ascertain': 'determinar',
    'ask out': 'invitar a salir',
    'assassination': 'asesinato',
    'assertive': 'asertivo',
    'ballpark figure': 'cifra aproximada',
    'bangle': 'pulsera rígida'
  };

  // Translate text from English to Spanish
  async translateToSpanish(text: string): Promise<string> {
    try {
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Translation timeout')), 10000); // 10 second timeout
      });

      // Try LibreTranslate first (free, no API key required)
      const librePromise = this.translateWithLibreTranslate(text);
      const translation = await Promise.race([librePromise, timeoutPromise]);
      
      if (translation) {
        return translation;
      }

      // Fallback to Google Translate (free tier, limited requests)
      const googlePromise = this.translateWithGoogle(text);
      const googleTranslation = await Promise.race([googlePromise, timeoutPromise]);
      
      if (googleTranslation) {
        return googleTranslation;
      }

      // If both APIs fail, try sample translations
      const sampleTranslation = this.sampleTranslations[text.toLowerCase()];
      if (sampleTranslation) {
        console.log('Using sample translation for:', text);
        return sampleTranslation;
      }

      // If all else fails, return the original text
      console.warn('Translation failed, returning original text');
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  // LibreTranslate (free, open-source)
  private async translateWithLibreTranslate(text: string): Promise<string | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'es',
          format: 'text'
        }),
      });

      if (response.ok) {
        const data: TranslationResponse = await response.json();
        return data.translatedText;
      }
    } catch (error) {
      console.warn('LibreTranslate failed:', error);
    }
    return null;
  }

  // Google Translate (free tier, limited requests)
  private async translateWithGoogle(text: string): Promise<string | null> {
    try {
      const url = `${this.fallbackUrl}?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Google Translate returns an array structure
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          return data[0][0][0];
        }
      }
    } catch (error) {
      console.warn('Google Translate failed:', error);
    }
    return null;
  }

  // Batch translate multiple texts
  async translateBatch(texts: string[]): Promise<string[]> {
    const translations: string[] = [];
    
    for (const text of texts) {
      try {
        const translation = await this.translateToSpanish(text);
        translations.push(translation);
        
        // Add a small delay to avoid overwhelming the translation service
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to translate: ${text}`, error);
        translations.push(text); // Fallback to original text
      }
    }
    
    return translations;
  }

  // Cache translations in localStorage to avoid repeated API calls
  private getCachedTranslationFromStorage(key: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(`translation_${key}`);
      if (cached) {
        const { text, timestamp } = JSON.parse(cached);
        // Cache expires after 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return text;
        }
      }
    } catch (error) {
      console.warn('Failed to read translation cache:', error);
    }
    return null;
  }

  private setCachedTranslation(key: string, text: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        text,
        timestamp: Date.now()
      };
      localStorage.setItem(`translation_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache translation:', error);
    }
  }

  // Get translation with caching
  async getCachedTranslation(text: string): Promise<string> {
    const cacheKey = text.toLowerCase().trim();
    const cached = this.getCachedTranslationFromStorage(cacheKey);
    
    if (cached) {
      return cached;
    }

    const translation = await this.translateToSpanish(text);
    this.setCachedTranslation(cacheKey, translation);
    return translation;
  }

  // Get Spanish TTS voice
  getSpanishVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a Spanish voice
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') || 
      voice.name.toLowerCase().includes('spanish') ||
      voice.name.toLowerCase().includes('español')
    );

    // Fallback to any available voice if no Spanish voice found
    return spanishVoice || voices[0] || null;
  }
}

// Export singleton instance
export const translationService = new TranslationService();

// Export the class for testing
export { TranslationService }; 