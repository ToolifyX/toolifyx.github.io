"use client";

/**
 * SEO Title: URL Encoder & Decoder - Online Web Tool
 * Meta Description: Safely encode or decode URLs. Convert special characters to percent-encoded format for safe web transmission.
 *
 * FAQ 1: What is URL encoding?
 * It converts characters into a format that can be transmitted over the Internet safely.
 *
 * FAQ 2: Why do I need to decode a URL?
 * Decoded URLs are easier to read for humans, especially when they contain parameters or special characters.
 *
 * FAQ 3: Is it safe to use this tool?
 * Absolutely. The conversion is done entirely in your browser using standard JavaScript functions.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function UrlTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError('');
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e: any) {
      setError('Invalid input for URL ' + mode);
      setOutput('');
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

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b pb-4">
          <button
            onClick={() => setMode('encode')}
            className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === 'encode' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === 'decode' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            Decode
          </button>
        </div>

        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder={`Enter URL to ${mode}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={process}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Result</span>
              <button onClick={handleCopy} className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base bg-muted/10"
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
