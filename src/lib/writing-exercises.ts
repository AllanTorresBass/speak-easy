// Writing Exercise System
// Provides various types of writing exercises and assessment capabilities

export interface WritingExercise {
  id: string;
  type: 'sentence-completion' | 'paragraph-writing' | 'essay-writing' | 'translation' | 'correction' | 'creative-writing';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'grammar' | 'vocabulary' | 'composition' | 'mixed';
  estimatedTime: number; // in minutes
  wordCount: {
    min: number;
    max: number;
    target: number;
  };
  instructions: string[];
  requirements: string[];
  examples?: string[];
  rubric?: WritingRubric;
  hints?: string[];
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  points: number;
}

export interface WritingRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
  passingScore: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
  weight: number; // 0-1, relative importance
  examples?: string[];
}

export interface WritingSubmission {
  id: string;
  exerciseId: string;
  userId: string;
  content: string;
  wordCount: number;
  timeSpent: number; // in seconds
  submittedAt: Date;
  attempts: number;
  status: 'draft' | 'submitted' | 'graded' | 'revised';
  score?: number;
  feedback?: WritingFeedback[];
  rubricScores?: RubricScore[];
  revisionHistory?: WritingRevision[];
}

export interface WritingFeedback {
  type: 'grammar' | 'vocabulary' | 'structure' | 'content' | 'style' | 'general';
  message: string;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high';
  position?: {
    start: number;
    end: number;
  };
  examples?: string[];
}

export interface RubricScore {
  criterionName: string;
  points: number;
  maxPoints: number;
  feedback: string;
}

export interface WritingRevision {
  id: string;
  content: string;
  wordCount: number;
  revisedAt: Date;
  reason: string;
  feedbackApplied: string[];
}

export interface WritingAssessment {
  submission: WritingSubmission;
  overallScore: number;
  rubricScores: RubricScore[];
  feedback: WritingFeedback[];
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  timeToGrade: number; // in seconds
  gradedBy: string; // AI or human
  confidence: number; // 0-1, AI confidence in assessment
}

export class WritingExerciseSystem {
  private static readonly EXERCISE_TEMPLATES: Record<string, Partial<WritingExercise>> = {
    'sentence-completion': {
      type: 'sentence-completion',
      category: 'grammar',
      wordCount: { min: 5, max: 20, target: 12 },
      instructions: [
        'Complete the sentence using the correct grammar structure',
        'Ensure your sentence makes logical sense',
        'Use appropriate vocabulary for the context'
      ],
      requirements: [
        'Use correct verb tense',
        'Maintain subject-verb agreement',
        'Include all required elements'
      ]
    },
    'paragraph-writing': {
      type: 'paragraph-writing',
      category: 'composition',
      wordCount: { min: 50, max: 150, target: 100 },
      instructions: [
        'Write a coherent paragraph on the given topic',
        'Include a clear topic sentence',
        'Support your main idea with details and examples'
      ],
      requirements: [
        'Clear topic sentence',
        'Supporting details',
        'Logical flow',
        'Appropriate conclusion'
      ]
    },
    'essay-writing': {
      type: 'essay-writing',
      category: 'composition',
      wordCount: { min: 200, max: 500, target: 350 },
      instructions: [
        'Write a well-structured essay on the given topic',
        'Include an introduction, body paragraphs, and conclusion',
        'Use evidence and examples to support your arguments'
      ],
      requirements: [
        'Clear thesis statement',
        'Well-organized body paragraphs',
        'Proper transitions',
        'Strong conclusion'
      ]
    },
    'translation': {
      type: 'translation',
      category: 'mixed',
      wordCount: { min: 20, max: 100, target: 60 },
      instructions: [
        'Translate the given text accurately',
        'Maintain the original meaning and tone',
        'Use appropriate vocabulary and grammar'
      ],
      requirements: [
        'Accurate translation',
        'Maintain meaning',
        'Appropriate style',
        'Correct grammar'
      ]
    },
    'correction': {
      type: 'correction',
      category: 'grammar',
      wordCount: { min: 10, max: 50, target: 30 },
      instructions: [
        'Identify and correct the errors in the given text',
        'Explain why each correction is necessary',
        'Provide the corrected version'
      ],
      requirements: [
        'Identify all errors',
        'Provide correct versions',
        'Explain corrections',
        'Maintain original meaning'
      ]
    },
    'creative-writing': {
      type: 'creative-writing',
      category: 'composition',
      wordCount: { min: 100, max: 300, target: 200 },
      instructions: [
        'Write a creative piece based on the given prompt',
        'Use vivid language and descriptive details',
        'Show creativity and originality'
      ],
      requirements: [
        'Creative approach',
        'Vivid descriptions',
        'Engaging narrative',
        'Original content'
      ]
    }
  };

