"use client";

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Download, Image as ImageIcon, Zap, Settings2, RotateCcw, LayoutGrid } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import FileList from '@/components/tool-layout/FileList';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { Tool } from '@/tools/types';

export default function ThumbnailGenerator({ tool }: { tool?: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState(150);
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'done'>('idle');
  const [isZipping, setIsZipping] = useState(false);
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

  const generateThumbnail = (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              name: `thumb_${size}x${size}_${file.name.replace(/\.[^/.]+$/, "")}.png`,
              blob: blob,
              url: URL.createObjectURL(blob),
              originalSize: file.size,
              compressedSize: blob.size,
              width: size,
              height: size
            });
          }
        }, 'image/png');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setResults([]);
    const newResults: any[] = [];
    for (const file of files) {
      const result = await generateThumbnail(file);
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
               await downloadAllAsZip(results.map(r => ({ name: r.name, blob: r.blob })), "thumbnails.zip");
             } finally { setIsZipping(false); }
          }}
          isZipping={isZipping}
          title="Thumbnails Generated"
        />
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
          <LayoutGrid className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Thumbnails</span>
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
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Thumbnail Options</h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Size</span>
              <span className="text-xs font-black text-primary">{size}x{size}px</span>
            </div>
            <input
              type="range"
              min="50" max="500" step="10"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
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
          Generate {files.length} Thumbnails
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('thumb-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Settings2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images for thumbnails</h4>
            <p className="text-sm text-muted-foreground font-medium">Batch generate consistent sized thumbnails</p>
          </div>
          <input id="thumb-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl overflow-y-auto max-h-full p-4">
          {files.map((file, i) => (
            <div key={i} className="aspect-square bg-white border border-border rounded-xl p-2 shadow-sm relative group">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{size}x{size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Thumbnail Generator"}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : `${files.length} Files selected`}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
    />
  );
}
