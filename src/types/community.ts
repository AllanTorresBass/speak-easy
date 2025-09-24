// Community and Social Learning Types
// Defines the structure for community features, study groups, and social interactions

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  category: 'vocabulary' | 'grammar' | 'conversation' | 'exam-prep' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  maxMembers: number;
  currentMembers: number;
  isPrivate: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  rules: string[];
  studySchedule?: StudySchedule;
  currentChallenge?: GroupChallenge;
  achievements: GroupAchievement[];
}

export interface StudySchedule {
  id: string;
  groupId: string;
  sessions: StudySession[];
  timezone: string;
  reminderTime: number; // minutes before session
}

export interface StudySession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'writing' | 'mixed';
  materials?: string[];
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'writing' | 'speaking' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  startDate: Date;
  endDate: Date;
  targetScore: number;
  rewards: ChallengeReward[];
  participants: ChallengeParticipant[];
  leaderboard: LeaderboardEntry[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface ChallengeReward {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'points' | 'unlock' | 'title';
  icon?: string;
  value: number;
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  avatarUrl?: string;
  currentScore: number;
  targetScore: number;
  progress: number; // 0-100
  joinedAt: Date;
  lastActivity: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  score: number;
  level: number;
  streak: number;
}

export interface GroupAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  unlockedBy: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  threadCount: number;
  postCount: number;
  lastActivity: Date;
  isActive: boolean;
  moderators: string[];
  rules: string[];
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categoryId: string;
  tags: string[];
  viewCount: number;
  replyCount: number;
  likeCount: number;
  isPinned: boolean;
  isLocked: boolean;
  status: 'active' | 'closed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt?: Date;
  lastReplyBy?: string;
}

export interface ForumPost {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isOriginalPost: boolean;
  likeCount: number;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  parentPostId?: string; // for nested replies
  mentions: string[];
  attachments?: PostAttachment[];
}

export interface PostAttachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'competition' | 'meetup' | 'webinar' | 'challenge';
  startDate: Date;
  endDate: Date;
  timezone: string;
  maxParticipants: number;
  currentParticipants: number;
  isOnline: boolean;
  location?: string;
  meetingUrl?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  tags: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  registrationDeadline?: Date;
  requirements?: string[];
  materials?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  joinDate: Date;
  lastSeen: Date;
  isOnline: boolean;
  isVerified: boolean;
  badges: UserBadge[];
  stats: UserStats;
  preferences: UserPreferences;
  socialLinks: SocialLink[];
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'participation' | 'moderation' | 'special';
}

export interface UserStats {
  totalPosts: number;
  totalThreads: number;
  totalLikes: number;
  totalViews: number;
  studyStreak: number;
  longestStreak: number;
  totalStudyTime: number; // in minutes
  vocabularyWords: number;
  grammarLessons: number;
  writingExercises: number;
  communityPoints: number;
  level: number;
  experience: number;
  rank: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  communityUpdates: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  language: string;
  timezone: string;
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'website' | 'instagram';
  url: string;
  isPublic: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'text' | 'image' | 'audio' | 'file';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  attachments?: PostAttachment[];
  replyTo?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: DirectMessage;
  unreadCount: number;
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'like' | 'reply' | 'challenge' | 'achievement' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high';
}

export interface StudyPartner {
  id: string;
  userId: string;
  partnerId: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  matchScore: number; // 0-100 compatibility score
  sharedGoals: string[];
  studySchedule: StudySchedule;
  communicationPreferences: CommunicationPreference[];
  createdAt: Date;
  lastStudySession?: Date;
  totalStudyTime: number; // in minutes
}

export interface CommunicationPreference {
  method: 'chat' | 'voice' | 'video' | 'in-person';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  preferredTime: string; // HH:MM format
  timezone: string;
  isActive: boolean;
}

export interface CommunityMetrics {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  activeGroups: number;
  totalThreads: number;
  totalPosts: number;
  totalEvents: number;
  upcomingEvents: number;
  averageStudyTime: number;
  topLanguages: Array<{ language: string; userCount: number }>;
  popularCategories: Array<{ category: string; threadCount: number }>;
  growthRate: number; // percentage
  engagementRate: number; // percentage
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  targetType: 'user' | 'thread' | 'post' | 'group';
  targetId: string;
  action: 'warn' | 'mute' | 'ban' | 'delete' | 'lock' | 'pin';
  reason: string;
  duration?: number; // in hours, for temporary actions
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  appealStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  appealReason?: string;
  appealDate?: Date;
} 