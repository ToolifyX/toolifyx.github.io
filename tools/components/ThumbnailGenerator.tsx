"use client";

/**
 * SEO Title: Batch Thumbnail Generator - Create Multiple Image Thumbnails
 * Meta Description: Generate thumbnails from many images at once. Select custom sizes and download all thumbnails for your web projects.
 *
 * FAQ 1: Can I create thumbnails for many images?
 * Yes, you can upload up to 5 images and generate thumbnails for all of them in one go.
 *
 * FAQ 2: What is the output format?
 * All thumbnails are exported as high-quality PNG files to preserve detail.
 *
 * FAQ 3: How does the cropping work?
 * The tool automatically uses a 'center-cover' crop to ensure your thumbnails are perfectly square and filled.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';

interface ThumbnailResult {
  name: string;
  dataUrl: string;
}

export default function ThumbnailGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState(150);
  const [results, setResults] = useState<ThumbnailResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateThumbnail = (file: File): Promise<ThumbnailResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/png');

          resolve({
            name: `thumb_${size}x${size}_${file.name.replace(/\.[^/.]+$/, "")}.png`,
            dataUrl: dataUrl
          });
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
    const byteString = atob(res.dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    downloadFile(new Blob([ab], { type: 'image/png' }), res.name);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <ImageUploader maxFiles={5} onChange={setFiles} />

        {files.length > 0 && (
          <div className="space-y-4 pt-2 border-t">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Thumbnail Size: {size}px</label>
              <input type="range" min="50" max="500" step="10" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="flex-1" />
            </div>

            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              Generate {files.length} Thumbnails
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {results.map((res, i) => (
                <div key={i} className="bg-muted/20 border rounded-xl p-2 flex flex-col items-center space-y-2 group">
                  <div className="w-full aspect-square rounded-lg overflow-hidden border bg-card">
                    <img src={res.dataUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                  </div>
                  <button
                    onClick={() => handleDownloadResult(res)}
                    className="p-1.5 rounded-lg bg-primary text-white w-full flex items-center justify-center gap-1 text-[10px] font-bold"
                  >
                    <Download className="w-3 h-3" /> Save
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
