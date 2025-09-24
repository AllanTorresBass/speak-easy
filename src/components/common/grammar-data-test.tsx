'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { loadAllGrammarGuides, getGrammarStats, loadGrammarGuide, testGrammarDataLoading } from '@/lib/grammar-data';

export function GrammarDataTest() {
  const [guides, setGuides] = useState<unknown[]>([]);
  const [stats, setStats] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDataLoading = async () => {
    setLoading(true);
    setError(null);
    setTestResults([]);
    
    try {
      addLog('Starting comprehensive grammar data test...');
      
      const testResult = await testGrammarDataLoading();
      
      if (testResult.success) {
        addLog('✅ All tests passed successfully!');
        setGuides(testResult.details.guides || []);
        setStats(testResult.details.stats || null);
      } else {
        addLog(`❌ Tests failed with ${testResult.errors.length} errors:`);
        testResult.errors.forEach(error => addLog(`  - ${error}`));
        setError(testResult.errors.join(', '));
      }
      
      addLog(`📊 Test Summary:`);
      addLog(`  - Guides loaded: ${testResult.guidesLoaded}`);
      addLog(`  - Errors: ${testResult.errors.length}`);
      addLog(`  - Success: ${testResult.success}`);
      
      // Log detailed results
      if (testResult.details.directAccess) {
        addLog(`🌐 Direct file access: ${testResult.details.directAccess.status} - ${testResult.details.directAccess.statusText}`);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    addLog('Testing direct fetch to grammar files...');
    
    try {
      const response = await fetch('/json/grammar/basic-structure/adjectives_grammar.json');
      addLog(`Direct fetch status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`Direct fetch success: ${data.title}`);
      } else {
        addLog(`Direct fetch failed: ${response.statusText}`);
      }
    } catch (err) {
      addLog(`Direct fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Grammar Data Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testDataLoading} disabled={loading}>
            {loading ? 'Testing...' : 'Test Data Loading'}
          </Button>
          <Button onClick={testDirectFetch} variant="outline">
            Test Direct Fetch
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Loaded Guides ({guides.length})</h3>
            <div className="space-y-2">
              {guides.map((guide) => (
                <div key={guide.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{guide.title}</div>
                  <div className="text-gray-600">ID: {guide.id}</div>
                  <div className="text-gray-600">Difficulty: {guide.difficulty}</div>
                  <div className="text-gray-600">Examples: {guide.totalPhrases}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Grammar Stats</h3>
            {stats && (
              <div className="space-y-2 text-sm">
                <div><strong>Total Guides:</strong> {stats.totalGuides}</div>
                <div><strong>Total Contexts:</strong> {stats.totalContexts}</div>
                <div><strong>Total Examples:</strong> {stats.totalPhrases}</div>
                <div><strong>Average Difficulty:</strong> {stats.averageDifficulty}</div>
                <div><strong>Professional Areas:</strong> {stats.professionalAreas?.join(', ')}</div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Test Logs</h3>
          <div className="max-h-60 overflow-y-auto p-3 bg-gray-50 rounded text-sm font-mono">
            {testResults.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
            {testResults.length === 0 && (
              <div className="text-gray-500">No test results yet. Click &quot;Test Data Loading&quot; to start.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 