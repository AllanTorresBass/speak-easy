import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { PromovaSearch } from '@/components/learning/promova-search';

export const metadata: Metadata = {
  title: 'Promova Vocabulary Search - SpeakEasy',
  description: 'Search across all 25 Promova vocabulary lists to find specific words, phrases, or concepts',
};

export default function PromovaVocabularyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <PromovaSearch />
      </div>
    </MainLayout>
  );
} 