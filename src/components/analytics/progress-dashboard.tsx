'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Trophy, 
  Calendar,
  Clock,
  Star,
  Award,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { useUserProgressAnalytics } from '@/hooks/use-progress-analytics';
import { useSession } from 'next-auth/react';

export function ProgressDashboard() {
  const { data: session } = useSession();
  const { data: analytics, isLoading, error } = useUserProgressAnalytics(session?.user?.id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">Error loading progress analytics</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const { overview, weeklyProgress, categoryBreakdown, recentActivity, achievements } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your learning journey and celebrate achievements
          </p>
        </div>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words Learned</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalWordsLearned}</div>
            <p className="text-xs text-muted-foreground">
              of {overview.totalWords} total words
            </p>
            <Progress value={overview.overallMastery * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Longest: {overview.longestStreak} days
            </p>
            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < overview.currentStreak ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalStudySessions}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overview.averageScore)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all exercises
            </p>
            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(overview.averageScore / 20) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Categories</CardTitle>
                <CardDescription>
                  Your progress across different learning areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Vocabulary</span>
                    </div>
                    <Badge variant="outline">{categoryBreakdown.vocabulary.items} lists</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mastery Level</span>
                      <span>{Math.round(categoryBreakdown.vocabulary.mastery * 100)}%</span>
                    </div>
                    <Progress value={categoryBreakdown.vocabulary.mastery * 100} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {categoryBreakdown.vocabulary.sessions} study sessions completed
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Grammar</span>
                    </div>
                    <Badge variant="outline">{categoryBreakdown.grammar.items} lessons</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mastery Level</span>
                      <span>{Math.round(categoryBreakdown.grammar.mastery * 100)}%</span>
                    </div>
                    <Progress value={categoryBreakdown.grammar.mastery * 100} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {categoryBreakdown.grammar.sessions} study sessions completed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>
                  Track your progress toward key milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Learn 100 words</span>
                    <span className="text-sm font-medium">{overview.totalWordsLearned}/100</span>
                  </div>
                  <Progress value={Math.min(overview.totalWordsLearned / 100 * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Complete 10 lessons</span>
                    <span className="text-sm font-medium">{overview.totalStudySessions}/10</span>
                  </div>
                  <Progress value={Math.min(overview.totalStudySessions / 10 * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Maintain 7-day streak</span>
                    <span className="text-sm font-medium">{overview.currentStreak}/7</span>
                  </div>
                  <Progress value={Math.min(overview.currentStreak / 7 * 100, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Learning Activity</CardTitle>
              <CardDescription>
                Your daily learning progress over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">{day.day}</div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-blue-600">{day.words}</div>
                      <div className="text-xs text-muted-foreground">words</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-purple-600">{day.lessons}</div>
                      <div className="text-xs text-muted-foreground">lessons</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Unlock badges by reaching learning milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`text-center p-4 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <div className="flex items-center justify-center space-x-1 text-yellow-600">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Locked</div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Activity</CardTitle>
              <CardDescription>
                Your latest study sessions and progress updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'vocabulary' 
                        ? 'bg-blue-100 dark:bg-blue-900/20' 
                        : 'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      {activity.type === 'vocabulary' ? (
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.wordsLearned}/{activity.totalWords} completed • Score: {activity.averageScore}%
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(activity.lastStudied).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 