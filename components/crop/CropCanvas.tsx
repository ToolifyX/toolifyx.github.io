"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

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
      const currentAspectRatio = (newCrop.width * imgSize.width) / (newCrop.height * imgSize.height);
      if (Math.abs(currentAspectRatio - aspectRatio) > 0.01) {
          // Adjust height based on width and aspectRatio
          constrained.height = (newCrop.width * imgSize.width) / (aspectRatio * imgSize.height);
      }
    }

    constrained = {
      x: Math.max(0, Math.min(constrained.x, 100 - constrained.width)),
      y: Math.max(0, Math.min(constrained.y, 100 - constrained.height)),
      width: Math.max(5, Math.min(constrained.width, 100 - constrained.x)),
      height: Math.max(5, Math.min(constrained.height, 100 - constrained.y)),
    };

    setCrop(constrained);
    onCropChange(constrained);
  }, [onCropChange, aspectRatio, imgSize]);

  useEffect(() => {
    // Reset crop when aspect ratio changes
    if (aspectRatio && imgSize.width > 0) {
        const initialWidth = 80;
        const initialHeight = (initialWidth * imgSize.width) / (aspectRatio * imgSize.height);

        const finalHeight = initialHeight > 80 ? 80 : initialHeight;
        const finalWidth = initialHeight > 80 ? (80 * aspectRatio * imgSize.height) / imgSize.width : 80;

        const newCrop = {
            x: (100 - finalWidth) / 2,
            y: (100 - finalHeight) / 2,
            width: finalWidth,
            height: finalHeight
        };
        setCrop(newCrop);
        onCropChange(newCrop);
    }
  }, [aspectRatio, imgSize, onCropChange]);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    isDragging.current = true;
    dragType.current = type;
    startPos.current = { x: e.clientX, y: e.clientY };
    startCrop.current = { ...crop };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const dx = ((e.clientX - startPos.current.x) / containerRef.current.offsetWidth) * 100;
    const dy = ((e.clientY - startPos.current.y) / containerRef.current.offsetHeight) * 100;

    let newCrop = { ...startCrop.current };

    if (dragType.current === 'move') {
      newCrop.x += dx;
      newCrop.y += dy;
    } else if (dragType.current === 'se') {
      newCrop.width += dx;
      newCrop.height += dy;
    }
    // Add other handles if needed

    updateCrop(newCrop);
  }, [updateCrop]);

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

  if (!imageUrl) {
    return (
      <div className="w-full h-[400px] bg-muted/30 border border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-4">
        <p className="text-sm font-medium">Upload an image to start cropping</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5 rounded-2xl p-4">
      <div
        ref={containerRef}
        className="relative max-w-full max-h-full shadow-2xl"
        style={{ aspectRatio: imgSize.width ? `${imgSize.width}/${imgSize.height}` : 'auto' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="To crop"
          className="max-w-full max-h-[600px] select-none pointer-events-none"
          onLoad={(e) => {
            const img = e.currentTarget;
            setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
          }}
        />

        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        {/* Crop area preview */}
        <div
          className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
          style={{
            left: `${crop.x}%`,
            top: `${crop.y}%`,
            width: `${crop.width}%`,
            height: `${crop.height}%`,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
            cursor: 'move',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
            <div className="border-r border-white/50" />
            <div className="border-r border-white/50" />
            <div />
            <div className="border-b border-white/50 col-span-3" />
            <div className="border-b border-white/50 col-span-3" />
          </div>

          {/* Resize handle SE */}
          <div
            className="absolute bottom-[-4px] right-[-4px] w-4 h-4 bg-white border border-primary rounded-full cursor-se-resize shadow-lg"
            onMouseDown={(e) => handleMouseDown(e, 'se')}
          />
        </div>
      </div>

      {status === 'cropping' && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest">Applying Crop...</p>
        </div>
      )}
    </div>
  );
}
