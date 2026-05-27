"use client";

/**
 * SEO Title: Image to PDF - Convert JPG/PNG to PDF Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, FileImage, FileText, Zap } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string } | null>(null);

  const convertToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await pdfDoc.save();
      setResult({
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        name: 'images-converted.pdf'
      });
    } catch (err) {
      console.error(err);
      alert('Error converting images to PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const leftPanel = (
    <div className="space-y-4">
      <UploadPanel files={files} onChange={setFiles} />
      {files.length > 0 && (
        <button
          onClick={convertToPdf}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Generate PDF from {files.length} Images
        </button>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
      {isProcessing && (
        <div className="space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-bold">Generating document...</p>
        </div>
      )}

      {!isProcessing && !result && (
        <div className="opacity-30 space-y-2">
          <Zap className="w-12 h-12 mx-auto" />
          <p className="text-sm font-medium">PDF result will appear here</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
           <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 inline-block mx-auto">
             <FileImage className="w-16 h-16 text-primary" />
           </div>
           <div className="space-y-1 text-center">
             <h3 className="text-lg font-bold">{result.name}</h3>
             <p className="text-xs text-muted-foreground">Successfully converted {files.length} images</p>
           </div>
           <button
             onClick={() => downloadFile(result.blob, result.name)}
             className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
           >
             <FileText className="w-4 h-4" /> Download PDF
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
