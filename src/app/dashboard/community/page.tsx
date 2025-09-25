'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Search, 
  Plus, 
  Globe, 
  Calendar, 
  MapPin, 
  Star, 
  MessageSquare, 
  Heart, 
  Share2, 
  BookOpen, 
  Clock,
  UserPlus,
  Users2,
  Target
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockStudyGroups = [
  {
    id: '1',
    name: 'Business English Masters',
    description: 'Advanced business vocabulary and communication skills',
    members: 24,
    maxMembers: 30,
    level: 'Advanced',
    language: 'English',
    meetingTime: 'Every Tuesday 7:00 PM',
    tags: ['Business', 'Advanced', 'Professional'],
    image: '/group-business.jpg'
  },
  {
    id: '2',
    name: 'Grammar Gurus',
    description: 'Master English grammar through interactive exercises',
    members: 18,
    maxMembers: 25,
    level: 'Intermediate',
    language: 'English',
    meetingTime: 'Every Thursday 6:00 PM',
    tags: ['Grammar', 'Intermediate', 'Interactive'],
    image: '/group-grammar.jpg'
  },
  {
    id: '3',
    name: 'Conversation Corner',
    description: 'Practice speaking English in a relaxed environment',
    members: 32,
    maxMembers: 40,
    level: 'All Levels',
    language: 'English',
    meetingTime: 'Daily 8:00 PM',
    tags: ['Speaking', 'All Levels', 'Daily'],
    image: '/group-conversation.jpg'
  }
];

const mockLanguagePartners = [
  {
    id: '1',
    name: 'Maria Garcia',
    nativeLanguage: 'Spanish',
    learningLanguage: 'English',
    level: 'Intermediate',
    interests: ['Travel', 'Cooking', 'Music'],
    availability: 'Weekends',
    rating: 4.8,
    avatar: '/avatar-maria.jpg'
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    nativeLanguage: 'Arabic',
    learningLanguage: 'English',
    level: 'Advanced',
    interests: ['Technology', 'Sports', 'Reading'],
    availability: 'Evenings',
    rating: 4.9,
    avatar: '/avatar-ahmed.jpg'
  },
  {
    id: '3',
    name: 'Yuki Tanaka',
    nativeLanguage: 'Japanese',
    learningLanguage: 'English',
    level: 'Beginner',
    interests: ['Anime', 'Gaming', 'Food'],
    availability: 'Mornings',
    rating: 4.7,
    avatar: '/avatar-yuki.jpg'
  }
];

const mockDiscussions = [
  {
    id: '1',
    title: 'Best resources for IELTS preparation?',
    author: 'Sarah Chen',
    replies: 12,
    views: 156,
    lastActivity: '2 hours ago',
    tags: ['IELTS', 'Resources', 'Study Tips'],
    avatar: '/avatar-sarah.jpg'
  },
  {
    id: '2',
    title: 'How to improve pronunciation?',
    author: 'Carlos Rodriguez',
    replies: 8,
    views: 89,
    lastActivity: '5 hours ago',
    tags: ['Pronunciation', 'Speaking', 'Tips'],
    avatar: '/avatar-carlos.jpg'
  },
  {
    id: '3',
    title: 'Business English vocabulary help',
    author: 'Emma Thompson',
    replies: 15,
    views: 203,
    lastActivity: '1 day ago',
    tags: ['Business', 'Vocabulary', 'Professional'],
    avatar: '/avatar-emma.jpg'
  }
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const filteredStudyGroups = mockStudyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || group.level === selectedLevel;
    const matchesLanguage = selectedLanguage === 'all' || group.language === selectedLanguage;
    
    return matchesSearch && matchesLevel && matchesLanguage;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with fellow English learners, join study groups, and find language exchange partners
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Study Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Languages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Language Partners
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        {/* Study Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search study groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {group.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level:</span>
                    <Badge variant="secondary">{group.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members:</span>
                    <span>{group.members}/{group.maxMembers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Meeting:</span>
                    <span className="text-right">{group.meetingTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Join Group
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Language Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Find Language Exchange Partners</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLanguagePartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-3">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarImage src={partner.avatar} alt={partner.name} />
                    <AvatarFallback className="text-lg">
                      {partner.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{partner.rating}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center text-sm">
                    <p><strong>Native:</strong> {partner.nativeLanguage}</p>
                    <p><strong>Learning:</strong> {partner.learningLanguage}</p>
                    <p><strong>Level:</strong> {partner.level}</p>
                  </div>
                  <div className="text-center text-sm">
                    <p><strong>Interests:</strong></p>
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {partner.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-center text-sm">
                    <p><strong>Available:</strong> {partner.availability}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Connect
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Community Discussions</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </div>

          <div className="space-y-4">
            {mockDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.avatar} alt={discussion.author} />
                      <AvatarFallback>
                        {discussion.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-lg hover:text-primary cursor-pointer">
                          {discussion.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>by {discussion.author}</span>
                        <span>{discussion.replies} replies</span>
                        <span>{discussion.views} views</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  English Speaking Workshop
                </CardTitle>
                <CardDescription>
                  Improve your speaking skills with native speakers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Saturday, 2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Virtual Meeting</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>15 participants</span>
                </div>
                <Button className="w-full">Join Event</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Grammar Masterclass
                </CardTitle>
                <CardDescription>
                  Advanced grammar concepts and practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Sunday, 10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Virtual Meeting</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>8 participants</span>
                </div>
                <Button className="w-full">Join Event</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  IELTS Preparation Session
                </CardTitle>
                <CardDescription>
                  Tips and strategies for IELTS success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Monday, 6:00 PM - 8:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Virtual Meeting</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>12 participants</span>
                </div>
                <Button className="w-full">Join Event</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 