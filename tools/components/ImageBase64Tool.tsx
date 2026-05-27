"use client";

/**
 * SEO Title: Batch Image to Base64 - Multiple Image Encoder
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard, downloadFile, fileToBase64 } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Copy, Download, CheckCircle2 } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

interface Base64Result {
  name: string;
  string: string;
  type: string;
  blob: Blob;
}

export default function ImageBase64Tool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Base64Result[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    const newResults: Base64Result[] = [];
    for (const file of files) {
      const base64 = await fileToBase64(file);
      newResults.push({
        name: file.name,
        string: base64,
        type: file.type,
        blob: file // In this tool, the "result" blob is just the original
      });
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "images-base64.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />
      {files.length > 0 && (
        <button
          onClick={handleProcessAll}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
          Encode {files.length} Images to Base64
        </button>
      )}

      {isProcessing && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[200px] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Encoding images...</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results ({results.length})</h3>
            <button
                onClick={handleDownloadAll}
                disabled={isZipping}
                className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow-sm"
              >
                {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                Download All (ZIP)
            </button>
          </div>
          <div className="grid gap-4">
            {results.map((res, i) => (
              <div key={i} className="p-3 bg-muted/30 border rounded-xl space-y-2 group animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold truncate pr-4">{res.name}</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCopy(res.string, i)}
                      className="p-1.5 rounded-lg bg-card border hover:bg-muted text-xs flex items-center gap-1 transition-colors shadow-sm"
                    >
                      {copiedIndex === i ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px] font-bold uppercase">{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  className="w-full h-20 border rounded-lg p-2 text-[10px] font-mono bg-card custom-scrollbar"
                  value={res.string}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
