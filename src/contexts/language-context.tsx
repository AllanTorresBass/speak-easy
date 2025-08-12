'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language } from '@/types';

type SupportedLanguage = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Supported languages configuration
const supportedLanguages: Record<SupportedLanguage, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
  },
};

// Translation dictionary (simplified - in production, use a proper i18n library)
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'common.welcome': 'Welcome',
    'common.dashboard': 'Dashboard',
    'common.vocabulary': 'Vocabulary',
    'common.grammar': 'Grammar',
    'common.practice': 'Practice',
    'common.progress': 'Progress',
    'common.settings': 'Settings',
    'common.logout': 'Logout',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.retry': 'Retry',
  },
  es: {
    'common.welcome': 'Bienvenido',
    'common.dashboard': 'Panel de control',
    'common.vocabulary': 'Vocabulario',
    'common.grammar': 'Gramática',
    'common.practice': 'Práctica',
    'common.progress': 'Progreso',
    'common.settings': 'Configuración',
    'common.logout': 'Cerrar sesión',
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.success': '¡Éxito!',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.finish': 'Terminar',
    'common.retry': 'Reintentar',
  },
  fr: {
    'common.welcome': 'Bienvenue',
    'common.dashboard': 'Tableau de bord',
    'common.vocabulary': 'Vocabulaire',
    'common.grammar': 'Grammaire',
    'common.practice': 'Pratique',
    'common.progress': 'Progrès',
    'common.settings': 'Paramètres',
    'common.logout': 'Se déconnecter',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès !',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.finish': 'Terminer',
    'common.retry': 'Réessayer',
  },
  de: {
    'common.welcome': 'Willkommen',
    'common.dashboard': 'Dashboard',
    'common.vocabulary': 'Wortschatz',
    'common.grammar': 'Grammatik',
    'common.practice': 'Übung',
    'common.progress': 'Fortschritt',
    'common.settings': 'Einstellungen',
    'common.logout': 'Abmelden',
    'common.loading': 'Laden...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolg!',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.finish': 'Beenden',
    'common.retry': 'Wiederholen',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  
  // Check for saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('speakeasy-language') as SupportedLanguage;
    if (savedLanguage && supportedLanguages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Default to browser language if supported
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      if (supportedLanguages[browserLang]) {
        setCurrentLanguage(browserLang);
      }
    }
  }, []);

  // Save language preference when it changes
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem('speakeasy-language', lang);
  };

  // Translation function with parameter substitution
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[currentLanguage]?.[key] || key;
    
    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return translation;
  };

  // Check if current language is RTL (for future Arabic/Hebrew support)
  const isRTL = false; // Currently all supported languages are LTR

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage: handleLanguageChange, 
        t, 
        isRTL 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Export supported languages for use in components
export { supportedLanguages }; 