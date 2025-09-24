'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Search, Volume2, RotateCcw, Info } from 'lucide-react';
import { getWordsVocabularyStats, loadWordsVocabularyList } from '@/lib/words-data';
import { getWordsTranslation } from '@/lib/comprehensive-words-translations';
import { audioPronunciation } from '@/lib/audio-pronunciation';

export function WordsDataTest() {
  const [stats, setStats] = useState<any>(null);
  const [sampleList, setSampleList] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [audioSystemAvailable, setAudioSystemAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    loadStats();
    loadSampleList();
    // Check audio system availability on client side only
    setAudioSystemAvailable(typeof window !== 'undefined' && !!window.speechSynthesis);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await getWordsVocabularyStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to load stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleList = async () => {
    try {
      const list = await loadWordsVocabularyList(1);
      setSampleList(list);
    } catch (err) {
      console.error('Error loading sample list:', err);
    }
  };

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

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Words Vocabulary Test - Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading Words vocabulary data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          Words Vocabulary Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Section */}
        {stats && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vocabulary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{stats.totalLists}</p>
                <p className="text-sm text-green-700">Total Lists</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalWords}</p>
                <p className="text-sm text-blue-700">Total Words</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(stats.totalWords / stats.totalLists)}
                </p>
                <p className="text-sm text-purple-700">Avg per List</p>
              </div>
            </div>
          </div>
        )}

        {/* Sample List Section */}
        {sampleList && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sample List: {sampleList.title}</h3>
            <p className="text-sm text-gray-600">
              This list contains {sampleList.concepts.length} words and phrases
            </p>
            
            {/* Speed Control */}
            <div className="flex items-center space-x-4">
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

            {/* Sample Words Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleList.concepts.slice(0, 6).map((item: any, index: number) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-800">
                      {item.word}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-gray-600">{item.translated}</p>
                    
                    {/* Audio Controls */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePlayWord(item.word, item.translated)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        All
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlayWordOnly(item.word)}
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Word
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlayDescriptionOnly(item.translated)}
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Desc
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoopWord(item.word, item.translated)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Loop
                      </Button>
                    </div>

                    {/* Translation Info */}
                    <div className="text-xs text-gray-500">
                      <p><strong>Translation Source:</strong> Comprehensive Words Translations</p>
                      <p><strong>Has Translation:</strong> {getWordsTranslation(item.word) !== item.word ? 'Yes' : 'No'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/vocabulary/words">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Words Lists
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/vocabulary/words-list/1">
              <Search className="h-4 w-4 mr-2" />
              View Sample List
            </Link>
          </Button>
        </div>

        {/* Debug Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Debug Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Stats Loaded:</strong> {stats ? 'Yes' : 'No'}</p>
            <p><strong>Sample List Loaded:</strong> {sampleList ? 'Yes' : 'No'}</p>
            <p><strong>Audio System:</strong> {audioSystemAvailable === null ? 'Checking...' : audioSystemAvailable ? 'Available' : 'Not Available'}</p>
            <p><strong>Translation System:</strong> Working</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 