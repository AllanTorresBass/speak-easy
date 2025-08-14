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
  Trophy,
  CheckCircle,
  Play,
  Settings,
  Download,
  Share2,
  SortAsc,
  SortDesc,
  Briefcase
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function GrammarPage() {
  const [grammarGuides, setGrammarGuides] = useState<GrammarGuide[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');

  const grammarService = UnifiedGrammarService.getInstance();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Starting to load grammar data...');
        setLoading(true);
        
        // Load guides individually instead of all at once
        const guideIds = [
          'adjectives_grammar',
          'adverbs_grammar',
          'advanced_sentences_grammar',
          'clauses_grammar',
          'conjunctions_grammar',
          'determiners_grammar',
          'nouns_grammar',
          'prepositional_phrases',
          'prepositions_grammar',
          'pronouns_grammar',
          'subject_predicate_grammar',
          'verbs_grammar',
          'comparative_superlative_grammar',
          'conditional_grammar',
          'indirect_questions_grammar',
          'modifiers_grammar',
          'passive_voice_grammar',
          'past_perfect_grammar',
          'present_perfect_continuous_grammar',
          'present_perfect_grammar',
          'subordinate_clauses_grammar',
          'software_development_cause_effect',
          'ux_design_cause_effect',
          'database_improvement_concepts',
          'phrases_concepts',
          'project_management_concepts',
          'soft_skills_concepts',
          'software_development_concepts',
          'ui_concepts',
          'ui_ux_principles',
          'ux_concepts',
          'verb_conjugation_guide',
          'software_development_problems',
          'software_development_questions'
        ];
        
        console.log('Guide IDs to load:', guideIds);
        const loadedGuides: GrammarGuide[] = [];
        
        for (const guideId of guideIds) {
          try {
            console.log(`Loading guide: ${guideId}`);
            const guide = await grammarService.loadGrammarGuide(guideId);
            if (guide) {
              console.log(`Successfully loaded guide: ${guideId} with ${guide.contexts.length} contexts`);
              loadedGuides.push(guide);
            } else {
              console.warn(`Guide ${guideId} returned null`);
            }
          } catch (error) {
            console.warn(`Failed to load guide ${guideId}:`, error);
            // Continue loading other guides
          }
        }
        
        console.log(`Total guides loaded: ${loadedGuides.length}`);
        setGrammarGuides(loadedGuides);
        
        // Calculate stats from loaded guides
        const totalContent = loadedGuides.reduce((sum, guide) => sum + guide.metadata.totalContent, 0);
        const totalExercises = loadedGuides.reduce((sum, guide) => sum + guide.metadata.totalExercises, 0);
        const totalGuides = loadedGuides.length;
        
        console.log('Calculated stats:', { totalGuides, totalContent, totalExercises });
        
        setStats({
          totalGuides,
          totalContent,
          totalExercises,
          averageDifficulty: 'intermediate',
          categories: {
            'basic-structure': loadedGuides.filter(g => g.metadata.category === 'basic-structure').length,
            'complex-structure': loadedGuides.filter(g => g.metadata.category === 'complex-structure').length,
            'specialized': loadedGuides.filter(g => g.metadata.category === 'specialized').length,
            'cause-effect': loadedGuides.filter(g => g.metadata.category === 'cause-effect').length,
            'concepts': loadedGuides.filter(g => g.metadata.category === 'concepts').length,
            'problems': loadedGuides.filter(g => g.metadata.category === 'problems').length,
            'questions': loadedGuides.filter(g => g.metadata.category === 'questions').length,
            'verb-conjugation': loadedGuides.filter(g => g.metadata.category === 'verb-conjugation').length,
            'interview': loadedGuides.filter(g => g.metadata.category === 'interview').length
          }
        });
        
      } catch (error) {
        console.error('Error loading grammar data:', error);
        setStats({
          totalGuides: 0,
          totalContent: 0,
          totalExercises: 0,
          averageDifficulty: 'Intermediate',
          categories: {}
        });
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort guides
  const filteredAndSortedGuides = grammarGuides
    .filter(guide => {
      const matchesSearch = searchQuery === '' || 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.metadata.tags && guide.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
        guide.metadata.difficulty === selectedDifficulty;
      
      const matchesCategory = selectedCategory === 'all' || 
        guide.metadata.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.metadata.difficulty] - difficultyOrder[b.metadata.difficulty];
        case 'content':
          return b.metadata.totalContent - a.metadata.totalContent;
        case 'newest':
          return 0; // Remove lastUpdated sorting for now
        default:
          return 0;
      }
    });

  // Filter guides by category
  const basicStructureGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'basic-structure');
  const complexStructureGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'complex-structure');
  const causeEffectGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'cause-effect');
           const conceptsGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'concepts');
         const problemsGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'problems');
         const questionsGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'questions');
         const conjugationGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'verb-conjugation');
  
  const interviewGuides = filteredAndSortedGuides.filter(guide => guide.metadata.category === 'interview');

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

  // Sample featured guides for demonstration
  const featuredGuides = [
    {
      id: 'adverbs_grammar',
      title: 'Adverbs in English',
      description: 'Learn how to use adverbs effectively in sentences',
      category: 'basic-structure' as const,
      difficulty: 'beginner' as const,
      totalContent: 20,
      totalExercises: 6
    },
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
    },
    {
      id: 'software_development_problems',
      title: 'Software Development Problems',
      description: 'Learn common problems and solutions in software development',
      category: 'problems' as const,
      difficulty: 'intermediate' as const,
      totalContent: 50,
      totalExercises: 15
    },
    {
      id: 'software_development_questions',
      title: 'Software Development Questions',
      description: 'Master common questions and their contexts in software development',
      category: 'questions' as const,
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
                    <p className="text-sm font-medium text-purple-600">Total Exercises</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.totalExercises}</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
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
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/grammar/overview">
                <Button className="w-full h-16 text-lg" variant="outline">
                  <BookOpen className="h-6 w-6 mr-3" />
                  Browse All Guides
                </Button>
              </Link>
              
              <Link href="/practice">
                <Button className="w-full h-16 text-lg" variant="outline">
                  <Target className="h-6 w-6 mr-3" />
                  Practice Exercises
                </Button>
              </Link>
              
              <Link href="/progress">
                <Button className="w-full h-16 text-lg" variant="outline">
                  <TrendingUp className="h-6 w-6 mr-3" />
                  Track Progress
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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
                  <option value="verb-conjugation">Verb Conjugation</option>
                  <option value="interview">Interview</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="title">Sort by Title</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="content">Sort by Content</option>
                  <option value="newest">Sort by Newest</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Grammar Guides */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Grammar Guides
            </h2>
            <Link 
              href="/grammar/overview" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {guide.category.replace('-', ' ')}
                    </Badge>
                    <Badge variant={
                      guide.difficulty === 'beginner' ? 'default' : 
                      guide.difficulty === 'intermediate' ? 'secondary' : 
                      'destructive'
                    }>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{guide.totalContent} content items</span>
                    <span>{guide.totalExercises} exercises</span>
                  </div>
                  <Link href={`/grammar/guide/${guide.id}`}>
                    <Button className="w-full">Start Learning</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cause-Effect Grammar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Cause-Effect Grammar
            </h2>
            <Link
              href="/grammar/cause-effect"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Cause-Effect Guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {causeEffectGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/grammar/guide/${guide.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {guide.metadata.totalContent} content items
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Concepts Grammar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Concepts Grammar
            </h2>
            <Link
              href="/grammar/concepts"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Concepts Guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conceptsGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/grammar/guide/${guide.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {guide.metadata.totalContent} content items
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Problems Grammar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Problems Grammar
            </h2>
            <Link
              href="/grammar/problems"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Problems Guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemsGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/grammar/guide/${guide.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {guide.metadata.totalContent} content items
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

                         {/* Questions Grammar */}
                 <section className="mb-12">
                   <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                       Questions Grammar
                     </h2>
                     <Link
                       href="/grammar/questions"
                       className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                     >
                       View All Questions Guides →
                     </Link>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {questionsGuides.map((guide) => (
                       <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                         <Link href={`/grammar/guide/${guide.id}`}>
                           <CardHeader>
                             <div className="flex items-center justify-between mb-2">
                               <CardTitle className="text-lg">{guide.title}</CardTitle>
                               <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                             </div>
                             <CardDescription>{guide.description}</CardDescription>
                           </CardHeader>
                           <CardContent>
                             <div className="flex items-center text-sm text-muted-foreground">
                               <BookOpen className="h-4 w-4 mr-1" />
                               {guide.metadata.totalContent} questions
                             </div>
                           </CardContent>
                         </Link>
                       </Card>
                     ))}
                   </div>
                 </section>

                 {/* Verb Conjugation Grammar */}
                 <section className="mb-12">
                   <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                       Verb Conjugation Grammar
                     </h2>
                     <div className="flex gap-3">
                       <Link
                         href="/grammar/verb-conjugation"
                         className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                       >
                         View All Conjugation Guides →
                       </Link>
                       <Link
                         href="/grammar/guide/verb_conjugation_guide"
                         className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                       >
                         Study Complete Guide →
                       </Link>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {conjugationGuides.map((guide) => (
                       <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                         <Link href={`/grammar/guide/${guide.id}`}>
                           <CardHeader>
                             <div className="flex items-center justify-between mb-2">
                               <CardTitle className="text-lg">{guide.title}</CardTitle>
                               <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                             </div>
                             <CardDescription>{guide.description}</CardDescription>
                           </CardHeader>
                           <CardContent>
                             <div className="flex items-center text-sm text-muted-foreground">
                               <BookOpen className="h-4 w-4 mr-1" />
                               {guide.metadata.totalContent} conjugations
                             </div>
                           </CardContent>
                         </Link>
                       </Card>
                     ))}
                   </div>
                 </section>
                 
                 {/* Interview Grammar */}
                 <section className="mb-12">
                   <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                       Interview Grammar
                     </h2>
                     <div className="flex gap-3">
                       <Link
                         href="/grammar/interview"
                         className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                       >
                         View All Interview Guides →
                       </Link>
                       <Link
                         href="/grammar/guide/interview_preparation_guide"
                         className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                       >
                         Study Preparation Guide →
                       </Link>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {interviewGuides.map((guide) => (
                       <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                         <Link href={`/grammar/guide/${guide.id}`}>
                           <CardHeader>
                             <div className="flex items-center justify-between mb-2">
                               <CardTitle className="text-lg">{guide.title}</CardTitle>
                               <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                             </div>
                             <CardDescription>{guide.description}</CardDescription>
                           </CardHeader>
                           <CardContent>
                             <div className="flex items-center text-sm text-muted-foreground">
                               <BookOpen className="h-4 w-4 mr-1" />
                               {guide.metadata.totalContent} questions
                             </div>
                           </CardContent>
                         </Link>
                       </Card>
                     ))}
                   </div>
                 </section>

        {/* View All Guides Button */}
        {filteredAndSortedGuides.length > 6 && (
          <div className="text-center mb-8">
            <Link href="/grammar/overview">
              <Button size="lg" variant="outline">
                View All {filteredAndSortedGuides.length} Grammar Guides
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {filteredAndSortedGuides.length === 0 && (
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