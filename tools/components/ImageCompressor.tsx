"use client";

/**
 * SEO Title: Image Compressor - Compress Images Online for Free
 * Meta Description: Reduce image file size without losing quality. Support JPG, PNG, and WebP compression.
 *
 * FAQ 1: How does image compression work?
 * It reduces file size by optimizing pixel data and adjusting quality levels.
 *
 * FAQ 2: Is it safe to upload my images?
 * Your images never leave your browser. All processing is done locally.
 *
 * FAQ 3: Which formats are supported?
 * We support JPG, PNG, and WebP formats.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';

export default function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [stats, setStats] = useState({ original: 0, compressed: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStats({ ...stats, original: file.size });
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const compressImage = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      setCompressed(dataUrl);

      // Calculate compressed size
      const base64str = dataUrl.split(',')[1];
      const decoded = atob(base64str);
      setStats(prev => ({ ...prev, compressed: decoded.length }));
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-nowrap">Quality: {Math.round(quality * 100)}%</label>
              <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="flex-1" />
            </div>
            <button onClick={compressImage} className="bg-black text-white px-4 py-2 rounded w-full">Compress Image</button>
          </div>
        )}

        {compressed && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="p-2 bg-gray-50 rounded">Original: {(stats.original / 1024).toFixed(2)} KB</div>
              <div className="p-2 bg-green-50 rounded font-bold">Compressed: {(stats.compressed / 1024).toFixed(2)} KB</div>
            </div>
            <img src={compressed} alt="Compressed" className="max-w-full h-auto rounded border mx-auto" />
            <button onClick={() => {
              const byteString = atob(compressed.split(',')[1]);
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
              downloadFile(new Blob([ab], { type: 'image/jpeg' }), 'compressed.jpg');
            }} className="bg-green-600 text-white px-4 py-2 rounded w-full">Download JPG</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
