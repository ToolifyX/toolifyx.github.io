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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
          {title} ({results.length})
        </h3>
        {results.length > 1 && (
          <button
            onClick={onDownloadAll}
            disabled={isZipping}
            className="text-[11px] font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1.5"
          >
            {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
            Download All
          </button>
        )}
      </div>
      <div className="grid gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {results.map((res, i) => {
          const savings = Math.round((1 - res.compressedSize / res.originalSize) * 100);
          const isReduced = res.compressedSize < res.originalSize;

          return (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl group transition-all hover:bg-muted/50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={res.url}
                    alt="result"
                    className="w-12 h-12 rounded-lg object-cover border bg-background shadow-sm"
                  />
                  <div className="absolute -top-1 -right-1 p-0.5 bg-green-500 rounded-full border-2 border-background">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[14px] font-semibold truncate leading-none">{res.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    {isReduced && (
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight">Saved {savings}%</span>
                    )}
                    <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                      <span>{(res.compressedSize / 1024).toFixed(1)} KB</span>
                      <span className="opacity-40 line-through">{(res.originalSize / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDownload(res)}
                className="p-2.5 rounded-lg bg-background border shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-primary"
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
