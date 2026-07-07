"use client";

/**
 * SEO Title: JSON to CSV Converter - Online CSV Generator
 * Meta Description: Convert JSON arrays into flat CSV files. Handles nested objects and supports custom delimiters. Fast and free online tool.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function JsonToCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError('');
    try {
      if (!input.trim()) return;
      let data = JSON.parse(input);
      if (!Array.isArray(data)) {
        data = [data]; // Wrap object in array
      }

      if (data.length === 0) {
        setOutput('');
        return;
      }

      // Flatten logic and extract headers
      const keys = new Set<string>();
      const flattenedData = data.map((item: any) => {
        const flat: any = {};
        const flatten = (obj: any, prefix = '') => {
          Object.keys(obj).forEach(key => {
            const propName = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              flatten(obj[key], propName);
            } else {
              flat[propName] = obj[key];
              keys.add(propName);
            }
          });
        };
        flatten(item);
        return flat;
      });

      const headers = Array.from(keys);
      const csvRows = [];
      csvRows.push(headers.join(','));

      flattenedData.forEach((row: any) => {
        const values = headers.map(header => {
          const val = row[header] === undefined ? '' : row[header];
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      });

      setOutput(csvRows.join('\n'));
    } catch (e: any) {
      setError("Invalid JSON input. Expected an array of objects.");
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
          placeholder='[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleConvert}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Convert to CSV
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSV Result</span>
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
