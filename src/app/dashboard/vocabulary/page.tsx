'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PromovaVocabularyCard } from '@/components/learning/promova-vocabulary-card';
import { useVocabularyLists, useUserProgress } from '@/hooks/use-vocabulary';
import { useSession } from 'next-auth/react';
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Search,
  Plus,
  Bookmark,
  Star,
  Play,
  Volume2,
  Eye,
  EyeOff,
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
  BookMarked
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockVocabularyStats = {
  totalLists: 4,
  totalWords: 570,
  averageProgress: 62.5,
  studyTimeToday: 2.5
};

const mockVocabularyLists = [
  {
    id: '1',
    title: 'Business English Essentials',
    description: 'Essential vocabulary for professional communication',
    wordCount: 150,
    progress: 75,
    difficulty: 'Intermediate',
    category: 'Business',
    lastStudied: '2 hours ago',
    isBookmarked: true,
    tags: ['Professional', 'Communication', 'Work']
  },
  {
    id: '2',
    title: 'Academic Writing',
    description: 'Vocabulary for academic and research writing',
    wordCount: 200,
    progress: 45,
    difficulty: 'Advanced',
    category: 'Academic',
    lastStudied: '1 day ago',
    isBookmarked: false,
    tags: ['Research', 'Writing', 'Education']
  },
  {
    id: '3',
    title: 'Daily Conversations',
    description: 'Common words and phrases for everyday communication',
    wordCount: 120,
    progress: 90,
    difficulty: 'Beginner',
    category: 'Conversation',
    lastStudied: '3 hours ago',
    isBookmarked: true,
    tags: ['Daily', 'Conversation', 'Basic']
  },
  {
    id: '4',
    title: 'Technology & Innovation',
    description: 'Modern tech vocabulary and digital terms',
    wordCount: 100,
    progress: 30,
    difficulty: 'Intermediate',
    category: 'Technology',
    lastStudied: '2 days ago',
    isBookmarked: false,
    tags: ['Tech', 'Digital', 'Innovation']
  }
];

const mockRecentWords = [
  {
    id: '1',
    word: 'Serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    example: 'Meeting you here was pure serendipity!',
    difficulty: 'Advanced',
    mastered: true,
    lastReviewed: '1 hour ago'
  },
  {
    id: '2',
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.',
    difficulty: 'Advanced',
    mastered: false,
    lastReviewed: '2 hours ago'
  },
  {
    id: '3',
    word: 'Resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions',
    example: 'She is remarkably resilient in the face of adversity.',
    difficulty: 'Intermediate',
    mastered: true,
    lastReviewed: '3 hours ago'
  }
];

