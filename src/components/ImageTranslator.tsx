import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import Tesseract from 'tesseract.js';

interface Props {
  sourceLang: Language;
  targetLang: Language;
}

export function ImageTranslator({ sourceLang, targetLang }: Props) {
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { translate } = useTranslation();

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setExtractedText('');
    setTranslatedText('');
    setError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Process image using Tesseract.js
      const { data: { text } } = await Tesseract.recognize(file, sourceLang.code, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      if (!text.trim()) {
        throw new Error('No text could be extracted from the image');
      }

      setExtractedText(text);

      // Translate the extracted text
      const translated = await translate(text, targetLang.code);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Error processing image:', error);
      setError(error instanceof Error ? error.message : 'Error processing image');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceLang.code, targetLang.code, translate]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Clear previous preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    await processImage(file);
  }, [processImage, preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the image here...'
            : 'Drag & drop an image, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PNG, JPG, JPEG, GIF, WebP, BMP (max 10MB)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-indigo-600 p-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing your image...</span>
        </div>
      )}

      {preview && !error && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <img
            src={preview}
            alt="Image preview"
            className="max-w-full h-auto rounded-lg"
            onError={() => {
              setPreview('');
              setError('Error loading image preview');
            }}
          />
        </div>
      )}

      {(extractedText || translatedText) && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Extracted Text ({sourceLang.name})
            </label>
            <div className="relative">
              <textarea
                value={extractedText}
                readOnly
                className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
                rows={8}
                dir={sourceLang.direction}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Translated Text ({targetLang.name})
            </label>
            <div className="relative">
              <textarea
                value={translatedText}
                readOnly
                className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
                rows={8}
                dir={targetLang.direction}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}