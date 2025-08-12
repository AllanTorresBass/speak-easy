'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  BookOpen, 
  GraduationCap,
  Target,
  Calendar,
  Save,
  Edit,
  Camera
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useThemeToggle } from '@/contexts/theme-context';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useThemeToggle();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || 'Demo User',
    email: session?.user?.email || 'demo@speakeasy.com',
    nativeLanguage: session?.user?.nativeLanguage || 'en',
    targetLanguage: session?.user?.targetLanguage || 'en',
    proficiencyLevel: session?.user?.proficiencyLevel || 'intermediate',
    dailyGoal: 20,
    studyReminders: true,
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    soundEffects: true,
    autoPlayAudio: false,
    showTranslations: true,
    difficultyAdaptation: true,
    spacedRepetition: true
  });

  const handleSave = () => {
    // In production, this would save to the database
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    // Reset to original values
    setProfileData({
      name: session?.user?.name || 'Demo User',
      email: session?.user?.email || 'demo@speakeasy.com',
      nativeLanguage: session?.user?.nativeLanguage || 'en',
      targetLanguage: session?.user?.targetLanguage || 'en',
      proficiencyLevel: session?.user?.proficiencyLevel || 'intermediate',
      dailyGoal: 20,
      studyReminders: true,
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      soundEffects: true,
      autoPlayAudio: false,
      showTranslations: true,
      difficultyAdaptation: true,
      spacedRepetition: true
    });
    setIsEditing(false);
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and learning preferences
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback className="text-2xl">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <CardDescription>{profileData.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={getProficiencyColor(profileData.proficiencyLevel)}>
                  {profileData.proficiencyLevel.charAt(0).toUpperCase() + profileData.proficiencyLevel.slice(1)}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Member since</span>
                  <span className="font-medium">January 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Study streak</span>
                  <span className="font-medium text-green-600">7 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Total words learned</span>
                  <span className="font-medium">247</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Vocabulary Lists</span>
                </div>
                <Badge variant="outline">3 completed</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Grammar Lessons</span>
                </div>
                <Badge variant="outline">2 completed</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Practice Sessions</span>
                </div>
                <Badge variant="outline">14 total</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nativeLanguage">Native Language</Label>
                  <Select
                    value={profileData.nativeLanguage}
                    onValueChange={(value) => setProfileData({ ...profileData, nativeLanguage: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(supportedLanguages).map(([code, lang]) => (
                        <SelectItem key={code} value={code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetLanguage">Target Language</Label>
                  <Select
                    value={profileData.targetLanguage}
                    onValueChange={(value) => setProfileData({ ...profileData, targetLanguage: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(supportedLanguages).map(([code, lang]) => (
                        <SelectItem key={code} value={code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proficiencyLevel">Current Level</Label>
                  <Select
                    value={profileData.proficiencyLevel}
                    onValueChange={(value) => setProfileData({ ...profileData, proficiencyLevel: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Learning Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyGoal">Daily Learning Goal (words)</Label>
                  <Input
                    id="dailyGoal"
                    type="number"
                    value={profileData.dailyGoal}
                    onChange={(e) => setProfileData({ ...profileData, dailyGoal: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    min="5"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Study Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily study reminders
                    </p>
                  </div>
                  <Switch
                    checked={profileData.studyReminders}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, studyReminders: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Difficulty Adaptation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjust difficulty based on performance
                    </p>
                  </div>
                  <Switch
                    checked={profileData.difficultyAdaptation}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, difficultyAdaptation: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Spaced Repetition</Label>
                    <p className="text-sm text-muted-foreground">
                      Use spaced repetition for better retention
                    </p>
                  </div>
                  <Switch
                    checked={profileData.spacedRepetition}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, spacedRepetition: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Translations</Label>
                    <p className="text-sm text-muted-foreground">
                      Display word translations during practice
                    </p>
                  </div>
                  <Switch
                    checked={profileData.showTranslations}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, showTranslations: checked })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>App Settings</span>
              </CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Interface language
                    </p>
                  </div>
                </div>
                <Select value={currentLanguage} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(supportedLanguages).map(([code, lang]) => (
                      <SelectItem key={code} value={code}>
                        {lang.flag} {lang.code.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      App appearance
                    </p>
                  </div>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds during practice
                    </p>
                  </div>
                  <Switch
                    checked={profileData.soundEffects}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, soundEffects: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-play Audio</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play word pronunciations
                    </p>
                  </div>
                  <Switch
                    checked={profileData.autoPlayAudio}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, autoPlayAudio: checked })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, emailNotifications: checked })}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications
                  </p>
                </div>
                <Switch
                  checked={profileData.pushNotifications}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, pushNotifications: checked })}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly learning summaries
                  </p>
                </div>
                <Switch
                  checked={profileData.weeklyReports}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, weeklyReports: checked })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 