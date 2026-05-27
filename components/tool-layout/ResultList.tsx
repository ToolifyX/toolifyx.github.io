"use client";

import React from 'react';
import { Download, CheckCircle2, Archive, Loader2 } from 'lucide-react';
import { ProcessedResult } from '@/lib/imagePipeline';

interface ResultListProps {
  results: ProcessedResult[];
  onDownload: (result: ProcessedResult) => void;
  onDownloadAll: () => void;
  isZipping?: boolean;
  title?: string;
}

export default function ResultList({
  results,
  onDownload,
  onDownloadAll,
  isZipping = false,
  title = "RESULTS"
}: ResultListProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black dark:text-white underline decoration-4 underline-offset-4">
          {title} ({results.length})
        </h3>
        {results.length > 1 && (
          <button
            onClick={onDownloadAll}
            disabled={isZipping}
            className="text-xs font-black bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 border-2 border-black dark:border-white shadow-neo hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 transition-all uppercase tracking-tighter"
          >
            {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4 stroke-[3]" />}
            ZIP EVERYTHING
          </button>
        )}
      </div>
      <div className="grid gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {results.map((res, i) => {
          const savings = Math.round((1 - res.compressedSize / res.originalSize) * 100);
          const isReduced = res.compressedSize < res.originalSize;

          return (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-black border-4 border-black dark:border-white rounded-2xl shadow-neo group transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={res.url}
                    alt="result"
                    className="w-20 h-20 rounded-xl object-cover border-4 border-black dark:border-white shadow-neo-sm bg-card"
                  />
                  <div className="absolute -top-2 -right-2 p-1 bg-green-400 dark:bg-green-600 rounded-lg border-2 border-black dark:border-white shadow-neo-sm">
                    <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                  </div>
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-lg font-black truncate uppercase tracking-tight">{res.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {isReduced && (
                      <span className="text-xs font-black bg-green-400 dark:bg-green-600 text-black dark:text-white px-2 py-0.5 rounded border-2 border-black dark:border-white">SAVED {savings}%</span>
                    )}
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter">
                      <span className="text-black dark:text-white">
                        {(res.compressedSize / 1024).toFixed(1)} KB
                      </span>
                      <span className="text-black/30 dark:text-white/30 line-through">
                        {(res.originalSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDownload(res)}
                className="p-4 rounded-xl bg-primary text-primary-foreground border-4 border-black dark:border-white shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                title="Download Result"
              >
                <Download className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
