import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Volume2, Languages } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { languages } from '../data/languages';

interface Props {
  targetLanguage: string;
  onProgress: (xpGained: number) => void;
}

export function LanguagePractice({ targetLanguage, onProgress }: Props) {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { translate, isLoading, error } = useTranslation();
  const { startListening, stopListening, transcript, resetTranscript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  const targetLang = languages.find(l => l.code === targetLanguage);
  
  const handleTranslate = useCallback(async (text: string, isReverse: boolean) => {
    if (!text.trim()) return;
    
    try {
      const result = await translate(
        text,
        isReverse ? 'en' : targetLanguage
      );
      if (isReverse) {
        setSourceText(result);
      } else {
        setTargetText(result);
      }
      onProgress(1); // Award XP for each translation
    } catch (err) {
      console.error('Translation error:', err);
    }
  }, [targetLanguage, translate, onProgress]);

  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
      handleTranslate(transcript, false);
    }
  }, [transcript, handleTranslate]);

  const handleMicClick = async () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      await startListening();
      setIsListening(true);
    }
  };

  const handleSpeakClick = (text: string, lang: string) => {
    speak(text, lang);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">
        Practice {targetLang?.name || 'Language'}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              English
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSpeakClick(sourceText, 'en')}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!sourceText}
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleMicClick}
                className={`p-2 rounded-full ${
                  isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => {
              setSourceText(e.target.value);
              handleTranslate(e.target.value, false);
            }}
            className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Type or speak in English..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {targetLang?.name || 'Target Language'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSpeakClick(targetText, targetLanguage)}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!targetText}
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <textarea
            value={targetText}
            onChange={(e) => {
              setTargetText(e.target.value);
              handleTranslate(e.target.value, true);
            }}
            className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={4}
            placeholder={`Type in ${targetLang?.name || 'target language'}...`}
            dir={targetLang?.direction || 'ltr'}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-gray-600">
          Translating...
        </div>
      )}
    </div>
  );
}