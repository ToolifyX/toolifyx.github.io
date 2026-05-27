"use client";

/**
 * SEO Title: Batch Image Editor - Rotate & Flip Multiple Images
 * Meta Description: Rotate or flip many images at once. apply the same transformation to all uploaded photos and download them instantly.
 *
 * FAQ 1: Can I edit multiple images?
 * Yes, you can upload up to 5 images and apply rotation or flip transformations to all of them.
 *
 * FAQ 2: Does it support bulk download?
 * You can download each edited image individually after processing the batch.
 *
 * FAQ 3: Are the transformations lossless?
 * PNG and WebP transformations are essentially lossless in terms of layout, though the image is re-encoded.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Loader2, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, CheckCircle2 } from 'lucide-react';

interface EditedResult {
  name: string;
  dataUrl: string;
}

export default function ImageEditor() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [results, setResults] = useState<EditedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const editFile = (file: File): Promise<EditedResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const isRotated = (rotation / 90) % 2 !== 0;
          canvas.width = isRotated ? img.height : img.width;
          canvas.height = isRotated ? img.width : img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();

          const dataUrl = canvas.toDataURL('image/png');
          resolve({
            name: `edited_${file.name.replace(/\.[^/.]+$/, "")}.png`,
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
    const newResults: EditedResult[] = [];
    for (const file of files) {
      const result = await editFile(file);
      newResults.push(result);
    }
    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadResult = (res: EditedResult) => {
    const byteString = atob(res.dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    downloadFile(new Blob([ab], { type: 'image/png' }), res.name);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <ImageUploader maxFiles={5} onChange={setFiles} />

        {files.length > 0 && (
          <div className="space-y-4 pt-2 border-t">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => setRotation(r => r + 90)} className="p-2 border rounded-lg flex items-center justify-center gap-1 text-xs font-bold hover:bg-muted transition-colors">
                <RotateCw className="w-3 h-3" /> +90°
              </button>
              <button onClick={() => setRotation(r => r - 90)} className="p-2 border rounded-lg flex items-center justify-center gap-1 text-xs font-bold hover:bg-muted transition-colors">
                <RotateCcw className="w-3 h-3" /> -90°
              </button>
              <button onClick={() => setFlipH(!flipH)} className={`p-2 border rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-all ${flipH ? 'bg-primary text-white border-primary' : 'hover:bg-muted'}`}>
                <FlipHorizontal className="w-3 h-3" /> Flip H
              </button>
              <button onClick={() => setFlipV(!flipV)} className={`p-2 border rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-all ${flipV ? 'bg-primary text-white border-primary' : 'hover:bg-muted'}`}>
                <FlipVertical className="w-3 h-3" /> Flip V
              </button>
            </div>

            <button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Apply & Process {files.length} Images
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Results</h3>
            <div className="grid gap-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-xs font-bold truncate pr-4">{res.name}</p>
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
