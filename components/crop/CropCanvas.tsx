"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropCanvasProps {
  image: File | null;
  aspectRatio: number | null;
  onCropChange: (crop: CropArea) => void;
  status: 'idle' | 'ready' | 'cropping' | 'done';
}

export default function CropCanvas({ image, aspectRatio, onCropChange, status }: CropCanvasProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 }); // Percentages
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDragging = useRef(false);
  const dragType = useRef<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startCrop = useRef<CropArea>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [image]);

  const updateCrop = useCallback((newCrop: CropArea) => {
    let constrained = { ...newCrop };

    if (aspectRatio && imgSize.width > 0) {
      // Maintain aspect ratio logic
      const targetRatio = aspectRatio;
      const currentWidthPx = (newCrop.width / 100) * imgSize.width;
      const currentHeightPx = (newCrop.height / 100) * imgSize.height;

      if (dragType.current === 'se' || dragType.current === 'nw' || dragType.current === 'ne' || dragType.current === 'sw') {
          // Adjust based on the direction of drag
          constrained.height = (newCrop.width * imgSize.width) / (targetRatio * imgSize.height);
      }
    }

    constrained = {
      x: Math.max(0, Math.min(constrained.x, 100 - constrained.width)),
      y: Math.max(0, Math.min(constrained.y, 100 - constrained.height)),
      width: Math.max(1, Math.min(constrained.width, 100 - constrained.x)),
      height: Math.max(1, Math.min(constrained.height, 100 - constrained.y)),
    };

    setCrop(constrained);
    onCropChange(constrained);
  }, [onCropChange, aspectRatio, imgSize]);

  useEffect(() => {
    if (aspectRatio && imgSize.width > 0) {
        const initialWidth = 80;
        let initialHeight = (initialWidth * imgSize.width) / (aspectRatio * imgSize.height);

        if (initialHeight > 80) {
            initialHeight = 80;
            const adjustedWidth = (80 * aspectRatio * imgSize.height) / imgSize.width;
            const newCrop = { x: (100 - adjustedWidth) / 2, y: 10, width: adjustedWidth, height: 80 };
            setCrop(newCrop);
            onCropChange(newCrop);
        } else {
            const newCrop = { x: 10, y: (100 - initialHeight) / 2, width: 80, height: initialHeight };
            setCrop(newCrop);
            onCropChange(newCrop);
        }
    }
  }, [aspectRatio, imgSize.width, imgSize.height, onCropChange]);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    isDragging.current = true;
    dragType.current = type;
    startPos.current = { x: e.clientX, y: e.clientY };
    startCrop.current = { ...crop };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const dx = ((e.clientX - startPos.current.x) / (containerRef.current.offsetWidth * zoom)) * 100;
    const dy = ((e.clientY - startPos.current.y) / (containerRef.current.offsetHeight * zoom)) * 100;

    let newCrop = { ...startCrop.current };

    if (dragType.current === 'move') {
      newCrop.x += dx;
      newCrop.y += dy;
    } else if (dragType.current === 'se') {
      newCrop.width += dx;
      newCrop.height += dy;
    } else if (dragType.current === 'nw') {
        newCrop.x += dx;
        newCrop.y += dy;
        newCrop.width -= dx;
        newCrop.height -= dy;
    } else if (dragType.current === 'ne') {
        newCrop.y += dy;
        newCrop.width += dx;
        newCrop.height -= dy;
    } else if (dragType.current === 'sw') {
        newCrop.x += dx;
        newCrop.width -= dx;
        newCrop.height += dy;
    }

    updateCrop(newCrop);
  }, [updateCrop, zoom]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragType.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!imageUrl) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">
      {/* Zoom Controls Overlay */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border p-2 rounded-xl z-10 shadow-lg">
        <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-black w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-muted rounded-lg transition-colors border-l pl-2 ml-1">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div
        className="relative transition-transform duration-200 ease-out flex items-center justify-center w-full h-full"
        style={{ transform: `scale(${zoom})` }}
      >
        <div
          ref={containerRef}
          className="relative shadow-2xl bg-muted rounded-sm overflow-hidden flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="To crop"
            className="block max-w-full max-h-full object-contain select-none"
            onLoad={(e) => {
              const img = e.currentTarget;
              setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
          />

          {/* Backdrop overlay */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />

          {/* Crop area preview */}
          <div
            className="absolute border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move"
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-white/30" />
              <div className="border-r border-white/30" />
              <div />
              <div className="border-b border-white/30 col-span-3" />
              <div className="border-b border-white/30 col-span-3" />
            </div>

            {/* Resize handles */}
            {[
              { type: 'nw', class: 'top-[-6px] left-[-6px] cursor-nw-resize' },
              { type: 'ne', class: 'top-[-6px] right-[-6px] cursor-ne-resize' },
              { type: 'sw', class: 'bottom-[-6px] left-[-6px] cursor-sw-resize' },
              { type: 'se', class: 'bottom-[-6px] right-[-6px] cursor-se-resize' },
            ].map((handle) => (
              <div
                key={handle.type}
                className={`absolute w-3 h-3 bg-white border-2 border-primary rounded-full shadow-md z-20 ${handle.class}`}
                onMouseDown={(e) => handleMouseDown(e, handle.type as any)}
              />
            ))}
          </div>
        </div>
      </div>

      {status === 'cropping' && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] animate-pulse">Processing...</p>
        </div>
      )}
    </div>
  );
}
