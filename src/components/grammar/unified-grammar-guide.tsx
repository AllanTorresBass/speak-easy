'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


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
import { GrammarGuide, GrammarContext } from '@/types/grammar';
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
  const [showAudioControls, setShowAudioControls] = useState(false);
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
                  placeholder={grammarGuide.metadata.category === 'problems' 
                    ? "Search problems and solutions..." 
                    : "Search grammar content..."
                  }
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
                  <option value="">
                    {grammarGuide.metadata.category === 'problems' ? 'All Categories' : 'All Contexts'}
                  </option>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                  Audio Settings
                </CardTitle>
                <CardDescription>
                  Configure audio playback for pronunciation and learning
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAudioControls(!showAudioControls)}
              >
                {showAudioControls ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showAudioControls && (
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </CardContent>
          )}
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

        {/* Grammar Contexts / Problem Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-blue-600" />
              {grammarGuide.metadata.category === 'problems' ? 'Problem Categories' : 'Grammar Contexts'}
            </CardTitle>
            <CardDescription>
              {grammarGuide.metadata.category === 'problems' 
                ? 'Explore common problems and their solutions across different areas'
                : 'Explore grammar usage in different professional areas'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredContexts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contexts match your search criteria.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Improved Tabs Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex flex-wrap gap-1 pb-2" aria-label="Problem Categories">
                    {filteredContexts.map((context) => (
                      <button
                        key={context.id}
                        onClick={() => setActiveTab(context.id)}
                        className={`
                          px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${activeTab === context.id
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                          }
                          ${context.content.length > 10 ? 'border-l-4 border-l-orange-400' : ''}
                          ${context.content.length > 20 ? 'border-l-4 border-l-red-400' : ''}
                        `}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="whitespace-nowrap">{context.title}</span>
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${activeTab === context.id 
                              ? 'bg-blue-700 text-blue-100' 
                              : 'bg-gray-200 text-gray-600'
                            }
                          `}>
                            {context.content.length} items
                          </span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Active Tab Content */}
                {filteredContexts.map((context) => (
                  <div
                    key={context.id}
                    className={`transition-all duration-300 ${
                      activeTab === context.id ? 'block opacity-100' : 'hidden opacity-0'
                    }`}
                  >
                    {/* Context Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                            {context.title}
                          </h3>
                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            {context.description}
                          </p>
                          
                          {/* Context Metadata */}
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="px-3 py-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                {grammarGuide.metadata.category === 'problems' 
                                  ? `${context.content.length} problems`
                                  : `${context.content.length} content items`
                                }
                              </div>
                            </Badge>
                            
                            <Badge variant="secondary" className="px-3 py-1 text-sm">
                              <div className="flex items-center gap-2">
                                <BookMarked className="h-4 w-4" />
                                {grammarGuide.metadata.category === 'problems' ? 'problems' : context.category}
                              </div>
                            </Badge>
                            
                            <Badge className={`px-3 py-1 text-sm ${getDifficultyColor(context.difficulty)}`}>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {context.difficulty}
                              </div>
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Toggle Button */}
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => toggleExamples(context.id)}
                          className="ml-4 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          {showExamples[context.id] ? (
                            <>
                              <EyeOff className="h-5 w-5 mr-2" />
                              Hide {grammarGuide.metadata.category === 'problems' ? 'Problems' : 'Examples'}
                            </>
                          ) : (
                            <>
                              <Eye className="h-5 w-5 mr-2" />
                              Show {grammarGuide.metadata.category === 'problems' ? 'Problems' : 'Examples'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Content Display */}
                    {showExamples[context.id] && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {context.content.map((content) => (
                            <Card key={content.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-200 hover:border-l-blue-400">
                              <CardContent className="p-6">
                                <div className="mb-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <Badge variant="secondary" className="text-sm px-3 py-1">
                                      <div className="flex items-center gap-2">
                                        {getContentTypeIcon(content.type)}
                                        <span className="capitalize">
                                          {grammarGuide.metadata.category === 'problems' ? 'problem' : content.type}
                                        </span>
                                      </div>
                                    </Badge>
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handlePlayAudio(content.text)}
                                      disabled={isPlaying === content.text}
                                      className="h-8 w-8 p-0 hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                  
                                  {/* Problem Title */}
                                  <h4 className="text-xl font-bold text-gray-800 mb-4 leading-tight">
                                    {content.text}
                                  </h4>
                                  
                                  {/* Context */}
                                  {content.context && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-gray-800">Category:</span> {content.context}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Problem Description */}
                                  {content.meaning && (
                                    <div className="mb-4">
                                      <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-600" />
                                        Description:
                                      </h5>
                                      <p className="text-gray-700 leading-relaxed">{content.meaning}</p>
                                    </div>
                                  )}
                                  
                                  {/* Impact and Mitigation for Problems */}
                                  {grammarGuide.metadata.category === 'problems' && content.metadata && (
                                    <div className="space-y-4">
                                      {(content.metadata.impact as string) && (
                                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                          <h5 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            Impact:
                                          </h5>
                                          <p className="text-red-700">{content.metadata.impact as string}</p>
                                        </div>
                                      )}
                                      
                                      {(content.metadata.mitigation as string) && (
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                          <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4" />
                                            Mitigation:
                                          </h5>
                                          <p className="text-green-700">{content.metadata.mitigation as string}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Tags */}
                                  {content.tags && content.tags.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                      <div className="flex flex-wrap gap-2">
                                        {content.tags.map((tag, index) => (
                                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
