import React, { useState } from 'react';
import { Mic, Volume2, Copy, Check } from 'lucide-react';
import type { Language, TranslationMode, TranslationResult } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Props {
  mode: TranslationMode;
  sourceLang: Language;
  targetLang: Language;
}

export function TranslationArea({ mode, sourceLang, targetLang }: Props) {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { translate, isLoading } = useTranslation();
  const { startListening, stopListening, transcript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    try {
      const result = await translate(sourceText, targetLang.code);
      setTargetText(result);
      
      // Speak the translation if in text-to-speech mode
      if (mode === 'text-to-speech') {
        speak(result, targetLang.code);
      }

      // Save to history
      const translationResult: TranslationResult = {
        sourceText,
        translatedText: result,
        sourceLanguage: sourceLang.code,
        targetLanguage: targetLang.code,
        timestamp: Date.now(),
        mode
      };
      
      const savedHistory = localStorage.getItem('translation_history');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      localStorage.setItem(
        'translation_history',
        JSON.stringify([translationResult, ...history].slice(0, 100))
      );
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const handleMicClick = async () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      setSourceText(transcript || '');
    } else {
      await startListening();
      setIsListening(true);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {sourceLang.name}
            </label>
            <div className="flex gap-2">
              {mode === 'text-to-speech' && (
                <button
                  onClick={() => speak(sourceText, sourceLang.code)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  disabled={!sourceText}
                >
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </button>
              )}
              {mode === 'speech-to-text' && (
                <button
                  onClick={handleMicClick}
                  className={`p-2 rounded-full ${
                    isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={6}
            dir={sourceLang.direction}
            placeholder={`Type or speak in ${sourceLang.name}...`}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {targetLang.name}
            </label>
            <div className="flex gap-2">
              {mode === 'text-to-speech' && (
                <button
                  onClick={() => speak(targetText, targetLang.code)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  disabled={!targetText}
                >
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={() => handleCopy(targetText)}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!targetText}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <textarea
            value={targetText}
            readOnly
            className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
            rows={6}
            dir={targetLang.direction}
            placeholder={isLoading ? 'Translating...' : `Translation in ${targetLang.name} will appear here...`}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isLoading}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}