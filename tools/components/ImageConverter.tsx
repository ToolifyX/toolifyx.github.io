"use client";

/**
 * SEO Title: Image Format Converter - JPG, PNG, WebP Online
 * Meta Description: Convert images between different formats like PNG to JPG, JPG to PNG, and more.
 *
 * FAQ 1: Can I convert PNG to JPG?
 * Yes, you can easily convert any image format to JPG or PNG.
 *
 * FAQ 2: Will I lose quality?
 * Converting to JPG might lose some quality due to compression, while PNG is lossless.
 *
 * FAQ 3: Are multiple images supported?
 * Currently, you can convert one image at a time for maximum precision.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';

export default function ImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('image/jpeg');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const convert = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (targetFormat === 'image/jpeg') {
        ctx!.fillStyle = '#FFFFFF';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(targetFormat, 0.9);

      const ext = targetFormat.split('/')[1];
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: targetFormat }), `converted.${ext}`);
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-4">
            <select
              className="w-full border rounded p-2"
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
            >
              <option value="image/jpeg">Convert to JPG</option>
              <option value="image/png">Convert to PNG</option>
              <option value="image/webp">Convert to WebP</option>
            </select>
            <button onClick={convert} className="bg-black text-white px-4 py-2 rounded w-full">Convert & Download</button>
            <img src={image} alt="Preview" className="max-w-full h-auto rounded border mx-auto opacity-50" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
