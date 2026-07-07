"use client";

/**
 * SEO Title: JavaScript Minifier - Compress JS Code Online
 * Meta Description: Minify your JavaScript code to reduce file size and improve website performance. Removes comments, whitespace, and extra characters instantly.
 */

import React, { useState } from 'react';
import { copyToClipboard, downloadFile, formatBytes } from '@/lib/utils';
import { FileCode, Zap, Download, RefreshCw, AlertCircle } from 'lucide-react';

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  const handleMinify = () => {
    if (!input.trim()) return;
    const start = performance.now();

    // Basic JS minification (removes comments and extra whitespace)
    let minified = input
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
      .replace(/\s+/g, ' ')                                  // Collapse whitespace
      .replace(/\s*([{}|:;,=\+\-\*\/])\s*/g, '$1')           // Remove spaces around operators
      .trim();

    setOutput(minified);
    setTime(parseFloat((performance.now() - start).toFixed(2)));
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reduction = input.length > 0 && output.length > 0
    ? ((input.length - output.length) / input.length * 100).toFixed(1)
    : 0;

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="function hello() { console.log('Hello World'); }"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleMinify}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" /> Minify JS
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setTime(null); }}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            Clear
          </button>
          {time !== null && (
            <div className="ml-auto text-[10px] font-black text-primary uppercase tracking-[0.2em] self-center">
              Processed in {time}ms
            </div>
          )}
        </div>

        {output && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-4">
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Original: <span className="text-foreground">{formatBytes(input.length)}</span>
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Minified: <span className="text-foreground">{formatBytes(output.length)}</span>
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">
                    Saved: <span className="text-foreground">{reduction}%</span>
                 </div>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded-xl p-4 min-h-[200px] font-mono text-base bg-muted/10"
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
