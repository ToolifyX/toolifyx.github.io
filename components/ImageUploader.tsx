"use client";

import React, { useState, useEffect } from 'react';
import { X, Upload, FileWarning, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { validateFiles, InvalidFile } from '@/lib/fileValidation';

interface ImageUploaderProps {
  files?: File[];
  onChange: (files: File[]) => void;
  showFileList?: boolean;
}

export default function ImageUploader({ files: externalFiles, onChange, showFileList = true }: ImageUploaderProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const files = externalFiles || internalFiles;

  const [invalidFiles, setInvalidFiles] = useState<InvalidFile[]>([]);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0 || !limits) return;

    const { validFiles, invalidFiles: newInvalid } = validateFiles(selectedFiles, files, {
        maxFiles: limits.maxFiles,
        maxFileSizeMB: limits.maxFileSizeMB,
        totalSizeMB: limits.totalSizeMB,
        allowedTypes: ['image/*']
    });

    setInvalidFiles(newInvalid);

    if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        if (!externalFiles) setInternalFiles(updatedFiles);
        onChange(updatedFiles);
    }

    // Reset input
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    if (!externalFiles) setInternalFiles(updatedFiles);
    onChange(updatedFiles);
    setInvalidFiles([]);
  };

  const clearAll = () => {
    if (!externalFiles) setInternalFiles([]);
    onChange([]);
    setInvalidFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!limits) return <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl animate-pulse bg-muted" />;

  return (
    <div className="space-y-6 w-full">
      <div
        className="border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all flex flex-col items-center justify-center space-y-4 cursor-pointer group hover:border-primary/50 hover:bg-primary/[0.02]"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-all group-hover:scale-110">
          <Upload className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-semibold">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground font-medium">
            Up to {limits.maxFiles} files • {limits.maxFileSizeMB}MB each
          </p>
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

      {invalidFiles.length > 0 && (
        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {invalidFiles.length} skipped
            </span>
            <button onClick={() => setInvalidFiles([])} className="text-[10px] uppercase font-bold text-muted-foreground hover:underline">Dismiss</button>
          </div>
          <div className="grid gap-1.5">
            {invalidFiles.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-destructive/5 border border-destructive/10 rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold truncate text-destructive/80">{item.file.name}</p>
                  <p className="text-[9px] text-destructive/60 uppercase font-bold">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFileList && files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {files.length} valid
            </span>
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
