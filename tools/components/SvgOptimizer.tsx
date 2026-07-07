"use client";

/**
 * SEO Title: SVG Optimizer Online - Minify & Clean Vector Files
 * Meta Description: Optimize your SVG files by removing unnecessary metadata, comments, and whitespace. Reduce file size without losing quality.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, ShieldCheck } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile, formatBytes } from '@/lib/utils';

export default function SvgOptimizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string, originalSize: number, optimizedSize: number, content: string }[]>([]);

  const optimizeSvg = async (file: File) => {
    const text = await file.text();

    // Basic but effective client-side SVG optimization
    let optimized = text
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/<\?xml.*?\?>/g, '')     // Remove XML declaration
      .replace(/<!DOCTYPE.*?>/g, '')    // Remove doctype
      .replace(/xmlns:serif=".*?"/g, '') // Remove software-specific namespaces
      .replace(/serif:id=".*?"/g, '')
      .replace(/\s+/g, ' ')             // Collapse whitespace
      .replace(/>\s+</g, '><')          // Remove space between tags
      .trim();

    return {
      name: file.name.replace(/\.svg$/i, '.min.svg'),
      originalSize: file.size,
      optimizedSize: new Blob([optimized]).size,
      content: optimized
    };
  };

  const handleOptimize = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const newResults = [];
      for (const file of files) {
        const res = await optimizeSvg(file);
        newResults.push(res);
      }
      setResults(newResults);
    } catch (err) {
      console.error(err);
      alert("Failed to optimize SVGs");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = (res: any) => {
    const blob = new Blob([res.content], { type: 'image/svg+xml' });
    downloadFile(blob, res.name);
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <UploadPanel files={files} onChange={setFiles} accept={{ 'image/svg+xml': ['.svg'] }} />

      {files.length > 0 && results.length === 0 && (
        <button
          onClick={handleOptimize}
          disabled={isProcessing}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
          Optimize {files.length} SVG Files
        </button>
      )}

      {results.length > 0 && (
        <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Optimized Results</h3>
            <button onClick={() => { setFiles([]); setResults([]); }} className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground">Reset</button>
          </div>

          <div className="grid gap-3">
            {results.map((res, i) => {
              const saved = ((res.originalSize - res.optimizedSize) / res.originalSize * 100).toFixed(1);
              return (
                <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 group hover:bg-muted/20 transition-all">
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-black truncate">{res.name}</p>
                      <span className="text-[9px] font-black bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded uppercase">-{saved}%</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Original: {formatBytes(res.originalSize)}</span>
                      <span className="text-[10px] text-primary font-bold uppercase">Optimized: {formatBytes(res.optimizedSize)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadResult(res)}
                    className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
