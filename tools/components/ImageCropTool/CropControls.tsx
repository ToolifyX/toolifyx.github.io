"use client";

import React from 'react';
import { aspectRatios, AspectRatio } from './useCropEngine';
import { RotateCw, Maximize, RefreshCcw, Download, FlipHorizontal, FlipVertical, ZoomIn, ZoomOut } from 'lucide-react';

interface CropControlsProps {
  aspect: number | null;
  setAspect: (aspect: number | null) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  flip: { horizontal: boolean; vertical: boolean };
  toggleFlip: (direction: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  onDownload: () => void;
  isProcessing: boolean;
}

export default function CropControls({
  aspect,
  setAspect,
  zoom,
  setZoom,
  flip,
  toggleFlip,
  onReset,
  onDownload,
  isProcessing
}: CropControlsProps) {
  return (
    <div className="flex flex-col h-full bg-card border-l overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Crop Options</h2>
      </div>

      <div className="p-4 space-y-6">
        <section className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase">Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => setAspect(ratio.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  aspect === ratio.value
                    ? 'bg-primary text-white border-primary'
                    : 'hover:bg-muted bg-card'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase">Zoom</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-2 border rounded-lg hover:bg-muted">
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1"
            />
            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-2 border rounded-lg hover:bg-muted">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase">Transform</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleFlip('horizontal')}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${flip.horizontal ? 'bg-primary text-white border-primary' : 'hover:bg-muted bg-card'}`}
            >
              <FlipHorizontal className="w-4 h-4" /> Flip H
            </button>
            <button
              onClick={() => toggleFlip('vertical')}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${flip.vertical ? 'bg-primary text-white border-primary' : 'hover:bg-muted bg-card'}`}
            >
              <FlipVertical className="w-4 h-4" /> Flip V
            </button>
          </div>
        </section>

        <section className="space-y-2 pt-4">
           <button
             onClick={onReset}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border hover:bg-muted transition-colors"
           >
             <RefreshCcw className="w-4 h-4" /> Reset Crop
           </button>
        </section>

        <div className="pt-6 border-t mt-auto">
          <button
            onClick={onDownload}
            disabled={isProcessing}
            className="w-full bg-black text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black/90 disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Cropped Image
          </button>
        </div>
      </div>
    </div>
  );
}
