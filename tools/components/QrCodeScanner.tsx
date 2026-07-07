"use client";

/**
 * SEO Title: Online QR Code Scanner - Read QR Codes from Images
 * Meta Description: Scan and decode QR codes instantly from images or your clipboard. Fast, secure, and client-side QR code reader with history support.
 */

import React, { useState, useEffect } from 'react';
import { Scan, Copy, Trash2, Image as ImageIcon, History, Link as LinkIcon, ExternalLink } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { copyToClipboard } from '@/lib/utils';

export default function QrCodeScanner() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [jsQR, setJsQR] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load jsQR from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      setJsQR(() => window.jsQR);
    };
    document.body.appendChild(script);

    // Load history from local storage
    const storedHistory = JSON.parse(localStorage.getItem('qr_scan_history') || '[]');
    setHistory(storedHistory);
  }, []);

  const handleScan = async (file: File) => {
    if (!jsQR) return;
    setIsScanning(true);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setResult(code.data);
          const newHistory = [code.data, ...history.filter(h => h !== code.data)].slice(0, 20);
          setHistory(newHistory);
          localStorage.setItem('qr_scan_history', JSON.stringify(newHistory));
        } else {
          alert("Could not find a valid QR code in this image.");
        }
        setIsScanning(false);
      };
      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      handleScan(files[0]);
    }
  }, [files]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
           <UploadPanel
             files={files}
             onChange={setFiles}
             maxFiles={1}
             accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
           />

           {result && (
             <div className="card border rounded-2xl p-8 bg-card shadow-sm space-y-6 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Scan className="w-4 h-4" /> Scan Result
                   </h3>
                   <button onClick={() => setResult(null)} className="text-muted-foreground hover:text-foreground">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>

                <div className="p-6 bg-muted/20 rounded-xl border border-primary/10 font-medium break-all text-lg leading-relaxed">
                   {result}
                </div>

                <div className="flex gap-3">
                   <button
                      onClick={() => copyToClipboard(result)}
                      className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"
                   >
                      <Copy className="w-4 h-4" /> Copy Text
                   </button>
                   {result.startsWith('http') && (
                     <a
                        href={result}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-foreground text-background px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"
                     >
                        <ExternalLink className="w-4 h-4" /> Open URL
                     </a>
                   )}
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <History className="w-3.5 h-3.5" /> Recent Scans
                 </div>
                 {history.length > 0 && (
                   <button
                     onClick={() => { setHistory([]); localStorage.removeItem('qr_scan_history'); }}
                     className="text-[9px] font-black uppercase text-muted-foreground hover:text-destructive transition-colors"
                   >
                      Clear
                   </button>
                 )}
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                 {history.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic text-xs space-y-2 opacity-50">
                      <ImageIcon className="w-8 h-8" />
                      <p>Your scan history will appear here</p>
                   </div>
                 ) : (
                   history.map((h, i) => (
                     <div key={i} className="p-3 border rounded-lg bg-muted/5 group hover:border-primary/30 transition-all flex items-start gap-3">
                        <div className="mt-1">
                           {h.startsWith('http') ? <LinkIcon className="w-3.5 h-3.5 text-blue-500" /> : <ImageIcon className="w-3.5 h-3.5 text-orange-500" />}
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-xs font-bold truncate">{h}</p>
                        </div>
                        <button onClick={() => setResult(h)} className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase text-primary">View</button>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
