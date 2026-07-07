"use client";

/**
 * SEO Title: Bulk UUID Generator - Generate Thousands of Unique IDs
 * Meta Description: High-performance bulk UUID generator. Generate up to 100,000 UUIDs instantly. Export to TXT, CSV, or JSON formats.
 */

import React, { useState } from 'react';
import { copyToClipboard, downloadFile, formatBytes } from '@/lib/utils';
import { Layers, Download, Copy, RefreshCw, Hash, FileJson, FileText, Table } from 'lucide-react';

type OutputFormat = 'txt' | 'csv' | 'json';

export default function UuidBulkGenerator() {
  const [count, setCount] = useState(1000);
  const [isGenerating, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [format, setFormat] = useState<OutputFormat>('txt');
  const [time, setTime] = useState<number | null>(null);

  const generateBulk = () => {
    setIsProcessing(true);
    const start = performance.now();

    // Using a timeout to prevent UI blocking for very large numbers
    setTimeout(() => {
      const newUuids = [];
      const batchSize = 1000;
      for (let i = 0; i < count; i++) {
        newUuids.push(crypto.randomUUID());
      }
      setResults(newUuids);
      setTime(parseFloat((performance.now() - start).toFixed(2)));
      setIsProcessing(false);
    }, 10);
  };

  const handleDownload = () => {
    if (results.length === 0) return;
    let content = '';
    let mime = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(results, null, 2);
      mime = 'application/json';
    } else if (format === 'csv') {
      content = 'id\n' + results.join('\n');
      mime = 'text/csv';
    } else {
      content = results.join('\n');
    }

    const blob = new Blob([content], { type: mime });
    downloadFile(blob, `bulk-uuids.${format}`);
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-8 bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Batch Size</label>
                <div className="grid grid-cols-3 gap-2">
                   {[100, 1000, 5000, 10000, 50000, 100000].map(n => (
                     <button
                        key={n}
                        onClick={() => setCount(n)}
                        className={`py-3 rounded-xl text-xs font-black transition-all ${count === n ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}
                     >
                       {n.toLocaleString()}
                     </button>
                   ))}
                </div>
                <div className="px-1">
                   <input
                      type="range"
                      min="1"
                      max="100000"
                      step="100"
                      className="w-full accent-primary mt-2"
                      value={count}
                      onChange={e => setCount(parseInt(e.target.value))}
                   />
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                   <button onClick={() => setFormat('txt')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${format === 'txt' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                      <FileText className="w-3.5 h-3.5" /> TXT
                   </button>
                   <button onClick={() => setFormat('csv')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${format === 'csv' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                      <Table className="w-3.5 h-3.5" /> CSV
                   </button>
                   <button onClick={() => setFormat('json')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${format === 'json' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                      <FileJson className="w-3.5 h-3.5" /> JSON
                   </button>
                </div>
             </div>
          </div>

          <div className="flex flex-col justify-center space-y-4">
             <div className="p-8 bg-primary/[0.03] border border-primary/10 rounded-2xl flex flex-col items-center text-center space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Estimated Size</div>
                <div className="text-4xl font-black text-primary tracking-tighter">
                   {formatBytes(count * 37)}
                </div>
                <div className="text-xs font-bold text-muted-foreground">Approx. memory usage</div>
             </div>

             <button
                onClick={generateBulk}
                disabled={isGenerating}
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-base uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
             >
                {isGenerating ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                Generate Batch
             </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pt-6 border-t">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Generated</span>
                      <span className="text-xl font-black text-primary">{results.length.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col border-l border-border pl-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</span>
                      <span className="text-xl font-black text-primary">{time}ms</span>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button
                      onClick={() => {
                         const str = format === 'json' ? JSON.stringify(results) : results.join('\n');
                         copyToClipboard(str);
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-muted/50 transition-all"
                   >
                      <Copy className="w-4 h-4" /> Copy All
                   </button>
                   <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all"
                   >
                      <Download className="w-4 h-4" /> Download .{format.toUpperCase()}
                   </button>
                </div>
             </div>

             <div className="p-4 bg-muted/20 rounded-xl border border-border/50 text-[10px] font-mono text-muted-foreground italic">
                Showing first 5 results:
                <div className="mt-2 space-y-1">
                   {results.slice(0, 5).map((id, i) => (
                      <div key={i}>{id}</div>
                   ))}
                   <div>...</div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4"/><path d="m16.2 4.2 2.8 2.8"/><path d="M18 12h4"/><path d="m16.2 19.8 2.8-2.8"/><path d="M12 18v4"/><path d="m4.8 19.8 2.8-2.8"/><path d="M2 12h4"/><path d="m4.8 4.2 2.8 2.8"/>
    </svg>
  );
}
