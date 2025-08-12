'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Trophy, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Globe,
  Clock,
  MapPin,
  Video,
  BookOpen,
  Target,
  Star,
  Heart,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { 
  useStudyGroups, 
  useForumCategories, 
  useCommunityEvents, 
  useUserProfile, 
  useNotifications,
  useCommunityMetrics,
  useJoinStudyGroup
} from '@/hooks/use-community';
import { StudyGroup, CommunityEvent, ForumCategory } from '@/types/community';
import { StudyGroupCard } from './study-group-card';
import { EventCard } from './event-card';

export function CommunityDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const { data: studyGroups, isLoading: groupsLoading } = useStudyGroups();
  const { data: forumCategories, isLoading: categoriesLoading } = useForumCategories();
  const { data: communityEvents, isLoading: eventsLoading } = useCommunityEvents();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(session?.user?.id || '');
  const { data: notifications, isLoading: notificationsLoading } = useNotifications(session?.user?.id || '');
  const { data: communityMetrics, isLoading: metricsLoading } = useCommunityMetrics();

  const joinGroup = useJoinStudyGroup();

  const handleJoinGroup = async (groupId: string) => {
    if (session?.user?.id) {
      try {
        await joinGroup.mutateAsync({ groupId, userId: session.user.id });
      } catch (error) {
        console.error('Error joining group:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vocabulary': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'grammar': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'conversation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'exam-prep': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'general': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'mixed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <BookOpen className="h-4 w-4" />;
      case 'competition': return <Trophy className="h-4 w-4" />;
      case 'meetup': return <Users className="h-4 w-4" />;
      case 'webinar': return <Video className="h-4 w-4" />;
      case 'challenge': return <Target className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredGroups = studyGroups?.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || group.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const filteredEvents = communityEvents?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.type === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (groupsLoading || categoriesLoading || eventsLoading || profileLoading || notificationsLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Community</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-1">
            Connect with fellow learners, join study groups, and participate in community events
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Community Stats */}
      {communityMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{communityMetrics.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{communityMetrics.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{communityMetrics.totalGroups}</div>
              <div className="text-sm text-muted-foreground">Study Groups</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{communityMetrics.upcomingEvents}</div>
              <div className="text-sm text-muted-foreground">Upcoming Events</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications?.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Top Languages</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {communityMetrics?.topLanguages.slice(0, 5).map((lang, index) => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{lang.language}</span>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {lang.userCount.toLocaleString()} users
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with community features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Join Group</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">Browse Events</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Visit Forums</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Trophy className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Challenges</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study-groups" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="grammar">Grammar</option>
              <option value="conversation">Conversation</option>
              <option value="exam-prep">Exam Prep</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Study Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                onFavorite={(groupId) => console.log('Favorite group:', groupId)}
                onShare={(groupId) => console.log('Share group:', groupId)}
                isJoining={joinGroup.isPending}
              />
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No study groups found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
              <option value="meetup">Meetup</option>
              <option value="webinar">Webinar</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={(eventId) => console.log('Register for event:', eventId)}
                onFavorite={(eventId) => console.log('Favorite event:', eventId)}
                onShare={(eventId) => console.log('Share event:', eventId)}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="forums" className="space-y-6">
          {/* Forum Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forumCategories?.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <span>{category.threadCount} threads</span>
                    <span>{category.postCount} posts</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last activity: {new Date(category.lastActivity).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Browse
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Forum Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
              <CardDescription>
                Help us maintain a positive and supportive learning environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700 dark:text-green-400">✅ Do's</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Be respectful and supportive</li>
                    <li>• Ask clear, specific questions</li>
                    <li>• Share helpful resources</li>
                    <li>• Use appropriate language</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-red-700 dark:text-red-400">❌ Don'ts</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Spam or self-promote</li>
                    <li>• Use offensive language</li>
                    <li>• Post irrelevant content</li>
                    <li>• Harass other members</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 