import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Loader2, Download, Upload } from 'lucide-react';
import type { Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

interface Props {
  sourceLang: Language;
  targetLang: Language;
}

export function DocumentTranslator({ sourceLang, targetLang }: Props) {
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { translate } = useTranslation();

  const processDocument = useCallback(async (file: File) => {
    setIsProcessing(true);
    setExtractedText('');
    setTranslatedText('');
    setError(null);

    try {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      let text = '';
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      // Extract text based on file type
      if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { text: pageText } = await page.doc.saveAsBase64({ format: 'text' });
          text += pageText + '\n';
        }
      } else if (
        fileType.includes('word') || 
        fileName.endsWith('.docx') || 
        fileName.endsWith('.doc')
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (
        fileType.includes('text') || 
        fileType.includes('csv') || 
        fileName.endsWith('.txt') || 
        fileName.endsWith('.csv')
      ) {
        text = await file.text();
      } else {
        throw new Error('Unsupported file format');
      }

      if (!text.trim()) {
        throw new Error('No text could be extracted from the document');
      }

      setFileName(file.name);
      setExtractedText(text);

      // Translate the extracted text
      const translated = await translate(text, targetLang.code);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Error processing document:', error);
      setError(error instanceof Error ? error.message : 'Error processing document');
    } finally {
      setIsProcessing(false);
    }
  }, [targetLang.code, translate]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    await processDocument(file);
  }, [processDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processDocument(file);
    }
  };

  const downloadTranslatedFile = async () => {
    if (!translatedText || !fileName) return;

    try {
      const blob = new Blob([translatedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translated_${fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download translated file');
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the document here...'
            : 'Drag & drop a document, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, DOC, DOCX, TXT, CSV (max 10MB)
        </p>
        
        <button
          onClick={handleBrowseClick}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 mx-auto"
        >
          <Upload className="w-4 h-4" />
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-indigo-600 p-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing your document...</span>
        </div>
      )}

      {fileName && !error && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-5 h-5" />
              <span>{fileName}</span>
            </div>
            {translatedText && (
              <button
                onClick={downloadTranslatedFile}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Download Translation
              </button>
            )}
          </div>
        </div>
      )}

      {(extractedText || translatedText) && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Original Text ({sourceLang.name})
            </label>
            <textarea
              value={extractedText}
              readOnly
              className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
              rows={8}
              dir={sourceLang.direction}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Translated Text ({targetLang.name})
            </label>
            <textarea
              value={translatedText}
              readOnly
              className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50 resize-none"
              rows={8}
              dir={targetLang.direction}
            />
          </div>
        </div>
      )}
    </div>
  );
}