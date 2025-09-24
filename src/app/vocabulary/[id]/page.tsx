'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useVocabularyList } from '@/hooks/use-vocabulary';
import { PromovaVocabularyDetail } from '@/components/learning/promova-vocabulary-detail';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  ArrowLeft,
  Volume2,
  BookText,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { audioPronunciation } from '@/lib/audio-pronunciation';

interface VocabularyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VocabularyDetailPage({ params }: VocabularyDetailPageProps) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const { data: vocabularyList, isLoading, error } = useVocabularyList(resolvedParams.id);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isRepeating, setIsRepeating] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const isPlayingAllRef = useRef<boolean>(false);

  // Handle audio pronunciation
  const handlePlayPronunciation = async (text: string) => {
    try {
      setIsPlaying(text);
      await audioPronunciation.playPronunciation(text, 'en', {
        speed: 0.8,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    } finally {
      setIsPlaying(null);
    }
  };

  // Handle playing word and definition in sequence
  const handlePlayWordAndDefinition = async (word: string, definition: string) => {
    try {
      setIsPlaying(`${word}-definition`);
      const fullText = `Word: ${word}. Description: ${definition}`;
      await audioPronunciation.playPronunciation(fullText, 'en', {
        speed: 0.7, // Slightly slower for longer text
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.error('Error playing word and definition:', error);
    } finally {
      setIsPlaying(null);
    }
  };

    // Handle infinite replay of word and definition
  const handleInfiniteReplay = async (word: string, definition: string) => {
    if (isRepeating === `${word}-replay`) {
      // Stop repeating
      setIsRepeating(null);
      audioPronunciation.stopCurrentAudio();
      return;
    }

    setIsRepeating(`${word}-replay`);
    
    const playLoop = async () => {
      if (isRepeating !== `${word}-replay`) return; // Stop if replay was cancelled
      
      try {
        const fullText = `Word: ${word}. Description: ${definition}`;
        await audioPronunciation.playPronunciation(fullText, 'en', {
          speed: 0.7,
          pitch: 1.0,
          volume: 0.8
        });
        
        // If still repeating, continue the loop
        if (isRepeating === `${word}-replay`) {
          setTimeout(playLoop, 1000); // 1 second delay between repeats
        }
      } catch (error) {
        console.error('Error in replay loop:', error);
        setIsRepeating(null);
      }
    };
    
    playLoop();
  };

  // Handle playing all words and descriptions in sequence
  const handlePlayAllWords = async () => {
    console.log('Play All button clicked!'); // Debug log
    console.log('Current state:', { isPlayingAll, currentPlayingIndex }); // Debug log
    console.log('Vocabulary list:', vocabularyList); // Debug log
    console.log('Words available:', vocabularyList?.words?.length); // Debug log
    
    if (isPlayingAll) {
      console.log('Stopping play all...'); // Debug log
      // Stop playing all
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      setCurrentPlayingIndex(0);
      audioPronunciation.stopCurrentAudio();
      return;
    }

    if (!vocabularyList?.words || vocabularyList.words.length === 0) {
      console.log('No words available, returning early'); // Debug log
      return;
    }

    setIsPlayingAll(true);
    isPlayingAllRef.current = true;
    setCurrentPlayingIndex(0);
    
    const playNextWord = async (index: number) => {
      console.log(`playNextWord called with index: ${index}`); // Debug log
      console.log(`isPlayingAll state: ${isPlayingAll}, ref: ${isPlayingAllRef.current}, words length: ${vocabularyList.words.length}`); // Debug log
      
      if (!isPlayingAllRef.current || index >= vocabularyList.words.length) {
        console.log(`Stopping play all - index: ${index}, isPlayingAll state: ${isPlayingAll}, ref: ${isPlayingAllRef.current}`); // Debug log
        setIsPlayingAll(false);
        isPlayingAllRef.current = false;
        setCurrentPlayingIndex(0);
        return;
      }

      const word = vocabularyList.words[index];
      console.log(`Playing word ${index + 1}/${vocabularyList.words.length}: ${word.word}`); // Debug log
      setCurrentPlayingIndex(index);
      
      try {
        const fullText = `Word: ${word.word}. Description: ${word.definition}`;
        console.log(`Attempting to play: ${fullText}`); // Debug log
        
        await audioPronunciation.playPronunciation(fullText, 'en', {
          speed: 0.7,
          pitch: 1.0,
          volume: 0.8
        });
        
        console.log(`Successfully played word ${index + 1}, waiting 2 seconds...`); // Debug log
        
        // Wait 2 seconds before playing the next word
        setTimeout(() => {
          console.log(`Timeout finished, checking if still playing all...`); // Debug log
          if (isPlayingAllRef.current) {
            console.log(`Continuing to next word...`); // Debug log
            playNextWord(index + 1);
          } else {
            console.log(`Play all was stopped, not continuing`); // Debug log
          }
        }, 2000);
      } catch (error) {
        console.error('Error playing word:', error);
        // Continue to next word even if there's an error
        setTimeout(() => {
          if (isPlayingAllRef.current) {
            playNextWord(index + 1);
          }
        }, 2000);
      }
    };
    
    playNextWord(0);
  };



  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      audioPronunciation.stopCurrentAudio();
      setIsRepeating(null);
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
    };
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" disabled>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !vocabularyList) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">Error loading vocabulary list</div>
          <Button asChild>
            <Link href="/vocabulary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vocabulary Lists
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Check if this is a Promova list
  if (resolvedParams.id.startsWith('promova-')) {
    return (
      <MainLayout>
        <PromovaVocabularyDetail
          list={{
            id: vocabularyList.id,
            title: vocabularyList.title,
            description: vocabularyList.description,
            difficulty: vocabularyList.difficulty,
            wordCount: vocabularyList.wordCount,
            estimatedTime: vocabularyList.estimatedTime,
            tags: vocabularyList.tags,
            category: vocabularyList.category,
          }}
          words={vocabularyList.words}
        />
      </MainLayout>
    );
  }

  // Regular vocabulary list display
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/vocabulary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lists
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{vocabularyList.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {vocabularyList.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href={`/vocabulary/${vocabularyList.id}/practice`}>
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vocabulary">
                <BookOpen className="w-4 h-4 mr-2" />
                View All Lists
              </Link>
            </Button>
          </div>
        </div>

        {/* Play All Button */}
        <div className="flex flex-col items-center mb-6 space-y-4">
          <Button
            onClick={handlePlayAllWords}
            disabled={!vocabularyList?.words || vocabularyList.words.length === 0}
            className={`px-8 py-3 text-lg font-semibold ${
              isPlayingAll 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
            size="lg"
          >
            {isPlayingAll ? (
              <>
                <VolumeX className="w-6 h-6 mr-3 animate-pulse" />
                Stop Playing All ({currentPlayingIndex + 1}/{vocabularyList?.words?.length || 0})
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-3" />
                Play All Words & Descriptions
              </>
            )}
          </Button>
          
          {/* Debug Info */}
          <div className="text-xs text-muted-foreground">
            Debug: Words available: {vocabularyList?.words ? vocabularyList.words.length : 'undefined'}
          </div>
          
          {/* Fallback Button - Always Visible */}
          <Button
            onClick={() => console.log('Fallback button clicked - vocabularyList:', vocabularyList)}
            variant="outline"
            size="sm"
          >
            Debug: Check Console
          </Button>
          
          {/* Test Audio Button */}
          <Button
            onClick={async () => {
              console.log('Testing basic audio...');
              try {
                await audioPronunciation.playPronunciation('Test audio', 'en', {
                  speed: 1.0,
                  pitch: 1.0,
                  volume: 0.8
                });
                console.log('Basic audio test successful');
              } catch (error) {
                console.error('Basic audio test failed:', error);
              }
            }}
            variant="outline"
            size="sm"
            className="bg-green-100 hover:bg-green-200"
          >
            Test Basic Audio
          </Button>
          
          {/* Progress Indicator */}
          {isPlayingAll && vocabularyList?.words && (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{currentPlayingIndex + 1} / {vocabularyList.words.length}</span>
              </div>
              <Progress 
                value={((currentPlayingIndex + 1) / vocabularyList.words.length) * 100} 
                className="h-2"
              />
              {vocabularyList.words[currentPlayingIndex] && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Currently playing: <span className="font-medium">{vocabularyList.words[currentPlayingIndex].word}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Words</p>
                  <p className="text-2xl font-bold">{vocabularyList.wordCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Est. Time</p>
                  <p className="text-2xl font-bold">{vocabularyList.estimatedTime}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Difficulty</p>
                  <Badge className="text-xs capitalize">
                    {vocabularyList.difficulty}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm font-medium capitalize">{vocabularyList.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Words Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Words in this list</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vocabularyList.words.map((word, index) => (
              <Card 
                key={word.id} 
                className={`hover:shadow-md transition-all duration-200 ${
                  isPlayingAll && currentPlayingIndex === index 
                    ? 'ring-2 ring-purple-500 shadow-lg scale-105' 
                    : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{word.word}</CardTitle>
                        {isPlayingAll && currentPlayingIndex === index && (
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {word.partOfSpeech}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {word.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Definition:</p>
                    <p className="text-sm leading-relaxed">{word.definition}</p>
                  </div>
                  
                  {word.translation && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Translation:</p>
                      <p className="text-sm font-medium">{word.translation}</p>
                    </div>
                  )}
                  
                  {word.example && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Example:</p>
                      <p className="text-sm italic text-muted-foreground">&quot;{word.example}&quot;</p>
                    </div>
                  )}
                  
                  {word.synonyms && word.synonyms.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Synonyms:</p>
                      <div className="flex flex-wrap gap-1">
                        {word.synonyms.map((synonym, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {synonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePlayPronunciation(word.word)}
                      disabled={isPlaying === word.word}
                    >
                      {isPlaying === word.word ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Listen
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePlayPronunciation(word.definition)}
                      disabled={isPlaying === word.definition}
                    >
                      {isPlaying === word.definition ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Definition
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePlayWordAndDefinition(word.word, word.definition)}
                      disabled={isPlaying === `${word.word}-definition`}
                      title="Listen to word and description together"
                    >
                      {isPlaying === `${word.word}-definition` ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Word + Desc
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleInfiniteReplay(word.word, word.definition)}
                      title="Loop word and description infinitely"
                    >
                      {isRepeating === `${word.word}-replay` ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                          Stop Loop
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 mr-2">🔄</div>
                          Infinite Loop
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Study
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 