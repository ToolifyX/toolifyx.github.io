"use client";

/**
 * SEO Title: PDF Compressor - Reduce PDF File Size Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Shrink, FileText, X, Zap } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';

export default function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string, originalSize: number, compressedSize: number } | null>(null);

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pdfBytes = await pdf.save({ useObjectStreams: true });

      setResult({
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        name: `compressed_${file.name}`,
        originalSize: file.size,
        compressedSize: pdfBytes.length
      });
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const leftPanel = (
    <div className="space-y-4">
      <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4">
        {!file ? (
          <div
            className="border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-muted/50 border-muted-foreground/20"
            onClick={() => document.getElementById('compress-input')?.click()}
          >
            <FileText className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm font-medium">Select PDF to compress</p>
            <input id="compress-input" type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 min-w-0">
              <FileText className="w-6 h-6 text-primary shrink-0" />
              <p className="text-xs font-bold truncate">{file.name}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="p-1 hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={compressPdf}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shrink className="w-4 h-4" />}
          Compress PDF
        </button>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
      {isProcessing && (
        <div className="space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-bold">Compressing file...</p>
        </div>
      )}

      {!isProcessing && !result && (
        <div className="opacity-30 space-y-2">
          <Zap className="w-12 h-12 mx-auto" />
          <p className="text-sm font-medium">Compressed PDF will appear here</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
           <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 inline-block mx-auto relative">
             <Shrink className="w-16 h-16 text-primary" />
             <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
               -{Math.round((1 - result.compressedSize / result.originalSize) * 100)}%
             </span>
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-bold">{result.name}</h3>
             <div className="flex items-center justify-center gap-2 text-xs">
               <span className="text-muted-foreground line-through">{(result.originalSize / 1024).toFixed(1)} KB</span>
               <span className="font-bold text-green-600">{(result.compressedSize / 1024).toFixed(1)} KB</span>
             </div>
           </div>
           <button
             onClick={() => downloadFile(result.blob, result.name)}
             className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
           >
             <FileText className="w-4 h-4" /> Download Compressed PDF
           </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
