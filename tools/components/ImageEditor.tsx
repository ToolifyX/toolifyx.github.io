"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  ImageIcon,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Download,
  Loader2,
  CheckCircle2,
  Layers,
  Crop,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import { downloadFile } from '@/lib/utils';
import { Tool } from '@/tools/types';

type ToolStatus = 'idle' | 'ready' | 'processing' | 'done';

interface TransformState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
}

export default function ImageEditor({ tool }: { tool?: Tool }) {
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [transform, setTransform] = useState<TransformState>({
    rotation: 0,
    flipH: false,
    flipV: false,
    zoom: 1
  });
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(url);
      setStatus('ready');
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
      setStatus('idle');
    }
  }, [selectedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setTransform({ rotation: 0, flipH: false, flipV: false, zoom: 1 });
      setResultUrl(null);
    }
  };

  const applyTransforms = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!selectedImage) return resolve(null);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const isRotated = (transform.rotation / 90) % 2 !== 0;

        canvas.width = isRotated ? img.height : img.width;
        canvas.height = isRotated ? img.width : img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((transform.rotation * Math.PI) / 180);
        ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 0.9);
      };
      img.src = URL.createObjectURL(selectedImage);
    });
  }, [selectedImage, transform]);

  const handleApplyChanges = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setStatus('processing');

    const blob = await applyTransforms();
    if (blob) {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setStatus('done');
    }
    setIsProcessing(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setResultUrl(null);
    setTransform({ rotation: 0, flipH: false, flipV: false, zoom: 1 });
    setStatus('idle');
  };

  const leftPanel = (
    <div className="flex flex-col gap-2">
      <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-muted text-muted-foreground transition-all">
        <Crop className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Crop</span>
      </button>
      <button
        onClick={() => setTransform(t => ({ ...t, rotation: t.rotation + 90 }))}
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all"
      >
        <RotateCw className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Rotate</span>
      </button>
      <button
        onClick={() => setTransform(t => ({ ...t, flipH: !t.flipH }))}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${transform.flipH ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
      >
        <FlipHorizontal className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Flip H</span>
      </button>
      <button
        onClick={() => setTransform(t => ({ ...t, flipV: !t.flipV }))}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${transform.flipV ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
      >
        <FlipVertical className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Flip V</span>
      </button>
      <div className="h-px bg-border my-2" />
      <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
        <Undo2 className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Reset</span>
      </button>
    </div>
  );

  const rightPanel = (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Canvas Control</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-muted/50 p-3 rounded-xl border border-border">
             <button onClick={() => setTransform(t => ({ ...t, zoom: Math.max(0.1, t.zoom - 0.1) }))} className="p-1 hover:bg-background rounded shadow-sm">
               <ZoomOut className="w-4 h-4" />
             </button>
             <span className="text-xs font-black">{Math.round(transform.zoom * 100)}%</span>
             <button onClick={() => setTransform(t => ({ ...t, zoom: Math.min(3, t.zoom + 0.1) }))} className="p-1 hover:bg-background rounded shadow-sm">
               <ZoomIn className="w-4 h-4" />
             </button>
          </div>
          <button onClick={() => setTransform(t => ({ ...t, zoom: 1 }))} className="w-full py-2 bg-muted text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-border transition-colors">
             <Maximize className="w-3 h-3" /> Fit to screen
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Properties</h3>
        <div className="p-4 bg-muted/30 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Rotation</span>
            <span className="text-xs font-black">{transform.rotation}°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Flip H</span>
            <span className="text-xs font-black">{transform.flipH ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Flip V</span>
            <span className="text-xs font-black">{transform.flipV ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={handleApplyChanges}
          disabled={status !== 'ready' || isProcessing}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Changes'}
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {!selectedImage ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('edit-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload image to edit</h4>
            <p className="text-sm text-muted-foreground font-medium">Rotate, Flip and transform instantly</p>
          </div>
          <input id="edit-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="relative transition-transform duration-200 ease-out flex items-center justify-center w-full h-full" style={{ transform: `scale(${transform.zoom})` }}>
          <div className="relative shadow-2xl bg-white p-1 rounded-sm border border-border/50 overflow-hidden flex items-center justify-center" style={{ transform: `rotate(${transform.rotation}deg) scaleX(${transform.flipH ? -1 : 1}) scaleY(${transform.flipV ? -1 : 1})` }}>
            <img src={imageUrl!} alt="Editing" className="max-w-full max-h-full object-contain select-none pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Image Editor"}
      toolIcon={tool?.icon}
      fileName={selectedImage?.name}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      onDownload={status === 'done' ? () => {
        if (resultUrl && selectedImage) {
          fetch(resultUrl).then(r => r.blob()).then(blob => downloadFile(blob, `edited_${selectedImage.name}`));
        }
      } : undefined}
    />
  );
}
