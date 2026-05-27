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
    <div className={`bg-card border border-border rounded-lg p-3 min-h-[400px] flex flex-col ${className}`}>
      {isProcessing && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-semibold">Processing your files...</p>
            {progress && (
              <p className="text-xs text-muted-foreground font-medium">
                {progress.current} of {progress.total}
              </p>
            )}
          </div>
          {progress && (
            <div className="w-full max-w-[200px] bg-muted rounded-full h-1 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-20">
          <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>
          <p className="text-[14px] font-medium max-w-[200px]">{emptyMessage}</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="animate-in fade-in duration-500">
           <ResultList
             results={results}
             onDownload={onDownload}
             onDownloadAll={onDownloadAll}
             isZipping={isZipping}
           />
        </div>
      )}
    </div>
  );
}
