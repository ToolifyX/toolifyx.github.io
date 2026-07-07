"use client";

/**
 * SEO Title: PDF to Text Converter - Extract Text from PDF Online
 * Meta Description: Extract plain text from your PDF files instantly. Fast, free, and secure client-side extraction. Preserves layout and supports large PDFs.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, FileText, Copy, Trash2 } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile, copyToClipboard } from '@/lib/utils';

export default function PdfToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState('');
  const [progress, setProgress] = useState(0);
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjs(pdfjsLib);
      };
      document.body.appendChild(script);
    }
  }, []);

  const extractText = async (file: File) => {
    if (!pdfjs) return '';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress(Math.round((i / pdf.numPages) * 100));
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    return fullText;
  };

  const handleProcess = async () => {
    if (files.length === 0 || !pdfjs) return;
    setIsProcessing(true);
    setResultText('');

    try {
      let combinedText = '';
      for (const file of files) {
        combinedText += `=== File: ${file.name} ===\n\n`;
        combinedText += await extractText(file);
        combinedText += '\n\n';
      }
      setResultText(combinedText);
    } catch (err) {
      console.error(err);
      alert("Failed to extract text. The PDF might be an image-only scan or encrypted.");
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

  const handleDownload = () => {
    const blob = new Blob([resultText], { type: 'text/plain' });
    downloadFile(blob, 'extracted_text.txt');
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {!pdfjs && (
        <div className="p-4 bg-slate-500/10 border border-slate-500/20 rounded-xl flex items-center gap-3 text-slate-600">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span className="text-xs font-bold uppercase tracking-widest">Loading Text Engine...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
           <UploadPanel files={files} onChange={setFiles} maxFiles={3} accept={{ 'application/pdf': ['.pdf'] }} />

           {files.length > 0 && !resultText && !isProcessing && (
             <button
                onClick={handleProcess}
                disabled={!pdfjs}
                className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
             >
                <FileText className="w-4 h-4" /> Extract Text from PDF
             </button>
           )}

           {isProcessing && (
             <div className="card border rounded-2xl p-8 bg-card flex flex-col items-center justify-center space-y-4 shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <div className="text-center space-y-1">
                   <p className="text-sm font-black uppercase tracking-widest">Reading PDF...</p>
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
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Extracted Text</span>
                {resultText && (
                  <div className="flex items-center gap-3">
                    <button onClick={handleDownload} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors" title="Download .txt">
                       <Download className="w-4 h-4" />
                    </button>
                    <button onClick={handleCopy} className="text-[10px] font-black text-primary uppercase hover:underline">
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
                placeholder="The extracted plain text will appear here..."
                value={resultText}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
