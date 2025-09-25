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
  
  // ============================================================================
  // MAIN TRANSFORMATION METHOD
  // ============================================================================
  
  /**
   * Transform legacy grammar guide to unified format
   */
  static transformLegacyGuide(legacyGuide: LegacyGrammarGuide, guideId: string): GrammarGuide {
    const concepts: GrammarConcept[] = [];
    const contexts: GrammarContext[] = [];
    
    // Transform basic concepts
    if ((legacyGuide as any).basic_concepts) {
      concepts.push({
        id: 'basic-concepts',
        title: 'Basic Concepts',
        definition: (legacyGuide as any).basic_concepts.definition || '',
        examples: this.transformBasicConcepts((legacyGuide as any).basic_concepts),
        rules: (legacyGuide as any).basic_concepts.key_functions || (legacyGuide as any).basic_concepts.formation_rules?.map((rule: unknown) => (rule as { rule: string }).rule) || [],
        relatedConcepts: []
      });
    }
    
    // Transform all context types
    this.transformAllContexts(legacyGuide, guideId, contexts);
    
    // Determine category based on guide ID
    const category = this.determineCategory(guideId) || 'basic-structure';
    
    // Calculate metadata with error handling
    const metadata = this.calculateMetadata(contexts, category, legacyGuide);
    
    return {
      id: guideId,
      title: (legacyGuide as any).title,
      description: (legacyGuide as any).description,
      version: (legacyGuide as any).version || '1.0',
      createdDate: (legacyGuide as any).created_date || new Date().toISOString(),
      concepts,
      contexts,
      metadata,
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

  // ============================================================================
  // CONTEXT TRANSFORMATION METHODS
  // ============================================================================
  
  /**
   * Transform all context types from legacy guide
   */
  private static transformAllContexts(legacyGuide: LegacyGrammarGuide, guideId: string, contexts: GrammarContext[]): void {
    // Professional contexts
    if ((legacyGuide as any).professional_contexts) {
      Object.entries((legacyGuide as any).professional_contexts).forEach(([contextKey, context]) => {
        contexts.push(this.transformProfessionalContext(context, contextKey));
      });
    }
    
    // Sections (for subject_predicate_grammar structure)
    if ((legacyGuide as any).sections) {
      (legacyGuide as any).sections.forEach((section: unknown, index: number) => {
        contexts.push(this.transformSection(section, `section-${index}`));
      });
    }
    
    // Categories (for prepositional_phrases structure - array format)
    if ((legacyGuide as any).categories && Array.isArray((legacyGuide as any).categories)) {
      (legacyGuide as any).categories.forEach((category: unknown, index: number) => {
        contexts.push(this.transformCategory(category, `category-${index}`));
      });
    }
    
    // Professional vocabulary (for verbs_grammar structure)
    if ((legacyGuide as any).professional_vocabulary) {
      Object.entries((legacyGuide as any).professional_vocabulary).forEach(([vocabKey, vocab]) => {
        contexts.push(this.transformProfessionalVocabulary(vocab, vocabKey));
      });
    }
    
    // Cause-effect categories
    if ((legacyGuide as any).cause_effect_categories) {
      Object.entries((legacyGuide as any).cause_effect_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformCauseEffectCategory(category, categoryKey));
      });
    }
    
    // Concepts categories (for concepts grammar structure - object format)
    if ((legacyGuide as any).categories && typeof (legacyGuide as any).categories === 'object' && !Array.isArray((legacyGuide as any).categories) && guideId.includes('concepts')) {
      Object.entries((legacyGuide as any).categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformConceptsCategory(category, categoryKey));
      });
    }
    
    // Problem categories
    if ((legacyGuide as any).problem_categories && guideId.includes('problems')) {
      Object.entries((legacyGuide as any).problem_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformProblemCategory(category, categoryKey));
      });
    }
    
    // Project management phases
    if ((legacyGuide as any).phases) {
      Object.entries((legacyGuide as any).phases).forEach(([phaseKey, phase]) => {
        contexts.push(this.transformConceptsPhase(phase, phaseKey));
      });
    }
    
    // Specialized areas
    if ((legacyGuide as any).specialized_areas) {
      Object.entries((legacyGuide as any).specialized_areas).forEach(([areaKey, area]) => {
        contexts.push(this.transformConceptsSpecializedArea(area, areaKey));
      });
    }
    
    // Software attributes
    if ((legacyGuide as any).software_attributes) {
      contexts.push(this.transformSoftwareAttributes((legacyGuide as any).software_attributes));
    }
    
    // Question categories (for questions grammar structure)
    if ((legacyGuide as any).question_categories && guideId.includes('questions')) {
      Object.entries((legacyGuide as any).question_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformQuestionCategory(category, categoryKey));
      });
    }
    
    // Verb conjugation categories
    if ((legacyGuide as any).conjugation_categories && guideId.includes('conjugation')) {
      Object.entries((legacyGuide as any).conjugation_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformVerbConjugationCategory(category, categoryKey));
      });
    }
    
               // Verb examples (for verb conjugation guide)
           if ((legacyGuide as any).verb_examples && guideId.includes('conjugation')) {
             contexts.push(this.transformVerbExamples((legacyGuide as any).verb_examples));
           }
           
           // Interview guide structure (for interview preparation guide)
           if ((legacyGuide as any).guide_structure && guideId.includes('interview')) {
             Object.entries((legacyGuide as any).guide_structure).forEach(([categoryKey, category]) => {
               contexts.push(this.transformInterviewCategory(category, categoryKey));
             });
           }
           
           // Interview Q&A (for simple interview format)
           if ((legacyGuide as any).questions_and_answers && guideId.includes('interview')) {
             contexts.push(this.transformInterviewQA((legacyGuide as any).questions_and_answers));
           }
         }
  
  /**
   * Transform professional context to unified format
   */
  private static transformProfessionalContext(context: unknown, contextKey: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    // Transform phrases
    if ((context as { phrases?: unknown[] }).phrases) {
      (context as { phrases: unknown[] }).phrases.forEach((phrase: unknown, index: number) => {
        content.push({
          id: `phrase-${index}`,
          type: 'phrase',
          text: (phrase as { phrase?: string; text?: string }).phrase || (phrase as { phrase?: string; text?: string }).text || '',
          context: (phrase as { context?: string }).context || 'professional context',
          meaning: (phrase as { meaning?: string; description?: string }).meaning || (phrase as { meaning?: string; description?: string }).description || 'professional phrase',
          tags: (phrase as { tags?: string[] }).tags || [],
          difficulty: 'intermediate'
        });
      });
    }
    
    // Transform sentences (for conditional grammar structure)
    if ((context as any).sentences) {
      this.transformSentences((context as any).sentences, content);
    }
    
    // Transform comparative adjectives
    if ((context as any).comparative_adjectives) {
      this.transformComparativeAdjectives((context as any).comparative_adjectives, content);
    }
    
    // Transform superlative adjectives
    if ((context as any).superlative_adjectives) {
      this.transformSuperlativeAdjectives((context as any).superlative_adjectives, content);
    }
    
    // Handle other content types
    if ((context as any).content) {
      this.transformGenericContent((context as any).content, content);
    }
    
    return {
      id: contextKey,
      title: (context as any).title,
      description: (context as any).description,
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
  private static transformSection(section: unknown, sectionId: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    // Transform content items
    if ((section as any).content) {
      this.transformSectionContent((section as any).content, content);
    }
    
    // Transform questions
    if ((section as any).questions) {
      this.transformQuestions((section as any).questions, content);
    }
    
    // Transform sentences
    if ((section as any).sentences) {
      this.transformSectionSentences((section as any).sentences, content);
    }
    
    // Transform vocabulary examples
    if ((section as any).vocabulary_examples?.categories) {
      this.transformVocabularyExamples((section as any).vocabulary_examples.categories, content);
    }
    
    // Transform patterns
    if ((section as any).patterns) {
      this.transformPatterns((section as any).patterns, content);
    }
    
    return {
      id: sectionId,
      title: (section as any).title,
      description: (section as any).instructions || 'Grammar section',
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
  private static transformCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    if ((category as any).phrases) {
      (category as { phrases: unknown[] }).phrases.forEach((phrase: unknown, index: number) => {
        content.push({
          id: `phrase-${index}`,
          type: 'phrase',
          text: (phrase as any).phrase,
          context: (phrase as any).context,
          meaning: (phrase as any).example,
          tags: [(phrase as any).preposition],
          difficulty: 'intermediate'
        });
      });
    }
    
    return {
      id: categoryId,
      title: (category as any).title,
      description: (category as any).description,
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
  private static transformProfessionalVocabulary(vocab: unknown, vocabKey: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    if ((vocab as any).simple_verbs) {
      (vocab as any).simple_verbs.forEach((verb: string, index: number) => {
        content.push({
          id: `simple-verb-${index}`,
          type: 'phrase',
          text: verb,
          context: vocabKey,
          difficulty: 'intermediate'
        });
      });
    }
    
    if ((vocab as any).compound_verbs) {
      (vocab as any).compound_verbs.forEach((verb: string, index: number) => {
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
   * Transform cause-effect category to unified format
   */
  private static transformCauseEffectCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if ((category as any).verbs) {
      (category as { verbs: unknown[] }).verbs.forEach((verb: unknown, index: number) => {
        content.push({
          id: `verb-${index}`,
          type: 'phrase',
          text: (verb as any).verb || '',
          context: (verb as any).context || 'cause-effect',
          meaning: (verb as any).example || '',
          tags: (verb as any).related_areas || [],
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: categoryId,
      title: (category as any).title,
      description: (category as any).description,
      category: 'cause-effect',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }

  /**
   * Transform concepts category to unified format
   */
  private static transformConceptsCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if ((category as any).concepts) {
      (category as { concepts: unknown[] }).concepts.forEach((concept: unknown, index: number) => {
        content.push({
          id: `concept-${index}`,
          type: 'definition',
          text: (concept as any).concept || (concept as any).definition || '',
          context: categoryId,
          meaning: (concept as any).description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: categoryId,
      title: (category as any).title || categoryId,
      description: (category as any).description || '',
      category: 'concepts',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }

  /**
   * Transform concepts phase to unified format
   */
  private static transformConceptsPhase(phase: unknown, phaseId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if ((phase as any).phases) {
      (phase as { phases: unknown[] }).phases.forEach((subPhase: unknown, index: number) => {
        content.push({
          id: `phase-${index}`,
          type: 'definition',
          text: (subPhase as any).definition || '',
          context: phaseId,
          meaning: (subPhase as any).description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: phaseId,
      title: (phase as any).title,
      description: (phase as any).description,
      category: 'concepts',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }

  /**
   * Transform concepts specialized area to unified format
   */
  private static transformConceptsSpecializedArea(area: unknown, areaId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if ((area as any).specialized_areas) {
      (area as { specialized_areas: unknown[] }).specialized_areas.forEach((subArea: unknown, index: number) => {
        content.push({
          id: `specialized-area-${index}`,
          type: 'definition',
          text: (subArea as any).definition || '',
          context: areaId,
          meaning: (subArea as any).description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: areaId,
      title: (area as any).title,
      description: (area as any).description,
      category: 'concepts',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }
  
  /**
   * Transform problem category to unified format
   */
  private static transformProblemCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if ((category as any).problems) {
      (category as { problems: unknown[] }).problems.forEach((problem: unknown, index: number) => {
        content.push({
          id: `problem-${index}`,
          type: 'definition',
          text: (problem as any).problem || '',
          context: categoryId,
          meaning: (problem as any).description || '',
          difficulty: 'intermediate',
          tags: [(problem as any).impact, (problem as any).mitigation].filter(Boolean),
          metadata: {
            impact: (problem as any).impact,
            mitigation: (problem as any).mitigation
          }
        });
      });
    }

    return {
      id: categoryId,
      title: (category as any).title || categoryId,
      description: (category as any).description || '',
      category: 'problems',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }

  /**
   * Transform software attributes to unified format
   */
  private static transformSoftwareAttributes(attributes: unknown): GrammarContext {
    const content: GrammarContent[] = [];

    if ((attributes as any).attributes) {
      (attributes as { attributes: unknown[] }).attributes.forEach((attr: unknown, index: number) => {
        content.push({
          id: `attribute-${index}`,
          type: 'definition',
          text: (attr as any).definition || '',
          context: 'software attribute',
          meaning: (attr as any).description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: 'software-attributes',
      title: 'Software Attributes',
      description: 'Common software attributes and their definitions',
      category: 'cause-effect',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }

  /**
   * Transform question category to unified format
   */
  private static transformQuestionCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if ((category as { questions?: unknown[] }).questions) {
      (category as { questions: unknown[] }).questions.forEach((question: unknown, index: number) => {
        content.push({
          id: `question-${index}`,
          type: 'sentence',
          text: (question as any).question || '',
          context: categoryId,
          meaning: (question as any).description || '',
          difficulty: 'intermediate',
          tags: (question as any).related_areas || [],
          metadata: {
            importance: (question as any).importance,
            context: (question as any).context,
            relatedAreas: (question as any).related_areas
          }
        });
      });
    }

    return {
      id: categoryId,
      title: (category as any).title || categoryId,
      description: (category as any).description || '',
      category: 'questions',
      difficulty: 'intermediate',
      content,
      examples: content,
      metadata: {}
    };
  }

  // ============================================================================
  // CONTENT TRANSFORMATION HELPERS
  // ============================================================================
  
  /**
   * Transform basic concepts to unified format
   */
  private static transformBasicConcepts(basicConcepts: unknown): GrammarContent[] {
    const examples: GrammarContent[] = [];
    
    // Handle formation rules with examples
    if ((basicConcepts as any).formation_rules) {
      (basicConcepts as any).formation_rules.forEach((rule: unknown, index: number) => {
        const typedRule = rule as { examples?: string[]; rule?: string };
        if (typedRule.examples && Array.isArray(typedRule.examples)) {
          typedRule.examples.forEach((example: string, exIndex: number) => {
            examples.push({
              id: `rule-example-${index}-${exIndex}`,
              type: 'example',
              text: example,
              context: typedRule.rule || 'formation rule',
              meaning: `Example of ${typedRule.rule || 'formation rule'}`,
              difficulty: 'beginner'
            });
          });
        }
      });
    }
    
    // Handle simple examples array
    if ((basicConcepts as any).examples) {
      (basicConcepts as { examples: unknown[] }).examples.forEach((example: unknown, index: number) => {
        if (typeof example === 'string') {
          examples.push({
            id: `basic-example-${index}`,
            type: 'example',
            text: example,
            context: 'basic concept',
            difficulty: 'beginner'
          });
        } else if (typeof example === 'object' && example !== null) {
          const exampleObj = example as Record<string, any>;
          const key = Object.keys(exampleObj)[0];
          examples.push({
            id: `basic-example-${index}`,
            type: 'example',
            text: exampleObj[key] || '',
            meaning: exampleObj.description || '',
            context: 'basic concept',
            difficulty: 'beginner'
          });
        }
      });
    }
    
    return examples;
  }
  
  /**
   * Transform sentences with condition and consequence
   */
  private static transformSentences(sentences: unknown[], content: GrammarContent[]): void {
    sentences.forEach((sentence: unknown, index: number) => {
      const sentenceObj = sentence as any;
      content.push({
        id: `sentence-${index}`,
        type: 'sentence',
        text: sentenceObj.sentence || sentenceObj.text || '',
        context: sentenceObj.context || '',
        meaning: sentenceObj.meaning || sentenceObj.description || '',
        tags: [sentenceObj.conditional_type || 'conditional', sentenceObj.probability || ''],
        difficulty: 'intermediate'
      });
      
      // Add the condition and consequence as separate content items
      if (sentenceObj.condition) {
        content.push({
          id: `condition-${index}`,
          type: 'definition',
          text: sentenceObj.condition,
          context: 'condition',
          meaning: 'Condition part of conditional sentence',
          tags: ['condition', sentenceObj.conditional_type || 'conditional'],
          difficulty: 'intermediate'
        });
      }
      
      if (sentenceObj.consequence) {
        content.push({
          id: `consequence-${index}`,
          type: 'definition',
          text: sentenceObj.consequence,
          context: 'consequence',
          meaning: 'Consequence part of conditional sentence',
          tags: ['consequence', sentenceObj.conditional_type || 'conditional'],
          difficulty: 'intermediate'
        });
      }
    });
  }
  
  /**
   * Transform comparative adjectives
   */
  private static transformComparativeAdjectives(comparativeAdjectives: unknown[], content: GrammarContent[]): void {
    comparativeAdjectives.forEach((item: unknown, index: number) => {
      const itemObj = item as any;
      content.push({
        id: `comparative-${index}`,
        type: 'phrase',
        text: itemObj.phrase || '',
        context: itemObj.context || '',
        meaning: itemObj.meaning || '',
        tags: ['comparative', itemObj.adjective || ''],
        difficulty: 'intermediate'
      });
    });
  }
  
  /**
   * Transform superlative adjectives
   */
  private static transformSuperlativeAdjectives(superlativeAdjectives: unknown[], content: GrammarContent[]): void {
    superlativeAdjectives.forEach((item: unknown, index: number) => {
      const itemObj = item as any;
      content.push({
        id: `superlative-${index}`,
        type: 'phrase',
        text: itemObj.phrase || '',
        context: itemObj.context || '',
        meaning: itemObj.meaning || '',
        tags: ['superlative', itemObj.adjective || ''],
        difficulty: 'intermediate'
      });
    });
  }
  
  /**
   * Transform generic content
   */
  private static transformGenericContent(contentItems: unknown[], content: GrammarContent[]): void {
    contentItems.forEach((item: unknown, index: number) => {
      const itemObj = item as any;
      content.push({
        id: `content-${index}`,
        type: 'definition',
        text: itemObj.definition || itemObj.text || '',
        context: itemObj.concept || itemObj.context || '',
        meaning: itemObj.meaning || '',
        difficulty: 'intermediate'
      });
    });
  }
  
  /**
   * Transform section content
   */
  private static transformSectionContent(contentItems: unknown[], content: GrammarContent[]): void {
    contentItems.forEach((item: unknown, index: number) => {
      const itemObj = item as any;
      content.push({
        id: `content-${index}`,
        type: 'definition',
        text: itemObj.definition || '',
        context: itemObj.concept || '',
        difficulty: 'intermediate'
      });
      
      // Add examples
      if (itemObj.examples) {
        itemObj.examples.forEach((example: string, exIndex: number) => {
          content.push({
            id: `example-${index}-${exIndex}`,
            type: 'example',
            text: example,
            context: itemObj.concept || '',
            difficulty: 'intermediate'
          });
        });
      }
    });
  }
  
  /**
   * Transform verb examples
   */
  private static transformVerbExamples(verbExamples: unknown): GrammarContext {
    const content: GrammarContent[] = [];

    const verbExamplesObj = verbExamples as any;
    if (verbExamplesObj.verbs) {
      verbExamplesObj.verbs.forEach((verb: unknown, index: number) => {
        // Add the verb itself
        content.push({
          id: `verb-${index}`,
          type: 'example',
          text: (verb as any).infinitive,
          context: 'verb_examples',
          meaning: `Verb: ${(verb as any).infinitive}`,
          difficulty: 'intermediate',
          tags: [(verb as any).simple_past, (verb as any).past_participle, (verb as any).verb_ing],
          metadata: {
            simplePast: (verb as any).simple_past,
            pastParticiple: (verb as any).past_participle,
            verbIng: (verb as any).verb_ing,
            conjugations: (verb as any).conjugations
          }
        });

        // Add conjugations if they exist
        if ((verb as any).conjugations) {
          Object.entries((verb as any).conjugations).forEach(([tenseKey, conjugation]: [string, unknown]) => {
            const conjugationObj = conjugation as any;
            content.push({
              id: `verb-${index}-${tenseKey}`,
              type: 'sentence',
              text: `${conjugationObj.english} / ${conjugationObj.spanish}`,
              context: 'verb_examples',
              meaning: `${tenseKey}: ${conjugationObj.english}`,
              difficulty: 'intermediate',
              tags: [tenseKey, (verb as any).infinitive],
              metadata: {
                tense: tenseKey,
                english: conjugationObj.english,
                spanish: conjugationObj.spanish,
                verb: (verb as any).infinitive
              }
            });
          });
        }
      });
    }

    return {
      id: 'verb_examples',
      title: verbExamplesObj.title || 'Verb Examples',
      description: verbExamplesObj.description || 'Detailed verb conjugations',
      category: 'verb-conjugation',
      difficulty: 'intermediate',
      content,
      examples: [],
      metadata: {}
    };
  }

  /**
   * Transform interview category
   */
  private static transformInterviewCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];
    if ((category as any).questions) {
      (category as { questions: unknown[] }).questions.forEach((question: unknown, index: number) => {
        content.push({
          id: `question_${categoryId}_${index}`,
          type: 'example',
          text: (question as any).question || '',
          context: categoryId,
          meaning: (question as any).purpose || '',
          difficulty: (question as any).difficulty || 'intermediate',
          tags: [(question as any).category, (question as any).importance],
          metadata: {
            questionId: (question as any).id,
            category: (question as any).category,
            difficulty: (question as any).difficulty,
            importance: (question as any).importance,
            purpose: (question as any).purpose,
            sampleAnswer: (question as any).sample_answer,
            preparationTips: (question as any).preparation_tips
          }
        });
      });
    }
    return {
      id: categoryId,
      title: (category as any).title || categoryId,
      description: (category as any).description || '',
      category: 'interview',
      difficulty: 'intermediate',
      content,
      examples: [],
      metadata: {}
    };
  }
  
  /**
   * Transform interview Q&A
   */
  private static transformInterviewQA(qaData: unknown): GrammarContext {
    const content: GrammarContent[] = [];
    const qaDataObj = qaData as Record<string, any>;
    Object.entries(qaDataObj).forEach(([question, answers], index) => {
      content.push({
        id: `qa_${index}`,
        type: 'example',
        text: question,
        context: 'interview_qa',
        meaning: Array.isArray(answers) ? answers.join(' ') : String(answers),
        difficulty: 'intermediate',
        tags: ['interview', 'qa'],
        metadata: {
          question: question,
          answers: answers,
          answerCount: Array.isArray(answers) ? answers.length : 1
        }
      });
    });
    return {
      id: 'interview_qa',
      title: 'Interview Questions & Answers',
      description: 'Common interview questions with sample responses',
      category: 'interview',
      difficulty: 'intermediate',
      content,
      examples: [],
      metadata: {}
    };
  }

  /**
   * Transform verb conjugation category
   */
  private static transformVerbConjugationCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    // Transform forms (basic_forms category)
    if ((category as any).forms) {
      (category as { forms: unknown[] }).        forms.forEach((form: unknown, index: number) => {
          const formObj = form as any;
          content.push({
            id: `form-${index}`,
            type: 'example',
            text: formObj.form,
            context: categoryId,
            meaning: formObj.description,
          difficulty: 'intermediate',
          tags: [formObj.example]
        });
      });
    }

    // Transform tenses (simple_tenses, continuous_tenses, perfect_tenses, etc.)
    if ((category as any).tenses) {
      (category as { tenses: unknown[] }).        tenses.forEach((tense: unknown, index: number) => {
          const tenseObj = tense as any;
          content.push({
            id: `tense-${index}`,
            type: 'sentence',
            text: tenseObj.tense,
            context: categoryId,
            meaning: tenseObj.description,
          difficulty: 'intermediate',
          tags: [tenseObj.structure],
          metadata: {
            structure: tenseObj.structure,
            examples: tenseObj.examples
          }
        });
      });
    }

    // Transform modals (modal_verbs category)
    if ((category as any).modals) {
      (category as { modals: unknown[] }).        modals.forEach((modal: unknown, index: number) => {
          const modalObj = modal as any;
          content.push({
            id: `modal-${index}`,
            type: 'sentence',
            text: modalObj.modal,
            context: categoryId,
            meaning: modalObj.description,
          difficulty: 'intermediate',
          tags: modalObj.conjugations?.map((c: unknown) => (c as { tense: string }).tense) || [],
          metadata: {
            conjugations: modalObj.conjugations
          }
        });
      });
    }

    // Transform semi-modals
    if ((category as any).semi_modals) {
      (category as { semi_modals: unknown[] }).semi_modals.forEach((semiModal: unknown, index: number) => {
        const semiModalObj = semiModal as any;
        content.push({
          id: `semi-modal-${index}`,
          type: 'sentence',
          text: semiModalObj.semi_modal,
          context: categoryId,
          meaning: semiModalObj.description,
          difficulty: 'intermediate',
          tags: semiModalObj.conjugations?.map((c: unknown) => (c as { tense: string }).tense) || [],
          metadata: {
            conjugations: semiModalObj.conjugations
          }
        });
      });
    }

    return {
      id: categoryId,
      title: (category as any).title || categoryId,
      description: (category as any).description || '',
      category: 'verb-conjugation',
      difficulty: 'intermediate',
      content,
      examples: [], // Don't duplicate content in examples
      metadata: {}
    };
  }

  /**
   * Transform questions
   */
  private static transformQuestions(questions: unknown[], content: GrammarContent[]): void {
    questions.forEach((question: unknown, index: number) => {
      content.push({
        id: `question-${index}`,
        type: 'sentence',
        text: `${(question as any).question} ${(question as any).answer}`,
        context: 'practice',
        difficulty: 'intermediate'
      });
    });
  }
  
  /**
   * Transform section sentences
   */
  private static transformSectionSentences(sentences: string[], content: GrammarContent[]): void {
    sentences.forEach((sentence: string, index: number) => {
      content.push({
        id: `sentence-${index}`,
        type: 'sentence',
        text: sentence,
        context: 'practice',
        difficulty: 'intermediate'
      });
    });
  }
  
  /**
   * Transform vocabulary examples
   */
  private static transformVocabularyExamples(categories: unknown[], content: GrammarContent[]): void {
    categories.forEach((cat: unknown, catIndex: number) => {
      const catObj = cat as any;
      [...(catObj.explicit_subjects || []), ...(catObj.implicit_subjects || [])].forEach((example: string, exIndex: number) => {
        content.push({
          id: `vocab-${catIndex}-${exIndex}`,
          type: 'example',
          text: example,
          context: catObj.category,
          difficulty: 'intermediate'
        });
      });
    });
  }
  
  /**
   * Transform patterns
   */
  private static transformPatterns(patterns: unknown[], content: GrammarContent[]): void {
    patterns.forEach((pattern: unknown, index: number) => {
      const patternObj = pattern as any;
      content.push({
        id: `pattern-${index}`,
        type: 'pattern',
        text: patternObj.pattern,
        context: 'sentence-pattern',
        difficulty: 'intermediate'
      });
      
      // Add pattern examples
      patternObj.examples.forEach((example: string, exIndex: number) => {
        content.push({
          id: `pattern-example-${index}-${exIndex}`,
          type: 'example',
          text: example,
          context: patternObj.pattern,
          difficulty: 'intermediate'
        });
      });
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================
  
  /**
   * Transform individual phrase to unified format
   */
  private static transformPhrase(phrase: unknown, phraseId: string): GrammarContent {
    // Handle different phrase structures
    const text = (phrase as any).phrase || (phrase as any).clause || (phrase as any).adjective || 
                 (phrase as any).adverb || (phrase as any).conjunction || (phrase as any).noun || 
                 (phrase as any).verb || (phrase as any).preposition || (phrase as any).pronoun || 
                 (phrase as any).determiner || (phrase as any).sentence || '';
    
    const type = this.determineContentType(phrase);
    
    return {
      id: phraseId,
      type,
      text,
      context: (phrase as any).context || (phrase as any).clause_type || (phrase as any).type,
      meaning: (phrase as any).meaning || (phrase as any).description,
      difficulty: 'intermediate',
      tags: (phrase as any).tags || [],
      metadata: phrase as Record<string, unknown>
    };
  }
  
  /**
   * Determine content type based on phrase structure
   */
  private static determineContentType(phrase: unknown): 'phrase' | 'sentence' | 'example' | 'definition' | 'pattern' {
    if ((phrase as any).clause_type) return 'phrase';
    if ((phrase as any).sentence) return 'sentence';
    if ((phrase as any).example) return 'example';
    if ((phrase as any).definition) return 'definition';
    if ((phrase as any).pattern) return 'pattern';
    return 'phrase';
  }
  
  /**
   * Determine category based on guide ID
   */
  private static determineCategory(guideId: string): 'basic-structure' | 'complex-structure' | 'verb-conjugation' | 'specialized' | 'cause-effect' | 'concepts' | 'problems' | 'questions' | 'interview' {
    if (guideId.includes('cause_effect') || guideId.includes('cause-effect')) {
      return 'cause-effect';
    }
    
    if (guideId.includes('concepts')) {
      return 'concepts';
    }
    
    if (guideId.includes('problems')) {
      return 'problems';
    }
    
    if (guideId.includes('questions')) {
      return 'questions';
    }
    
    // Interview guides
    if (guideId.includes('interview')) {
      return 'interview';
    }
    
    // Verb conjugation guides (only the specific conjugation guide)
    if (guideId === 'verb_conjugation_guide') {
      return 'verb-conjugation';
    }
    
    // Basic structure guides
    if (guideId.includes('adverbs') || 
        guideId.includes('verbs') || 
        guideId.includes('adjectives') || 
        guideId.includes('nouns') || 
        guideId.includes('pronouns') || 
        guideId.includes('determinants') || 
        guideId.includes('prepositions') || 
        guideId.includes('conjunctions') ||
        guideId.includes('subject_predicate') ||
        guideId.includes('prepositional_phrases')) {
      return 'basic-structure';
    }
    
    if (guideId.includes('comparative') || guideId.includes('conditional') || 
        guideId.includes('indirect') || guideId.includes('modifiers') || 
        guideId.includes('passive') || guideId.includes('past_perfect') || 
        guideId.includes('present_perfect') || guideId.includes('subordinate')) {
      return 'complex-structure';
    }
    
    // Default to basic-structure for unknown guides
    return 'basic-structure';
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
  
  /**
   * Calculate metadata with error handling
   */
  private static calculateMetadata(contexts: GrammarContext[], category: 'basic-structure' | 'complex-structure' | 'verb-conjugation' | 'specialized' | 'cause-effect' | 'concepts' | 'problems' | 'questions' | 'interview', legacyGuide: unknown) {
    const totalContent = contexts.reduce((sum, context) => {
      try {
        return sum + ((context as any).content?.length || 0) + ((context as any).examples?.length || 0);
      } catch (error) {
        console.warn('Error calculating content length for context:', context?.id || 'unknown', error);
        return sum;
      }
    }, 0);
    
    const totalExercises = contexts.reduce((sum, context) => {
      try {
        return sum + ((context as any).exercises?.length || 0);
      } catch (error) {
        console.warn('Error calculating exercises length for context:', context?.id || 'unknown', error);
        return sum;
      }
    }, 0);
    
    return {
      difficulty: this.normalizeDifficulty((legacyGuide as any).metadata?.difficulty_level),
      category,
      totalContent,
      totalExercises,
      estimatedTime: this.calculateEstimatedTime(totalContent, totalExercises),
      professionalAreas: (legacyGuide as any).metadata?.professional_areas || [],
      tags: (legacyGuide as any).metadata?.tags || [],
      targetAudience: (legacyGuide as any).metadata?.target_audience || []
    };
  }
}
