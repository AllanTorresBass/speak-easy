// Spaced Repetition System based on SuperMemo-2 algorithm
// This system helps users review words at optimal intervals for maximum retention

export interface SpacedRepetitionItem {
  id: string;
  word: string;
  translation: string;
  difficulty: number; // 0-5 scale (0 = easiest, 5 = hardest)
  repetitions: number; // Number of successful repetitions
  interval: number; // Days until next review
  easeFactor: number; // Multiplier for interval calculation
  nextReview: Date; // When to review next
  lastReview: Date; // Last review date
  consecutiveCorrect: number; // Streak of correct answers
  consecutiveIncorrect: number; // Streak of incorrect answers
  totalReviews: number; // Total number of reviews
  averageResponseTime: number; // Average time to answer in seconds
}

export interface ReviewResult {
  item: SpacedRepetitionItem;
  quality: number; // 0-5 scale (0 = complete blackout, 5 = perfect response)
  responseTime: number; // Time taken to answer in seconds
  newInterval: number; // New interval after this review
  newEaseFactor: number; // New ease factor after this review
  nextReview: Date; // When to review next
  shouldReview: boolean; // Whether item should be reviewed again
}

export class SpacedRepetitionSystem {
  private static readonly MIN_INTERVAL = 1; // Minimum 1 day
  private static readonly MAX_INTERVAL = 365; // Maximum 1 year
  private static readonly MIN_EASE_FACTOR = 1.3; // Minimum ease factor
  private static readonly INITIAL_EASE_FACTOR = 2.5; // Starting ease factor

  /**
   * Calculate the next review interval based on SuperMemo-2 algorithm
   */
  static calculateNextInterval(
    item: SpacedRepetitionItem,
    quality: number,
    responseTime: number
  ): ReviewResult {
    const updatedItem = { ...item };
    const now = new Date();

    // Update review statistics
    updatedItem.totalReviews += 1;
    updatedItem.lastReview = now;
    updatedItem.averageResponseTime = this.calculateAverageResponseTime(
      item.averageResponseTime,
      item.totalReviews,
      responseTime
    );

    // Calculate new interval and ease factor based on quality
    if (quality >= 3) {
      // Correct response - increase interval
      updatedItem.consecutiveCorrect += 1;
      updatedItem.consecutiveIncorrect = 0;

      if (updatedItem.repetitions === 0) {
        // First repetition
        updatedItem.interval = 1;
      } else if (updatedItem.repetitions === 1) {
        // Second repetition
        updatedItem.interval = 6;
      } else {
        // Subsequent repetitions
        updatedItem.interval = Math.round(updatedItem.interval * updatedItem.easeFactor);
      }

      // Update ease factor
      updatedItem.easeFactor = this.calculateNewEaseFactor(
        updatedItem.easeFactor,
        quality,
        updatedItem.consecutiveCorrect
      );

      updatedItem.repetitions += 1;
    } else {
      // Incorrect response - reset interval
      updatedItem.consecutiveCorrect = 0;
      updatedItem.consecutiveIncorrect += 1;
      updatedItem.interval = this.MIN_INTERVAL;
      updatedItem.repetitions = 0;

      // Decrease ease factor for incorrect responses
      updatedItem.easeFactor = Math.max(
        this.MIN_EASE_FACTOR,
        updatedItem.easeFactor - 0.2
      );
    }

    // Clamp interval to valid range
    updatedItem.interval = Math.max(
      this.MIN_INTERVAL,
      Math.min(this.MAX_INTERVAL, updatedItem.interval)
    );

    // Calculate next review date
    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + updatedItem.interval);
    updatedItem.nextReview = nextReview;

    // Determine if item should be reviewed again
    const shouldReview = updatedItem.interval <= 30 || quality < 3;

