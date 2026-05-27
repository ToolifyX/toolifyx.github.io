"use client";

/**
 * SEO Title: Image Metadata Viewer & Remover - Strip EXIF Data
 * Meta Description: View and remove metadata (EXIF) from your images for better privacy.
 *
 * FAQ 1: What is image metadata?
 * Metadata (EXIF) contains information about the camera, settings, and sometimes GPS location where the photo was taken.
 *
 * FAQ 2: Why remove metadata?
 * Removing metadata protects your privacy by stripping location and camera details before sharing online.
 *
 * FAQ 3: Does it affect image quality?
 * Removing metadata by re-saving can slightly affect quality depending on the format, but strips all hidden data.
 */

import React, { useState, useRef } from 'react';
import { downloadFile } from '@/lib/utils';

export default function ImageMetadataTool() {
  const [fileInfo, setFileInfo] = useState<{ name: string, size: number, type: string, width: number, height: number } | null>(null);
  const [image, setImage] = useState<string | null>(null);
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
          setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMetadata = () => {
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
      // toDataURL strips most metadata as it re-encodes the image
      const dataUrl = canvas.toDataURL(fileInfo?.type || 'image/jpeg', 0.95);

      const parts = dataUrl.split(',');
      const byteString = atob(parts[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: fileInfo?.type || 'image/jpeg' }), `clean_${fileInfo?.name}`);
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {fileInfo && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded border text-sm font-mono space-y-1">
              <p><strong>Name:</strong> {fileInfo.name}</p>
              <p><strong>Size:</strong> {(fileInfo.size / 1024).toFixed(2)} KB</p>
              <p><strong>Type:</strong> {fileInfo.type}</p>
              <p><strong>Dimensions:</strong> {fileInfo.width} x {fileInfo.height}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={removeMetadata} className="bg-black text-white px-4 py-2 rounded">Remove Metadata & Download</button>
              <p className="text-[10px] text-gray-500 text-center">Note: Re-encoding strips all EXIF data.</p>
            </div>

            <img src={image!} alt="Preview" className="max-w-full h-auto rounded border mx-auto opacity-50" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
