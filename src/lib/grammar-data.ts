// Grammar data service for loading and managing grammar content
export interface GrammarPhrase {
  [key: string]: unknown; // Dynamic structure based on grammar type
}

export interface GrammarContext {
  title: string;
  description: string;
  phrases: GrammarPhrase[];
}

export interface GrammarGuide {
  title: string;
  description: string;
  version: string;
  created_date: string;
  // Support multiple data structures
  basic_concepts?: {
    definition: string;
    key_functions: string[];
    examples?: unknown[];
  };
  professional_contexts?: {
    [key: string]: GrammarContext;
  };
  // Support subject_predicate_grammar structure
  sections?: Array<{
    id: string;
    title: string;
    content?: Array<{
      concept: string;
      definition: string;
      examples: string[];
    }>;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
    subjects?: {
      explicit_subjects: {
        definition: string;
        example: string;
      };
      implicit_subjects: {
        definition: string;
        example: string;
      };
    };
    predicates?: {
      verbal_predicates: {
        definition: string;
        example: string;
      };
      nominal_predicates: {
        definition: string;
        example: string;
      };
    };
    instructions?: string;
    sentences?: string[];
    patterns?: Array<{
      pattern: string;
      examples: string[];
    }>;
    vocabulary_examples?: {
      categories: Array<{
        category: string;
        explicit_subjects: string[];
        implicit_subjects: string[];
      }>;
    };
    categories?: Array<{
      category: string;
      examples: string[];
    }>;
  }>;
  // Support verbs_grammar structure
  professional_vocabulary?: {
    [key: string]: {
      simple_verbs: string[];
      compound_verbs: string[];
    };
  };
  // Support prepositional_phrases structure
  categories?: Array<{
    id: string;
    title: string;
    description: string;
    phrases: Array<{
      phrase: string;
      example: string;
      preposition: string;
      context: string;
    }>;
  }>;
  metadata: {
    total_contexts: number;
    total_phrases: number;
    professional_areas: string[];
    tags: string[];
    difficulty_level: string;
    target_audience: string[];
  };
}

export interface GrammarList {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  totalContexts: number;
  totalPhrases: number;
  professionalAreas: string[];
  tags: string[];
}

// List of all available grammar guides - these must match the exact file names
const GRAMMAR_GUIDES = [
  // Basic Structure
  'adjectives_grammar',
  'advanced_sentences_grammar', 
  'adverbs_grammar',
  'clauses_grammar',
  'conjunctions_grammar',
  'determiners_grammar',
  'nouns_grammar',
  'prepositional_phrases',
  'prepositions_grammar',
  'pronouns_grammar',
  'subject_predicate_grammar',
  'verbs_grammar',
  // Complex Structure
  'comparative_superlative_grammar',
  'conditional_grammar',
  'indirect_questions_grammar',
  'modifiers_grammar',
  'passive_voice_grammar',
  'past_perfect_grammar',
  'present_perfect_continuous_grammar',
  'present_perfect_grammar',
  'subordinate_clauses_grammar'
];

// Debug: Log the guides array
console.log('Available grammar guides:', GRAMMAR_GUIDES);

/**
 * Load a specific grammar guide by name
 */
export async function loadGrammarGuide(guideName: string): Promise<GrammarGuide | null> {
  // Determine the correct directory based on guide name
  const directory = getGrammarDirectory(guideName);
  const url = `/json/grammar/${directory}/${guideName}.json`;
  
  console.log(`Trying to fetch grammar guide from: ${url}`);
  
  try {
    // Add a small delay to ensure the server is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(`Response status for ${guideName} from ${url}:`, response.status);
    
    if (response.ok) {
      const data: GrammarGuide = await response.json();
      console.log(`Successfully parsed data for ${guideName} from ${url}:`, data);
      return data;
    }
  } catch (error) {
    console.error(`Error loading grammar guide ${guideName} from ${url}:`, error);
  }
  
  console.warn(`Grammar guide ${guideName} not found at ${url}`);
  return null;
}

/**
 * Determine the correct directory for a grammar guide
 */
function getGrammarDirectory(guideName: string): string {
  // Complex structure guides
  if (guideName.includes('comparative') || 
      guideName.includes('conditional') || 
      guideName.includes('indirect') || 
      guideName.includes('modifiers') || 
      guideName.includes('passive') || 
      guideName.includes('past_perfect') || 
      guideName.includes('present_perfect') || 
      guideName.includes('subordinate')) {
    return 'complex-structure';
  }
  
  // Verb conjugation guides
  if (guideName.includes('verbs') || guideName.includes('conjugation')) {
    return 'verb-conjugation';
  }
  
  // Basic structure guides (default)
  return 'basic-structure';
}

/**
 * Load all grammar guides and return basic information
 */
