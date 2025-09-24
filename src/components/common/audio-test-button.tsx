'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Settings, Play, RotateCcw, Mic, Star, Zap, Heart } from 'lucide-react';
import { audioPronunciation, AudioSettings, EnhancedVoice } from '@/lib/audio-pronunciation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AudioTestButtonProps {
  text: string;
  language?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showSettings?: boolean;
}

export const AudioTestButton: React.FC<AudioTestButtonProps> = ({
  text,
  language = 'en',
  className = '',
  size = 'md',
  variant = 'default',
  showSettings = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AudioSettings & { voiceInfo: unknown }>();
  const [availableVoices, setAvailableVoices] = useState<EnhancedVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<EnhancedVoice | null>(null);

  useEffect(() => {
    // Load initial settings and voice info
    const loadSettings = () => {
      const currentSettings = audioPronunciation.getSettings();
      setSettings(currentSettings);
      setAvailableVoices(currentSettings.voiceInfo.availableVoices);
      setCurrentVoice(currentSettings.voiceInfo.currentVoice ? 
        currentSettings.voiceInfo.availableVoices.find(v => v.voice === currentSettings.voiceInfo.currentVoice) || null : null);
    };

    loadSettings();

    // Listen for settings changes
    const handleSettingsChange = (event: CustomEvent) => {
      if (event.detail.type === 'settingsChanged') {
        loadSettings();
      }
    };

    audioPronunciation.addAudioEventListener(handleSettingsChange);

    return () => {
      audioPronunciation.removeAudioEventListener(handleSettingsChange);
    };
  }, []);

  const handlePlayAudio = async () => {
    if (isPlaying) return;

    try {
      setIsPlaying(true);
      await audioPronunciation.playPronunciation(text, language);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSettingsChange = (key: keyof AudioSettings, value: unknown) => {
    if (!settings) return;

    const newSettings = { ...settings, [key]: value };
    audioPronunciation.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const getVoiceQualityIcon = (quality: string) => {
    switch (quality) {
      case 'premium': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'standard': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'basic': return <Heart className="h-4 w-4 text-gray-500" />;
      default: return <Mic className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVoiceQualityColor = (quality: string) => {
    switch (quality) {
      case 'premium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basic': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const buttonSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size={size}
        variant={variant}
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className={`${buttonSize[size]} ${className}`}
      >
        {isPlaying ? (
          <div className="animate-spin">
            <RotateCcw className={iconSize[size]} />
          </div>
        ) : (
          <Volume2 className={iconSize[size]} />
        )}
      </Button>

      {showSettings && (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              size={size}
              variant="outline"
              className={`${buttonSize[size]} p-0`}
            >
              <Settings className={iconSize[size]} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Audio Voice Settings</DialogTitle>
              <DialogDescription>
                Customize your voice experience for more natural and relaxed speech
              </DialogDescription>
            </DialogHeader>

            {settings && (
              <div className="space-y-6">
                {/* Voice Quality Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Voice Quality
                    </CardTitle>
                    <CardDescription>
                      Current voice and available options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentVoice && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                        <div className="flex items-center gap-3">
                          {getVoiceQualityIcon(currentVoice.quality)}
                          <div>
                            <div className="font-medium">{currentVoice.voice.name}</div>
                            <div className="text-sm text-gray-600">{currentVoice.voice.lang}</div>
                          </div>
                        </div>
                        <Badge className={getVoiceQualityColor(currentVoice.quality)}>
                          {currentVoice.quality}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-800">
                          {settings.voiceInfo.voiceCapabilities.premium}
                        </div>
                        <div className="text-green-600">Premium</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-800">
                          {settings.voiceInfo.voiceCapabilities.standard}
                        </div>
                        <div className="text-blue-600">Standard</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-800">
                          {settings.voiceInfo.voiceCapabilities.basic}
                        </div>
                        <div className="text-gray-600">Basic</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Selection</CardTitle>
                    <CardDescription>
                      Choose your preferred voice quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['premium', 'standard', 'basic'].map((quality) => {
                        const count = settings.voiceInfo.voiceCapabilities[quality as keyof typeof settings.voiceInfo.voiceCapabilities];
                        return (
                          <div key={quality} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {getVoiceQualityIcon(quality)}
                              <span className="capitalize">{quality}</span>
                              <Badge variant="outline">{count} available</Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const voice = audioPronunciation.setVoicePreference(quality as 'premium' | 'standard' | 'basic' | 'auto');
                                if (voice) {
                                  setCurrentVoice(availableVoices.find(v => v.voice === voice) || null);
                                }
                              }}
                              disabled={count === 0}
                            >
                              Use
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Speech Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Speech Settings</CardTitle>
                    <CardDescription>
                      Adjust speech characteristics for natural sound
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Speed Control */}
                    <div className="space-y-2">
                      <Label htmlFor="speed">Speed: {settings.speed}x</Label>
                      <Slider
                        id="speed"
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        value={[settings.speed]}
                        onValueChange={([value]) => handleSettingsChange('speed', value)}
                        className="w-full"
                      />
                    </div>

                    {/* Pitch Control */}
                    <div className="space-y-2">
                      <Label htmlFor="pitch">Pitch: {settings.pitch}</Label>
                      <Slider
                        id="pitch"
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        value={[settings.pitch]}
                        onValueChange={([value]) => handleSettingsChange('pitch', value)}
                        className="w-full"
                      />
                    </div>

                    {/* Volume Control */}
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume: {Math.round(settings.volume * 100)}%</Label>
                      <Slider
                        id="volume"
                        min={0.0}
                        max={1.0}
                        step={0.05}
                        value={[settings.volume]}
                        onValueChange={([value]) => handleSettingsChange('volume', value)}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Natural Speech Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Natural Speech Features</CardTitle>
                    <CardDescription>
                      Enable features for more realistic speech
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="naturalPauses">Natural Pauses</Label>
                        <div className="text-sm text-gray-600">
                          Add pauses after sentences and commas
                        </div>
                      </div>
                      <Switch
                        id="naturalPauses"
                        checked={settings.naturalPauses}
                        onCheckedChange={(checked) => handleSettingsChange('naturalPauses', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="breathingSpace">Breathing Space</Label>
                        <div className="text-sm text-gray-600">
                          Add pauses between paragraphs
                        </div>
                      </div>
                      <Switch
                        id="breathingSpace"
                        checked={settings.breathingSpace}
                        onCheckedChange={(checked) => handleSettingsChange('breathingSpace', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="sentenceRhythm">Sentence Rhythm</Label>
                        <div className="text-sm text-gray-600">
                          Add natural rhythm to long sentences
                        </div>
                      </div>
                      <Switch
                        id="sentenceRhythm"
                        checked={settings.sentenceRhythm}
                        onCheckedChange={(checked) => handleSettingsChange('sentenceRhythm', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emphasisLevel">Emphasis Level</Label>
                      <Select
                        value={settings.emphasisLevel}
                        onValueChange={(value) => handleSettingsChange('emphasisLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subtle">Subtle</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="strong">Strong</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Test Your Settings</CardTitle>
                    <CardDescription>
                      Listen to how your current settings sound
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => audioPronunciation.playPronunciation(
                        "Hello! This is a test of your enhanced voice settings. Notice the natural pauses and relaxed tone.",
                        'en',
                        settings
                      )}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Test Current Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}; 