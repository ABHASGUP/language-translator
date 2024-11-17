import React from 'react';
import type { Language } from '../types';

interface Props {
  label: string;
  value: Language;
  onChange: (language: Language) => void;
  languages: Language[];
}

export function LanguageSelector({ label, value, onChange, languages }: Props) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value.code}
        onChange={(e) => {
          const selected = languages.find(l => l.code === e.target.value);
          if (selected) onChange(selected);
        }}
        className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}