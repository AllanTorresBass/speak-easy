'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Brain, Target, Users, Clock, ArrowRight, Zap, GraduationCap, AlertTriangle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function QuestionsGrammarPage() {
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
        
        // Load questions guides
        const questionsGuideIds = [
          'software_development_questions'
        ];
        
        const loadedGuides: GrammarGuide[] = [];
        
        for (const guideId of questionsGuideIds) {
          try {
            const guide = await service.loadGrammarGuide(guideId);
            if (guide) {
              loadedGuides.push(guide);
            }
          } catch (error) {
            console.warn(`Failed to load guide ${guideId}:`, error);
          }
        }
        
        setGuides(loadedGuides);
      } catch (error) {
        console.error('Error loading questions guides:', error);
        setError('Failed to load questions guides');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
            <p className="mt-4 text-gray-600">Loading questions guides...</p>
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
            <span className="text-gray-800">Questions Grammar</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <HelpCircle className="h-10 w-10 text-blue-600" />
            Questions Grammar Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Master the art of asking effective questions in software development and professional contexts. 
            Learn common questions, their contexts, and how to use them effectively.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-800">{totalGuides}</p>
                  <p className="text-blue-600">Questions Guides</p>
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
                  <p className="text-green-600">Total Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-800">{totalContexts}</p>
                  <p className="text-purple-600">Question Categories</p>
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
                    placeholder="Search questions guides..."
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

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Questions Guides Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No questions guides are currently available.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-200 hover:border-l-blue-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
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
                      
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                        {guide.metadata.category}
                      </Badge>
                      
                      <Badge variant="secondary">
                        {guide.metadata.totalContent} questions
                      </Badge>
                    </div>
                    
                    {/* Contexts Preview */}
                    {guide.contexts.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Question Categories:</p>
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
                        <Button className="w-full group-hover:bg-blue-600 transition-colors">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Study Questions Guide
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
