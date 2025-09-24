import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  StudyGroup, 
  ForumCategory, 
  CommunityEvent,
  UserProfile,
  Notification,
  CommunityMetrics
} from '@/types/community';

// Mock API functions - in production, these would call your actual API endpoints
const fetchStudyGroups = async (): Promise<StudyGroup[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Advanced Grammar Masters',
      description: 'Deep dive into complex grammar structures and advanced writing techniques',
      category: 'grammar',
      difficulty: 'advanced',
      maxMembers: 25,
      currentMembers: 18,
      isPrivate: false,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      createdBy: 'user1',
      tags: ['grammar', 'advanced', 'writing', 'academic'],
      rules: ['Be respectful', 'Participate actively', 'Share resources'],
      achievements: [],
      studySchedule: {
        id: 'schedule1',
        groupId: '1',
        sessions: [
          {
            id: 'session1',
            title: 'Weekly Grammar Review',
            description: 'Review and practice advanced grammar concepts',
            startTime: new Date('2024-01-20T18:00:00Z'),
            duration: 90,
            maxParticipants: 25,
            currentParticipants: 15,
            type: 'grammar',
            isRecurring: true,
            recurringPattern: 'weekly',
            status: 'scheduled'
          }
        ],
        timezone: 'UTC',
        reminderTime: 15
      }
    },
    {
      id: '2',
      name: 'Conversation Practice',
      description: 'Improve speaking skills through regular conversation practice',
      category: 'conversation',
      difficulty: 'intermediate',
      maxMembers: 15,
      currentMembers: 12,
      isPrivate: false,
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-16'),
      createdBy: 'user2',
      tags: ['conversation', 'speaking', 'intermediate', 'practice'],
      rules: ['English only', 'Be patient with beginners', 'Encourage participation'],
      achievements: [],
      studySchedule: {
        id: 'schedule2',
        groupId: '2',
        sessions: [
          {
            id: 'session2',
            title: 'Daily Conversation',
            description: 'Practice speaking English in a supportive environment',
            startTime: new Date('2024-01-20T20:00:00Z'),
            duration: 60,
            maxParticipants: 15,
            currentParticipants: 8,
            type: 'conversation',
            isRecurring: true,
            recurringPattern: 'daily',
            status: 'scheduled'
          }
        ],
        timezone: 'UTC',
        reminderTime: 10
      }
    },
    {
      id: '3',
      name: 'Vocabulary Builders',
      description: 'Expand your vocabulary with themed word lists and practice',
      category: 'vocabulary',
      difficulty: 'beginner',
      maxMembers: 30,
      currentMembers: 25,
      isPrivate: false,
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-17'),
      createdBy: 'user3',
      tags: ['vocabulary', 'beginner', 'themed', 'practice'],
      rules: ['Complete daily exercises', 'Help others learn', 'Share new words'],
      achievements: [],
      currentChallenge: {
        id: 'challenge1',
        title: '30-Day Vocabulary Challenge',
        description: 'Learn 5 new words every day for 30 days',
        type: 'vocabulary',
        difficulty: 'beginner',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-14'),
        targetScore: 150,
        rewards: [
          {
            id: 'reward1',
            name: 'Vocabulary Master Badge',
            description: 'Earned by completing the 30-day challenge',
            type: 'badge',
            value: 100
          }
        ],
        participants: [],
        leaderboard: [],
        status: 'active'
      }
    }
  ];
};

const fetchForumCategories = async (): Promise<ForumCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      name: 'General Discussion',
      description: 'General topics about English learning and language exchange',
      icon: '💬',
      color: '#3B82F6',
      threadCount: 45,
      postCount: 234,
      lastActivity: new Date('2024-01-17T15:30:00Z'),
      isActive: true,
      moderators: ['mod1', 'mod2'],
      rules: ['Be respectful', 'Stay on topic', 'No spam']
    },
    {
      id: '2',
      name: 'Grammar Help',
      description: 'Ask questions and get help with English grammar',
      icon: '📚',
      color: '#10B981',
      threadCount: 32,
      postCount: 156,
      lastActivity: new Date('2024-01-17T14:20:00Z'),
      isActive: true,
      moderators: ['mod3'],
      rules: ['Provide context', 'Show your attempt', 'Be specific']
    },
    {
      id: '3',
      name: 'Writing Workshop',
      description: 'Share your writing and get feedback from the community',
      icon: '✍️',
      color: '#F59E0B',
      threadCount: 28,
      postCount: 89,
      lastActivity: new Date('2024-01-17T16:45:00Z'),
      isActive: true,
      moderators: ['mod4', 'mod5'],
      rules: ['Be constructive', 'Respect copyright', 'Tag your content']
    },
    {
      id: '4',
      name: 'Study Tips & Resources',
      description: 'Share study strategies and learning resources',
      icon: '💡',
      color: '#8B5CF6',
      threadCount: 19,
      postCount: 67,
      lastActivity: new Date('2024-01-17T13:15:00Z'),
      isActive: true,
      moderators: ['mod1'],
      rules: ['Share helpful resources', 'Explain your methods', 'No self-promotion']
    }
  ];
};

