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
  BookOpen, 
  Clock, 
  Target, 
  Search, 
  Filter,
  Play,
  BarChart3,
  Star,
  TrendingUp
} from 'lucide-react';
import { useVocabularyLists, useUserProgress } from '@/hooks/use-vocabulary';
import { useSession } from 'next-auth/react';

export function VocabularyList() {
  const { data: session } = useSession();
  const { data: vocabularyLists, isLoading: listsLoading, error: listsError } = useVocabularyLists();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress(session?.user?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Filter and sort vocabulary lists
  const filteredLists = vocabularyLists?.filter(list => {
    const matchesSearch = list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'all' || list.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      case 'wordCount':
        return b.wordCount - a.wordCount;
      case 'estimatedTime':
        return a.estimatedTime - b.estimatedTime;
      default:
        return a.title.localeCompare(b.title);
    }
  }) || [];

  // Get progress for a specific list
  const getProgress = (listId: string) => {
    return userProgress?.find(progress => progress.vocabularyListId === listId);
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

  if (listsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Vocabulary Lists</h1>
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

  if (listsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">Error loading vocabulary lists</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vocabulary Lists</h1>
          <p className="text-muted-foreground mt-1">
            Choose from our curated vocabulary lists to expand your English skills
          </p>
        </div>
        <Button asChild>
          <Link href="/vocabulary/practice">
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
            placeholder="Search vocabulary lists..."
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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="wordCount">Word Count</SelectItem>
            <SelectItem value="estimatedTime">Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLists.length} of {vocabularyLists?.length || 0} vocabulary lists
      </div>

      {/* Vocabulary Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => {
          const progress = getProgress(list.id);
          const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;
          
          return (
            <Card key={list.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{list.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {list.description}
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(list.difficulty)}>
                    {list.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{list.wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{list.estimatedTime} min</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {list.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {list.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{list.tags.length - 3}
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
                    <Link href={`/vocabulary/${list.id}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      {progress ? 'Continue' : 'Start'}
                    </Link>
                  </Button>
                  {progress && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/vocabulary/${list.id}/practice`}>
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
      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No vocabulary lists found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setDifficultyFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 