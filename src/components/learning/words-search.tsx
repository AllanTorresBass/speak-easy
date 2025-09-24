'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Search, Volume2, RotateCcw, Info } from 'lucide-react';
import { searchWordsVocabulary } from '@/lib/words-data';

import { audioPronunciation } from '@/lib/audio-pronunciation';
import { WordsVocabularyItem } from '@/lib/words-data';

export default function WordsSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WordsVocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [showTranslations, setShowTranslations] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchWordsVocabulary(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handlePlayWord = async (word: string, description: string) => {
    const fullText = `Word: ${word}. Description: ${description}`;
    try {
      await audioPronunciation.playPronunciation(fullText, 'en', { speed: audioSpeed });
    } catch (error) {
      console.error('Error playing word:', error);
    }
  };

  const handlePlayWordOnly = async (word: string) => {
    try {
      await audioPronunciation.playPronunciation(word, 'en', { speed: audioSpeed });
    } catch (error) {
      console.error('Error playing word:', error);
    }
  };

  const handlePlayDescriptionOnly = async (description: string) => {
    try {
      await audioPronunciation.playPronunciation(description, 'es', { speed: audioSpeed });
    } catch (error) {
      console.error('Error playing description:', error);
    }
  };

  const handleLoopWord = async (word: string, description: string) => {
    const fullText = `Word: ${word}. Description: ${description}`;
    try {
      await audioPronunciation.playPronunciation(fullText, 'en', { speed: audioSpeed });
    } catch (error) {
      console.error('Error playing word loop:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Search Words Vocabulary
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search across all 25 words vocabulary lists to find specific words, phrases, 
          or their Spanish translations.
        </p>
      </div>

      {/* Search Controls */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for words, phrases, or translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Audio Speed:</label>
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

          <Button
            variant="outline"
            onClick={() => setShowTranslations(!showTranslations)}
            className="flex items-center space-x-2"
          >
            <Info className="h-4 w-4" />
            <span>{showTranslations ? 'Hide' : 'Show'} Translations</span>
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        )}

        {!loading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No results found for &quot;{searchQuery}&quot;
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {item.word}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600">{item.translated}</p>
                    
                    {/* Audio Controls */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePlayWord(item.word, item.translated)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        All
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
                        variant="outline"
                        onClick={() => handleLoopWord(item.word, item.translated)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Loop
                      </Button>
                    </div>

                    {/* Translation Details */}
                    {showTranslations && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          <strong>Spanish Translation:</strong> {item.translated}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Source:</strong> Words Vocabulary
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!loading && !searchQuery && (
          <div className="text-center py-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Search Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="text-left">
                  <p className="font-medium mb-2">Search by English words:</p>
                  <ul className="space-y-1">
                    <li>• &quot;business&quot; - finds business-related terms</li>
                    <li>• &quot;travel&quot; - finds travel vocabulary</li>
                    <li>• &quot;family&quot; - finds family-related words</li>
                  </ul>
                </div>
                <div className="text-left">
                  <p className="font-medium mb-2">Search by Spanish translations:</p>
                  <ul className="space-y-1">
                    <li>• &quot;trabajo&quot; - finds work-related terms</li>
                    <li>• &quot;viaje&quot; - finds travel vocabulary</li>
                    <li>• &quot;familia&quot; - finds family-related words</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 