export async function loadAllGrammarGuides(): Promise<GrammarList[]> {
  console.log('Starting to load all grammar guides...');
  const guides: GrammarList[] = [];
  
  for (const guideName of GRAMMAR_GUIDES) {
    try {
      console.log(`Loading grammar guide: ${guideName}`);
      const guide = await loadGrammarGuide(guideName);
      if (guide && guide.metadata) {
        console.log(`Successfully loaded: ${guideName}`, guide);
        
        // Calculate statistics based on data structure
        let totalContexts = 0;
        let totalPhrases = 0;
        let professionalAreas: string[] = [];
        
        console.log(`Processing guide ${guideName} with structure:`, {
          hasProfessionalContexts: !!guide.professional_contexts,
          hasSections: !!guide.sections,
          hasProfessionalVocabulary: !!guide.professional_vocabulary,
          hasCategories: !!guide.categories
        });
        
        // Handle different data structures
        if (guide.professional_contexts) {
          // Standard structure
          totalContexts = Object.keys(guide.professional_contexts).length;
          totalPhrases = Object.values(guide.professional_contexts).reduce((sum, context) => 
            sum + (context.phrases?.length || 0), 0);
          professionalAreas = guide.metadata.professional_areas || [];
          console.log(`Standard structure: ${totalContexts} contexts, ${totalPhrases} phrases`);
        } else if (guide.sections) {
          // subject_predicate_grammar structure
          totalContexts = guide.sections.length;
          totalPhrases = guide.sections.reduce((sum, section) => {
            if (section.vocabulary_examples?.categories) {
              return sum + section.vocabulary_examples.categories.reduce((catSum, cat) => 
                catSum + (cat.explicit_subjects?.length || 0) + (cat.implicit_subjects?.length || 0), 0);
            }
            return sum + (section.content?.length || 0);
          }, 0);
          professionalAreas = guide.metadata.professional_areas || [];
          console.log(`Sections structure: ${totalContexts} sections, ${totalPhrases} total examples`);
        } else if (guide.professional_vocabulary) {
          // verbs_grammar structure
          totalContexts = Object.keys(guide.professional_vocabulary).length;
          totalPhrases = Object.values(guide.professional_vocabulary).reduce((sum, vocab) => 
            sum + (vocab.simple_verbs?.length || 0) + (vocab.compound_verbs?.length || 0), 0);
          professionalAreas = guide.metadata.professional_areas || [];
          console.log(`Professional vocabulary structure: ${totalContexts} contexts, ${totalPhrases} verbs`);
        } else if (guide.categories) {
          // prepositional_phrases structure
          totalContexts = guide.categories.length;
          totalPhrases = guide.categories.reduce((sum, category) => 
            sum + (category.phrases?.length || 0), 0);
          professionalAreas = guide.metadata.professional_areas || [];
          console.log(`Categories structure: ${totalContexts} categories, ${totalPhrases} phrases`);
        }
        
        // Determine category based on guide name
        let category = 'Basic Structure';
        if (guideName.includes('comparative') || 
            guideName.includes('conditional') || 
            guideName.includes('indirect') || 
            guideName.includes('modifiers') || 
            guideName.includes('passive') || 
            guideName.includes('past_perfect') || 
            guideName.includes('present_perfect') || 
            guideName.includes('subordinate')) {
          category = 'Complex Structure';
        }
        
        // Ensure all required fields exist with fallbacks
        const guideData: GrammarList = {
          id: guideName,
          title: guide.title || `Grammar Guide: ${guideName}`,
          description: guide.description || 'Grammar guide description',
          difficulty: guide.metadata.difficulty_level || 'intermediate',
          category: category,
          totalContexts: totalContexts,
          totalPhrases: totalPhrases,
          professionalAreas: professionalAreas,
          tags: guide.metadata.tags || []
        };
        
        guides.push(guideData);
      } else {
        console.warn(`Guide ${guideName} returned null or invalid data`);
      }
    } catch (error) {
      console.error(`Error loading grammar guide ${guideName}:`, error);
    }
  }
  
  console.log(`Total guides loaded: ${guides.length}`, guides);
  return guides;
}

/**
 * Search grammar content across all guides
 */
export async function searchGrammarContent(query: string): Promise<{
  guide: GrammarList;
  matches: GrammarPhrase[];
  context: string;
}[]> {
  const results: {
    guide: GrammarList;
    matches: GrammarPhrase[];
    context: string;
  }[] = [];
  
  const guides = await loadAllGrammarGuides();
  
  for (const guide of guides) {
    const guideData = await loadGrammarGuide(guide.id);
    if (!guideData || !guideData.professional_contexts) continue;
    
    // Search through all professional contexts
    for (const [contextName, context] of Object.entries(guideData.professional_contexts)) {
      const matches: GrammarPhrase[] = [];
      
      if (context.phrases) {
        for (const phrase of context.phrases) {
          // Search in phrase text and other relevant fields
          const searchableText = JSON.stringify(phrase).toLowerCase();
          if (searchableText.includes(query.toLowerCase())) {
            matches.push(phrase);
          }
        }
      }
      
      if (matches.length > 0) {
        results.push({
          guide,
          matches,
          context: contextName
        });
      }
    }
  }
  
  return results;
}

