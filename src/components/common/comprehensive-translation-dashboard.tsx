'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Languages, BarChart3, Download, Filter } from 'lucide-react';
import { 
  getAllAvailableTranslations, 
  getTranslationStats, 
  getComprehensiveTranslation 
} from '@/lib/comprehensive-promova-translations';

interface TranslationEntry {
  english: string;
  spanish: string;
  category: string;
}

export function ComprehensiveTranslationDashboard() {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [filteredTranslations, setFilteredTranslations] = useState<TranslationEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [translations, searchQuery, selectedCategory]);

  const loadTranslations = async () => {
    try {
      setIsLoading(true);
      const allTranslations = getAllAvailableTranslations();
      const translationStats = getTranslationStats();
      
      setTranslations(allTranslations);
      setStats(translationStats);
      
      // Convert to array format for display
      const entries: TranslationEntry[] = Object.entries(allTranslations).map(([english, spanish]) => ({
        english,
        spanish,
        category: getCategoryFromWord(english)
      }));
      
      setFilteredTranslations(entries);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryFromWord = (word: string): string => {
    const lowerWord = word.toLowerCase();
    
    if (lowerWord.includes('business') || lowerWord.includes('management') || lowerWord.includes('strategy')) {
      return 'Business & Management';
    } else if (lowerWord.includes('technology') || lowerWord.includes('software') || lowerWord.includes('digital')) {
      return 'Technology & IT';
    } else if (lowerWord.includes('marketing') || lowerWord.includes('sales') || lowerWord.includes('customer')) {
      return 'Marketing & Sales';
    } else if (lowerWord.includes('finance') || lowerWord.includes('budget') || lowerWord.includes('investment')) {
      return 'Finance & Accounting';
    } else if (lowerWord.includes('human') || lowerWord.includes('talent') || lowerWord.includes('employee')) {
      return 'Human Resources';
    } else if (lowerWord.includes('operation') || lowerWord.includes('process') || lowerWord.includes('quality')) {
      return 'Operations & Quality';
    } else if (lowerWord.includes('legal') || lowerWord.includes('compliance') || lowerWord.includes('regulatory')) {
      return 'Legal & Compliance';
    } else if (lowerWord.includes('sustainability') || lowerWord.includes('environmental') || lowerWord.includes('green')) {
      return 'Sustainability & Environment';
    } else if (lowerWord.includes('research') || lowerWord.includes('development') || lowerWord.includes('innovation')) {
      return 'Research & Development';
    } else if (lowerWord.includes('project') || lowerWord.includes('planning') || lowerWord.includes('timeline')) {
      return 'Project Management';
    } else {
      return 'General Vocabulary';
    }
  };

  const filterTranslations = () => {
    let filtered = Object.entries(translations).map(([english, spanish]) => ({
      english,
      spanish,
      category: getCategoryFromWord(english)
    }));

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.spanish.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    setFilteredTranslations(filtered);
  };

  const exportTranslations = () => {
    const csvContent = [
      'English,Spanish,Category',
      ...filteredTranslations.map(entry => 
        `"${entry.english}","${entry.spanish}","${entry.category}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'promova-translations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    'all',
    'Business & Management',
    'Technology & IT',
    'Marketing & Sales',
    'Finance & Accounting',
    'Human Resources',
    'Operations & Quality',
    'Legal & Compliance',
    'Sustainability & Environment',
    'Research & Development',
    'Project Management',
    'General Vocabulary'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive translations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Comprehensive Translation Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete Spanish translations for all Promova vocabulary files
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Translation Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalWords}</div>
                <div className="text-sm text-gray-600">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.translatedWords}</div>
                <div className="text-sm text-gray-600">Translated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.coveragePercentage}%</div>
                <div className="text-sm text-gray-600">Coverage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter Translations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search English or Spanish words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <Button onClick={exportTranslations} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Translation Results
            <Badge variant="secondary" className="ml-2">
              {filteredTranslations.length} words
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="grid gap-4">
              {filteredTranslations.map((entry, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.category}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white">English:</span>
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{entry.english}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-green-700 dark:text-green-400">Spanish:</span>
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{entry.spanish}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 