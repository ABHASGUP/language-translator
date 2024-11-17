import { useCallback } from 'react';

export function useSpeechSynthesis() {
  const speak = useCallback((text: string, lang: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a voice for the specified language
    const voice = voices.find(v => v.lang.startsWith(lang)) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}