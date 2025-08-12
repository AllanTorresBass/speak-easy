# Promova Vocabulary Integration

This document describes the integration of Promova vocabulary data into the SpeakEasy application.

## Overview

The integration provides access to 25 comprehensive vocabulary lists from Promova, containing essential English words and phrases organized by difficulty level.

## Features

### 1. Vocabulary Lists
- **25 vocabulary lists** with varying difficulty levels
- **Automatic difficulty detection** based on list number:
  - Lists 1-8: Beginner
  - Lists 9-15: Intermediate  
  - Lists 16-25: Advanced
- **Smart tagging** based on content analysis
- **Estimated study time** calculation (2 minutes per word)

### 2. Search Functionality
- **Cross-list search** across all Promova vocabulary
- **Real-time results** with word definitions
- **Filtering by part of speech** and difficulty
- **Direct navigation** to source vocabulary lists

### 3. Enhanced UI Components
- **PromovaVocabularyCard**: Specialized display for Promova lists
- **PromovaVocabularyDetail**: Detailed view of vocabulary lists
- **PromovaSearch**: Dedicated search interface
- **Visual indicators** for difficulty levels and categories

## File Structure

```
src/
├── lib/
│   └── promova-data.ts          # Data loading and processing
├── components/learning/
│   ├── promova-vocabulary-card.tsx    # List display component
│   ├── promova-vocabulary-detail.tsx  # Detail view component
│   └── promova-search.tsx             # Search component
├── app/vocabulary/
│   ├── [id]/page.tsx            # Dynamic vocabulary detail page
│   └── promova/page.tsx         # Promova search page
└── hooks/
    └── use-vocabulary.ts        # Updated to include Promova data
```

## Data Structure

### Promova JSON Format
```json
{
  "title": "English Vocabulary List - Part X",
  "concepts": [
    {
      "word": "example",
      "description": "Definition of the word"
    }
  ]
}
```

### Converted to App Format
```typescript
interface VocabularyList {
  id: string;           // "promova-1", "promova-2", etc.
  title: string;        // Original title from JSON
  description: string;  // Generated description
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;     // "promova"
  language: string;     // "en"
  wordCount: number;    // Number of concepts
  estimatedTime: number; // Study time in minutes
  tags: string[];       // Generated tags
  createdAt: Date;
}
```

## Usage

### 1. View All Vocabulary Lists
Navigate to `/vocabulary` to see all available lists, including Promova lists with special styling.

### 2. Search Promova Vocabulary
Visit `/vocabulary/promova` to search across all Promova vocabulary lists.

### 3. View Individual Lists
Click on any Promova list to see detailed word information and definitions.

### 4. Practice Mode
Use the practice functionality to study vocabulary from any list.

## Technical Implementation

### Data Loading
- **Dynamic loading** of JSON files from `/json/promova/` directory
- **Error handling** for missing or corrupted files
- **Fallback behavior** when data cannot be loaded

### Performance
- **Lazy loading** of vocabulary lists
- **Caching** through React Query
- **Optimized search** across multiple lists

### Integration Points
- **Existing vocabulary system** enhanced with Promova data
- **User progress tracking** compatible with Promova lists
- **Consistent UI/UX** with existing components

## Configuration

### Environment Variables
No additional environment variables required. The integration reads from the local JSON files.

### File Requirements
- JSON files must be placed in `/public/json/promova/`
- Files must follow the naming convention: `vocabulary_list_X.json`
- Files must contain valid JSON with the expected structure

## Future Enhancements

### Planned Features
- **Audio pronunciation** for vocabulary words
- **Spaced repetition** algorithms for Promova lists
- **Progress analytics** specific to Promova content
- **Export functionality** for offline study

### Potential Improvements
- **Machine learning** for better difficulty classification
- **User-generated content** and notes
- **Social features** for vocabulary sharing
- **Mobile app** synchronization

## Troubleshooting

### Common Issues

1. **No vocabulary lists appear**
   - Check that JSON files are in the correct directory
   - Verify file permissions and accessibility
   - Check browser console for error messages

2. **Search not working**
   - Ensure all vocabulary files are properly formatted
   - Check network requests in browser dev tools
   - Verify file paths are correct

3. **Performance issues**
   - Consider implementing pagination for large lists
   - Add loading states for better user experience
   - Implement virtual scrolling for long word lists

### Debug Information
Enable console logging to see detailed information about data loading and processing.

## Support

For issues or questions about the Promova integration, please refer to the main project documentation or create an issue in the project repository. 