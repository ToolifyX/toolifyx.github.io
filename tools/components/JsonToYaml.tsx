"use client";

/**
 * SEO Title: JSON to YAML Converter - Online YAML Generator
 * Meta Description: Convert JSON data into clean YAML format. Fast, free, and secure client-side conversion for developers.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function JsonToYaml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Simple recursive YAML generator
  const toYaml = (obj: any, indent: number = 0): string => {
    const spacing = '  '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj !== 'object') {
      if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;
      return String(obj);
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => `\n${spacing}- ${toYaml(item, indent + 1).trimStart()}`).join('');
    }

    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';

    return keys.map(key => {
      const val = obj[key];
      const formattedVal = toYaml(val, indent + 1);
      return `\n${spacing}${key}:${formattedVal.includes('\n') ? formattedVal : ' ' + formattedVal}`;
    }).join('');
  };

  const handleConvert = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const obj = JSON.parse(input);
      const yaml = toYaml(obj).trim();
      setOutput(yaml);
    } catch (e: any) {
      setError("Invalid JSON input");
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
          placeholder='{"project": "ToolifyX", "active": true}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleConvert}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Convert to YAML
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">YAML Result</span>
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
