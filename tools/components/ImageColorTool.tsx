"use client";

/**
 * SEO Title: Batch Image Color Tools - Extract Palette & Grayscale
 */

import React, { useState, useEffect, useRef } from 'react';
import { downloadFile, copyToClipboard } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, Pipette, Ghost, Download, RotateCcw } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import FileList from '@/components/tool-layout/FileList';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { Tool } from '@/tools/types';

interface ColorResult {
  name: string;
  colors: string[];
  grayscaleBlob: Blob;
  grayscaleUrl: string;
}

export default function ImageColorTool({ tool }: { tool?: Tool }) {
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

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setIsProcessing(false);
  };

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
          <Pipette className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Analyze</span>
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
    <div className="card border rounded-lg p-4 bg-card shadow-sm min-h-[400px]">
      {isProcessing && (
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold">Analyzing images...</p>
        </div>
      )}

      {!isProcessing && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 opacity-30">
          <Zap className="w-12 h-12" />
          <p className="text-sm font-medium">Analysis results will appear here</p>
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

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Pipette className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images to analyze</h4>
            <p className="text-sm text-muted-foreground font-medium">Extract palettes and generate grayscale versions</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full h-full overflow-y-auto p-6">
          {files.map((file, i) => (
            <div key={i} className="aspect-square bg-white border border-border rounded-xl p-2 shadow-sm relative group flex items-center justify-center overflow-hidden">
              <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
              <div className="absolute inset-x-2 bottom-2 bg-black/80 backdrop-blur-md p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-center">
                <p className="text-[9px] font-black text-white truncate uppercase">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Image Color Tool"}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : files.length > 1 ? `${files.length} Files selected` : undefined}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
    />
  );
}
