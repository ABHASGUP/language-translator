import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, History } from 'lucide-react';
import { TranslationModes } from './components/TranslationModes';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationArea } from './components/TranslationArea';
import { ImageTranslator } from './components/ImageTranslator';
import { VideoTranslator } from './components/VideoTranslator';
import { WebsiteTranslator } from './components/WebsiteTranslator';
import { TranslationHistory } from './components/TranslationHistory';
import type { Language, TranslationMode } from './types';
import { languages } from './data/languages';

function App() {
  const [mode, setMode] = useState<TranslationMode | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sourceLang, setSourceLang] = useState<Language>(languages.find(l => l.code === 'en') || languages[0]);
  const [targetLang, setTargetLang] = useState<Language>(languages.find(l => l.code === 'es') || languages[1]);

  const handleLogoClick = () => {
    setShowHistory(false);
    setMode(null);
  };

  const renderTranslationComponent = () => {
    if (showHistory) {
      return <TranslationHistory />;
    }

    switch (mode) {
      case 'speech-to-text':
      case 'text-to-speech':
        return (
          <TranslationArea
            mode={mode}
            sourceLang={sourceLang}
            targetLang={targetLang}
          />
        );
      case 'image-to-text':
        return (
          <ImageTranslator
            sourceLang={sourceLang}
            targetLang={targetLang}
          />
        );
      case 'video-to-text':
        return (
          <VideoTranslator
            sourceLang={sourceLang}
            targetLang={targetLang}
          />
        );
      case 'website-translation':
        return (
          <WebsiteTranslator
            sourceLang={sourceLang}
            targetLang={targetLang}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Languages className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-900">LinguaQuest</span>
            </button>
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setMode(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <History className={`w-5 h-5 ${showHistory ? 'text-indigo-600' : 'text-gray-600'}`} />
              <span className={showHistory ? 'text-indigo-600' : 'text-gray-600'}>History</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {!showHistory && (
            <TranslationModes
              currentMode={mode}
              onModeSelect={setMode}
            />
          )}

          {(mode || showHistory) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {!showHistory && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <LanguageSelector
                    label="From"
                    value={sourceLang}
                    onChange={setSourceLang}
                    languages={languages}
                  />
                  <LanguageSelector
                    label="To"
                    value={targetLang}
                    onChange={setTargetLang}
                    languages={languages}
                  />
                </div>
              )}

              {renderTranslationComponent()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;