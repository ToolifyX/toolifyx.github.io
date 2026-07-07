"use client";

/**
 * SEO Title: JSON Unescape Online - Convert Escaped Strings to JSON
 * Meta Description: Reverse JSON escaping. Convert escaped strings back to valid, readable JSON data instantly.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function JsonUnescape() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleUnescape = () => {
    setError('');
    try {
      if (!input.trim()) return;
      // JSON.parse a double-quoted string unescapes it
      let processed = input.trim();
      if (!processed.startsWith('"')) processed = `"${processed}`;
      if (!processed.endsWith('"')) processed = `${processed}"`;

      const unescaped = JSON.parse(processed);
      // If it's valid JSON inside, prettify it
      try {
        const pretty = JSON.stringify(JSON.parse(unescaped), null, 2);
        setOutput(pretty);
      } catch {
        setOutput(unescaped);
      }
    } catch (e: any) {
      setError("Invalid escaped string format");
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
        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder='"{\"name\":\"John\"}"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleUnescape}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Unescape JSON
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Unescaped JSON</span>
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
