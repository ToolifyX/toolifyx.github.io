"use client";

/**
 * SEO Title: JSON Formatter & Beautifier - Clean & Format JSON Online
 * Meta Description: Free online tool to format, beautify, and prettify JSON data. Make your JSON readable with custom indentation.
 *
 * FAQ 1: How do I format JSON?
 * Paste your minified or messy JSON into the input box and click "Format JSON".
 *
 * FAQ 2: Is my data safe?
 * Yes, all processing happens locally in your browser. No data is sent to any server.
 *
 * FAQ 3: Can it handle invalid JSON?
 * It will display a clear error message if the JSON is malformed, helping you debug.
 */

import React, { useState } from 'react';
import { formatJSON, copyToClipboard } from '@/lib/utils';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const formatted = formatJSON(input);
      setOutput(formatted);
    } catch (e: any) {
      setError(e.message);
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
          placeholder='{"key": "value"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleFormat}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Format JSON
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Formatted Output</span>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded-xl p-4 min-h-[400px] font-mono text-base bg-muted/10"
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
