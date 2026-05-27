"use client";

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { processQueue, ProcessedResult } from '@/lib/imagePipeline';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Settings2, Maximize2, Monitor, Smartphone, Layout, RotateCcw } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';

export default function ImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(1920);
  const [maintainAspect, setMaintainAspect] = useState(true);
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
        { maxResolution: width, quality: 0.9, format: 'image/png' },
        (current, total) => setProgress({ current, total })
      );
      setResults(processedResults);
      setStatus('done');
    } catch (error) {
      console.error("Batch processing failed:", error);
      alert("An error occurred during resizing.");
      setStatus('ready');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "resized-images.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  const leftPanel = (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setWidth(1920)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${width === 1920 ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
      >
        <Monitor className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">FHD (1920)</span>
      </button>
      <button
        onClick={() => setWidth(1280)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${width === 1280 ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
      >
        <Layout className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">HD (1280)</span>
      </button>
      <button
        onClick={() => setWidth(720)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${width === 720 ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
      >
        <Smartphone className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Mobile (720)</span>
      </button>
      <div className="h-px bg-border my-2" />
      <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
        <RotateCcw className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Reset</span>
      </button>
    </div>
  );

  const rightPanel = (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Resize Options</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase">Target Width (Pixels)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs font-black"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Maintain Aspect</span>
             <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="w-4 h-4 accent-primary"
             />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Statistics</h3>
        <div className="p-4 bg-muted/30 rounded-xl space-y-2">
           <div className="flex justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Batch Size</span>
              <span className="text-xs font-black">{files.length} Files</span>
           </div>
           <div className="flex justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Quality</span>
              <span className="text-xs font-black">90%</span>
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
          Resize Images
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('resize-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Maximize2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images to resize</h4>
            <p className="text-sm text-muted-foreground font-medium">Batch process multiple images at once</p>
          </div>
          <input id="resize-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full h-full overflow-y-auto p-6">
          {files.map((file, i) => (
            <div key={i} className="aspect-square bg-white border border-border rounded-xl p-2 shadow-sm relative group flex items-center justify-center overflow-hidden">
              <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
              <div className="absolute inset-x-2 bottom-2 bg-black/80 backdrop-blur-md p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[9px] font-black text-white truncate uppercase">{file.name}</p>
                <p className="text-[8px] text-white/60 font-bold uppercase">Target: {width}px</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName="Image Resizer"
      fileName={files.length === 1 ? files[0].name : `${files.length} Files selected`}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      onDownload={status === 'done' ? handleDownloadAll : undefined}
    />
  );
}
