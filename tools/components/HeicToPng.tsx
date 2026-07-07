"use client";

/**
 * SEO Title: HEIC to PNG Converter - Convert Apple Photos Online
 * Meta Description: Easily convert Apple HEIC photos to PNG format. Fast, free, and secure client-side conversion with transparency support.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadFile } from '@/lib/utils';

export default function HeicToPng() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limits, setLimits] = useState<UploadLimits | null>(null);
  const [results, setResults] = useState<{ name: string, blob: Blob, url: string }[]>([]);
  const [heic2any, setHeic2any] = useState<any>(null);

  useEffect(() => {
    setLimits(getUploadLimits());

    // Dynamically load heic2any from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      setHeic2any(() => window.heic2any);
    };
    document.body.appendChild(script);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0 || !heic2any) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const newResults = [];
      for (const file of files) {
        const resultBlob = await heic2any({
          blob: file,
          toType: 'image/png'
        });

        const blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
        newResults.push({
          name: file.name.replace(/\.heic$/i, '.png'),
          blob,
          url: URL.createObjectURL(blob)
        });
      }
      setResults(newResults);
    } catch (err) {
      console.error(err);
      alert("Conversion failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {!heic2any && (
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3 text-indigo-600">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span className="text-xs font-bold uppercase tracking-widest">Loading HEIC Engine...</span>
        </div>
      )}

      <UploadPanel
        files={files}
        onChange={setFiles}
        maxFiles={limits?.maxFiles}
        accept={{ 'image/heic': ['.heic'], 'image/heif': ['.heif'] }}
      />

      {files.length > 0 && results.length === 0 && (
        <button
          onClick={handleConvert}
          disabled={isProcessing || !heic2any}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
          Convert {files.length} HEIC Photos to PNG
        </button>
      )}

      {results.length > 0 && (
        <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Converted PNGs</h3>
            <button onClick={() => { setFiles([]); setResults([]); }} className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground">Reset</button>
          </div>

          <div className="grid gap-3">
            {results.map((res, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 group hover:bg-muted/20 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0">
                     <img src={res.url} alt={res.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black truncate">{res.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{(res.blob.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => downloadFile(res.blob, res.name)}
                  className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
