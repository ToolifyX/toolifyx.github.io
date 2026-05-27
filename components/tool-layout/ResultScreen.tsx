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
    <div className="space-y-12 py-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-lg text-muted-foreground font-medium">
          Successfully processed {results.length} {results.length === 1 ? 'file' : 'files'}.
        </p>
      </div>

      <div className="border rounded-[2rem] p-6 bg-card shadow-sm shadow-black/5">
        <ResultList
          results={results}
          onDownload={onDownload}
          onDownloadAll={onDownloadAll}
          isZipping={isZipping}
          title="Processed Files"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border font-bold hover:bg-muted transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          Process New Files
        </button>

        {results.length > 1 && (
           <button
             onClick={onDownloadAll}
             disabled={isZipping}
             className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
           >
             {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
             Download All (.ZIP)
           </button>
        )}
      </div>
    </div>
  );
}
