"use client";

import React from 'react';
import { CheckCircle2, RotateCcw, Download, Archive, Loader2 } from 'lucide-react';
import ResultList from './ResultList';
import { ProcessedResult } from '@/lib/imagePipeline';

interface ResultScreenProps {
  results: ProcessedResult[];
  onReset: () => void;
  onDownload: (result: ProcessedResult) => void;
  onDownloadAll: () => void;
  isZipping?: boolean;
  title?: string;
}

export default function ResultScreen({
  results,
  onReset,
  onDownload,
  onDownloadAll,
  isZipping = false,
  title = "Processing Complete"
}: ResultScreenProps) {
  return (
    <div className="space-y-10 py-6 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500">
          <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-[14px] text-muted-foreground font-medium">
          Successfully processed {results.length} {results.length === 1 ? 'file' : 'files'}.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
        <ResultList
          results={results}
          onDownload={onDownload}
          onDownloadAll={onDownloadAll}
          isZipping={isZipping}
          title="Output Files"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border bg-background font-semibold text-sm hover:bg-muted transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          Process New
        </button>

        {results.length > 1 && (
           <button
             onClick={onDownloadAll}
             disabled={isZipping}
             className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-50"
           >
             {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
             Download All (.zip)
           </button>
        )}
      </div>
    </div>
  );
}
