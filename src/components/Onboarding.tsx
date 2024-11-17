import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Target, Brain, User } from 'lucide-react';
import type { Language, OnboardingState, ProficiencyLevel } from '../types';
import { LanguageCard } from './LanguageCard';
import { languages } from '../data/languages';
import { validateName, validateMotivation } from '../utils/validation';

interface Props {
  state: OnboardingState;
  onStateChange: (updates: Partial<OnboardingState>) => void;
  onComplete: () => void;
  existingUser: boolean;
}

export function Onboarding({ state, onStateChange, onComplete, existingUser }: Props) {
  const [nameError, setNameError] = useState('');
  const [motivationError, setMotivationError] = useState('');

  const handleLanguageSelect = (language: Language) => {
    onStateChange({ selectedLanguage: language, step: existingUser ? 2 : 1 });
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(state.name)) {
      setNameError('Please enter a valid name (2-50 letters, spaces, or hyphens)');
      return;
    }
    onStateChange({ step: 2 });
  };

  const handleMotivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMotivation(state.motivation)) {
      setMotivationError('Please enter a valid motivation (10-500 characters)');
      return;
    }
    onStateChange({ step: 3 });
  };

  const handleProficiencySelect = (level: ProficiencyLevel) => {
    onStateChange({ proficiency: level });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {state.step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-indigo-900">What would you like to learn?</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.code}
                  language={lang}
                  onClick={() => handleLanguageSelect(lang)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {state.step === 1 && !existingUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <User className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-indigo-900">What's your name?</h1>
            </div>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => {
                    onStateChange({ name: e.target.value });
                    setNameError('');
                  }}
                  className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your name..."
                  required
                />
                {nameError && (
                  <p className="mt-2 text-sm text-red-600">{nameError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {state.step === 2 && state.selectedLanguage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Target className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-indigo-900">
                Why are you learning {state.selectedLanguage.name}?
              </h1>
            </div>
            <form onSubmit={handleMotivationSubmit} className="space-y-4">
              <div>
                <textarea
                  value={state.motivation}
                  onChange={(e) => {
                    onStateChange({ motivation: e.target.value });
                    setMotivationError('');
                  }}
                  className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Share your motivation..."
                  required
                />
                {motivationError && (
                  <p className="mt-2 text-sm text-red-600">{motivationError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {state.step === 3 && state.selectedLanguage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-indigo-900">
                How much {state.selectedLanguage.name} do you know?
              </h1>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => handleProficiencySelect('beginner')}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <h3 className="font-semibold text-lg mb-1">Beginner</h3>
                <p className="text-gray-600">I'm just starting out</p>
              </button>
              <button
                onClick={() => handleProficiencySelect('intermediate')}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <h3 className="font-semibold text-lg mb-1">Intermediate</h3>
                <p className="text-gray-600">I can have basic conversations</p>
              </button>
              <button
                onClick={() => handleProficiencySelect('advanced')}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <h3 className="font-semibold text-lg mb-1">Advanced</h3>
                <p className="text-gray-600">I'm quite fluent but want to improve</p>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}