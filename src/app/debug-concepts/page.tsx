'use client';

import React, { useState } from 'react';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';

export default function DebugConceptsPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testIndividualConcepts = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const service = UnifiedGrammarService.getInstance();
      
      // Test individual concepts guides
      const conceptsGuides = [
        'phrases_concepts',
        'database_improvement_concepts',
        'project_management_concepts',
        'soft_skills_concepts',
        'software_development_concepts',
        'ui_concepts',
        'ui_ux_principles',
        'ux_concepts'
      ];

      for (const guideId of conceptsGuides) {
        try {
          addResult(`Testing ${guideId}...`);
          const guide = await service.loadGrammarGuide(guideId);
          if (guide) {
            addResult(`✅ ${guideId} loaded successfully with ${guide.contexts.length} contexts`);
          } else {
            addResult(`❌ ${guideId} failed to load`);
          }
        } catch (error) {
          addResult(`❌ ${guideId} error: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Test loadAllGrammarGuides
      addResult('Testing loadAllGrammarGuides...');
      try {
        const allGuides = await service.loadAllGrammarGuides();
        addResult(`✅ loadAllGrammarGuides completed with ${allGuides.length} guides`);
        
        const conceptsCount = allGuides.filter(g => g.metadata.category === 'concepts').length;
        addResult(`Found ${conceptsCount} concepts guides`);
        
      } catch (error) {
        addResult(`❌ loadAllGrammarGuides error: ${error instanceof Error ? error.message : String(error)}`);
      }

    } catch (error) {
      addResult(`❌ General error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug Concepts Grammar Loading</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testIndividualConcepts}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Concepts Loading'}
        </button>
        
        <button 
          onClick={clearResults}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-2"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Results:</h2>
        <div className="space-y-1">
          {results.length === 0 ? (
            <p className="text-gray-500">No results yet. Click the test button to start.</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