  private static readonly DEFAULT_RUBRICS: Record<string, WritingRubric> = {
    'sentence-completion': {
      criteria: [
        { name: 'Grammar', description: 'Correct use of grammar structures', maxPoints: 10, weight: 0.4 },
        { name: 'Vocabulary', description: 'Appropriate word choice', maxPoints: 8, weight: 0.3 },
        { name: 'Meaning', description: 'Logical and clear meaning', maxPoints: 7, weight: 0.3 }
      ],
      totalPoints: 25,
      passingScore: 18
    },
    'paragraph-writing': {
      criteria: [
        { name: 'Content', description: 'Relevant and well-developed ideas', maxPoints: 15, weight: 0.3 },
        { name: 'Organization', description: 'Clear structure and logical flow', maxPoints: 12, weight: 0.25 },
        { name: 'Grammar', description: 'Correct grammar and mechanics', maxPoints: 10, weight: 0.2 },
        { name: 'Style', description: 'Appropriate tone and language', maxPoints: 8, weight: 0.15 },
        { name: 'Length', description: 'Appropriate word count', maxPoints: 5, weight: 0.1 }
      ],
      totalPoints: 50,
      passingScore: 35
    },
    'essay-writing': {
      criteria: [
        { name: 'Thesis', description: 'Clear and focused thesis statement', maxPoints: 10, weight: 0.15 },
        { name: 'Content', description: 'Rich content with evidence and examples', maxPoints: 20, weight: 0.3 },
        { name: 'Organization', description: 'Logical structure and transitions', maxPoints: 15, weight: 0.2 },
        { name: 'Grammar', description: 'Correct grammar and mechanics', maxPoints: 12, weight: 0.15 },
        { name: 'Style', description: 'Appropriate tone and language', maxPoints: 8, weight: 0.1 },
        { name: 'Length', description: 'Appropriate word count', maxPoints: 5, weight: 0.1 }
      ],
      totalPoints: 70,
      passingScore: 49
    }
  };

  /**
   * Create a new writing exercise
   */
  static createExercise(
    type: string,
    title: string,
    description: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    customOptions?: Partial<WritingExercise>
  ): WritingExercise {
    const template = this.EXERCISE_TEMPLATES[type] || this.EXERCISE_TEMPLATES['paragraph-writing'];
    const rubric = this.DEFAULT_RUBRICS[type] || this.DEFAULT_RUBRICS['paragraph-writing'];

    const exercise: WritingExercise = {
      id: this.generateId(),
      type: template.type as 'essay' | 'paragraph' | 'sentence' | 'creative',
      title,
      description,
      difficulty,
      category: template.category as 'grammar' | 'vocabulary' | 'structure' | 'creativity',
      estimatedTime: template.estimatedTime || 15,
      wordCount: template.wordCount || { min: 50, max: 150, target: 100 },
      instructions: template.instructions || [],
      requirements: template.requirements || [],
      rubric,
      hints: [],
      attemptsAllowed: 3,
      points: this.calculatePoints(difficulty, type),
      ...customOptions
    };

    return exercise;
  }

