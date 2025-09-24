// Intelligent Difficulty Adaptation System
// Automatically adjusts learning content difficulty based on user performance

export interface DifficultyProfile {
  userId: string;
  vocabularyLevel: 'beginner' | 'intermediate' | 'advanced';
  grammarLevel: 'beginner' | 'intermediate' | 'advanced';
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  listeningLevel: 'beginner' | 'intermediate' | 'advanced';
  writingLevel: 'beginner' | 'intermediate' | 'advanced';
  speakingLevel: 'beginner' | 'intermediate' | 'advanced';
  overallProficiency: number; // 0-100 scale
  learningSpeed: 'slow' | 'normal' | 'fast';
  errorTolerance: 'low' | 'medium' | 'high';
  challengePreference: 'conservative' | 'balanced' | 'aggressive';
}

export interface PerformanceMetrics {
  accuracy: number; // 0-100 percentage
  responseTime: number; // Average response time in seconds
  completionRate: number; // 0-100 percentage
  errorPatterns: string[]; // Types of errors made
  strengthAreas: string[]; // Areas where user excels
  weaknessAreas: string[]; // Areas that need improvement
  learningCurve: number; // Rate of improvement over time
  retentionRate: number; // 0-100 percentage
  confidenceLevel: number; // 0-100 percentage
}

export interface AdaptiveContent {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  complexity: number; // 1-10 scale
  supportLevel: 'high' | 'medium' | 'low'; // Amount of hints/help
  challengeType: 'reinforcement' | 'practice' | 'stretch'; // Type of challenge
  estimatedTime: number; // Estimated completion time in minutes
  prerequisites: string[]; // Required knowledge
  nextSteps: string[]; // Recommended next content
}

export class DifficultyAdaptationSystem {
  private static readonly DIFFICULTY_WEIGHTS = {
    accuracy: 0.3,
    responseTime: 0.2,
    completionRate: 0.15,
    retentionRate: 0.2,
    confidenceLevel: 0.15
  };

  private static readonly LEVEL_THRESHOLDS = {
    beginner: { min: 0, max: 40 },
    intermediate: { min: 30, max: 70 },
    advanced: { min: 60, max: 100 }
  };

  private static readonly ADAPTATION_SPEED = {
    slow: 0.1,
    normal: 0.2,
    fast: 0.3
  };

  /**
   * Calculate overall proficiency score from performance metrics
   */
  static calculateProficiency(metrics: PerformanceMetrics): number {
    const weightedScore = 
      metrics.accuracy * this.DIFFICULTY_WEIGHTS.accuracy +
      this.normalizeResponseTime(metrics.responseTime) * this.DIFFICULTY_WEIGHTS.responseTime +
      metrics.completionRate * this.DIFFICULTY_WEIGHTS.completionRate +
      metrics.retentionRate * this.DIFFICULTY_WEIGHTS.retentionRate +
      metrics.confidenceLevel * this.DIFFICULTY_WEIGHTS.confidenceLevel;

    return Math.round(Math.max(0, Math.min(100, weightedScore)));
  }

  /**
   * Normalize response time to 0-100 scale (faster = higher score)
   */
  private static normalizeResponseTime(responseTime: number): number {
    const optimalTime = 3; // 3 seconds is optimal
    const maxTime = 15; // 15 seconds is maximum acceptable
    
    if (responseTime <= optimalTime) return 100;
    if (responseTime >= maxTime) return 0;
    
    return Math.round(100 - ((responseTime - optimalTime) / (maxTime - optimalTime)) * 100);
  }

  /**
   * Determine appropriate difficulty level based on proficiency
   */
  static determineDifficultyLevel(proficiency: number): 'beginner' | 'intermediate' | 'advanced' {
    if (proficiency <= this.LEVEL_THRESHOLDS.beginner.max) return 'beginner';
    if (proficiency <= this.LEVEL_THRESHOLDS.intermediate.max) return 'intermediate';
    return 'advanced';
  }

  /**
   * Calculate content complexity based on user profile and performance
   */
  static calculateContentComplexity(
    profile: DifficultyProfile,
    metrics: PerformanceMetrics,
    contentType: keyof Omit<DifficultyProfile, 'userId' | 'overallProficiency' | 'learningSpeed' | 'errorTolerance' | 'challengePreference'>
  ): number {
    const baseComplexity = this.getBaseComplexity(profile[contentType]);
    const performanceAdjustment = this.calculatePerformanceAdjustment(metrics);
    const learningSpeedAdjustment = this.getLearningSpeedAdjustment(profile.learningSpeed);
    const challengeAdjustment = this.getChallengeAdjustment(profile.challengePreference);

    let complexity = baseComplexity + performanceAdjustment + learningSpeedAdjustment + challengeAdjustment;

    // Clamp complexity to 1-10 range
    complexity = Math.max(1, Math.min(10, complexity));

    return Math.round(complexity * 10) / 10;
  }

