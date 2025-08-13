'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Loader2 } from 'lucide-react';

export function TranslationTest() {
  const [text, setText] = useState('hello');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    try {
      const { getComprehensiveTranslation } = await import('@/lib/comprehensive-promova-translations');
      const result = getComprehensiveTranslation(text);
      setTranslation(result || 'Translation not available');
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslation('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translation Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">English Text:</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter English text to translate"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating || !text.trim()}
            className="w-full"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4 mr-2" />
                Translate
              </>
            )}
          </Button>
          
          <Button 
            onClick={async () => {
              if (!translation) return;
              
              // Try to use Spanish TTS
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                const voices = window.speechSynthesis.getVoices();
                const spanishVoice = voices.find(voice => 
                  voice.lang.startsWith('es') || 
                  voice.name.toLowerCase().includes('spanish') ||
                  voice.name.toLowerCase().includes('español')
                );
                
                const utterance = new SpeechSynthesisUtterance(translation);
                utterance.voice = spanishVoice || voices[0];
                utterance.rate = 0.8;
                utterance.pitch = 1.0;
                utterance.volume = 0.8;
                utterance.lang = spanishVoice?.lang || 'es-ES';
                
                window.speechSynthesis.speak(utterance);
              }
            }}
            disabled={!translation}
            variant="outline"
            className="w-full"
          >
            🔊 Play Spanish
          </Button>
        </div>
        
        {translation && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Spanish Translation:</label>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-300">{translation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 