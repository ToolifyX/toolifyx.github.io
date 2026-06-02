"use client";

import React, { useState, useEffect } from 'react';
import { X, Upload, Info, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { validateFiles, InvalidFile } from '@/lib/fileValidation';

interface PDFUploaderProps {
  files?: File[];
  onChange: (files: File[]) => void;
  showFileList?: boolean;
}

export default function PDFUploader({ files: externalFiles, onChange, showFileList = true }: PDFUploaderProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const files = externalFiles || internalFiles;

  const [invalidFiles, setInvalidFiles] = useState<InvalidFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // PDF specific limits
  const limits = {
    maxFiles: 100,
    maxFileSizeMB: 100,
    totalSizeMB: 1000,
    allowedTypes: ['application/pdf', '.pdf']
  };

  const handleFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    const { validFiles, invalidFiles: newInvalid } = validateFiles(selectedFiles, files, limits);

    setInvalidFiles(newInvalid);

    if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        if (!externalFiles) setInternalFiles(updatedFiles);
        onChange(updatedFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []));
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
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

  return (
    <div className="space-y-4 w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-muted-foreground/20 hover:border-primary hover:bg-muted/50'
        }`}
        onClick={() => document.getElementById('pdf-input')?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`w-8 h-8 transition-transform ${
          isDragging ? 'text-primary scale-110' : 'group-hover:-translate-y-1 text-muted-foreground group-hover:text-primary'
        }`} />
        <div className="text-center">
          <p className="text-sm font-medium">{isDragging ? 'Drop files here' : 'Click to upload PDF files'}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
            <Info className="w-3 h-3" />
            Up to {limits.maxFiles} files • {limits.maxFileSizeMB}MB each
          </div>
        </div>
        <input
          id="pdf-input"
          type="file"
          multiple
          accept=".pdf,application/pdf"
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
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border text-primary">
                     <FileText className="w-4 h-4" />
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
