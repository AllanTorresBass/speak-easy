'use client';

import React, { useState, useEffect } from 'react';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';
import { GrammarGuide } from '@/types/grammar';

export default function TestCauseEffectPage() {
  const [guide, setGuide] = useState<GrammarGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCauseEffect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const service = UnifiedGrammarService.getInstance();
      const result = await service.loadGrammarGuide('software_development_cause_effect');
      
      if (result) {
        setGuide(result);
        console.log('Loaded cause-effect guide:', result);
      } else {
        setError('Failed to load guide');
      }
    } catch (err) {
      console.error('Error loading cause-effect guide:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Test Cause-Effect Grammar Loading
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test loading cause-effect grammar files to verify they work correctly.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <button
            onClick={testCauseEffect}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Loading...' : 'Test Cause-Effect Loading'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {guide && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Loaded Guide</h2>
            <div className="space-y-4">
              <div>
                <strong>Title:</strong> {guide.title}
              </div>
              <div>
                <strong>Category:</strong> {guide.metadata.category}
              </div>
              <div>
                <strong>Total Contexts:</strong> {guide.contexts.length}
              </div>
              <div>
                <strong>Total Content:</strong> {guide.metadata.totalContent}
              </div>
              
              <div>
                <strong>Contexts:</strong>
                <ul className="list-disc list-inside mt-2">
                  {guide.contexts.map((context, index) => (
                    <li key={index}>
                      {context.title} ({context.content.length} items)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
            {guide ? JSON.stringify(guide, null, 2) : 'No data loaded'}
          </pre>
        </div>
      </div>
    </div>
  );
}
