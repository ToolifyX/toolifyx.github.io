"use client";

/**
 * SEO Title: Batch Image Format Converter - JPG, PNG, WebP Online
 * Meta Description: Convert multiple images between formats instantly. PNG to JPG, JPG to PNG, and more. Free, secure batch processing.
 *
 * FAQ 1: Can I convert many images at once?
 * Yes, you can upload and convert up to 5 images simultaneously.
 *
 * FAQ 2: Will converting to PNG preserve transparency?
 * Yes, converting from formats with transparency (like WebP or SVG) to PNG will keep the transparency.
 *
 * FAQ 3: Is it free to use?
 * Yes, all tools on ToolifyX are completely free with no registration required.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';

interface ConvertedImage {
  name: string;
  type: string;
  dataUrl: string;
}

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState('image/jpeg');
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertFile = (file: File): Promise<ConvertedImage> => {
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

          if (targetFormat === 'image/jpeg') {
            ctx!.fillStyle = '#FFFFFF';
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx?.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL(targetFormat, 0.9);
          const ext = targetFormat.split('/')[1];

          resolve({
            name: file.name.replace(/\.[^/.]+$/, "") + `_converted.${ext}`,
            type: targetFormat,
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

    const newResults: ConvertedImage[] = [];
    for (const file of files) {
      const result = await convertFile(file);
      newResults.push(result);
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (res: ConvertedImage) => {
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
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Select Target Format</label>
              <select
                className="w-full border rounded-lg p-2 text-sm"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
              >
                <option value="image/jpeg">Convert to JPG</option>
                <option value="image/png">Convert to PNG</option>
                <option value="image/webp">Convert to WebP</option>
              </select>
            </div>

            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Converting {files.length} Images...
                </>
              ) : (
                `Convert All ${files.length} Images`
              )}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Converted Images</h3>
            <div className="grid gap-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{res.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{res.type.split('/')[1]}</p>
                    </div>
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
