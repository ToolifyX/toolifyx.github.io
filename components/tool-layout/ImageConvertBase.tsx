"use client";

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { processQueue, ProcessedResult } from '@/lib/imagePipeline';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';

type ToolStatus = 'idle' | 'processing' | 'done';

interface ImageConvertBaseProps {
  fromFormat: string;
  toFormat: string;
  toExtension: string;
  title: string;
}

export default function ImageConvertBase({ fromFormat, toFormat, toExtension, title }: ImageConvertBaseProps) {
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [files, setFiles] = useState<File[]>([]);
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
          quality: 0.9,
          format: toFormat
        },
        (current, total) => setProgress({ current, total })
      );

      // Update names to match target extension
      const renamedResults = processedResults.map(res => ({
        ...res,
        name: res.name.replace(/\.[^/.]+$/, "") + `.${toExtension}`
      }));

      setResults(renamedResults);
      setStatus('done');
    } catch (error) {
      console.error("Batch processing failed:", error);
      alert("An error occurred during conversion.");
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
        `converted-${toExtension}-images.zip`
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
          title={title}
        />
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-4">
      <UploadPanel
        files={files}
        onChange={setFiles}
        maxFiles={limits?.maxFiles}
      />

      {files.length > 0 && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4 animate-in fade-in duration-300">
          <button
            onClick={handleProcessAll}
            disabled={status === 'processing'}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Converting {progress.current} of {progress.total}...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                Convert {files.length} to {toExtension.toUpperCase()}
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
      emptyMessage={`Your ${toExtension.toUpperCase()} files will appear here`}
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
