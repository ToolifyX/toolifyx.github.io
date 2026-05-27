"use client";

/**
 * SEO Title: Adaptive Batch Image Compressor - High Performance Online Compression
 * Meta Description: Compress multiple images safely with device-aware limits. Pro-level quality control, downscaling, and ultra-fast local processing.
 *
 * FAQ 1: How does adaptive compression work?
 * Our tool detects your device's RAM and CPU power to set safe processing limits, preventing browser crashes during large batch jobs.
 *
 * FAQ 2: What is the maximum resolution?
 * Depending on your device, we safely process images up to 3000px. Larger images are automatically downscaled proportionally.
 *
 * FAQ 3: Is it safer than server-side tools?
 * Much safer. Your data never leaves your RAM, and our sequential processing queue ensures your browser remains responsive.
 */

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { processQueue, ProcessedResult } from '@/lib/imagePipeline';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { Loader2, Download, CheckCircle2, Zap, Settings2 } from 'lucide-react';

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7); // Medium default
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const handleProcessAll = async () => {
    if (files.length === 0 || !limits) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const processedResults = await processQueue(
        files,
        {
          maxResolution: limits.maxResolution,
          quality,
          format: 'image/jpeg'
        },
        (current, total) => setProgress({ current, total })
      );
      setResults(processedResults);
    } catch (error) {
      console.error("Batch processing failed:", error);
      alert("An error occurred during compression. Some files might be too large for your browser to process.");
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleDownloadResult = (res: ProcessedResult) => {
    downloadFile(res.blob, res.name);
  };

  const getQualityLabel = (q: number) => {
    if (q >= 0.9) return "High (Low Compression)";
    if (q >= 0.6) return "Medium (Balanced)";
    return "Low (Max Compression)";
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="card border rounded-xl p-4 space-y-4 shadow-sm bg-card/50 backdrop-blur-sm">
        <ImageUploader onChange={setFiles} />

        {files.length > 0 && (
          <div className="space-y-4 pt-2 border-t animate-in fade-in duration-300">
            <div className="p-3 bg-muted/30 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                   <Settings2 className="w-3 h-3" /> Compression Level
                </div>
                <span className="text-[10px] font-black text-primary uppercase">{getQualityLabel(quality)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing {progress.current}/{progress.total}...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  Compress Batch ({files.length} Images)
                </>
              )}
            </button>

            {isProcessing && (
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results</h3>
              <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">Success</span>
            </div>
            <div className="grid gap-2">
              {results.map((res, i) => {
                const savings = Math.round((1 - res.compressedSize / res.originalSize) * 100);
                return (
                  <div key={i} className="flex items-center justify-between p-2 bg-green-50/10 dark:bg-green-500/5 border border-green-500/20 rounded-xl group">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative">
                        <img src={res.url} alt="done" className="w-10 h-10 rounded-lg object-cover border border-green-500/20 shadow-sm" />
                        <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-500 fill-card" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black truncate">{res.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-green-600">Saved {savings}%</span>
                          <span className="text-[9px] text-muted-foreground">{(res.compressedSize / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadResult(res)}
                      className="p-2 rounded-lg bg-card border shadow-sm hover:shadow-md hover:bg-muted transition-all text-primary group-hover:scale-110"
                      title="Download Result"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
