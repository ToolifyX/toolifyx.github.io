"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CropArea } from './cropUtils';

interface CropEditorProps {
  image: string;
  crop: CropArea;
  setCrop: (crop: Partial<CropArea>) => void;
  aspect: number | null;
  zoom: number;
  flip: { horizontal: boolean; vertical: boolean };
  onImageLoad: (img: HTMLImageElement) => void;
}

export default function CropEditor({ image, crop, setCrop, aspect, zoom, flip, onImageLoad }: CropEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onImageLoad(e.currentTarget);
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragType(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !imgRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const imgWidth = imgRef.current.width;
    const imgHeight = imgRef.current.height;

    let newCrop = { ...crop };

    if (dragType === 'move') {
      newCrop.x = Math.max(0, Math.min(imgWidth - crop.width, crop.x + dx));
      newCrop.y = Math.max(0, Math.min(imgHeight - crop.height, crop.y + dy));
    } else {
      // Basic resize logic (can be improved with aspect ratio)
      if (dragType?.includes('w')) {
        const deltaX = Math.min(dx, crop.width - 20);
        newCrop.x = Math.max(0, crop.x + deltaX);
        newCrop.width = crop.width - (newCrop.x - crop.x);
      }
      if (dragType?.includes('e')) {
        newCrop.width = Math.max(20, Math.min(imgWidth - crop.x, crop.width + dx));
      }
      if (dragType?.includes('n')) {
        const deltaY = Math.min(dy, crop.height - 20);
        newCrop.y = Math.max(0, crop.y + deltaY);
        newCrop.height = crop.height - (newCrop.y - crop.y);
      }
      if (dragType?.includes('s')) {
        newCrop.height = Math.max(20, Math.min(imgHeight - crop.y, crop.height + dy));
      }

      if (aspect) {
         // Maintain aspect ratio if needed
         if (newCrop.width / newCrop.height !== aspect) {
            if (dragType === 'se' || dragType === 'sw' || dragType === 'ne' || dragType === 'nw') {
                newCrop.height = newCrop.width / aspect;
            }
         }
      }
    }

    setCrop(newCrop);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, dragType, crop, setCrop, aspect]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-black/90 overflow-hidden select-none">
      <div
        className="relative inline-block transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${zoom})`,
        }}
      >
        <div style={{
          transform: `scale(${flip.horizontal ? -1 : 1}, ${flip.vertical ? -1 : 1})`,
        }}>
          <img
            ref={imgRef}
            src={image}
            alt="To crop"
            className="max-w-full max-h-[70vh] block"
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/50" style={{
            clipPath: `polygon(
              0% 0%, 0% 100%,
              ${crop.x}px 100%,
              ${crop.x}px ${crop.y}px,
              ${crop.x + crop.width}px ${crop.y}px,
              ${crop.x + crop.width}px ${crop.y + crop.height}px,
              ${crop.x}px ${crop.y + crop.height}px,
              ${crop.x}px 100%,
              100% 100%, 100% 0%
            )`
          }} />
        </div>

        {/* Crop Box */}
        <div
          className="absolute border-2 border-white cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
          style={{
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
            boxShadow: 'none' // We use clipPath for overlay instead
          }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            <div className="border-r border-white/30 border-b" />
            <div className="border-r border-white/30 border-b" />
            <div className="border-b border-white/30" />
            <div className="border-r border-white/30 border-b" />
            <div className="border-r border-white/30 border-b" />
            <div className="border-b border-white/30" />
            <div className="border-r border-white/30" />
            <div className="border-r border-white/30" />
            <div />
          </div>

          {/* Handles */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-black/20 cursor-nw-resize" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-black/20 cursor-ne-resize" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-black/20 cursor-sw-resize" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black/20 cursor-se-resize" onMouseDown={(e) => handleMouseDown(e, 'se')} />
        </div>
      </div>
    </div>
  );
}
