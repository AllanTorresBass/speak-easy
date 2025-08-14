'use client';

import React, { useState } from 'react';
import { UnifiedGrammarService } from '@/lib/unified-grammar-service';

export default function TestGrammarLoadingPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGrammarLoading = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const service = UnifiedGrammarService.getInstance();
      
      // Test individual guides
      const testGuides = [
        'adjectives_grammar',
        'adverbs_grammar',
        'advanced_sentences_grammar',
        'clauses_grammar',
        'conjunctions_grammar',
        'determiners_grammar',
        'nouns_grammar',
        'prepositional_phrases',
        'prepositions_grammar',
        'pronouns_grammar',
        'subject_predicate_grammar',
        'verbs_grammar',
        'comparative_superlative_grammar',
        'conditional_grammar',
        'indirect_questions_grammar',
        'modifiers_grammar',
        'passive_voice_grammar',
        'past_perfect_grammar',
        'present_perfect_continuous_grammar',
        'present_perfect_grammar',
        'subordinate_clauses_grammar',
        'software_development_cause_effect',
        'ux_design_cause_effect',
        'database_improvement_concepts',
        'phrases_concepts',
        'project_management_concepts',
        'soft_skills_concepts',
        'software_development_concepts',
        'ui_concepts',
        'ui_ux_principles',
        'ux_concepts',
        'verb_conjugation_guide'
      ];
      
      addResult(`Testing ${testGuides.length} grammar guides...`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const guideId of testGuides) {
        try {
          addResult(`Testing ${guideId}...`);
          const guide = await service.loadGrammarGuide(guideId);
          
          if (guide) {
            addResult(`✅ ${guideId}: ${guide.title} (${guide.metadata.totalContent} content items)`);
            successCount++;
          } else {
            addResult(`❌ ${guideId}: Failed to load`);
            errorCount++;
          }
        } catch (error) {
          addResult(`❌ ${guideId}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
          errorCount++;
        }
      }
      
      addResult(`\n📊 Summary: ${successCount} successful, ${errorCount} failed`);
      
    } catch (error) {
      addResult(`❌ Overall error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Grammar Loading</h1>
      
      <div className="mb-6">
        <button
          onClick={testGrammarLoading}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          {loading ? 'Testing...' : 'Test All Grammar Guides'}
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Results:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500">No results yet. Click the test button to start.</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
