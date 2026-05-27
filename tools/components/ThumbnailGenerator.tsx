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
import ResultScreen from '@/components/tool-layout/ResultScreen';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

export default function ThumbnailGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState(150);
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [isZipping, setIsZipping] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const generateThumbnail = (file: File): Promise<any> => {
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
                url: URL.createObjectURL(blob),
                originalSize: file.size,
                compressedSize: blob.size,
                width: size,
                height: size
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
    setStatus('processing');
    setResults([]);
    const newResults: any[] = [];
    for (const file of files) {
      const result = await generateThumbnail(file);
      newResults.push(result);
    }
    setResults(newResults);
    setStatus('done');
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
  };

  const handleDownloadResult = (res: any) => {
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

  if (status === 'done') {
    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={results}
          onReset={handleReset}
          onDownload={handleDownloadResult}
          onDownloadAll={handleDownloadAll}
          isZipping={isZipping}
          title="Thumbnails Generated"
        />
      </div>
    );
  }

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
            disabled={status === 'processing'}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {status === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            Generate {files.length} Thumbnails
          </button>
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <ResultPanel
      isProcessing={status === 'processing'}
      results={[]}
      onDownload={() => {}}
      onDownloadAll={() => {}}
      emptyMessage="Thumbnails will appear here"
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
