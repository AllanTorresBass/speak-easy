'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  Star,
  TrendingUp,
  BookMarked,
  Lightbulb,
  Search,
  Filter,
  BookText,
  Eye,
  Volume2,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';
import { VocabularyWord } from '@/types';
import { audioPronunciation } from '@/lib/audio-pronunciation';
import { WordDetailDialog } from './word-detail-dialog';

interface PromovaVocabularyDetailProps {
  list: {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    wordCount: number;
    estimatedTime: number;
    tags: string[];
    category: string;
  };
  words: VocabularyWord[];
}

export function PromovaVocabularyDetail({ list, words }: PromovaVocabularyDetailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('word');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isRepeating, setIsRepeating] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.7);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRepeatingRef = useRef<string | null>(null);

  // Handle audio pronunciation
  const handlePlayPronunciation = async (text: string) => {
    console.log('Playing pronunciation:', text); // Debug log
    try {
      setIsPlaying(text);
      await audioPronunciation.playPronunciation(text, 'en', {
        speed: audioSpeed,
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
    console.log('Playing word and definition:', word, definition); // Debug log
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
      console.log('Stopping infinite replay for:', isRepeatingRef.current); // Debug log
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

  // Filter and sort words
  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPartOfSpeech = partOfSpeechFilter === 'all' || word.partOfSpeech === partOfSpeechFilter;
    
    return matchesSearch && matchesPartOfSpeech;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'word':
        return a.word.localeCompare(b.word);
      case 'difficulty':
        return a.difficulty.localeCompare(b.difficulty);
      case 'partOfSpeech':
        return a.partOfSpeech.localeCompare(b.partOfSpeech);
      default:
        return a.word.localeCompare(b.word);
    }
  });

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

  // Get part of speech color
  const getPartOfSpeechColor = (partOfSpeech: string) => {
    switch (partOfSpeech.toLowerCase()) {
      case 'noun':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'verb':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'adjective':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'adverb':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="h-6 w-6 text-blue-600" />
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">
              Promova
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{list.title}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {list.description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href={`/vocabulary/${list.id}/practice`}>
              <Play className="w-4 h-4 mr-2" />
              Start Practice
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/vocabulary">
              <BookOpen className="w-4 h-4 mr-2" />
              Back to Lists
            </Link>
          </Button>
        </div>
      </div>

      {/* Speed Controls */}
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Speed Label */}
          <div className="flex items-center gap-2 min-w-fit">
            <Volume2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Audio Speed:</span>
          </div>
          
          {/* Speed Buttons */}
          <div className="flex flex-wrap gap-2 flex-1">
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
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[3rem] sm:min-w-[3.5rem]"
            >
              1.5x
            </Button>
          </div>
          
          {/* Current Speed Display */}
          <div className="text-sm text-muted-foreground text-center lg:text-left min-w-fit">
            Current: <span className="font-medium">{audioSpeed}x</span>
          </div>
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
                <p className="text-2xl font-bold">{list.wordCount}</p>
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
                <p className="text-2xl font-bold">{list.estimatedTime}m</p>
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
                <Badge className={`${getDifficultyColor(list.difficulty)} text-xs`}>
                  {list.difficulty}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm font-medium capitalize">{list.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search words or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={partOfSpeechFilter} onValueChange={setPartOfSpeechFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Part of Speech" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="noun">Nouns</SelectItem>
            <SelectItem value="verb">Verbs</SelectItem>
            <SelectItem value="adjective">Adjectives</SelectItem>
            <SelectItem value="adverb">Adverbs</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="word">Word</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="partOfSpeech">Part of Speech</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredWords.length} of {words.length} words
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWords.map((word) => (
          <Card key={word.id} className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
            <CardHeader className="pb-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <WordDetailDialog word={word} audioSpeed={audioSpeed}>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer hover:underline">
                      {word.word}
                    </CardTitle>
                  </WordDetailDialog>
                  <div className="flex gap-2">
                    <Badge className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                      {word.partOfSpeech}
                    </Badge>
                    <Badge className="text-xs font-semibold px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-700">
                      {word.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Definition</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                  {word.definition}
                </p>
              </div>
              
              {word.translation && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Translation</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 pl-4 border-l-2 border-green-200 dark:border-green-700">
                    {word.translation}
                  </p>
                </div>
              )}
              
              {word.example && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Example</p>
                  </div>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-200 dark:border-purple-700">
                    "{word.example}"
                  </p>
                </div>
              )}
              
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Synonyms</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {word.synonyms.map((synonym, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700"
                      >
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 dark:hover:text-blue-200 transition-all duration-200"
                      onClick={() => handlePlayPronunciation(word.word)}
                      disabled={isPlaying === word.word}
                      title="Listen to word pronunciation"
                    >
                      {isPlaying === word.word ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Word
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-700 dark:text-green-300 dark:hover:text-green-200 transition-all duration-200"
                      onClick={() => handlePlayPronunciation(word.definition)}
                      disabled={isPlaying === word.definition}
                      title="Listen to word definition"
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
                      className="h-10 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300 dark:hover:text-purple-200 transition-all duration-200 col-span-2"
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
                          Word + Description
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 hover:text-indigo-800 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition-all duration-200 col-span-2"
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-10 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 dark:hover:text-blue-200 transition-all duration-200 col-span-2"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </WordDetailDialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300 dark:hover:text-orange-200 transition-all duration-200"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Study Word
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No words found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setPartOfSpeechFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 