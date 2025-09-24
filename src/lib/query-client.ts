// React Query client configuration
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error && 
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // User related queries
  user: {
    profile: ['user', 'profile'],
    progress: ['user', 'progress'],
    settings: ['user', 'settings'],
  },
  
  // Vocabulary related queries
  vocabulary: {
    lists: (level?: string, category?: string) => ['vocabulary', 'lists', level, category],
    words: (listId: string) => ['vocabulary', 'words', listId],
    progress: (userId: string) => ['vocabulary', 'progress', userId],
  },
  
  // Grammar related queries
  grammar: {
    lessons: (category?: string, level?: string) => ['grammar', 'lessons', category, level],
    lesson: (id: string) => ['grammar', 'lesson', id],
  },
  
  // Learning sessions
  sessions: {
    user: (userId: string) => ['sessions', 'user', userId],
    recent: (userId: string) => ['sessions', 'recent', userId],
  },
  
  // Statistics and analytics
  stats: {
    user: (userId: string) => ['stats', 'user', userId],
    vocabulary: (userId: string) => ['stats', 'vocabulary', userId],
    grammar: (userId: string) => ['stats', 'grammar', userId],
  },
}; 