/**
 * Get grammar statistics
 */
export async function getGrammarStats(): Promise<{
  totalGuides: number;
  totalContexts: number;
  totalPhrases: number;
  averageDifficulty: string;
  professionalAreas: string[];
}> {
  try {
    const guides = await loadAllGrammarGuides();
    console.log('getGrammarStats: guides loaded:', guides);
    
    let totalContexts = 0;
    let totalPhrases = 0;
    const allProfessionalAreas = new Set<string>();
    
    guides.forEach(guide => {
      // Add null checks and default values
      if (guide && typeof guide === 'object') {
        totalContexts += (guide.totalContexts || 0);
        totalPhrases += (guide.totalPhrases || 0);
        
        // Check if professionalAreas exists and is an array
        if (guide.professionalAreas && Array.isArray(guide.professionalAreas)) {
          guide.professionalAreas.forEach(area => {
            if (area && typeof area === 'string') {
              allProfessionalAreas.add(area);
            }
          });
        } else {
          console.warn(`Guide ${guide.id} has invalid professionalAreas:`, guide.professionalAreas);
        }
      } else {
        console.warn('Invalid guide object:', guide);
      }
    });
    
    const averageDifficulty = guides.length > 0 
      ? guides.reduce((acc, guide) => {
          if (!guide || !guide.difficulty) return acc + 2; // Default to intermediate
          
          const difficultyMap: { [key: string]: number } = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3
          };
          return acc + (difficultyMap[guide.difficulty.toLowerCase()] || 2);
        }, 0) / guides.length
      : 2;
    
    const difficultyLabels = ['Beginner', 'Intermediate', 'Advanced'];
    const averageDifficultyLabel = difficultyLabels[Math.round(averageDifficulty) - 1] || 'Intermediate';
    
    const result = {
      totalGuides: guides.length,
      totalContexts,
      totalPhrases,
      averageDifficulty: averageDifficultyLabel,
      professionalAreas: Array.from(allProfessionalAreas)
    };
    
    console.log('getGrammarStats: result:', result);
    return result;
    
  } catch (error) {
    console.error('Error in getGrammarStats:', error);
    // Return default values on error
    return {
      totalGuides: 0,
      totalContexts: 0,
      totalPhrases: 0,
      averageDifficulty: 'Intermediate',
      professionalAreas: []
    };
  }
}

/**
 * Get grammar guide by category
 */
export async function getGrammarByCategory(category: string): Promise<GrammarList[]> {
  const guides = await loadAllGrammarGuides();
  return guides.filter(guide => guide.category === category);
}

/**
 * Get grammar guide by difficulty
 */
export async function getGrammarByDifficulty(difficulty: string): Promise<GrammarList[]> {
  const guides = await loadAllGrammarGuides();
  return guides.filter(guide => guide.difficulty.toLowerCase() === difficulty.toLowerCase());
}

/**
 * Test function to verify grammar data loading
 */
export async function testGrammarDataLoading(): Promise<{
  success: boolean;
  guidesLoaded: number;
  errors: string[];
  details: unknown;
}> {
  console.log('🧪 Testing grammar data loading...');
  
  const errors: string[] = [];
  const details: Record<string, unknown> = {};
  
  try {
    // Test 1: Load all guides
    const guides = await loadAllGrammarGuides();
    details.guides = guides;
    details.guidesCount = guides.length;
    
    if (guides.length === 0) {
      errors.push('No grammar guides were loaded');
    }
    
    // Test 2: Load stats
    const stats = await getGrammarStats();
    details.stats = stats;
    
    // Test 3: Test individual guide loading
    if (guides.length > 0) {
      const firstGuide = guides[0];
      const individualGuide = await loadGrammarGuide(firstGuide.id);
      details.individualGuide = individualGuide;
      
      if (!individualGuide) {
        errors.push(`Failed to load individual guide: ${firstGuide.id}`);
      }
    }
    
    // Test 4: Test direct file access
    try {
      const testResponse = await fetch('/json/grammar/basic-structure/adjectives_grammar.json');
      details.directAccess = {
        status: testResponse.status,
        ok: testResponse.ok,
        statusText: testResponse.statusText
      };
      
      if (!testResponse.ok) {
        errors.push(`Direct file access failed: ${testResponse.status} - ${testResponse.statusText}`);
      }
    } catch (error) {
      errors.push(`Direct file access error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    const success = errors.length === 0;
    
    console.log('🧪 Grammar data test completed:', { success, errors, details });
    
    return {
      success,
      guidesLoaded: guides.length,
      errors,
      details
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Test execution error: ${errorMessage}`);
    
    console.error('🧪 Grammar data test failed:', error);
    
    return {
      success: false,
      guidesLoaded: 0,
      errors,
      details: { error: errorMessage }
    };
  }
} 