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
    // Check cache first
    if (this.isCacheValid(guideId)) {
      return this.cache.get(guideId)!;
    }
    
    try {
      // Determine the correct directory based on guide ID
      const directory = this.getGrammarDirectory(guideId);
      const url = `/json/grammar/${directory}/${guideId}.json`;
      
      console.log(`Loading grammar guide from: ${url}`);
      
      const response = await fetch(url);
      if (response.ok) {
        const legacyGuide: LegacyGrammarGuide = await response.json();
        
        // Transform to unified format
        const unifiedGuide = GrammarTransformer.transformLegacyGuide(legacyGuide, guideId);
        
        // Cache the result
        this.cache.set(guideId, unifiedGuide);
        this.cacheExpiry.set(guideId, Date.now() + this.CACHE_DURATION);
        
        return unifiedGuide;
      }
      
      console.warn(`Grammar guide ${guideId} not found at ${url}`);
      return null;
      
    } catch (error) {
      console.error(`Error loading grammar guide ${guideId}:`, error);
      return null;
    }
  }
  
  /**
   * Load all grammar guides
   */
  async loadAllGrammarGuides(): Promise<GrammarGuide[]> {
    const guideIds = [
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
    
    const guides: GrammarGuide[] = [];
    
    for (const guideId of guideIds) {
      const guide = await this.loadGrammarGuide(guideId);
      if (guide) {
        guides.push(guide);
      }
    }
    
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
      ...content.tags
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
      if (match.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
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
  private getGrammarDirectory(guideId: string): string {
    // Complex structure guides
    if (guideId.includes('comparative') || 
        guideId.includes('conditional') || 
        guideId.includes('indirect') || 
        guideId.includes('modifiers') || 
        guideId.includes('passive') || 
        guideId.includes('past_perfect') || 
        guideId.includes('present_perfect') || 
        guideId.includes('subordinate')) {
      return 'complex-structure';
    }
    
    // Verb conjugation guides
    if (guideId.includes('verbs') || guideId.includes('conjugation')) {
      return 'verb-conjugation';
    }
    
    // Basic structure guides (default)
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
