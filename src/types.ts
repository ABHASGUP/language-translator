import { Language } from '../types';

export type TranslationMode = 
  | 'speech-to-text'
  | 'text-to-speech'
  | 'image-to-text'
  | 'video-to-text'
  | 'website-translation';

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
  mode: TranslationMode;
  url?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface UserType {
  id: string;
  name: string;
  preferredLanguages: string[];
  recentTranslations: TranslationResult[];
  settings: {
    autoDetectLanguage: boolean;
    saveHistory: boolean;
    defaultSourceLang: string;
    defaultTargetLang: string;
  };
}