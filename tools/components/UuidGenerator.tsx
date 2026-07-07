"use client";

/**
 * SEO Title: UUID Generator - Generate Version 1, 4, and 7 UUIDs Online
 * Meta Description: Professional UUID generator supporting Version 1, 4, and 7. Generate multiple unique identifiers instantly for your development projects.
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { Fingerprint, Copy, Download, RefreshCw, Hash } from 'lucide-react';

type UuidVersion = 'v1' | 'v4' | 'v7';

export default function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [options, setOptions] = useState({
    uppercase: false,
    removeHyphens: false,
  });
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  // V4 is native
  const generateV4 = () => crypto.randomUUID();

  // Simple V1 Implementation (Timestamp + Random)
  const generateV1 = () => {
    const now = Date.now();
    const hex = now.toString(16).padStart(12, '0');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-1000-8000-${Math.random().toString(16).slice(2, 14).padStart(12, '0')}`;
  };

  // Simple V7 Implementation (Timestamp + Random bits)
  const generateV7 = () => {
    const timestamp = Date.now();
    const hex = timestamp.toString(16).padStart(12, '0');
    const random = Array.from(crypto.getRandomValues(new Uint8Array(10)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7${random.slice(0, 3)}-${(8 + (Math.random() * 4 | 0)).toString(16)}${random.slice(3, 6)}-${random.slice(6, 18)}`;
  };

  const generate = () => {
    const start = performance.now();
    const newUuids = Array.from({ length: Math.min(count, 1000) }, () => {
      let id = '';
      if (version === 'v1') id = generateV1();
      else if (version === 'v7') id = generateV7();
      else id = generateV4();

      if (options.uppercase) id = id.toUpperCase();
      if (options.removeHyphens) id = id.replace(/-/g, '');
      return id;
    });
    setUuids(newUuids);
    setTime(parseFloat((performance.now() - start).toFixed(2)));
  };

  useEffect(() => {
    generate();
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(uuids.join('\n'));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    downloadFile(blob, `uuids-${version}.txt`);
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-8 bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">UUID Version</label>
                <div className="flex gap-2">
                  {(['v1', 'v4', 'v7'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setVersion(v)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${version === v ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}
                    >
                      {v.toUpperCase()}
                    </button>
                  ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Amount to Generate</label>
                <div className="flex items-center gap-3">
                   <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      className="flex-1 accent-primary"
                      value={count}
                      onChange={e => setCount(parseInt(e.target.value))}
                   />
                   <div className="w-12 text-center font-black text-primary bg-primary/10 py-1 rounded-lg border border-primary/20">{count}</div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Formatting Options</label>
                <div className="grid grid-cols-2 gap-3">
                   <button
                      onClick={() => setOptions(prev => ({ ...prev, uppercase: !prev.uppercase }))}
                      className={`py-3 px-4 rounded-xl border-2 flex items-center justify-between transition-all ${options.uppercase ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'}`}
                   >
                      <span className="text-[10px] font-black uppercase tracking-widest">Uppercase</span>
                      <div className={`w-3 h-3 rounded-full border-2 ${options.uppercase ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
                   </button>
                   <button
                      onClick={() => setOptions(prev => ({ ...prev, removeHyphens: !prev.removeHyphens }))}
                      className={`py-3 px-4 rounded-xl border-2 flex items-center justify-between transition-all ${options.removeHyphens ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'}`}
                   >
                      <span className="text-[10px] font-black uppercase tracking-widest">No Hyphens</span>
                      <div className={`w-3 h-3 rounded-full border-2 ${options.removeHyphens ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
                   </button>
                </div>
             </div>

             <button
                onClick={generate}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
             >
                <RefreshCw className="w-4 h-4" /> Generate UUIDs
             </button>
          </div>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-4">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <Hash className="w-3 h-3" /> {uuids.length} Generated
                   </div>
                   {time !== null && (
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                         {time}ms
                      </div>
                   )}
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={handleCopy} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      {copied ? 'Copied!' : <><Copy className="w-3 h-3" /> Copy All</>}
                   </button>
                   <div className="w-px h-3 bg-border mx-1" />
                   <button onClick={handleDownload} className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                   </button>
                </div>
             </div>

             <div className="border rounded-2xl overflow-hidden bg-muted/10 max-h-[400px] overflow-y-auto font-mono text-sm">
                {uuids.map((id, index) => (
                  <div key={index} className="px-6 py-3 border-b border-border/50 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                     <span className="text-foreground/80">{id}</span>
                     <button
                        onClick={() => copyToClipboard(id)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-primary/10 rounded-lg text-primary transition-all"
                        title="Copy individual UUID"
                     >
                        <Copy className="w-3.5 h-3.5" />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
