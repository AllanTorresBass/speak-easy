'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Brain, Target, Users, Clock, ArrowRight, Zap, GraduationCap, AlertTriangle, Briefcase, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { GrammarGuide } from '@/types/grammar';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';

export default function InterviewGrammarPage() {
  const [guides, setGuides] = useState<GrammarGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    const loadInterviewGuides = async () => {
      try {
        setLoading(true);
        const service = UnifiedGrammarService.getInstance();
        
        // Load specific interview guides
        const loadedGuides: GrammarGuide[] = [];
        
        try {
          const prepGuide = await service.loadGrammarGuide('interview_preparation_guide');
          if (prepGuide) {
            loadedGuides.push(prepGuide);
          }
        } catch (error) {
          console.log('Failed to load interview preparation guide:', error);
        }
        
        try {
          const qaGuide = await service.loadGrammarGuide('interview_qa_simple');
          if (qaGuide) {
            loadedGuides.push(qaGuide);
          }
        } catch (error) {
          console.log('Failed to load interview Q&A guide:', error);
        }
        
        // If no guides loaded, try loading all guides to see if there's a general issue
        if (loadedGuides.length === 0) {
          console.log('No specific guides loaded, trying to load all guides...');
          const allGuides = await service.loadAllGrammarGuides();
          console.log('All guides loaded:', allGuides);
          const interviewGuides = allGuides.filter(g => g.metadata.category === 'interview');
          console.log('Filtered interview guides:', interviewGuides);
          loadedGuides.push(...interviewGuides);
        }
        
        // If still no guides, create a mock guide for display purposes
        if (loadedGuides.length === 0) {
          console.log('Creating fallback guide data...');
          const fallbackGuide: GrammarGuide = {
            id: 'interview_preparation_guide',
            title: 'Interview Preparation Guide',
            description: 'Comprehensive guide covering common interview questions, sample answers, best practices, and preparation strategies',
            version: '1.0',
            createdDate: '2024-12-19',
            concepts: [],
            contexts: [
              {
                id: 'personal_introduction',
                title: 'Personal Introduction',
                description: 'Questions focused on understanding the candidate\'s background and experience',
                category: 'interview',
                difficulty: 'intermediate',
                content: [],
                examples: [],
                metadata: {}
              }
            ],
            metadata: {
              difficulty: 'intermediate',
              category: 'interview',
              totalContent: 20,
              totalExercises: 0,
              estimatedTime: 10,
              professionalAreas: ['Career Development', 'Interview Skills'],
              tags: ['interview_preparation', 'career_development', 'professional_skills'],
              targetAudience: ['job_seekers', 'career_changers', 'professionals']
            },
            audioConfig: {
              defaultSpeed: 0.75,
              defaultPitch: 0.95,
              defaultVolume: 0.85,
              voiceQuality: 'standard',
              naturalPauses: true,
              emphasisSystem: true
            }
          };
          loadedGuides.push(fallbackGuide);
        }
        
        console.log('All loaded guides:', loadedGuides);
        setGuides(loadedGuides);
      } catch (error) {
        console.error('Error loading interview guides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviewGuides();
  }, []);

  // Filter guides based on search and difficulty
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || guide.metadata.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Calculate statistics
  const stats = {
    totalGuides: guides.length,
    totalQuestions: guides.reduce((sum, guide) => sum + (guide.metadata.totalContent || 0), 0),
    totalCategories: guides.reduce((sum, guide) => sum + (guide.contexts?.length || 0), 0),
    averageDifficulty: guides.length > 0 
      ? guides.reduce((sum, guide) => {
          const difficulty = guide.metadata.difficulty;
          const value = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
          return sum + value;
        }, 0) / guides.length
      : 0
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interview guides...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Grammar</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Master interview questions, sample answers, and preparation strategies for professional success
          </p>
        </div>

        {/* Direct Navigation to Interview Guides */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Briefcase className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Ready to Ace Your Interviews?</h3>
              <p className="text-blue-600 mb-4">
                Access comprehensive guides with 20+ interview questions and expert strategies
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/grammar/guide/interview_preparation_guide">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Study Preparation Guide
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/grammar/guide/interview_qa_simple">
                  <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Users className="h-5 w-5 mr-2" />
                    View Q&A Format
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Guides</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGuides}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuestions}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCategories}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Difficulty</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageDifficulty > 0 ? 
                      ['Beginner', 'Intermediate', 'Advanced'][Math.round(stats.averageDifficulty) - 1] : 
                      'N/A'
                    }
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search interview guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Interview Guides Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No interview guides are currently available.'
                }
              </p>
              <div className="mt-4">
                <Link href="/grammar/guide/interview_preparation_guide">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Access Guide Directly
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/grammar/guide/${guide.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant="secondary">{guide.metadata.difficulty}</Badge>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {guide.metadata.totalContent} questions
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
