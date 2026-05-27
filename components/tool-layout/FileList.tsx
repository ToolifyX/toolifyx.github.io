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
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Queue ({files.length}{maxFiles ? `/${maxFiles}` : ''})
        </span>
        <button onClick={onClear} className="text-[10px] uppercase font-bold text-destructive hover:underline">
          Clear All
        </button>
      </div>
      <div className="grid gap-1.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {files.map((file, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-card border rounded-lg group animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                  />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold truncate">{file.name}</p>
                <p className="text-[9px] text-muted-foreground uppercase font-medium">{formatSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
