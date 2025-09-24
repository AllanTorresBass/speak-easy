// Core application types for SpeakEasy

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface VocabularyList {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  language: string;
  wordCount: number;
  estimatedTime: number;
  tags: string[];
  createdAt: Date;
}

export interface VocabularyWord {
  id: string;
  listId: string;
  word: string;
  translation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  pronunciation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyRank: number;
  createdAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  vocabularyListId: string;
  wordId?: string;
  wordsLearned: number;
  totalWords: number;
  masteryLevel: number; // 0-5 scale
  averageScore: number;
  studySessions: number;
  lastStudied: Date;
  lastReviewed?: Date;
  nextReview?: Date;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrammarLesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  content: string;
  examples: string[];
  exercises: Exercise[];
  tags: string[];
  lessonCount: number;
  estimatedTime: number;
  language: string;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-construction';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface LearningSession {
  id: string;
  userId: string;
  sessionType: 'vocabulary' | 'grammar' | 'practice';
  durationMinutes: number;
  wordsLearned: number;
  accuracyPercentage: number;
  sessionData: Record<string, unknown>;
  createdAt: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} 