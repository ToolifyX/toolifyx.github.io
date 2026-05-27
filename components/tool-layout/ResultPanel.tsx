"use client";

import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import ResultList from './ResultList';
import { ProcessedResult } from '@/lib/imagePipeline';

interface ResultPanelProps {
  isProcessing: boolean;
  results: ProcessedResult[];
  progress?: { current: number; total: number };
  onDownload: (result: ProcessedResult) => void;
  onDownloadAll: () => void;
  isZipping?: boolean;
  className?: string;
  emptyMessage?: string;
}

export default function ResultPanel({
  isProcessing,
  results,
  progress,
  onDownload,
  onDownloadAll,
  isZipping = false,
  className = "",
  emptyMessage = "Process files to see results here"
}: ResultPanelProps) {
  return (
    <div className={`card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] ${className}`}>
      {isProcessing && (
        <div className="space-y-4 flex flex-col items-center justify-center h-full py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold animate-pulse">Processing your files...</p>
          {progress && (
            <div className="w-full max-w-xs bg-muted rounded-full h-1 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 opacity-30">
          <Zap className="w-12 h-12" />
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <ResultList
          results={results}
          onDownload={handleDownload} // Wait, I should use the prop
          onDownloadAll={onDownloadAll}
          isZipping={isZipping}
        />
      )}
    </div>
  );

  // Fix: onDownload wasn't being used correctly in the JSX above
  function handleDownload(res: ProcessedResult) {
    onDownload(res);
  }
}
