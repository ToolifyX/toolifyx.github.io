"use client";

/**
 * SEO Title: PDF Page Editor - Remove or Extract PDF Pages Online
 * Meta Description: Easily delete unwanted pages or extract specific pages from your PDF documents. Fast, secure, and client-side PDF page management.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, Trash2, Scissors, FileText, CheckCircle2 } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';
import { Tool } from '@/tools/types';

interface Props {
  tool: Tool;
}

export default function PdfPageEditor({ tool }: Props) {
  const isExtract = tool.slug === 'extract-pdf-pages';
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (files.length === 0) {
        setPdfDoc(null);
        setPageCount(0);
        setSelectedPages(new Set());
        return;
      }
      try {
        const buffer = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        setPdfDoc(doc);
        setPageCount(doc.getPageCount());
      } catch (err) {
        console.error(err);
        alert("Failed to load PDF.");
      }
    };
    loadPdf();
  }, [files]);

  const togglePage = (index: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setSelectedPages(newSet);
  };

  const handleProcess = async () => {
    if (!pdfDoc || selectedPages.size === 0) return;
    setIsProcessing(true);

    try {
      const newPdf = await PDFDocument.create();
      const pagesToKeep = isExtract
        ? Array.from(selectedPages).sort((a, b) => a - b)
        : Array.from({ length: pageCount }, (_, i) => i).filter(i => !selectedPages.has(i));

      if (pagesToKeep.length === 0) {
        alert("You must keep at least one page.");
        return;
      }

      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadFile(blob, `${isExtract ? 'extracted' : 'edited'}_document.pdf`);
    } catch (err) {
      console.error(err);
      alert("Processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <UploadPanel files={files} onChange={setFiles} maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

      {pageCount > 0 && (
        <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Select Pages to {isExtract ? 'Extract' : 'Remove'}</h3>
                <p className="text-xs text-muted-foreground font-medium">Click on pages to toggle selection</p>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setSelectedPages(new Set(Array.from({length: pageCount}, (_, i) => i)))} className="text-[10px] font-bold uppercase tracking-widest hover:text-primary">Select All</button>
                 <button onClick={() => setSelectedPages(new Set())} className="text-[10px] font-bold uppercase tracking-widest hover:text-primary">Clear</button>
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => togglePage(i)}
                  className={`aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center relative transition-all group overflow-hidden ${selectedPages.has(i) ? 'border-primary bg-primary/5 shadow-inner' : 'border-border bg-muted/20 hover:border-primary/50'}`}
                >
                   <span className={`text-xl font-black ${selectedPages.has(i) ? 'text-primary' : 'text-muted-foreground'}`}>{i + 1}</span>
                   <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">Page</span>
                   {selectedPages.has(i) && (
                     <div className="absolute top-2 right-2 text-primary animate-in zoom-in-50 duration-300">
                        <CheckCircle2 className="w-4 h-4 fill-current text-white bg-primary rounded-full" />
                     </div>
                   )}
                </button>
              ))}
           </div>

           <div className="flex flex-col md:flex-row gap-4 items-center pt-6 border-t">
              <div className="flex-1 text-center md:text-left">
                 <p className="text-sm font-bold text-foreground">{selectedPages.size} pages selected</p>
                 <p className="text-xs text-muted-foreground font-medium">
                    {isExtract ? 'Only these pages will be in the new PDF' : 'These pages will be deleted from the document'}
                 </p>
              </div>
              <button
                onClick={handleProcess}
                disabled={isProcessing || selectedPages.size === 0}
                className={`bg-primary text-primary-foreground px-8 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg ${isExtract ? '' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (isExtract ? <Scissors className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />)}
                {isExtract ? 'Extract Selection' : 'Remove Selected Pages'}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
