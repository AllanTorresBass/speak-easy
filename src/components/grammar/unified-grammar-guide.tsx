'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Target, 
  Brain, 
  GraduationCap,
  Users,
  FileText,
  Lightbulb,
  ArrowLeft,
  BookMarked,
  Star,
  Clock,
  Calendar,
  Tag,
  Info,
  Eye,
  EyeOff,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  Search,
  Filter,
  Bookmark,
  Share2
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide, GrammarContext, GrammarContent } from '@/types/grammar';
import { getDifficultyColor } from '@/lib/hydration-safe';
import Link from 'next/link';

interface UnifiedGrammarGuideProps {
  guideId: string;
}

export function UnifiedGrammarGuide({ guideId }: UnifiedGrammarGuideProps) {
  const [grammarGuide, setGrammarGuide] = useState<GrammarGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showExamples, setShowExamples] = useState<{ [key: string]: boolean }>({});
  const [audioSpeed, setAudioSpeed] = useState(0.75);
  const [audioPitch, setAudioPitch] = useState(0.95);
  const [audioVolume, setAudioVolume] = useState(0.85);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContexts, setFilteredContexts] = useState<GrammarContext[]>([]);

  const grammarService = UnifiedGrammarService.getInstance();

  useEffect(() => {
    loadGuide();
  }, [guideId]);

  useEffect(() => {
    if (grammarGuide) {
      filterContexts();
    }
  }, [searchQuery, grammarGuide]);

  const loadGuide = async () => {
    try {
      setLoading(true);
      const guide = await grammarService.loadGrammarGuide(guideId);
      
      if (guide) {
        setGrammarGuide(guide);
        if (guide.contexts.length > 0) {
          setActiveTab(guide.contexts[0].id);
        }
      } else {
        setError('Grammar guide not found');
      }
    } catch (err) {
      setError('Failed to load grammar guide');
      console.error('Error loading guide:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterContexts = () => {
    if (!grammarGuide) return;
    
    if (!searchQuery.trim()) {
      setFilteredContexts(grammarGuide.contexts);
      return;
    }
    
    const filtered = grammarGuide.contexts.filter(context => {
      const searchableText = [
        context.title,
        context.description,
        ...context.content.map(c => c.text),
        ...context.content.map(c => c.context || ''),
        ...context.content.map(c => c.meaning || ''),
        ...context.content.flatMap(c => c.tags || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchQuery.toLowerCase());
    });
    
    setFilteredContexts(filtered);
  };

  const handlePlayAudio = async (text: string) => {
    try {
      setIsPlaying(text);
      
      // Import the audio pronunciation system
      const { audioPronunciation } = await import('@/lib/audio-pronunciation');
      
      await audioPronunciation.playPronunciation(text, 'en', {
        speed: audioSpeed,
        pitch: audioPitch,
        volume: audioVolume,
        naturalPauses: true,
        emphasisLevel: 'moderate'
      });
      
      // Reset playing state after a delay
      setTimeout(() => {
        setIsPlaying(null);
      }, 1000);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(null);
    }
  };

  const toggleExamples = (contextId: string) => {
    setShowExamples(prev => ({
      ...prev,
      [contextId]: !prev[contextId]
    }));
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Target className="h-4 w-4" />;
      case 'advanced':
        return <Brain className="h-4 w-4" />;
      default:
        return <GraduationCap className="h-4 w-4" />;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'phrase':
        return <FileText className="h-4 w-4" />;
      case 'sentence':
        return <BookOpen className="h-4 w-4" />;
      case 'example':
        return <Lightbulb className="h-4 w-4" />;
      case 'definition':
        return <Info className="h-4 w-4" />;
      case 'pattern':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin"><RotateCcw className="h-8 w-8 text-blue-600" /></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !grammarGuide) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Guide</h1>
            <p className="text-gray-600 mb-4">{error || 'Grammar guide not found'}</p>
            <Link href="/grammar/overview">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Grammar Overview
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/grammar/overview">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
            </Link>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {grammarGuide.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {grammarGuide.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge className={getDifficultyColor(grammarGuide.metadata.difficulty)}>
              <div className="flex items-center gap-1">
                {getDifficultyIcon(grammarGuide.metadata.difficulty)}
                {grammarGuide.metadata.difficulty}
              </div>
            </Badge>
            
            <Badge variant="outline">
              <FileText className="h-4 w-4 mr-1" />
              {grammarGuide.metadata.totalContent} content items
            </Badge>
            
            <Badge variant="outline">
              <Users className="h-4 w-4 mr-1" />
              {grammarGuide.contexts.length} contexts
            </Badge>
            
            <Badge variant="outline">
              <Clock className="h-4 w-4 mr-1" />
              {grammarGuide.metadata.estimatedTime} min estimated
            </Badge>
            
            <Badge variant="outline">
              <Calendar className="h-4 w-4 mr-1" />
              {grammarGuide.createdDate}
            </Badge>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search grammar content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filter:</span>
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1"
                >
                  <option value="">All Contexts</option>
                  {filteredContexts.map(context => (
                    <option key={context.id} value={context.id}>
                      {context.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-blue-600" />
              Audio Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {audioSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={audioSpeed}
                  onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch: {audioPitch}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={audioPitch}
                  onChange={(e) => setAudioPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(audioVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grammar Concepts */}
        {grammarGuide.concepts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Core Concepts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {grammarGuide.concepts.map((concept) => (
                  <div key={concept.id} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="text-lg font-semibold mb-2">{concept.title}</h3>
                    <p className="text-gray-700 mb-4">{concept.definition}</p>
                    
                    {concept.rules && concept.rules.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Key Rules:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {concept.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {concept.examples && concept.examples.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Examples:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {concept.examples.map((example) => (
                            <Card key={example.id} className="p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-blue-600 mb-1">
                                    {example.type}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {example.text}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(example.text)}
                                  disabled={isPlaying === example.text}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 ml-2"
                                >
                                  {isPlaying === example.text ? (
                                    <div className="animate-spin">
                                      <RotateCcw className="h-4 w-4 text-blue-600" />
                                    </div>
                                  ) : (
                                    <Volume2 className="h-4 w-4 text-blue-600" />
                                  )}
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grammar Contexts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-blue-600" />
              Grammar Contexts
            </CardTitle>
            <CardDescription>
              Explore grammar usage in different professional areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredContexts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contexts match your search criteria.
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {filteredContexts.map((context) => (
                    <TabsTrigger key={context.id} value={context.id} className="text-xs">
                      {context.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {filteredContexts.map((context) => (
                  <TabsContent key={context.id} value={context.id} className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{context.title}</h3>
                      <p className="text-gray-600">{context.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {context.content.length} content items
                        </Badge>
                        
                        <Badge variant="secondary">
                          {context.category}
                        </Badge>
                        
                        <Badge className={getDifficultyColor(context.difficulty)}>
                          {context.difficulty}
                        </Badge>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExamples(context.id)}
                      >
                        {showExamples[context.id] ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Examples
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show Examples
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {showExamples[context.id] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {context.content.map((content) => (
                          <Card key={content.id} className="p-4">
                            <div className="mb-3">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  <div className="flex items-center gap-1">
                                    {getContentTypeIcon(content.type)}
                                    {content.type}
                                  </div>
                                </Badge>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(content.text)}
                                  disabled={isPlaying === content.text}
                                  className="h-6 w-6 p-0"
                                >
                                  {isPlaying === content.text ? (
                                    <div className="animate-spin">
                                      <RotateCcw className="h-4 w-4" />
                                    </div>
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              
                              <p className="text-gray-800 font-medium mb-2">
                                {content.text}
                              </p>
                              
                              {content.context && (
                                <p className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">Context:</span> {content.context}
                                </p>
                              )}
                              
                              {content.meaning && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Meaning:</span> {content.meaning}
                                </p>
                              )}
                              
                              {content.tags && content.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {content.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
