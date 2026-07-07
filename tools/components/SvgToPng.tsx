"use client";

/**
 * SEO Title: SVG to PNG Converter - High Resolution Vector Export
 * Meta Description: Convert SVG vector files to PNG images instantly. Support for custom scaling (1x to 4x), background transparency, and high-res presets.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, Settings2, Image as ImageIcon } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadFile } from '@/lib/utils';

export default function SvgToPng() {
  const [files, setFiles] = useState<File[]>([]);
  const [scale, setScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);
  const [results, setResults] = useState<{ name: string, blob: Blob, url: string, width: number, height: number }[]>([]);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const convertSvgToPng = (file: File, scaleFactor: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Failed to get canvas context');

          const width = img.width * scaleFactor;
          const height = img.height * scaleFactor;
          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: file.name.replace(/\.svg$/i, '.png'),
                blob,
                url: URL.createObjectURL(blob),
                width,
                height
              });
            } else {
              reject('Blob generation failed');
            }
          }, 'image/png');
        };
        img.onerror = () => reject('Failed to load image');
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const newResults = [];
      for (const file of files) {
        const res = await convertSvgToPng(file, scale);
        newResults.push(res);
      }
      setResults(newResults);
    } catch (err) {
      console.error(err);
      alert("Failed to convert one or more SVGs");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} accept={{ 'image/svg+xml': ['.svg'] }} />

      {files.length > 0 && results.length === 0 && (
        <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 animate-in fade-in duration-300">
           <div className="p-4 bg-muted/30 rounded-xl border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground">
                   <Settings2 className="w-3 h-3" /> Scale Options
                </div>
                <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{scale}x Resolution</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`py-2 rounded-lg text-xs font-black transition-all ${scale === s ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
           </div>

           <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
           >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              Convert {files.length} SVGs to PNG
           </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Converted Results</h3>
            <button onClick={() => { setFiles([]); setResults([]); }} className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground">Reset</button>
          </div>

          <div className="grid gap-3">
            {results.map((res, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 group hover:bg-muted/20 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0">
                     <img src={res.url} alt={res.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black truncate">{res.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{res.width} × {res.height} px</p>
                  </div>
                </div>
                <button
                  onClick={() => downloadFile(res.blob, res.name)}
                  className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
