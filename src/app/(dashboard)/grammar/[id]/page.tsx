'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Clock, 
  Target, 
  Play,
  ArrowLeft,
  BookOpen,
  Star,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGrammarLesson, useUserGrammarProgress, useUpdateGrammarProgress } from '@/hooks/use-grammar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function GrammarLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const lessonId = params.id as string;
  
  const { data: grammarLesson, isLoading, error } = useGrammarLesson(lessonId);
  const { data: userProgress } = useUserGrammarProgress(session?.user?.id || '');
  const updateProgress = useUpdateGrammarProgress();
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showExercises, setShowExercises] = useState(false);

  const progress = userProgress?.find(p => p.vocabularyListId === lessonId);
  const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;
  const currentLesson = grammarLesson?.lessons?.[currentLessonIndex];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || !grammarLesson) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">Error loading grammar lesson</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleLessonCompleted = (lessonIndex: number) => {
    if (!session?.user?.id) return;
    
    const newWordsLearned = Math.min((progress?.wordsLearned || 0) + 1, grammarLesson.lessonCount);
    
    updateProgress.mutate({
      userId: session.user.id,
      vocabularyListId: lessonId,
      wordsLearned: newWordsLearned,
      totalWords: grammarLesson.lessonCount,
      masteryLevel: newWordsLearned / grammarLesson.lessonCount,
      lastStudied: new Date(),
    });
  };

  const nextLesson = () => {
    if (currentLessonIndex < (grammarLesson.lessons?.length || 0) - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowExercises(false);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowExercises(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{grammarLesson.title}</h1>
          <p className="text-muted-foreground mt-1">{grammarLesson.description}</p>
        </div>
        <Button asChild>
          <Link href={`/grammar/${lessonId}/practice`}>
            <Play className="w-4 h-4 mr-2" />
            Practice
          </Link>
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Learning Progress</span>
            <Badge variant={progress ? 'default' : 'secondary'}>
              {progress ? `${Math.round(progressPercentage)}% Complete` : 'Not Started'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{grammarLesson.lessonCount}</div>
              <div className="text-sm text-muted-foreground">Total Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{progress?.wordsLearned || 0}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{grammarLesson.estimatedTime}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{progress?.studySessions || 0}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
          </div>
          
          {progress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress.wordsLearned}/{progress.totalWords} lessons</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousLesson}
              disabled={currentLessonIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Lesson</div>
              <div className="text-lg font-semibold">
                {currentLessonIndex + 1} of {grammarLesson.lessons?.length || 0}
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={nextLesson}
              disabled={currentLessonIndex >= (grammarLesson.lessons?.length || 0) - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lesson" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lesson">Lesson Content</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="lesson" className="space-y-4">
          {currentLesson && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lesson Content */}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">{currentLesson.content}</p>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Examples</h3>
                  <div className="space-y-3">
                    {currentLesson.examples.map((example, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <p className="text-lg font-medium">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">
                    Lesson {currentLessonIndex + 1} of {grammarLesson.lessons?.length}
                  </div>
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowExercises(!showExercises)}
                    >
                      {showExercises ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showExercises ? 'Hide' : 'Show'} Exercises
                    </Button>
                    
                    <Button
                      onClick={() => handleLessonCompleted(currentLessonIndex)}
                      disabled={progress?.wordsLearned === progress?.totalWords}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          {currentLesson && (
            <Card>
              <CardHeader>
                <CardTitle>Practice Exercises</CardTitle>
                <CardDescription>
                  Test your understanding of the current lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentLesson.exercises && currentLesson.exercises.length > 0 ? (
                  <div className="space-y-6">
                    {currentLesson.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">Exercise {index + 1}</h4>
                        <p className="mb-4">{exercise.question}</p>
                        
                        {exercise.type === 'multiple-choice' && exercise.options && (
                          <div className="space-y-2">
                            {exercise.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`exercise-${exercise.id}`}
                                  id={`option-${exercise.id}-${optionIndex}`}
                                  className="w-4 h-4"
                                />
                                <label htmlFor={`option-${exercise.id}-${optionIndex}`}>
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Explanation: {exercise.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No exercises available for this lesson yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {progress ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(progress.masteryLevel * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Mastery Level</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {progress.averageScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Last Studied</div>
                    <div className="text-lg font-medium">
                      {progress.lastStudied.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start learning to see your statistics!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 