'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { audioPronunciation } from '@/lib/audio-pronunciation';

export function AudioTestButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testType, setTestType] = useState<'word' | 'definition' | 'all'>('word');

  const handleTestAudio = async () => {
    try {
      setIsPlaying(true);
      
      switch (testType) {
        case 'word':
          await audioPronunciation.playPronunciation('Hello', 'en', {
            speed: 0.8,
            pitch: 1.0,
            volume: 0.8
          });
          break;
        case 'definition':
          await audioPronunciation.playPronunciation('A greeting used to say hello or to attract attention', 'en', {
            speed: 0.8,
            pitch: 1.0,
            volume: 0.8
          });
          break;
        case 'all':
          await audioPronunciation.playPronunciation('Word: Hello. Description: A greeting used to say hello or to attract attention', 'en', {
            speed: 0.7,
            pitch: 1.0,
            volume: 0.8
          });
          break;
      }
    } catch (error) {
      console.error('Error testing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const cycleTestType = () => {
    setTestType(prev => {
      if (prev === 'word') return 'definition';
      if (prev === 'definition') return 'all';
      return 'word';
    });
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <Button 
        variant="outline" 
        onClick={handleTestAudio}
        disabled={isPlaying}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4 mr-2 animate-pulse" />
            Testing Audio...
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 mr-2" />
            Test Audio System
          </>
        )}
      </Button>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Test Type:</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={cycleTestType}
          className="h-6 px-2 text-xs capitalize"
        >
          {testType}
        </Button>
      </div>
    </div>
  );
} 