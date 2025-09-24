'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Award } from 'lucide-react';

// Mock achievements data - in a real app, this would come from your API
const mockAchievements = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first vocabulary lesson',
    icon: '🎯',
    category: 'beginner',
    unlocked: true,
    unlockedAt: '2024-01-15',
    progress: 100,
  },
  {
    id: '2',
    title: 'Vocabulary Master',
    description: 'Learn 100 new words',
    icon: '📚',
    category: 'intermediate',
    unlocked: true,
    unlockedAt: '2024-01-20',
    progress: 100,
  },
  {
    id: '3',
    title: 'Grammar Guru',
    description: 'Complete 10 grammar lessons',
    icon: '✍️',
    category: 'intermediate',
    unlocked: false,
    progress: 70,
  },
  {
    id: '4',
    title: 'Streak Master',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    category: 'advanced',
    unlocked: false,
    progress: 5,
  },
  {
    id: '5',
    title: 'Perfect Score',
    description: 'Get 100% on a practice test',
    icon: '🏆',
    category: 'advanced',
    unlocked: false,
    progress: 0,
  },
];

const categoryColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function AchievementsPage() {
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked);
  const lockedAchievements = mockAchievements.filter(a => !a.unlocked);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Achievements
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and unlock achievements as you learn
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAchievements.length}</div>
            <p className="text-xs text-muted-foreground">
              Available to unlock
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unlocked</CardTitle>
            <Star className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((unlockedAchievements.length / mockAchievements.length) * 100)}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="h-full sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lockedAchievements.find(a => a.progress > 0)?.title || 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep learning to unlock more
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Unlocked Achievements ({unlockedAchievements.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {unlockedAchievements.map((achievement) => (
            <Card key={achievement.id} className="h-full border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">{achievement.icon}</div>
                  <Badge className={categoryColors[achievement.category as keyof typeof categoryColors]}>
                    {achievement.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2">{achievement.title}</CardTitle>
                <CardDescription className="text-sm">{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Unlocked on {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'N/A'}</span>
                  <Award className="h-4 w-4 text-green-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Available Achievements ({lockedAchievements.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {lockedAchievements.map((achievement) => (
            <Card key={achievement.id} className="h-full border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl opacity-50">{achievement.icon}</div>
                  <Badge variant="secondary" className={categoryColors[achievement.category as keyof typeof categoryColors]}>
                    {achievement.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg opacity-75 mb-2">{achievement.title}</CardTitle>
                <CardDescription className="text-sm">{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Keep learning to unlock this achievement
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 