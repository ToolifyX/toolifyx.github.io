"use client";

/**
 * SEO Title: Batch Image Blur Detector - Check Multiple Images
 * Meta Description: Analyze the sharpness of multiple images at once. Use edge detection to find blurry or out-of-focus photos in your collection.
 *
 * FAQ 1: How many images can I scan?
 * You can upload up to 5 images to analyze their sharpness scores simultaneously.
 *
 * FAQ 2: What do the scores mean?
 * A higher score (typically >15) indicates a sharp image with high detail. Lower scores may suggest motion blur or low focus.
 *
 * FAQ 3: Is my data private?
 * Yes, all analysis is performed locally using the browser's Canvas API. No images are uploaded to any server.
 */

import React, { useState, useRef } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface BlurResult {
  name: string;
  score: number;
}

export default function BlurDetector() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<BlurResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analyzeBlur = (file: File): Promise<BlurResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <ImageUploader maxFiles={5} onChange={setFiles} />

        {files.length > 0 && (
          <button
            onClick={handleProcessAll}
            disabled={isProcessing}
            className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Scan {files.length} Images for Blur
          </button>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sharpness Analysis</h3>
            <div className="grid gap-2">
              {results.map((res, i) => (
                <div key={i} className={`flex items-center justify-between p-3 border rounded-xl ${res.score > 15 ? 'bg-green-50/50 border-green-100' : 'bg-yellow-50/50 border-yellow-100'}`}>
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
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