  /**
   * Get base complexity for a difficulty level
   */
  private static getBaseComplexity(level: string): number {
    switch (level) {
      case 'beginner': return 3;
      case 'intermediate': return 6;
      case 'advanced': return 8;
      default: return 5;
    }
  }

  /**
   * Calculate performance-based complexity adjustment
   */
  private static calculatePerformanceAdjustment(metrics: PerformanceMetrics): number {
    let adjustment = 0;

    // Adjust based on accuracy
    if (metrics.accuracy >= 90) adjustment += 0.5;
    else if (metrics.accuracy <= 70) adjustment -= 0.5;

    // Adjust based on learning curve
    if (metrics.learningCurve > 0.1) adjustment += 0.3;
    else if (metrics.learningCurve < -0.05) adjustment -= 0.3;

    // Adjust based on retention rate
    if (metrics.retentionRate >= 85) adjustment += 0.2;
    else if (metrics.retentionRate <= 65) adjustment -= 0.2;

    return adjustment;
  }

  /**
   * Get learning speed adjustment
   */
  private static getLearningSpeedAdjustment(speed: string): number {
    switch (speed) {
      case 'slow': return -0.3;
      case 'fast': return 0.3;
      default: return 0;
    }
  }

  /**
   * Get challenge preference adjustment
   */
  private static getChallengeAdjustment(preference: string): number {
    switch (preference) {
      case 'conservative': return -0.2;
      case 'aggressive': return 0.2;
      default: return 0;
    }
  }

  /**
   * Determine support level based on user needs
   */
  static determineSupportLevel(
    profile: DifficultyProfile,
    metrics: PerformanceMetrics,
    contentType: string
  ): 'high' | 'medium' | 'low' {
    const errorRate = 100 - metrics.accuracy;
    const confidence = metrics.confidenceLevel;
    const errorTolerance = profile.errorTolerance;

    // High support for users with low confidence or high error rates
    if (confidence < 50 || errorRate > 30) return 'high';
    
    // Medium support for intermediate users
    if (confidence < 70 || errorRate > 15) return 'medium';
    
    // Low support for confident users
    return 'low';
  }

  /**
   * Determine challenge type based on performance
   */
  static determineChallengeType(
    profile: DifficultyProfile,
    metrics: PerformanceMetrics
  ): 'reinforcement' | 'practice' | 'stretch' {
    const accuracy = metrics.accuracy;
    const confidence = metrics.confidenceLevel;
    const learningCurve = metrics.learningCurve;

    // Reinforcement for struggling users
    if (accuracy < 70 || confidence < 50) return 'reinforcement';
    
    // Stretch for high-performing users
    if (accuracy > 90 && confidence > 80 && learningCurve > 0.05) return 'stretch';
    
    // Practice for everyone else
    return 'practice';
  }

  /**
   * Generate personalized learning path
   */
  static generateLearningPath(
    profile: DifficultyProfile,
    metrics: PerformanceMetrics,
    availableContent: unknown[]
  ): unknown[] {
    const prioritizedContent = availableContent.map(content => ({
      ...content,
      priority: this.calculateContentPriority(content, profile, metrics)
    }));

    // Sort by priority (highest first)
    return prioritizedContent.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calculate content priority for learning path
   */
  private static calculateContentPriority(
    content: unknown,
    profile: DifficultyProfile,
    metrics: PerformanceMetrics
  ): number {
    let priority = 0;

    // Base priority from content difficulty match
    const userLevel = profile.overallProficiency;
    const contentLevel = this.getContentLevel(content.difficulty);
    const levelMatch = 100 - Math.abs(userLevel - contentLevel);
    priority += levelMatch * 0.4;

    // Priority boost for weak areas
    if (metrics.weaknessAreas.includes(content.category)) {
      priority += 30;
    }

    // Priority boost for prerequisite completion
    if (this.arePrerequisitesMet(content.prerequisites, profile)) {
      priority += 20;
    }

    // Priority reduction for recently completed content
    if (content.lastCompleted && this.isRecentlyCompleted(content.lastCompleted)) {
      priority -= 15;
    }

    return Math.max(0, priority);
  }

  /**
   * Get content level from difficulty string
   */
  private static getContentLevel(difficulty: string): number {
    switch (difficulty) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      default: return 50;
    }
  }

