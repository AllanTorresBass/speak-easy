'use client';

import React, { useState } from 'react';

export default function DebugCauseEffectPage() {
  const [debugInfo, setDebugInfo] = useState<string>('');

  const debugCauseEffect = async () => {
    try {
      // Test direct file access
      const response = await fetch('/json/grammar/cause-effect/software_development_cause_effect.json');
      const data = await response.json();
      
      let info = '=== DIRECT FILE ACCESS ===\n';
      info += `Status: ${response.status}\n`;
      info += `Title: ${data.title}\n`;
      info += `Has cause_effect_categories: ${!!data.cause_effect_categories}\n`;
      info += `Categories count: ${Object.keys(data.cause_effect_categories || {}).length}\n`;
      
      if (data.cause_effect_categories) {
        Object.entries(data.cause_effect_categories).forEach(([key, category]: [string, any]) => {
          info += `- ${key}: ${category.title} (${category.verbs?.length || 0} verbs)\n`;
        });
      }
      
      info += '\n=== TESTING SERVICE ===\n';
      
      // Test the service
      const { UnifiedGrammarService } = await import('@/lib/unified-grammar-service');
      const service = UnifiedGrammarService.getInstance();
      
      info += 'Service instance created\n';
      
      // Test directory detection
      const directory = (service as any).getGrammarDirectory('software_development_cause_effect');
      info += `Directory detected: ${directory}\n`;
      
      // Test loading
      const guide = await service.loadGrammarGuide('software_development_cause_effect');
      if (guide) {
        info += `Guide loaded successfully!\n`;
        info += `Title: ${guide.title}\n`;
        info += `Category: ${guide.metadata.category}\n`;
        info += `Contexts: ${guide.contexts.length}\n`;
        info += `Total content: ${guide.metadata.totalContent}\n`;
      } else {
        info += `Guide loading failed - returned null\n`;
      }
      
      setDebugInfo(info);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Debug Cause-Effect Grammar Loading
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Debug the cause-effect grammar loading process step by step.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Controls</h2>
          <button
            onClick={debugCauseEffect}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Debug Cause-Effect Loading
          </button>
        </div>

        {debugInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs whitespace-pre-wrap">
              {debugInfo}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
