"use client";

/**
 * SEO Title: QR Code Generator - Create Custom QR Codes Online
 * Meta Description: Generate QR codes for links, text, or phone numbers. Download as PNG instantly.
 *
 * FAQ 1: How do I create a QR code?
 * Enter your URL or text in the input box, and the QR code will update automatically.
 *
 * FAQ 2: Can I download the QR code?
 * Yes, you can download the generated QR code as a high-quality PNG image.
 *
 * FAQ 3: Are these QR codes permanent?
 * Yes, the QR code contains the static data you entered and will work as long as that data is valid.
 */

import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import QRCode from 'qrcode';
import { downloadFile } from '@/lib/utils';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://toolifyx.github.io');
  const [url, setUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, { width: 512, margin: 2 }, (err: any, dataUrl: string) => {
        if (!err) setUrl(dataUrl);
      });
    } else {
      setUrl('');
    }
  }, [text]);

  const handleDownload = () => {
    if (!url) return;
    const byteString = atob(url.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    downloadFile(new Blob([ab], { type: 'image/png' }), 'qrcode.png');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text or URL</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        {url && (
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-xl shadow-lg border">
              <img src={url} alt="QR Code" className="w-48 h-48" />
            </div>
            <button onClick={handleDownload} className="bg-black text-white px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
              Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
