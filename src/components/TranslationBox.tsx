import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Loader2 } from 'lucide-react';

interface TranslationBoxProps {
  sourceLang: string;
  targetLang: string;
}

export function TranslationBox({ sourceLang, targetLang }: TranslationBoxProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const { translate, isLoading, error } = useTranslation();

  const translateInput = useCallback(async () => {
    if (inputText.trim()) {
      const result = await translate(inputText, targetLang);
      setTranslatedText(result);
    } else {
      setTranslatedText('');
    }
  }, [inputText, targetLang, translate]);

  useEffect(() => {
    const debounceTimeout = setTimeout(translateInput, 500);
    return () => clearTimeout(debounceTimeout);
  }, [translateInput]);

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1">
          {sourceLang.toUpperCase()}
        </label>
        <textarea
          id="sourceText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          rows={3}
          placeholder="Enter text to translate..."
        />
      </div>

      <div>
        <label htmlFor="translatedText" className="block text-sm font-medium text-gray-700 mb-1">
          {targetLang.toUpperCase()}
        </label>
        <div className="relative">
          <textarea
            id="translatedText"
            value={translatedText}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
            rows={3}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-md">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}