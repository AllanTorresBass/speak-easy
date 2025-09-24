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
    if (legacyGuide.basic_concepts) {
      concepts.push({
        id: 'basic-concepts',
        title: 'Basic Concepts',
        definition: legacyGuide.basic_concepts.definition || '',
        examples: this.transformBasicConcepts(legacyGuide.basic_concepts),
        rules: legacyGuide.basic_concepts.key_functions || legacyGuide.basic_concepts.formation_rules?.map((rule: unknown) => (rule as { rule: string }).rule) || [],
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
      title: legacyGuide.title,
      description: legacyGuide.description,
      version: legacyGuide.version,
      createdDate: legacyGuide.created_date,
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
    if (legacyGuide.professional_contexts) {
      Object.entries(legacyGuide.professional_contexts).forEach(([contextKey, context]) => {
        contexts.push(this.transformProfessionalContext(context, contextKey));
      });
    }
    
    // Sections (for subject_predicate_grammar structure)
    if (legacyGuide.sections) {
      legacyGuide.sections.forEach((section: unknown, index: number) => {
        contexts.push(this.transformSection(section, `section-${index}`));
      });
    }
    
    // Categories (for prepositional_phrases structure - array format)
    if (legacyGuide.categories && Array.isArray(legacyGuide.categories)) {
      legacyGuide.categories.forEach((category: unknown, index: number) => {
        contexts.push(this.transformCategory(category, `category-${index}`));
      });
    }
    
    // Professional vocabulary (for verbs_grammar structure)
    if (legacyGuide.professional_vocabulary) {
      Object.entries(legacyGuide.professional_vocabulary).forEach(([vocabKey, vocab]) => {
        contexts.push(this.transformProfessionalVocabulary(vocab, vocabKey));
      });
    }
    
    // Cause-effect categories
    if (legacyGuide.cause_effect_categories) {
      Object.entries(legacyGuide.cause_effect_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformCauseEffectCategory(category, categoryKey));
      });
    }
    
    // Concepts categories (for concepts grammar structure - object format)
    if (legacyGuide.categories && typeof legacyGuide.categories === 'object' && !Array.isArray(legacyGuide.categories) && guideId.includes('concepts')) {
      Object.entries(legacyGuide.categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformConceptsCategory(category, categoryKey));
      });
    }
    
    // Problem categories
    if (legacyGuide.problem_categories && guideId.includes('problems')) {
      Object.entries(legacyGuide.problem_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformProblemCategory(category, categoryKey));
      });
    }
    
    // Project management phases
    if (legacyGuide.phases) {
      Object.entries(legacyGuide.phases).forEach(([phaseKey, phase]) => {
        contexts.push(this.transformConceptsPhase(phase, phaseKey));
      });
    }
    
    // Specialized areas
    if (legacyGuide.specialized_areas) {
      Object.entries(legacyGuide.specialized_areas).forEach(([areaKey, area]) => {
        contexts.push(this.transformConceptsSpecializedArea(area, areaKey));
      });
    }
    
    // Software attributes
    if (legacyGuide.software_attributes) {
      contexts.push(this.transformSoftwareAttributes(legacyGuide.software_attributes));
    }
    
    // Question categories (for questions grammar structure)
    if (legacyGuide.question_categories && guideId.includes('questions')) {
      Object.entries(legacyGuide.question_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformQuestionCategory(category, categoryKey));
      });
    }
    
    // Verb conjugation categories
    if (legacyGuide.conjugation_categories && guideId.includes('conjugation')) {
      Object.entries(legacyGuide.conjugation_categories).forEach(([categoryKey, category]) => {
        contexts.push(this.transformVerbConjugationCategory(category, categoryKey));
      });
    }
    
               // Verb examples (for verb conjugation guide)
           if (legacyGuide.verb_examples && guideId.includes('conjugation')) {
             contexts.push(this.transformVerbExamples(legacyGuide.verb_examples));
           }
           
           // Interview guide structure (for interview preparation guide)
           if (legacyGuide.guide_structure && guideId.includes('interview')) {
             Object.entries(legacyGuide.guide_structure).forEach(([categoryKey, category]) => {
               contexts.push(this.transformInterviewCategory(category, categoryKey));
             });
           }
           
           // Interview Q&A (for simple interview format)
           if (legacyGuide.questions_and_answers && guideId.includes('interview')) {
             contexts.push(this.transformInterviewQA(legacyGuide.questions_and_answers));
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
    if (context.sentences) {
      this.transformSentences(context.sentences, content);
    }
    
    // Transform comparative adjectives
    if (context.comparative_adjectives) {
      this.transformComparativeAdjectives(context.comparative_adjectives, content);
    }
    
    // Transform superlative adjectives
    if (context.superlative_adjectives) {
      this.transformSuperlativeAdjectives(context.superlative_adjectives, content);
    }
    
    // Handle other content types
    if (context.content) {
      this.transformGenericContent(context.content, content);
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
  private static transformSection(section: unknown, sectionId: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    // Transform content items
    if (section.content) {
      this.transformSectionContent(section.content, content);
    }
    
    // Transform questions
    if (section.questions) {
      this.transformQuestions(section.questions, content);
    }
    
    // Transform sentences
    if (section.sentences) {
      this.transformSectionSentences(section.sentences, content);
    }
    
    // Transform vocabulary examples
    if (section.vocabulary_examples?.categories) {
      this.transformVocabularyExamples(section.vocabulary_examples.categories, content);
    }
    
    // Transform patterns
    if (section.patterns) {
      this.transformPatterns(section.patterns, content);
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
  private static transformCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];
    
    if (category.phrases) {
      (category as { phrases: unknown[] }).phrases.forEach((phrase: unknown, index: number) => {
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
  private static transformProfessionalVocabulary(vocab: unknown, vocabKey: string): GrammarContext {
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
   * Transform cause-effect category to unified format
   */
  private static transformCauseEffectCategory(category: unknown, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if (category.verbs) {
      (category as { verbs: unknown[] }).verbs.forEach((verb: unknown, index: number) => {
        content.push({
          id: `verb-${index}`,
          type: 'phrase',
          text: verb.verb || '',
          context: verb.context || 'cause-effect',
          meaning: verb.example || '',
          tags: verb.related_areas || [],
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: categoryId,
      title: category.title,
      description: category.description,
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

    if (category.concepts) {
      (category as { concepts: unknown[] }).concepts.forEach((concept: unknown, index: number) => {
        content.push({
          id: `concept-${index}`,
          type: 'definition',
          text: concept.concept || concept.definition || '',
          context: categoryId,
          meaning: concept.description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: categoryId,
      title: category.title || categoryId,
      description: category.description || '',
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

    if (phase.phases) {
      (phase as { phases: unknown[] }).phases.forEach((subPhase: unknown, index: number) => {
        content.push({
          id: `phase-${index}`,
          type: 'definition',
          text: subPhase.definition || '',
          context: phaseId,
          meaning: subPhase.description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: phaseId,
      title: phase.title,
      description: phase.description,
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

    if (area.specialized_areas) {
      (area as { specialized_areas: unknown[] }).specialized_areas.forEach((subArea: unknown, index: number) => {
        content.push({
          id: `specialized-area-${index}`,
          type: 'definition',
          text: subArea.definition || '',
          context: areaId,
          meaning: subArea.description || '',
          difficulty: 'intermediate'
        });
      });
    }

    return {
      id: areaId,
      title: area.title,
      description: area.description,
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

    if (category.problems) {
      (category as { problems: unknown[] }).problems.forEach((problem: unknown, index: number) => {
        content.push({
          id: `problem-${index}`,
          type: 'definition',
          text: problem.problem || '',
          context: categoryId,
          meaning: problem.description || '',
          difficulty: 'intermediate',
          tags: [problem.impact, problem.mitigation].filter(Boolean),
          metadata: {
            impact: problem.impact,
            mitigation: problem.mitigation
          }
        });
      });
    }

    return {
      id: categoryId,
      title: category.title || categoryId,
      description: category.description || '',
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

    if (attributes.attributes) {
      attributes.attributes.forEach((attr: any, index: number) => {
        content.push({
          id: `attribute-${index}`,
          type: 'definition',
          text: attr.definition || '',
          context: 'software attribute',
          meaning: attr.description || '',
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
  private static transformQuestionCategory(category: any, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    if (category.questions) {
      category.questions.forEach((question: any, index: number) => {
        content.push({
          id: `question-${index}`,
          type: 'sentence',
          text: question.question || '',
          context: categoryId,
          meaning: question.description || '',
          difficulty: 'intermediate',
          tags: question.related_areas || [],
          metadata: {
            importance: question.importance,
            context: question.context,
            relatedAreas: question.related_areas
          }
        });
      });
    }

    return {
      id: categoryId,
      title: category.title || categoryId,
      description: category.description || '',
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
  private static transformBasicConcepts(basicConcepts: any): GrammarContent[] {
    const examples: GrammarContent[] = [];
    
    // Handle formation rules with examples
    if (basicConcepts.formation_rules) {
      basicConcepts.formation_rules.forEach((rule: unknown, index: number) => {
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
   * Transform sentences with condition and consequence
   */
  private static transformSentences(sentences: any[], content: GrammarContent[]): void {
    sentences.forEach((sentence: any, index: number) => {
      content.push({
        id: `sentence-${index}`,
        type: 'sentence',
        text: sentence.sentence || sentence.text || '',
        context: sentence.context || '',
        meaning: sentence.meaning || sentence.description || '',
        tags: [sentence.conditional_type || 'conditional', sentence.probability || ''],
        difficulty: 'intermediate'
      });
      
      // Add the condition and consequence as separate content items
      if (sentence.condition) {
        content.push({
          id: `condition-${index}`,
          type: 'definition',
          text: sentence.condition,
          context: 'condition',
          meaning: 'Condition part of conditional sentence',
          tags: ['condition', sentence.conditional_type || 'conditional'],
          difficulty: 'intermediate'
        });
      }
      
      if (sentence.consequence) {
        content.push({
          id: `consequence-${index}`,
          type: 'definition',
          text: sentence.consequence,
          context: 'consequence',
          meaning: 'Consequence part of conditional sentence',
          tags: ['consequence', sentence.conditional_type || 'conditional'],
          difficulty: 'intermediate'
        });
      }
    });
  }
  
  /**
   * Transform comparative adjectives
   */
  private static transformComparativeAdjectives(comparativeAdjectives: any[], content: GrammarContent[]): void {
    comparativeAdjectives.forEach((item: any, index: number) => {
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
  
  /**
   * Transform superlative adjectives
   */
  private static transformSuperlativeAdjectives(superlativeAdjectives: any[], content: GrammarContent[]): void {
    superlativeAdjectives.forEach((item: any, index: number) => {
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
  
  /**
   * Transform generic content
   */
  private static transformGenericContent(contentItems: any[], content: GrammarContent[]): void {
    contentItems.forEach((item: any, index: number) => {
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
  
  /**
   * Transform section content
   */
  private static transformSectionContent(contentItems: any[], content: GrammarContent[]): void {
    contentItems.forEach((item: any, index: number) => {
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
  
  /**
   * Transform verb examples
   */
  private static transformVerbExamples(verbExamples: any): GrammarContext {
    const content: GrammarContent[] = [];

    if (verbExamples.verbs) {
      verbExamples.verbs.forEach((verb: any, index: number) => {
        // Add the verb itself
        content.push({
          id: `verb-${index}`,
          type: 'example',
          text: verb.infinitive,
          context: 'verb_examples',
          meaning: `Verb: ${verb.infinitive}`,
          difficulty: 'intermediate',
          tags: [verb.simple_past, verb.past_participle, verb.verb_ing],
          metadata: {
            simplePast: verb.simple_past,
            pastParticiple: verb.past_participle,
            verbIng: verb.verb_ing,
            conjugations: verb.conjugations
          }
        });

        // Add conjugations if they exist
        if (verb.conjugations) {
          Object.entries(verb.conjugations).forEach(([tenseKey, conjugation]: [string, any]) => {
            content.push({
              id: `verb-${index}-${tenseKey}`,
              type: 'sentence',
              text: `${conjugation.english} / ${conjugation.spanish}`,
              context: 'verb_examples',
              meaning: `${tenseKey}: ${conjugation.english}`,
              difficulty: 'intermediate',
              tags: [tenseKey, verb.infinitive],
              metadata: {
                tense: tenseKey,
                english: conjugation.english,
                spanish: conjugation.spanish,
                verb: verb.infinitive
              }
            });
          });
        }
      });
    }

    return {
      id: 'verb_examples',
      title: verbExamples.title || 'Verb Examples',
      description: verbExamples.description || 'Detailed verb conjugations',
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
  private static transformInterviewCategory(category: any, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];
    if (category.questions) {
      category.questions.forEach((question: any, index: number) => {
        content.push({
          id: `question_${categoryId}_${index}`,
          type: 'example',
          text: question.question || '',
          context: categoryId,
          meaning: question.purpose || '',
          difficulty: question.difficulty || 'intermediate',
          tags: [question.category, question.importance],
          metadata: {
            questionId: question.id,
            category: question.category,
            difficulty: question.difficulty,
            importance: question.importance,
            purpose: question.purpose,
            sampleAnswer: question.sample_answer,
            preparationTips: question.preparation_tips
          }
        });
      });
    }
    return {
      id: categoryId,
      title: category.title || categoryId,
      description: category.description || '',
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
  private static transformInterviewQA(qaData: any): GrammarContext {
    const content: GrammarContent[] = [];
    Object.entries(qaData).forEach(([question, answers], index) => {
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
  private static transformVerbConjugationCategory(category: any, categoryId: string): GrammarContext {
    const content: GrammarContent[] = [];

    // Transform forms (basic_forms category)
    if (category.forms) {
      category.forms.forEach((form: any, index: number) => {
        content.push({
          id: `form-${index}`,
          type: 'example',
          text: form.form,
          context: categoryId,
          meaning: form.description,
          difficulty: 'intermediate',
          tags: [form.example]
        });
      });
    }

    // Transform tenses (simple_tenses, continuous_tenses, perfect_tenses, etc.)
    if (category.tenses) {
      category.tenses.forEach((tense: any, index: number) => {
        content.push({
          id: `tense-${index}`,
          type: 'sentence',
          text: tense.tense,
          context: categoryId,
          meaning: tense.description,
          difficulty: 'intermediate',
          tags: [tense.structure],
          metadata: {
            structure: tense.structure,
            examples: tense.examples
          }
        });
      });
    }

    // Transform modals (modal_verbs category)
    if (category.modals) {
      category.modals.forEach((modal: any, index: number) => {
        content.push({
          id: `modal-${index}`,
          type: 'sentence',
          text: modal.modal,
          context: categoryId,
          meaning: modal.description,
          difficulty: 'intermediate',
          tags: modal.conjugations?.map((c: any) => c.tense) || [],
          metadata: {
            conjugations: modal.conjugations
          }
        });
      });
    }

    // Transform semi-modals
    if (category.semi_modals) {
      category.semi_modals.forEach((semiModal: any, index: number) => {
        content.push({
          id: `semi-modal-${index}`,
          type: 'sentence',
          text: semiModal.semi_modal,
          context: categoryId,
          meaning: semiModal.description,
          difficulty: 'intermediate',
          tags: semiModal.conjugations?.map((c: any) => c.tense) || [],
          metadata: {
            conjugations: semiModal.conjugations
          }
        });
      });
    }

    return {
      id: categoryId,
      title: category.title || categoryId,
      description: category.description || '',
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
  private static transformQuestions(questions: any[], content: GrammarContent[]): void {
    questions.forEach((question: any, index: number) => {
      content.push({
        id: `question-${index}`,
        type: 'sentence',
        text: `${question.question} ${question.answer}`,
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
  private static transformVocabularyExamples(categories: any[], content: GrammarContent[]): void {
    categories.forEach((cat: any, catIndex: number) => {
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
  
  /**
   * Transform patterns
   */
  private static transformPatterns(patterns: any[], content: GrammarContent[]): void {
    patterns.forEach((pattern: any, index: number) => {
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

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================
  
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
  private static calculateMetadata(contexts: GrammarContext[], category: 'basic-structure' | 'complex-structure' | 'verb-conjugation' | 'specialized' | 'cause-effect' | 'concepts' | 'problems' | 'questions' | 'interview', legacyGuide: any) {
    const totalContent = contexts.reduce((sum, context) => {
      try {
        return sum + (context.content?.length || 0) + (context.examples?.length || 0);
      } catch (error) {
        console.warn('Error calculating content length for context:', context?.id || 'unknown', error);
        return sum;
      }
    }, 0);
    
    const totalExercises = contexts.reduce((sum, context) => {
      try {
        return sum + (context.exercises?.length || 0);
      } catch (error) {
        console.warn('Error calculating exercises length for context:', context?.id || 'unknown', error);
        return sum;
      }
    }, 0);
    
    return {
      difficulty: this.normalizeDifficulty(legacyGuide.metadata?.difficulty_level),
      category,
      totalContent,
      totalExercises,
      estimatedTime: this.calculateEstimatedTime(totalContent, totalExercises),
      professionalAreas: legacyGuide.metadata?.professional_areas || [],
      tags: legacyGuide.metadata?.tags || [],
      targetAudience: legacyGuide.metadata?.target_audience || []
    };
  }
}
