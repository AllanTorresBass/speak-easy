'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function TestConceptsPage() {
  const [guides, setGuides] = useState<GrammarGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testConceptsLoading = async () => {
    setLoading(true);
    setError(null);
    setLogs([]);
    
    try {
      addLog('Starting concepts test...');
      const service = UnifiedGrammarService.getInstance();
      
      const conceptsGuideIds = [
        'database_improvement_concepts',
        'phrases_concepts',
        'project_management_concepts',
        'soft_skills_concepts',
        'software_development_concepts',
        'ui_concepts',
        'ui_ux_principles',
        'ux_concepts'
      ];
      
      addLog(`Testing ${conceptsGuideIds.length} concepts guides...`);
      
      const loadedGuides: GrammarGuide[] = [];
      
      for (const guideId of conceptsGuideIds) {
        try {
          addLog(`Loading guide: ${guideId}`);
          const guide = await service.loadGrammarGuide(guideId);
          if (guide) {
            addLog(`✓ Successfully loaded ${guideId} with ${guide.contexts.length} contexts and ${guide.metadata.totalContent} content items`);
            loadedGuides.push(guide);
          } else {
            addLog(`✗ Guide ${guideId} returned null`);
          }
        } catch (error) {
          addLog(`✗ Failed to load guide ${guideId}: ${error}`);
        }
      }
      
      addLog(`Test completed. Successfully loaded ${loadedGuides.length} out of ${conceptsGuideIds.length} guides.`);
      setGuides(loadedGuides);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`✗ Test failed with error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Concepts Loading Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testConceptsLoading} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Testing...' : 'Test Concepts Loading'}
            </Button>
            
            {error && (
              <div className="text-red-600 mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Total Guides Loaded:</strong> {guides.length}</p>
                <p><strong>Total Content Items:</strong> {guides.reduce((sum, g) => sum + g.metadata.totalContent, 0)}</p>
                <p><strong>Total Contexts:</strong> {guides.reduce((sum, g) => sum + g.contexts.length, 0)}</p>
              </div>
              
              {guides.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Loaded Guides:</h4>
                  <ul className="space-y-1 text-sm">
                    {guides.map(guide => (
                      <li key={guide.id}>
                        ✓ {guide.title} ({guide.contexts.length} contexts, {guide.metadata.totalContent} content)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto bg-gray-50 p-3 rounded text-sm font-mono">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No logs yet. Click &quot;Test Concepts Loading&quot; to start.</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}</p>
              <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
