"use client";

/**
 * SEO Title: Batch Image Blur Detector - Check Multiple Images
 */

import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle2, AlertCircle, Zap, RotateCcw } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import FileList from '@/components/tool-layout/FileList';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { Tool } from '@/tools/types';

interface BlurResult {
  name: string;
  score: number;
}

export default function BlurDetector({ tool }: { tool?: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<BlurResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const analyzeBlur = (file: File): Promise<BlurResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = 300;
          canvas.height = 300;
          ctx.drawImage(img, 0, 0, 300, 300);
          const imageData = ctx.getImageData(0, 0, 300, 300);
          const data = imageData.data;

          let sum = 0;
          for (let i = 0; i < data.length - 4; i += 4) {
            const gray1 = (data[i] + data[i+1] + data[i+2]) / 3;
            const gray2 = (data[i+4] + data[i+5] + data[i+6]) / 3;
            sum += Math.abs(gray1 - gray2);
          }

          const sharpness = sum / (300 * 300);
          resolve({
            name: file.name,
            score: parseFloat(sharpness.toFixed(2))
          });
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
    const newResults: BlurResult[] = [];
    for (const file of files) {
      const result = await analyzeBlur(file);
      newResults.push(result);
    }
    setResults(newResults);
    setIsProcessing(false);
  };

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
          <Search className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Scan Blur</span>
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
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px]">
      {isProcessing && (
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Analyzing sharpness...</p>
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 opacity-30">
          <Zap className="w-12 h-12" />
          <p className="text-sm font-medium">Sharpness scores will appear here</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Sharpness Analysis ({results.length})</h3>
          <div className="grid gap-2">
            {results.map((res, i) => (
              <div key={i} className={`flex items-center justify-between p-3 border rounded-xl animate-in fade-in slide-in-from-top-1 ${res.score > 15 ? 'bg-green-50/50 border-green-100' : 'bg-yellow-50/50 border-yellow-100'}`}>
                <div className="flex items-center space-x-3 min-w-0">
                  {res.score > 15 ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate pr-4">{res.name}</p>
                    <p className="text-[10px] uppercase font-black text-muted-foreground/60">{res.score > 15 ? 'Sharp' : 'Potentially Blurry'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black">{res.score}</span>
                  <p className="text-[8px] uppercase font-bold text-muted-foreground">Score</p>
                </div>
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
          onClick={() => document.getElementById('blur-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Search className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images to scan</h4>
            <p className="text-sm text-muted-foreground font-medium">Analyze sharpness and detect blur</p>
          </div>
          <input id="blur-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
          }} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
           <div className="w-32 h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative">
              <Search className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-full shadow-lg">
                {files.length}
              </div>
           </div>
           <div className="text-center space-y-1">
              <h4 className="text-xl font-bold uppercase tracking-tight">Images ready for scanning</h4>
              <p className="text-sm text-muted-foreground font-medium uppercase">
                {files.length} files selected
              </p>
           </div>
           <button
             onClick={() => document.getElementById('blur-upload')?.click()}
             className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
           >
             Add more files
           </button>
           <input id="blur-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
             const newFiles = Array.from(e.target.files || []);
             if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
           }} />
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Blur Detector"}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : files.length > 1 ? `${files.length} Files selected` : undefined}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
    />
  );
}
