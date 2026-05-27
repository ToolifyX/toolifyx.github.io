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
    e.stopPropagation(); // Stop bubbling so parent "move" doesn't catch it
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragType(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !imgRef.current) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    const imgWidth = imgRef.current.width;
    const imgHeight = imgRef.current.height;

    let { x, y, width, height } = crop;
    const minSize = 20;

    if (dragType === 'move') {
      x = Math.max(0, Math.min(imgWidth - width, x + dx));
      y = Math.max(0, Math.min(imgHeight - height, y + dy));
    } else {
      if (dragType === 'nw') {
        const potentialWidth = Math.max(minSize, width - dx);
        const potentialHeight = aspect ? potentialWidth / aspect : Math.max(minSize, height - dy);

        const newX = x + (width - potentialWidth);
        const newY = y + (height - potentialHeight);

        if (newX >= 0 && newY >= 0) {
          x = newX;
          y = newY;
          width = potentialWidth;
          height = potentialHeight;
        }
      } else if (dragType === 'ne') {
        const potentialWidth = Math.max(minSize, Math.min(imgWidth - x, width + dx));
        const potentialHeight = aspect ? potentialWidth / aspect : Math.max(minSize, height - dy);

        const newY = y + (height - potentialHeight);
        if (newY >= 0) {
          y = newY;
          width = potentialWidth;
          height = potentialHeight;
        }
      } else if (dragType === 'sw') {
        const potentialWidth = Math.max(minSize, width - dx);
        const potentialHeight = aspect ? potentialWidth / aspect : Math.max(minSize, Math.min(imgHeight - y, height + dy));

        const newX = x + (width - potentialWidth);
        if (newX >= 0 && (y + potentialHeight <= imgHeight)) {
          x = newX;
          width = potentialWidth;
          height = potentialHeight;
        }
      } else if (dragType === 'se') {
        width = Math.max(minSize, Math.min(imgWidth - x, width + dx));
        height = aspect ? width / aspect : Math.max(minSize, Math.min(imgHeight - y, height + dy));

        if (y + height > imgHeight) {
          height = imgHeight - y;
          if (aspect) width = height * aspect;
        }
      }
    }

    setCrop({ x, y, width, height });
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, dragType, crop, setCrop, aspect, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = dragType === 'move' ? 'move' : `${dragType}-resize`;
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, dragType]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-black/90 overflow-hidden select-none p-8">
      <div
        className="relative inline-block"
        style={{
          transform: `scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <div style={{
          transform: `scale(${flip.horizontal ? -1 : 1}, ${flip.vertical ? -1 : 1})`,
        }}>
          <img
            ref={imgRef}
            src={image}
            alt="To crop"
            className="max-w-full max-h-[70vh] block shadow-2xl"
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/60" style={{
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
          className="absolute border-2 border-white cursor-move z-10"
          style={{
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
            <div className="border-r border-white border-b" />
            <div className="border-r border-white border-b" />
            <div className="border-b border-white" />
            <div className="border-r border-white border-b" />
            <div className="border-r border-white border-b" />
            <div className="border-b border-white" />
            <div className="border-r border-white" />
            <div className="border-r border-white" />
            <div />
          </div>

          {/* Handles with larger hit area */}
          <div className="absolute -top-3 -left-3 w-6 h-6 flex items-center justify-center cursor-nw-resize z-20 group" onMouseDown={(e) => handleMouseDown(e, 'nw')}>
            <div className="w-3 h-3 bg-white border border-black/20 rounded-sm shadow-sm group-hover:scale-125 transition-transform" />
          </div>
          <div className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center cursor-ne-resize z-20 group" onMouseDown={(e) => handleMouseDown(e, 'ne')}>
            <div className="w-3 h-3 bg-white border border-black/20 rounded-sm shadow-sm group-hover:scale-125 transition-transform" />
          </div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 flex items-center justify-center cursor-sw-resize z-20 group" onMouseDown={(e) => handleMouseDown(e, 'sw')}>
            <div className="w-3 h-3 bg-white border border-black/20 rounded-sm shadow-sm group-hover:scale-125 transition-transform" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 flex items-center justify-center cursor-se-resize z-20 group" onMouseDown={(e) => handleMouseDown(e, 'se')}>
            <div className="w-3 h-3 bg-white border border-black/20 rounded-sm shadow-sm group-hover:scale-125 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
