"use client";

/**
 * SEO Title: Online PDF OCR - Extract Text from Scanned PDFs
 * Meta Description: AI-powered OCR for PDF files. Convert scanned PDFs into searchable text. Fast, free, and secure client-side OCR tool.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, ScanText, Copy, Trash2, FileSearch } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile, copyToClipboard } from '@/lib/utils';

export default function PdfOcr() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [tesseract, setTesseract] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load PDF.js
      const pdfScript = document.createElement('script');
      pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      pdfScript.async = true;
      pdfScript.onload = () => {
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjs(pdfjsLib);
      };
      document.body.appendChild(pdfScript);

      // Load Tesseract.js
      const tessScript = document.createElement('script');
      tessScript.src = 'https://unpkg.com/tesseract.js@v5.0.3/dist/tesseract.min.js';
      tessScript.async = true;
      tessScript.onload = () => {
        setTesseract(() => (window as any).Tesseract);
      };
      document.body.appendChild(tessScript);
    }
  }, []);

  const runOcrOnPdf = async (file: File) => {
    if (!pdfjs || !tesseract) return '';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      setStatus(`Rendering Page ${i} of ${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;

      setStatus(`AI Scanning Page ${i}...`);
      const { data: { text } } = await tesseract.recognize(
        canvas,
        'eng',
        { logger: (m: any) => {
          if (m.status === 'recognizing text') {
            const pageProgress = m.progress;
            setProgress(Math.round(((i - 1 + pageProgress) / pdf.numPages) * 100));
          }
        }}
      );
      fullText += `--- Page ${i} ---\n${text}\n\n`;
    }
    return fullText;
  };

  const handleProcess = async () => {
    if (files.length === 0 || !pdfjs || !tesseract) return;
    setIsProcessing(true);
    setResultText('');
    setProgress(0);

    try {
      const text = await runOcrOnPdf(files[0]);
      setResultText(text);
      setStatus('Success');
    } catch (err) {
      console.error(err);
      alert("AI Scan failed. Try a smaller PDF.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatus('');
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {(!pdfjs || !tesseract) && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3 text-purple-600">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span className="text-xs font-bold uppercase tracking-widest">Waking up AI OCR Engine...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
           <UploadPanel files={files} onChange={setFiles} maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

           {files.length > 0 && !resultText && !isProcessing && (
             <button
                onClick={handleProcess}
                disabled={!pdfjs || !tesseract}
                className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
             >
                <ScanText className="w-4 h-4" /> Start AI PDF Scan
             </button>
           )}

           {isProcessing && (
             <div className="card border rounded-2xl p-8 bg-card flex flex-col items-center justify-center space-y-4 shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <div className="text-center space-y-1">
                   <p className="text-sm font-black uppercase tracking-widest">{status || 'Extracting...'}</p>
                   <p className="text-[10px] font-bold text-muted-foreground">{progress}% complete</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-xs">
                   <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-7 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[500px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Searchable Result</span>
                {resultText && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => downloadFile(new Blob([resultText]), 'ocr_result.txt')} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors" title="Download .txt">
                       <Download className="w-4 h-4" />
                    </button>
                    <button onClick={async () => { await copyToClipboard(resultText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-[10px] font-black text-primary uppercase hover:underline">
                       {copied ? 'Copied!' : 'Copy'}
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
                placeholder="The AI-extracted searchable text will appear here..."
                value={resultText}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
