'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Loader2, XCircle } from 'lucide-react';
import { loadPromovaVocabularySimple, loadPromovaVocabularyListSimple } from '@/lib/promova-data-simple';
import { VocabularyList, VocabularyWord } from '@/types';

export function PromovaDataTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [lists, setLists] = useState<VocabularyList[]>([]);
  const [selectedList, setSelectedList] = useState<VocabularyList | null>(null);
  const [listWords, setListWords] = useState<VocabularyWord[]>([]);
  const [error, setError] = useState<string>('');

  const testDataLoading = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Testing Promova data loading...');
      
      // Test loading all lists
      const vocabularyLists = await loadPromovaVocabularySimple();
      console.log('Loaded vocabulary lists:', vocabularyLists);
      setLists(vocabularyLists);
      
      if (vocabularyLists.length > 0) {
        // Test loading first list with words
        const firstList = vocabularyLists[0];
        console.log('Testing first list:', firstList);
        
        const listWithWords = await loadPromovaVocabularyListSimple(firstList.id);
        console.log('Loaded list with words:', listWithWords);
        
        if (listWithWords) {
          setSelectedList(listWithWords);
          setListWords(listWithWords.words || []);
        }
      }
    } catch (err) {
      console.error('Error testing data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testSpecificList = async (listId: string) => {
    try {
      console.log('Testing specific list:', listId);
      const listWithWords = await loadPromovaVocabularyListSimple(listId);
      console.log('Loaded specific list:', listWithWords);
      
      if (listWithWords) {
        setSelectedList(listWithWords);
        setListWords(listWithWords.words || []);
      }
    } catch (err) {
      console.error('Error loading specific list:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
            Promova Data Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testDataLoading} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Data Loading...
              </>
            ) : (
              'Test Promova Data Loading'
            )}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                <XCircle className="h-4 w-4" />
                Error: {error}
              </div>
            </div>
          )}
          
          {lists.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Loaded Lists ({lists.length}):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lists.map((list) => (
                  <Card key={list.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{list.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {list.wordCount} words • {list.difficulty}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testSpecificList(list.id)}
                      >
                        Load Words
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {selectedList && (
            <div className="space-y-3">
              <h3 className="font-semibold">Selected List: {selectedList.title}</h3>
              <div className="flex gap-2">
                <Badge variant="outline">{selectedList.wordCount} words</Badge>
                <Badge>{selectedList.difficulty}</Badge>
                <Badge variant="outline">{selectedList.category}</Badge>
              </div>
              
              {listWords.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Sample Words:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listWords.slice(0, 6).map((word) => (
                      <Card key={word.id} className="p-2">
                        <div className="text-sm">
                          <div className="font-medium">{word.word}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {word.definition}
                          </div>
                          {word.translation && (
                            <div className="text-green-600 dark:text-green-400 text-xs mt-1">
                              🇪🇸 {word.translation}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  {listWords.length > 6 && (
                    <p className="text-sm text-gray-500">
                      ... and {listWords.length - 6} more words
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 