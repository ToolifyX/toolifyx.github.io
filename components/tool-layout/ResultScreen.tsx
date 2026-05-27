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
  title = "DONE."
}: ResultScreenProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-500 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl border-4 border-black dark:border-white bg-green-400 dark:bg-green-600 shadow-neo-lg -rotate-6">
          <CheckCircle2 className="w-14 h-14 text-black dark:text-white" />
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic underline decoration-8 underline-offset-8">{title}</h2>
        <p className="text-xl md:text-2xl font-black uppercase tracking-tight">
          SUCCESSFULLY PROCESSED {results.length} {results.length === 1 ? 'FILE' : 'FILES'}.
        </p>
      </div>

      <div className="border-8 border-black dark:border-white rounded-[2rem] p-8 bg-white dark:bg-black shadow-neo-xl">
        <ResultList
          results={results}
          onDownload={onDownload}
          onDownloadAll={onDownloadAll}
          isZipping={isZipping}
          title="THE GOODS"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 pt-6">
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-4 px-10 py-6 rounded-2xl border-4 border-black dark:border-white bg-white dark:bg-black font-black text-xl uppercase tracking-tighter shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          NEW FILES
        </button>

        {results.length > 1 && (
           <button
             onClick={onDownloadAll}
             disabled={isZipping}
             className="flex-1 inline-flex items-center justify-center gap-4 px-10 py-6 rounded-2xl border-4 border-black dark:border-white bg-primary text-primary-foreground font-black text-xl uppercase tracking-tighter shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
           >
             {isZipping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Archive className="w-6 h-6 stroke-[3]" />}
             GET EVERYTHING (.ZIP)
           </button>
        )}
      </div>
    </div>
  );
}
