"use client";

/**
 * SEO Title: PDF Split - Split PDF Pages into Separate Files
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, Scissors, FileText, X, Settings2 } from 'lucide-react';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import ResultPanel from '@/components/tool-layout/ResultPanel';

export default function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string, url: string } | null>(null);

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      if (pageNumber < 1 || pageNumber > pageCount) {
        alert(`Please enter a page number between 1 and ${pageCount}`);
        return;
      }

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResult({
        blob,
        name: `page_${pageNumber}_of_${file.name}`,
        url: URL.createObjectURL(blob)
      });
    } catch (err) {
      console.error(err);
      alert('Error splitting PDF');
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
      originalSize: file?.size || 0,
      compressedSize: result.blob.size,
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
          title="PDF Page Extracted"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4">
        {!file ? (
          <div
            className="border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-muted/50 border-muted-foreground/20"
            onClick={() => document.getElementById('split-input')?.click()}
          >
            <FileText className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm font-medium">Select PDF to split</p>
            <input id="split-input" type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4 animate-in fade-in duration-300">
           <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
               <Settings2 className="w-3 h-3" /> Split Options
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground/60">Page Number to Extract</label>
              <input
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />
            </div>
          </div>

          <button
            onClick={splitPdf}
            disabled={isProcessing}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
            Extract Page
          </button>
        </div>
      )}

      {isProcessing && (
        <ResultPanel
          isProcessing={isProcessing}
          results={[]}
          onDownload={() => {}}
          onDownloadAll={() => {}}
        />
      )}
    </div>
  );
}
