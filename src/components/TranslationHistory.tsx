import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Trash2, Volume2, Globe, Video, Image as ImageIcon, Mic, Volume } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import type { TranslationResult, TranslationMode } from '../types';
import { languages } from '../data/languages';

const modeIcons: Record<TranslationMode, React.ReactNode> = {
  'speech-to-text': <Mic className="w-4 h-4" />,
  'text-to-speech': <Volume className="w-4 h-4" />,
  'image-to-text': <ImageIcon className="w-4 h-4" />,
  'video-to-text': <Video className="w-4 h-4" />,
  'website-translation': <Globe className="w-4 h-4" />
};

const modeLabels: Record<TranslationMode, string> = {
  'speech-to-text': 'Speech to Text',
  'text-to-speech': 'Text to Speech',
  'image-to-text': 'Image Translation',
  'video-to-text': 'Video Translation',
  'website-translation': 'Website Translation'
};

export function TranslationHistory() {
  const [history, setHistory] = useState<TranslationResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    const savedHistory = localStorage.getItem('translation_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const filteredHistory = history.filter(item =>
    item.sourceText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translatedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your translation history?')) {
      localStorage.removeItem('translation_history');
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageName = (code: string) => {
    return languages.find(l => l.code === code)?.name || code;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-900">Translation History</h2>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
          Clear History
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search translations..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No matching translations found' : 'No translations yet'}
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(item.timestamp)}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {item.mode && modeIcons[item.mode]}
                  {item.mode && modeLabels[item.mode]}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getLanguageName(item.sourceLanguage)}
                    </span>
                    {item.mode !== 'website-translation' && (
                      <button
                        onClick={() => speak(item.sourceText, item.sourceLanguage)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Volume2 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-900">{item.sourceText}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getLanguageName(item.targetLanguage)}
                    </span>
                    {item.mode !== 'website-translation' && (
                      <button
                        onClick={() => speak(item.translatedText, item.targetLanguage)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Volume2 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  {item.mode === 'website-translation' && item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    >
                      <Globe className="w-4 h-4" />
                      View Translated Website
                    </a>
                  ) : (
                    <p className="text-gray-900">{item.translatedText}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}