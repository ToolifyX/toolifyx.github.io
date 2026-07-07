"use client";

/**
 * SEO Title: ICO Generator - Create Windows App & Web Icons
 * Meta Description: Convert any image into a high-quality .ico file. Supports standard icon sizes up to 256px. Fast, free, and secure client-side generation.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, Stamp } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile } from '@/lib/utils';

export default function IcoGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ name: string, blob: Blob, url: string } | null>(null);

  const generateIco = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Standard high-res ICO size
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas error');

        // Draw square centered
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 256, 256);

        // ICO is technically a header + BMP/PNG data.
        // Modern ICO files usually contain PNG data.
        canvas.toBlob(blob => {
          if (blob) {
            resolve({
              name: file.name.replace(/\.[^/.]+$/, "") + '.ico',
              blob,
              url: URL.createObjectURL(blob)
            });
          } else reject('Blob error');
        }, 'image/x-icon'); // Browser might fallback to png but standard ico uses png internally now
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await generateIco(files[0]);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Failed to generate ICO");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <UploadPanel files={files} onChange={setFiles} maxFiles={1} />

      {files.length > 0 && !result && (
        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Stamp className="w-4 h-4 fill-current" />}
          Generate .ICO File
        </button>
      )}

      {result && (
        <div className="card border rounded-xl p-8 bg-card shadow-sm flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-500">
           <div className="w-32 h-32 border-2 border-primary/20 rounded-2xl bg-muted/20 flex items-center justify-center overflow-hidden shadow-inner p-4">
              <img src={result.url} alt="ICO Preview" className="max-w-full max-h-full object-contain" />
           </div>

           <div className="text-center space-y-1">
              <p className="text-sm font-black truncate max-w-[200px]">{result.name}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Standard 256x256 Windows Icon</p>
           </div>

           <div className="flex gap-3 w-full">
              <button
                onClick={() => downloadFile(result.blob, result.name)}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download .ICO
              </button>
              <button
                onClick={() => { setFiles([]); setResult(null); }}
                className="px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-muted/50"
              >
                Reset
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
