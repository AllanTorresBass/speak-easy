'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Target,
  Search,
  Play,
  Mic,
  Headphones,
  Flame,
  TrendingUp,
  Bookmark,
  Timer,
  Users,
  Trophy,
  Brain,
  BookOpen,
  Lightbulb,
  Repeat,
  Shuffle,
  Share2,
  Download,
  Eye,
  EyeOff,
  FileText,
  Video,
  Award,
  MicOff,
  Volume2,
  VolumeX,
  Zap,
  MessageCircle,
  PenTool,
  Type,
  Languages,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  Calendar,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  RefreshCw,
  Settings,
  CalendarDays,
  Clock3,
  TrendingDown,
  BookMarked,
  Home,
  GraduationCap,
  ArrowRight,
  Pause,
  SkipBack,
  SkipForward,
  CheckCircle
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockPracticeStats = {
  totalSessions: 6,
  totalParticipants: 73,
  averageRating: 4.7,
  practiceTimeToday: 2.8
};

const mockQuickPractice = [
  {
    id: '1',
    title: '5-Minute Vocabulary Quiz',
    description: 'Quick vocabulary test to warm up',
    icon: Target,
    duration: '5 min',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Speaking Warm-up',
    description: 'Practice pronunciation and fluency',
    icon: Mic,
    duration: '10 min',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Grammar Check',
    description: 'Review basic grammar concepts',
    icon: BookOpen,
    duration: '15 min',
    difficulty: 'Intermediate'
  },
  {
    id: '4',
    title: 'Listening Exercise',
    description: 'Improve comprehension skills',
    icon: Headphones,
    duration: '12 min',
    difficulty: 'Intermediate'
  }
];

const mockPracticeSessions = [
  {
    id: '1',
    title: 'Business English Conversation',
    description: 'Practice professional communication skills with real-world scenarios',
    duration: '45 min',
    difficulty: 'Advanced',
    participants: 12,
    rating: 4.8,
    category: 'Speaking',
    isLive: true,
    instructor: 'Sarah Johnson',
    nextSession: 'Today, 2:00 PM'
  },
  {
    id: '2',
    title: 'Grammar Workshop: Past Perfect',
    description: 'Deep dive into past perfect tense with interactive exercises',
    duration: '60 min',
    difficulty: 'Intermediate',
    participants: 8,
    rating: 4.6,
    category: 'Grammar',
    isLive: false,
    instructor: 'Michael Chen',
    nextSession: 'Tomorrow, 10:00 AM'
  },
  {
    id: '3',
    title: 'Vocabulary Builder: Technology',
    description: 'Learn essential tech vocabulary through context and practice',
    duration: '30 min',
    difficulty: 'Beginner',
    participants: 15,
    rating: 4.9,
    category: 'Vocabulary',
    isLive: false,
    instructor: 'Emma Davis',
    nextSession: 'Wednesday, 3:30 PM'
  },
  {
    id: '4',
    title: 'Listening Comprehension: News',
    description: 'Practice listening skills with current news articles',
    duration: '40 min',
    difficulty: 'Intermediate',
    participants: 10,
    rating: 4.7,
    category: 'Listening',
    isLive: true,
    instructor: 'David Wilson',
    nextSession: 'Today, 6:00 PM'
  }
];

export default function PracticePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const filteredSessions = mockPracticeSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || session.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive learning sessions to improve your English skills through practice and repetition.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockPracticeStats.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Practice Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockPracticeStats.totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockPracticeStats.averageRating}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockPracticeStats.practiceTimeToday}h</p>
                <p className="text-sm text-muted-foreground">Practice Time Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Practice */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Practice
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Start practicing in minutes with these quick sessions
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockQuickPractice.map((practice) => (
            <Card key={practice.id} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <practice.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{practice.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{practice.description}</p>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Badge variant="outline" className="text-xs">{practice.duration}</Badge>
                  <Badge variant="secondary" className="text-xs">{practice.difficulty}</Badge>
                </div>
                <Button className="w-full" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Practice Content */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <Mic className="h-4 w-4" />
            <span>Live Practice</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Practice Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search practice sessions..."
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
                <option value="Speaking">Speaking</option>
                <option value="Listening">Listening</option>
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
              </select>
            </div>
          </div>

          {/* Practice Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.isLive ? "default" : "secondary"}>
                        {session.isLive ? "Live" : "Scheduled"}
                      </Badge>
                      <Badge variant="outline">{session.difficulty}</Badge>
                    </div>
                    <Bookmark className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
                  <CardDescription className="text-sm">{session.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{session.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants</span>
                      <span className="font-medium">{session.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{session.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Session</span>
                      <span className="font-medium">{session.nextSession}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="font-medium">{session.instructor}</span>
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Practice Room</CardTitle>
              <CardDescription>
                Join live practice sessions with other learners and instructors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mic className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Live Sessions Right Now</h3>
                <p className="text-muted-foreground mb-4">
                  Check back later for live practice opportunities
                </p>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Progress</CardTitle>
                <CardDescription>Your practice session statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Speaking</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Listening</span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Grammar</span>
                      <span className="text-sm text-muted-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest practice milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">First Practice Session</p>
                      <p className="text-sm text-muted-foreground">Completed your first practice session</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Consistent Practice</p>
                      <p className="text-sm text-muted-foreground">Practiced for 7 days in a row</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice Recorder</CardTitle>
                <CardDescription>Practice pronunciation and record your voice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={() => setIsRecording(!isRecording)}
                      className="w-20 h-20 rounded-full"
                    >
                      {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Player</CardTitle>
                <CardDescription>Listen to practice materials and exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="outline" size="sm">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant={isListening ? "default" : "outline"}
                      onClick={() => setIsListening(!isListening)}
                    >
                      {isListening ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Repeat className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 