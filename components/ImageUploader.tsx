"use client";

import React, { useState, useCallback } from 'react';
import { X, Upload, FileWarning } from 'lucide-react';

interface ImageUploaderProps {
  maxFiles?: number;
  maxSizeMB?: number;
  totalSizeMB?: number;
  onChange: (files: File[]) => void;
}

export default function ImageUploader({
  maxFiles = 5,
  maxSizeMB = 5,
  totalSizeMB = 20,
  onChange,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (newFiles: File[]): { valid: File[]; error: string | null } => {
    if (files.length + newFiles.length > maxFiles) {
      return { valid: [], error: `Max ${maxFiles} files allowed` };
    }

    const validFiles: File[] = [];
    let currentTotalSize = files.reduce((acc, f) => acc + f.size, 0);

    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        return { valid: [], error: "Invalid file type. Only images are allowed." };
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return { valid: [], error: `File too large (max ${maxSizeMB}MB per file)` };
      }
      if (currentTotalSize + file.size > totalSizeMB * 1024 * 1024) {
        return { valid: [], error: `Total size limit reached (max ${totalSizeMB}MB)` };
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

  return (
    <div className="space-y-4 w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-6 transition-colors flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-muted/50 ${error ? 'border-destructive bg-destructive/5' : 'border-muted-foreground/20'}`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={`w-8 h-8 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
        <div className="text-center">
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP (Max {maxFiles} files, {maxSizeMB}MB each)</p>
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
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-xs font-semibold rounded-lg">
          <FileWarning className="w-4 h-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selected Files ({files.length})</span>
            <button onClick={clearAll} className="text-[10px] uppercase font-bold text-destructive hover:underline">Clear All</button>
          </div>
          <div className="grid gap-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-card border rounded-lg group animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                     <img
                       src={URL.createObjectURL(file)}
                       alt="preview"
                       className="w-full h-full object-cover"
                       onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                     />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
