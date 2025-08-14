// Grammar Data Transformer
// Converts legacy grammar files to unified, type-safe format

import { 
  GrammarGuide, 
  GrammarContext, 
  GrammarContent, 
  GrammarConcept,
  LegacyGrammarGuide 
} from '@/types/grammar';

export class GrammarTransformer {
  
  /**
   * Transform legacy grammar guide to unified format
   */
  static transformLegacyGuide(legacyGuide: LegacyGrammarGuide, guideId: string): GrammarGuide {
    const concepts: GrammarConcept[] = [];
    const contexts: GrammarContext[] = [];
    
    // Transform basic concepts
    if (legacyGuide.basic_concepts) {
      concepts.push({
        id: 'basic-concepts',
        title: 'Basic Concepts',
        definition: legacyGuide.basic_concepts.definition || '',
        examples: this.transformBasicConcepts(legacyGuide.basic_concepts),
        rules: legacyGuide.basic_concepts.key_functions || legacyGuide.basic_concepts.formation_rules?.map((rule: any) => rule.rule) || [],
        relatedConcepts: []
      });
    }
    
    // Transform professional contexts
    if (legacyGuide.professional_contexts) {
      Object.entries(legacyGuide.professional_contexts).forEach(([contextKey, context]) => {
        contexts.push(this.transformProfessionalContext(context, contextKey));
      });
    }
    
    // Transform sections (for subject_predicate_grammar structure)
    if (legacyGuide.sections) {
      legacyGuide.sections.forEach((section, index) => {
        contexts.push(this.transformSection(section, `section-${index}`));
      });
    }
    
    // Transform categories (for prepositional_phrases structure)
    if (legacyGuide.categories) {
      legacyGuide.categories.forEach((category, index) => {
        contexts.push(this.transformCategory(category, `category-${index}`));
      });
    }
    
    // Transform professional vocabulary (for verbs_grammar structure)
    if (legacyGuide.professional_vocabulary) {
      Object.entries(legacyGuide.professional_vocabulary).forEach(([vocabKey, vocab]) => {
        contexts.push(this.transformProfessionalVocabulary(vocab, vocabKey));
      });
    }
    
    // Determine category based on guide ID
    const category = this.determineCategory(guideId);
    
    // Calculate metadata
    const totalContent = contexts.reduce((sum, context) => 
      sum + context.content.length + (context.examples?.length || 0), 0);
    
    const totalExercises = contexts.reduce((sum, context) => 
      sum + (context.exercises?.length || 0), 0);
    
    return {
      id: guideId,
      title: legacyGuide.title,
      description: legacyGuide.description,
      version: legacyGuide.version,
      createdDate: legacyGuide.created_date,
      concepts,
      contexts,
      metadata: {
        difficulty: this.normalizeDifficulty(legacyGuide.metadata?.difficulty_level),
        category,
        totalContent,
        totalExercises,
        estimatedTime: this.calculateEstimatedTime(totalContent, totalExercises),
        professionalAreas: legacyGuide.metadata?.professional_areas || [],
        tags: legacyGuide.metadata?.tags || [],
        targetAudience: legacyGuide.metadata?.target_audience || []
      },
      audioConfig: {
        defaultSpeed: 0.75,
        defaultPitch: 0.95,
        defaultVolume: 0.85,
        voiceQuality: 'standard',
        naturalPauses: true,
        emphasisSystem: true
      }
    };
  }
  
  /**
   * Transform basic concepts to unified format
   */
  private static transformBasicConcepts(basicConcepts: any): GrammarContent[] {
    const examples: GrammarContent[] = [];
    
    // Handle formation rules with examples
    if (basicConcepts.formation_rules) {
      basicConcepts.formation_rules.forEach((rule: any, index: number) => {
        if (rule.examples && Array.isArray(rule.examples)) {
          rule.examples.forEach((example: string, exIndex: number) => {
            examples.push({
              id: `rule-example-${index}-${exIndex}`,
              type: 'example',
              text: example,
              context: rule.rule || '',
              meaning: `Example of ${rule.rule}`,
              difficulty: 'beginner'
            });
          });
        }
      });
    }
    
    // Handle simple examples array
    if (basicConcepts.examples) {
      basicConcepts.examples.forEach((example: any, index: number) => {
        if (typeof example === 'string') {
          examples.push({
            id: `basic-example-${index}`,
            type: 'example',
            text: example,
            context: 'basic concept',
            difficulty: 'beginner'
          });
        } else if (typeof example === 'object') {
          const key = Object.keys(example)[0];
          examples.push({
            id: `basic-example-${index}`,
            type: 'example',
            text: example[key] || '',
            meaning: example.description || '',
            context: 'basic concept',
            difficulty: 'beginner'
          });
        }
      });
    }
    
    return examples;
  }
  
