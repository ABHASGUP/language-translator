import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Volume2, 
  Image as ImageIcon,
  Video, 
  Globe
} from 'lucide-react';
import type { TranslationMode } from '../types';

interface Props {
  onModeSelect: (mode: TranslationMode) => void;
  currentMode: TranslationMode | null;
}

export function TranslationModes({ onModeSelect, currentMode }: Props) {
  const modes = [
    {
      id: 'speech-to-text' as TranslationMode,
      icon: Mic,
      title: 'Speech to Text',
      description: 'Translate spoken words instantly'
    },
    {
      id: 'text-to-speech' as TranslationMode,
      icon: Volume2,
      title: 'Text to Speech',
      description: 'Convert text to spoken words'
    },
    {
      id: 'image-to-text' as TranslationMode,
      icon: ImageIcon,
      title: 'Image Text Translation',
      description: 'Extract and translate text from images'
    },
    {
      id: 'video-to-text' as TranslationMode,
      icon: Video,
      title: 'Video Translation',
      description: 'Translate speech from videos'
    },
    {
      id: 'website-translation' as TranslationMode,
      icon: Globe,
      title: 'Website Translation',
      description: 'Translate entire websites'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = currentMode === mode.id;

        return (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onModeSelect(mode.id)}
            className={`p-6 rounded-xl text-left transition-colors ${
              isSelected
                ? 'bg-indigo-100 border-2 border-indigo-500'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon className={`w-8 h-8 mb-4 ${
              isSelected ? 'text-indigo-600' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              isSelected ? 'text-indigo-900' : 'text-gray-900'
            }`}>
              {mode.title}
            </h3>
            <p className="text-sm text-gray-600">
              {mode.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}