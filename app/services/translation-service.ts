import { GoogleCloudTranslation } from '@nativescript/google-cloud-translation';

const API_KEY = 'AIzaSyA3RseNKhtzJ8ZJDIOsBZoNuyeIEf_5P2Y';
const translator = new GoogleCloudTranslation();

translator.init(API_KEY);

export async function translateText(text: string, targetLang: string): Promise<string> {
    try {
        if (!text.trim()) {
            return '';
        }

        const result = await translator.translate({
            text,
            targetLanguage: targetLang,
        });

        return result.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Failed to translate text');
    }
}