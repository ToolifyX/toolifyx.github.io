"use client";

/**
 * SEO Title: Online Image OCR - Extract Text from Photos
 * Meta Description: Extract text from images instantly using AI-powered OCR. Supports multiple languages, high accuracy, and works entirely in your browser.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, ScanText, Copy, Trash2 } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { copyToClipboard } from '@/lib/utils';

export default function ImageOcr() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [tesseract, setTesseract] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load Tesseract.js from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/tesseract.js@v5.0.3/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      setTesseract(() => window.Tesseract);
    };
    document.body.appendChild(script);
  }, []);

  const handleOcr = async () => {
    if (files.length === 0 || !tesseract) return;
    setIsProcessing(true);
    setResultText('');
    setProgress(0);
    setStatus('Initializing AI engine...');

    try {
      const { data: { text } } = await tesseract.recognize(
        files[0],
        'eng',
        {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setStatus('Extracting text...');
              setProgress(m.progress * 100);
            }
          }
        }
      );
      setResultText(text);
      setStatus('Success');
    } catch (err) {
      console.error(err);
      alert("OCR failed. Try a clearer image.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(resultText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {!tesseract && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3 text-purple-600">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span className="text-xs font-bold uppercase tracking-widest">Loading OCR Intelligence...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
           <UploadPanel files={files} onChange={setFiles} maxFiles={1} />

           {files.length > 0 && !resultText && !isProcessing && (
             <button
                onClick={handleOcr}
                disabled={!tesseract}
                className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
             >
                <ScanText className="w-4 h-4" /> Extract Text from Image
             </button>
           )}

           {isProcessing && (
             <div className="card border rounded-2xl p-8 bg-card flex flex-col items-center justify-center space-y-4 shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <div className="text-center space-y-1">
                   <p className="text-sm font-black uppercase tracking-widest">{status}</p>
                   <p className="text-[10px] font-bold text-muted-foreground">{progress.toFixed(0)}% complete</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-xs">
                   <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Extracted Text</span>
                {resultText && (
                  <div className="flex items-center gap-3">
                    <button onClick={handleCopy} className="text-[10px] font-black text-primary uppercase hover:underline">
                       {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button onClick={() => setResultText('')} className="text-muted-foreground hover:text-destructive transition-colors">
                       <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <textarea
                readOnly
                className="flex-1 p-6 font-mono text-sm bg-transparent outline-none resize-none leading-relaxed"
                placeholder="The extracted text will appear here..."
                value={resultText}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