  /**
   * Calculate points for an exercise based on difficulty and type
   */
  private static calculatePoints(difficulty: string, type: string): number {
    const difficultyMultiplier = { beginner: 1, intermediate: 1.5, advanced: 2 };
    const typeMultiplier = { 'sentence-completion': 1, 'paragraph-writing': 2, 'essay-writing': 3, 'translation': 2, 'correction': 1.5, 'creative-writing': 2.5 };
    
    const basePoints = 10;
    return Math.round(basePoints * difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] * typeMultiplier[type as keyof typeof typeMultiplier]);
  }

  /**
   * Create a new writing submission
   */
  static createSubmission(
    exerciseId: string,
    userId: string,
    content: string
  ): WritingSubmission {
    const wordCount = this.countWords(content);
    
    return {
      id: this.generateId(),
      exerciseId,
      userId,
      content,
      wordCount,
      timeSpent: 0,
      submittedAt: new Date(),
      attempts: 1,
      status: 'draft'
    };
  }

  /**
   * Count words in text
   */
  static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Validate submission against exercise requirements
   */
  static validateSubmission(
    submission: WritingSubmission,
    exercise: WritingExercise
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check word count
    if (submission.wordCount < exercise.wordCount.min) {
      errors.push(`Your submission is too short. Minimum ${exercise.wordCount.min} words required.`);
    } else if (submission.wordCount > exercise.wordCount.max) {
      warnings.push(`Your submission is longer than recommended. Consider editing to ${exercise.wordCount.max} words or less.`);
    }

    // Check for basic content
    if (submission.content.trim().length === 0) {
      errors.push('Submission cannot be empty.');
    }

    // Check for minimum sentence structure
    const sentences = submission.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 1) {
      errors.push('Submission must contain at least one complete sentence.');
    }

    // Check for common writing issues
    if (submission.content.includes('  ')) {
      warnings.push('Avoid double spaces between words.');
    }

    if (submission.content.length > 0 && !submission.content[0].match(/[A-Z]/)) {
      errors.push('Sentences should begin with a capital letter.');
    }

    // Generate suggestions based on exercise type
    if (exercise.type === 'essay-writing' && submission.wordCount < exercise.wordCount.target) {
      suggestions.push('Consider adding more supporting details and examples to reach the target word count.');
    }

    if (exercise.type === 'paragraph-writing' && sentences.length < 3) {
      suggestions.push('A good paragraph typically has 3-5 sentences. Consider adding more detail.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Assess a writing submission
   */
  static assessSubmission(
    submission: WritingSubmission,
    exercise: WritingExercise
  ): WritingAssessment {
    const startTime = Date.now();
    
    // Basic validation
    const validation = this.validateSubmission(submission, exercise);
    
    // Calculate rubric scores (simplified AI assessment)
    const rubricScores = this.calculateRubricScores(submission, exercise);
    
    // Calculate overall score
    const overallScore = rubricScores.reduce((total, score) => total + score.points, 0);
    
    // Determine grade
    const grade = this.calculateGrade(overallScore, exercise.rubric.totalPoints);
    
    // Generate feedback
    const feedback = this.generateFeedback(submission, exercise, rubricScores);
    
    // Identify strengths and areas for improvement
    const strengths = this.identifyStrengths(rubricScores);
    const areasForImprovement = this.identifyAreasForImprovement(rubricScores);
    const suggestions = this.generateSuggestions(exercise, rubricScores, areasForImprovement);
    
    const timeToGrade = (Date.now() - startTime) / 1000;
    
    return {
      submission,
      overallScore,
      rubricScores,
      feedback,
      strengths,
      areasForImprovement,
      suggestions,
      grade,
      timeToGrade,
      gradedBy: 'AI',
      confidence: this.calculateConfidence(submission, rubricScores)
    };
  }

  /**
   * Calculate rubric scores for a submission
   */
  private static calculateRubricScores(
    submission: WritingSubmission,
    exercise: WritingExercise
  ): RubricScore[] {
    return exercise.rubric.criteria.map(criterion => {
      let points = 0;
      let feedback = '';
      
      // Simplified scoring logic - in production, this would use more sophisticated NLP
      switch (criterion.name.toLowerCase()) {
        case 'grammar':
          points = this.scoreGrammar(submission.content, criterion.maxPoints);
          feedback = this.getGrammarFeedback(points, criterion.maxPoints);
          break;
        case 'content':
          points = this.scoreContent(submission.content, submission.wordCount, criterion.maxPoints);
          feedback = this.getContentFeedback(points, criterion.maxPoints);
          break;
        case 'organization':
          points = this.scoreOrganization(submission.content, criterion.maxPoints);
          feedback = this.getOrganizationFeedback(points, criterion.maxPoints);
          break;
        case 'style':
          points = this.scoreStyle(submission.content, criterion.maxPoints);
          feedback = this.getStyleFeedback(points, criterion.maxPoints);
          break;
        case 'length':
          points = this.scoreLength(submission.wordCount, exercise.wordCount, criterion.maxPoints);
          feedback = this.getLengthFeedback(submission.wordCount, exercise.wordCount);
          break;
        default:
          points = Math.round(criterion.maxPoints * 0.7); // Default score
          feedback = 'Good effort on this criterion.';
      }
      
      return {
        criterionName: criterion.name,
        points: Math.max(0, Math.min(criterion.maxPoints, points)),
        maxPoints: criterion.maxPoints,
        feedback
      };
    });
  }

  /**
   * Score grammar aspects
   */
  private static scoreGrammar(content: string, maxPoints: number): number {
    let score = maxPoints;
    
    // Basic grammar checks
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const hasCapitalization = sentences.every(s => s.trim().length > 0 && s.trim()[0].match(/[A-Z]/));
    const hasPunctuation = content.match(/[.!?]$/);
    
    if (!hasCapitalization) score -= maxPoints * 0.3;
    if (!hasPunctuation) score -= maxPoints * 0.2;
    
    // Check for common errors
    const commonErrors = [
      /\b(?:i)\b/g, // lowercase 'i'
      /\b(?:dont|cant|wont|isnt|arent|wasnt|werent)\b/g, // missing apostrophes
      /\b(?:alot)\b/g, // 'a lot' as one word
    ];
    
    commonErrors.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        score -= maxPoints * 0.1 * matches.length;
      }
    });
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Score content quality
   */
  private static scoreContent(content: string, wordCount: number, maxPoints: number): number {
    let score = maxPoints;
    
    // Word count factor
    if (wordCount < 20) score -= maxPoints * 0.4;
    else if (wordCount < 50) score -= maxPoints * 0.2;
    
    // Content variety (unique words)
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const varietyRatio = uniqueWords.size / words.length;
    
    if (varietyRatio < 0.5) score -= maxPoints * 0.3;
    else if (varietyRatio > 0.8) score += maxPoints * 0.1;
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Score organization
   */
  private static scoreOrganization(content: string, maxPoints: number): number {
    let score = maxPoints;
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) {
      score -= maxPoints * 0.5;
    } else if (sentences.length < 3) {
      score -= maxPoints * 0.2;
    }
    
    // Check for basic paragraph structure
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length > 1) {
      score += maxPoints * 0.1;
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Score writing style
   */
  private static scoreStyle(content: string, maxPoints: number): number {
    let score = maxPoints;
    
    // Check for repetitive words
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCounts: Record<string, number> = {};
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    const repetitiveWords = Object.entries(wordCounts).filter(([_, count]) => count > 3);
    if (repetitiveWords.length > 0) {
      score -= maxPoints * 0.2;
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Score length appropriateness
   */
  private static scoreLength(wordCount: number, target: { min: number; max: number; target: number }, maxPoints: number): number {
    if (wordCount >= target.min && wordCount <= target.max) {
      return maxPoints;
    } else if (wordCount >= target.min * 0.8 && wordCount <= target.max * 1.2) {
      return Math.round(maxPoints * 0.8);
    } else {
      return Math.round(maxPoints * 0.5);
    }
  }

  /**
   * Generate feedback for different criteria
   */
  private static getGrammarFeedback(points: number, maxPoints: number): string {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 90) return 'Excellent grammar usage!';
    if (percentage >= 75) return 'Good grammar with minor issues.';
    if (percentage >= 60) return 'Some grammar issues need attention.';
    return 'Grammar needs significant improvement.';
  }

  private static getContentFeedback(points: number, maxPoints: number): string {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 90) return 'Rich and engaging content!';
    if (percentage >= 75) return 'Good content with room for expansion.';
    if (percentage >= 60) return 'Content could be more developed.';
    return 'Content needs substantial development.';
  }

  private static getOrganizationFeedback(points: number, maxPoints: number): string {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 90) return 'Well-organized and structured!';
    if (percentage >= 75) return 'Good organization with clear flow.';
    if (percentage >= 60) return 'Organization could be improved.';
    return 'Organization needs significant work.';
  }

  private static getStyleFeedback(points: number, maxPoints: number): string {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 90) return 'Excellent writing style!';
    if (percentage >= 75) return 'Good style with some variety.';
    if (percentage >= 60) return 'Style could be more varied.';
    return 'Style needs improvement.';
  }

  private static getLengthFeedback(wordCount: number, target: { min: number; max: number; target: number }): string {
    if (wordCount < target.min) {
      return `Consider adding more content to reach the minimum ${target.min} words.`;
    } else if (wordCount > target.max) {
      return `Consider editing to stay within the ${target.max} word limit.`;
    }
    return 'Perfect length for this exercise.';
  }

  /**
   * Calculate grade based on score
   */
  private static calculateGrade(score: number, totalPoints: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    const percentage = (score / totalPoints) * 100;
    
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  /**
   * Identify strengths in the submission
   */
  private static identifyStrengths(rubricScores: RubricScore[]): string[] {
    return rubricScores
      .filter(score => (score.points / score.maxPoints) >= 0.8)
      .map(score => `Strong performance in ${score.criterionName.toLowerCase()}`);
  }

  /**
   * Identify areas for improvement
   */
  private static identifyAreasForImprovement(rubricScores: RubricScore[]): string[] {
    return rubricScores
      .filter(score => (score.points / score.maxPoints) < 0.7)
      .map(score => score.criterionName);
  }

  /**
   * Generate improvement suggestions
   */
  private static generateSuggestions(
    exercise: WritingExercise,
    rubricScores: RubricScore[],
    areasForImprovement: string[]
  ): string[] {
    const suggestions: string[] = [];
    
    areasForImprovement.forEach(area => {
      switch (area.toLowerCase()) {
        case 'grammar':
          suggestions.push('Review basic grammar rules and practice sentence structure.');
          break;
        case 'content':
          suggestions.push('Add more specific details, examples, and supporting evidence.');
          break;
        case 'organization':
          suggestions.push('Plan your writing with a clear introduction, body, and conclusion.');
          break;
        case 'style':
          suggestions.push('Vary your sentence structure and word choice for more engaging writing.');
          break;
        case 'length':
          suggestions.push('Aim for the target word count to fully develop your ideas.');
          break;
      }
    });
    
    // Add exercise-specific suggestions
    if (exercise.type === 'essay-writing') {
      suggestions.push('Use transition words to connect your ideas smoothly.');
    }
    
    if (exercise.type === 'creative-writing') {
      suggestions.push('Use vivid descriptions and sensory details to engage readers.');
    }
    
    return suggestions;
  }

  /**
   * Calculate AI confidence in assessment
   */
  private static calculateConfidence(submission: WritingSubmission, rubricScores: RubricScore[]): number {
    // Simplified confidence calculation
    // In production, this would consider factors like text length, complexity, etc.
    const averageScore = rubricScores.reduce((sum, score) => sum + score.points, 0) / rubricScores.length;
    const maxScore = rubricScores[0]?.maxPoints || 10;
    
    // Higher confidence for submissions with clear patterns
    let confidence = 0.7; // Base confidence
    
    if (submission.wordCount > 100) confidence += 0.1;
    if (submission.wordCount > 200) confidence += 0.1;
    
    // Adjust based on score consistency
    const scoreVariance = rubricScores.reduce((sum, score) => {
      const diff = score.points - averageScore;
      return sum + diff * diff;
    }, 0) / rubricScores.length;
    
    if (scoreVariance < 5) confidence += 0.1; // Consistent scores
    
    return Math.min(1, Math.max(0.5, confidence));
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `writing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 