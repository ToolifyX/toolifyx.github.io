"use client";

/**
 * SEO Title: Batch Image Resizer - Resize Multiple Images Online
 */

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { processQueue, ProcessedResult } from '@/lib/imagePipeline';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Settings2 } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';

export default function ImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(800);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
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
          maxResolution: width,
          quality: 0.9,
          format: 'image/png'
        },
        (current, total) => setProgress({ current, total })
      );
      setResults(processedResults);
      setStatus('done');
    } catch (error) {
      console.error("Batch processing failed:", error);
      alert("An error occurred during resizing.");
      setStatus('idle');
    } finally {
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
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
        "resized-images.zip"
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
          title="Images Resized"
        />
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />

      {files.length > 0 && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
               <Settings2 className="w-3 h-3" /> Resize Settings
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground/60">Target Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
              />
              Maintain Aspect Ratio
            </label>
          </div>

          <button
            onClick={handleProcessAll}
            disabled={status === 'processing'}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resizing {progress.current}/{progress.total}...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                Resize {files.length} Images
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <ResultPanel
      isProcessing={status === 'processing'}
      results={[]}
      progress={progress}
      onDownload={() => {}}
      onDownloadAll={() => {}}
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
