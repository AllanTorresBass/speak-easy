'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedGrammarGuide } from '@/components/grammar/unified-grammar-guide';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';

export default function TestUnifiedGrammarPage() {
  const [selectedGuide, setSelectedGuide] = useState<string>('comparative_superlative_grammar');
  const [availableGuides, setAvailableGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const grammarService = UnifiedGrammarService.getInstance();

  useEffect(() => {
    loadAvailableGuides();
  }, []);

  const loadAvailableGuides = async () => {
    try {
      setLoading(true);
      const guides = await grammarService.loadAllGrammarGuides();
      const guideIds = guides.map(guide => guide.id);
      setAvailableGuides(guideIds);
      addLog(`Loaded ${guides.length} grammar guides: ${guideIds.join(', ')}`);
    } catch (error) {
      addLog(`Error loading guides: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testIndividualGuide = async (guideId: string) => {
    try {
      addLog(`Testing individual guide: ${guideId}`);
      const guide = await grammarService.loadGrammarGuide(guideId);
      if (guide) {
        addLog(`✅ Successfully loaded ${guideId}: ${guide.title}`);
        addLog(`   - ${guide.contexts.length} contexts`);
        addLog(`   - ${guide.metadata.totalContent} content items`);
        addLog(`   - Difficulty: ${guide.metadata.difficulty}`);
        addLog(`   - Category: ${guide.metadata.category}`);
      } else {
        addLog(`❌ Failed to load ${guideId}`);
      }
    } catch (error) {
      addLog(`❌ Error testing ${guideId}: ${error}`);
    }
  };

  const testSearch = async () => {
    try {
      addLog('Testing search functionality...');
      const results = await grammarService.searchGrammarContent('user experience');
      addLog(`✅ Search found ${results.length} results`);
      results.forEach((result, index) => {
        addLog(`   ${index + 1}. ${result.guide.title} - ${result.context.title} (${result.content.length} matches)`);
      });
    } catch (error) {
      addLog(`❌ Search error: ${error}`);
    }
  };

  const testStats = async () => {
    try {
      addLog('Testing statistics...');
      const stats = await grammarService.getGrammarStats();
      addLog(`✅ Stats loaded:`);
      addLog(`   - Total guides: ${stats.totalGuides}`);
      addLog(`   - Total contexts: ${stats.totalContexts}`);
      addLog(`   - Total content: ${stats.totalContent}`);
      addLog(`   - Average difficulty: ${stats.averageDifficulty}`);
      addLog(`   - Professional areas: ${stats.professionalAreas.join(', ')}`);
    } catch (error) {
      addLog(`❌ Stats error: ${error}`);
    }
  };

  const testExamples = async () => {
    try {
      addLog('Testing examples display...');
      const guide = await grammarService.loadGrammarGuide(selectedGuide);
      if (guide) {
        addLog(`✅ Guide loaded: ${guide.title}`);
        
        // Check basic concepts examples
        if (guide.concepts.length > 0) {
          const concept = guide.concepts[0];
          addLog(`   - Basic concept: ${concept.title}`);
          addLog(`   - Definition: ${concept.definition.substring(0, 100)}...`);
          addLog(`   - Examples count: ${concept.examples.length}`);
          concept.examples.forEach((example, index) => {
            addLog(`     Example ${index + 1}: ${example.text.substring(0, 80)}...`);
          });
        }
        
        // Check context examples
        if (guide.contexts.length > 0) {
          addLog(`   - Contexts count: ${guide.contexts.length}`);
          guide.contexts.forEach((context, index) => {
            addLog(`     Context ${index + 1}: ${context.title} (${context.content.length} items)`);
            if (context.content.length > 0) {
              addLog(`       First item: ${context.content[0].text.substring(0, 80)}...`);
            }
          });
        }
      } else {
        addLog(`❌ Failed to load guide for examples test`);
      }
    } catch (error) {
      addLog(`❌ Examples test error: ${error}`);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Unified Grammar System Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test the new unified grammar system and verify it works correctly with your existing grammar files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Grammar Guide to Test:
                </label>
                <select
                  value={selectedGuide}
                  onChange={(e) => setSelectedGuide(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {availableGuides.map(guideId => (
                    <option key={guideId} value={guideId}>
                      {guideId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => testIndividualGuide(selectedGuide)}
                  disabled={loading}
                  variant="outline"
                >
                  Test Individual Guide
                </Button>
                
                <Button
                  onClick={testSearch}
                  disabled={loading}
                  variant="outline"
                >
                  Test Search
                </Button>
                
                <Button
                  onClick={testStats}
                  disabled={loading}
                  variant="outline"
                >
                  Test Statistics
                </Button>
                
                <Button
                  onClick={testExamples}
                  disabled={loading}
                  variant="outline"
                >
                  Test Examples
                </Button>
                
                <Button
                  onClick={clearLogs}
                  variant="outline"
                >
                  Clear Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center">No test results yet. Run some tests to see results here.</p>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                        {result}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <p className="text-sm text-gray-600">
                See the unified grammar guide component in action
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <UnifiedGrammarGuide guideId={selectedGuide} />
              </div>
            </CardContent>
          </Card>
          
          {/* Debug Data */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Debug Data</CardTitle>
              <p className="text-sm text-gray-600">
                Raw data structure for troubleshooting
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(
                    grammarService.getCachedGuide(selectedGuide) || 'No cached data',
                    null,
                    2
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
