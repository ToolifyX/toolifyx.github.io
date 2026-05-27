"use client";

import React from 'react';
import ImageUploader from '@/components/ImageUploader';
import FileList from './FileList';

interface UploadPanelProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function UploadPanel({ files, onChange, maxFiles, className = "" }: UploadPanelProps) {
  return (
    <div className={`border-8 border-black dark:border-white rounded-[2.5rem] p-8 bg-white dark:bg-black shadow-neo-xl space-y-8 ${className}`}>
      <ImageUploader files={files} onChange={onChange} showFileList={false} />
      <FileList
        files={files}
        onRemove={(idx) => onChange(files.filter((_, i) => i !== idx))}
        onClear={() => onChange([])}
        maxFiles={maxFiles}
      />
    </div>
  );
}
