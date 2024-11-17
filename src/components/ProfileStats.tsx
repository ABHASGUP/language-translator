import React from 'react';
import { Flame, Star, Trophy, BookOpen } from 'lucide-react';
import type { UserType } from '../types';
import { languages } from '../data/languages';

interface Props {
  user: UserType;
}

export function ProfileStats({ user }: Props) {
  const learningLanguage = languages.find(l => l.code === user.learningLanguage);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">{user.name}</h2>
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500 w-6 h-6" />
            <span className="font-bold text-lg">{user.streak} days</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-500 w-5 h-5" />
              <span className="font-medium">Level</span>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{user.level}</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-purple-500 w-5 h-5" />
              <span className="font-medium">XP</span>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{user.xp}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-600 w-5 h-5" />
            <h3 className="font-semibold">Learning Language</h3>
          </div>
          {learningLanguage ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{learningLanguage.flag}</span>
                <div>
                  <p className="font-medium text-lg">{learningLanguage.name}</p>
                  <p className="text-gray-600">{user.proficiencyLevel}</p>
                </div>
              </div>
              {user.learningMotivation && (
                <p className="mt-3 text-gray-600 border-t pt-3">
                  "{user.learningMotivation}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No language selected yet</p>
          )}
        </div>
      </div>
    </div>
  );
}