import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    throw new Error('Translation API key is not configured');
  }

  try {
    if (!text.trim()) {
      return '';
    }

    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLang,
        format: 'text'
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Translation failed: ${error.response.data.error?.message || 'Unknown error'}`);
    }
    throw new Error('Failed to translate text');
  }
}