import { useState, useCallback } from 'react';
import { translateText } from '../services/translationService';

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await translateText(text, targetLang);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    translate,
    isLoading,
    error
  };
}