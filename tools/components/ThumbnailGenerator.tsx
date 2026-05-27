"use client";

/**
 * SEO Title: Thumbnail Generator - Create Custom Thumbnails Online
 * Meta Description: Quickly generate thumbnails from your images. Select from standard sizes or use custom dimensions.
 *
 * FAQ 1: What sizes are available?
 * You can choose from common sizes like 150x150, 300x300, or enter your own.
 *
 * FAQ 2: Does it crop the image?
 * Yes, it uses "object-fit: cover" logic to ensure the thumbnail is filled and looks professional.
 *
 * FAQ 3: What format is the output?
 * Thumbnails are exported as PNG files to preserve quality.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';

export default function ThumbnailGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [size, setSize] = useState(150);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;

      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/png');
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: 'image/png' }), `thumb_${size}x${size}.png`);
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Size: {size}px</label>
              <input type="range" min="50" max="500" step="10" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="flex-1" />
            </div>
            <div className="flex justify-center">
              <div
                className="border rounded bg-gray-50 overflow-hidden flex items-center justify-center shadow-inner"
                style={{ width: size, height: size }}
              >
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
            <button onClick={generate} className="bg-black text-white px-4 py-2 rounded w-full">Generate & Download</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
