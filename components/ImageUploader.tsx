"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { X, Upload, FileWarning, Info } from 'lucide-react';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

interface ImageUploaderProps {
  onChange: (files: File[]) => void;
}

export default function ImageUploader({ onChange }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const validateFiles = (newFiles: File[]): { valid: File[]; error: string | null } => {
    if (!limits) return { valid: newFiles, error: null };

    if (files.length + newFiles.length > limits.maxFiles) {
      return { valid: [], error: `Max ${limits.maxFiles} files allowed for your device` };
    }

    const validFiles: File[] = [];
    let currentTotalSize = files.reduce((acc, f) => acc + f.size, 0);

    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        return { valid: [], error: "Invalid file type. Only images are allowed." };
      }
      if (file.size > limits.maxFileSizeMB * 1024 * 1024) {
        return { valid: [], error: `File "${file.name}" is too large (max ${limits.maxFileSizeMB}MB)` };
      }
      if (currentTotalSize + file.size > limits.totalSizeMB * 1024 * 1024) {
        return { valid: [], error: `Total size limit reached (max ${limits.totalSizeMB}MB)` };
      }
      validFiles.push(file);
      currentTotalSize += file.size;
    }

    return { valid: validFiles, error: null };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const { valid, error } = validateFiles(selectedFiles);
    if (error) {
      setError(error);
      return;
    }

    const updatedFiles = [...files, ...valid];
    setFiles(updatedFiles);
    onChange(updatedFiles);
    // Reset input
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles);
    setError(null);
  };

  const clearAll = () => {
    setFiles([]);
    onChange([]);
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!limits) return <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl animate-pulse bg-muted" />;

  return (
    <div className="space-y-4 w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group ${error ? 'border-destructive bg-destructive/5' : 'border-muted-foreground/20 hover:border-primary hover:bg-muted/50'}`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={`w-8 h-8 transition-transform group-hover:-translate-y-1 ${error ? 'text-destructive' : 'text-muted-foreground group-hover:text-primary'}`} />
        <div className="text-center">
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
            <Info className="w-3 h-3" />
            Up to {limits.maxFiles} images • {limits.maxFileSizeMB}MB each
          </div>
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-xs font-semibold rounded-lg animate-in fade-in zoom-in-95 duration-200">
          <FileWarning className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Queue ({files.length}/{limits.maxFiles})</span>
            <button onClick={clearAll} className="text-[10px] uppercase font-bold text-destructive hover:underline">Clear All</button>
          </div>
          <div className="grid gap-1.5">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-card border rounded-lg animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
                     <img
                       src={URL.createObjectURL(file)}
                       alt="preview"
                       className="w-full h-full object-cover"
                       onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                     />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">{file.name}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-medium">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
