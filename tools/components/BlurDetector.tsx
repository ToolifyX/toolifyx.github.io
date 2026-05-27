"use client";

/**
 * SEO Title: Batch Image Blur Detector - Check Multiple Images
 */

import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

interface BlurResult {
  name: string;
  score: number;
}

export default function BlurDetector() {
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

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />
      {files.length > 0 && (
        <button
          onClick={handleProcessAll}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 fill-current" />}
          Scan {files.length} Images for Blur
        </button>
      )}

      {isProcessing && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[200px] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Analyzing sharpness...</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-3 animate-in fade-in duration-300">
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
}
