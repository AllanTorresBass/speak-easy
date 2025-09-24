'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Volume2, Settings, Info } from 'lucide-react';
import { loadWordsVocabularyList } from '@/lib/words-data';
import { audioPronunciation } from '@/lib/audio-pronunciation';
import { MainLayout } from '@/components/layout/main-layout';
import { WordsVocabularyList } from '@/lib/words-data';

interface PageProps {
  params: Promise<{ listId: string }>;
}

export default function WordsVocabularyDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  console.log('Raw params:', resolvedParams);
  const listId = resolvedParams.listId.replace('words-', '');
  console.log('Extracted listId:', listId);
  
  const [vocabularyList, setVocabularyList] = useState<WordsVocabularyList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const isPlayingAllRef = useRef(false);
  const isStartingPlayAllRef = useRef(false);
  const audioQueueRef = useRef(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        setLoading(true);
        console.log('Loading vocabulary list:', listId);
        const list = await loadWordsVocabularyList(parseInt(listId));
        console.log('Loaded vocabulary list:', list);
        if (list) {
          setVocabularyList(list);
        } else {
          setError('Vocabulary list not found');
        }
      } catch (err) {
        setError('Failed to load vocabulary list');
        console.error('Error loading vocabulary:', err);
      } finally {
        setLoading(false);
      }
    };

    if (listId) {
      loadVocabulary();
    }
  }, [listId]);

  const handlePlayAllWords = async () => {
    if (isPlayingAll) {
      // Stop playing all
      setIsPlayingAll(false);
      setCurrentPlayingIndex(-1);
      isPlayingAllRef.current = false;
      isStartingPlayAllRef.current = false;
      audioQueueRef.current = false;
      audioPronunciation.stopCurrentAudio();
      return;
    }

    if (!vocabularyList?.concepts) return;

    console.log('Starting Play All sequence...');
    console.log('Words available:', vocabularyList.concepts.length);
    
    setIsPlayingAll(true);
    setCurrentPlayingIndex(0);
    isPlayingAllRef.current = true;
    isStartingPlayAllRef.current = true;

    // Initial delay to ensure speech synthesis is ready
    console.log('Waiting for speech synthesis to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!isPlayingAllRef.current) return;

    // Ensure speech synthesis is not busy
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        console.log('Speech synthesis busy, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    await playNextWord(0);
  };

  const playNextWord = async (index: number) => {
    if (!isPlayingAllRef.current || !vocabularyList?.concepts) return;

    if (index >= vocabularyList.concepts.length) {
      // Finished playing all words
      console.log('Finished playing all words');
      setIsPlayingAll(false);
      setCurrentPlayingIndex(-1);
      isPlayingAllRef.current = false;
      isStartingPlayAllRef.current = false;
      audioQueueRef.current = false;
      return;
    }

    setCurrentPlayingIndex(index);
    const word = vocabularyList.concepts[index];
    const fullText = `Word: ${word.word}. Description: ${word.translated}`;

    console.log(`Playing word ${index + 1}/${vocabularyList.concepts.length}: ${word.word}`);

    try {
      // Check if we should still be playing
      if (!isPlayingAllRef.current) return;

      // Wait for any current speech to finish
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        while (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          console.log('Waiting for speech to finish...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Play the audio with proper waiting - Word in English, Description in Spanish
      console.log(`Playing word: ${word.word}`);
      
      try {
        // Play word in English and wait for it to complete
        await audioPronunciation.playPronunciation(word.word, 'en', { 
          speed: audioSpeed,
          pitch: 1.0,
          volume: 0.8
        });
        
        // Wait for speech synthesis to finish
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          while (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            console.log('Waiting for word audio to finish...');
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Wait a moment between word and description
        console.log('Waiting 500ms between word and description...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(`Playing description: ${word.translated}`);
        
        // Play description in Spanish and wait for it to complete
        await audioPronunciation.playPronunciation(word.translated, 'es', { 
          speed: audioSpeed,
          pitch: 1.0,
          volume: 0.8
        });
        
        // Wait for speech synthesis to finish
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          while (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            console.log('Waiting for description audio to finish...');
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        console.log(`Successfully played word and description for: ${word.word}`);
        
      } catch (error) {
        console.error(`Error playing audio for ${word.word}:`, error);
        // Continue to next word even if there's an error
      }
      
      // Additional delay between words
      const delay = 1000; // 1 second between words
      console.log(`Waiting ${delay}ms before next word...`);
      
      setTimeout(() => {
        if (isPlayingAllRef.current) {
          playNextWord(index + 1);
        }
      }, delay);

    } catch (error) {
      console.error('Error playing audio:', error);
      
      // Wait a bit longer before continuing to next word if there's an error
      setTimeout(() => {
        if (isPlayingAllRef.current) {
          playNextWord(index + 1);
        }
      }, 2000);
    }
  };

  const stopPlayingAll = () => {
    isPlayingAllRef.current = false;
    setIsPlayingAll(false);
    setCurrentPlayingIndex(-1);
    isStartingPlayAllRef.current = false;
    audioQueueRef.current = false;
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    console.log('Stopped Play All sequence');
  };

  const [isRepeating, setIsRepeating] = useState<string | null>(null);
  const [isPlayingWord, setIsPlayingWord] = useState<string | null>(null);
  const isRepeatingRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio playback functions
  const handlePlayWord = async (word: string, description: string) => {
    try {
      console.log('Playing word:', word);
      setIsPlayingWord(word);
      
      // Play word in English and wait for it to complete
      await audioPronunciation.playPronunciation(word, 'en', { 
        speed: audioSpeed, 
        pitch: 1.0, 
        volume: 0.8 
      });
      
      // Wait for speech synthesis to finish
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        while (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          console.log('Waiting for word audio to finish...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Wait a moment between word and description
      console.log('Waiting 500ms between word and description...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Playing description:', description);
      
      // Play description in Spanish and wait for it to complete
      await audioPronunciation.playPronunciation(description, 'es', { 
        speed: audioSpeed, 
        pitch: 1.0, 
        volume: 0.8 
      });
      
      // Wait for speech synthesis to finish
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        while (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          console.log('Waiting for description audio to finish...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log('Finished playing word and description for:', word);
      
    } catch (error) {
      console.error('Error playing word and description:', error);
    } finally {
      setIsPlayingWord(null);
    }
  };

  const handlePlayWordOnly = async (word: string) => {
    try {
      await audioPronunciation.playPronunciation(word, 'en', { speed: audioSpeed, pitch: 1.0, volume: 0.8 });
    } catch (error) {
      console.error('Error playing word:', error);
    }
  };

  const handlePlayDescriptionOnly = async (description: string) => {
    try {
      await audioPronunciation.playPronunciation(description, 'es', { speed: audioSpeed, pitch: 1.0, volume: 0.8 });
    } catch (error) {
      console.error('Error playing description:', error);
    }
  };

  const handleLoopWord = async (word: string, description: string) => {
    console.log('Loop button clicked for:', word);
    console.log('Current isRepeatingRef:', isRepeatingRef.current);
    console.log('Current isRepeating state:', isRepeating);
    
    // If any loop is currently running, stop it
    if (isRepeatingRef.current !== null) {
      console.log('Stopping infinite replay for:', isRepeatingRef.current);
      setIsRepeating(null);
      isRepeatingRef.current = null;
      audioPronunciation.stopCurrentAudio();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval first
    if (intervalRef.current) {
      console.log('Clearing existing interval:', intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set state and ref to prevent multiple clicks
    setIsRepeating(`${word}-replay`);
    isRepeatingRef.current = `${word}-replay`;
    console.log('Starting infinite replay for:', word);
    
    // Create a more reliable loop using setInterval
    const newIntervalId = setInterval(async () => {
      console.log('Interval callback executing for:', word, 'with ID:', newIntervalId);
      
      if (isRepeatingRef.current !== `${word}-replay`) {
        console.log('Stopping interval - state changed for:', word);
        clearInterval(newIntervalId);
        return;
      }
      
        try {
          console.log('Playing in loop:', word, 'and', description);
          
          // Play word in English
          await audioPronunciation.playPronunciation(word, 'en', {
            speed: audioSpeed,
            pitch: 1.0,
            volume: 0.8,
            isInfiniteLoop: true
          });
          
          // Wait a moment between word and description
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Play description in Spanish
          await audioPronunciation.playPronunciation(description, 'es', {
            speed: audioSpeed,
            pitch: 1.0,
            volume: 0.8,
            isInfiniteLoop: true
          });
          
          console.log('Finished playing in loop for:', word);
          
          // 1 second delay before next repetition
          console.log('Waiting 1 second before next repetition...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Delay finished, ready for next repetition');
        } catch (error) {
          console.error('Error in replay loop:', error);
          setIsRepeating(null);
          isRepeatingRef.current = null;
          clearInterval(newIntervalId);
        }
    }, 5000); // 5 second total cycle: 4s for audio + 1s delay
    
    // Start the first audio after 2 seconds
    setTimeout(async () => {
      if (isRepeatingRef.current === `${word}-replay`) {
        console.log('Starting first audio after 2 second delay...');
        try {
          console.log('Playing first audio:', word, 'and', description);
          
          // Play word in English
          await audioPronunciation.playPronunciation(word, 'en', {
            speed: audioSpeed,
            pitch: 1.0,
            volume: 0.8,
            isInfiniteLoop: true
          });
          
          // Wait a moment between word and description
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Play description in Spanish
          await audioPronunciation.playPronunciation(description, 'es', {
            speed: audioSpeed,
            pitch: 1.0,
            volume: 0.8,
            isInfiniteLoop: true
          });
          
          console.log('First audio finished');
        } catch (error) {
          console.error('Error playing first audio:', error);
        }
      }
    }, 2000);
    
    // Store the interval ID for cleanup
    intervalRef.current = newIntervalId;
    console.log('Interval set with ID:', newIntervalId, 'for word:', word);
  };



  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingAllRef.current = false;
      isStartingPlayAllRef.current = false;
      if (audioQueueRef.current) {
        audioQueueRef.current = false;
      }
      // Cleanup loop intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isRepeatingRef.current = null;
    };
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading vocabulary list...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !vocabularyList) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error || 'Vocabulary list not found'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const progress = vocabularyList.concepts.length > 0 
    ? ((currentPlayingIndex + 1) / vocabularyList.concepts.length) * 100 
    : 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {vocabularyList.title}
          </h1>
          <p className="text-xl text-gray-600">
            {vocabularyList.concepts.length} words and phrases
          </p>
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-medium">
              🎯 Words Vocabulary List - Loading from JSON files
            </p>
          </div>
        </div>

        {/* Play All Controls */}
        <div className="flex flex-col items-center mb-6 space-y-4">
          <Button
            onClick={handlePlayAllWords}
            disabled={isStartingPlayAllRef.current}
            className={`px-8 py-3 text-lg font-semibold ${
              isPlayingAll 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            {isStartingPlayAllRef.current ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Starting...
              </>
            ) : isPlayingAll ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Stop Playing All
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Play All Words & Descriptions
              </>
            )}
          </Button>

          {/* Progress Indicator */}
          {isPlayingAll && (
            <div className="w-full max-w-md space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Word {currentPlayingIndex + 1} of {vocabularyList.concepts.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              {currentPlayingIndex >= 0 && vocabularyList.concepts[currentPlayingIndex] && (
                <p className="text-center font-medium text-blue-600">
                  Now playing: {vocabularyList.concepts[currentPlayingIndex].word}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Speed Controls */}
        <div className="flex justify-center mb-6 space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Speed:</label>
            <select
              value={audioSpeed}
              onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vocabularyList.concepts.map((item, index) => (
            <Card 
              key={index}
              className={`transition-all duration-200 ${
                currentPlayingIndex === index && isPlayingAll
                  ? 'ring-4 ring-blue-500 scale-105 shadow-2xl bg-blue-50'
                  : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {item.word}
                </CardTitle>
                {currentPlayingIndex === index && isPlayingAll && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-600 font-medium">Playing...</span>
                  </div>
                )}
                {isRepeating === `${item.word}-replay` && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-600 font-medium">Looping...</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">{item.translated}</p>
                
                {/* Audio Controls */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePlayWord(item.word, item.translated)}
                    disabled={isPlayingWord === item.word}
                    className={`${
                      isPlayingWord === item.word 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    <Volume2 className={`h-4 w-4 mr-1 ${isPlayingWord === item.word ? 'animate-pulse' : ''}`} />
                    {isPlayingWord === item.word ? 'Playing...' : 'All'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayWordOnly(item.word)}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Word
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayDescriptionOnly(item.translated)}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Desc
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={isRepeating === `${item.word}-replay` ? "destructive" : "outline"}
                    onClick={() => handleLoopWord(item.word, item.translated)}
                    className={isRepeating === `${item.word}-replay` ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                  >
                    <RotateCcw className={`h-4 w-4 mr-1 ${isRepeating === `${item.word}-replay` ? 'animate-spin' : ''}`} />
                    {isRepeating === `${item.word}-replay` ? 'Stop Loop' : 'Loop'}
                  </Button>
                </div>

                {/* Translation Toggle */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Info className="h-4 w-4 mr-1" />
                  {showTranslation ? 'Hide' : 'Show'} Translation
                </Button>
                
                {showTranslation && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Spanish:</strong> {item.translated}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Debug Section */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>List ID:</strong> {listId}
            </div>
            <div>
              <strong>Total Words:</strong> {vocabularyList.concepts.length}
            </div>
            <div>
              <strong>Playing State:</strong> {isPlayingAll ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Current Index:</strong> {currentPlayingIndex}
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 font-medium">Data Source: JSON files from /public/json/words/</p>
            <p className="text-blue-700 text-sm">File: vocabulary_list_{listId}.json</p>
            <p className="text-blue-700 text-sm">Words loaded: {vocabularyList.concepts.length}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 