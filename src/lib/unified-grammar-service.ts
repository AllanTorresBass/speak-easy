// Unified Grammar Service
// Provides a clean, consistent API for all grammar operations

import { 
  GrammarGuide, 
  GrammarContext, 
  GrammarContent, 
  GrammarSearchResult,
  LegacyGrammarGuide 
} from '@/types/grammar';
import { GrammarTransformer } from './grammar-transformer';

export class UnifiedGrammarService {
  private static instance: UnifiedGrammarService;
  private cache = new Map<string, GrammarGuide>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
  
  private constructor() {}
  
  static getInstance(): UnifiedGrammarService {
    if (!UnifiedGrammarService.instance) {
      UnifiedGrammarService.instance = new UnifiedGrammarService();
    }
    return UnifiedGrammarService.instance;
  }
  
  /**
   * Load a grammar guide with automatic transformation
   */
  async loadGrammarGuide(guideId: string): Promise<GrammarGuide | null> {
    try {
      // Check cache first
      const cached = this.getCachedGuide(guideId);
      if (cached) {
        console.log('Returning cached guide for:', guideId);
        return cached;
      }

      console.log('Loading grammar guide:', guideId);
      const url = `/api/grammar/${guideId}?t=${Date.now()}`;
      
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error(`Failed to fetch grammar guide ${guideId}:`, response.status, response.statusText);
        return null;
      }

      const guide = await response.json() as GrammarGuide;
      console.log('Guide received:', guide.title, 'with', guide.contexts.length, 'contexts');
      
      // Cache the result
      this.cache.set(guideId, guide);
      this.cacheExpiry.set(guideId, Date.now() + this.CACHE_DURATION);
      
      return guide;
    } catch (error) {
      console.error('Error loading grammar guide:', error);
      return null;
    }
  }
  
  /**
   * Load all grammar guides with rate limiting
   */
  async loadAllGrammarGuides(): Promise<GrammarGuide[]> {
    const guideIds = [
      // Basic Structure
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
      // Complex Structure
      'comparative_superlative_grammar',
      'conditional_grammar',
      'indirect_questions_grammar',
      'modifiers_grammar',
      'passive_voice_grammar',
      'past_perfect_grammar',
      'present_perfect_continuous_grammar',
      'present_perfect_grammar',
      'subordinate_clauses_grammar',
      // Cause-Effect
      'software_development_cause_effect',
      'ux_design_cause_effect',
      // Concepts
      'database_improvement_concepts',
      'phrases_concepts',
      'project_management_concepts',
      'soft_skills_concepts',
      'software_development_concepts',
      'ui_concepts',
      'ui_ux_principles',
      'ux_concepts',
      // Problems
      'software_development_problems',
      // Questions
      'software_development_questions',
          // Verb Conjugation
    'verb_conjugation_guide',
    // Interview
    'interview_preparation_guide',
    'interview_qa_simple'
  ];
    
    const guides: GrammarGuide[] = [];
    
    // Load guides in batches to prevent overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < guideIds.length; i += batchSize) {
      const batch = guideIds.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (guideId) => {
        try {
          console.log(`Attempting to load guide: ${guideId}`);
          const guide = await this.loadGrammarGuide(guideId);
          if (guide) {
            guides.push(guide);
            console.log(`Successfully loaded guide: ${guideId}`);
          } else {
            console.warn(`Failed to load guide: ${guideId} - returned null`);
          }
        } catch (error) {
          console.error(`Error loading guide ${guideId}:`, error);
        }
      }));
      
      // Small delay between batches
      if (i + batchSize < guideIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Successfully loaded ${guides.length} out of ${guideIds.length} guides`);
    return guides;
  }
  
  /**
   * Search across all grammar content
   */
  async searchGrammarContent(query: string): Promise<GrammarSearchResult[]> {
    const guides = await this.loadAllGrammarGuides();
    const results: GrammarSearchResult[] = [];
    
    for (const guide of guides) {
      for (const context of guide.contexts) {
        const matches: GrammarContent[] = [];
        
        // Search in content
        for (const content of context.content) {
          if (this.matchesSearch(content, query)) {
            matches.push(content);
          }
        }
        
        // Search in examples
        if (context.examples) {
          for (const example of context.examples) {
            if (this.matchesSearch(example, query)) {
              matches.push(example);
            }
          }
        }
        
        if (matches.length > 0) {
          results.push({
            guide,
            context,
            content: matches,
            relevance: this.calculateRelevance(query, matches),
            matchType: this.determineMatchType(query, matches)
          });
        }
      }
    }
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }
  
  /**
   * Get grammar statistics
   */
  async getGrammarStats(): Promise<{
    totalGuides: number;
    totalContexts: number;
    totalContent: number;
    totalExercises: number;
    averageDifficulty: string;
    professionalAreas: string[];
    categories: Record<string, number>;
  }> {
    const guides = await this.loadAllGrammarGuides();
    
    let totalContexts = 0;
    let totalContent = 0;
    let totalExercises = 0;
    const allProfessionalAreas = new Set<string>();
    const categories: Record<string, number> = {};
    
    guides.forEach(guide => {
      totalContexts += guide.contexts.length;
      totalContent += guide.metadata.totalContent;
      totalExercises += guide.metadata.totalExercises;
      
      guide.metadata.professionalAreas.forEach(area => allProfessionalAreas.add(area));
      
      const category = guide.metadata.category;
      categories[category] = (categories[category] || 0) + 1;
    });
    
    const averageDifficulty = guides.length > 0 
      ? this.calculateAverageDifficulty(guides)
      : 'intermediate';
    
    return {
      totalGuides: guides.length,
      totalContexts,
      totalContent,
      totalExercises,
      averageDifficulty,
      professionalAreas: Array.from(allProfessionalAreas),
      categories
    };
  }
  
  /**
   * Get guides by category
   */
  async getGuidesByCategory(category: string): Promise<GrammarGuide[]> {
    const guides = await this.loadAllGrammarGuides();
    return guides.filter(guide => guide.metadata.category === category);
  }
  
  /**
   * Get guides by difficulty
   */
  async getGuidesByDifficulty(difficulty: string): Promise<GrammarGuide[]> {
    const guides = await this.loadAllGrammarGuides();
    return guides.filter(guide => guide.metadata.difficulty === difficulty);
  }
  
  /**
   * Get guides by professional area
   */
  async getGuidesByProfessionalArea(area: string): Promise<GrammarGuide[]> {
    const guides = await this.loadAllGrammarGuides();
    return guides.filter(guide => 
      guide.metadata.professionalAreas.includes(area)
    );
  }
  
  /**
   * Get related content
   */
  async getRelatedContent(contentId: string, guideId: string): Promise<GrammarContent[]> {
    const guide = await this.loadGrammarGuide(guideId);
    if (!guide) return [];
    
    const related: GrammarContent[] = [];
    
    for (const context of guide.contexts) {
      for (const content of context.content) {
        if (content.id !== contentId && this.isRelated(content, contentId)) {
          related.push(content);
        }
      }
    }
    
    return related.slice(0, 5); // Return top 5 related items
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
  
  /**
   * Check if cache is valid
   */
  private isCacheValid(guideId: string): boolean {
    const expiry = this.cacheExpiry.get(guideId);
    return expiry ? Date.now() < expiry : false;
  }
  
  /**
   * Check if content matches search query
   */
  private matchesSearch(content: GrammarContent, query: string): boolean {
    const searchableText = [
      content.text,
      content.context,
      content.meaning,
      content.translation,
      ...(content.tags || [])
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchableText.includes(query.toLowerCase());
  }
  
  /**
   * Calculate search relevance
   */
  private calculateRelevance(query: string, matches: GrammarContent[]): number {
    let relevance = 0;
    
    for (const match of matches) {
      let matchScore = 0;
      
      // Exact text match gets highest score
      if (match.text.toLowerCase().includes(query.toLowerCase())) {
        matchScore += 10;
      }
      
      // Context match gets medium score
      if (match.context?.toLowerCase().includes(query.toLowerCase())) {
        matchScore += 5;
      }
      
      // Tag match gets lower score
      if (match.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
        matchScore += 3;
      }
      
      relevance += matchScore;
    }
    
    return relevance;
  }
  
  /**
   * Determine match type
   */
  private determineMatchType(query: string, matches: GrammarContent[]): 'exact' | 'partial' | 'related' {
    for (const match of matches) {
      if (match.text.toLowerCase() === query.toLowerCase()) {
        return 'exact';
      }
    }
    
    for (const match of matches) {
      if (match.text.toLowerCase().includes(query.toLowerCase())) {
        return 'partial';
      }
    }
    
    return 'related';
  }
  
  /**
   * Calculate average difficulty
   */
  private calculateAverageDifficulty(guides: GrammarGuide[]): string {
    const difficultyMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    
    const total = guides.reduce((sum, guide) => 
      sum + difficultyMap[guide.metadata.difficulty], 0);
    
    const average = total / guides.length;
    
    if (average < 1.5) return 'beginner';
    if (average < 2.5) return 'intermediate';
    return 'advanced';
  }
  
  /**
   * Check if content is related
   */
  private isRelated(content: GrammarContent, contentId: string): boolean {
    // Simple relatedness check - could be enhanced with more sophisticated logic
    return content.type === 'example' || content.type === 'definition';
  }

  /**
   * Determine the correct directory for a grammar guide
   */
  public getGrammarDirectory(guideId: string): string {
    console.log('Determining directory for guideId:', guideId);
    
    // Cause-effect guides
    if (guideId.includes('cause_effect') || guideId.includes('cause-effect')) {
      console.log('Detected cause-effect guide, returning cause-effect directory');
      return 'cause-effect';
    }
    
    // Concepts guides
    if (guideId.includes('concepts')) {
      console.log('Detected concepts guide, returning concepts directory');
      return 'concepts';
    }
    
    // Verb conjugation guides (only the specific conjugation guide)
    if (guideId === 'verb_conjugation_guide') {
      console.log('Detected verb conjugation guide, returning verb-conjugation directory');
      return 'verb-conjugation';
    }
    
    // Basic structure guides
    if (guideId.includes('adjectives') || 
        guideId.includes('adverbs') || 
        guideId.includes('advanced_sentences') || 
        guideId.includes('nouns') || 
        guideId.includes('pronouns') || 
        guideId.includes('determinants') || 
        guideId.includes('prepositions') || 
        guideId.includes('conjunctions') ||
        guideId.includes('subject_predicate') ||
        guideId.includes('prepositional_phrases')) {
      console.log('Detected basic structure guide, returning basic-structure directory');
      return 'basic-structure';
    }
    
    // Complex structure guides
    if (guideId.includes('comparative') || 
        guideId.includes('conditional') || 
        guideId.includes('indirect') || 
        guideId.includes('modifiers') || 
        guideId.includes('passive') || 
        guideId.includes('past_perfect') || 
        guideId.includes('present_perfect') || 
        guideId.includes('subordinate')) {
      console.log('Detected complex structure guide, returning complex-structure directory');
      return 'complex-structure';
    }
    
    // Default to basic-structure for unknown guides
    console.log('No specific directory detected, defaulting to basic-structure');
    return 'basic-structure';
  }

  /**
   * Get cached grammar guide if available
   */
  getCachedGuide(guideId: string): GrammarGuide | null {
    if (this.isCacheValid(guideId)) {
      return this.cache.get(guideId) || null;
    }
    return null;
  }
}
