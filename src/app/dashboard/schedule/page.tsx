'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  Users,
  BookOpen,
  Mic,
  Brain,
  Play,
  Edit,
  Eye,
  Star,
  RefreshCw,
  CalendarDays,
  Clock3,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarClock,
  CalendarOff,
  CalendarWeek,
  CalendarMonth,
  CalendarYear,
  Target
} from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockScheduleStats = {
  todaySessions: 2,
  completedToday: 1,
  totalStudyTime: 75,
  weeklyGoal: 5
};

const mockTodaySessions = [
  {
    id: '1',
    title: 'Vocabulary Practice',
    type: 'vocabulary',
    duration: 30,
    startTime: '09:00',
    endTime: '09:30',
    status: 'completed',
    progress: 100,
    instructor: 'AI Tutor',
    participants: 1,
    category: 'Practice'
  },
  {
    id: '2',
    title: 'Grammar Review',
    type: 'grammar',
    duration: 45,
    startTime: '14:00',
    endTime: '14:45',
    status: 'upcoming',
    progress: 0,
    instructor: 'Dr. Sarah Johnson',
    participants: 8,
    category: 'Lesson'
  }
];

const mockWeeklySchedule = [
  {
    day: 'Monday',
    sessions: [
      { title: 'Speaking Practice', time: '10:00', duration: 30, type: 'speaking' },
      { title: 'Listening Exercise', time: '15:00', duration: 25, type: 'listening' }
    ]
  },
  {
    day: 'Tuesday',
    sessions: [
      { title: 'Grammar Workshop', time: '11:00', duration: 45, type: 'grammar' },
      { title: 'Vocabulary Quiz', time: '16:00', duration: 20, type: 'vocabulary' }
    ]
  },
  {
    day: 'Wednesday',
    sessions: [
      { title: 'Writing Practice', time: '09:30', duration: 40, type: 'writing' },
      { title: 'Pronunciation', time: '14:30', duration: 30, type: 'pronunciation' }
    ]
  },
  {
    day: 'Thursday',
    sessions: [
      { title: 'Reading Comprehension', time: '10:30', duration: 35, type: 'reading' },
      { title: 'Conversation Club', time: '17:00', duration: 50, type: 'speaking' }
    ]
  },
  {
    day: 'Friday',
    sessions: [
      { title: 'Grammar Review', time: '11:30', duration: 40, type: 'grammar' },
      { title: 'Listening Test', time: '15:30', duration: 30, type: 'listening' }
    ]
  },
  {
    day: 'Saturday',
    sessions: [
      { title: 'Weekend Workshop', time: '13:00', duration: 90, type: 'workshop' }
    ]
  },
  {
    day: 'Sunday',
    sessions: [
      { title: 'Review Session', time: '16:00', duration: 45, type: 'review' }
    ]
  }
];

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState('2024-01-20');
  const [isAddingSession, setIsAddingSession] = useState(false);

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return BookOpen;
      case 'grammar':
        return Brain;
      case 'speaking':
        return Mic;
      case 'listening':
        return Headphones;
      case 'writing':
        return Edit;
      case 'reading':
        return BookOpen;
      case 'pronunciation':
        return Mic;
      case 'workshop':
        return Users;
      case 'review':
        return RefreshCw;
      default:
        return BookOpen;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return 'text-blue-600';
      case 'grammar':
        return 'text-purple-600';
      case 'speaking':
        return 'text-green-600';
      case 'listening':
        return 'text-orange-600';
      case 'writing':
        return 'text-red-600';
      case 'reading':
        return 'text-indigo-600';
      case 'pronunciation':
        return 'text-teal-600';
      case 'workshop':
        return 'text-pink-600';
      case 'review':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Study Schedule
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Plan and organize your learning sessions for optimal progress.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockScheduleStats.todaySessions}</p>
                <p className="text-sm text-muted-foreground">Scheduled for today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockScheduleStats.completedToday}</p>
                <p className="text-sm text-muted-foreground">Out of {mockScheduleStats.todaySessions} sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockScheduleStats.totalStudyTime}m</p>
                <p className="text-sm text-muted-foreground">Minutes planned today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{mockScheduleStats.weeklyGoal}/7</p>
                <p className="text-sm text-muted-foreground">Days this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Calendar View</CardTitle>
              </div>
              <CardDescription>
                Select a date to view and manage your study sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="date">Select Date:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Sessions for {new Date(selectedDate).toLocaleDateString()}
                  </h3>
                  {mockTodaySessions.length > 0 ? (
                    <div className="space-y-3">
                      {mockTodaySessions.map((session) => {
                        const SessionIcon = getSessionIcon(session.type);
                        const sessionColor = getSessionColor(session.type);
                        
                        return (
                          <div key={session.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`${sessionColor} p-2 rounded-lg`}>
                                  <SessionIcon className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{session.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {session.startTime} - {session.endTime} ({session.duration} min)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                                  {session.status === 'completed' ? 'Completed' : 'Upcoming'}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {session.status === 'upcoming' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Instructor</span>
                                  <span className="font-medium">{session.instructor}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Participants</span>
                                  <span className="font-medium">{session.participants}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Category</span>
                                  <Badge variant="outline">{session.category}</Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="flex-1">
                                    <Play className="h-4 w-4 mr-2" />
                                    Join Session
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {session.status === 'completed' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{session.progress}%</span>
                                </div>
                                <Progress value={session.progress} className="h-2" />
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Review
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Star className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sessions scheduled for this date.</p>
                      <Button 
                        className="mt-4"
                        onClick={() => setIsAddingSession(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Session
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your study schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => setIsAddingSession(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Study Session
              </Button>
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Set Weekly Goal
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Your study plan for the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockWeeklySchedule.map((day) => (
                  <div key={day.day} className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">{day.day}</h4>
                    <div className="space-y-2">
                      {day.sessions.map((session, index) => {
                        const SessionIcon = getSessionIcon(session.type);
                        const sessionColor = getSessionColor(session.type);
                        
                        return (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className={`${sessionColor} p-1 rounded`}>
                              <SessionIcon className="h-3 w-3" />
                            </div>
                            <span className="flex-1 truncate">{session.title}</span>
                            <span className="text-muted-foreground">{session.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Session Modal Placeholder */}
      {isAddingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Study Session</CardTitle>
              <CardDescription>Schedule a new learning session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="session-title">Session Title</Label>
                <Input id="session-title" placeholder="Enter session title" />
              </div>
              <div>
                <Label htmlFor="session-type">Session Type</Label>
                <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                  <option value="vocabulary">Vocabulary</option>
                  <option value="grammar">Grammar</option>
                  <option value="speaking">Speaking</option>
                  <option value="listening">Listening</option>
                  <option value="writing">Writing</option>
                  <option value="reading">Reading</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-date">Date</Label>
                  <Input id="session-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="session-time">Time</Label>
                  <Input id="session-time" type="time" />
                </div>
              </div>
              <div>
                <Label htmlFor="session-duration">Duration (minutes)</Label>
                <Input id="session-duration" type="number" placeholder="30" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setIsAddingSession(false)}>
                  Add Session
                </Button>
                <Button variant="outline" onClick={() => setIsAddingSession(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 