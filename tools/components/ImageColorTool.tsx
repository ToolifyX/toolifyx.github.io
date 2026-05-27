"use client";

/**
 * SEO Title: Batch Image Color Tools - Extract Palette & Grayscale
 */

import React, { useState, useEffect, useRef } from 'react';
import { downloadFile, copyToClipboard } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Pipette, Ghost, Download } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';

interface ColorResult {
  name: string;
  colors: string[];
  grayscaleBlob: Blob;
  grayscaleUrl: string;
}

export default function ImageColorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ColorResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [limits, setLimits] = useState<UploadLimits | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const processFile = (file: File): Promise<ColorResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
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

          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: file.name,
                colors: extractedColors,
                grayscaleBlob: blob,
                grayscaleUrl: URL.createObjectURL(blob)
              });
            }
          }, 'image/png');
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
    downloadFile(res.grayscaleBlob, `bw_${res.name}`);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: `bw_${r.name}`, blob: r.grayscaleBlob })),
        "grayscale-images.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  const leftPanel = (
    <div className="space-y-4">
      <UploadPanel files={files} onChange={setFiles} maxFiles={limits?.maxFiles} />
      {files.length > 0 && (
        <button
          onClick={handleProcessAll}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pipette className="w-4 h-4 fill-current" />}
          Analyze {files.length} Images
        </button>
      )}
    </div>
  );

  const rightPanel = (
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px]">
      {isProcessing && (
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Analyzing images...</p>
        </div>
      )}

      {results.length > 0 && !isProcessing && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results ({results.length})</h3>
            {results.length > 1 && (
              <button
                onClick={handleDownloadAll}
                disabled={isZipping}
                className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow-sm"
              >
                {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                Download All B&W (ZIP)
              </button>
            )}
          </div>
          <div className="grid gap-4">
            {results.map((res, i) => (
              <div key={i} className="p-4 bg-muted/20 border rounded-xl space-y-4 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3 min-w-0">
                     <img src={res.grayscaleUrl} alt="bw" className="w-10 h-10 rounded border object-cover bg-card shadow-sm" />
                     <p className="text-xs font-bold truncate">{res.name}</p>
                   </div>
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