const fetchCommunityEvents = async (): Promise<CommunityEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: '1',
      title: 'English Speaking Workshop',
      description: 'Join us for an interactive workshop focused on improving your speaking skills',
      type: 'workshop',
      startDate: new Date('2024-01-25T18:00:00Z'),
      endDate: new Date('2024-01-25T20:00:00Z'),
      timezone: 'UTC',
      maxParticipants: 50,
      currentParticipants: 32,
      isOnline: true,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      organizerId: 'user1',
      organizerName: 'Sarah Johnson',
      organizerAvatar: '/avatars/sarah.jpg',
      tags: ['speaking', 'workshop', 'interactive'],
      status: 'upcoming',
      registrationDeadline: new Date('2024-01-24T18:00:00Z'),
      requirements: ['Intermediate level', 'Microphone access', 'Quiet environment']
    },
    {
      id: '2',
      title: 'Vocabulary Challenge Competition',
      description: 'Test your vocabulary knowledge in this competitive challenge',
      type: 'competition',
      startDate: new Date('2024-01-28T19:00:00Z'),
      endDate: new Date('2024-01-28T21:00:00Z'),
      timezone: 'UTC',
      maxParticipants: 100,
      currentParticipants: 67,
      isOnline: true,
      meetingUrl: 'https://zoom.us/j/123456789',
      organizerId: 'user2',
      organizerName: 'Mike Chen',
      organizerAvatar: '/avatars/mike.jpg',
      tags: ['vocabulary', 'competition', 'challenge'],
      status: 'upcoming',
      registrationDeadline: new Date('2024-01-27T19:00:00Z'),
      requirements: ['All levels welcome', 'Fast internet connection']
    }
  ];
};

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: userId,
    username: 'demo_user',
    displayName: 'Demo User',
    avatarUrl: '/avatars/demo.jpg',
    bio: 'Passionate about learning English and helping others improve their skills',
    nativeLanguage: 'Spanish',
    targetLanguage: 'English',
    proficiencyLevel: 'intermediate',
    joinDate: new Date('2024-01-01'),
    lastSeen: new Date(),
    isOnline: true,
    isVerified: true,
    badges: [
      {
        id: 'badge1',
        name: 'First Steps',
        description: 'Completed your first lesson',
        icon: '🎯',
        unlockedAt: new Date('2024-01-02'),
        rarity: 'common',
        category: 'achievement'
      },
      {
        id: 'badge2',
        name: 'Community Helper',
        description: 'Helped 10 other learners',
        icon: '🤝',
        unlockedAt: new Date('2024-01-10'),
        rarity: 'rare',
        category: 'participation'
      }
    ],
    stats: {
      totalPosts: 23,
      totalThreads: 5,
      totalLikes: 67,
      totalViews: 234,
      studyStreak: 7,
      longestStreak: 12,
      totalStudyTime: 1240,
      vocabularyWords: 156,
      grammarLessons: 8,
      writingExercises: 12,
      communityPoints: 450,
      level: 15,
      experience: 2340,
      rank: 'Advanced Learner'
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      studyReminders: true,
      communityUpdates: true,
      privacyLevel: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
      language: 'en',
      timezone: 'UTC'
    },
    socialLinks: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/demo_user',
        isPublic: true
      }
    ]
  };
};

const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: '1',
      userId,
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Sarah Johnson',
      isRead: false,
      createdAt: new Date('2024-01-17T16:30:00Z'),
      actionUrl: '/messages',
      priority: 'medium'
    },
    {
      id: '2',
      userId,
      type: 'challenge',
      title: 'Challenge Reminder',
      message: 'Your daily vocabulary challenge is ready!',
      isRead: false,
      createdAt: new Date('2024-01-17T15:00:00Z'),
      actionUrl: '/challenges',
      priority: 'high'
    },
    {
      id: '3',
      userId,
      type: 'achievement',
      title: 'New Badge Unlocked!',
      message: 'Congratulations! You earned the "Grammar Master" badge',
      isRead: true,
      readAt: new Date('2024-01-17T14:15:00Z'),
      createdAt: new Date('2024-01-17T14:15:00Z'),
      actionUrl: '/profile',
      priority: 'low'
    }
  ];
};

const fetchCommunityMetrics = async (): Promise<CommunityMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    totalUsers: 15420,
    activeUsers: 3240,
    totalGroups: 156,
    activeGroups: 89,
    totalThreads: 2340,
    totalPosts: 15670,
    totalEvents: 45,
    upcomingEvents: 12,
    averageStudyTime: 45,
    topLanguages: [
      { language: 'Spanish', userCount: 2340 },
      { language: 'French', userCount: 1890 },
      { language: 'German', userCount: 1450 },
      { language: 'Chinese', userCount: 1230 },
      { language: 'Japanese', userCount: 980 }
    ],
    popularCategories: [
      { category: 'General Discussion', threadCount: 450 },
      { category: 'Grammar Help', threadCount: 320 },
      { category: 'Writing Workshop', threadCount: 280 },
      { category: 'Study Tips', threadCount: 190 }
    ],
    growthRate: 12.5,
    engagementRate: 78.3
  };
};

// React Query hooks
export const useStudyGroups = () => {
  return useQuery({
    queryKey: ['study-groups'],
    queryFn: fetchStudyGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useForumCategories = () => {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: fetchForumCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCommunityEvents = () => {
  return useQuery({
    queryKey: ['community-events'],
    queryFn: fetchCommunityEvents,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
};

export const useCommunityMetrics = () => {
  return useQuery({
    queryKey: ['community-metrics'],
    queryFn: fetchCommunityMetrics,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Mutations
export const useJoinStudyGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, groupId, userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
    },
  });
};

export const useCreateStudyGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (groupData: Partial<StudyGroup>) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, group: { ...groupData, id: 'new-group-id' } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, notificationId, userId };
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
}; 