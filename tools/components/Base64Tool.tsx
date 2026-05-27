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
          <label className="block text-sm font-medium">Input Text</label>
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
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
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
