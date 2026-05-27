"use client";

/**
 * SEO Title: Image to Base64 & Base64 to Image - Online Tool
 * Meta Description: Convert images to Base64 strings or decode Base64 strings back to images.
 *
 * FAQ 1: What is Image to Base64?
 * It converts an image file into a text string that can be used directly in HTML or CSS.
 *
 * FAQ 2: How do I convert Base64 back to an image?
 * Paste the Base64 string into the textarea, and the tool will display and let you download the image.
 *
 * FAQ 3: Does it support all image types?
 * Yes, it supports any image format that your browser can display.
 */

import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '@/lib/utils';

export default function ImageBase64Tool() {
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBase64(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(base64);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!base64.startsWith('data:image')) return;
    const parts = base64.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    downloadFile(new Blob([u8arr], { type: mime }), `image.${mime.split('/')[1]}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Upload Image to get Base64</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Base64 String</label>
          <textarea
            className="w-full border rounded p-2 min-h-[120px] font-mono text-xs break-all"
            placeholder="data:image/png;base64,..."
            value={base64}
            onChange={(e) => setBase64(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="bg-black text-white px-4 py-2 rounded flex-1">
            {copied ? 'Copied!' : 'Copy Base64'}
          </button>
          <button onClick={() => setBase64('')} className="border px-4 py-2 rounded">Clear</button>
        </div>

        {base64.startsWith('data:image') && (
          <div className="space-y-4 pt-4 border-t">
            <label className="block text-sm font-medium">Image Preview</label>
            <img src={base64} alt="Preview" className="max-w-full h-auto rounded border mx-auto" />
            <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded w-full">Download Image</button>
          </div>
        )}
      </div>
    </div>
  );
}
