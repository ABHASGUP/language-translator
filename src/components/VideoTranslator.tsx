import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Video, Loader2, Volume2, AlertCircle } from 'lucide-react';
import type { Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Props {
  sourceLang: Language;
  targetLang: Language;
}

export function VideoTranslator({ sourceLang, targetLang }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const recognitionRef = useRef<any>(null);
  
  const { translate } = useTranslation();
  const { speak } = useSpeechSynthesis();

  const startSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser');
      return null;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = sourceLang.code;

    let finalTranscript = '';

    recognition.onresult = async (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          const newText = result[0].transcript.trim();
          finalTranscript += ' ' + newText;
          setTranscription(finalTranscript.trim());
          
          try {
            const translatedText = await translate(newText, targetLang.code);
            setTranslation(prev => {
              const updatedTranslation = prev + ' ' + translatedText;
              return updatedTranslation.trim();
            });
          } catch (err) {
            console.error('Translation error:', err);
          }
        } else {
          interimTranscript += result[0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    return recognition;
  }, [sourceLang.code, targetLang.code, isRecording, translate]);

  const handleStartRecording = useCallback(async () => {
    setError(null);
    setTranscription('');
    setTranslation('');
    setIsTranslating(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (webcamRef.current) {
        webcamRef.current.video!.srcObject = stream;
      }

      setHasPermission(true);
      recognitionRef.current = startSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setHasPermission(false);
      setError('Failed to access camera or microphone. Please check your permissions.');
    }
  }, [startSpeechRecognition]);

  const handleStopRecording = useCallback(async () => {
    setIsTranslating(true);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    setIsTranslating(false);

    // Speak the final translation after stopping
    if (translation) {
      setTimeout(() => {
        speak(translation, targetLang.code);
      }, 500); // Small delay to ensure final translation is processed
    }
  }, [translation, targetLang.code, speak]);

  if (hasPermission === false) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-medium">Permission Required</h3>
        </div>
        <p className="text-red-700">
          Please allow access to your camera and microphone to use the video translator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="w-full h-full object-cover"
        />
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Recording
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isTranslating}
          className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${
            isRecording
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Stop Recording
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Start Recording
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {(transcription || translation) && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Transcription ({sourceLang.name})
              </label>
              <button
                onClick={() => speak(transcription, sourceLang.code)}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!transcription}
              >
                <Volume2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <textarea
              value={transcription}
              readOnly
              className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
              rows={6}
              dir={sourceLang.direction}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Translation ({targetLang.name})
              </label>
              <button
                onClick={() => speak(translation, targetLang.code)}
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!translation}
              >
                <Volume2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <textarea
              value={translation}
              readOnly
              className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
              rows={6}
              dir={targetLang.direction}
            />
          </div>
        </div>
      )}
    </div>
  );
}