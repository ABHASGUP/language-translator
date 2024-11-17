import { useState, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startListening = useCallback(async (options: SpeechRecognitionOptions = {}) => {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in your browser.');
    }

    // Clear any existing recognition instance
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognitionRef.current = recognition;

    // Configure recognition
    recognition.continuous = options.continuous ?? true;
    recognition.interimResults = options.interimResults ?? true;
    recognition.lang = options.language ?? 'en-US';

    // Increase accuracy
    recognition.maxAlternatives = 1;

    // Add noise reduction settings
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        // Keep the stream active
        stream.getTracks().forEach(track => track.enabled = true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onresult = (event: any) => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          // Remove duplicate words using a simple algorithm
          const newText = result[0].transcript.trim();
          const words = newText.split(' ');
          const uniqueWords = words.filter((word, index, array) => {
            // Check if this word is not a duplicate of the previous word
            return word !== array[index - 1];
          });
          finalTranscript += ' ' + uniqueWords.join(' ');
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Set a timeout to update the transcript only after a brief pause
      timeoutRef.current = setTimeout(() => {
        setTranscript((finalTranscript + interimTranscript).trim());
      }, 250);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Handle no speech detected
        stopListening();
      }
    };

    recognition.onend = () => {
      // Only stop listening if we're not meant to be continuous
      if (!options.continuous) {
        stopListening();
      } else {
        // Restart recognition if it ends unexpectedly while still listening
        if (isListening) {
          recognition.start();
        }
      }
    };

    recognition.start();
    setIsListening(true);

    return recognition;
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  };
}