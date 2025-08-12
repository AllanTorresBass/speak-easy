import { useQuery } from '@tanstack/react-query';
import { UserProgress } from '@/types';

// Mock API functions - in production, these would call your actual API endpoints
const fetchUserProgressAnalytics = async (userId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock progress data for analytics
  const progressData = [
    {
      id: '1',
      userId,
      vocabularyListId: '1',
      wordsLearned: 20,
      totalWords: 25,
      lastStudied: new Date('2024-01-15'),
      masteryLevel: 0.8,
      studySessions: 5,
      averageScore: 85,
      category: 'vocabulary'
    },
    {
      id: '2',
      userId,
      vocabularyListId: '2',
      wordsLearned: 15,
      totalWords: 30,
      lastStudied: new Date('2024-01-14'),
      masteryLevel: 0.5,
      studySessions: 3,
      averageScore: 72,
      category: 'vocabulary'
    },
    {
      id: '3',
      userId,
      vocabularyListId: 'basic-structure',
      wordsLearned: 3,
      totalWords: 5,
      lastStudied: new Date('2024-01-15'),
      masteryLevel: 0.6,
      studySessions: 4,
      averageScore: 78,
      category: 'grammar'
    },
    {
      id: '4',
      userId,
      vocabularyListId: 'complex-structure',
      wordsLearned: 2,
      totalWords: 8,
      lastStudied: new Date('2024-01-14'),
      masteryLevel: 0.25,
      studySessions: 2,
      averageScore: 65,
      category: 'grammar'
    }
  ];

  // Calculate analytics
  const totalWordsLearned = progressData.reduce((sum, p) => sum + p.wordsLearned, 0);
  const totalWords = progressData.reduce((sum, p) => sum + p.totalWords, 0);
  const overallMastery = totalWords > 0 ? totalWordsLearned / totalWords : 0;
  const totalStudySessions = progressData.reduce((sum, p) => sum + p.studySessions, 0);
  const averageScore = progressData.length > 0 
    ? progressData.reduce((sum, p) => sum + p.averageScore, 0) / progressData.length 
    : 0;

  // Calculate study streaks
  const studyDates = progressData
    .map(p => new Date(p.lastStudied))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < studyDates.length; i++) {
    const currentDate = studyDates[i];
    const nextDate = studyDates[i + 1];
    
    if (nextDate) {
      const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
  }
  
  // Calculate current streak (consecutive days from today)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (studyDates.length > 0) {
    const lastStudyDate = studyDates[0];
    const daysSinceLastStudy = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastStudy === 0) {
      currentStreak = tempStreak + 1;
    } else if (daysSinceLastStudy === 1) {
      currentStreak = tempStreak;
    }
  }

  // Weekly progress data
  const weeklyData = [
    { day: 'Mon', words: 12, lessons: 2 },
    { day: 'Tue', words: 8, lessons: 1 },
    { day: 'Wed', words: 15, lessons: 3 },
    { day: 'Thu', words: 10, lessons: 2 },
    { day: 'Fri', words: 18, lessons: 4 },
    { day: 'Sat', words: 22, lessons: 5 },
    { day: 'Sun', words: 14, lessons: 3 }
  ];

  // Category breakdown
  const vocabularyProgress = progressData.filter(p => p.category === 'vocabulary');
  const grammarProgress = progressData.filter(p => p.category === 'grammar');
  
  const vocabularyMastery = vocabularyProgress.length > 0 
    ? vocabularyProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / vocabularyProgress.length 
    : 0;
  
  const grammarMastery = grammarProgress.length > 0 
    ? grammarProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / grammarProgress.length 
    : 0;

  return {
    overview: {
      totalWordsLearned,
      totalWords,
      overallMastery,
      totalStudySessions,
      averageScore,
      currentStreak,
      longestStreak
    },
    weeklyProgress: weeklyData,
    categoryBreakdown: {
      vocabulary: {
        mastery: vocabularyMastery,
        sessions: vocabularyProgress.reduce((sum, p) => sum + p.studySessions, 0),
        items: vocabularyProgress.length
      },
      grammar: {
        mastery: grammarMastery,
        sessions: grammarProgress.reduce((sum, p) => sum + p.studySessions, 0),
        items: grammarProgress.length
      }
    },
    recentActivity: progressData
      .sort((a, b) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime())
      .slice(0, 5)
      .map(p => ({
        ...p,
        title: p.category === 'vocabulary' ? `Vocabulary List ${p.vocabularyListId}` : `Grammar Lesson ${p.vocabularyListId}`,
        type: p.category
      })),
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        unlocked: true,
        unlockedAt: new Date('2024-01-10')
      },
      {
        id: '2',
        title: 'Word Collector',
        description: 'Learn 50 words',
        icon: '📚',
        unlocked: totalWordsLearned >= 50,
        unlockedAt: totalWordsLearned >= 50 ? new Date('2024-01-15') : null
      },
      {
        id: '3',
        title: 'Grammar Master',
        description: 'Complete 5 grammar lessons',
        icon: '🎓',
        unlocked: grammarProgress.filter(p => p.masteryLevel >= 0.8).length >= 5,
        unlockedAt: null
      },
      {
        id: '4',
        title: 'Streak Champion',
        description: 'Maintain a 7-day study streak',
        icon: '🔥',
        unlocked: currentStreak >= 7,
        unlockedAt: currentStreak >= 7 ? new Date() : null
      }
    ]
  };
};

// React Query hooks
export const useUserProgressAnalytics = (userId: string) => {
  return useQuery({
    queryKey: ['user-progress-analytics', userId],
    queryFn: () => fetchUserProgressAnalytics(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}; 