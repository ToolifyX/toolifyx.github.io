"use client";

/**
 * SEO Title: Batch Thumbnail Generator - Create Multiple Image Thumbnails
 */

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Download, Image as ImageIcon, Zap, Settings2 } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

interface ThumbnailResult {
  name: string;
  blob: Blob;
  dataUrl: string;
}

export default function ThumbnailGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState(150);
  const [results, setResults] = useState<ThumbnailResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const generateThumbnail = (file: File): Promise<ThumbnailResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: `thumb_${size}x${size}_${file.name.replace(/\.[^/.]+$/, "")}.png`,
                blob: blob,
                dataUrl: URL.createObjectURL(blob)
              });
            }
          }, 'image/png');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);
    const newResults: ThumbnailResult[] = [];
    for (const file of files) {
      const result = await generateThumbnail(file);
      newResults.push(result);
    }
    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (res: ThumbnailResult) => {
    downloadFile(res.blob, res.name);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "thumbnails.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  const leftPanel = (
    <div className="space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />
      {files.length > 0 && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                 <Settings2 className="w-3 h-3" /> Size
              </div>
              <span className="text-[10px] font-black text-primary uppercase">{size}x{size}px</span>
            </div>
            <input type="range" min="50" max="500" step="10" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full accent-primary" />
          </div>

          <button
            onClick={handleProcessAll}
            disabled={isProcessing}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            Generate {files.length} Thumbnails
          </button>
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px]">
      {isProcessing && (
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Generating thumbnails...</p>
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 opacity-30">
          <ImageIcon className="w-12 h-12" />
          <p className="text-sm font-medium">Thumbnails will appear here</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results ({results.length})</h3>
            {results.length > 1 && (
              <button
                onClick={handleDownloadAll}
                disabled={isZipping}
                className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow-sm"
              >
                {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                Download All (ZIP)
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.map((res, i) => (
              <div key={i} className="bg-muted/20 border rounded-xl p-2 flex flex-col items-center space-y-2 group animate-in fade-in slide-in-from-top-1">
                <div className="w-full aspect-square rounded-lg overflow-hidden border bg-card shadow-sm">
                  <img src={res.dataUrl} alt="Thumb" className="w-full h-full object-contain" />
                </div>
                <button
                  onClick={() => handleDownloadResult(res)}
                  className="p-1.5 rounded-lg bg-primary text-white w-full flex items-center justify-center gap-1 text-[10px] font-bold transition-transform active:scale-95 shadow-sm"
                >
                  <Download className="w-3 h-3" /> Save
                </button>
              </div>
            ))}
          </div>
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
