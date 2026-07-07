"use client";

/**
 * SEO Title: Base64 Encoder & Decoder - Online Text Tool
 * Meta Description: Easily encode text to Base64 or decode Base64 back to plain text. Supports Unicode characters.
 *
 * FAQ 1: What is Base64 encoding?
 * Base64 is a way to represent binary data in an ASCII string format using 64 different characters.
 *
 * FAQ 2: Does this support UTF-8?
 * Yes, our implementation correctly handles Unicode characters during encoding and decoding.
 *
 * FAQ 3: Why use Base64?
 * It is commonly used to embed small images or other binary data in HTML, CSS, or JSON files.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function Base64Tool() {
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
        // Correct Unicode handling for btoa
        const bytes = new TextEncoder().encode(input);
        const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
        setOutput(btoa(binString));
      } else {
        const binString = atob(input);
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e: any) {
      setError(`Invalid ${mode === 'decode' ? 'Base64' : 'input'} string`);
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

        <div className="space-y-3">
          <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground">Input Text</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={process}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground">Result</label>
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
