'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Loader2, CheckCircle, XCircle } from 'lucide-react';

export function SimpleDataTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const testBasicDataLoading = async () => {
    setIsLoading(true);
    setError('');
    setTestResults([]);
    
    try {
      // Test 1: Basic fetch to a JSON file
      setTestResults(prev => [...prev, 'Testing basic JSON fetch...']);
      
      const response = await fetch('/json/promova/vocabulary_list_2.json');
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => [...prev, `✅ JSON loaded: ${data.title} with ${data.concepts.length} concepts`]);
        
        // Test 2: Check first few words
        const firstWords = data.concepts.slice(0, 3).map((c: unknown) => (c as { word: string }).word);
        setTestResults(prev => [...prev, `✅ First words: ${firstWords.join(', ')}`]);
        
        // Test 3: Check data structure
        const hasTitle = !!data.title;
        const hasConcepts = Array.isArray(data.concepts);
        const hasWordStructure = data.concepts.every((c: unknown) => (c as { word: string; description: string }).word && (c as { word: string; description: string }).description);
        
        setTestResults(prev => [...prev, `✅ Data structure: title=${hasTitle}, concepts=${hasConcepts}, wordStructure=${hasWordStructure}`]);
        
      } else {
        setTestResults(prev => [...prev, `❌ JSON fetch failed: ${response.status}`]);
      }
      
      // Test 4: Test multiple files
      setTestResults(prev => [...prev, 'Testing multiple JSON files...']);
      let successCount = 0;
      let totalCount = 0;
      
      for (let i = 2; i <= 5; i++) {
        try {
          const fileResponse = await fetch(`/json/promova/vocabulary_list_${i}.json`);
          if (fileResponse.ok) {
            successCount++;
          }
          totalCount++;
        } catch (err) {
          totalCount++;
        }
      }
      
      setTestResults(prev => [...prev, `✅ File access: ${successCount}/${totalCount} files accessible`]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setTestResults(prev => [...prev, `❌ Test failed: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-5 w-5" />
          Simple Data Loading Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBasicDataLoading} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Basic Data Loading'
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
        
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 