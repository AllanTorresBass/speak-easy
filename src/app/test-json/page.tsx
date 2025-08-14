'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestJsonPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testJsonAccess = async () => {
    setLoading(true);
    setTestResults([]);
    
    const testFiles = [
      // Basic Structure files
      '/json/grammar/basic-structure/adjectives_grammar.json',
      '/json/grammar/basic-structure/adverbs_grammar.json',
      '/json/grammar/basic-structure/clauses_grammar.json',
      '/json/grammar/basic-structure/conjunctions_grammar.json',
      '/json/grammar/basic-structure/determiners_grammar.json',
      '/json/grammar/basic-structure/nouns_grammar.json',
      '/json/grammar/basic-structure/prepositional_phrases.json',
      '/json/grammar/basic-structure/prepositions_grammar.json',
      '/json/grammar/basic-structure/pronouns_grammar.json',
      '/json/grammar/basic-structure/subject_predicate_grammar.json',
      '/json/grammar/basic-structure/verbs_grammar.json',
      '/json/grammar/basic-structure/advanced_sentences_grammar.json',
      // Complex Structure files
      '/json/grammar/complex-structure/comparative_superlative_grammar.json',
      '/json/grammar/complex-structure/conditional_grammar.json',
      '/json/grammar/complex-structure/indirect_questions_grammar.json',
      '/json/grammar/complex-structure/modifiers_grammar.json',
      '/json/grammar/complex-structure/passive_voice_grammar.json',
      '/json/grammar/complex-structure/past_perfect_grammar.json',
      '/json/grammar/complex-structure/present_perfect_continuous_grammar.json',
      '/json/grammar/complex-structure/present_perfect_grammar.json',
      '/json/grammar/complex-structure/subordinate_clauses_grammar.json'
    ];

    for (const filePath of testFiles) {
      try {
        addLog(`Testing: ${filePath}`);
        const response = await fetch(filePath);
        addLog(`Status: ${response.status} - ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          addLog(`✓ Success: ${data.title || 'No title'}`);
        } else {
          addLog(`✗ Failed: ${response.statusText}`);
        }
      } catch (error) {
        addLog(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    setLoading(false);
    addLog('All tests completed!');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">JSON File Access Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test JSON File Accessibility</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testJsonAccess} disabled={loading}>
            {loading ? 'Testing...' : 'Test All JSON Files'}
          </Button>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="max-h-96 overflow-y-auto p-3 bg-gray-50 rounded text-sm font-mono">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))}
              {testResults.length === 0 && (
                <div className="text-gray-500">No test results yet. Click the button above to start testing.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 