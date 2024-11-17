import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BookOpen } from 'lucide-react';
import type { Lesson } from '../types';
import { TranslationBox } from './TranslationBox';

interface Props {
  lesson: Lesson;
  onClick: (id: string) => void;
  selectedLanguage: string;
}

export function LessonCard({ lesson, onClick, selectedLanguage }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl p-6 shadow-lg ${
        lesson.completed ? 'border-2 border-green-400' : ''
      }`}
    >
      <div 
        className="flex justify-between items-start mb-3 cursor-pointer"
        onClick={() => onClick(lesson.id)}
      >
        <h3 className="text-xl font-bold text-indigo-900">{lesson.title}</h3>
        {lesson.completed ? (
          <Trophy className="text-green-400 w-6 h-6" />
        ) : (
          <BookOpen className="text-indigo-600 w-6 h-6" />
        )}
      </div>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-indigo-600">Level {lesson.level}</span>
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
          {lesson.xp} XP
        </span>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full btn btn-primary mb-4"
      >
        {isExpanded ? 'Hide Translation' : 'Practice Translation'}
      </button>

      {isExpanded && (
        <TranslationBox
          sourceLang="en"
          targetLang={selectedLanguage}
        />
      )}
    </motion.div>
  );
}