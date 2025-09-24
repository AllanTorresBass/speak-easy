'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Star, 
  Award,
  BookOpen,
  Brain,
  Users,
  MessageCircle,
  PenTool,
  Mic,
  Type,
  Globe,
  Zap,
  Flame,
  CheckCircle,
  XCircle,
  Minus,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Download,
  Share2,
  Filter,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Lightbulb,
  CalendarDays,
  Clock3,
  TrendingDown,
  BookMarked,
  Languages,
  Smartphone,
  Monitor,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Target,
  Trophy
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockOverallProgress = {
  totalScore: 87.5,
  weeklyChange: 2.3,
  monthlyChange: 8.7,
  streak: 12,
  totalStudyTime: 156.5,
  averageDailyTime: 2.2,
  lessonsCompleted: 45,
  totalLessons: 60,
  vocabularyWords: 1247,
  targetWords: 2000,
  grammarLessons: 23,
  targetGrammar: 30
};

const mockSkillProgress = [
  {
    skill: 'Speaking',
    currentLevel: 'Intermediate',
    progress: 75,
    weeklyChange: 3.2,
    monthlyChange: 12.5,
    exercises: 156,
    accuracy: 82.3,
    fluency: 78.9,
    pronunciation: 85.2,
    icon: Mic
  },
  {
    skill: 'Listening',
    currentLevel: 'Advanced',
    progress: 88,
    weeklyChange: 1.8,
    monthlyChange: 6.3,
    exercises: 203,
    accuracy: 89.7,
    comprehension: 91.2,
    accentRecognition: 87.4,
    icon: Headphones
  },
  {
    skill: 'Reading',
    currentLevel: 'Intermediate',
    progress: 62,
    weeklyChange: 4.1,
    monthlyChange: 15.2,
    exercises: 134,
    accuracy: 76.8,
    speed: 68.3,
    comprehension: 71.5,
    icon: BookOpen
  },
  {
    skill: 'Writing',
    currentLevel: 'Beginner',
    progress: 45,
    weeklyChange: 5.7,
    monthlyChange: 18.9,
    exercises: 89,
    accuracy: 72.1,
    grammar: 68.7,
    vocabulary: 74.3,
    icon: PenTool
  },
  {
    skill: 'Grammar',
    currentLevel: 'Intermediate',
    progress: 71,
    weeklyChange: 2.9,
    monthlyChange: 9.8,
    exercises: 178,
    accuracy: 79.4,
    understanding: 76.8,
    application: 82.1,
    icon: Brain
  },
  {
    skill: 'Vocabulary',
    currentLevel: 'Advanced',
    progress: 82,
    weeklyChange: 1.5,
    monthlyChange: 4.2,
    exercises: 267,
    accuracy: 88.6,
    retention: 85.3,
    usage: 89.7,
    icon: BookMarked
  }
];

const mockWeeklyData = [
  { day: 'Mon', studyTime: 2.5, lessons: 3, score: 85, streak: 1 },
  { day: 'Tue', studyTime: 3.2, lessons: 4, score: 88, streak: 2 },
  { day: 'Wed', studyTime: 1.8, lessons: 2, score: 82, streak: 3 },
  { day: 'Thu', studyTime: 2.9, lessons: 3, score: 87, streak: 4 },
  { day: 'Fri', studyTime: 3.5, lessons: 4, score: 91, streak: 5 },
  { day: 'Sat', studyTime: 2.1, lessons: 2, score: 84, streak: 6 },
  { day: 'Sun', studyTime: 2.8, lessons: 3, score: 89, streak: 7 }
];

