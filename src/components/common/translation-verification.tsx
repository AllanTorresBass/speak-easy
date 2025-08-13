'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getComprehensiveTranslation } from '@/lib/comprehensive-promova-translations';

// Test words from vocabulary_list_1.json through vocabulary_list_24.json
const testWords = [
  // From vocabulary_list_1.json
  'talk at cross-purposes',
  'talk business',
  'terrific',
  'terrifying',
  'the honeymoon is over',
  'think laterally',
  'tie the knot',
  'time-consuming',
  'tire',
  'tireless effort',
  'tremulous',
  'trunk',
  'ululation',
  'unbreakable patience',
  'under one\'s belt',
  'unscrupulous',
  'unshakable resilience',
  'unspoken understanding',
  'unwavering support',
  'vandalism',
  'venture',
  'walk down the aisle',
  'walking encyclopedia',
  'wander',
  'windshield',
  
  // From vocabulary_list_5.json
  'to prepare a written contract',
  'drawer cabinet',
  'drivers of change',
  'drop the ball',
  'dry up',
  'eliminate',
  'employee',
  'employer',
  'encounter',
  'endorse',
  'energetic',
  'enthusiastic',
  'establish',
  'exacerbate',
  'experienced',
  'factory',
  'family-owned',
  'fidget with',
  'fill out',
  'firm up',
  'fixed-term',
  'flexible hours',
  'flick',
  'flowchart',
  'fluctuate',
  
  // From vocabulary_list_6.json
  'immediately',
  'proactive',
  'production',
  'project manager',
  'promote products',
  'promotion',
  'provided equipment',
  'punctual',
  'punctuality',
  'put forward a motion',
  'put on speaker',
  'R&D',
  'reach a peak',
  'read the situation',
  'receipt',
  'receive',
  'red tape',
  'reimbursement',
  'reliable',
  'relocation',
  'remain stable',
  'remote staff',
  'remotely',
  'reply',
  'restart',
  
  // From vocabulary_list_7.json
  'retirement plan',
  'roll out the red carpet',
  'run a company',
  'sales rep',
  'scroll up',
  'seasonal',
  'select',
  'self-reliant',
  'service center',
  'shoot off an email',
  'short-sighted view',
  'shortlist candidates',
  'show of hands',
  'sign',
  'slouch',
  'soar',
  'soft copy',
  'sort out',
  'spacious office',
  'stamp',
  'staple remover',
  'sticky note',
  'streamline',
  'stringent',
  
  // From vocabulary_list_8.json
  'be in the black',
  'be in the red',
  'be the catalyst for',
  'below the waterline',
  'best practice',
  'bid',
  'blow a chance',
  'blue-collar',
  'boot up',
  'bottleneck',
  'break down a problem',
  'bring about change',
  'bring to the table',
  'broaden one\'s horizons',
  'bulletin board',
  'burn out',
  'by the book',
  'call center',
  'call the shots',
  'careful',
  'casual',
  'CEO',
  'chair a meeting',
  'check references',
  
  // From vocabulary_list_10.json
  'a match made in heaven',
  'abhor',
  'accelerate',
  'accomplice',
  'acid rain',
  'acquisition',
  'acquit',
  'adjourn',
  'advocacy',
  'affluent',
  'air rage',
  'amazed',
  'anticipate',
  'anxious',
  'apathy',
  'apprentice',
  'arduous',
  'arson',
  'ascertain',
  'ask out',
  'assassination',
  'assertive',
  'ballpark figure',
  'bangle',
  
  // From vocabulary_list_11.json
  'endanger. or species',
  'endearing qualities',
  'endeavor',
  'endeavour',
  'everlasting bond',
  'excruciating',
  'exhausted',
  'faded',
  'fall for',
  'fatherly patience',
  'feminism',
  'flawless',
  'fling',
  'forge an alliance with',
  'franchise',
  'fraud',
  'freshman',
  'fugitive',
  'garish',
  'gearshift',
  'get cold feet',
  'get down to business',
  'get pulled over',
  'get to the bottom of',
  'give a hard time',
  'give a piece of one\'s mind',
  'glass ceiling',
  
  // From vocabulary_list_12.json
  'complement',
  'compliment',
  'conceited',
  'contamination',
  'cook the books',
  'core competency',
  'cramped seating',
  'creased',
  'cross one\'s mind',
  'cut off',
  'dashboard',
  'defender',
  'deforestation',
  'depletion',
  'desperate',
  'destitute',
  'discrimination',
  'diversity',
  'do-it-all mindset',
  'drop off',
  'elucidate',
  'emigrate',
  'eminent',
  'empathy',
  'endangered species',
  
  // From vocabulary_list_13.json
  'glove compartment',
  'graduate',
  'grasp the importance',
  'great minds think alike',
  'grubby',
  'grunt',
  'guardian angel',
  'guiding hand',
  'hair clip',
  'hands-on dad',
  'headlights',
  'hear on the grapevine',
  'holistic approach',
  'hood',
  'hoops',
  'horrified',
  'hushed',
  'husky',
  'ignition',
  'immigrate',
  'imminent',
  'inconsiderate',
  'inhibited',
  'inquire',
  
  // From vocabulary_list_14.json
  'pink tax',
  'plant the seed of doubt',
  'ponder',
  'pop the question',
  'pore over',
  'postpone',
  'prosecutor',
  'pull in',
  'put behind bars',
  'put down roots',
  'quell',
  'rearview mirror',
  'rendezvous',
  'reside',
  'resourceful',
  'roar',
  'ruddy',
  'run a red light',
  'sacrificial love',
  'sail through',
  'scholar',
  'scrumptious',
  'seat-kicking',
  'second shift',
  
  // From vocabulary_list_15.json
  'to be serious about taking action',
  'memory keeper',
  'merger',
  'meticulous',
  'mind one\'s own business',
  'mugging',
  'mundane',
  'murder',
  'nip it in the bud',
  'observant',
  'offender',
  'oil slick',
  'one thing at a time',
  'one-horse race',
  'overbooking',
  'overtake',
  'pain point',
  'pallid',
  'pass the buck',
  'paternal wisdom',
  'pay gap',
  'pendant',
  'pick one\'s brain',
  'pick up',
  'pickpocketing',
  
  // From vocabulary_list_16.json
  'witness',
  'wonder',
  'worn-out',
  'wrestle with a problem',
  'yield',
  'zonked',
  
  // From vocabulary_list_17.json
  'click on',
  'clipboard',
  'commence',
  'commuter benefits',
  'company values',
  'competent',
  'competitive',
  'comprehensive',
  'conduct an interview',
  'conduct negotiations',
  'conduct research',
  'correction fluid',
  'crash',
  'creative',
  'deal in',
  'deal with issues',
  'decrease',
  'deep dive',
  'deliver',
  'demotion',
  'detrimental',
  'director of finance',
  'discuss',
  'dismissive',
  'draw up a contract',
  
  // From vocabulary_list_18.json
  'accounts',
  'acquisition',
  'administration',
  'advertise a vacancy',
  'aha moment',
  'align',
  'all-hands meeting',
  'ambitious',
  'analytical',
  'annual bonus',
  'appearance',
  'apply for a job',
  'apprentice',
  'apprenticeship',
  'assist',
  'at the helm',
  'attach',
  'attend',
  'attend an interview',
  'authoritative',
  'authorize',
  'back up',
  'backfire',
  'bandwidth',
  'bar graph',
  
  // From vocabulary_list_19.json
  'onboarding',
  'one-horse race',
  'overtime',
  'pace',
  'paid vacation',
  'pan out',
  'parent',
  'part-time',
  'pass probation',
  'pass the buck',
  'patient',
  'pay lip service',
  'pay raise',
  'performance review',
  'personal assistant',
  'pie chart',
  'pink-collar',
  'play hardball',
  'plug in',
  'plummet',
  'pop up',
  'posture',
  'PR',
  'pressing issue',
  
  // From vocabulary_list_20.json
  'growth hacking',
  'handle',
  'hard copy',
  'hardworking',
  'head up',
  'headquarters',
  'health insurance',
  'hinder progress',
  'hit bottom',
  'hit the jackpot',
  'hole punch',
  'hook up',
  'hop on a call',
  'illustrate',
  'imaginative',
  'in a team',
  'in shifts',
  'in the weeds',
  'in-house staff',
  'inform',
  'insecure',
  'install',
  'invoice',
  'IT',
  
  // From vocabulary_list_21.json
  'train new staff',
  'transport goods',
  'unanimous vote',
  'unforeseen circumstances',
  'unlock',
  'up to speed',
  'update',
  'venture',
  'viable',
  'vote by proxy',
  'warehouse',
  'wastebasket',
  'weigh up the pros and cons',
  'white-collar',
  'with military precision',
  'wrap up a meeting',
  'write a resume',
  'zero in on',
  
  // From vocabulary_list_22.json
  'stumbling block',
  'submit',
  'subsidiary',
  'suffer a setback',
  'support customers',
  'swipe',
  'swivel chair',
  'table',
  'take a rain check',
  'take over',
  'take with a grain of salt',
  'talk at cross-purposes',
  'tap',
  'tap one\'s foot',
  'team lead',
  'technician',
  'teleworking',
  'the last straw',
  'throw in the towel',
  'throw under the bus',
  'tight budget',
  'tilt one\'s head',
  'top up',
  'touch base with',
  
  // From vocabulary_list_23.json
  'job rotation',
  'join forces',
  'jot down',
  'jump on the bandwagon',
  'keep one\'s eyes open',
  'keep records',
  'keep several balls in the air',
  'key in',
  'launch a product',
  'lay-off',
  'lead a team',
  'lean back',
  'lean toward',
  'learn the ropes',
  'learning',
  'legal',
  'level playing field',
  'leverage',
  'like herding cats',
  'line graph',
  'logistics',
  'lose connection',
  'lose one\'s nerve',
  'maintain equipment',
  
  // From vocabulary_list_24.json
  'focused',
  'forge an alliance with',
  'franchise',
  'freeze',
  'friendly',
  'fruitful discussion',
  'full-time',
  'gain an insight',
  'gain experience',
  'gestures',
  'get an offer',
  'get kicked out',
  'get the ball rolling',
  'get to the bottom of',
  'glass ceiling',
  'go bankrupt',
  'go down',
  'go down badly',
  'go the extra mile',
  'go through the roof',
  'golden handshake',
  'golden opportunity',
  'gray area',
  'grow into one\'s role'
];

