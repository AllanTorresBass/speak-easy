'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  GraduationCap,
  Target,
  Trophy,
  Star,
  Clock
} from 'lucide-react';
import { useGrammarLessons, useUserGrammarProgress, useUpdateGrammarProgress } from '@/hooks/use-grammar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface PracticeExercise {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer: number;
  explanation: string;
  lessonTitle: string;
}

export default function GrammarPracticePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: grammarLessons } = useGrammarLessons();
  const { data: userProgress } = useUserGrammarProgress(session?.user?.id || '');
  const updateProgress = useUpdateGrammarProgress();

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [practiceExercises, setPracticeExercises] = useState<PracticeExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'lesson' | 'mixed'>('lesson');

  // Generate practice exercises from selected lesson
  useEffect(() => {
    if (selectedLessonId && grammarLessons) {
      const selectedLesson = grammarLessons.find(lesson => lesson.id === selectedLessonId);
      if (selectedLesson) {
        // Mock exercises for practice - in production, this would come from the actual lesson
        const mockExercises: PracticeExercise[] = [
          {
            id: '1',
            type: 'multiple-choice',
            question: 'Identify the subject in: "The students study hard for their exams."',
            options: ['The students', 'study hard', 'for their exams', 'hard for their'],
            correctAnswer: 0,
            explanation: 'The subject is "The students" because it tells us who the sentence is about.',
            lessonTitle: 'Subject and Predicate'
          },
          {
            id: '2',
            type: 'multiple-choice',
            question: 'Which type of sentence is: "How amazing is this view!"?',
            options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
            correctAnswer: 3,
            explanation: 'This is an exclamatory sentence because it expresses strong emotion and ends with an exclamation mark.',
            lessonTitle: 'Types of Sentences'
          },
          {
            id: '3',
            type: 'multiple-choice',
            question: 'What is the predicate in: "The cat sleeps on the sofa."?',
            options: ['The cat', 'sleeps on the sofa', 'on the sofa', 'sleeps'],
            correctAnswer: 1,
            explanation: 'The predicate is "sleeps on the sofa" because it tells us what the subject (the cat) does.',
            lessonTitle: 'Subject and Predicate'
          },
          {
            id: '4',
            type: 'multiple-choice',
            question: 'Choose the correct verb form: "She _____ to the store every day."',
            options: ['go', 'goes', 'going', 'gone'],
            correctAnswer: 1,
            explanation: 'Use "goes" because the subject "She" is third person singular, requiring the -s form.',
            lessonTitle: 'Verb Conjugation'
          }
        ];
        setPracticeExercises(mockExercises);
      }
    }
  }, [selectedLessonId, grammarLessons]);

  const currentExercise = practiceExercises[currentExerciseIndex];
  const progress = userProgress?.find(p => p.vocabularyListId === selectedLessonId);
  const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;

  const startPractice = () => {
    if (selectedLessonId && practiceExercises.length > 0) {
      setIsPracticeActive(true);
      setCurrentExerciseIndex(0);
      setScore(0);
      setTotalAnswered(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setTotalAnswered(totalAnswered + 1);
    setShowResult(true);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Practice completed
      setIsPracticeActive(false);
      if (session?.user?.id) {
        updateProgress.mutate({
          userId: session.user.id,
          vocabularyListId: selectedLessonId,
          wordsLearned: Math.min((progress?.wordsLearned || 0) + Math.ceil(score / 2), progress?.totalWords || 0),
          totalWords: progress?.totalWords || 0,
          masteryLevel: Math.min((progress?.masteryLevel || 0) + 0.1, 1),
          lastStudied: new Date(),
          studySessions: (progress?.studySessions || 0) + 1,
          averageScore: Math.round((score / totalAnswered) * 100),
        });
      }
    }
  };

  const resetPractice = () => {
    setIsPracticeActive(false);
    setCurrentExerciseIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!grammarLessons) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading grammar lessons...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Grammar Practice</h1>
          <p className="text-muted-foreground mt-1">
            Test your grammar knowledge with interactive exercises
          </p>
        </div>
      </div>

      {!isPracticeActive ? (
        /* Practice Setup */
        <div className="space-y-6">
          {/* Lesson Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Grammar Lesson</CardTitle>
              <CardDescription>
                Choose a lesson to practice with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grammarLessons.map((lesson) => {
                  const lessonProgress = userProgress?.find(p => p.vocabularyListId === lesson.id);
                  return (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedLessonId === lesson.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {lesson.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span>{lesson.lessonCount} lessons</span>
                          <span>{lesson.estimatedTime} min</span>
                        </div>
                        {lessonProgress && (
                          <div className="mt-2">
                            <Progress value={(lessonProgress.wordsLearned / lessonProgress.totalWords) * 100} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {lessonProgress.wordsLearned}/{lessonProgress.totalWords} completed
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Practice Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Mode</CardTitle>
              <CardDescription>
                Choose how you want to practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    practiceMode === 'lesson' ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setPracticeMode('lesson')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">📚</div>
                    <h3 className="font-semibold">Lesson Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      Practice exercises from a specific lesson
                    </p>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    practiceMode === 'mixed' ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setPracticeMode('mixed')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold">Mixed Review</h3>
                    <p className="text-sm text-muted-foreground">
                      Practice exercises from all lessons
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Start Practice Button */}
          {selectedLessonId && (
            <div className="text-center">
              <Button size="lg" onClick={startPractice} className="px-8">
                <Play className="w-5 h-5 mr-2" />
                Start Practice
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Active Practice Session */
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Exercise {currentExerciseIndex + 1} of {practiceExercises.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  Score: {score}/{totalAnswered}
                </span>
              </div>
              <Progress value={(currentExerciseIndex / practiceExercises.length) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Current Exercise */}
          {currentExercise && (
            <Card className="min-h-[400px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{currentExercise.lessonTitle}</CardTitle>
                  <Badge variant="outline">{currentExercise.type}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{currentExercise.question}</h3>
                    
                    {currentExercise.options && (
                      <RadioGroup
                        value={selectedAnswer?.toString() || ''}
                        onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                        disabled={showResult}
                      >
                        {currentExercise.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                  
                  {showResult && (
                    <div className={`p-4 rounded-lg ${
                      selectedAnswer === currentExercise.correctAnswer 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedAnswer === currentExercise.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-semibold ${
                          selectedAnswer === currentExercise.correctAnswer 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {selectedAnswer === currentExercise.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentExercise.explanation}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-4">
                  {!showResult ? (
                    <Button
                      onClick={checkAnswer}
                      disabled={selectedAnswer === null}
                      className="px-8"
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextExercise}>
                      {currentExerciseIndex < practiceExercises.length - 1 ? 'Next Exercise' : 'Finish Practice'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={resetPractice}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Practice
            </Button>
          </div>
        </div>
      )}

      {/* Practice Results */}
      {!isPracticeActive && totalAnswered > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <span>Practice Complete!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-3xl font-bold text-green-600">
              {Math.round((score / totalAnswered) * 100)}%
            </div>
            <p className="text-muted-foreground">
              You got {score} out of {totalAnswered} exercises correct!
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetPractice}>
                Practice Again
              </Button>
              <Button asChild>
                <Link href="/grammar">
                  Back to Lessons
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function for difficulty colors
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
} 