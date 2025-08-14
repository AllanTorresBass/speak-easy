import { NextRequest, NextResponse } from 'next/server';
import { GrammarTransformer } from '@/lib/grammar-transformer';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guideId: string }> }
) {
  try {
    const { guideId } = await params;
    
    console.log('API Route: Loading guide:', guideId);
    
    // Determine the directory based on the guide ID
    let directory = 'basic-structure';
    if (guideId.includes('questions')) {
      directory = 'questions';
    } else if (guideId.includes('conditional') || guideId.includes('passive') || guideId.includes('perfect') || guideId.includes('clauses') || guideId.includes('modifiers')) {
      directory = 'complex-structure';
    } else if (guideId.includes('cause_effect')) {
      directory = 'cause-effect';
    } else if (guideId.includes('concepts')) {
      directory = 'concepts';
               } else if (guideId.includes('conjugation')) {
             directory = 'verb-conjugation';
           } else if (guideId.includes('interview')) {
             directory = 'interview';
           } else if (guideId.includes('problems')) {
             directory = 'problems';
           }
    
    console.log('API Route: Determined directory:', directory);
    
    const filePath = path.join(process.cwd(), 'public', 'json', 'grammar', directory, `${guideId}.json`);
    console.log('API Route: Full file path:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
      console.log('API Route: File exists and is accessible');
    } catch (accessError) {
      console.error('API Route: File access error:', accessError);
      return NextResponse.json(
        { error: `File not accessible: ${filePath}` },
        { status: 404 }
      );
    }
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      console.log('API Route: File read successfully, size:', fileContent.length);
      
      const data = JSON.parse(fileContent);
      console.log('API Route: JSON parsed successfully, title:', data.title);
      
      const guide = GrammarTransformer.transformLegacyGuide(data, guideId);
      
      if (!guide) {
        console.error('API Route: Transformation failed');
        return NextResponse.json(
          { error: 'Failed to transform grammar guide' },
          { status: 500 }
        );
      }
      
      console.log('API Route: Transformation successful, contexts:', guide.contexts.length);
      return NextResponse.json(guide);
    } catch (fileError) {
      console.error('API Route: Error reading or parsing grammar file:', fileError);
      return NextResponse.json(
        { error: 'Grammar guide not found or invalid' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('API Route: Error loading grammar guide:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
