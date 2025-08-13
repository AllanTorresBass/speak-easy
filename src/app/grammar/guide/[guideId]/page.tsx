'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Target, 
  Brain, 
  GraduationCap,
  Users,
  FileText,
  Lightbulb,
  ArrowLeft,
  BookMarked,
  Star,
  Clock,
  Calendar,
  Tag,
  Info,
  Eye,
  EyeOff,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { loadGrammarGuide, GrammarGuide } from '@/lib/grammar-data';
import { audioPronunciation } from '@/lib/audio-pronunciation';
import { getDifficultyColor } from '@/lib/hydration-safe';

interface PageProps {
  params: Promise<{ guideId: string }>;
}

export default function GrammarGuidePage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const guideId = resolvedParams.guideId;
  
  const [grammarGuide, setGrammarGuide] = useState<GrammarGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showExamples, setShowExamples] = useState<{ [key: string]: boolean }>({});
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setLoading(true);
        const guide = await loadGrammarGuide(guideId);
        if (guide) {
          setGrammarGuide(guide);
          // Set first context as active tab based on data structure
          let firstContext = '';
          if (guide.professional_contexts) {
            firstContext = Object.keys(guide.professional_contexts)[0];
          } else if (guide.categories) {
            firstContext = guide.categories[0]?.id || '';
          } else if (guide.professional_vocabulary) {
            firstContext = Object.keys(guide.professional_vocabulary)[0];
          }
          setActiveTab(firstContext);
        } else {
          setError('Grammar guide not found');
        }
      } catch (err) {
        setError('Failed to load grammar guide');
        console.error('Error loading guide:', err);
      } finally {
        setLoading(false);
      }
    };

    if (guideId) {
      loadGuide();
    }
  }, [guideId]);

  const getDifficultyIcon = (difficulty: string | undefined | null) => {
    if (!difficulty) return <GraduationCap className="h-4 w-4" />;
    
    switch (difficulty.toLowerCase()) {
      case 'beginner': return <Target className="h-4 w-4" />;
      case 'intermediate': return <TrendingUp className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  const handlePlayAudio = async (text: string, language: string = 'en') => {
    try {
      setIsPlaying(text);
      await audioPronunciation.playPronunciation(text, language, { 
        speed: audioSpeed, 
        pitch: 1.0, 
        volume: 0.8 
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(null);
    }
  };

  const toggleExamples = (contextName: string) => {
    setShowExamples(prev => ({
      ...prev,
      [contextName]: !prev[contextName]
    }));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading grammar guide...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !grammarGuide) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error || 'Grammar guide not found'}</p>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Grammar Overview
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {grammarGuide.title}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePlayAudio(grammarGuide.title)}
                disabled={isPlaying === grammarGuide.title}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                {isPlaying === grammarGuide.title ? (
                  <div className="animate-spin"><RotateCcw className="h-5 w-5 text-blue-600" /></div>
                ) : (
                  <Volume2 className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {grammarGuide.description}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePlayAudio(grammarGuide.description)}
                disabled={isPlaying === grammarGuide.description}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                {isPlaying === grammarGuide.description ? (
                  <div className="animate-spin"><RotateCcw className="h-5 w-5 text-blue-600" /></div>
                ) : (
                  <Volume2 className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            </div>
            
            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Audio Speed:</span>
                <select
                  value={audioSpeed}
                  onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              <div className="text-xs text-gray-500">
                Click the 🔊 icon next to any text to hear it pronounced
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge className={getDifficultyColor(grammarGuide.metadata.difficulty_level)}>
                <div className="flex items-center gap-1">
                  {getDifficultyIcon(grammarGuide.metadata.difficulty_level)}
                  {grammarGuide.metadata.difficulty_level || 'Not specified'}
                </div>
              </Badge>
              
              <Badge variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                {grammarGuide.metadata.total_phrases || 0} examples
              </Badge>
              
              <Badge variant="outline">
                <Users className="h-4 w-4 mr-1" />
                {grammarGuide.metadata.total_contexts || 0} contexts
              </Badge>
              
              <Badge variant="outline">
                <Calendar className="h-4 w-4 mr-1" />
                {grammarGuide.created_date || 'No date'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Basic Concepts */}
        {grammarGuide.basic_concepts && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Basic Concepts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {grammarGuide.basic_concepts.definition}
              </p>
              
              {grammarGuide.basic_concepts.key_functions && grammarGuide.basic_concepts.key_functions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Functions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {grammarGuide.basic_concepts.key_functions.map((function_, index) => (
                      <li key={index}>{function_}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {grammarGuide.basic_concepts.examples && grammarGuide.basic_concepts.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grammarGuide.basic_concepts.examples.map((example, index) => (
                      <Card key={index} className="p-3">
                        <div className="font-medium text-sm text-blue-600 mb-1">
                          {example[Object.keys(example)[0]]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {example.description}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Alternative Content for Different Structures */}
        {!grammarGuide.basic_concepts && grammarGuide.sections && grammarGuide.sections.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Grammar Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {grammarGuide.sections.map((section, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{section.title}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Play section title first, then all content
                          const allText = [
                            section.title,
                            ...(section.content?.map(item => item.definition) || []),
                            ...(section.questions?.map(q => `${q.question} ${q.answer}`) || []),
                            ...(section.sentences || []),
                            ...(section.vocabulary_examples?.categories?.flatMap(cat => 
                              [...cat.explicit_subjects, ...cat.implicit_subjects]
                            ) || []),
                            ...(section.patterns?.flatMap(pattern => pattern.examples) || []),
                            ...(section.categories?.flatMap(cat => cat.examples) || [])
                          ].filter(Boolean);
                          
                          if (allText.length > 0) {
                            handlePlayAudio(allText.join('. '));
                          }
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play All
                      </Button>
                    </div>
                    
                    {/* Basic content rendering */}
                    {section.content && section.content.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {section.content.map((item, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-blue-600 mb-1">{item.concept}:</div>
                                <div className="text-gray-700 mb-2">{item.definition}</div>
                                {item.examples && item.examples.length > 0 && (
                                  <div className="mt-2">
                                    <div className="font-medium text-sm text-gray-600 mb-1">Examples:</div>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                      {item.examples.map((example, exIdx) => (
                                        <li key={exIdx} className="flex items-center gap-2">
                                          <span className="italic">"{example}"</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handlePlayAudio(example)}
                                            disabled={isPlaying === example}
                                            className="h-6 w-6 p-0 hover:bg-blue-100"
                                          >
                                            {isPlaying === example ? (
                                              <div className="animate-spin"><RotateCcw className="h-4 w-4 text-blue-600" /></div>
                                            ) : (
                                              <Volume2 className="h-4 w-4 text-blue-600" />
                                            )}
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handlePlayAudio(item.definition)}
                                disabled={isPlaying === item.definition}
                                className="h-8 w-8 p-0 hover:bg-blue-100 ml-2"
                              >
                                {isPlaying === item.definition ? (
                                  <div className="animate-spin"><RotateCcw className="h-5 w-5 text-blue-600" /></div>
                                ) : (
                                  <Volume2 className="h-5 w-5 text-blue-600" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Questions rendering */}
                    {section.questions && section.questions.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {section.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-green-800 mb-1">Q: {q.question}</div>
                                <div className="text-green-700">A: {q.answer}</div>
                              </div>
                              <div className="flex gap-2 ml-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(q.question)}
                                  disabled={isPlaying === q.question}
                                  className="h-6 w-6 p-0 hover:bg-green-100"
                                >
                                  {isPlaying === q.question ? (
                                    <div className="animate-spin"><RotateCcw className="h-4 w-4 text-green-600" /></div>
                                  ) : (
                                    <Volume2 className="h-4 w-4 text-green-600" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(q.answer)}
                                  disabled={isPlaying === q.answer}
                                  className="h-6 w-6 p-0 hover:bg-green-100"
                                >
                                  {isPlaying === q.answer ? (
                                    <div className="animate-spin"><RotateCcw className="h-4 w-4 text-green-600" /></div>
                                  ) : (
                                    <Volume2 className="h-4 w-4 text-green-600" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Types rendering */}
                    {section.subjects && section.predicates && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">Subjects</h5>
                          <div className="space-y-2">
                            {Object.entries(section.subjects).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <div className="font-medium text-blue-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</div>
                                <div className="text-blue-600 mb-1">{value.definition}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-500 italic text-xs">"{value.example}"</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePlayAudio(value.example)}
                                    disabled={isPlaying === value.example}
                                    className="h-5 w-5 p-0 hover:bg-blue-100"
                                  >
                                    {isPlaying === value.example ? (
                                      <div className="animate-spin"><RotateCcw className="h-3 w-3 text-blue-600" /></div>
                                    ) : (
                                      <Volume2 className="h-3 w-3 text-blue-600" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h5 className="font-medium text-purple-800 mb-2">Predicates</h5>
                          <div className="space-y-2">
                            {Object.entries(section.predicates).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <div className="font-medium text-purple-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</div>
                                <div className="text-purple-600 mb-1">{value.definition}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-purple-500 italic text-xs">"{value.example}"</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePlayAudio(value.example)}
                                    disabled={isPlaying === value.example}
                                    className="h-5 w-5 p-0 hover:bg-purple-100"
                                  >
                                    {isPlaying === value.example ? (
                                      <div className="animate-spin"><RotateCcw className="h-3 w-3 text-purple-600" /></div>
                                    ) : (
                                      <Volume2 className="h-3 w-3 text-purple-600" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Practice exercises rendering */}
                    {section.instructions && section.sentences && (
                      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-200 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-yellow-800 mb-2">{section.instructions}</div>
                            <div className="space-y-1">
                              {section.sentences.map((sentence, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2">
                                  <span className="text-yellow-700 italic">• {sentence}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePlayAudio(sentence)}
                                    disabled={isPlaying === sentence}
                                    className="h-5 w-5 p-0 hover:bg-yellow-100"
                                  >
                                    {isPlaying === sentence ? (
                                      <div className="animate-spin"><RotateCcw className="h-3 w-3 text-yellow-600" /></div>
                                    ) : (
                                      <Volume2 className="h-3 w-3 text-yellow-600" />
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vocabulary examples rendering */}
                    {section.vocabulary_examples && section.vocabulary_examples.categories && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-800 mb-3">Professional Examples by Category</h5>
                        {section.vocabulary_examples.categories.map((cat, catIdx) => (
                          <div key={catIdx} className="bg-gray-50 p-4 rounded-lg">
                            <h6 className="font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                              {cat.category}
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-medium text-sm text-blue-600 mb-2">Explicit Subjects:</div>
                                <div className="space-y-1">
                                  {cat.explicit_subjects.slice(0, 5).map((example, exIdx) => (
                                    <div key={exIdx} className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600 italic">• {example}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handlePlayAudio(example)}
                                        disabled={isPlaying === example}
                                        className="h-5 w-5 p-0 hover:bg-blue-100"
                                      >
                                        {isPlaying === example ? (
                                          <div className="animate-spin"><RotateCcw className="h-3 w-3 text-blue-600" /></div>
                                        ) : (
                                          <Volume2 className="h-3 w-3 text-blue-600" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                  {cat.explicit_subjects.length > 5 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      +{cat.explicit_subjects.length - 5} more examples
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-sm text-green-600 mb-2">Implicit Subjects:</div>
                                <div className="space-y-1">
                                  {cat.implicit_subjects.slice(0, 5).map((example, exIdx) => (
                                    <div key={exIdx} className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600 italic">• {example}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handlePlayAudio(example)}
                                        disabled={isPlaying === example}
                                        className="h-5 w-5 p-0 hover:bg-green-100"
                                      >
                                        {isPlaying === example ? (
                                          <div className="animate-spin"><RotateCcw className="h-3 w-3 text-green-600" /></div>
                                        ) : (
                                          <Volume2 className="h-3 w-3 text-green-600" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                  {cat.implicit_subjects.length > 5 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      +{cat.implicit_subjects.length - 5} more examples
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sentence patterns rendering */}
                    {section.patterns && (
                      <div className="space-y-3 mb-4">
                        <h5 className="font-medium text-gray-800 mb-2">Common Sentence Patterns</h5>
                        {section.patterns.map((pattern, pIdx) => (
                          <div key={pIdx} className="bg-indigo-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-indigo-800 mb-2">Pattern: {pattern.pattern}</div>
                                <div className="space-y-1">
                                  {pattern.examples.map((example, exIdx) => (
                                    <div key={exIdx} className="flex items-center gap-2">
                                      <span className="text-indigo-600 italic text-sm">• {example}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handlePlayAudio(example)}
                                        disabled={isPlaying === example}
                                        className="h-5 w-5 p-0 hover:bg-indigo-100"
                                      >
                                        {isPlaying === example ? (
                                          <div className="animate-spin"><RotateCcw className="h-3 w-3 text-indigo-600" /></div>
                                        ) : (
                                          <Volume2 className="h-3 w-3 text-indigo-600" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Database examples rendering */}
                    {section.categories && section.title === "Database and Data Science Examples" && (
                      <div className="space-y-3 mb-4">
                        <h5 className="font-medium text-gray-800 mb-2">Database & Data Science Examples</h5>
                        {section.categories.map((cat, catIdx) => (
                          <div key={catIdx} className="bg-teal-50 p-3 rounded-lg">
                            <h6 className="font-medium text-teal-800 mb-2">{cat.category}</h6>
                            <div className="space-y-1">
                              {cat.examples.map((example, exIdx) => (
                                <div key={exIdx} className="flex items-center gap-2">
                                  <span className="text-teal-600 italic text-sm">• {example}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePlayAudio(example)}
                                    disabled={isPlaying === example}
                                    className="h-5 w-5 p-0 hover:bg-teal-100"
                                  >
                                    {isPlaying === example ? (
                                      <div className="animate-spin"><RotateCcw className="h-3 w-3 text-teal-600" /></div>
                                    ) : (
                                      <Volume2 className="h-3 w-3 text-teal-600" />
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Professional Contexts */}
        {grammarGuide.professional_contexts && Object.keys(grammarGuide.professional_contexts).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-600" />
                Professional Contexts
              </CardTitle>
              <CardDescription>
                Explore grammar usage in different professional areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {grammarGuide.professional_contexts && Object.keys(grammarGuide.professional_contexts).map((contextName) => (
                    <TabsTrigger key={contextName} value={contextName} className="text-xs">
                      {grammarGuide.professional_contexts![contextName].title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {grammarGuide.professional_contexts && Object.entries(grammarGuide.professional_contexts).map(([contextName, context]) => (
                  <TabsContent key={contextName} value={contextName} className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{context.title}</h3>
                      <p className="text-gray-600">{context.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">
                        {context.phrases?.length || 0} examples
                      </Badge>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Speed:</span>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={audioSpeed}
                            onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">{audioSpeed}x</span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExamples(contextName)}
                        >
                          {showExamples[contextName] ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide Examples
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Show Examples
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {showExamples[contextName] && context.phrases && context.phrases.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {context.phrases.map((phrase, index) => {
                          // Handle different phrase structures based on grammar type
                          const phraseText = phrase.phrase || phrase.clause || phrase.adjective || phrase.adverb || phrase.conjunction || phrase.noun || phrase.verb || phrase.preposition || phrase.pronoun || phrase.determiner;
                          const meaning = phrase.meaning || phrase.description;
                          const contextInfo = phrase.context;
                          
                          return (
                            <Card key={index} className="p-4">
                              <div className="mb-3">
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {phrase.clause_type || phrase.type || 'Example'}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePlayAudio(phraseText)}
                                    disabled={isPlaying === phraseText}
                                    className="h-6 w-6 p-0"
                                  >
                                    {isPlaying === phraseText ? (
                                      <div className="animate-spin">
                                        <RotateCcw className="h-4 w-4" />
                                      </div>
                                    ) : (
                                      <Volume2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                
                                <p className="text-gray-800 font-medium mb-2">
                                  {phraseText}
                                </p>
                                
                                {contextInfo && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Context:</span> {contextInfo}
                                  </p>
                                )}
                                
                                {meaning && (
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Meaning:</span> {meaning}
                                  </p>
                                )}
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Alternative Content for Different Structures */}
        {!grammarGuide.professional_contexts && grammarGuide.categories && grammarGuide.categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-600" />
                Prepositional Phrases by Category
              </CardTitle>
              <CardDescription>
                Explore prepositional phrases in different professional contexts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {grammarGuide.categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {grammarGuide.categories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">
                        {category.phrases?.length || 0} phrases
                      </Badge>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Speed:</span>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={audioSpeed}
                            onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">{audioSpeed}x</span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExamples(category.id)}
                        >
                          {showExamples[category.id] ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide Examples
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Show Examples
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {showExamples[category.id] && category.phrases && category.phrases.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.phrases.map((phrase, index) => (
                          <Card key={index} className="p-4">
                            <div className="mb-3">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {phrase.preposition}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(phrase.phrase)}
                                  disabled={isPlaying === phrase.phrase}
                                  className="h-6 w-6 p-0"
                                >
                                  {isPlaying === phrase.phrase ? (
                                    <div className="animate-spin"><RotateCcw className="h-4 w-4" /></div>
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <p className="text-gray-800 font-medium mb-2">{phrase.phrase}</p>
                              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Example:</span> {phrase.example}</p>
                              <p className="text-sm text-gray-700"><span className="font-medium">Context:</span> {phrase.context}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Alternative Content for Verbs Structure */}
        {!grammarGuide.professional_contexts && !grammarGuide.categories && grammarGuide.professional_vocabulary && Object.keys(grammarGuide.professional_vocabulary).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-600" />
                Professional Vocabulary
              </CardTitle>
              <CardDescription>
                Explore verb usage in different professional contexts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Object.keys(grammarGuide.professional_vocabulary).map((contextName) => (
                    <TabsTrigger key={contextName} value={contextName} className="text-xs">
                      {contextName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(grammarGuide.professional_vocabulary).map(([contextName, vocab]) => (
                  <TabsContent key={contextName} value={contextName} className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {contextName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">Simple Verbs</h4>
                        <div className="space-y-2">
                          {vocab.simple_verbs && vocab.simple_verbs.length > 0 ? (
                            vocab.simple_verbs.map((verb, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{verb}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(verb)}
                                  disabled={isPlaying === verb}
                                  className="h-6 w-6 p-0"
                                >
                                  {isPlaying === verb ? (
                                    <div className="animate-spin"><RotateCcw className="h-4 w-4" /></div>
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No simple verbs available</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">Compound Verbs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {vocab.compound_verbs && vocab.compound_verbs.length > 0 ? (
                            vocab.compound_verbs.map((verb, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{verb}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayAudio(verb)}
                                  disabled={isPlaying === verb}
                                  className="h-6 w-6 p-0"
                                >
                                  {isPlaying === verb ? (
                                    <div className="animate-spin"><RotateCcw className="h-4 w-4" /></div>
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No compound verbs available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-600" />
              Guide Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-1">Version</h4>
                <p className="text-gray-800">{grammarGuide.version}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-1">Created</h4>
                <p className="text-gray-800">{grammarGuide.created_date}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-1">Difficulty</h4>
                <p className="text-gray-800">{grammarGuide.metadata.difficulty_level}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-1">Target Audience</h4>
                <p className="text-gray-800">
                  {grammarGuide.metadata.target_audience && grammarGuide.metadata.target_audience.length > 0 ? 
                    grammarGuide.metadata.target_audience.join(', ') : 
                    'Professionals, Students, Non-native English Speakers'
                  }
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {grammarGuide.metadata.tags && grammarGuide.metadata.tags.length > 0 ? (
                  grammarGuide.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 