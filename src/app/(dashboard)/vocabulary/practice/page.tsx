'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Volume2,
  Star,
  Trophy,
  Eye
} from 'lucide-react';
import { useVocabularyLists, useUserProgress, useUpdateProgress } from '@/hooks/use-vocabulary';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface PracticeWord {
  id: string;
  word: string;
  translation: string;
  definition: string;
  example: string;
  difficulty: string;
  partOfSpeech: string;
  pronunciation: string;
}

export default function VocabularyPracticePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: vocabularyLists } = useVocabularyLists();
  const { data: userProgress } = useUserProgress(session?.user?.id || '');
  const updateProgress = useUpdateProgress();

  const [selectedListId, setSelectedListId] = useState<string>('');
  const [practiceWords, setPracticeWords] = useState<PracticeWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'quiz'>('flashcard');

  // Generate practice words from selected list
  useEffect(() => {
    if (selectedListId && vocabularyLists) {
      const selectedList = vocabularyLists.find(list => list.id === selectedListId);
      if (selectedList) {
        // Mock words for practice - in production, this would come from the actual list
        const mockWords: PracticeWord[] = [
          {
            id: '1',
            word: 'accomplish',
            translation: 'lograr, cumplir',
            definition: 'To succeed in doing something, especially after trying hard',
            example: 'She accomplished her goal of running a marathon.',
            difficulty: 'intermediate',
            partOfSpeech: 'verb',
            pronunciation: '/əˈkʌm.plɪʃ/',
          },
          {
            id: '2',
            word: 'endeavor',
            translation: 'esfuerzo, empeño',
            definition: 'A serious attempt to do something',
            example: 'Learning a new language is a worthwhile endeavor.',
            difficulty: 'intermediate',
            partOfSpeech: 'noun',
            pronunciation: '/ɪnˈdev.ər/',
          },
          {
            id: '3',
            word: 'perseverance',
            translation: 'perseverancia, constancia',
            definition: 'Persistence in doing something despite difficulty',
            example: 'His perseverance in studying paid off with excellent grades.',
            difficulty: 'advanced',
            partOfSpeech: 'noun',
            pronunciation: '/ˌpɜː.sɪˈvɪə.rəns/',
          },
        ];
        setPracticeWords(mockWords);
      }
    }
  }, [selectedListId, vocabularyLists]);

  const currentWord = practiceWords[currentWordIndex];
  const progress = userProgress?.find(p => p.vocabularyListId === selectedListId);
  const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;

  const startPractice = () => {
    if (selectedListId && practiceWords.length > 0) {
      setIsPracticeActive(true);
      setCurrentWordIndex(0);
      setScore(0);
      setTotalAnswered(0);
      setShowAnswer(false);
    }
  };

  const nextWord = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
    } else {
      // Practice completed
      setIsPracticeActive(false);
      if (session?.user?.id) {
        updateProgress.mutate({
          userId: session.user.id,
          vocabularyListId: selectedListId,
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

  const markAsCorrect = () => {
    setScore(score + 1);
    setTotalAnswered(totalAnswered + 1);
    setShowAnswer(true);
  };

  const markAsIncorrect = () => {
    setTotalAnswered(totalAnswered + 1);
    setShowAnswer(true);
  };

  const resetPractice = () => {
    setIsPracticeActive(false);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setShowAnswer(false);
  };

  if (!vocabularyLists) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading vocabulary lists...</div>
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
          <h1 className="text-3xl font-bold">Vocabulary Practice</h1>
          <p className="text-muted-foreground mt-1">
            Practice and reinforce your vocabulary knowledge
          </p>
        </div>
      </div>

      {!isPracticeActive ? (
        /* Practice Setup */
        <div className="space-y-6">
          {/* List Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Vocabulary List</CardTitle>
              <CardDescription>
                Choose a list to practice with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vocabularyLists.map((list) => {
                  const listProgress = userProgress?.find(p => p.vocabularyListId === list.id);
                  return (
                    <Card
                      key={list.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedListId === list.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedListId(list.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{list.title}</h3>
                          <Badge className={getDifficultyColor(list.difficulty)}>
                            {list.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {list.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span>{list.wordCount} words</span>
                          <span>{list.estimatedTime} min</span>
                        </div>
                        {listProgress && (
                          <div className="mt-2">
                            <Progress value={(listProgress.wordsLearned / listProgress.totalWords) * 100} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {listProgress.wordsLearned}/{listProgress.totalWords} learned
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
                    practiceMode === 'flashcard' ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setPracticeMode('flashcard')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">📚</div>
                    <h3 className="font-semibold">Flashcard Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Review words with definitions and examples
                    </p>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    practiceMode === 'quiz' ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setPracticeMode('quiz')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold">Quiz Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Test your knowledge with interactive questions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Start Practice Button */}
          {selectedListId && (
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
                  Word {currentWordIndex + 1} of {practiceWords.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  Score: {score}/{totalAnswered}
                </span>
              </div>
              <Progress value={(currentWordIndex / practiceWords.length) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Current Word */}
          {currentWord && (
            <Card className="min-h-[400px] flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold mb-2">
                  {currentWord.word}
                </CardTitle>
                <div className="flex items-center justify-center space-x-4 text-muted-foreground">
                  <Badge variant="outline">{currentWord.partOfSpeech}</Badge>
                  <span>{currentWord.pronunciation}</span>
                  <Badge className={getDifficultyColor(currentWord.difficulty)}>
                    {currentWord.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                {!showAnswer ? (
                  /* Question View */
                  <div className="text-center space-y-6">
                    <div className="text-2xl text-muted-foreground">
                      {practiceMode === 'flashcard' 
                        ? 'Tap to reveal definition' 
                        : 'What does this word mean?'
                      }
                    </div>
                    
                    <div className="space-y-4">
                      <Button
                        size="lg"
                        onClick={() => setShowAnswer(true)}
                        className="px-8"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Reveal Answer
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Answer View */
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Definition</h3>
                        <p className="text-lg text-muted-foreground">
                          {currentWord.definition}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Translation</h3>
                        <p className="text-lg text-blue-600">
                          {currentWord.translation}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Example</h3>
                        <p className="text-lg italic text-muted-foreground">
                          "{currentWord.example}"
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={markAsIncorrect}
                        className="px-6"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Incorrect
                      </Button>
                      <Button
                        onClick={markAsCorrect}
                        className="px-6"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Correct
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={resetPractice}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Practice
            </Button>
            {showAnswer && (
              <Button onClick={nextWord}>
                {currentWordIndex < practiceWords.length - 1 ? 'Next Word' : 'Finish Practice'}
              </Button>
            )}
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
              You got {score} out of {totalAnswered} words correct!
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetPractice}>
                Practice Again
              </Button>
              <Button asChild>
                <Link href="/vocabulary">
                  Back to Lists
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