  /**
   * Check if prerequisites are met
   */
  private static arePrerequisitesMet(prerequisites: string[], profile: DifficultyProfile): boolean {
    // Simplified check - in production, this would check actual completion status
    return prerequisites.length === 0;
  }

  /**
   * Check if content was recently completed
   */
  private static isRecentlyCompleted(lastCompleted: Date): boolean {
    const daysSinceCompletion = (Date.now() - new Date(lastCompleted).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCompletion < 7; // Within last week
  }

  /**
   * Update user profile based on recent performance
   */
  static updateProfile(
    currentProfile: DifficultyProfile,
    recentMetrics: PerformanceMetrics,
    contentType: string
  ): DifficultyProfile {
    const updatedProfile = { ...currentProfile };
    const proficiency = this.calculateProficiency(recentMetrics);
    
    // Update overall proficiency
    updatedProfile.overallProficiency = proficiency;

    // Update specific skill level
    const newLevel = this.determineDifficultyLevel(proficiency);
    if (contentType.includes('vocabulary')) {
      updatedProfile.vocabularyLevel = newLevel;
    } else if (contentType.includes('grammar')) {
      updatedProfile.grammarLevel = newLevel;
    } else if (contentType.includes('reading')) {
      updatedProfile.readingLevel = newLevel;
    } else if (contentType.includes('listening')) {
      updatedProfile.listeningLevel = newLevel;
    } else if (contentType.includes('writing')) {
      updatedProfile.writingLevel = newLevel;
    } else if (contentType.includes('speaking')) {
      updatedProfile.speakingLevel = newLevel;
    }

    // Adjust learning speed based on performance trends
    if (recentMetrics.learningCurve > 0.1) {
      updatedProfile.learningSpeed = 'fast';
    } else if (recentMetrics.learningCurve < -0.05) {
      updatedProfile.learningSpeed = 'slow';
    }

    // Adjust error tolerance based on accuracy
    if (recentMetrics.accuracy > 90) {
      updatedProfile.errorTolerance = 'low';
    } else if (recentMetrics.accuracy < 70) {
      updatedProfile.errorTolerance = 'high';
    }

    return updatedProfile;
  }

  /**
   * Generate performance insights and recommendations
   */
  static generateInsights(
    profile: DifficultyProfile,
    metrics: PerformanceMetrics
  ): {
    insights: string[];
    recommendations: string[];
    nextSteps: string[];
  } {
    const insights: string[] = [];
    const recommendations: string[] = [];
    const nextSteps: string[] = [];

    // Analyze accuracy
    if (metrics.accuracy >= 90) {
      insights.push("Excellent accuracy! You're mastering the material.");
      recommendations.push("Consider moving to more challenging content.");
    } else if (metrics.accuracy <= 70) {
      insights.push("Accuracy could be improved. Focus on fundamentals.");
      recommendations.push("Review basic concepts and practice more.");
    }

    // Analyze response time
    if (metrics.responseTime < 3) {
      insights.push("Fast response times indicate strong recall.");
    } else if (metrics.responseTime > 10) {
      insights.push("Slow response times suggest need for more practice.");
      recommendations.push("Increase practice frequency to improve speed.");
    }

    // Analyze learning curve
    if (metrics.learningCurve > 0.05) {
      insights.push("Strong learning progress! Keep up the momentum.");
    } else if (metrics.learningCurve < 0) {
      insights.push("Learning progress has slowed. Consider review sessions.");
      recommendations.push("Schedule regular review sessions.");
    }

    // Analyze retention
    if (metrics.retentionRate >= 85) {
      insights.push("Great retention! Information is sticking well.");
    } else if (metrics.retentionRate <= 65) {
      insights.push("Retention could be improved with spaced repetition.");
      recommendations.push("Use spaced repetition techniques.");
    }

    // Generate next steps
    if (metrics.weaknessAreas.length > 0) {
      nextSteps.push(`Focus on improving: ${metrics.weaknessAreas.join(', ')}`);
    }
    if (metrics.accuracy >= 85) {
      nextSteps.push("Move to next difficulty level");
    }
    if (metrics.retentionRate < 75) {
      nextSteps.push("Increase review frequency");
    }

    return { insights, recommendations, nextSteps };
  }
} 