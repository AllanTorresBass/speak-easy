// Unified Grammar Types for SpeakEasy
// This provides consistent, type-safe interfaces for all grammar content

export interface GrammarContent {
  id: string;
  type: 'phrase' | 'sentence' | 'example' | 'definition' | 'pattern';
  text: string;
  context?: string;
  meaning?: string;
  translation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface GrammarContext {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: GrammarContent[];
  examples?: GrammarContent[];
  exercises?: GrammarExercise[];
  metadata?: Record<string, unknown>;
}

export interface GrammarExercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-construction' | 'translation' | 'identification';
  question: string;
  content: GrammarContent;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface GrammarConcept {
  id: string;
  title: string;
  definition: string;
  examples: GrammarContent[];
  rules?: string[];
  exceptions?: string[];
  relatedConcepts?: string[];
}

export interface GrammarGuide {
  id: string;
  title: string;
  description: string;
  version: string;
  createdDate: string;
  updatedDate?: string;
  
  // Core grammar concepts
  concepts: GrammarConcept[];
  
  // Professional contexts with unified structure
  contexts: GrammarContext[];
  
  // Metadata
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'basic-structure' | 'complex-structure' | 'verb-conjugation' | 'specialized' | 'cause-effect' | 'concepts' | 'problems' | 'questions' | 'interview';
    totalContent: number;
    totalExercises: number;
    estimatedTime: number;
    professionalAreas: string[];
    tags: string[];
    targetAudience: string[];
    prerequisites?: string[];
  };
  
  // Audio configuration (shared across all content)
  audioConfig?: {
    defaultSpeed: number;
    defaultPitch: number;
    defaultVolume: number;
    voiceQuality: 'basic' | 'standard' | 'premium';
    naturalPauses: boolean;
    emphasisSystem: boolean;
  };
}

export interface GrammarSearchResult {
  guide: GrammarGuide;
  context: GrammarContext;
  content: GrammarContent[];
  relevance: number;
  matchType: 'exact' | 'partial' | 'related';
}

export interface GrammarProgress {
  userId: string;
  guideId: string;
  contextId: string;
  contentId: string;
  masteryLevel: number; // 0-5 scale
  lastStudied: Date;
  reviewCount: number;
  nextReview: Date;
  accuracy: number;
  timeSpent: number; // in minutes
}

export interface GrammarSession {
  id: string;
  userId: string;
  guideId: string;
  startTime: Date;
  endTime?: Date;
  contentStudied: string[];
  exercisesCompleted: string[];
  accuracy: number;
  timeSpent: number;
}

// Utility types for backward compatibility
export interface LegacyGrammarPhrase {
  [key: string]: unknown;
}

export interface LegacyGrammarContext {
  title: string;
  description: string;
  phrases: LegacyGrammarPhrase[];
}

export interface LegacyGrammarGuide {
  title: string;
  description: string;
  version?: string;
  created_date?: string;
  metadata?: {
    difficulty_level?: string;
    professional_areas?: string[];
    tags?: string[];
    target_audience?: string[];
  };
  
  // Basic concepts structure
  basic_concepts?: {
    definition?: string;
    examples?: unknown[];
    key_functions?: string[];
    formation_rules?: unknown[];
  };
  
  // Professional contexts structure
  professional_contexts?: Record<string, {
    title: string;
    description: string;
    phrases?: unknown[];
    comparative_adjectives?: unknown[];
    superlative_adjectives?: unknown[];
    content?: unknown[];
    sentences?: unknown[];
  }>;
  
  // Sections structure (for subject_predicate_grammar)
  sections?: unknown[];
  
  // Categories structure (for prepositional_phrases)
  categories?: Record<string, {
    title: string;
    description: string;
    concepts?: unknown[];
  }>;
  
  // Phases structure (for project management concepts)
  phases?: Record<string, {
    title: string;
    description: string;
    concepts?: unknown[];
  }>;
  
  // Specialized areas structure (for project management concepts)
  specialized_areas?: Record<string, {
    title: string;
    description: string;
    concepts?: unknown[];
  }>;
  
  // Professional vocabulary structure (for verbs_grammar)
  professional_vocabulary?: Record<string, unknown>;
  
  // Cause-effect categories structure (for cause-effect grammar)
  cause_effect_categories?: Record<string, unknown>;
  
  // Software attributes structure (for cause-effect grammar)
  software_attributes?: unknown;
  
  // Problem categories structure (for problems grammar)
  problem_categories?: Record<string, {
    title: string;
    description: string;
    problems: Array<{
      id: number;
      problem: string;
      description: string;
      impact: string;
      mitigation: string;
    }>;
  }>;
}
