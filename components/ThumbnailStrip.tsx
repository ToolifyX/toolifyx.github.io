"use client";

import React from 'react';

interface ThumbnailStripProps {
  pageCount: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  pdfDoc: any;
  onDeletePage?: (index: number) => void;
  onDuplicatePage?: (index: number) => void;
}

export default function ThumbnailStrip({
  pageCount,
  currentPage,
  onPageSelect,
  pdfDoc,
  onDeletePage,
  onDuplicatePage
}: ThumbnailStripProps) {
  return (
    <div className="h-40 bg-card border-t flex items-center gap-4 px-6 overflow-x-auto custom-scrollbar">
      {Array.from({ length: pageCount }).map((_, i) => (
        <div key={i} className="relative group shrink-0">
          <button
            onClick={() => onPageSelect(i + 1)}
            className={`flex flex-col items-center gap-2 transition-all ${
              currentPage === i + 1 ? 'scale-105' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <div className={`w-24 h-32 bg-white rounded border-2 shadow-sm transition-all flex items-center justify-center overflow-hidden ${
              currentPage === i + 1 ? 'border-primary shadow-primary/20' : 'border-border'
            }`}>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                 Page {i + 1}
               </div>
            </div>
            <span className={`text-[10px] font-black ${
              currentPage === i + 1 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {i + 1}
            </span>
          </button>

          <div className="absolute top-0 right-0 p-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onDeletePage?.(i); }}
              className="bg-destructive text-white p-1 rounded hover:bg-destructive/80"
              title="Delete Page"
            >
              <span className="text-[8px] font-bold">DEL</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
