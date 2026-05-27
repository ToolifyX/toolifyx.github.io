"use client";

/**
 * SEO Title: Batch Image Compressor - Compress Multiple Images Online
 * Meta Description: Compress multiple images at once without losing quality. Support JPG, PNG, and WebP batch compression with file size limits.
 *
 * FAQ 1: How many images can I compress at once?
 * You can upload and process up to 5 images at a time.
 *
 * FAQ 2: What is the maximum file size?
 * Each image can be up to 5MB, with a total batch limit of 20MB.
 *
 * FAQ 3: Is it secure?
 * Yes, all compression happens locally in your browser. Your images are never uploaded to any server.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';

interface CompressedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
}

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [results, setCompressedResults] = useState<CompressedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compressFile = (file: File): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64str = dataUrl.split(',')[1];
          const decoded = atob(base64str);

          resolve({
            name: file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg",
            originalSize: file.size,
            compressedSize: decoded.length,
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
    setCompressedResults([]);

    const newResults: CompressedImage[] = [];
    for (const file of files) {
      const result = await compressFile(file);
      newResults.push(result);
    }

    setCompressedResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (result: CompressedImage) => {
    const byteString = atob(result.dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    downloadFile(new Blob([ab], { type: 'image/jpeg' }), result.name);
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
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="flex-1"
              />
            </div>

            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Compressing {files.length} Images...
                </>
              ) : (
                `Compress All ${files.length} Images`
              )}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Results</h3>
            <div className="grid gap-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{res.name}</p>
                      <p className="text-[10px] text-green-700">
                        Saved {Math.round((1 - res.compressedSize / res.originalSize) * 100)}%
                        ({(res.compressedSize / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadResult(res)}
                    className="p-2 rounded-lg bg-white border hover:bg-gray-50 text-black transition-colors"
                    title="Download"
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
