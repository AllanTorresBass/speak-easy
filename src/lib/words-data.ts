// Define local interfaces for Words vocabulary
export interface WordsVocabularyItem {
  word: string;
  translated: string;
}

export interface WordsVocabularyList {
  title: string;
  concepts: WordsVocabularyItem[];
}

export async function loadWordsVocabularyList(listNumber: number): Promise<WordsVocabularyList | null> {
  try {
    const url = `/json/words/vocabulary_list_${listNumber}.json`;
    console.log('Fetching from URL:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    if (!response.ok) {
      console.warn(`Words vocabulary list ${listNumber} not found`);
      return null;
    }
    const data: WordsVocabularyList = await response.json();
    console.log('Loaded data:', data);
    return data;
  } catch (error) {
    console.error(`Error loading words vocabulary list ${listNumber}:`, error);
    return null;
  }
}

export async function loadWordsVocabularyListSimple(listNumber: number): Promise<WordsVocabularyList | null> {
  try {
    const response = await fetch(`/json/words/vocabulary_list_${listNumber}.json`);
    if (!response.ok) {
      return null;
    }
    const data: WordsVocabularyList = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function loadAllWordsVocabularyLists(): Promise<WordsVocabularyList[]> {
  const lists: WordsVocabularyList[] = [];
  
  // Load all vocabulary list files (1-25 based on available files)
  for (let i = 1; i <= 25; i++) {
    try {
      const list = await loadWordsVocabularyList(i);
      if (list) {
        lists.push(list);
      }
    } catch (error) {
      console.warn(`Failed to load words vocabulary list ${i}:`, error);
    }
  }
  
  return lists;
}

export async function searchWordsVocabulary(query: string): Promise<WordsVocabularyItem[]> {
  const results: WordsVocabularyItem[] = [];
  const lists = await loadAllWordsVocabularyLists();
  
  for (const list of lists) {
    const matches = list.concepts.filter(item =>
      item.word.toLowerCase().includes(query.toLowerCase()) ||
      item.translated.toLowerCase().includes(query.toLowerCase())
    );
    results.push(...matches);
  }
  
  return results;
}

export async function getWordsVocabularyStats(): Promise<{
  totalLists: number;
  totalWords: number;
  lists: Array<{ id: number; title: string; wordCount: number }>;
}> {
  const lists = await loadAllWordsVocabularyLists();
  const totalWords = lists.reduce((sum, list) => sum + list.concepts.length, 0);
  
  const listStats = lists.map(list => ({
    id: parseInt(list.title.match(/\d+/)?.[0] || '0'),
    title: list.title,
    wordCount: list.concepts.length
  }));
  
  return {
    totalLists: lists.length,
    totalWords,
    lists: listStats.sort((a, b) => a.id - b.id)
  };
} 