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
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  language: string;
  wordCount: number;
  estimatedTime: string;
  createdAt: Date;
}

export interface VocabularyWord {
  id: string;
  listId: string;
  word: string;
  translation: string;
  partOfSpeech: string;
  exampleSentence?: string;
  difficultyRank: number;
  createdAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  wordId: string;
  masteryLevel: number; // 0-5 scale
  lastReviewed: Date;
  nextReview: Date;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrammarLesson {
  id: string;
  title: string;
  category: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  examples: string[];
  exercises: Exercise[];
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
  sessionData: Record<string, any>;
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