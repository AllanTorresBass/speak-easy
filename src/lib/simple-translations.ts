// Simple, reliable Spanish translations for common English words and phrases
// This provides immediate translations without external API calls

export const simpleTranslations: Record<string, string> = {
  // Common words
  'hello': 'hola',
  'goodbye': 'adiós',
  'thank you': 'gracias',
  'please': 'por favor',
  'yes': 'sí',
  'no': 'no',
  'water': 'agua',
  'food': 'comida',
  'house': 'casa',
  'car': 'coche',
  'book': 'libro',
  'time': 'tiempo',
  'work': 'trabajo',
  'family': 'familia',
  'friend': 'amigo',
  'love': 'amor',
  'happy': 'feliz',
  'sad': 'triste',
  'big': 'grande',
  'small': 'pequeño',
  'good': 'bueno',
  'bad': 'malo',
  'beautiful': 'hermoso',
  'ugly': 'feo',
  'fast': 'rápido',
  'slow': 'lento',
  'hot': 'caliente',
  'cold': 'frío',
  'new': 'nuevo',
  'old': 'viejo',
  'young': 'joven',
  
  // Promova vocabulary words
  'accomplish': 'lograr, cumplir',
  'endeavor': 'esfuerzo, empeño',
  'perseverance': 'perseverancia, constancia',
  'sensible': 'sensato, razonable',
  'sensitive': 'sensible, delicado',
  'settle down': 'establecerse, asentarse',
  'shook': 'conmocionado, sorprendido',
  'silent support': 'apoyo silencioso',
  'slip one\'s mind': 'olvidarse',
  'smuggling': 'contrabando',
  'snatched': 'perfecto, estilizado',
  'sophomore': 'estudiante de segundo año',
  'soul healer': 'sanador del alma',
  'speak one\'s mind': 'decir lo que piensa',
  'start-up': 'empresa emergente',
  'steering wheel': 'volante',
  'stern': 'severo, estricto',
  'stopgap measure': 'medida temporal',
  'studs': 'pendientes',
  'suspect': 'sospechoso',
  'sustainable': 'sostenible',
  'ascertain': 'determinar',
  'ask out': 'invitar a salir',
  'assassination': 'asesinato',
  'assertive': 'asertivo',
  'ballpark figure': 'cifra aproximada',
  'bangle': 'pulsera rígida',
  
  // Phrases and idioms
  'bark up the wrong tree': 'ir por el camino equivocado',
  'be a catalyst for': 'ser un catalizador para',
  'be short of time': 'estar corto de tiempo',
  'beat around the bush': 'andar con rodeos',
  'bite the bullet': 'tragar el sapo',
  'break a leg': 'buena suerte',
  'call it a day': 'dar por terminado',
  'cut corners': 'tomar atajos',
  'get out of hand': 'salirse de control',
  'hit the nail on the head': 'dar en el clavo',
  'let the cat out of the bag': 'revelar el secreto',
  'miss the boat': 'perder la oportunidad',
  'on the ball': 'al tanto, preparado',
  'pull yourself together': 'componerse',
  'speak of the devil': 'hablando del rey de Roma',
  'the last straw': 'la gota que colmó el vaso',
  'under the weather': 'no sentirse bien',
  'when pigs fly': 'cuando las vacas vuelen',
  'you can say that again': 'puedes repetirlo',
  'your guess is as good as mine': 'tu suposición es tan buena como la mía',
  
  // Business and professional
  'deadline': 'fecha límite',
  'meeting': 'reunión',
  'presentation': 'presentación',
  'project': 'proyecto',
  'team': 'equipo',
  'client': 'cliente',
  'budget': 'presupuesto',
  'strategy': 'estrategia',
  'goal': 'objetivo',
  'success': 'éxito',
  'failure': 'fracaso',
  'opportunity': 'oportunidad',
  'challenge': 'desafío',
  'solution': 'solución',
  'problem': 'problema',
  
  // Technology
  'computer': 'computadora',
  'internet': 'internet',
  'software': 'software',
  'hardware': 'hardware',
  'database': 'base de datos',
  'algorithm': 'algoritmo',
  'interface': 'interfaz',
  'network': 'red',
  'server': 'servidor',
  'website': 'sitio web',
  'application': 'aplicación',
  'system': 'sistema',
  'data': 'datos',
  'information': 'información',
  'technology': 'tecnología',
  
  // Emotions and feelings
  'excited': 'emocionado',
  'nervous': 'nervioso',
  'confident': 'confiado',
  'worried': 'preocupado',
  'proud': 'orgulloso',
  'embarrassed': 'avergonzado',
  'surprised': 'sorprendido',
  'disappointed': 'decepcionado',
  'grateful': 'agradecido',
  'frustrated': 'frustrado',
  'relieved': 'aliviado',
  'confused': 'confundido',
  'curious': 'curioso',
  'bored': 'aburrido',
  'interested': 'interesado',
  
  // Actions and verbs
  'run': 'correr',
  'walk': 'caminar',
  'talk': 'hablar',
  'listen': 'escuchar',
  'read': 'leer',
  'write': 'escribir',
  'think': 'pensar',
  'feel': 'sentir',
  'see': 'ver',
  'hear': 'oír',
  'smell': 'oler',
  'taste': 'probar',
  'touch': 'tocar',
  'move': 'mover',
  'stop': 'parar',
  
  // Adjectives
  'important': 'importante',
  'necessary': 'necesario',
  'possible': 'posible',
  'impossible': 'imposible',
  'difficult': 'difícil',
  'easy': 'fácil',
  'expensive': 'caro',
  'cheap': 'barato',
  'strong': 'fuerte',
  'weak': 'débil',
  'rich': 'rico',
  'poor': 'pobre',
  'smart': 'inteligente',
  'stupid': 'tonto',
  'kind': 'amable'
};

// Function to get translation with fallback
export function getSimpleTranslation(word: string): string {
  const lowerWord = word.toLowerCase().trim();
  
  // Direct match
  if (simpleTranslations[lowerWord]) {
    return simpleTranslations[lowerWord];
  }
  
  // Try to find partial matches for phrases
  for (const [key, translation] of Object.entries(simpleTranslations)) {
    if (lowerWord.includes(key) || key.includes(lowerWord)) {
      return translation;
    }
  }
  
  // If no translation found, return empty string
  return '';
}

// Function to get multiple translations for a list of words
export function getMultipleTranslations(words: string[]): Record<string, string> {
  const translations: Record<string, string> = {};
  
  words.forEach(word => {
    translations[word] = getSimpleTranslation(word);
  });
  
  return translations;
} 