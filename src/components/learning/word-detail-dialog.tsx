'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, VolumeX, Play, BookOpen, Languages, Mic } from 'lucide-react';
import { VocabularyWord } from '@/types';
import { audioPronunciation } from '@/lib/audio-pronunciation';

interface WordDetailDialogProps {
  word: VocabularyWord;
  audioSpeed: number;
  children: React.ReactNode;
}

export function WordDetailDialog({ word, audioSpeed, children }: WordDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [isPlayingDefinition, setIsPlayingDefinition] = useState(false);
  const [isPlayingTranslation, setIsPlayingTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const handlePlayWord = async () => {
    try {
      setIsPlayingWord(true);
      await audioPronunciation.playPronunciation(word.word, 'en', {
        speed: audioSpeed,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.error('Error playing word:', error);
    } finally {
      setIsPlayingWord(false);
    }
  };

  const handlePlayDefinition = async () => {
    try {
      setIsPlayingDefinition(true);
      await audioPronunciation.playPronunciation(word.definition, 'en', {
        speed: audioSpeed,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.error('Error playing definition:', error);
    } finally {
      setIsPlayingDefinition(false);
    }
  };

  const handlePlayTranslation = async () => {
    try {
      setIsPlayingTranslation(true);
      const textToPlay = translatedText || word.translation;
      
      if (!textToPlay) {
        console.warn('No translation available to play');
        return;
      }

      // Try to use Spanish TTS for Spanish text
      if (typeof window !== 'undefined' && window.speechSynthesis && selectedVoice) {
        // Use selected voice (preferably Spanish)
        const utterance = new SpeechSynthesisUtterance(textToPlay);
        utterance.voice = selectedVoice;
        utterance.rate = audioSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        utterance.lang = selectedVoice.lang || 'es-ES';
        
        utterance.onend = () => setIsPlayingTranslation(false);
        utterance.onerror = () => setIsPlayingTranslation(false);
        
        window.speechSynthesis.speak(utterance);
        return;
      }

      // Fallback to English TTS if no Spanish voice available
      await audioPronunciation.playPronunciation(textToPlay, 'en', {
        speed: audioSpeed * 0.8,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.error('Error playing translation:', error);
    } finally {
      setIsPlayingTranslation(false);
    }
  };

  // Handle translation when dialog opens
  const handleDialogOpen = async (open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      // Load available voices
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Wait for voices to load if they're not immediately available
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            setAvailableVoices(voices);
            
            // Auto-select Spanish voice if available
            const spanishVoice = voices.find(voice => 
              voice.lang.startsWith('es') || 
              voice.name.toLowerCase().includes('spanish') ||
              voice.name.toLowerCase().includes('español')
            );
            setSelectedVoice(spanishVoice || voices[0] || null);
          } else {
            // If voices aren't loaded yet, wait a bit and try again
            setTimeout(loadVoices, 100);
          }
        };
        
        loadVoices();
      }
      
      // Load translation if needed
      if (!word.translation && !translatedText) {
        setIsTranslating(true);
        try {
          // Import comprehensive translation system
          const { getComprehensiveTranslation } = await import('@/lib/comprehensive-promova-translations');
          const translation = getComprehensiveTranslation(word.word);
          setTranslatedText(translation || 'Translation not available');
        } catch (error) {
          console.error('Translation failed:', error);
          setTranslatedText('Translation not available');
        } finally {
          setIsTranslating(false);
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {word.word}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Word Info Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">
                {word.partOfSpeech}
              </Badge>
              <Badge className={`${
                word.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                word.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {word.difficulty}
              </Badge>
            </div>
          </div>

          {/* Audio Controls */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-300">Audio Pronunciation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayWord}
                  disabled={isPlayingWord}
                  className="h-12 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 dark:bg-gray-800 dark:hover:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  {isPlayingWord ? (
                    <>
                      <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Word
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayDefinition}
                  disabled={isPlayingDefinition}
                  className="h-12 bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 dark:bg-gray-800 dark:hover:bg-green-900/30 dark:border-green-700 dark:text-green-300 dark:hover:text-green-200"
                >
                  {isPlayingDefinition ? (
                    <>
                      <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Definition
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayTranslation}
                  disabled={isPlayingTranslation || isTranslating}
                  className="h-12 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 dark:bg-gray-800 dark:hover:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
                >
                  {isPlayingTranslation ? (
                    <>
                      <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                      Playing...
                    </>
                  ) : isTranslating ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="w-4 h-4 mr-2" />
                      Spanish
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* English Definition */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">English Definition</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {word.definition}
              </p>
            </CardContent>
          </Card>

          {/* Spanish Translation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800 dark:text-green-300">Spanish Translation</h3>
              </div>
              {isTranslating ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                  Translating...
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {translatedText || word.translation || 'Translation not available'}
                  </p>
                  
                  {/* Voice Selector */}
                  {availableVoices.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Voice for Spanish Pronunciation:
                      </label>
                      <select
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                          const voice = availableVoices.find(v => v.name === e.target.value);
                          setSelectedVoice(voice || null);
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {availableVoices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang}) {voice.lang.startsWith('es') ? '🇪🇸' : ''}
                          </option>
                        ))}
                      </select>
                      {selectedVoice && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Selected: {selectedVoice.name} ({selectedVoice.lang})
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!translatedText && !word.translation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        setIsTranslating(true);
                        try {
                          const { getComprehensiveTranslation } = await import('@/lib/comprehensive-promova-translations');
                          const translation = getComprehensiveTranslation(word.word);
                          setTranslatedText(translation || 'Translation not available');
                        } catch (error) {
                          console.error('Translation failed:', error);
                          setTranslatedText('Translation failed');
                        } finally {
                          setIsTranslating(false);
                        }
                      }}
                      className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-700 dark:text-green-300 dark:hover:text-green-200"
                    >
                      <Languages className="w-4 h-4 mr-2" />
                      Translate to Spanish
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Example Sentence */}
          {word.example && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">Example Sentence</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{word.example}"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Synonyms */}
          {word.synonyms && word.synonyms.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-orange-800 dark:text-orange-300">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800">
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pronunciation Guide */}
          {word.pronunciation && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-indigo-800 dark:text-indigo-300">Pronunciation Guide</h3>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-lg">
                  /{word.pronunciation}/
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 