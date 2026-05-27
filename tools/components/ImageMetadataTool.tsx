"use client";

/**
 * SEO Title: Batch Image Metadata Remover - Strip EXIF Data
 */

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, ShieldAlert } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

export default function ImageMetadataTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [isZipping, setIsZipping] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const stripMetadataFile = (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: `clean_${file.name}`,
                blob: blob,
                url: URL.createObjectURL(blob),
                originalSize: file.size,
                compressedSize: blob.size,
                width: img.width,
                height: img.height
              });
            }
          }, file.type, 0.95);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setResults([]);

    const newResults: any[] = [];
    for (const file of files) {
      const result = await stripMetadataFile(file);
      newResults.push(result);
    }

    setResults(newResults);
    setStatus('done');
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
  };

  const handleDownloadResult = (res: any) => {
    downloadFile(res.blob, res.name);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "cleaned-images.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  if (status === 'done') {
    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={results}
          onReset={handleReset}
          onDownload={handleDownloadResult}
          onDownloadAll={handleDownloadAll}
          isZipping={isZipping}
          title="Metadata Stripped"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-700">
             <ShieldAlert className="w-4 h-4 flex-shrink-0" />
             Re-encoding will strip all EXIF metadata (Location, Camera Info, etc.)
          </div>
          <button
            onClick={handleProcessAll}
            disabled={status === 'processing'}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {status === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            Strip Metadata from {files.length} Images
          </button>
        </div>
      )}

      {status === 'processing' && (
        <ResultPanel
          isProcessing={status === 'processing'}
          results={[]}
          onDownload={() => {}}
          onDownloadAll={() => {}}
        />
      )}
    </div>
  );
}
