'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Download, ExternalLink, Search, BookMarked, FileText, Video, Headphones, Globe, Star, Clock, Users } from 'lucide-react';

// Mock data - in a real app, this would come from your API
const mockResources = [
  {
    id: '1',
    title: 'Essential Grammar Rules',
    description: 'A comprehensive guide to English grammar fundamentals',
    type: 'pdf',
    category: 'grammar',
    difficulty: 'beginner',
    fileSize: '2.4 MB',
    downloadCount: 1247,
    rating: 4.8,
    tags: ['grammar', 'beginner', 'rules'],
    url: '#',
    isDownloadable: true
  },
  {
    id: '2',
    title: 'Business English Vocabulary',
    description: 'Essential vocabulary for professional communication',
    type: 'pdf',
    category: 'vocabulary',
    difficulty: 'intermediate',
    fileSize: '1.8 MB',
    downloadCount: 892,
    rating: 4.6,
    tags: ['business', 'vocabulary', 'professional'],
    url: '#',
    isDownloadable: true
  },
  {
    id: '3',
    title: 'Pronunciation Guide',
    description: 'Audio guide to perfect English pronunciation',
    type: 'audio',
    category: 'pronunciation',
    difficulty: 'beginner',
    fileSize: '15.2 MB',
    downloadCount: 2156,
    rating: 4.9,
    tags: ['pronunciation', 'audio', 'beginner'],
    url: '#',
    isDownloadable: true
  },
  {
    id: '4',
    title: 'Advanced Writing Techniques',
    description: 'Learn to write compelling essays and reports',
    type: 'video',
    category: 'writing',
    difficulty: 'advanced',
    fileSize: '45.7 MB',
    downloadCount: 567,
    rating: 4.7,
    tags: ['writing', 'advanced', 'essays'],
    url: '#',
    isDownloadable: false
  },
  {
    id: '5',
    title: 'IELTS Preparation Guide',
    description: 'Complete preparation materials for IELTS exam',
    type: 'pdf',
    category: 'exam-prep',
    difficulty: 'intermediate',
    fileSize: '8.9 MB',
    downloadCount: 1893,
    rating: 4.8,
    tags: ['IELTS', 'exam', 'preparation'],
    url: '#',
    isDownloadable: true
  },
  {
    id: '6',
    title: 'English Conversation Practice',
    description: 'Interactive conversation scenarios and dialogues',
    type: 'video',
    category: 'speaking',
    difficulty: 'intermediate',
    fileSize: '32.1 MB',
    downloadCount: 1342,
    rating: 4.5,
    tags: ['conversation', 'speaking', 'dialogues'],
    url: '#',
    isDownloadable: false
  }
];

const resourceTypes = {
  pdf: { label: 'PDF', icon: FileText, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  video: { label: 'Video', icon: Video, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  audio: { label: 'Audio', icon: Headphones, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  link: { label: 'Link', icon: ExternalLink, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
};

const categories = [
  { id: 'all', name: 'All Categories', count: mockResources.length },
  { id: 'grammar', name: 'Grammar', count: mockResources.filter(r => r.category === 'grammar').length },
  { id: 'vocabulary', name: 'Vocabulary', count: mockResources.filter(r => r.category === 'vocabulary').length },
  { id: 'pronunciation', name: 'Pronunciation', count: mockResources.filter(r => r.category === 'pronunciation').length },
  { id: 'writing', name: 'Writing', count: mockResources.filter(r => r.category === 'writing').length },
  { id: 'speaking', name: 'Speaking', count: mockResources.filter(r => r.category === 'speaking').length },
  { id: 'exam-prep', name: 'Exam Prep', count: mockResources.filter(r => r.category === 'exam-prep').length }
];

const difficulties = [
  { id: 'all', name: 'All Levels', count: mockResources.length },
  { id: 'beginner', name: 'Beginner', count: mockResources.filter(r => r.difficulty === 'beginner').length },
  { id: 'intermediate', name: 'Intermediate', count: mockResources.filter(r => r.difficulty === 'intermediate').length },
  { id: 'advanced', name: 'Advanced', count: mockResources.filter(r => r.difficulty === 'advanced').length }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloadCount - a.downloadCount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleDownload = (resourceId: string) => {
    // In a real app, this would trigger a download
    console.log('Downloading resource:', resourceId);
  };

  const handleView = (resourceId: string) => {
    // In a real app, this would open the resource
    console.log('Viewing resource:', resourceId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Access additional materials, study guides, and educational content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResources.length}</div>
            <p className="text-xs text-muted-foreground">
              Available materials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockResources.reduce((total, resource) => total + resource.downloadCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Downloads this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockResources.reduce((total, resource) => total + resource.rating, 0) / mockResources.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BookMarked className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
            <p className="text-xs text-muted-foreground">
              Learning areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search resources</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name} ({difficulty.count})
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResources.map((resource) => {
          const typeInfo = resourceTypes[resource.type as keyof typeof resourceTypes];
          const TypeIcon = typeInfo.icon;
          
          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                    <CardDescription className="text-sm mb-3">
                      {resource.description}
                    </CardDescription>
                  </div>
                  <Badge className={typeInfo.color}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {typeInfo.label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {resource.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {resource.downloadCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {resource.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {resource.fileSize}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {resource.isDownloadable ? (
                      <Button 
                        onClick={() => handleDownload(resource.id)}
                        className="flex-1"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleView(resource.id)}
                        className="flex-1"
                        size="sm"
                        variant="outline"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {sortedResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Featured Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Interactive Learning Tools
              </CardTitle>
              <CardDescription>
                Access our collection of interactive learning tools and exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explore Tools
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Study Groups
              </CardTitle>
              <CardDescription>
                Join study groups and connect with other learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Find Groups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 