export default function VocabularyPage() {
  const { data: session } = useSession();
  const { data: vocabularyLists, isLoading: listsLoading, error: listsError } = useVocabularyLists();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress(session?.user?.id || '');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredLists = mockVocabularyLists.filter(list => {
    const matchesSearch = list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         list.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || list.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || list.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vocabulary
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master English vocabulary through word lists, practice exercises, and interactive learning.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockVocabularyStats.totalLists}</p>
                <p className="text-sm text-muted-foreground">Vocabulary Lists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockVocabularyStats.totalWords}</p>
                <p className="text-sm text-muted-foreground">Total Words</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockVocabularyStats.averageProgress}%</p>
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
                <p className="text-2xl font-bold">{mockVocabularyStats.studyTimeToday}h</p>
                <p className="text-sm text-muted-foreground">Study Time Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lists" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="lists" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Word Lists</span>
          </TabsTrigger>
          <TabsTrigger value="words" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Words</span>
          </TabsTrigger>
          <TabsTrigger value="promova" className="flex items-center space-x-2">
            <BookMarked className="h-4 w-4" />
            <span>Promova</span>
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Practice</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Learning Tools</span>
          </TabsTrigger>
        </TabsList>

                <TabsContent value="lists" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vocabulary lists..."
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
                <option value="Business">Business</option>
                <option value="Academic">Academic</option>
                <option value="Conversation">Conversation</option>
                <option value="Technology">Technology</option>
              </select>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create List</span>
              </Button>
            </div>
          </div>

          {/* Vocabulary Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <Card key={list.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{list.difficulty}</Badge>
                      <Badge variant="secondary">{list.category}</Badge>
                    </div>
                    <Bookmark className={`h-4 w-4 cursor-pointer hover:text-primary ${
                      list.isBookmarked ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <CardTitle className="text-lg mb-2">{list.title}</CardTitle>
                  <CardDescription className="text-sm">{list.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Words</span>
                      <span className="font-medium">{list.wordCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{list.progress}%</span>
                      </div>
                    <Progress value={list.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Studied</span>
                      <span className="font-medium">{list.lastStudied}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {list.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Study
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="words" className="space-y-6">
          {/* Words Header */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-12 w-12 text-green-600" />
              <h2 className="text-3xl font-bold">Words Vocabulary</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore 25 comprehensive English-Spanish vocabulary lists covering essential words 
              and phrases for everyday communication, business, travel, and more.
            </p>
          </div>

          {/* Words Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">25 Lists</h3>
                <p className="text-muted-foreground">Comprehensive coverage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">Multiple Topics</h3>
                <p className="text-muted-foreground">Business, travel, family, etc.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">1000+ Words</h3>
                <p className="text-muted-foreground">Essential vocabulary</p>
              </CardContent>
            </Card>
          </div>

          {/* Words Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((listNum) => (
                                      <Link key={listNum} href={`/vocabulary/words-list/${listNum}`}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-green-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Vocabulary List {listNum}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        ~{Math.floor(Math.random() * 50) + 30} words
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                        View List →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Words Search Link */}
          <div className="text-center py-8">
            <Link href="/vocabulary/words">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                <Search className="h-5 w-5 mr-2" />
                Search All Words
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="promova" className="space-y-6">
          {/* Promova Header */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookMarked className="h-12 w-12 text-blue-600" />
              <h2 className="text-3xl font-bold">Promova Vocabulary</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access 25 comprehensive vocabulary lists with essential English words and phrases, 
              organized by difficulty level from beginner to advanced.
            </p>
          </div>

          {/* Promova Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <BookMarked className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">25 Lists</h3>
                <p className="text-muted-foreground">Comprehensive coverage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">3 Levels</h3>
                <p className="text-muted-foreground">Beginner to advanced</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">1000+ Words</h3>
                <p className="text-muted-foreground">Essential vocabulary</p>
              </CardContent>
            </Card>
          </div>

          {/* Promova Lists */}
          <PromovaVocabularySection />
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Quiz</CardTitle>
                <CardDescription>Test your vocabulary knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a vocabulary list to start practicing
                    </p>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Words</CardTitle>
                <CardDescription>Words you've studied recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentWords.map((word) => (
                    <div key={word.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{word.word}</h4>
                        <p className="text-sm text-muted-foreground">{word.definition}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={word.mastered ? "default" : "secondary"}>
                          {word.mastered ? "Mastered" : "Learning"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                <CardDescription>Your vocabulary mastery over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Beginner Level</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Intermediate Level</span>
                      <span className="text-sm text-muted-foreground">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Advanced Level</span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Streak</CardTitle>
                <CardDescription>Your daily study consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
                  <p className="text-muted-foreground mb-4">Days in a row</p>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div key={i} className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Review words with spaced repetition</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Review
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Word Games</CardTitle>
                <CardDescription>Learn through interactive games</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Play Games
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Lists</CardTitle>
                <CardDescription>Download your vocabulary lists</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Promova Vocabulary Section Component
function PromovaVocabularySection() {
  const { data: session } = useSession();
  const { data: vocabularyLists, isLoading: listsLoading, error: listsError } = useVocabularyLists();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress(session?.user?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Filter Promova vocabulary lists
  const promovaLists = vocabularyLists?.filter(list => list.id.startsWith('promova-')) || [];
  
  const filteredLists = promovaLists.filter(list => {
    const matchesSearch = list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'all' || list.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Get progress for a specific list
  const getProgress = (listId: string) => {
    return userProgress?.find(progress => progress.vocabularyListId === listId);
  };

  if (listsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Promova Vocabulary Lists</h3>
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
        <div className="text-red-500 text-xl mb-4">Error loading Promova vocabulary lists</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search Promova vocabulary lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <Button asChild>
          <Link href="/vocabulary/promova">
            <BookMarked className="w-4 h-4 mr-2" />
            Advanced Search
          </Link>
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLists.length} of {promovaLists.length} Promova vocabulary lists
      </div>

      {/* Promova Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => {
          const progress = getProgress(list.id);
          
          return (
            <PromovaVocabularyCard
              key={list.id}
              list={list}
              progress={progress ? {
                wordsLearned: progress.wordsLearned,
                totalWords: progress.totalWords,
                masteryLevel: progress.masteryLevel,
                averageScore: progress.averageScore,
                lastStudied: progress.lastStudied,
              } : undefined}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Promova lists found</h3>
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