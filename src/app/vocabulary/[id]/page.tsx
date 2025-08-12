'use client';

import { useState, useEffect } from 'react';
import { useVocabularyList } from '@/hooks/use-vocabulary';
import { PromovaVocabularyDetail } from '@/components/learning/promova-vocabulary-detail';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  params: {
    id: string;
  };
}

export default function VocabularyDetailPage({ params }: VocabularyDetailPageProps) {
  const { data: session } = useSession();
  const { data: vocabularyList, isLoading, error } = useVocabularyList(params.id);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isRepeating, setIsRepeating] = useState<string | null>(null);

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



  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      audioPronunciation.stopCurrentAudio();
      setIsRepeating(null);
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
  if (params.id.startsWith('promova-')) {
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
            {vocabularyList.words.map((word) => (
              <Card key={word.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{word.word}</CardTitle>
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
                      <p className="text-sm italic text-muted-foreground">"{word.example}"</p>
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