  /**
   * Transform professional context to unified format
   */
  private static transformProfessionalContext(context: any, contextKey: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    // Handle phrases array
    if (context.phrases) {
      context.phrases.forEach((phrase: any, index: number) => {
        content.push(this.transformPhrase(phrase, `phrase-${index}`));
      });
    }
    
    // Handle comparative adjectives
    if (context.comparative_adjectives) {
      context.comparative_adjectives.forEach((item: any, index: number) => {
        content.push({
          id: `comparative-${index}`,
          type: 'phrase',
          text: item.phrase || '',
          context: item.context || '',
          meaning: item.meaning || '',
          tags: ['comparative', item.adjective || ''],
          difficulty: 'intermediate'
        });
      });
    }
    
    // Handle superlative adjectives
    if (context.superlative_adjectives) {
      context.superlative_adjectives.forEach((item: any, index: number) => {
        content.push({
          id: `superlative-${index}`,
          type: 'phrase',
          text: item.phrase || '',
          context: item.context || '',
          meaning: item.meaning || '',
          tags: ['superlative', item.adjective || ''],
          difficulty: 'intermediate'
        });
      });
    }
    
    // Handle other content types
    if (context.content) {
      context.content.forEach((item: any, index: number) => {
        content.push({
          id: `content-${index}`,
          type: 'definition',
          text: item.definition || item.text || '',
          context: item.concept || item.context || '',
          meaning: item.meaning || '',
          difficulty: 'intermediate'
        });
      });
    }
    
    return {
      id: contextKey,
      title: context.title,
      description: context.description,
      category: 'professional',
      difficulty: 'intermediate',
      content,
      examples: content.filter(item => item.type === 'example'),
      metadata: {}
    };
  }
  
  /**
   * Transform section to unified format
   */
  private static transformSection(section: any, sectionId: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    // Transform content items
    if (section.content) {
      section.content.forEach((item: any, index: number) => {
        content.push({
          id: `content-${index}`,
          type: 'definition',
          text: item.definition || '',
          context: item.concept || '',
          difficulty: 'intermediate'
        });
        
        // Add examples
        if (item.examples) {
          item.examples.forEach((example: string, exIndex: number) => {
            content.push({
              id: `example-${index}-${exIndex}`,
              type: 'example',
              text: example,
              context: item.concept || '',
              difficulty: 'intermediate'
            });
          });
        }
      });
    }
    
    // Transform questions
    if (section.questions) {
      section.questions.forEach((question: any, index: number) => {
        content.push({
          id: `question-${index}`,
          type: 'sentence',
          text: `${question.question} ${question.answer}`,
          context: 'practice',
          difficulty: 'intermediate'
        });
      });
    }
    
    // Transform sentences
    if (section.sentences) {
      section.sentences.forEach((sentence: string, index: number) => {
        content.push({
          id: `sentence-${index}`,
          type: 'sentence',
          text: sentence,
          context: 'practice',
          difficulty: 'intermediate'
        });
      });
    }
    
    // Transform vocabulary examples
    if (section.vocabulary_examples?.categories) {
      section.vocabulary_examples.categories.forEach((cat: any, catIndex: number) => {
        [...(cat.explicit_subjects || []), ...(cat.implicit_subjects || [])].forEach((example: string, exIndex: number) => {
          content.push({
            id: `vocab-${catIndex}-${exIndex}`,
            type: 'example',
            text: example,
            context: cat.category,
            difficulty: 'intermediate'
          });
        });
      });
    }
    
    // Transform patterns
    if (section.patterns) {
      section.patterns.forEach((pattern: any, index: number) => {
        content.push({
          id: `pattern-${index}`,
          type: 'pattern',
          text: pattern.pattern,
          context: 'sentence-pattern',
          difficulty: 'intermediate'
        });
        
        // Add pattern examples
        pattern.examples.forEach((example: string, exIndex: number) => {
          content.push({
            id: `pattern-example-${index}-${exIndex}`,
            type: 'example',
            text: example,
            context: pattern.pattern,
            difficulty: 'intermediate'
          });
        });
      });
    }
    
    return {
      id: sectionId,
      title: section.title,
      description: section.instructions || 'Grammar section',
      category: 'grammar',
      difficulty: 'intermediate',
      content,
      examples: content.filter(item => item.type === 'example'),
      metadata: {}
    };
  }
  
