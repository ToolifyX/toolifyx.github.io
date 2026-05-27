"use client";

/**
 * SEO Title: Batch Image Metadata Remover - Strip EXIF Data
 */

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

interface MetadataResult {
  name: string;
  type: string;
  blob: Blob;
  dataUrl: string;
}

export default function ImageMetadataTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<MetadataResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const stripMetadataFile = (file: File): Promise<MetadataResult> => {
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

          const dataUrl = canvas.toDataURL(file.type, 0.95);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: `clean_${file.name}`,
                type: file.type,
                blob: blob,
                dataUrl: dataUrl
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
    setIsProcessing(true);
    setResults([]);

    const newResults: MetadataResult[] = [];
    for (const file of files) {
      const result = await stripMetadataFile(file);
      newResults.push(result);
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (res: MetadataResult) => {
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

  const leftPanel = (
    <div className="space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-700">
             <ShieldAlert className="w-4 h-4 flex-shrink-0" />
             Re-encoding will strip all EXIF metadata (Location, Camera Info, etc.)
          </div>
          <button
            onClick={handleProcessAll}
            disabled={isProcessing}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            Strip Metadata from {files.length} Images
          </button>
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px]">
      {isProcessing && (
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Cleaning images...</p>
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 opacity-30">
          <Zap className="w-12 h-12" />
          <p className="text-sm font-medium">Cleaned files will appear here</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cleaned ({results.length})</h3>
            {results.length > 1 && (
              <button
                onClick={handleDownloadAll}
                disabled={isZipping}
                className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow-sm"
              >
                {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                Download All (ZIP)
              </button>
            )}
          </div>
          <div className="grid gap-2">
            {results.map((res, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-green-50/10 border border-green-200 rounded-xl group animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center space-x-3 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-xs font-bold truncate pr-4">{res.name}</p>
                </div>
                <button
                  onClick={() => handleDownloadResult(res)}
                  className="p-2 rounded-lg bg-card border hover:bg-muted transition-colors text-primary shadow-sm"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
