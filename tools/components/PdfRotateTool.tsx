"use client";

/**
 * SEO Title: PDF Rotate - Rotate PDF Pages Permanently
 */

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, RotateCw, FileText, X, Zap, Settings2 } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';

export default function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string } | null>(null);

  const rotatePdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + rotation));
      });

      const pdfBytes = await pdf.save();
      setResult({
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        name: `rotated_${file.name}`
      });
    } catch (err) {
      console.error(err);
      alert('Error rotating PDF');
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
            onClick={() => document.getElementById('rotate-input')?.click()}
          >
            <FileText className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm font-medium">Select PDF to rotate</p>
            <input id="rotate-input" type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
               <Settings2 className="w-3 h-3" /> Rotation Angle
            </div>

            <select
              className="w-full border rounded-lg p-2 text-sm bg-background"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
            >
              <option value="90">Rotate 90° Right</option>
              <option value="180">Rotate 180°</option>
              <option value="270">Rotate 90° Left</option>
            </select>
          </div>

          <button
            onClick={rotatePdf}
            disabled={isProcessing}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
            Rotate & Download
          </button>
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
      {isProcessing && (
        <div className="space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-bold">Rotating pages...</p>
        </div>
      )}

      {!isProcessing && !result && (
        <div className="opacity-30 space-y-2">
          <Zap className="w-12 h-12 mx-auto" />
          <p className="text-sm font-medium">Rotated PDF will appear here</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
           <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 inline-block mx-auto">
             <RotateCw className="w-16 h-16 text-primary" />
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-bold">{result.name}</h3>
             <p className="text-xs text-muted-foreground">Successfully rotated</p>
           </div>
           <button
             onClick={() => downloadFile(result.blob, result.name)}
             className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
           >
             <Download className="w-4 h-4" /> Download PDF
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
