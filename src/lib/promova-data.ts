import { VocabularyList, VocabularyWord } from '@/types';
import { getComprehensiveTranslation } from './comprehensive-promova-translations';

export interface PromovaVocabularyItem {
  word: string;
  description: string;
}

export interface PromovaVocabularyFile {
  title: string;
  concepts: PromovaVocabularyItem[];
}

// Load all Promova vocabulary files
export const loadPromovaVocabulary = async (): Promise<VocabularyList[]> => {
  try {
    console.log('Starting to load Promova vocabulary...');
    const vocabularyLists: VocabularyList[] = [];
    
    // Load all vocabulary list files (1-24 based on available files)
    for (let i = 1; i <= 24; i++) {
      try {
        console.log(`Attempting to load vocabulary_list_${i}.json...`);
        const response = await fetch(`/json/promova/vocabulary_list_${i}.json`);
        console.log(`Response for vocabulary_list_${i}.json:`, response.status, response.ok);
        
        if (response.ok) {
          const data: PromovaVocabularyFile = await response.json();
          console.log(`Successfully loaded vocabulary_list_${i}.json with ${data.concepts.length} concepts`);
          
          // Determine difficulty based on list number
          let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
          if (i > 15) difficulty = 'advanced';
          else if (i > 8) difficulty = 'intermediate';
          
          // Estimate time based on word count (2 minutes per word)
          const estimatedTime = Math.ceil(data.concepts.length * 2);
          
          // Generate tags based on content
          const tags = generateTags(data.concepts);
          
          vocabularyLists.push({
            id: `promova-${i}`,
            title: data.title,
            description: `Comprehensive vocabulary list with ${data.concepts.length} essential English words and phrases`,
            difficulty,
            category: 'promova',
            language: 'en',
            wordCount: data.concepts.length,
            estimatedTime,
            tags,
            createdAt: new Date(),
          });
        } else {
          console.warn(`Failed to load vocabulary_list_${i}.json: HTTP ${response.status}`);
        }
      } catch {
        // Only log warning for missing files, not for other errors
        console.warn(`Failed to load vocabulary_list_${i}.json`);
      }
    }
    
    // Return empty array if no lists were loaded
    if (vocabularyLists.length === 0) {
      console.warn('No Promova vocabulary lists were loaded successfully');
    }
    
    return vocabularyLists;
  } catch (error) {
    console.error('Error loading Promova vocabulary:', error);
    return [];
  }
};

