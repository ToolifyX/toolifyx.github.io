"use client";

/**
 * SEO Title: Image Editor - Rotate, Flip, and Crop Online
 * Meta Description: Simple online image editor. Rotate your images, flip them horizontally/vertically, and basic editing.
 *
 * FAQ 1: Can I flip images?
 * Yes, you can flip images horizontally or vertically with one click.
 *
 * FAQ 2: How do I rotate an image?
 * Click the rotate buttons to turn the image 90 degrees clockwise or counter-clockwise.
 *
 * FAQ 3: Does it support transparency?
 * Yes, PNG transparency is preserved during editing.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';

export default function ImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const applyAndDownload = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const isRotated = (rotation / 90) % 2 !== 0;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/png');
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: 'image/png' }), 'edited.png');
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRotation(r => r + 90)} className="border px-4 py-2 rounded">Rotate 90°</button>
              <button onClick={() => setRotation(r => r - 90)} className="border px-4 py-2 rounded">Rotate -90°</button>
              <button onClick={() => setFlipH(!flipH)} className={`border px-4 py-2 rounded ${flipH ? 'bg-black text-white' : ''}`}>Flip Horizontal</button>
              <button onClick={() => setFlipV(!flipV)} className={`border px-4 py-2 rounded ${flipV ? 'bg-black text-white' : ''}`}>Flip Vertical</button>
            </div>

            <div className="border rounded overflow-hidden flex justify-center bg-gray-100 p-4">
              <img
                src={image}
                alt="Preview"
                style={{
                  transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                  transition: 'transform 0.3s'
                }}
                className="max-w-full h-auto shadow-lg"
              />
            </div>

            <button onClick={applyAndDownload} className="bg-black text-white px-4 py-2 rounded w-full">Apply & Download PNG</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
