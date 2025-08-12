'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  BookOpen, 
  Trophy, 
  Target,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CommunityEvent } from '@/types/community';

interface EventCardProps {
  event: CommunityEvent;
  onRegister: (eventId: string) => void;
  onFavorite: (eventId: string) => void;
  onShare: (eventId: string) => void;
  isRegistered?: boolean;
  isFavorite?: boolean;
  isRegistering?: boolean;
}

export function EventCard({ 
  event, 
  onRegister, 
  onFavorite, 
  onShare, 
  isRegistered = false,
  isFavorite = false,
  isRegistering = false
}: EventCardProps) {
  const [showDetails, setShowDetails] = useState(false);

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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'competition': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'meetup': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'webinar': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'challenge': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return eventDate.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isRegistrationOpen = () => {
    if (!event.registrationDeadline) return true;
    return new Date(event.registrationDeadline) > new Date();
  };

  const isEventFull = () => {
    return event.currentParticipants >= event.maxParticipants;
  };

  const canRegister = () => {
    return isRegistrationOpen() && !isEventFull() && !isRegistered && event.status === 'upcoming';
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getEventTypeIcon(event.type)}
              <CardTitle className="text-lg truncate">{event.title}</CardTitle>
            </div>
            <CardDescription className="line-clamp-2 text-sm">
              {event.description}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(event.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>

        {/* Tags and Status */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getEventTypeColor(event.type)}>
            {getEventTypeIcon(event.type)}
            <span className="ml-1 capitalize">{event.type}</span>
          </Badge>
          <Badge className={getStatusColor(event.status)}>
            {event.status}
          </Badge>
          {event.isOnline && (
            <Badge variant="outline" className="text-blue-600">
              <Video className="h-3 w-3 mr-1" />
              Online
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatDate(event.startDate)}</span>
            <Badge variant="outline" className="text-xs">
              {formatTime(event.startDate)}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Duration: {Math.round((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60))} minutes</span>
          </div>

          {/* Location or Meeting Link */}
          <div className="flex items-center space-x-2 text-sm">
            {event.isOnline ? (
              <Video className="h-4 w-4 text-muted-foreground" />
            ) : (
              <MapPin className="h-4 w-4 text-muted-foreground" />
            )}
            <span>
              {event.isOnline ? 'Online Event' : event.location || 'Location TBD'}
            </span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Participants</span>
          </div>
          <span className="font-medium">
            {event.currentParticipants}/{event.maxParticipants}
          </span>
        </div>

        {/* Registration Status */}
        <div className="space-y-2">
          {!isRegistrationOpen() && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-700 dark:text-yellow-300">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Registration closed
            </div>
          )}
          
          {isEventFull() && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Event is full
            </div>
          )}

          {isRegistered && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4 inline mr-2" />
              You're registered!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {canRegister() ? (
            <Button 
              className="flex-1" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRegister(event.id);
              }}
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </Button>
          ) : isRegistered ? (
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              disabled
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Registered
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              disabled
            >
              Registration Closed
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare(event.id);
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
              {/* Organizer */}
              <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={event.organizerAvatar} />
                  <AvatarFallback>
                    {event.organizerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Organized by</p>
                  <p className="text-muted-foreground">{event.organizerName}</p>
                </div>
              </div>

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Materials */}
              {event.materials && event.materials.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Materials</h4>
                  <div className="space-y-2">
                    {event.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="truncate">{material}</span>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Deadline */}
              {event.registrationDeadline && (
                <div className="text-xs text-muted-foreground">
                  Registration closes: {new Date(event.registrationDeadline).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 