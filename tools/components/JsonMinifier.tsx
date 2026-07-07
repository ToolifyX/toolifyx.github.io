"use client";

/**
 * SEO Title: JSON Minifier - Compress & Shrink JSON Online
 * Meta Description: Reduce JSON file size by removing all unnecessary whitespace and newlines. Fast and free online JSON minification tool.
 */

import React, { useState } from 'react';
import { copyToClipboard, formatBytes } from '@/lib/utils';

export default function JsonMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  const handleMinify = () => {
    const start = performance.now();
    setError('');
    try {
      if (!input.trim()) return;
      const obj = JSON.parse(input);
      const minified = JSON.stringify(obj);
      setOutput(minified);
      setTime(parseFloat((performance.now() - start).toFixed(2)));
    } catch (e: any) {
      setError(e.message);
      setOutput('');
      setTime(null);
    }
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
          className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder='{"key": "value", "pretty": true}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleMinify}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Minify JSON
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); setTime(null); }}
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

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

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
