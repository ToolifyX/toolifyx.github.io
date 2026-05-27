"use client";

/**
 * SEO Title: Adaptive Batch Image Compressor - High Performance Online Compression
 */

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { processQueue, ProcessedResult } from '@/lib/imagePipeline';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Settings2 } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';

type ToolStatus = 'idle' | 'processing' | 'done';

export default function ImageCompressor() {
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const handleProcessAll = async () => {
    if (files.length === 0 || !limits) return;
    setStatus('processing');
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
      setStatus('done');
    } catch (error) {
      console.error("Batch processing failed:", error);
      alert("An error occurred during compression.");
      setStatus('idle');
    } finally {
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
    setQuality(0.7);
  };

  const handleDownloadResult = (res: ProcessedResult) => {
    downloadFile(res.blob, res.name);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "compressed-images.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  const getQualityLabel = (q: number) => {
    if (q >= 0.9) return "High (Low Compression)";
    if (q >= 0.6) return "Medium (Balanced)";
    return "Low (Max Compression)";
  };

  // 1. Result State: "done"
  if (status === 'done') {
    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={results}
          onReset={handleReset}
          onDownload={handleDownloadResult}
          onDownloadAll={handleDownloadAll}
          isZipping={isZipping}
          title="Images Compressed"
        />
      </div>
    );
  }

  // 2. Idle or Processing States: "idle" | "processing"
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <UploadPanel
        files={files}
        onChange={setFiles}
        maxFiles={limits?.maxFiles}
      />

      {files.length > 0 && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="p-3 bg-muted/30 rounded-lg border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                 <Settings2 className="w-3 h-3" /> Settings
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
              disabled={status === 'processing'}
            />
          </div>

          <button
            onClick={handleProcessAll}
            disabled={status === 'processing'}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing {progress.current} of {progress.total}...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                Process {files.length} {files.length === 1 ? 'file' : 'files'}
              </>
            )}
          </button>
        </div>
      )}

      {status === 'processing' && (
        <ResultPanel
          isProcessing={status === 'processing'}
          results={[]}
          progress={progress}
          onDownload={() => {}}
          onDownloadAll={() => {}}
        />
      )}
    </div>
  );
}
