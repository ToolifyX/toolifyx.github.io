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
        <span className="text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white underline decoration-4 underline-offset-4">
          QUEUE ({files.length}{maxFiles ? `/${maxFiles}` : ''})
        </span>
        <button onClick={onClear} className="text-xs font-black uppercase text-destructive hover:underline tracking-tighter">
          CLEAR EVERYTHING
        </button>
      </div>
      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {files.map((file, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-black border-4 border-black dark:border-white rounded-2xl shadow-neo group hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-16 h-16 rounded-xl border-4 border-black dark:border-white bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 shadow-neo-sm">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                  />
                ) : (
                  <FileText className="w-8 h-8 text-black dark:text-white stroke-[3]" />
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-base font-black truncate uppercase tracking-tight">{file.name}</p>
                <p className="text-xs text-black/50 dark:text-white/50 uppercase font-black tracking-widest">{formatSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="p-3 rounded-xl border-4 border-black dark:border-white bg-white dark:bg-black hover:bg-destructive hover:text-white transition-all shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <X className="w-6 h-6 stroke-[4]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
