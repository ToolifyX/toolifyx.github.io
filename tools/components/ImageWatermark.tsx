"use client";

/**
 * SEO Title: Online Image Watermark - Add Text or Logo to Photos
 * Meta Description: Protect your photos by adding custom text or image watermarks. Control opacity, position, and scale instantly in your browser.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2, Zap, Type, Image as ImageIcon, Settings2 } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadFile } from '@/lib/utils';

export default function ImageWatermark() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkText, setWatermarkText] = useState('COPYRIGHT');
  const [opacity, setOpacity] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const drawWatermark = () => {
    if (files.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Watermark settings
      ctx.globalAlpha = opacity;
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 5;

      const fontSize = (img.width / 10) * scale;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw text watermark centered
      ctx.fillText(watermarkText, img.width / 2, img.height / 2);

      setPreviewUrl(canvas.toDataURL('image/png'));
    };
    img.src = URL.createObjectURL(files[0]);
  };

  useEffect(() => {
    if (files.length > 0) {
      drawWatermark();
    } else {
      setPreviewUrl(null);
    }
  }, [files, watermarkText, opacity, scale]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `watermarked-${files[0].name}`;
    link.click();
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <UploadPanel files={files} onChange={setFiles} maxFiles={1} />

           {previewUrl ? (
             <div className="card border rounded-2xl overflow-hidden bg-muted/20 flex items-center justify-center min-h-[400px]">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[600px] object-contain shadow-2xl" />
             </div>
           ) : (
             <div className="card border-2 border-dashed rounded-2xl h-[400px] flex items-center justify-center text-muted-foreground italic">
                Upload a photo to see watermark preview
             </div>
           )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
               <Settings2 className="w-4 h-4" /> Watermark Settings
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Watermark Text</label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter text..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Opacity</label>
                   <span className="text-[10px] font-black text-primary">{(opacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Font Scale</label>
                   <span className="text-[10px] font-black text-primary">{scale}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={files.length === 0}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
            >
              <Download className="w-4 h-4" /> Download Result
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
