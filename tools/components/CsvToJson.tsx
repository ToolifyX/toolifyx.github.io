"use client";

/**
 * SEO Title: CSV to JSON Converter - Online JSON Generator
 * Meta Description: Convert CSV data into JSON format. Automatically detects headers and creates a clean JSON array of objects.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        setError("CSV must have at least a header and one data row");
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const currentLine = lines[i].split(',');

        headers.forEach((header, index) => {
          let val: any = currentLine[index]?.trim().replace(/^"(.*)"$/, '$1') || '';
          // Try to parse numbers or booleans
          if (!isNaN(val as any) && val !== '') val = Number(val);
          if (val.toLowerCase() === 'true') val = true;
          if (val.toLowerCase() === 'false') val = false;
          if (val.toLowerCase() === 'null') val = null;

          obj[header] = val;
        });
        result.push(obj);
      }

      setOutput(JSON.stringify(result, null, 2));
    } catch (e: any) {
      setError("Failed to parse CSV. Ensure it uses comma as delimiter.");
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
          placeholder='id,name,active&#10;1,Alice,true&#10;2,Bob,false'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleConvert}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Convert to JSON
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">JSON Result</span>
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