  /**
   * Transform category to unified format
   */
  private static transformCategory(category: any, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    if (category.phrases) {
      category.phrases.forEach((phrase: any, index: number) => {
        content.push({
          id: `phrase-${index}`,
          type: 'phrase',
          text: phrase.phrase,
          context: phrase.context,
          meaning: phrase.example,
          tags: [phrase.preposition],
          difficulty: 'intermediate'
        });
      });
    }
    
    return {
      id: categoryId,
      title: category.title,
      description: category.description,
      category: 'prepositional',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }
  
  /**
   * Transform professional vocabulary to unified format
   */
  private static transformProfessionalVocabulary(vocab: any, vocabKey: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    if (vocab.simple_verbs) {
      vocab.simple_verbs.forEach((verb: string, index: number) => {
        content.push({
          id: `simple-verb-${index}`,
          type: 'phrase',
          text: verb,
          context: vocabKey,
          difficulty: 'intermediate'
        });
      });
    }
    
    if (vocab.compound_verbs) {
      vocab.compound_verbs.forEach((verb: string, index: number) => {
        content.push({
          id: `compound-verb-${index}`,
          type: 'phrase',
          text: verb,
          context: vocabKey,
          difficulty: 'intermediate'
        });
      });
    }
    
    return {
      id: vocabKey,
      title: `${vocabKey} Vocabulary`,
      description: `Professional ${vocabKey} vocabulary`,
      category: 'vocabulary',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }
  
  /**
   * Transform individual phrase to unified format
   */
  private static transformPhrase(phrase: any, phraseId: string): GrammarContent {
    // Handle different phrase structures
    const text = phrase.phrase || phrase.clause || phrase.adjective || 
                 phrase.adverb || phrase.conjunction || phrase.noun || 
                 phrase.verb || phrase.preposition || phrase.pronoun || 
                 phrase.determiner || phrase.sentence || '';
    
    const type = this.determineContentType(phrase);
    
    return {
      id: phraseId,
      type,
      text,
      context: phrase.context || phrase.clause_type || phrase.type,
      meaning: phrase.meaning || phrase.description,
      difficulty: 'intermediate',
      tags: phrase.tags || [],
      metadata: phrase
    };
  }
  
  /**
   * Determine content type based on phrase structure
   */
  private static determineContentType(phrase: any): 'phrase' | 'sentence' | 'example' | 'definition' | 'pattern' {
    if (phrase.clause_type) return 'phrase';
    if (phrase.sentence) return 'sentence';
    if (phrase.example) return 'example';
    if (phrase.definition) return 'definition';
    if (phrase.pattern) return 'pattern';
    return 'phrase';
  }
  
  /**
   * Determine category based on guide ID
   */
  private static determineCategory(guideId: string): 'basic-structure' | 'complex-structure' | 'verb-conjugation' | 'specialized' {
    if (guideId.includes('comparative') || guideId.includes('conditional') || 
        guideId.includes('indirect') || guideId.includes('modifiers') || 
        guideId.includes('passive') || guideId.includes('past_perfect') || 
        guideId.includes('present_perfect') || guideId.includes('subordinate')) {
      return 'complex-structure';
    }
    
    if (guideId.includes('verbs') || guideId.includes('conjugation')) {
      return 'verb-conjugation';
    }
    
    if (guideId.includes('subject') || guideId.includes('predicate') || 
        guideId.includes('adjectives') || guideId.includes('adverbs') ||
        guideId.includes('nouns') || guideId.includes('pronouns') ||
        guideId.includes('conjunctions') || guideId.includes('determiners') ||
        guideId.includes('prepositions')) {
      return 'basic-structure';
    }
    
    return 'specialized';
  }
  
  /**
   * Normalize difficulty level
   */
  private static normalizeDifficulty(difficulty?: string): 'beginner' | 'intermediate' | 'advanced' {
    if (!difficulty) return 'intermediate';
    
    const normalized = difficulty.toLowerCase();
    if (normalized.includes('beginner')) return 'beginner';
    if (normalized.includes('advanced')) return 'advanced';
    return 'intermediate';
  }
  
  /**
   * Calculate estimated time based on content
   */
  private static calculateEstimatedTime(totalContent: number, totalExercises: number): number {
    // Base time: 2 minutes per content item + 3 minutes per exercise
    return Math.max(15, Math.round((totalContent * 2 + totalExercises * 3) / 60));
  }
}
