'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Brain, Users, Clock, ArrowRight, Zap, GraduationCap, AlertTriangle, Target } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function ProblemsGrammarPage() {
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
        
        // Load problems guides
        const problemsGuideIds = [
          'software_development_problems'
        ];
        
        const loadedGuides: GrammarGuide[] = [];
        
        for (const guideId of problemsGuideIds) {
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
        console.error('Error loading problems guides:', error);
        setError('Failed to load problems guides');
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

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading problems grammar guides...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <AlertTriangle className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Guides</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Problems Grammar</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master common problems and challenges across various professional domains including software development, 
            project management, and system design with practical solutions and mitigation strategies.
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Total Guides</p>
                  <p className="text-2xl font-bold text-red-900">{totalGuides}</p>
                </div>
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Problems</p>
                  <p className="text-2xl font-bold text-orange-900">{totalContent}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Problem Categories</p>
                  <p className="text-2xl font-bold text-yellow-900">{totalContexts}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Avg Difficulty</p>
                  <p className="text-2xl font-bold text-red-900">
                    {averageDifficulty <= 1.5 ? 'Beginner' : 
                     averageDifficulty <= 2.5 ? 'Intermediate' : 'Advanced'}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search problems guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-48">
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
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Sort by Title</SelectItem>
              <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
              <SelectItem value="content">Sort by Content</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Problems Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/grammar/guide/${guide.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant={
                        guide.metadata.difficulty === 'beginner' ? 'default' :
                        guide.metadata.difficulty === 'intermediate' ? 'secondary' :
                        'destructive'
                      }>
                        {guide.metadata.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {guide.metadata.totalContent} problems
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      {guide.contexts.length} categories
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {guide.metadata.estimatedTime} min read
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No problems guides found</h3>
              <p className="text-gray-600">
                {searchQuery || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No problems guides are currently available.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/grammar/overview">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <Badge variant="outline">All Grammar</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">View All Grammar</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Explore the complete grammar collection</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/grammar/concepts">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <Badge variant="outline">Concepts</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Concepts Grammar</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Master professional concepts and terminology</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/test-concepts">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="h-8 w-8 text-green-600" />
                    <Badge variant="outline">Test</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Test Problems</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Debug and test problems loading</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
