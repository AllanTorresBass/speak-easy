'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Users, TrendingUp } from 'lucide-react';
import { getWordsVocabularyStats } from '@/lib/words-data';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';

interface VocabularyList {
  id: number;
  title: string;
  wordCount: number;
}

export default function WordsVocabularyPage() {
  const [stats, setStats] = useState<{
    totalLists: number;
    totalWords: number;
    lists: VocabularyList[];
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLists, setFilteredLists] = useState<VocabularyList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getWordsVocabularyStats();
        setStats(statsData);
        setFilteredLists(statsData.lists);
      } catch (error) {
        console.error('Error loading words vocabulary stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (!stats) return;

    const filtered = stats.lists.filter(list =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLists(filtered);
  }, [searchQuery, stats]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading Words Vocabulary...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Words Vocabulary
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of English-Spanish vocabulary lists, 
            covering essential words and phrases for everyday communication, business, 
            travel, and more.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Total Lists</p>
                  <p className="text-2xl font-bold">{stats?.totalLists || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Total Words</p>
                  <p className="text-2xl font-bold">{stats?.totalWords || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Average per List</p>
                  <p className="text-2xl font-bold">
                    {stats ? Math.round(stats.totalWords / stats.totalLists) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search vocabulary lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Vocabulary Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLists.map((list) => (
                            <Link key={list.id} href={`/vocabulary/words-list/${list.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {list.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {list.wordCount} words
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      View List →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredLists.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No vocabulary lists found matching "{searchQuery}"
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!stats && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No vocabulary lists available at the moment.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 