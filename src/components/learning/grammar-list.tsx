'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Search, 
  Play,
  BarChart3,
  Star,
  Target,
  CheckCircle
} from 'lucide-react';
import { useGrammarLessons, useUserGrammarProgress } from '@/hooks/use-grammar';
import { useSession } from 'next-auth/react';

export function GrammarList() {
  const { data: session } = useSession();
  const { data: grammarLessons, isLoading: lessonsLoading, error: lessonsError } = useGrammarLessons();
  const { data: userProgress, isLoading: progressLoading } = useUserGrammarProgress(session?.user?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Filter and sort grammar lessons
  const filteredLessons = grammarLessons?.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'all' || lesson.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || lesson.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      case 'lessonCount':
        return b.lessonCount - a.lessonCount;
      case 'estimatedTime':
        return a.estimatedTime - b.estimatedTime;
      default:
        return a.title.localeCompare(b.title);
    }
  }) || [];

  // Get progress for a specific lesson
  const getProgress = (lessonId: string) => {
    return userProgress?.find(progress => progress.vocabularyListId === lessonId);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic-structure':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'complex-structure':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'verb-conjugation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cause-effect':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (lessonsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Grammar Lessons</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">Error loading grammar lessons</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Grammar Lessons</h1>
          <p className="text-muted-foreground mt-1">
            Master English grammar with structured lessons and interactive exercises
          </p>
        </div>
        <Button asChild>
          <Link href="/grammar/practice">
            <Play className="w-4 h-4 mr-2" />
            Start Practice
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search grammar lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="basic-structure">Basic Structure</SelectItem>
            <SelectItem value="complex-structure">Complex Structure</SelectItem>
            <SelectItem value="verb-conjugation">Verb Conjugation</SelectItem>
            <SelectItem value="cause-effect">Cause & Effect</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="lessonCount">Lesson Count</SelectItem>
            <SelectItem value="estimatedTime">Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLessons.length} of {grammarLessons?.length || 0} grammar lessons
      </div>

      {/* Grammar Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const progress = getProgress(lesson.id);
          const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;
          
          return (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {lesson.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty}
                  </Badge>
                  <Badge className={getCategoryColor(lesson.category)}>
                    {lesson.category.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{lesson.lessonCount} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.estimatedTime} min</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {lesson.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{lesson.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                {progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{progress.wordsLearned}/{progress.totalWords}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Mastery: {Math.round(progress.masteryLevel * 100)}%</span>
                      <span>Score: {progress.averageScore}%</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/grammar/${lesson.id}`}>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {progress ? 'Continue' : 'Start'}
                    </Link>
                  </Button>
                  {progress && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/grammar/${lesson.id}/practice`}>
                        <Target className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Last Studied */}
                {progress?.lastStudied && (
                  <div className="text-xs text-muted-foreground text-center">
                    Last studied: {progress.lastStudied.toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No grammar lessons found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setDifficultyFilter('all');
            setCategoryFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 