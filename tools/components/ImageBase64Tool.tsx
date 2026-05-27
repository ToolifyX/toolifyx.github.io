"use client";

/**
 * SEO Title: Batch Image to Base64 - Multiple Image Encoder
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard, downloadFile, fileToBase64 } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Copy, Download, CheckCircle2, RotateCcw } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import FileList from '@/components/tool-layout/FileList';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { Tool } from '@/tools/types';

interface Base64Result {
  name: string;
  string: string;
  type: string;
  blob: Blob;
}

export default function ImageBase64Tool({ tool }: { tool?: Tool }) {
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

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
          <Copy className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Encode</span>
        </button>
        <div className="h-px bg-border my-2" />
        <button onClick={() => { setFiles([]); setResults([]); }} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
          <RotateCcw className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Reset</span>
        </button>
      </div>

      {files.length > 0 && (
        <div className="pt-4 border-t border-border">
          <FileList
            files={files}
            onRemove={(idx) => setFiles(prev => prev.filter((_, i) => i !== idx))}
            onClear={() => setFiles([])}
          />
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px] space-y-4">
      {isProcessing && (
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Encoding images...</p>
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 opacity-30">
          <Zap className="w-12 h-12" />
          <p className="text-sm font-medium">Encoded results will appear here</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results ({results.length})</h3>
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

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('base64-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Copy className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images to encode</h4>
            <p className="text-sm text-muted-foreground font-medium">Generate Base64 strings instantly</p>
          </div>
          <input id="base64-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
          }} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
           <div className="w-32 h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative">
              <Copy className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-full shadow-lg">
                {files.length}
              </div>
           </div>
           <div className="text-center space-y-1">
              <h4 className="text-xl font-bold uppercase tracking-tight">Images ready to encode</h4>
              <p className="text-sm text-muted-foreground font-medium uppercase">
                {files.length} files selected
              </p>
           </div>
           <button
             onClick={() => document.getElementById('base64-upload')?.click()}
             className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
           >
             Add more files
           </button>
           <input id="base64-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
             const newFiles = Array.from(e.target.files || []);
             if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
           }} />
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Image Encoder"}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : files.length > 1 ? `${files.length} Files selected` : undefined}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
    />
  );
}
