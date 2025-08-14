'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Brain, Target, Users, Clock, ArrowRight, Zap, GraduationCap, AlertTriangle, Languages, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function VerbConjugationGrammarPage() {
  const [guides, setGuides] = useState<GrammarGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const service = UnifiedGrammarService.getInstance();
        
        // Load verb conjugation guides
        const conjugationGuideIds = [
          'verb_conjugation_guide'
        ];
        
        const loadedGuides: GrammarGuide[] = [];
        
        // Try loading the specific guide first
        for (const guideId of conjugationGuideIds) {
          try {
            const guide = await service.loadGrammarGuide(guideId);
            console.log(`Loaded guide ${guideId}:`, guide);
            if (guide) {
              loadedGuides.push(guide);
            }
          } catch (error) {
            console.warn(`Failed to load guide ${guideId}:`, error);
          }
        }
        
        // If no guides loaded, try loading all guides to see if there's a general issue
        if (loadedGuides.length === 0) {
          console.log('No specific guides loaded, trying to load all guides...');
          const allGuides = await service.loadAllGrammarGuides();
          console.log('All guides loaded:', allGuides);
          const conjugationGuides = allGuides.filter(g => g.metadata.category === 'verb-conjugation');
          console.log('Filtered conjugation guides:', conjugationGuides);
          loadedGuides.push(...conjugationGuides);
        }
        
        // If still no guides, create a mock guide for display purposes
        if (loadedGuides.length === 0) {
          console.log('Creating fallback guide data...');
          const fallbackGuide: GrammarGuide = {
            id: 'verb_conjugation_guide',
            title: 'Complete Verb Conjugation Guide',
            description: 'Comprehensive guide covering verb conjugations across all tenses, modal verbs, and conjugation patterns with English-Spanish translations',
            version: '1.0',
            createdDate: '2024-12-19',
            concepts: [],
            contexts: [
              {
                id: 'basic_forms',
                title: 'Basic Verb Forms',
                description: 'Fundamental verb forms that serve as the foundation for all conjugations',
                category: 'verb-conjugation',
                difficulty: 'intermediate',
                content: [],
                examples: [],
                metadata: {}
              }
            ],
            metadata: {
              difficulty: 'advanced',
              category: 'verb-conjugation',
              totalContent: 53,
              totalExercises: 0,
              estimatedTime: 15,
              professionalAreas: ['Language Learning', 'Grammar Education'],
              tags: ['verb_conjugation', 'english_grammar', 'spanish_translation'],
              targetAudience: ['english_language_learners', 'spanish_speakers_learning_english']
            },
            audioConfig: {
              defaultSpeed: 0.75,
              defaultPitch: 0.95,
              defaultVolume: 0.85,
              voiceQuality: 'standard',
              naturalPauses: true,
              emphasisSystem: true
            }
          };
          loadedGuides.push(fallbackGuide);
        }
        
        console.log('All loaded guides:', loadedGuides);
        setGuides(loadedGuides);
      } catch (error) {
        console.error('Error loading verb conjugation guides:', error);
        setError('Failed to load verb conjugation guides');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debug effect to log guides state changes
  useEffect(() => {
    console.log('Guides state changed:', guides);
  }, [guides]);

  // Filter and sort guides
  const filteredGuides = guides
    .filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           guide.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'all' || guide.metadata.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          return a.metadata.difficulty.localeCompare(b.metadata.difficulty);
        case 'content':
          return b.metadata.totalContent - a.metadata.totalContent;
        default:
          return 0;
      }
    });

  // Calculate statistics
  console.log('Current guides state:', guides);
  const totalGuides = guides.length;
  const totalContent = guides.reduce((sum, guide) => sum + guide.metadata.totalContent, 0);
  const totalContexts = guides.reduce((sum, guide) => sum + guide.contexts.length, 0);
  const averageDifficulty = guides.length > 0 
    ? guides.reduce((sum, guide) => {
        const difficultyValue = guide.metadata.difficulty === 'beginner' ? 1 : 
                               guide.metadata.difficulty === 'intermediate' ? 2 : 3;
        return sum + difficultyValue;
      }, 0) / guides.length
    : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <GraduationCap className="h-4 w-4" />;
      case 'intermediate':
        return <Target className="h-4 w-4" />;
      case 'advanced':
        return <Zap className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading verb conjugation guides...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Guides</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/grammar" className="hover:text-blue-600">Grammar Learning Center</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-gray-800">Verb Conjugation</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <Languages className="h-10 w-10 text-purple-600" />
            Verb Conjugation Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Master verb conjugations across all tenses, modal verbs, and conjugation patterns. 
            Learn English-Spanish translations and conjugation rules for effective communication.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Languages className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-800">{totalGuides}</p>
                  <p className="text-purple-600">Conjugation Guides</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-800">{totalContent}</p>
                  <p className="text-green-600">Total Conjugations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-800">{totalContexts}</p>
                  <p className="text-blue-600">Conjugation Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-800">
                    {averageDifficulty.toFixed(1)}
                  </p>
                  <p className="text-orange-600">Avg. Difficulty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conjugation guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Sort by Title</SelectItem>
                  <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
                  <SelectItem value="content">Sort by Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Direct Navigation to Verb Conjugation Guide */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Languages className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-purple-800 mb-2">Ready to Study Verb Conjugations?</h3>
              <p className="text-purple-600 mb-4">
                Access the complete guide with 53 conjugation items across 9 categories
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/grammar/guide/verb_conjugation_guide">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Study Complete Verb Conjugation Guide
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Languages className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Conjugation Guides Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No conjugation guides are currently available.'
                }
              </p>
              <div className="mt-4">
                <Link href="/grammar/guide/verb_conjugation_guide">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Access Guide Directly
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-200 hover:border-l-purple-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                        {guide.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {guide.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(guide.metadata.difficulty)}>
                        <div className="flex items-center gap-1">
                          {getDifficultyIcon(guide.metadata.difficulty)}
                          {guide.metadata.difficulty}
                        </div>
                      </Badge>
                      
                      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                        {guide.metadata.category}
                      </Badge>
                      
                      <Badge variant="secondary">
                        {guide.metadata.totalContent} conjugations
                      </Badge>
                    </div>
                    
                    {/* Contexts Preview */}
                    {guide.contexts.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Conjugation Categories:</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.contexts.slice(0, 5).map((context) => (
                            <Badge key={context.id} variant="outline" className="text-xs">
                              {context.title}
                            </Badge>
                          ))}
                          {guide.contexts.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{guide.contexts.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-2">
                      <Link href={`/grammar/guide/${guide.id}`}>
                        <Button className="w-full group-hover:bg-purple-600 transition-colors">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Study Conjugation Guide
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
