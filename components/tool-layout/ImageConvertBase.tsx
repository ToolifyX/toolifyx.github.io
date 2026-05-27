"use client";

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { convertImage, ConversionResult } from '@/lib/imageConverter';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, RotateCcw } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import { ProcessedResult } from '@/lib/imagePipeline';

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
    if (files.length === 0) return;
    setStatus('processing');
    setResults([]);

    const newResults: ProcessedResult[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({ current: i + 1, total: files.length });
      try {
        const result: ConversionResult = await convertImage(files[i], toFormat);
        newResults.push({
          blob: result.blob,
          name: result.name,
          url: URL.createObjectURL(result.blob),
          originalSize: files[i].size,
          compressedSize: result.blob.size,
          width: result.width,
          height: result.height
        });
      } catch (error) {
        console.error("Conversion failed for file:", files[i].name, error);
      }
    }

    setResults(newResults);
    setStatus('done');
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
        disabled={status === 'processing'}
      />

      {files.length > 0 && status !== 'done' && (
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
      results={results}
      progress={progress}
      onDownload={handleDownloadResult}
      onDownloadAll={handleDownloadAll}
      isZipping={isZipping}
      emptyMessage={`Your ${toExtension.toUpperCase()} files will appear here`}
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
