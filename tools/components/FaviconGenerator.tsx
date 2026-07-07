"use client";

/**
 * SEO Title: Favicon Generator - Generate All App & Web Icon Sizes
 * Meta Description: Create a complete favicon package for your website. Generate favicon.ico, Apple Touch icons, Android Chrome icons, and manifest.json in one click.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, Smartphone, Laptop, Globe } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import JSZip from 'jszip';

const ICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png', type: 'image/png' },
  { size: 32, name: 'favicon-32x32.png', type: 'image/png' },
  { size: 48, name: 'favicon-48x48.png', type: 'image/png' },
  { size: 180, name: 'apple-touch-icon.png', type: 'image/png' },
  { size: 192, name: 'android-chrome-192x192.png', type: 'image/png' },
  { size: 512, name: 'android-chrome-512x512.png', type: 'image/png' },
];

export default function FaviconGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);
  const [results, setResults] = useState<{ name: string, blob: Blob, url: string, size: number }[]>([]);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const resizeImage = (file: File, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas error');

        // Draw centered and cover
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        canvas.toBlob(b => b ? resolve(b) : reject('Blob error'), 'image/png');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const mainFile = files[0];

    try {
      const newResults = [];
      for (const spec of ICON_SIZES) {
        const blob = await resizeImage(mainFile, spec.size);
        newResults.push({
          name: spec.name,
          blob,
          url: URL.createObjectURL(blob),
          size: spec.size
        });
      }
      setResults(newResults);
    } catch (err) {
      console.error(err);
      alert("Failed to generate icons");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();

    results.forEach(res => {
      zip.file(res.name, res.blob);
    });

    // Add manifest.json
    const manifest = {
      name: "App Name",
      short_name: "App",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    };
    zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = "favicons.zip";
    a.click();
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <UploadPanel files={files} onChange={setFiles} maxFiles={1} />

      {files.length > 0 && results.length === 0 && (
        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
          Generate All Favicon Sizes
        </button>
      )}

      {results.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {results.map((res, i) => (
              <div key={i} className="card border rounded-xl p-4 bg-card flex flex-col items-center justify-center space-y-3 shadow-sm border-primary/10">
                <div className="w-12 h-12 flex items-center justify-center border rounded bg-white overflow-hidden">
                   <img src={res.url} alt={res.name} style={{ width: res.size > 48 ? 48 : res.size }} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-tighter truncate w-full px-2">{res.name}</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">{res.size}x{res.size}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
             <button
                onClick={handleDownloadZip}
                className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
             >
                <Download className="w-4 h-4" /> Download Favicon.ZIP
             </button>
             <button
                onClick={() => { setFiles([]); setResults([]); }}
                className="px-6 py-4 rounded-xl border border-border font-bold text-sm hover:bg-muted/50"
             >
                Reset
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
