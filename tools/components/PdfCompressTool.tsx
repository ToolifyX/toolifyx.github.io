"use client";

/**
 * SEO Title: PDF Compressor - Reduce PDF File Size Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Shrink, FileText, X, Zap } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import ResultPanel from '@/components/tool-layout/ResultPanel';

export default function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string, originalSize: number, compressedSize: number, url: string } | null>(null);

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      setResult({
        blob,
        name: `compressed_${file.name}`,
        originalSize: file.size,
        compressedSize: pdfBytes.length,
        url: URL.createObjectURL(blob)
      });
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  if (result && !isProcessing) {
    const mockProcessedResult = {
      blob: result.blob,
      url: result.url,
      name: result.name,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      width: 0,
      height: 0
    };

    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={[mockProcessedResult]}
          onReset={handleReset}
          onDownload={(res) => downloadFile(res.blob, res.name)}
          onDownloadAll={() => downloadFile(result.blob, result.name)}
          title="PDF Compressed"
        />
      </div>
    );
  }

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
    <ResultPanel
      isProcessing={isProcessing}
      results={[]}
      onDownload={() => {}}
      onDownloadAll={() => {}}
      emptyMessage="Compressed PDF will appear here"
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
