'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Star,
  TrendingUp,
  BookMarked,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface PromovaVocabularyCardProps {
  list: {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    wordCount: number;
    estimatedTime: number;
    tags: string[];
    category: string;
  };
  progress?: {
    wordsLearned: number;
    totalWords: number;
    masteryLevel: number;
    averageScore: number;
    lastStudied?: Date;
  };
}

export function PromovaVocabularyCard({ list, progress }: PromovaVocabularyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  // Get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Star className="h-4 w-4 text-green-600" />;
      case 'intermediate':
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'advanced':
        return <Lightbulb className="h-4 w-4 text-red-600" />;
      default:
        return <BookMarked className="h-4 w-4 text-gray-600" />;
    }
  };

  const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isHovered ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getDifficultyIcon(list.difficulty)}
              <CardTitle className="text-lg leading-tight">{list.title}</CardTitle>
            </div>
            <CardDescription className="line-clamp-2 text-sm">
              {list.description}
            </CardDescription>
          </div>
          <Badge className={`${getDifficultyColor(list.difficulty)} text-xs font-medium`}>
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

        {/* Promova Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">
            <BookMarked className="h-3 w-3 mr-1" />
            Promova
          </Badge>
          <Badge variant="outline" className="text-xs">
            {list.category}
          </Badge>
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
              {progress ? 'Continue' : 'Start Learning'}
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

        {/* New List Indicator */}
        {!progress && (
          <div className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
            ✨ New vocabulary list available!
          </div>
        )}
      </CardContent>
    </Card>
  );
} 