    return {
      item: updatedItem,
      quality,
      responseTime,
      newInterval: updatedItem.interval,
      newEaseFactor: updatedItem.easeFactor,
      nextReview: updatedItem.nextReview,
      shouldReview
    };
  }

  /**
   * Calculate new ease factor based on quality and consecutive correct answers
   */
  private static calculateNewEaseFactor(
    currentEaseFactor: number,
    quality: number,
    consecutiveCorrect: number
  ): number {
    // Base ease factor change
    let easeFactorChange = (5 - quality) * 0.1 + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Bonus for consecutive correct answers
    if (consecutiveCorrect >= 3) {
      easeFactorChange += 0.05;
    }
    if (consecutiveCorrect >= 5) {
      easeFactorChange += 0.05;
    }

    const newEaseFactor = currentEaseFactor + easeFactorChange;
    return Math.max(this.MIN_EASE_FACTOR, newEaseFactor);
  }

  /**
   * Calculate running average response time
   */
  private static calculateAverageResponseTime(
    currentAverage: number,
    totalReviews: number,
    newResponseTime: number
  ): number {
    if (totalReviews === 0) return newResponseTime;
    return (currentAverage * (totalReviews - 1) + newResponseTime) / totalReviews;
  }

  /**
   * Get items due for review
   */
  static getItemsDueForReview(items: SpacedRepetitionItem[]): SpacedRepetitionItem[] {
    const now = new Date();
    return items.filter(item => item.nextReview <= now);
  }

  /**
   * Get items due soon (within next 3 days)
   */
  static getItemsDueSoon(items: SpacedRepetitionItem[]): SpacedRepetitionItem[] {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    return items.filter(item => 
      item.nextReview > now && item.nextReview <= threeDaysFromNow
    );
  }

  /**
   * Calculate retention rate for a set of items
   */
  static calculateRetentionRate(items: SpacedRepetitionItem[]): number {
    if (items.length === 0) return 0;

    const totalCorrect = items.reduce((sum, item) => sum + item.consecutiveCorrect, 0);
    const totalReviews = items.reduce((sum, item) => sum + item.totalReviews, 0);

    return totalReviews > 0 ? totalCorrect / totalReviews : 0;
  }

  /**
   * Get learning statistics
   */
  static getLearningStats(items: SpacedRepetitionItem[]) {
    const now = new Date();
    const dueForReview = this.getItemsDueForReview(items);
    const dueSoon = this.getItemsDueSoon(items);
    const retentionRate = this.calculateRetentionRate(items);

    const averageInterval = items.length > 0 
      ? items.reduce((sum, item) => sum + item.interval, 0) / items.length 
      : 0;

    const averageEaseFactor = items.length > 0 
      ? items.reduce((sum, item) => sum + item.easeFactor, 0) / items.length 
      : 0;

    return {
      totalItems: items.length,
      dueForReview: dueForReview.length,
      dueSoon: dueSoon.length,
      retentionRate: Math.round(retentionRate * 100),
      averageInterval: Math.round(averageInterval),
      averageEaseFactor: Math.round(averageEaseFactor * 100) / 100,
      nextReviewDate: dueForReview.length > 0 
        ? dueForReview[0].nextReview 
        : null
    };
  }

  /**
   * Create a new spaced repetition item
   */
  static createItem(
    id: string,
    word: string,
    translation: string,
    difficulty: number = 2.5
  ): SpacedRepetitionItem {
    const now = new Date();
    return {
      id,
      word,
      translation,
      difficulty: Math.max(0, Math.min(5, difficulty)),
      repetitions: 0,
      interval: 0,
      easeFactor: this.INITIAL_EASE_FACTOR,
      nextReview: now,
      lastReview: now,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      totalReviews: 0,
      averageResponseTime: 0
    };
  }

  /**
   * Adjust difficulty based on user performance
   */
  static adjustDifficulty(
    item: SpacedRepetitionItem,
    quality: number,
    responseTime: number
  ): number {
    let difficultyChange = 0;

    // Adjust based on quality
    if (quality >= 4) {
      difficultyChange -= 0.1; // Make easier
    } else if (quality <= 2) {
      difficultyChange += 0.1; // Make harder
    }

    // Adjust based on response time
    const expectedResponseTime = 5; // 5 seconds expected
    if (responseTime < expectedResponseTime * 0.5) {
      difficultyChange -= 0.05; // Very fast response
    } else if (responseTime > expectedResponseTime * 2) {
      difficultyChange += 0.05; // Very slow response
    }

    // Adjust based on consecutive performance
    if (item.consecutiveCorrect >= 3) {
      difficultyChange -= 0.05; // Consistent success
    } else if (item.consecutiveIncorrect >= 2) {
      difficultyChange += 0.05; // Consistent failure
    }

    const newDifficulty = Math.max(0, Math.min(5, item.difficulty + difficultyChange));
    return Math.round(newDifficulty * 10) / 10; // Round to 1 decimal place
  }
} 