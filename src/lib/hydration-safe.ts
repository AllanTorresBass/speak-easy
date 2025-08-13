/**
 * Utility functions to prevent hydration mismatches
 */

/**
 * Creates a stable ID that won't change between server and client renders
 * @param prefix Optional prefix for the ID
 * @returns A stable ID string
 */
export function createStableId(prefix: string = 'id'): string {
  // Use a counter that increments on each call
  // This ensures IDs are unique within a single render cycle
  if (typeof window === 'undefined') {
    // Server-side: use a simple counter
    return `${prefix}_${Math.floor(Math.random() * 1000000)}`;
  } else {
    // Client-side: use a more sophisticated approach
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Safely formats a date without causing hydration mismatches
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function safeDateFormat(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    // Use a consistent format that won't vary between server and client
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Safely formats a time without causing hydration mismatches
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted time string
 */
export function safeTimeFormat(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Time';
    }
    
    // Use a consistent format that won't vary between server and client
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    return 'Invalid Time';
  }
}

/**
 * Creates a stable random value that won't change between server and client
 * @param min Minimum value
 * @param max Maximum value
 * @returns A stable random number
 */
export function createStableRandom(min: number = 0, max: number = 1): number {
  // Use a seeded random approach for consistency
  const seed = 12345; // Fixed seed for consistency
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
}

/**
 * Safely checks if a browser API is available
 * @param apiName Name of the API to check
 * @returns Boolean indicating if the API is available
 */
export function isBrowserAPI(apiName: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return apiName in window;
}

/**
 * Safely accesses a browser API
 * @param apiName Name of the API to access
 * @returns The API object or undefined if not available
 */
export function getBrowserAPI<T>(apiName: string): T | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  return (window as any)[apiName];
}

/**
 * Safely gets difficulty color classes without causing runtime errors
 * @param difficulty Difficulty level string
 * @returns Tailwind CSS classes for the difficulty level
 */
export function getDifficultyColor(difficulty: string | undefined | null): string {
  if (!difficulty) return 'bg-gray-100 text-gray-800';
  
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Safely gets difficulty color classes with dark mode support
 * @param difficulty Difficulty level string
 * @returns Tailwind CSS classes for the difficulty level with dark mode
 */
export function getDifficultyColorWithDarkMode(difficulty: string | undefined | null): string {
  if (!difficulty) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
} 