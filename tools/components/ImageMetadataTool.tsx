"use client";

/**
 * SEO Title: Batch Image Metadata Remover - Strip EXIF Data
 * Meta Description: View info and remove metadata (EXIF) from multiple images at once for better privacy.
 *
 * FAQ 1: Can I strip metadata from many photos?
 * Yes, you can upload and process up to 5 images at once to remove hidden EXIF data.
 *
 * FAQ 2: What is removed?
 * All camera settings, timestamps, software info, and GPS location data are stripped by re-encoding the image.
 *
 * FAQ 3: Is it secure?
 * Yes, all processing is done locally in your browser. Your photos never leave your device.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Download, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MetadataResult {
  name: string;
  type: string;
  dataUrl: string;
}

export default function ImageMetadataTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<MetadataResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stripMetadataFile = (file: File): Promise<MetadataResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL(file.type, 0.95);
          resolve({
            name: `clean_${file.name}`,
            type: file.type,
            dataUrl: dataUrl
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

    const newResults: MetadataResult[] = [];
    for (const file of files) {
      const result = await stripMetadataFile(file);
      newResults.push(result);
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (res: MetadataResult) => {
    const byteString = atob(res.dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    downloadFile(new Blob([ab], { type: res.type }), res.name);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <ImageUploader
          maxFiles={5}
          maxSizeMB={5}
          totalSizeMB={20}
          onChange={setFiles}
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-2 border-t">
            <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-700">
               <ShieldAlert className="w-4 h-4 flex-shrink-0" />
               Re-encoding will strip all EXIF metadata (Location, Camera Info, etc.)
            </div>
            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Stripping Metadata...
                </>
              ) : (
                `Strip Metadata from ${files.length} Images`
              )}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cleaned Images</h3>
            <div className="grid gap-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-xs font-bold truncate">{res.name}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadResult(res)}
                    className="p-2 rounded-lg bg-card border hover:bg-muted transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
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
