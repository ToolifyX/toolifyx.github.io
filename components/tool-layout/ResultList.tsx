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
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title} ({results.length})
        </h3>
        {results.length > 1 && (
          <button
            onClick={onDownloadAll}
            disabled={isZipping}
            className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition-all transition-colors"
          >
            {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
            Download All
          </button>
        )}
      </div>
      <div className="grid gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {results.map((res, i) => {
          const savings = Math.round((1 - res.compressedSize / res.originalSize) * 100);
          const isReduced = res.compressedSize < res.originalSize;

          return (
            <div key={i} className="flex items-center justify-between p-4 bg-muted/30 border rounded-2xl group transition-all hover:bg-muted/50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={res.url}
                    alt="result"
                    className="w-16 h-16 rounded-xl object-cover border bg-card shadow-sm"
                  />
                  <div className="absolute -top-1.5 -right-1.5 p-1 bg-green-500 rounded-full border-2 border-background">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold truncate">{res.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {isReduced && (
                      <span className="text-[10px] font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full uppercase">Saved {savings}%</span>
                    )}
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span>{(res.compressedSize / 1024).toFixed(1)} KB</span>
                      <span className="opacity-40 line-through">{(res.originalSize / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDownload(res)}
                className="p-3 rounded-xl bg-background border shadow-sm hover:shadow-md hover:border-primary transition-all text-primary"
                title="Download Result"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
