"use client";

/**
 * SEO Title: JSON to XML Converter - Online XML Generator
 * Meta Description: Convert JSON objects or arrays into formatted XML. Fast, reliable, and secure client-side conversion tool.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function JsonToXml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Simple recursive XML generator
  const toXml = (obj: any, name: string = 'root'): string => {
    if (obj === null) return `<${name}>null</${name}>`;
    if (typeof obj !== 'object') {
      return `<${name}>${obj}</${name}>`;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => toXml(item, 'item')).join('\n');
    }

    const children = Object.keys(obj).map(key => toXml(obj[key], key)).join('\n');
    return `<${name}>\n${children.split('\n').map(l => '  ' + l).join('\n')}\n</${name}>`;
  };

  const handleConvert = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const obj = JSON.parse(input);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj)}`;
      setOutput(xml);
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
          placeholder='{"root": {"id": 1, "status": "active"}}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleConvert}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Convert to XML
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">XML Result</span>
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
