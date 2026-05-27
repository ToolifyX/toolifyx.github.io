"use client";

/**
 * SEO Title: PDF Merge - Combine PDF Files Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Combine, FileText, X, Zap } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
    e.target.value = '';
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      setResult({
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        name: 'merged.pdf'
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
      <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4">
        <div
          className="border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-muted/50 border-muted-foreground/20"
          onClick={() => document.getElementById('pdf-input')?.click()}
        >
          <FileText className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium">Select PDF files to merge</p>
          <input id="pdf-input" type="file" accept=".pdf" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Files ({files.length})</span>
              <button onClick={() => setFiles([])} className="text-[10px] uppercase font-bold text-destructive hover:underline">Clear All</button>
            </div>
            <div className="grid gap-1.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 border rounded-lg animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center space-x-2 min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-[11px] font-bold truncate">{f.name}</p>
                  </div>
                  <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-1 hover:text-destructive transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {files.length >= 2 && (
        <button
          onClick={mergePdfs}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Combine className="w-4 h-4" />}
          Merge {files.length} PDF Files
        </button>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
      {isProcessing && (
        <div className="space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-bold">Merging documents...</p>
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
             <FileText className="w-16 h-16 text-primary" />
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-bold">{result.name}</h3>
             <p className="text-xs text-muted-foreground">Ready for download</p>
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