const mockAchievements = [
  {
    id: '1',
    title: '7-Day Streak',
    description: 'Maintained study streak for 7 consecutive days',
    icon: Flame,
    unlockedAt: '2024-01-15',
    category: 'consistency',
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Vocabulary Master',
    description: 'Learned 1000+ vocabulary words',
    icon: BookMarked,
    unlockedAt: '2024-01-10',
    category: 'vocabulary',
    rarity: 'rare'
  },
  {
    id: '3',
    title: 'Grammar Guru',
    description: 'Completed 20 grammar lessons',
    icon: Brain,
    unlockedAt: '2024-01-08',
    category: 'grammar',
    rarity: 'uncommon'
  },
  {
    id: '4',
    title: 'Speaking Champion',
    description: 'Achieved 80%+ accuracy in speaking exercises',
    icon: Mic,
    unlockedAt: '2024-01-05',
    category: 'speaking',
    rarity: 'rare'
  },
  {
    id: '5',
    title: 'Listening Expert',
    description: 'Completed 50 listening exercises',
    icon: Headphones,
    unlockedAt: '2024-01-03',
    category: 'listening',
    rarity: 'uncommon'
  },
  {
    id: '6',
    title: 'Writing Wizard',
    description: 'Wrote 25 essays with 90%+ grammar accuracy',
    icon: PenTool,
    unlockedAt: '2024-01-01',
    category: 'writing',
    rarity: 'epic'
  }
];

const mockGoals = [
  {
    id: '1',
    title: 'Complete Basic Grammar',
    description: 'Finish all basic grammar lessons',
    target: 15,
    current: 12,
    deadline: '2024-02-15',
    priority: 'high',
    category: 'grammar'
  },
  {
    id: '2',
    title: 'Learn 500 New Words',
    description: 'Expand vocabulary by 500 words',
    target: 500,
    current: 347,
    deadline: '2024-03-01',
    priority: 'medium',
    category: 'vocabulary'
  },
  {
    id: '3',
    title: 'Achieve B2 Level',
    description: 'Reach B2 proficiency level',
    target: 100,
    current: 68,
    deadline: '2024-06-01',
    priority: 'high',
    category: 'overall'
  },
  {
    id: '4',
    title: 'Daily Practice',
    description: 'Study for at least 2 hours daily',
    target: 30,
    current: 18,
    deadline: '2024-02-01',
    priority: 'medium',
    category: 'consistency'
  }
];

