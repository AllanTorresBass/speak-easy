'use client';

import React from 'react';
import { UnifiedGrammarGuide } from '@/components/grammar/unified-grammar-guide';

interface PageProps {
  params: Promise<{ guideId: string }>;
}

export default function GrammarGuidePage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const guideId = resolvedParams.guideId;
  
  return <UnifiedGrammarGuide guideId={guideId} />;
} 