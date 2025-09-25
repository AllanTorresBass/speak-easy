import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GrammarLesson, UserProgress } from '@/types';

// Mock API functions - in production, these would call your actual API endpoints
const fetchGrammarLessons = async (): Promise<GrammarLesson[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data based on your existing grammar JSON structure
  return [
    {
      id: 'basic-structure',
      title: 'Basic Sentence Structure',
      description: 'Learn the fundamentals of English sentence construction',
      category: 'basic-structure',
      difficulty: 'beginner',
      estimatedTime: 20,
      lessonCount: 5,
      tags: ['basic', 'structure', 'sentences'],
      createdAt: new Date('2024-01-01'),
      content: 'Basic sentence structure in English follows a subject-verb-object pattern.',
      examples: ['The cat sat on the mat.', 'She reads books every day.'],
      exercises: [],
      language: 'en'
    },
    {
      id: 'complex-structure',
      title: 'Complex Sentence Structures',
      description: 'Master advanced sentence patterns and clauses',
      category: 'complex-structure',
      difficulty: 'intermediate',
      estimatedTime: 30,
      lessonCount: 8,
      tags: ['complex', 'clauses', 'advanced'],
      createdAt: new Date('2024-01-02'),
      content: 'Complex sentences contain one independent clause and at least one dependent clause.',
      examples: ['Although it was raining, we went for a walk.', 'She studied hard because she wanted to pass.'],
      exercises: [],
      language: 'en'
    },
    {
      id: 'verb-conjugation',
      title: 'Verb Conjugation Guide',
      description: 'Comprehensive guide to English verb forms and tenses',
      category: 'verb-conjugation',
      difficulty: 'intermediate',
      estimatedTime: 25,
      lessonCount: 6,
      tags: ['verbs', 'tenses', 'conjugation'],
      createdAt: new Date('2024-01-03'),
      content: 'English verbs change form based on tense, person, and number.',
      examples: ['I walk to school.', 'She walked to school yesterday.', 'They will walk to school tomorrow.'],
      exercises: [],
      language: 'en'
    },
    {
      id: 'cause-effect',
      title: 'Cause and Effect Relationships',
      description: 'Express relationships between actions and outcomes',
      category: 'cause-effect',
      difficulty: 'advanced',
      estimatedTime: 35,
      lessonCount: 7,
      tags: ['cause-effect', 'relationships', 'advanced'],
      createdAt: new Date('2024-01-04'),
      content: 'Cause and effect relationships show how one action leads to another.',
      examples: ['Because it rained, the ground became wet.', 'The heavy traffic caused us to be late.'],
      exercises: [],
      language: 'en'
    },
  ];
};

const fetchGrammarLesson = async (id: string): Promise<GrammarLesson & { lessons: unknown[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock lesson content based on your grammar JSON files
  const lessons = [
    {
      id: '1',
      title: 'Subject and Predicate',
      content: 'Every sentence has two main parts: the subject and the predicate. The subject tells us who or what the sentence is about, while the predicate tells us what the subject does or is.',
      examples: [
        'The cat (subject) sleeps on the sofa (predicate).',
        'Maria (subject) loves reading books (predicate).',
        'The weather (subject) is beautiful today (predicate).'
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'Identify the subject in: "The students study hard for their exams."',
          options: ['The students', 'study hard', 'for their exams', 'hard for their'],
          correctAnswer: 0,
          explanation: 'The subject is "The students" because it tells us who the sentence is about.'
        },
        {
          id: 'ex2',
          type: 'fill-in-blank',
          question: 'Complete the sentence: "_____ runs in the park every morning."',
          options: ['He', 'She', 'They', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Any singular subject (He, She) or plural subject (They) can work here.'
        }
      ]
    },
    {
      id: '2',
      title: 'Types of Sentences',
      content: 'There are four main types of sentences: declarative (statements), interrogative (questions), imperative (commands), and exclamatory (exclamations).',
      examples: [
        'Declarative: The sun rises in the east.',
        'Interrogative: Where does the sun rise?',
        'Imperative: Please close the door.',
        'Exclamatory: What a beautiful sunset!'
      ],
      exercises: [
        {
          id: 'ex3',
          type: 'multiple-choice',
          question: 'Which type of sentence is: "How amazing is this view!"?',
          options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
          correctAnswer: 3,
          explanation: 'This is an exclamatory sentence because it expresses strong emotion and ends with an exclamation mark.'
        }
      ]
    }
  ];

  return {
    id,
    title: `Grammar Lesson ${id}`,
    description: `Comprehensive grammar lesson covering ${lessons.length} topics`,
    category: 'basic-structure',
    difficulty: 'beginner',
    estimatedTime: Math.ceil(lessons.length * 4),
    lessonCount: lessons.length,
    tags: ['grammar', 'lessons'],
    createdAt: new Date(),
    content: 'This is a comprehensive grammar lesson covering multiple topics.',
    examples: ['Example sentence 1', 'Example sentence 2'],
    exercises: [],
    language: 'en',
    lessons,
  };
};

const fetchUserGrammarProgress = async (userId: string): Promise<UserProgress[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: '1',
      userId,
      vocabularyListId: 'basic-structure', // Using vocabularyListId for grammar lessons too
      wordsLearned: 3, // Lessons completed
      totalWords: 5, // Total lessons
      lastStudied: new Date('2024-01-15'),
      masteryLevel: 0.6,
      studySessions: 4,
      averageScore: 78,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      userId,
      vocabularyListId: 'complex-structure',
      wordsLearned: 2,
      totalWords: 8,
      lastStudied: new Date('2024-01-14'),
      masteryLevel: 0.25,
      studySessions: 2,
      averageScore: 65,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-14'),
    },
  ];
};

// React Query hooks
export const useGrammarLessons = () => {
  return useQuery({
    queryKey: ['grammar-lessons'],
    queryFn: fetchGrammarLessons,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGrammarLesson = (id: string) => {
  return useQuery({
    queryKey: ['grammar-lesson', id],
    queryFn: () => fetchGrammarLesson(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useUserGrammarProgress = (userId: string) => {
  return useQuery({
    queryKey: ['user-grammar-progress', userId],
    queryFn: () => fetchUserGrammarProgress(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Mutations for updating progress
export const useUpdateGrammarProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progress: Partial<UserProgress>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...progress, id: Date.now().toString() };
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress data
      queryClient.invalidateQueries({ queryKey: ['user-grammar-progress'] });
      
      // Update the specific grammar lesson progress
      if (variables.vocabularyListId) {
        queryClient.invalidateQueries({ 
          queryKey: ['grammar-lesson', variables.vocabularyListId] 
        });
      }
    },
  });
}; 