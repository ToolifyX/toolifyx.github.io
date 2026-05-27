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
  Search,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import { downloadFile } from '@/lib/utils';

type ToolStatus = 'idle' | 'ready' | 'processing' | 'done';

interface TransformState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
}

export default function ImageEditor() {
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);

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

  const handleTransformChange = (changes: Partial<TransformState>) => {
    setTransform(prev => ({ ...prev, ...changes }));
    setResultUrl(null); // Clear previous result if any
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

  const handleDownload = () => {
    if (resultUrl && selectedImage) {
      fetch(resultUrl)
        .then(r => r.blob())
        .then(blob => downloadFile(blob, `edited_${selectedImage.name}`));
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setResultUrl(null);
    setTransform({ rotation: 0, flipH: false, flipV: false, zoom: 1 });
    setStatus('idle');
  };

  const leftPanel = (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <RotateCw className="w-3 h-3" /> Transformation
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTransformChange({ rotation: transform.rotation - 90 })}
            className="flex flex-col items-center justify-center p-4 bg-card border rounded-2xl hover:bg-muted transition-all group"
          >
            <RotateCcw className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Rotate -90°</span>
          </button>
          <button
            onClick={() => handleTransformChange({ rotation: transform.rotation + 90 })}
            className="flex flex-col items-center justify-center p-4 bg-card border rounded-2xl hover:bg-muted transition-all group"
          >
            <RotateCw className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Rotate +90°</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTransformChange({ flipH: !transform.flipH })}
            className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all group ${transform.flipH ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'}`}
          >
            <FlipHorizontal className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Flip Horizontal</span>
          </button>
          <button
            onClick={() => handleTransformChange({ flipV: !transform.flipV })}
            className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all group ${transform.flipV ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'}`}
          >
            <FlipVertical className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Flip Vertical</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
           <Search className="w-3 h-3" /> Canvas Zoom
        </h3>
        <div className="flex items-center gap-4">
          <ZoomOut className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={transform.zoom}
            onChange={(e) => handleTransformChange({ zoom: parseFloat(e.target.value) })}
            className="flex-1 accent-primary"
          />
          <ZoomIn className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase">{Math.round(transform.zoom * 100)}% Scale</p>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={() => handleTransformChange({ rotation: 0, flipH: false, flipV: false, zoom: 1 })}
          className="w-full py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
        >
          <Undo2 className="w-3.5 h-3.5" /> Reset Transforms
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
       {!selectedImage ? (
         <div
          className="w-full max-w-xl border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('edit-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload image to edit</h4>
            <p className="text-sm text-muted-foreground font-medium">Simple & fast rotation and flipping</p>
          </div>
          <input
            id="edit-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
       ) : (
         <div className="relative w-full h-full flex items-center justify-center p-8 bg-black/5 dark:bg-white/5 rounded-3xl border border-border shadow-inner">
            <div
              className="relative transition-transform duration-200 ease-out shadow-2xl bg-white"
              style={{
                transform: `scale(${transform.zoom}) rotate(${transform.rotation}deg) scaleX(${transform.flipH ? -1 : 1}) scaleY(${transform.flipV ? -1 : 1})`,
              }}
            >
              <img
                src={imageUrl!}
                alt="Editing"
                className="max-w-[70vw] max-h-[70vh] object-contain select-none pointer-events-none"
              />
            </div>
         </div>
       )}
    </div>
  );

  const rightPanel = (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Layers className="w-3 h-3" /> Result Preview
          </h3>
          {status === 'done' && (
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-muted hover:bg-border transition-colors"
            >
              Hold for Original
            </button>
          )}
        </div>

        <div className="aspect-square bg-muted/30 border border-border rounded-2xl flex items-center justify-center overflow-hidden relative">
          {status === 'done' && resultUrl ? (
            <img
              src={showOriginal ? imageUrl! : resultUrl}
              alt="Result"
              className="max-w-full max-h-full object-contain animate-in fade-in duration-300"
            />
          ) : (
            <div className="text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-muted/30 mx-auto" />
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Awaiting changes</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        {status === 'done' ? (
          <button
            onClick={handleDownload}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download Edited Image
          </button>
        ) : (
          <button
            onClick={handleApplyChanges}
            disabled={status !== 'ready' || isProcessing}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:grayscale"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Apply Changes'
            )}
          </button>
        )}
      </div>

      {selectedImage && (
        <div className="p-4 bg-muted/20 border border-dashed border-border rounded-xl">
           <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Browser-Native processing active</span>
           </div>
        </div>
      )}
    </div>
  );

  const bottomBar = selectedImage ? (
    <>
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Size</span>
          <span className="text-xs font-bold">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
         <button onClick={handleReset} className="px-4 py-2 text-xs font-bold hover:bg-muted rounded-lg transition-colors">
            Discard
         </button>
         <button
          onClick={handleApplyChanges}
          disabled={isProcessing}
          className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
         >
           Apply & Export
         </button>
      </div>
    </>
  ) : null;

  return (
    <EditorLayout
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      bottomBar={bottomBar}
    />
  );
}
