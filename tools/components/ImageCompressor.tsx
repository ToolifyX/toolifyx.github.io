"use client";

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { processQueue, ProcessedResult } from '@/lib/imagePipeline';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Settings2, RotateCcw, Sliders, Image as ImageIcon } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import FileList from '@/components/tool-layout/FileList';
import { Tool } from '@/tools/types';

export default function ImageCompressor({ tool }: { tool?: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'done'>('idle');
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setStatus('ready');
      setResults([]);
    }
  };

  const handleProcessAll = async () => {
    if (files.length === 0 || !limits) return;
    setStatus('processing');
    setResults([]);

    try {
      const processedResults = await processQueue(
        files,
        { maxResolution: limits.maxResolution, quality, format: 'image/jpeg' },
        (current, total) => setProgress({ current, total })
      );
      setResults(processedResults);
      setStatus('done');
    } catch (error) {
      console.error("Batch processing failed:", error);
      alert("An error occurred during compression.");
      setStatus('ready');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
    setQuality(0.7);
  };

  if (status === 'done') {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <ResultScreen
          results={results}
          onReset={handleReset}
          onDownload={(res) => downloadFile(res.blob, res.name)}
          onDownloadAll={async () => {
             setIsZipping(true);
             try {
               await downloadAllAsZip(results.map(r => ({ name: r.name, blob: r.blob })), "compressed-images.zip");
             } finally { setIsZipping(false); }
          }}
          isZipping={isZipping}
          title="Images Compressed"
        />
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
          <Sliders className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Compress</span>
        </button>
        <div className="h-px bg-border my-2" />
        <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Compression</h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Quality</span>
              <span className="text-xs font-black text-primary">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1" max="1" step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-[8px] text-muted-foreground font-medium italic">
                {quality > 0.8 ? "Lower compression, higher quality." : quality > 0.4 ? "Balanced compression and quality." : "Max compression, lower quality."}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={handleProcessAll}
          disabled={status !== 'ready'}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {status === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
          Compress {files.length} Files
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('compress-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Settings2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images to compress</h4>
            <p className="text-sm text-muted-foreground font-medium">Reduce file size without losing quality</p>
          </div>
          <input id="compress-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
           <div className="w-32 h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative">
              <ImageIcon className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-full shadow-lg">
                {files.length}
              </div>
           </div>
           <div className="text-center space-y-1">
              <h4 className="text-xl font-bold uppercase tracking-tight">Images ready to compress</h4>
              <p className="text-sm text-muted-foreground font-medium uppercase">
                Total size: {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
              </p>
           </div>
           <button
             onClick={() => document.getElementById('compress-upload')?.click()}
             className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
           >
             Add more files
           </button>
           <input id="compress-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
             const newFiles = Array.from(e.target.files || []);
             if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
           }} />
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Image Compressor"}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : `${files.length} Files selected`}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
    />
  );
}