export default function ProgressPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressVariant = (progress: number) => {
    if (progress >= 80) return 'default';
    if (progress >= 60) return 'secondary';
    if (progress >= 40) return 'outline';
    return 'destructive';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Progress & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning journey with detailed analytics and insights
        </p>
      </div>

      {/* Overall Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockOverallProgress.totalScore}%</p>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <div className="flex items-center gap-1 text-xs">
                  {getChangeIcon(mockOverallProgress.weeklyChange)}
                  <span className={getChangeColor(mockOverallProgress.weeklyChange)}>
                    {Math.abs(mockOverallProgress.weeklyChange)}% this week
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{mockOverallProgress.streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{mockOverallProgress.totalStudyTime}h</p>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
                <p className="text-xs text-muted-foreground">
                  {mockOverallProgress.averageDailyTime}h/day avg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{mockOverallProgress.lessonsCompleted}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-xs text-muted-foreground">
                  {mockOverallProgress.totalLessons} total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary Progress</CardTitle>
            <CardDescription>Track your vocabulary learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Words Learned</span>
              <span className="text-sm text-muted-foreground">
                {mockOverallProgress.vocabularyWords} / {mockOverallProgress.targetWords}
              </span>
            </div>
            <Progress 
              value={(mockOverallProgress.vocabularyWords / mockOverallProgress.targetWords) * 100} 
              className="h-2" 
            />
            <div className="text-sm text-muted-foreground">
              {Math.round((mockOverallProgress.vocabularyWords / mockOverallProgress.targetWords) * 100)}% complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grammar Progress</CardTitle>
            <CardDescription>Monitor your grammar lesson completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lessons Completed</span>
              <span className="text-sm text-muted-foreground">
                {mockOverallProgress.grammarLessons} / {mockOverallProgress.targetGrammar}
              </span>
            </div>
            <Progress 
              value={(mockOverallProgress.grammarLessons / mockOverallProgress.targetGrammar) * 100} 
              className="h-2" 
            />
            <div className="text-sm text-muted-foreground">
              {Math.round((mockOverallProgress.grammarLessons / mockOverallProgress.targetGrammar) * 100)}% complete
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Weekly Performance
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Your study performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWeeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {day.day}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{day.studyTime}h study time</p>
                          <p className="text-xs text-muted-foreground">
                            {day.lessons} lessons, Score: {day.score}%
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{day.streak} day streak</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
                <CardDescription>Key insights about your learning patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Consistent Learning
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      You&apos;ve maintained a 12-day study streak
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Strong Progress
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Your overall score increased by 8.7% this month
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Areas for Focus
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Writing skills could use more practice
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Skills</option>
                <option value="speaking">Speaking</option>
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="grammar">Grammar</option>
                <option value="vocabulary">Vocabulary</option>
              </select>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
            >
              {showDetailedMetrics ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetailedMetrics ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSkillProgress
              .filter(skill => selectedSkill === 'all' || skill.skill.toLowerCase() === selectedSkill.toLowerCase())
              .map((skill, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <skill.icon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{skill.skill}</CardTitle>
                      </div>
                      <Badge variant={getProgressVariant(skill.progress)}>
                        {skill.currentLevel}
                      </Badge>
                    </div>
                    <CardDescription>
                      {skill.exercises} exercises completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className={`font-medium ${getProgressColor(skill.progress)}`}>
                          {skill.progress}%
                        </span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>

                    {showDetailedMetrics && (
                      <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span>Accuracy</span>
                          <span className="font-medium">{skill.accuracy}%</span>
                        </div>
                        {skill.skill === 'Speaking' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span>Fluency</span>
                              <span className="font-medium">{skill.fluency}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Pronunciation</span>
                              <span className="font-medium">{skill.pronunciation}%</span>
                            </div>
                          </>
                        )}
                        {skill.skill === 'Listening' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span>Comprehension</span>
                              <span className="font-medium">{skill.comprehension}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Accent Recognition</span>
                              <span className="font-medium">{skill.accentRecognition}%</span>
                            </div>
                          </>
                        )}
                        {skill.skill === 'Reading' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span>Speed</span>
                              <span className="font-medium">{skill.speed}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Comprehension</span>
                              <span className="font-medium">{skill.comprehension}%</span>
                            </div>
                          </>
                        )}
                        {skill.skill === 'Writing' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span>Grammar</span>
                              <span className="font-medium">{skill.grammar}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Vocabulary</span>
                              <span className="font-medium">{skill.vocabulary}%</span>
                            </div>
                          </>
                        )}
                        {skill.skill === 'Grammar' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span>Understanding</span>
                              <span className="font-medium">{skill.understanding}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Application</span>
                              <span className="font-medium">{skill.application}%</span>
                            </div>
                          </>
                        )}
                        {skill.skill === 'Vocabulary' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span>Retention</span>
                              <span className="font-medium">{skill.retention}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Usage</span>
                              <span className="font-medium">{skill.usage}%</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Weekly: {getChangeIcon(skill.weeklyChange)} {Math.abs(skill.weeklyChange)}%</span>
                      <span>Monthly: {getChangeIcon(skill.monthlyChange)} {Math.abs(skill.monthlyChange)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Learning Timeline
                <div className="flex gap-2">
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </CardTitle>
              <CardDescription>
                Track your learning progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {mockWeeklyData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground">{day.day}</div>
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(day.studyTime / 4) * 100}px` }}
                    ></div>
                    <div className="text-xs font-medium">{day.studyTime}h</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Learning Goals</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      {goal.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-muted-foreground">
                        {goal.current} / {goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {Math.round((goal.current / goal.target) * 100)}% complete
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Deadline</span>
                    <span className="text-muted-foreground">{goal.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Category</span>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                    <achievement.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline">{achievement.category}</Badge>
                    <Badge variant={achievement.rarity === 'epic' ? 'destructive' : achievement.rarity === 'rare' ? 'default' : 'secondary'}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Unlocked on {achievement.unlockedAt}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 