'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Filter, 
  TrendingUp, 
  Target, 
  Brain, 
  GraduationCap,
  Users,
  Clock,
  Star,
  ArrowRight,
  BookMarked,
  Lightbulb,
  Zap,
  Flame,
  Monitor,
  Smartphone,
  Globe,
  Languages,
  FileText,
  Video,
  Headphones,
  PenTool,
  Calendar,
  Award,
  Trophy
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { loadAllGrammarGuides, getGrammarStats, GrammarList } from '@/lib/grammar-data';

export default function GrammarOverviewPage() {
  const [grammarGuides, setGrammarGuides] = useState<GrammarList[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Grammar overview page: Starting to load data...');
        setLoading(true);
        
        console.log('Loading grammar guides...');
        const guides = await loadAllGrammarGuides();
        console.log('Guides loaded:', guides);
        setGrammarGuides(guides || []);
        
        console.log('Loading grammar stats...');
        const grammarStats = await getGrammarStats();
        console.log('Stats loaded:', grammarStats);
        setStats(grammarStats || {
          totalGuides: 0,
          totalContexts: 0,
          totalPhrases: 0,
          averageDifficulty: 'Intermediate',
          professionalAreas: []
        });
        
      } catch (error) {
        console.error('Error loading grammar data:', error);
        // Set default values on error
        setGrammarGuides([]);
        setStats({
          totalGuides: 0,
          totalContexts: 0,
          totalPhrases: 0,
          averageDifficulty: 'Intermediate',
          professionalAreas: []
        });
      } finally {
        setLoading(false);
        console.log('Grammar overview page: Data loading completed');
      }
    };

    loadData();
  }, []);

  // Filter guides based on search and filters
  const filteredGuides = grammarGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string | undefined | null) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800';
    
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return <Target className="h-4 w-4" />;
      case 'intermediate': return <TrendingUp className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading grammar guides...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Grammar Learning Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master English grammar with our comprehensive collection of professional grammar guides. 
            From basic structure to advanced concepts, learn grammar in real-world contexts.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Total Guides</p>
                  <p className="text-2xl font-bold">{stats?.totalGuides || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Professional Contexts</p>
                  <p className="text-2xl font-bold">{stats?.totalContexts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Total Examples</p>
                  <p className="text-2xl font-bold">{stats?.totalPhrases || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Avg. Difficulty</p>
                  <p className="text-2xl font-bold">{stats?.averageDifficulty || 'Intermediate'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search grammar guides, concepts, or examples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Basic Structure">Basic Structure</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Areas */}
        {stats?.professionalAreas && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Professional Areas Covered</h3>
            <div className="flex flex-wrap gap-2">
              {stats.professionalAreas.map((area: string) => (
                <Badge key={area} variant="secondary" className="px-3 py-1">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGuides.map((guide) => (
            <Link key={guide.id} href={`/grammar/guide/${guide.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      <div className="flex items-center gap-1">
                        {getDifficultyIcon(guide.difficulty)}
                        {guide.difficulty}
                      </div>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {guide.totalPhrases} examples
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {guide.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Contexts:</span>
                      <span className="font-medium">{guide.totalContexts}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{guide.category}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {guide.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{guide.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    Study Guide <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No grammar guides found matching "{searchQuery}"
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && grammarGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No grammar guides available at the moment.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 