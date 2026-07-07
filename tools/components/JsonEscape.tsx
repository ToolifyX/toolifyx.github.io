"use client";

/**
 * SEO Title: JSON Escape Online - Escaped String Generator
 * Meta Description: Convert your JSON data into an escaped string for use in code or APIs. Fast, free, and secure client-side conversion.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function JsonEscape() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEscape = () => {
    setError('');
    try {
      if (!input.trim()) return;
      // First ensure it's valid JSON (optional but recommended)
      JSON.parse(input);
      const escaped = JSON.stringify(input);
      setOutput(escaped);
    } catch (e: any) {
      // If not valid JSON, we still escape it as a regular string
      const escaped = JSON.stringify(input);
      setOutput(escaped);
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
        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder='{"name": "John"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleEscape}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Escape JSON
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            Clear
          </button>
        </div>

        {output && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Escaped String</span>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
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
