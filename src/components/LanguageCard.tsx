import { motion } from 'framer-motion';
import type { Language } from '../types';

interface Props {
  language: Language;
  onClick: (code: string) => void;
}

export function LanguageCard({ language, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => onClick(language.code)}
    >
      <div className="text-4xl mb-3">{language.flag}</div>
      <h3 className="text-xl font-bold text-indigo-900">{language.name}</h3>
    </motion.div>
  );
}