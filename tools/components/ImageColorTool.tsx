"use client";

/**
 * SEO Title: Color Extractor & Grayscale Converter - Image Color Tools
 * Meta Description: Extract dominant colors from an image or convert any photo to black and white (grayscale).
 *
 * FAQ 1: How does color extraction work?
 * It samples pixels from the image to find the most frequent colors.
 *
 * FAQ 2: Is the grayscale conversion lossless?
 * It creates a new image where the color saturation is removed, resulting in a black and white version.
 *
 * FAQ 3: Can I copy the color hex codes?
 * Yes, once colors are extracted, you can click them to copy their hex values.
 */

import React, { useState, useRef } from 'react';
import { downloadFile, copyToClipboard } from '@/lib/utils';

export default function ImageColorTool() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImage(src);
        extractColors(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = (src: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      ctx?.drawImage(img, 0, 0, 100, 100);
      const data = ctx?.getImageData(0, 0, 100, 100).data;
      if (!data) return;

      const colorMap: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 40) { // Step to speed up
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
      const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);
      setColors(sorted);
    };
  };

  const makeGrayscale = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: 'image/png' }), 'grayscale.png');
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Extracted Colors</label>
              <div className="flex gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={async () => {
                      await copyToClipboard(color);
                      setCopied(color);
                      setTimeout(() => setCopied(null), 1000);
                    }}
                    className="w-10 h-10 rounded border shadow-sm relative group"
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {copied === color && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded">Copied</span>}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={makeGrayscale} className="bg-black text-white px-4 py-2 rounded w-full">Convert to Grayscale & Download</button>

            <img src={image} alt="Preview" className="max-w-full h-auto rounded border mx-auto" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
