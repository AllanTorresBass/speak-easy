'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Target, 
  BookOpen, 
  Mic, 
  Headphones, 
  PenTool, 
  Users,
  Star,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Play,
  Settings,
  BarChart3,
  MessageCircle,
  Globe,
  Smartphone,
  Monitor,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockAIFeatures = [
  {
    id: '1',
    title: 'AI Conversation Partner',
    description: 'Practice speaking with an intelligent AI that adapts to your level',
    icon: MessageCircle,
    status: 'active',
    usage: 15,
    maxUsage: 20,
    rating: 4.8,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    id: '2',
    title: 'Smart Vocabulary Builder',
    description: 'AI-powered word suggestions based on your learning patterns',
    icon: Brain,
    status: 'active',
    usage: 8,
    maxUsage: 10,
    rating: 4.9,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
  {
    id: '3',
    title: 'Adaptive Grammar Coach',
    description: 'Personalized grammar lessons that focus on your weak areas',
    icon: BookOpen,
    status: 'active',
    usage: 12,
    maxUsage: 15,
    rating: 4.7,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  {
    id: '4',
    title: 'Pronunciation Analyzer',
    description: 'Real-time feedback on your pronunciation and accent',
    icon: Mic,
    status: 'coming-soon',
    usage: 0,
    maxUsage: 10,
    rating: 0,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  {
    id: '5',
    title: 'Writing Assistant',
    description: 'AI-powered writing feedback and improvement suggestions',
    icon: PenTool,
    status: 'coming-soon',
    usage: 0,
    maxUsage: 15,
    rating: 0,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950'
  },
  {
    id: '6',
    title: 'Learning Path Optimizer',
    description: 'AI-driven study recommendations based on your progress',
    icon: TrendingUp,
    status: 'beta',
    usage: 5,
    maxUsage: 10,
    rating: 4.6,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-950 dark:bg-indigo-950'
  }
];

const mockLearningInsights = [
  {
    title: 'Vocabulary Retention',
    insight: 'Your retention rate is 15% above average for intermediate learners',
    recommendation: 'Focus on spaced repetition for new words',
    icon: Brain,
    color: 'text-green-600'
  },
  {
    title: 'Speaking Confidence',
    insight: 'You show hesitation with complex sentence structures',
    recommendation: 'Practice with simpler sentences first, then gradually increase complexity',
    icon: Mic,
    color: 'text-blue-600'
  },
  {
    title: 'Grammar Patterns',
    insight: 'Past perfect tense is your strongest grammar area',
    recommendation: 'Use this strength to build confidence in other tenses',
    icon: BookOpen,
    color: 'text-purple-600'
  }
];

const mockAIStats = {
  totalSessions: 47,
  averageRating: 4.8,
  timeSaved: 12.5,
  accuracyImprovement: 23,
  personalizedLessons: 28,
  adaptiveRecommendations: 156
};

export default function AdvancedLearningPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Advanced Learning
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Experience AI-powered learning features that adapt to your unique learning style
        </p>
      </div>

      {/* AI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{mockAIStats.totalSessions}</p>
                <p className="text-sm text-muted-foreground">AI Sessions</p>
                <div className="text-xs text-muted-foreground">
                  This month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{mockAIStats.averageRating}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="text-xs text-muted-foreground">
                  Out of 5.0
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{mockAIStats.timeSaved}h</p>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <div className="text-xs text-muted-foreground">
                  Through AI optimization
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          AI-Powered Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mockAIFeatures.map((feature) => (
            <Card key={feature.id} className={`h-full ${feature.bgColor} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`${feature.color} p-2 rounded-lg`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <Badge 
                    variant={
                      feature.status === 'active' ? 'default' : 
                      feature.status === 'beta' ? 'secondary' : 'outline'
                    }
                  >
                    {feature.status === 'coming-soon' ? 'Coming Soon' : 
                     feature.status === 'beta' ? 'Beta' : 'Active'}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {feature.status === 'active' || feature.status === 'beta' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usage</span>
                      <span className="font-medium">{feature.usage}/{feature.maxUsage}</span>
                    </div>
                    <Progress value={(feature.usage / feature.maxUsage) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{feature.rating}</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-muted-foreground mb-3">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Coming Soon</p>
                    </div>
                    <Button variant="outline" className="w-full" size="sm" disabled>
                      Notify When Available
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Learning Insights */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            AI Learning Insights
          </h2>
          <div className="space-y-4">
            {mockLearningInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`${insight.color} p-2 rounded-lg`}>
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {insight.insight}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        💡 {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View All Insights
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* AI Performance Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            AI Performance Metrics
          </h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Accuracy Improvement</h4>
                  <Badge variant="default">+{mockAIStats.accuracyImprovement}%</Badge>
                </div>
                <Progress value={mockAIStats.accuracyImprovement} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Your accuracy has improved significantly with AI assistance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Personalized Lessons</h4>
                  <Badge variant="secondary">{mockAIStats.personalizedLessons}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  AI-generated lessons tailored to your learning needs
                </p>
                <div className="text-xs text-muted-foreground">
                  Based on your progress and preferences
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Adaptive Recommendations</h4>
                  <Badge variant="outline">{mockAIStats.adaptiveRecommendations}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Smart suggestions for your learning path
                </p>
                <div className="text-xs text-muted-foreground">
                  Updated in real-time based on your performance
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Learning Tips */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI Learning Tip
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  The AI learns from your interactions! The more you use these features, the better they become at 
                  understanding your learning style and providing personalized recommendations.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4" />
                  <span>Your AI has analyzed {mockAIStats.totalSessions} learning sessions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 