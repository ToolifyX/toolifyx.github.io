"use client";

/**
 * SEO Title: PDF Merge - Combine PDF Files Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Combine, Zap, RotateCcw } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import PDFUploader from '@/components/PDFUploader';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';

import EditorLayout from '@/components/tool-layout/EditorLayout';
import FileList from '@/components/tool-layout/FileList';
import { Tool } from '@/tools/types';

type ToolStatus = 'idle' | 'processing' | 'done';

export default function PdfMergeTool({ tool }: { tool?: Tool }) {
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ blob: Blob, name: string, originalSize: number, compressedSize: number, url: string } | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setStatus('processing');
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
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

      setResult({
        blob,
        name: 'merged.pdf',
        originalSize: files.reduce((acc, f) => acc + f.size, 0),
        compressedSize: blob.size,
        url: URL.createObjectURL(blob)
      });
      setStatus('done');
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs');
      setStatus('idle');
    } finally {
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setStatus('idle');
  };

  // 1. Result State
  if (status === 'done' && result) {
    // PDF result is a single file, but ResultScreen expects an array of ProcessedResult for list rendering
    // I will adapt the PDF result to the interface expected by ResultScreen/ResultList
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
          title="PDF Files Merged"
        />
      </div>
    );
  }

  // 2. Idle or Processing
  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button
          onClick={mergePdfs}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all"
        >
          <Combine className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Merge PDF</span>
        </button>
        <div className="h-px bg-border my-2" />
        <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
          <RotateCcw className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Reset</span>
        </button>
      </div>

      {files.length > 0 && (
        <div className="pt-4 border-t border-border">
          <FileList
            files={files}
            onRemove={(idx) => setFiles(prev => prev.filter((_, i) => i !== idx))}
            onClear={() => setFiles([])}
          />
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <ResultPanel
      isProcessing={status === 'processing'}
      results={[]}
      progress={progress}
      onDownload={() => {}}
      onDownloadAll={() => {}}
      emptyMessage="Merged PDF will appear here"
    />
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('merge-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Combine className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload PDFs to merge</h4>
            <p className="text-sm text-muted-foreground font-medium">Combine multiple documents into one</p>
          </div>
          <input id="merge-upload" type="file" multiple className="hidden" accept=".pdf" onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
          }} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
           <div className="w-32 h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative">
              <FileText className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-full shadow-lg">
                {files.length}
              </div>
           </div>
           <div className="text-center space-y-1">
              <h4 className="text-xl font-bold uppercase tracking-tight">PDFs ready for merging</h4>
              <p className="text-sm text-muted-foreground font-medium uppercase">
                {files.length} documents selected
              </p>
           </div>
           <button
             onClick={() => document.getElementById('merge-upload')?.click()}
             className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
           >
             Add more files
           </button>
           <input id="merge-upload" type="file" multiple className="hidden" accept=".pdf" onChange={(e) => {
             const newFiles = Array.from(e.target.files || []);
             if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
           }} />
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "PDF Merge"}
      toolIcon={tool?.icon}
      fileName={files.length > 0 ? `${files.length} Files selected` : undefined}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      onDownload={result ? () => downloadFile(result.blob, result.name) : undefined}
    />
  );
}

import { FileText } from 'lucide-react';
