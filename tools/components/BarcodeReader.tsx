"use client";

/**
 * SEO Title: Online Barcode Reader - Scan Barcodes from Images
 * Meta Description: Scan and decode barcodes instantly from images. Supports EAN, UPC, Code39, Code128 and more. Fast, secure, and client-side barcode scanning.
 */

import React, { useState, useEffect } from 'react';
import { ScanLine, Copy, Trash2, Image as ImageIcon, History, Barcode } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { copyToClipboard } from '@/lib/utils';

export default function BarcodeReader() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [zxing, setZxing] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load ZXing from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      setZxing(() => window.ZXing);
    };
    document.body.appendChild(script);

    const storedHistory = JSON.parse(localStorage.getItem('barcode_scan_history') || '[]');
    setHistory(storedHistory);
  }, []);

  const handleScan = async (file: File) => {
    if (!zxing) return;
    setIsScanning(true);

    try {
      const codeReader = new zxing.BrowserMultiFormatReader();
      const img = new Image();
      img.onload = async () => {
        try {
          const decodeResult = await codeReader.decodeFromImageElement(img);
          const val = decodeResult.getText();
          setResult(val);
          const newHistory = [val, ...history.filter(h => h !== val)].slice(0, 20);
          setHistory(newHistory);
          localStorage.setItem('barcode_scan_history', JSON.stringify(newHistory));
        } catch (err) {
          alert("Could not find a valid barcode in this image.");
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
           />

           {result && (
             <div className="card border rounded-2xl p-8 bg-card shadow-sm space-y-6 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <ScanLine className="w-4 h-4" /> Barcode Result
                   </h3>
                   <button onClick={() => setResult(null)} className="text-muted-foreground hover:text-foreground">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-xl border border-primary/10 space-y-4">
                   <Barcode className="w-12 h-12 text-primary/40" />
                   <div className="font-black break-all text-4xl tracking-tighter text-center">
                      {result}
                   </div>
                </div>

                <button
                   onClick={() => copyToClipboard(result)}
                   className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                >
                   <Copy className="w-4 h-4" /> Copy Barcode Value
                </button>
             </div>
           )}
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <History className="w-3.5 h-3.5" /> Recent Barcodes
                 </div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                 {history.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic text-xs space-y-2 opacity-50">
                      <Barcode className="w-8 h-8" />
                      <p>Scan history will appear here</p>
                   </div>
                 ) : (
                   history.map((h, i) => (
                     <div key={i} className="p-3 border rounded-lg bg-muted/5 group hover:border-primary/30 transition-all flex items-center gap-3">
                        <Barcode className="w-3.5 h-3.5 text-zinc-500" />
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
