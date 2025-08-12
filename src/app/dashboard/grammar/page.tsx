'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Search,
  Play,
  Bookmark,
  Star,
  Brain,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Settings,
  Download,
  Share2,
  Filter,
  SortAsc,
  SortDesc,
  GraduationCap,
  FileText,
  Video,
  Headphones,
  PenTool,
  Users,
  Calendar,
  Award,
  Trophy,
  Zap,
  Flame,
  TrendingDown,
  BookMarked,
  Home,
  Monitor,
  Smartphone,
  Globe,
  Languages
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockGrammarStats = {
  totalLessons: 6,
  totalExercises: 130,
  averageProgress: 42.5,
  studyTimeToday: 3.2
};

const mockGrammarLessons = [
  {
    id: '1',
    title: 'Present Simple vs Present Continuous',
    description: 'Learn the difference between these two fundamental tenses and when to use each one.',
    difficulty: 'Beginner',
    category: 'Tenses',
    duration: '45 min',
    exercises: 25,
    completed: 18,
    rating: 4.7,
    isBookmarked: true,
    instructor: 'Dr. Sarah Johnson',
    lastUpdated: '2 days ago',
    tags: ['Present Tense', 'Continuous', 'Basic']
  },
  {
    id: '2',
    title: 'Past Perfect Tense',
    description: 'Master the past perfect tense and its usage in complex sentences.',
    difficulty: 'Intermediate',
    category: 'Tenses',
    duration: '60 min',
    exercises: 30,
    completed: 22,
    rating: 4.5,
    isBookmarked: false,
    instructor: 'Prof. Michael Chen',
    lastUpdated: '1 week ago',
    tags: ['Past Tense', 'Perfect', 'Intermediate']
  },
  {
    id: '3',
    title: 'Conditional Sentences',
    description: 'Learn all four types of conditional sentences with examples.',
    difficulty: 'Advanced',
    category: 'Conditionals',
    duration: '75 min',
    exercises: 35,
    completed: 28,
    rating: 4.8,
    isBookmarked: true,
    instructor: 'Dr. Emma Davis',
    lastUpdated: '3 days ago',
    tags: ['Conditionals', 'Advanced', 'Complex']
  },
  {
    id: '4',
    title: 'Passive Voice',
    description: 'Understand when and how to use passive voice effectively.',
    difficulty: 'Intermediate',
    category: 'Voice',
    duration: '50 min',
    exercises: 28,
    completed: 15,
    rating: 4.3,
    isBookmarked: false,
    instructor: 'Prof. David Wilson',
    lastUpdated: '5 days ago',
    tags: ['Passive', 'Voice', 'Intermediate']
  },
  {
    id: '5',
    title: 'Relative Clauses',
    description: 'Master relative clauses and their role in complex sentence structures.',
    difficulty: 'Advanced',
    category: 'Clauses',
    duration: '65 min',
    exercises: 32,
    completed: 20,
    rating: 4.6,
    isBookmarked: true,
    instructor: 'Dr. Lisa Brown',
    lastUpdated: '1 day ago',
    tags: ['Clauses', 'Advanced', 'Complex']
  },
  {
    id: '6',
    title: 'Modal Verbs',
    description: 'Learn the different uses of modal verbs in English.',
    difficulty: 'Intermediate',
    category: 'Verbs',
    duration: '55 min',
    exercises: 26,
    completed: 19,
    rating: 4.4,
    isBookmarked: false,
    instructor: 'Prof. Robert Taylor',
    lastUpdated: '4 days ago',
    tags: ['Modals', 'Verbs', 'Intermediate']
  }
];

const mockRecentProgress = [
  {
    id: '1',
    lesson: 'Present Simple vs Present Continuous',
    progress: 72,
    exercisesCompleted: 18,
    totalExercises: 25,
    lastStudied: '2 hours ago',
    accuracy: 85
  },
  {
    id: '2',
    lesson: 'Past Perfect Tense',
    progress: 73,
    exercisesCompleted: 22,
    totalExercises: 30,
    lastStudied: '1 day ago',
    accuracy: 78
  },
  {
    id: '3',
    lesson: 'Conditional Sentences',
    progress: 80,
    exercisesCompleted: 28,
    totalExercises: 35,
    lastStudied: '3 days ago',
    accuracy: 82
  }
];

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredLessons = mockGrammarLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Grammar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master English grammar through structured lessons, interactive exercises, and comprehensive practice.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockGrammarStats.totalLessons}</p>
                <p className="text-sm text-muted-foreground">Grammar Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockGrammarStats.totalExercises}</p>
                <p className="text-sm text-muted-foreground">Total Exercises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockGrammarStats.averageProgress}%</p>
                <p className="text-sm text-muted-foreground">Average Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockGrammarStats.studyTimeToday}h</p>
                <p className="text-sm text-muted-foreground">Study Time Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="lessons" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Exercises</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Learning Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search grammar lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Tenses">Tenses</option>
                <option value="Conditionals">Conditionals</option>
                <option value="Voice">Voice</option>
                <option value="Clauses">Clauses</option>
                <option value="Verbs">Verbs</option>
              </select>
              <Button className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Start Learning</span>
              </Button>
            </div>
          </div>

          {/* Grammar Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{lesson.difficulty}</Badge>
                      <Badge variant="secondary">{lesson.category}</Badge>
                    </div>
                    <Bookmark className={`h-4 w-4 cursor-pointer hover:text-primary ${
                      lesson.isBookmarked ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                  <CardDescription className="text-sm">{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{lesson.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Exercises</span>
                      <span className="font-medium">{lesson.completed}/{lesson.exercises}</span>
                    </div>
                    <Progress value={(lesson.completed / lesson.exercises) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{lesson.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="font-medium">{lesson.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Updated</span>
                      <span className="font-medium">{lesson.lastUpdated}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lesson.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Lesson
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
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Practice</CardTitle>
                <CardDescription>Test your grammar knowledge with quick exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a lesson to start practicing grammar exercises
                    </p>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercise Types</CardTitle>
                <CardDescription>Different types of grammar exercises available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Fill in the Blanks</span>
                    </div>
                    <Badge variant="secondary">25 exercises</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Multiple Choice</span>
                    </div>
                    <Badge variant="secondary">30 exercises</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <PenTool className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Sentence Correction</span>
                    </div>
                    <Badge variant="secondary">20 exercises</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your grammar mastery over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Beginner Level</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Intermediate Level</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Advanced Level</span>
                      <span className="text-sm text-muted-foreground">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Progress</CardTitle>
                <CardDescription>Your latest grammar achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentProgress.map((progress) => (
                    <div key={progress.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{progress.lesson}</h4>
                        <Badge variant="outline">{progress.progress}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Exercises: {progress.exercisesCompleted}/{progress.totalExercises}</span>
                          <span>Accuracy: {progress.accuracy}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Last studied: {progress.lastStudied}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grammar Checker</CardTitle>
                <CardDescription>Check your writing for grammar errors</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <PenTool className="h-4 w-4 mr-2" />
                  Check Text
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Lessons</CardTitle>
                <CardDescription>Watch grammar explanations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Tests</CardTitle>
                <CardDescription>Take comprehensive grammar tests</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Start Test
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Groups</CardTitle>
                <CardDescription>Learn with other students</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Materials</CardTitle>
                <CardDescription>Get grammar resources offline</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grammar Rules</CardTitle>
                <CardDescription>Quick reference guide</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Rules
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 