'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  Users, 
  Calendar, 
  Clock, 
  Target, 
  Heart, 
  Share2, 
  BookOpen,
  Mic,
  Brain
} from 'lucide-react';
import { StudyGroup } from '@/types/community';

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoin: (groupId: string) => void;
  onFavorite: (groupId: string) => void;
  onShare: (groupId: string) => void;
  isJoined?: boolean;
  isFavorite?: boolean;
  isJoining?: boolean;
}

export function StudyGroupCard({ 
  group, 
  onJoin, 
  onFavorite, 
  onShare, 
  isJoined = false,
  isFavorite = false,
  isJoining = false
}: StudyGroupCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary': return <BookOpen className="h-4 w-4" />;
      case 'grammar': return <Brain className="h-4 w-4" />;
      case 'conversation': return <Mic className="h-4 w-4" />;
      case 'exam-prep': return <Target className="h-4 w-4" />;
      case 'general': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
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

  const formatMemberCount = (current: number, max: number) => {
    if (max === 0) return `${current} members`;
    const percentage = Math.round((current / max) * 100);
    return `${current}/${max} (${percentage}%)`;
  };

  const getNextSession = () => {
    if (!group.studySchedule?.sessions) return null;
    const now = new Date();
    const upcomingSessions = group.studySchedule.sessions
      .filter(session => new Date(session.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return upcomingSessions[0] || null;
  };

  const nextSession = getNextSession();

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getCategoryIcon(group.category)}
              <CardTitle className="text-lg truncate">{group.name}</CardTitle>
            </div>
            <CardDescription className="line-clamp-2 text-sm">
              {group.description}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(group.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getCategoryColor(group.category)}>
            {getCategoryIcon(group.category)}
            <span className="ml-1 capitalize">{group.category}</span>
          </Badge>
          <Badge className={getDifficultyColor(group.difficulty)}>
            {group.difficulty}
          </Badge>
          {group.isPrivate && (
            <Badge variant="outline">Private</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Member Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Members</span>
          </div>
          <span className="font-medium">{formatMemberCount(group.currentMembers, group.maxMembers)}</span>
        </div>

        {/* Next Session */}
        {nextSession && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Next Session</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{nextSession.title}</p>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(nextSession.startTime).toLocaleDateString()}</span>
                </div>
                <span>•</span>
                <span>{nextSession.duration} min</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Challenge */}
        {group.currentChallenge && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Active Challenge</span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {group.currentChallenge.title}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onJoin(group.id);
            }}
            disabled={isJoining || isJoined}
          >
            {isJoining ? 'Joining...' : isJoined ? 'Joined' : 'Join Group'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare(group.id);
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Expandable Details */}
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Show Less' : 'Show More Details'}
          </Button>
          
          {showDetails && (
            <div className="mt-3 space-y-3 text-sm">
              {/* Rules */}
              {group.rules.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Group Rules</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {group.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Study Schedule */}
              {group.studySchedule && (
                <div>
                  <h4 className="font-medium mb-2">Study Schedule</h4>
                  <div className="space-y-2">
                    {group.studySchedule.sessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.startTime).toLocaleDateString()} at{' '}
                            {new Date(session.startTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {session.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Created Info */}
              <div className="text-xs text-muted-foreground">
                Created {new Date(group.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 