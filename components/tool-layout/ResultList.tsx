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
  title = "Results"
}: ResultListProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {title} ({results.length})
        </h3>
        {results.length > 1 && (
          <button
            onClick={onDownloadAll}
            disabled={isZipping}
            className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow-sm"
          >
            {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3" />}
            Download All (ZIP)
          </button>
        )}
      </div>
      <div className="grid gap-2 overflow-y-auto max-h-[600px] pr-1 custom-scrollbar">
        {results.map((res, i) => {
          const savings = Math.round((1 - res.compressedSize / res.originalSize) * 100);
          const isReduced = res.compressedSize < res.originalSize;

          return (
            <div key={i} className="flex items-center justify-between p-2 bg-green-50/10 dark:bg-green-500/5 border border-green-500/20 rounded-xl group animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={res.url}
                    alt="result"
                    className="w-12 h-12 rounded-lg object-cover border border-green-500/20 shadow-sm bg-card"
                  />
                  <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-500 fill-card" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black truncate">{res.name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {isReduced && (
                      <span className="text-[10px] font-bold text-green-600">Saved {savings}%</span>
                    )}
                    <span className="text-[9px] text-muted-foreground">
                      {(res.compressedSize / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-[9px] text-muted-foreground/50 line-through">
                      {(res.originalSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDownload(res)}
                className="p-2 rounded-lg bg-card border shadow-sm hover:shadow-md hover:bg-muted transition-all text-primary group-hover:scale-110"
                title="Download Result"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
