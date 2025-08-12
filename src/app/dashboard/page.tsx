'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Flame,
  Brain,
  Mic,
  Headphones,
  PenTool,
  BookMarked,
  ArrowRight,
  Play,
  CalendarDays,
  Award,
  Zap,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

// Mock data - in a real app, this would come from your API
const mockStats = {
  totalLessons: 45,
  completedLessons: 32,
  totalStudyTime: 156.5,
  averageDailyTime: 2.2,
  currentStreak: 12,
  totalScore: 87.5,
  weeklyProgress: 8.3,
  monthlyProgress: 15.7
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'vocabulary',
    title: 'Completed Vocabulary Lesson 15',
    description: 'Learned 20 new words about technology',
    time: '2 hours ago',
    icon: BookOpen,
    color: 'text-blue-600'
  },
  {
    id: '2',
    type: 'grammar',
    title: 'Finished Grammar Exercise',
    description: 'Past perfect tense practice completed',
    time: '1 day ago',
    icon: Brain,
    color: 'text-purple-600'
  },
  {
    id: '3',
    type: 'practice',
    title: 'Speaking Practice Session',
    description: '15-minute conversation practice',
    time: '2 days ago',
    icon: Mic,
    color: 'text-green-600'
  },
  {
    id: '4',
    type: 'listening',
    title: 'Listening Comprehension',
    description: 'Completed audio exercise on business English',
    time: '3 days ago',
    icon: Headphones,
    color: 'text-orange-600'
  }
];

const mockQuickActions = [
  {
    title: 'Start Practice',
    description: 'Begin a new practice session',
    icon: Play,
    href: '/dashboard/practice',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Review Vocabulary',
    description: 'Go through recent words',
    icon: BookOpen,
    href: '/dashboard/vocabulary',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Grammar Check',
    description: 'Review grammar concepts',
    icon: Brain,
    href: '/dashboard/grammar',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: 'View Progress',
    description: 'Check your learning stats',
    icon: TrendingUp,
    href: '/dashboard/progress',
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

const mockUpcomingGoals = [
  {
    title: 'Complete Basic Grammar',
    progress: 75,
    target: '80%',
    deadline: 'Next week',
    category: 'grammar'
  },
  {
    title: 'Learn 500 New Words',
    progress: 60,
    target: '500 words',
    deadline: 'End of month',
    category: 'vocabulary'
  },
  {
    title: 'Achieve B2 Level',
    progress: 45,
    target: 'B2 proficiency',
    deadline: '3 months',
    category: 'overall'
  }
];

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to continue your English learning journey? Here's your progress overview.
        </p>
      </div>

      {/* Main Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockStats.completedLessons}/{mockStats.totalLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <div className="text-xs text-muted-foreground">
                  {Math.round((mockStats.completedLessons / mockStats.totalLessons) * 100)}% complete
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockStats.totalStudyTime}h</p>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
                <div className="text-xs text-muted-foreground">
                  {mockStats.averageDailyTime}h/day avg
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockStats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <div className="text-xs text-muted-foreground">
                  Keep it going!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockStats.totalScore}%</p>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <div className="text-xs text-muted-foreground">
                  +{mockStats.weeklyProgress}% this week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockQuickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {mockRecentActivity.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`${activity.color} p-2 rounded-lg flex-shrink-0`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View All Activity
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Upcoming Goals */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Goals
          </h2>
          <div className="space-y-4">
            {mockUpcomingGoals.map((goal, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Target: {goal.target}</span>
                      <span>Due: {goal.deadline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Manage Goals
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Learning Tip of the Day
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Consistency is key! Even 15 minutes of daily practice is more effective than 2 hours once a week.
                  Try to maintain your current {mockStats.currentStreak}-day streak!
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4 flex-shrink-0" />
                  <span>Your streak: {mockStats.currentStreak} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 