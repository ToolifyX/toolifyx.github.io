"use client";

import React from 'react';
import { X, FileText } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onClear: () => void;
  maxFiles?: number;
}

export default function FileList({ files, onRemove, onClear, maxFiles }: FileListProps) {
  if (files.length === 0) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
          Selected Files ({files.length}{maxFiles ? `/${maxFiles}` : ''})
        </span>
        <button
          onClick={onClear}
          className="text-[11px] font-bold uppercase tracking-wider text-destructive hover:underline"
        >
          Clear All
        </button>
      </div>
      <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
        {files.map((file, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl group transition-all hover:bg-muted/50 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-12 h-12 rounded-lg border bg-background flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                  />
                ) : (
                  <FileText className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[14px] font-semibold truncate leading-none">{file.name}</p>
                <p className="text-[12px] text-muted-foreground font-medium">{formatSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
