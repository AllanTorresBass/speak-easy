'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  ArrowLeft,
  Volume2,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useVocabularyList, useUserProgress, useUpdateProgress } from '@/hooks/use-vocabulary';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function VocabularyListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const listId = params.id as string;
  
  const { data: vocabularyList, isLoading, error } = useVocabularyList(listId);
  const { data: userProgress } = useUserProgress(session?.user?.id || '');
  const updateProgress = useUpdateProgress();
  
  const [showTranslations, setShowTranslations] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const progress = userProgress?.find(p => p.vocabularyListId === listId);
  const progressPercentage = progress ? (progress.wordsLearned / progress.totalWords) * 100 : 0;

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

  if (error || !vocabularyList) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">Error loading vocabulary list</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleWordLearned = (wordId: string) => {
    if (!session?.user?.id) return;
    
    updateProgress.mutate({
      userId: session.user.id,
      vocabularyListId: listId,
      wordsLearned: (progress?.wordsLearned || 0) + 1,
      totalWords: vocabularyList.wordCount,
      masteryLevel: ((progress?.wordsLearned || 0) + 1) / vocabularyList.wordCount,
      lastStudied: new Date(),
    });
  };

  const currentWord = vocabularyList.words[currentWordIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{vocabularyList.title}</h1>
          <p className="text-muted-foreground mt-1">{vocabularyList.description}</p>
        </div>
        <Button asChild>
          <Link href={`/vocabulary/${listId}/practice`}>
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
              <div className="text-2xl font-bold text-blue-600">{vocabularyList.wordCount}</div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{progress?.wordsLearned || 0}</div>
              <div className="text-sm text-muted-foreground">Words Learned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{vocabularyList.estimatedTime}</div>
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
                <span>{progress.wordsLearned}/{progress.totalWords} words</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="words" className="space-y-4">
        <TabsList>
          <TabsTrigger value="words">Words ({vocabularyList.words.length})</TabsTrigger>
          <TabsTrigger value="practice">Quick Practice</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vocabulary Words</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslations(!showTranslations)}
            >
              {showTranslations ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showTranslations ? 'Hide' : 'Show'} Translations
            </Button>
          </div>

          <div className="grid gap-4">
            {vocabularyList.words.map((word, index) => (
              <Card key={word.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold">{word.word}</h3>
                        <Badge variant="outline">{word.partOfSpeech}</Badge>
                        <Badge className={getDifficultyColor(word.difficulty)}>
                          {word.difficulty}
                        </Badge>
                      </div>
                      
                      {showTranslations && (
                        <p className="text-lg text-muted-foreground">
                          <strong>Translation:</strong> {word.translation}
                        </p>
                      )}
                      
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Definition:</strong> {word.definition}
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        <strong>Example:</strong> "{word.example}"
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <div className="text-sm">
                          <strong>Synonyms:</strong> {word.synonyms.join(', ')}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <strong>Pronunciation:</strong> {word.pronunciation}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWordLearned(word.id)}
                        disabled={progress?.wordsLearned === progress?.totalWords}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Learned
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Word Practice</CardTitle>
              <CardDescription>
                Test your knowledge of the current word
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentWord && (
                <>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold">{currentWord.word}</div>
                    <div className="text-lg text-muted-foreground">
                      {currentWord.partOfSpeech} • {currentWord.pronunciation}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                                         <div className="text-center">
                       <p className="text-lg mb-2">What does this word mean?</p>
                       <div className="text-xl font-medium text-blue-600">
                         {currentWord.definition}
                       </div>
                     </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentWordIndex(prev => 
                          prev > 0 ? prev - 1 : vocabularyList.words.length - 1
                        )}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentWordIndex(prev => 
                          prev < vocabularyList.words.length - 1 ? prev + 1 : 0
                        )}
                      >
                        Next Word
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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