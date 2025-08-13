'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  Volume2, 
  BookMarked,
  Star,
  TrendingUp,
  Lightbulb,
  ArrowLeft,
  Target,
  VolumeX
} from 'lucide-react';
import { searchPromovaVocabulary } from '@/lib/promova-data';
import { VocabularyWord } from '@/types';
import { audioPronunciation } from '@/lib/audio-pronunciation';
import { WordDetailDialog } from './word-detail-dialog';

export function PromovaSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<VocabularyWord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isRepeating, setIsRepeating] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.7);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRepeatingRef = useRef<string | null>(null);

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
    console.log('Infinite replay triggered for:', word); // Debug log
    console.log('Current isRepeatingRef:', isRepeatingRef.current); // Debug log
    console.log('Current isRepeating state:', isRepeating); // Debug log
    
    // If any loop is currently running, stop it
    if (isRepeatingRef.current !== null) {
      console.log('Stopping infinite replay for:', word); // Debug log
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
      console.log('Clearing existing interval:', intervalRef.current); // Debug log
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

        // Set state and ref to prevent multiple clicks
    setIsRepeating(`${word}-replay`);
    isRepeatingRef.current = `${word}-replay`;
    console.log('Starting infinite replay for:', word); // Debug log
    
    // Create a more reliable loop using setInterval
    const newIntervalId = setInterval(async () => {
      console.log('Interval callback executing for:', word, 'with ID:', newIntervalId); // Debug log
      
      if (isRepeatingRef.current !== `${word}-replay`) {
        console.log('Stopping interval - state changed for:', word); // Debug log
        clearInterval(newIntervalId);
        return;
      }
      
      try {
        const fullText = `Word: ${word}. Description: ${definition}`;
        console.log('Playing in loop:', fullText); // Debug log
        
        // Let previous audio finish naturally, don't interrupt it
        await audioPronunciation.playPronunciation(fullText, 'en', {
          speed: audioSpeed,
          pitch: 1.0,
          volume: 0.8,
          isInfiniteLoop: true
        });
        
        console.log('Finished playing in loop for:', word); // Debug log
        
        // 1 second delay before next repetition
        console.log('Waiting 1 second before next repetition...'); // Debug log
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Delay finished, ready for next repetition'); // Debug log
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
        console.log('Starting first audio after 2 second delay...'); // Debug log
        try {
          const fullText = `Word: ${word}. Description: ${definition}`;
          console.log('Playing first audio:', fullText); // Debug log
          
          await audioPronunciation.playPronunciation(fullText, 'en', {
            speed: audioSpeed,
            pitch: 1.0,
            volume: 0.8,
            isInfiniteLoop: true
        });
          
          console.log('First audio finished'); // Debug log
        } catch (error) {
          console.error('Error playing first audio:', error);
        }
      }
    }, 2000);
    
    // Store the interval ID for cleanup
    intervalRef.current = newIntervalId;
    console.log('Interval set with ID:', newIntervalId, 'for word:', word); // Debug log
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      audioPronunciation.stopCurrentAudio();
      setIsRepeating(null);
      isRepeatingRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = await searchPromovaVocabulary(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Star className="h-4 w-4 text-green-600" />;
      case 'intermediate':
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'advanced':
        return <Lightbulb className="h-4 w-4 text-red-600" />;
      default:
        return <BookMarked className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/vocabulary">
            <BookOpen className="w-4 h-4 mr-2" />
            All Vocabulary
          </Link>
        </Button>
      </div>

      {/* Search Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookMarked className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Promova Vocabulary Search</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Search across all 24 Promova vocabulary lists to find specific words, phrases, or concepts
        </p>
      </div>

      {/* Speed Controls */}
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg border p-4 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Speed Label */}
          <div className="flex items-center justify-center sm:justify-start gap-2 min-w-fit">
            <Volume2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Audio Speed:</span>
          </div>
          
          {/* Speed Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 flex-1">
            <Button
              variant={audioSpeed === 0.5 ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioSpeed(0.5)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[3rem] sm:min-w-[3.5rem]"
            >
              0.5x
            </Button>
            <Button
              variant={audioSpeed === 0.7 ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioSpeed(0.7)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[3rem] sm:min-w-[3.5rem]"
            >
              0.7x
            </Button>
            <Button
              variant={audioSpeed === 1.0 ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioSpeed(1.0)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[3rem] sm:min-w-[3.5rem]"
            >
              1.0x
            </Button>
            <Button
              variant={audioSpeed === 1.3 ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioSpeed(1.3)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[3rem] sm:min-w-[3.5rem]"
            >
              1.3x
            </Button>
            <Button
              variant={audioSpeed === 1.5 ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioSpeed(1.5)}
              className="h-8 px-3 text-xs sm:text-sm min-w-[3rem] sm:min-w-[3.5rem]"
            >
              1.5x
            </Button>
          </div>
          
          {/* Current Speed Display */}
          <div className="text-sm text-muted-foreground text-center sm:text-left min-w-fit">
            Current: <span className="font-medium">{audioSpeed}x</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for words, phrases, or concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-24 h-12 text-lg"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {isSearching 
                ? 'Searching...' 
                : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
              }
            </h2>
            {searchResults.length > 0 && (
              <p className="text-muted-foreground">
                Showing results from {new Set(searchResults.map(w => w.listId)).size} vocabulary lists
              </p>
            )}
          </div>

          {!isSearching && searchResults.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try different keywords or check your spelling
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.map((word) => (
                <Card key={word.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getDifficultyIcon(word.difficulty)}
                          <WordDetailDialog word={word} audioSpeed={audioSpeed}>
                            <CardTitle className="text-lg cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">
                              {word.word}
                            </CardTitle>
                          </WordDetailDialog>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {word.partOfSpeech}
                          </Badge>
                          <Badge className={`${getDifficultyColor(word.difficulty)} text-xs`}>
                            {word.difficulty}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">
                          <BookMarked className="h-3 w-3 mr-1" />
                          List {word.listId.replace('promova-', '')}
                        </Badge>
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
                                          onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleInfiniteReplay(word.word, word.definition);
                      }}
                      disabled={false}
                      title="Loop word and description infinitely"
                    >
                    {isRepeatingRef.current === `${word.word}-replay` ? (
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
                  <WordDetailDialog word={word} audioSpeed={audioSpeed}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </WordDetailDialog>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`/vocabulary/${word.listId}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      View List
                    </a>
                  </Button>
                </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {!hasSearched && (
        <div className="text-center py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <BookMarked className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">23 Lists</h3>
                <p className="text-muted-foreground">Comprehensive vocabulary coverage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">3 Levels</h3>
                <p className="text-muted-foreground">Beginner to advanced difficulty</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">1000+ Words</h3>
                <p className="text-muted-foreground">Essential English vocabulary</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="text-center py-8 border-t">
        <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/vocabulary">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse All Lists
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/practice">
              <Target className="w-4 h-4 mr-2" />
              Start Practice
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Progress
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 