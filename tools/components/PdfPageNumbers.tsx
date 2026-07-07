"use client";

/**
 * SEO Title: Add Page Numbers to PDF Online - Free PDF Tool
 * Meta Description: Easily insert page numbers into your PDF documents. Choose positions, font sizes, and ranges. Fast, free, and secure client-side processing.
 */

import React, { useState } from 'react';
import { Download, Loader2, Zap, Settings2, Hash } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile } from '@/lib/utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PdfPageNumbers() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [isProcessing, setIsProcessing] = useState(false);

  const addNumbers = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const total = pages.length;

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const text = `${i + 1} / ${total}`;
      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      let x = 0;
      if (alignment === 'left') x = 50;
      else if (alignment === 'center') x = (width - textWidth) / 2;
      else x = width - textWidth - 50;

      let y = position === 'top' ? height - 30 : 30;

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const blob = await addNumbers(files[0]);
      downloadFile(blob, `numbered_${files[0].name}`);
    } catch (err) {
      console.error(err);
      alert("Failed to add page numbers.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <UploadPanel files={files} onChange={setFiles} maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

           <div className="card border-2 border-dashed rounded-2xl h-[400px] flex items-center justify-center text-muted-foreground italic bg-muted/10 relative">
              {files.length > 0 ? (
                <div className="text-center animate-in zoom-in-95 duration-500 p-10 bg-background shadow-2xl rounded-2xl border">
                   <Hash className="w-12 h-12 text-primary mx-auto mb-4" />
                   <p className="font-bold text-foreground">{files[0].name}</p>
                   <p className="text-xs">Page numbers will be added to all pages</p>
                </div>
              ) : (
                "Upload a PDF to configure page numbering"
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
               <Settings2 className="w-4 h-4" /> Position Config
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vertical Position</label>
                <div className="grid grid-cols-2 gap-2">
                   {['top', 'bottom'].map(p => (
                     <button
                        key={p}
                        onClick={() => setPosition(p as any)}
                        className={`py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${position === p ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 hover:bg-muted'}`}
                     >
                       {p}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Horizontal Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                   {['left', 'center', 'right'].map(a => (
                     <button
                        key={a}
                        onClick={() => setAlignment(a as any)}
                        className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${alignment === a ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 hover:bg-muted'}`}
                     >
                       {a}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              Add Page Numbers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