export function TranslationVerification() {
  const [results, setResults] = useState<Record<string, { translation: string; hasTranslation: boolean }>>({});
  const [isLoading, setIsLoading] = useState(false);

  const testTranslations = () => {
    setIsLoading(true);
    const newResults: Record<string, { translation: string; hasTranslation: boolean }> = {};
    
    testWords.forEach(word => {
      const translation = getComprehensiveTranslation(word);
      newResults[word] = {
        translation,
        hasTranslation: translation.length > 0
      };
    });
    
    setResults(newResults);
    setIsLoading(false);
  };

  const getStatusIcon = (hasTranslation: boolean) => {
    if (hasTranslation) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (hasTranslation: boolean) => {
    if (hasTranslation) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Translated</Badge>;
    } else {
      return <Badge variant="destructive">Missing</Badge>;
    }
  };

  const successCount = Object.values(results).filter(r => r.hasTranslation).length;
  const totalCount = testWords.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Translation Verification Test
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Testing translations for vocabulary_list_5.json and vocabulary_list_6.json
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Test Results Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-gray-600">Translated</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
          
          <Button 
            onClick={testTranslations} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Run Translation Test'}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {testWords.map(word => {
                const result = results[word];
                if (!result) return null;
                
                return (
                  <Card key={word} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(result.hasTranslation)}
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {word}
                            </span>
                            {getStatusBadge(result.hasTranslation)}
                          </div>
                          {result.hasTranslation ? (
                            <div className="pl-7">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Spanish: </span>
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                {result.translation}
                              </span>
                            </div>
                          ) : (
                            <div className="pl-7 text-sm text-red-600 dark:text-red-400">
                              No translation available
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 