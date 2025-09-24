import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VocabularyList, VocabularyWord, UserProgress } from '@/types';

import { loadPromovaVocabularySimple, loadPromovaVocabularyListSimple } from '@/lib/promova-data-simple';

// Mock API functions - in production, these would call your actual API endpoints
const fetchVocabularyLists = async (): Promise<VocabularyList[]> => {
  try {
    // Load Promova vocabulary lists (using simple version for testing)
    const promovaLists = await loadPromovaVocabularySimple();
    
    // Combine with existing mock data
    const mockLists = [
      {
        id: '1',
        title: 'Basic Vocabulary - Level 1',
        description: 'Essential words for beginners',
        difficulty: 'beginner' as const,
        category: 'basic',
        language: 'en',
        wordCount: 25,
        estimatedTime: 15,
        tags: ['basic', 'essential', 'beginner'],
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        title: 'Intermediate Words - Level 2',
        description: 'Common words for daily conversation',
        difficulty: 'intermediate' as const,
        category: 'intermediate',
        language: 'en',
        wordCount: 30,
        estimatedTime: 20,
        tags: ['intermediate', 'conversation', 'daily'],
        createdAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        title: 'Advanced Vocabulary - Level 3',
        description: 'Complex words for advanced learners',
        difficulty: 'advanced' as const,
        category: 'advanced',
        language: 'en',
        wordCount: 35,
        estimatedTime: 25,
        tags: ['advanced', 'complex', 'professional'],
        createdAt: new Date('2024-01-03'),
      },
    ];
    
    return [...promovaLists, ...mockLists];
  } catch (error) {
    console.error('Error fetching vocabulary lists:', error);
    return [];
  }
};

const fetchVocabularyList = async (id: string): Promise<VocabularyList & { words: VocabularyWord[] }> => {
  // Check if this is a Promova list
  if (id.startsWith('promova-')) {
    const promovaList = await loadPromovaVocabularyListSimple(id);
    if (promovaList) {
      return promovaList;
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock vocabulary words for non-Promova lists
  const words: VocabularyWord[] = [
    {
      id: '1',
      listId: id,
      word: 'accomplish',
      translation: 'lograr, cumplir',
      definition: 'To succeed in doing something, especially after trying hard',
      example: 'She accomplished her goal of running a marathon.',
      difficulty: 'intermediate',
      partOfSpeech: 'verb',
      synonyms: ['achieve', 'complete', 'fulfill'],
      pronunciation: '/əˈkʌm.plɪʃ/',
      difficultyRank: 2,
      createdAt: new Date(),
    },
    {
      id: '2',
      listId: id,
      word: 'endeavor',
      translation: 'esfuerzo, empeño',
      definition: 'A serious attempt to do something',
      example: 'Learning a new language is a worthwhile endeavor.',
      difficulty: 'intermediate',
      partOfSpeech: 'noun',
      synonyms: ['attempt', 'effort', 'undertaking'],
      pronunciation: '/ɪnˈdev.ər/',
      difficultyRank: 2,
      createdAt: new Date(),
    },
    {
      id: '3',
      listId: id,
      word: 'perseverance',
      translation: 'perseverancia, constancia',
      definition: 'Persistence in doing something despite difficulty',
      example: 'His perseverance in studying paid off with excellent grades.',
      difficulty: 'advanced',
      partOfSpeech: 'noun',
      synonyms: ['persistence', 'determination', 'tenacity'],
      pronunciation: '/ˌpɜː.sɪˈvɪə.rəns/',
      difficultyRank: 3,
      createdAt: new Date(),
    },
  ];

  return {
    id,
    title: `Vocabulary List ${id}`,
    description: `Sample vocabulary list with ${words.length} words`,
    difficulty: 'intermediate',
    category: 'sample',
    language: 'en',
    wordCount: words.length,
    estimatedTime: Math.ceil(words.length * 0.6),
    tags: ['sample', 'learning'],
    createdAt: new Date(),
    words,
  };
};

const fetchUserProgress = async (userId: string): Promise<UserProgress[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
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
    },
  ];
};

// React Query hooks
export const useVocabularyLists = () => {
  return useQuery({
    queryKey: ['vocabulary-lists'],
    queryFn: fetchVocabularyLists,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useVocabularyList = (id: string) => {
  return useQuery({
    queryKey: ['vocabulary-list', id],
    queryFn: () => fetchVocabularyList(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ['user-progress', userId],
    queryFn: () => fetchUserProgress(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Mutations for updating progress
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progress: Partial<UserProgress>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...progress, id: Date.now().toString() };
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress data
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      
      // Update the specific vocabulary list progress
      if (variables.vocabularyListId) {
        queryClient.invalidateQueries({ 
          queryKey: ['vocabulary-list', variables.vocabularyListId] 
        });
      }
    },
  });
}; 