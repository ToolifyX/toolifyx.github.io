"use client";

/**
 * SEO Title: PDF Merge - Combine PDF Files Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Combine, Zap } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import PDFUploader from '@/components/PDFUploader';
import ResultPanel from '@/components/tool-layout/ResultPanel';

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string, originalSize: number, compressedSize: number, url: string } | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setResult(null);
    setProgress({ current: 0, total: files.length });

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const arrayBuffer = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      setResult({
        blob,
        name: 'merged.pdf',
        originalSize: files.reduce((acc, f) => acc + f.size, 0),
        compressedSize: blob.size,
        url: URL.createObjectURL(blob)
      });
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const leftPanel = (
    <div className="space-y-4">
      <div className="card border rounded-lg p-3 bg-card shadow-sm space-y-4">
        <PDFUploader files={files} onChange={setFiles} />
      </div>

      {files.length >= 2 && (
        <button
          onClick={mergePdfs}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? (
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing {progress.current} of {progress.total} files...
            </>
          ) : (
            <>
                <Combine className="w-4 h-4" />
                Process {files.length} files
            </>
          )}
        </button>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
      {isProcessing && (
        <div className="space-y-4 w-full px-10">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-bold">Merging documents...</p>
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {!isProcessing && !result && (
        <div className="opacity-30 space-y-2">
          <Zap className="w-12 h-12 mx-auto" />
          <p className="text-sm font-medium">Processed PDF will appear here</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
           <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 inline-block mx-auto">
             < Combine className="w-16 h-16 text-primary" />
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-bold">{result.name}</h3>
             <p className="text-xs text-muted-foreground">Ready for download ({(result.compressedSize / 1024 / 1024).toFixed(2)} MB)</p>
           </div>
           <button
             onClick={() => downloadFile(result.blob, result.name)}
             className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
           >
             <Combine className="w-4 h-4" /> Download Merged PDF
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
