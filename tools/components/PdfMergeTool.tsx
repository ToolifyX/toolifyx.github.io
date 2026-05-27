"use client";

/**
 * SEO Title: PDF Merge - Combine PDF Files Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Combine } from 'lucide-react';
import PDFUploader from '@/components/PDFUploader';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';

type ToolStatus = 'idle' | 'processing' | 'done';

export default function PdfMergeTool() {
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
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="card border rounded-lg p-3 bg-card shadow-sm space-y-4">
        <PDFUploader files={files} onChange={setFiles} />
      </div>

      {files.length >= 2 && (
        <button
          onClick={mergePdfs}
          disabled={status === 'processing'}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
        >
          {status === 'processing' ? (
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Merging {progress.current} of {progress.total}...
            </>
          ) : (
            <>
                <Combine className="w-4 h-4" />
                Merge {files.length} PDF Files
            </>
          )}
        </button>
      )}

      {status === 'processing' && (
        <ResultPanel
          isProcessing={status === 'processing'}
          results={[]}
          progress={progress}
          onDownload={() => {}}
          onDownloadAll={() => {}}
        />
      )}
    </div>
  );
}
