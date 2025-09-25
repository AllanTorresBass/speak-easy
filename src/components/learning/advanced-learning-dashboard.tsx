'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  Volume2, 
  PenTool, 
  Clock, 
  Star,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { SpacedRepetitionSystem, SpacedRepetitionItem } from '@/lib/spaced-repetition';
import { DifficultyAdaptationSystem, DifficultyProfile, PerformanceMetrics } from '@/lib/difficulty-adaptation';
import { audioPronunciation, AudioSettings } from '@/lib/audio-pronunciation';
import { WritingExerciseSystem, WritingExercise } from '@/lib/writing-exercises';

export function AdvancedLearningDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    voice: 'auto',
    speed: 0.8,
    pitch: 1.0,
    volume: 0.8,
    autoPlay: false,
    showPhonetics: true,
    highlightWords: true,
    naturalPauses: true,
    emphasisLevel: 'moderate',
    breathingSpace: true,
    sentenceRhythm: true
  });

  // Mock data for demonstration
  const [spacedRepetitionItems, setSpacedRepetitionItems] = useState<SpacedRepetitionItem[]>([]);
  const [difficultyProfile, setDifficultyProfile] = useState<DifficultyProfile>({
    userId: session?.user?.id || '',
    vocabularyLevel: 'intermediate',
    grammarLevel: 'intermediate',
    readingLevel: 'beginner',
    listeningLevel: 'intermediate',
    writingLevel: 'beginner',
    speakingLevel: 'beginner',
    overallProficiency: 65,
    learningSpeed: 'normal',
    errorTolerance: 'medium',
    challengePreference: 'balanced'
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    accuracy: 78,
    responseTime: 4.2,
    completionRate: 85,
    errorPatterns: ['verb tense', 'article usage'],
    strengthAreas: ['vocabulary', 'pronunciation'],
    weaknessAreas: ['grammar', 'writing'],
    learningCurve: 0.08,
    retentionRate: 72,
    confidenceLevel: 68
  });

  const [writingExercises, setWritingExercises] = useState<WritingExercise[]>([]);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Audio event listeners are handled internally by the audioPronunciation system
  }, []);

  const initializeMockData = () => {
    // Mock spaced repetition items
    const mockItems: SpacedRepetitionItem[] = [
      SpacedRepetitionSystem.createItem('1', 'accomplish', 'lograr, cumplir', 2.5),
      SpacedRepetitionSystem.createItem('2', 'endeavor', 'esfuerzo, empeño', 3.0),
      SpacedRepetitionSystem.createItem('3', 'perseverance', 'perseverancia, constancia', 3.5),
    ];
    setSpacedRepetitionItems(mockItems);

    // Mock writing exercises
    const mockExercises = [
      WritingExerciseSystem.createExercise(
        'paragraph-writing',
        'Describe Your Hometown',
        'Write a paragraph describing your hometown or city',
        'intermediate'
      ),
      WritingExerciseSystem.createExercise(
        'sentence-completion',
        'Complete the Sentences',
        'Complete the given sentences with appropriate words',
        'beginner'
      ),
      WritingExerciseSystem.createExercise(
        'essay-writing',
        'Technology in Education',
        'Write an essay about the role of technology in modern education',
        'advanced'
      )
    ];
    setWritingExercises(mockExercises);
  };

  const handleAudioStart = () => setIsAudioPlaying(true);
  const handleAudioEnd = () => setIsAudioPlaying(false);
  const handleAudioError = () => setIsAudioPlaying(false);

  const playPronunciation = async (word: string) => {
    try {
      await audioPronunciation.playPronunciation(word, 'en', audioSettings);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    }
  };

  const updateAudioSettings = (newSettings: Partial<AudioSettings>) => {
    const updatedSettings = { ...audioSettings, ...newSettings };
    setAudioSettings(updatedSettings);
    audioPronunciation.updateSettings(updatedSettings);
  };

  const getLearningStats = () => {
    return SpacedRepetitionSystem.getLearningStats(spacedRepetitionItems);
  };

  const getInsights = () => {
    return DifficultyAdaptationSystem.generateInsights(difficultyProfile, performanceMetrics);
  };

  const learningStats = getLearningStats();
  const insights = getInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Intelligent learning with spaced repetition, adaptive difficulty, and comprehensive practice
          </p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Learning Settings
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spaced-repetition">Spaced Repetition</TabsTrigger>
          <TabsTrigger value="adaptive-learning">Adaptive Learning</TabsTrigger>
          <TabsTrigger value="audio-practice">Audio Practice</TabsTrigger>
          <TabsTrigger value="writing-exercises">Writing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Learning Progress */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Proficiency</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{difficultyProfile.overallProficiency}%</div>
                <Progress value={difficultyProfile.overallProficiency} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {difficultyProfile.overallProficiency >= 80 ? 'Advanced Level' : 
                   difficultyProfile.overallProficiency >= 60 ? 'Intermediate Level' : 'Beginner Level'}
                </p>
              </CardContent>
            </Card>

            {/* Spaced Repetition Stats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due for Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{learningStats.dueForReview}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {learningStats.dueSoon > 0 && `${learningStats.dueSoon} due soon`}
                </p>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.accuracy}%</div>
                <Progress value={performanceMetrics.accuracy} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {performanceMetrics.accuracy >= 90 ? 'Excellent' : 
                   performanceMetrics.accuracy >= 75 ? 'Good' : 'Needs improvement'}
                </p>
              </CardContent>
            </Card>

            {/* Learning Speed */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Speed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{difficultyProfile.learningSpeed}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {performanceMetrics.learningCurve > 0.05 ? 'Improving rapidly' : 
                   performanceMetrics.learningCurve > 0 ? 'Steady progress' : 'Review needed'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>Learning Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spaced-repetition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spaced Repetition System</CardTitle>
              <CardDescription>
                Review words at optimal intervals for maximum retention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Review Queue */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Items Due for Review</h3>
                {learningStats.dueForReview > 0 ? (
                  <div className="space-y-3">
                    {spacedRepetitionItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{item.word}</p>
                            <p className="text-sm text-muted-foreground">{item.translation}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {item.repetitions} reps
                          </Badge>
                          <Button size="sm" onClick={() => playPronunciation(item.word)}>
                            <Volume2 className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All caught up! No items due for review.</p>
                  </div>
                )}
              </div>

              {/* Learning Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{learningStats.retentionRate}%</div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{learningStats.averageInterval}</div>
                  <div className="text-sm text-muted-foreground">Avg. Interval (days)</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{learningStats.averageEaseFactor}</div>
                  <div className="text-sm text-muted-foreground">Avg. Ease Factor</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adaptive-learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Learning Profile</CardTitle>
              <CardDescription>
                Your learning preferences and performance-based adaptations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skill Levels */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skill Levels</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries({
                    'Vocabulary': difficultyProfile.vocabularyLevel,
                    'Grammar': difficultyProfile.grammarLevel,
                    'Reading': difficultyProfile.readingLevel,
                    'Listening': difficultyProfile.listeningLevel,
                    'Writing': difficultyProfile.writingLevel,
                    'Speaking': difficultyProfile.speakingLevel
                  }).map(([skill, level]) => (
                    <div key={skill} className="text-center p-3 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">{skill}</div>
                      <Badge className="mt-2" variant={
                        level === 'advanced' ? 'default' : 
                        level === 'intermediate' ? 'secondary' : 'outline'
                      }>
                        {level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">{performanceMetrics.responseTime}s</span>
                    </div>
                    <Progress value={Math.max(0, Math.min(100, (5 - performanceMetrics.responseTime) / 5 * 100))} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium">{performanceMetrics.completionRate}%</span>
                    </div>
                    <Progress value={performanceMetrics.completionRate} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Learning Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Learning Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Learning Speed</div>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {difficultyProfile.learningSpeed}
                    </Badge>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Error Tolerance</div>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {difficultyProfile.errorTolerance}
                    </Badge>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Challenge Level</div>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {difficultyProfile.challengePreference}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio-practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audio Practice & Pronunciation</CardTitle>
              <CardDescription>
                Practice pronunciation with text-to-speech and audio controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audio Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audio Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speed</label>
                    <select
                      value={audioSettings.speed}
                      onChange={(e) => updateAudioSettings({ speed: parseFloat(e.target.value) })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={0.5}>0.5x (Slow)</option>
                      <option value={0.8}>0.8x</option>
                      <option value={1.0}>1.0x (Normal)</option>
                      <option value={1.2}>1.2x</option>
                      <option value={1.5}>1.5x (Fast)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pitch</label>
                    <select
                      value={audioSettings.pitch}
                      onChange={(e) => updateAudioSettings({ pitch: parseFloat(e.target.value) })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={0.5}>Low</option>
                      <option value={0.8}>Medium-Low</option>
                      <option value={1.0}>Normal</option>
                      <option value={1.2}>Medium-High</option>
                      <option value={1.5}>High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={audioSettings.volume}
                      onChange={(e) => updateAudioSettings({ volume: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {Math.round(audioSettings.volume * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Words */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Practice Pronunciation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {spacedRepetitionItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.word}</p>
                        <p className="text-sm text-muted-foreground">{item.translation}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => playPronunciation(item.word)}
                        disabled={isAudioPlaying}
                      >
                        {isAudioPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Status */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {isAudioPlaying ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Playing audio...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium">Ready to play</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {audioPronunciation.isSupported() ? 'Audio system ready' : 'Audio not supported'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="writing-exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Writing Exercises</CardTitle>
              <CardDescription>
                Practice writing with AI-powered assessment and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Exercises */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Exercises</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {writingExercises.map((exercise) => (
                    <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{exercise.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {exercise.description}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            exercise.difficulty === 'advanced' ? 'default' : 
                            exercise.difficulty === 'intermediate' ? 'secondary' : 'outline'
                          }>
                            {exercise.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Target: {exercise.wordCount.target} words</span>
                          <span>{exercise.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Points: {exercise.points}</span>
                          <span>Type: {exercise.type.replace('-', ' ')}</span>
                        </div>
                        <Button className="w-full" size="sm">
                          <PenTool className="h-4 w-4 mr-2" />
                          Start Exercise
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Writing Tips */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Writing Tips
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Plan your writing before you start</li>
                  <li>• Use clear topic sentences and supporting details</li>
                  <li>• Vary your sentence structure and vocabulary</li>
                  <li>• Proofread for grammar and spelling</li>
                  <li>• Aim for the target word count</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 