// Load specific vocabulary list with words
export const loadPromovaVocabularyList = async (id: string): Promise<VocabularyList & { words: VocabularyWord[] } | null> => {
  try {
    console.log(`Loading vocabulary list: ${id}`);
    const listNumber = id.replace('promova-', '');
    console.log(`List number: ${listNumber}`);
    
    const url = `/json/promova/vocabulary_list_${listNumber}.json`;
    console.log(`Fetching from URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`Response status: ${response.status}, ok: ${response.ok}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load vocabulary list: HTTP ${response.status}`);
    }
    
    const data: PromovaVocabularyFile = await response.json();
    console.log(`Loaded data:`, data);
    console.log(`Number of concepts: ${data.concepts.length}`);
    
    // Determine difficulty based on list number
    let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    const num = parseInt(listNumber);
    if (num > 15) difficulty = 'advanced';
    else if (num > 8) difficulty = 'intermediate';
    
    console.log(`Processing ${data.concepts.length} concepts with difficulty: ${difficulty}`);
    
    // Convert concepts to VocabularyWord format with translations
    const words: VocabularyWord[] = await Promise.all(
      data.concepts.map(async (concept, index) => {
        console.log(`Processing concept ${index + 1}: ${concept.word}`);
        
        // Get immediate translation using comprehensive translation system
        const translation = getComprehensiveTranslation(concept.word);
        console.log(`Translation for "${concept.word}": ${translation}`);
        
        return {
          id: `${id}-word-${index + 1}`,
          listId: id,
          word: concept.word,
          translation, // Now includes Spanish translation
          partOfSpeech: detectPartOfSpeech(concept.word, concept.description),
          definition: concept.description,
          example: '', // Promova doesn't provide examples
          synonyms: [], // Promova doesn't provide synonyms
          pronunciation: '', // Promova doesn't provide pronunciation
          difficulty,
          difficultyRank: num,
          createdAt: new Date(),
        };
      })
    );
    
    const result = {
      id,
      title: data.title,
      description: `Comprehensive vocabulary list with ${data.concepts.length} essential English words and phrases`,
      difficulty,
      category: 'promova',
      language: 'en',
      wordCount: data.concepts.length,
      estimatedTime: Math.ceil(data.concepts.length * 2),
      tags: generateTags(data.concepts),
      createdAt: new Date(),
      words,
    };
    
    console.log(`Returning vocabulary list result:`, result);
    return result;
  } catch (error) {
    console.error('Error loading Promova vocabulary list:', error);
    return null;
  }
};

// Generate tags based on vocabulary content
function generateTags(concepts: PromovaVocabularyItem[]): string[] {
  const tags = new Set<string>();
  
  concepts.forEach(concept => {
    // Add common themes based on words
    if (concept.word.includes('business') || concept.word.includes('work')) {
      tags.add('business');
    }
    if (concept.word.includes('family') || concept.word.includes('parent')) {
      tags.add('family');
    }
    if (concept.word.includes('emotion') || concept.word.includes('feeling')) {
      tags.add('emotions');
    }
    if (concept.word.includes('car') || concept.word.includes('drive')) {
      tags.add('transportation');
    }
    if (concept.word.includes('time') || concept.word.includes('moment')) {
      tags.add('time');
    }
  });
  
  // Add default tags
  tags.add('promova');
  tags.add('essential');
  
  return Array.from(tags);
}

// Detect part of speech from word and description
function detectPartOfSpeech(word: string, description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.startsWith('to ') || desc.includes('to ')) return 'verb';
  if (desc.includes('a ') || desc.includes('an ')) return 'noun';
  if (desc.includes('very ') || desc.includes('extremely ')) return 'adjective';
  if (desc.includes('in a ') || desc.includes('with ')) return 'adverb';
  
  // Default to noun for most cases
  return 'noun';
}

// Search vocabulary across all lists
export const searchPromovaVocabulary = async (query: string): Promise<VocabularyWord[]> => {
  try {
    const allWords: VocabularyWord[] = [];
    
    // Search through all vocabulary lists
    for (let i = 2; i <= 24; i++) {
      try {
        const response = await fetch(`/json/promova/vocabulary_list_${i}.json`);
        if (response.ok) {
          const data: PromovaVocabularyFile = await response.json();
          
          const matchingConcepts = data.concepts.filter(concept =>
            concept.word.toLowerCase().includes(query.toLowerCase()) ||
            concept.description.toLowerCase().includes(query.toLowerCase())
          );
          
          if (matchingConcepts.length > 0) {
            let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
            if (i > 15) difficulty = 'advanced';
            else if (i > 8) difficulty = 'intermediate';
            
            const words = matchingConcepts.map((concept, index) => {
              // Get immediate translation using comprehensive translation system
              const translation = getComprehensiveTranslation(concept.word);
              
              return {
                id: `promova-${i}-word-${index + 1}`,
                listId: `promova-${i}`,
                word: concept.word,
                translation, // Now includes Spanish translation
                partOfSpeech: detectPartOfSpeech(concept.word, concept.description),
                definition: concept.description,
                example: '',
                synonyms: [],
                pronunciation: '',
                difficulty,
                difficultyRank: i,
                createdAt: new Date(),
              };
            });
            
            allWords.push(...words);
          }
        }
      } catch (error) {
        // Continue with next file
      }
    }
    
    return allWords;
  } catch (error) {
    console.error('Error searching Promova vocabulary:', error);
    return [];
  }
}; 