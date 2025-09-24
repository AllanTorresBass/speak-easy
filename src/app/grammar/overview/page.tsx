'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { 
  BookOpen, 
  Search, 
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
  Trophy,
  GitBranch,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function GrammarOverviewPage() {
  const [grammarGuides, setGrammarGuides] = useState<GrammarGuide[]>([]);
  const [stats, setStats] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const grammarService = UnifiedGrammarService.getInstance();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Grammar overview page: Starting to load data...');
        setLoading(true);
        
        console.log('Loading grammar guides...');
        const guides = await grammarService.loadAllGrammarGuides();
        console.log('Guides loaded:', guides);
        setGrammarGuides(guides || []);
        
        console.log('Loading grammar stats...');
        const grammarStats = await grammarService.getGrammarStats();
        console.log('Stats loaded:', grammarStats);
        setStats(grammarStats || {
          totalGuides: 0,
          totalContexts: 0,
          totalContent: 0,
          totalExercises: 0,
          averageDifficulty: 'Intermediate',
          professionalAreas: [],
          categories: {}
        });
        
      } catch (error) {
        console.error('Error loading grammar data:', error);
        // Set default values on error
        setGrammarGuides([]);
        setStats({
          totalGuides: 0,
          totalContexts: 0,
          totalContent: 0,
          totalExercises: 0,
          averageDifficulty: 'Intermediate',
          professionalAreas: [],
          categories: {}
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
    const matchesSearch = searchQuery === '' || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic-structure':
        return <FileText className="h-4 w-4" />;
      case 'complex-structure':
        return <Brain className="h-4 w-4" />;
      case 'verb-conjugation':
        return <Languages className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Sample grammar guides for demonstration
  const sampleGuides = [
    {
      id: 'comparative_superlative_grammar',
      title: 'Comparative and Superlative Adjectives',
      description: 'Learn how to form and use comparative and superlative adjectives',
      category: 'complex-structure' as const,
      difficulty: 'intermediate' as const,
      totalContent: 25,
      totalExercises: 8
    },
    {
      id: 'conditional_grammar',
      title: 'Conditional Sentences',
      description: 'Master the different types of conditional sentences',
      category: 'complex-structure' as const,
      difficulty: 'advanced' as const,
      totalContent: 30,
      totalExercises: 12
    },
    {
      id: 'software_development_cause_effect',
      title: 'Software Development Cause-Effect',
      description: 'Learn cause-effect relationships in software development',
      category: 'cause-effect' as const,
      difficulty: 'intermediate' as const,
      totalContent: 50,
      totalExercises: 15
    },
    {
      id: 'ux_design_cause_effect',
      title: 'UX Design Cause-Effect',
      description: 'Understand cause-effect relationships in UX design',
      category: 'cause-effect' as const,
      difficulty: 'intermediate' as const,
      totalContent: 50,
      totalExercises: 15
    }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Grammar Learning Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Master English grammar through structured lessons and professional context examples
          </p>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Guides</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.totalGuides}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Content</p>
                    <p className="text-3xl font-bold text-green-900">{stats.totalContent}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Professional Areas</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.professionalAreas.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Avg Difficulty</p>
                    <p className="text-3xl font-bold text-orange-900">{stats.averageDifficulty}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/grammar/guide/comparative_superlative_grammar">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <Badge variant="outline">Complex</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Comparative & Superlative</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Master adjective comparisons</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 dark:border-purple-800">
            <Link href="/grammar/cause-effect">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <GitBranch className="h-8 w-8 text-purple-600" />
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                    New
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cause-Effect Grammar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional relationships</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/grammar/guide/conditional_grammar">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                  <Badge variant="outline">Advanced</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Conditional Sentences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">If-then constructions</p>
              </CardContent>
            </Link>
          </Card>

                       <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200 dark:border-orange-800">
               <Link href="/grammar/questions">
                 <CardContent className="pt-6">
                   <div className="flex items-center justify-between mb-4">
                     <HelpCircle className="h-8 w-8 text-orange-600" />
                     <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                       New
                     </Badge>
                   </div>
                   <h3 className="text-lg font-semibold mb-2">Questions Grammar</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Professional questioning</p>
                 </CardContent>
               </Link>
             </Card>

             <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 dark:border-purple-800">
               <Link href="/grammar/verb-conjugation">
                 <CardContent className="pt-6">
                   <div className="flex items-center justify-between mb-4">
                     <Languages className="h-8 w-8 text-purple-600" />
                     <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                       New
                     </Badge>
                   </div>
                   <h3 className="text-lg font-semibold mb-2">Verb Conjugation</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Tense mastery</p>
                 </CardContent>
               </Link>
             </Card>
             
             <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50">
               <Link href="/grammar/guide/verb_conjugation_guide">
                 <CardContent className="pt-6">
                   <div className="flex items-center justify-between mb-4">
                     <BookOpen className="h-8 w-8 text-blue-600" />
                     <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                       Direct Access
                     </Badge>
                   </div>
                   <h3 className="text-lg font-semibold mb-2">Study Complete Guide</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">53 conjugations • 9 categories</p>
                 </CardContent>
               </Link>
             </Card>
             
             <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800">
               <Link href="/grammar/interview">
                 <CardContent className="pt-6">
                   <div className="flex items-center justify-between mb-4">
                     <Briefcase className="h-8 w-8 text-blue-600" />
                     <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                       New
                     </Badge>
                   </div>
                   <h3 className="text-lg font-semibold mb-2">Interview Grammar</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">20+ questions • Preparation strategies</p>
                 </CardContent>
               </Link>
             </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
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
                  <option value="cause-effect">Cause-Effect</option>
                  <option value="concepts">Concepts</option>
                  <option value="problems">Problems</option>
                  <option value="questions">Questions</option>
                  <option value="interview">Interview</option>
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
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(guide.metadata.category)}
                        {guide.metadata.category.replace('-', ' ')}
                      </div>
                    </Badge>
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
                  
                  <Link href={`/grammar/guide/${guide.id}`}>
                    <Button className="w-full" size="sm">
                      Start Learning
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
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
    </MainLayout>
  );
} 