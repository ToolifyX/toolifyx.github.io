"use client";

/**
 * SEO Title: Image Resizer - Resize Images Online to Any Dimension
 * Meta Description: Resize your images to specific width and height. Fast, free, and secure online image resizing tool.
 *
 * FAQ 1: Can I maintain aspect ratio?
 * Yes, the tool can calculate the height automatically based on the width you enter.
 *
 * FAQ 2: What is the maximum size?
 * It depends on your browser's canvas limit, but standard 4K images are supported.
 *
 * FAQ 3: Does it work on mobile?
 * Yes, the tool is fully responsive and works on any modern mobile browser.
 */

import React, { useState, useRef, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [newDimensions, setNewDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspect, setMaintainAspect] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImage(src);
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setDimensions({ width: img.width, height: img.height });
          setNewDimensions({ width: img.width, height: img.height });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (w: number) => {
    if (maintainAspect && dimensions.width > 0) {
      const h = Math.round((w / dimensions.width) * dimensions.height);
      setNewDimensions({ width: w, height: h });
    } else {
      setNewDimensions({ ...newDimensions, width: w });
    }
  };

  const resize = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = newDimensions.width;
      canvas.height = newDimensions.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);
      const dataUrl = canvas.toDataURL('image/png');

      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: 'image/png' }), 'resized.png');
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Width</label>
                <input
                  type="number"
                  value={newDimensions.width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Height</label>
                <input
                  type="number"
                  value={newDimensions.height}
                  onChange={(e) => setNewDimensions({ ...newDimensions, height: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded p-2"
                  disabled={maintainAspect}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} />
              Maintain Aspect Ratio
            </label>
            <button onClick={resize} className="bg-black text-white px-4 py-2 rounded w-full">Resize & Download</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
