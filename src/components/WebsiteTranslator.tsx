import React, { useState } from 'react';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';
import type { Language, TranslationResult } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  sourceLang: Language;
  targetLang: Language;
}

export function WebsiteTranslator({ sourceLang, targetLang }: Props) {
  const [url, setUrl] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedUrl, setTranslatedUrl] = useState('');
  const { translate } = useTranslation();

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsTranslating(true);
    try {
      // Create a proxy URL that will handle the translation
      const proxyUrl = `https://translate.google.com/translate?sl=${sourceLang.code}&tl=${targetLang.code}&u=${encodeURIComponent(url)}`;
      setTranslatedUrl(proxyUrl);

      // Save to history
      const translationResult: TranslationResult = {
        sourceText: `Website: ${url}`,
        translatedText: `Translated version available at: ${proxyUrl}`,
        sourceLanguage: sourceLang.code,
        targetLanguage: targetLang.code,
        timestamp: Date.now(),
        mode: 'website-translation',
        url: proxyUrl
      };

      const savedHistory = localStorage.getItem('translation_history');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      localStorage.setItem(
        'translation_history',
        JSON.stringify([translationResult, ...history].slice(0, 100))
      );
    } catch (error) {
      console.error('Error translating website:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleTranslate} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                id="website-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isTranslating || !url}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mt-6"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                Translate
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {translatedUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 mb-4">
            Website translation is ready! Click the button below to view the translated version:
          </p>
          <a
            href={translatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Globe className="w-4 h-4" />
            View Translated Website
          </a>
        </div>
      )}
    </div>
  );
}