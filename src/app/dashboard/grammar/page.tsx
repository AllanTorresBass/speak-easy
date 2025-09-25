'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  TrendingUp,
  Clock,
  Search,
  Bookmark,
  Brain,
  GraduationCap,
  FileText,
  Users,
  ArrowRight,
  Target
} from 'lucide-react';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [grammarGuides, setGrammarGuides] = useState<GrammarGuide[]>([]);
  const [stats, setStats] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const grammarService = UnifiedGrammarService.getInstance();

  const loadGrammarData = useCallback(async () => {
    try {
      setLoading(true);
      const [guides, grammarStats] = await Promise.all([
        grammarService.loadAllGrammarGuides(),
        grammarService.getGrammarStats()
      ]);
      
      setGrammarGuides(guides);
      setStats(grammarStats);
    } catch (error) {
      console.error('Error loading grammar data:', error);
    } finally {
      setLoading(false);
    }
  }, [grammarService]);

  useEffect(() => {
    loadGrammarData();
  }, [loadGrammarData]);

  // Filter guides based on search and filters
  const filteredGuides = grammarGuides.filter(guide => {
    const matchesSearch = searchQuery === '' || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      guide.metadata.difficulty === selectedDifficulty;
    
    const matchesCategory = selectedCategory === 'all' || 
      guide.metadata.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
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

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Grammar Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your grammar learning progress and access comprehensive grammar guides.
        </p>
      </div>

      {/* Grammar Overview Section */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 dark:bg-blue-900/30">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                {(stats as { totalGuides?: number })?.totalGuides || 0}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">Total Guides</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 dark:bg-green-900/30">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
                {(stats as { totalContent?: number })?.totalContent || 0}
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">Content Items</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                {(stats as { professionalAreas?: unknown[] })?.professionalAreas?.length || 0}
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">Professional Areas</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3 dark:bg-orange-900/30">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                {(stats as { averageDifficulty?: string })?.averageDifficulty || 'Intermediate'}
              </h3>
              <p className="text-orange-700 dark:text-orange-300 text-sm">Avg Difficulty</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search grammar guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="basic-structure">Basic Structure</option>
                <option value="complex-structure">Complex Structure</option>
                <option value="verb-conjugation">Verb Conjugation</option>
                <option value="specialized">Specialized</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grammar Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {guide.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(guide.metadata.difficulty)}>
                    <div className="flex items-center gap-1">
                      {getDifficultyIcon(guide.metadata.difficulty)}
                      {guide.metadata.difficulty}
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {guide.contexts.length} contexts
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {guide.metadata.totalContent} items
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {guide.metadata.estimatedTime} min
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {guide.metadata.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {guide.metadata.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{guide.metadata.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm" asChild>
                    <a href={`/grammar/guide/${guide.id}`}>
                      Start Learning
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grammar guides found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 