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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4 border-b pb-4">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded text-sm font-medium ${mode === 'encode' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded text-sm font-medium ${mode === 'decode' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            Decode
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Input URL/Text</label>
          <textarea
            className="w-full border rounded p-2 min-h-[120px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={process}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Result</label>
              <button onClick={handleCopy} className="text-xs text-primary hover:underline">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded p-2 min-h-[120px] font-mono text-sm bg-gray-50"
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
