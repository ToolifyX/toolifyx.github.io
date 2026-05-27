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
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">
          Successfully processed {results.length} {results.length === 1 ? 'file' : 'files'}.
        </p>
      </div>

      <div className="card border rounded-2xl p-4 bg-card shadow-sm">
        <ResultList
          results={results}
          onDownload={onDownload}
          onDownloadAll={onDownloadAll}
          isZipping={isZipping}
          title="Processed Files"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-muted-foreground/10 font-bold hover:bg-muted transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Process New Files
        </button>

        {results.length > 1 && (
           <button
             onClick={onDownloadAll}
             disabled={isZipping}
             className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
           >
             {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
             Download All (.ZIP)
           </button>
        )}
      </div>
    </div>
  );
}
