"use client";

/**
 * SEO Title: Batch Image Resizer - Resize Multiple Images Online
 * Meta Description: Resize many images at once to specific dimensions. Fast, free, and secure batch image resizing tool.
 *
 * FAQ 1: Can I resize many images at once?
 * Yes, you can upload and resize up to 5 images in a single batch.
 *
 * FAQ 2: Does it support different aspect ratios?
 * You can choose to maintain the aspect ratio (recommended) or set custom width and height for all images.
 *
 * FAQ 3: What is the maximum resolution?
 * Standard 4K images are supported, though very large images may be limited by your browser's memory.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Download, CheckCircle2, Archive } from 'lucide-react';

interface ResizedImage {
  name: string;
  blob: Blob;
  dataUrl: string;
}

export default function ImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [results, setResults] = useState<ResizedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resizeFile = (file: File): Promise<ResizedImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          let targetWidth = width;
          let targetHeight = height;

          if (maintainAspect) {
            const ratio = img.width / img.height;
            targetHeight = Math.round(targetWidth / ratio);
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

          const dataUrl = canvas.toDataURL('image/png');
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: file.name.replace(/\.[^/.]+$/, "") + `_resized.png`,
                blob: blob,
                dataUrl: dataUrl
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

    const newResults: ResizedImage[] = [];
    for (const file of files) {
      const result = await resizeFile(file);
      newResults.push(result);
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (res: ResizedImage) => {
    downloadFile(res.blob, res.name);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "resized-images.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <ImageUploader
          maxFiles={5}
          maxSizeMB={5}
          totalSizeMB={20}
          onChange={setFiles}
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-2 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Height (px)</label>
                <input
                  type="number"
                  value={maintainAspect ? 'Auto' : height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  className="w-full border rounded-lg p-2 text-sm"
                  disabled={maintainAspect}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
              />
              Maintain Aspect Ratio
            </label>

            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resizing {files.length} Images...
                </>
              ) : (
                `Resize All ${files.length} Images`
              )}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Results ({results.length})</h3>
              {results.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={isZipping}
                  className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow-sm"
                >
                  {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3" />}
                  Download All (ZIP)
                </button>
              )}
            </div>
            <div className="grid gap-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{res.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadResult(res)}
                    className="p-2 rounded-lg bg-card border hover:bg-muted transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
