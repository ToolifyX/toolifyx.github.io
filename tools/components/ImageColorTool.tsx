"use client";

/**
 * SEO Title: Batch Image Color Tools - Extract Palette & Grayscale
 * Meta Description: Extract colors or convert multiple images to grayscale at once. Secure, browser-based batch processing.
 *
 * FAQ 1: Can I extract colors from multiple images?
 * Yes, you can upload up to 5 images and see the dominant color palette for each.
 *
 * FAQ 2: Does grayscale work on multiple files?
 * Yes, you can convert all uploaded images to black and white in one click and download them individually.
 *
 * FAQ 3: How many colors are extracted?
 * The tool identifies the top 6 most prominent colors from each image.
 */

import React, { useState, useRef } from 'react';
import { downloadFile, copyToClipboard } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Download, Pipette, Ghost } from 'lucide-react';

interface ColorResult {
  name: string;
  colors: string[];
  grayscaleDataUrl: string;
}

export default function ImageColorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ColorResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File): Promise<ColorResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');

          // Palette Extraction
          canvas.width = 100;
          canvas.height = 100;
          ctx?.drawImage(img, 0, 0, 100, 100);
          const pixelData = ctx?.getImageData(0, 0, 100, 100).data;
          const colorMap: Record<string, number> = {};
          if (pixelData) {
            for (let i = 0; i < pixelData.length; i += 40) {
              const r = pixelData[i], g = pixelData[i+1], b = pixelData[i+2];
              const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
              colorMap[hex] = (colorMap[hex] || 0) + 1;
            }
          }
          const extractedColors = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);

          // Grayscale Generation
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = data[i+1] = data[i+2] = avg;
          }
          ctx!.putImageData(imageData, 0, 0);
          const grayscaleUrl = canvas.toDataURL('image/png');

          resolve({
            name: file.name,
            colors: extractedColors,
            grayscaleDataUrl: grayscaleUrl
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
    const newResults: ColorResult[] = [];
    for (const file of files) {
      const result = await processFile(file);
      newResults.push(result);
    }
    setResults(newResults);
    setIsProcessing(false);
  };

  const handleCopy = async (color: string) => {
    await copyToClipboard(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1000);
  };

  const handleDownloadGrayscale = (res: ColorResult) => {
    const byteString = atob(res.grayscaleDataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    downloadFile(new Blob([ab], { type: 'image/png' }), `bw_${res.name}`);
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
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pipette className="w-4 h-4" />}
            Analyze {files.length} Images
          </button>
        )}

        {results.length > 0 && (
          <div className="space-y-6 pt-4 border-t">
            {results.map((res, i) => (
              <div key={i} className="p-4 bg-muted/20 border rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-xs font-bold truncate pr-4">{res.name}</p>
                   <button
                     onClick={() => handleDownloadGrayscale(res)}
                     className="text-[10px] font-bold uppercase flex items-center gap-1 text-primary hover:underline"
                   >
                     <Ghost className="w-3 h-3" /> Get B&W
                   </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {res.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleCopy(color)}
                      className="w-8 h-8 rounded border shadow-sm relative transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {copied === color && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded">Copied</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
