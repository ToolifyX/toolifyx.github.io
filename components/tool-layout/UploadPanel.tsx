"use client";

import React from 'react';
import ImageUploader from '@/components/ImageUploader';
import FileList from './FileList';

interface UploadPanelProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  accept?: Record<string, string[]>;
}

export default function UploadPanel({ files, onChange, maxFiles, className = "", disabled = false, accept }: UploadPanelProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-3 space-y-6 ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <ImageUploader files={files} onChange={onChange} showFileList={false} maxFiles={maxFiles} accept={accept} />
      <FileList
        files={files}
        onRemove={(idx) => onChange(files.filter((_, i) => i !== idx))}
        onClear={() => onChange([])}
        maxFiles={maxFiles}
      />
    </div>
  );
}
