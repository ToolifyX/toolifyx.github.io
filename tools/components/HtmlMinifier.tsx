"use client";

/**
 * SEO Title: HTML Minifier - Compress HTML Online
 * Meta Description: Minify your HTML code to reduce file size and improve website loading speed. Removes comments and extra whitespace.
 *
 * FAQ 1: Why minify HTML?
 * Minification reduces the size of your HTML files, making your website load faster for users.
 *
 * FAQ 2: Does it remove comments?
 * Yes, the tool removes all HTML comments to save bytes.
 *
 * FAQ 3: Can I revert the minification?
 * Minification is generally one-way for comments and formatting. Keep a backup of your original code.
 */

import React, { useState } from 'react';
import { minifyHTML, copyToClipboard } from '@/lib/utils';

export default function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyHTML(input));
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
        <div className="space-y-2">
          <label className="block text-sm font-medium">Original HTML</label>
          <textarea
            className="w-full border rounded p-2 min-h-[150px] font-mono text-sm"
            placeholder="<div>\n  <p>Hello World</p>\n</div>"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={handleMinify}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Minify HTML
        </button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-green-600">Minified Output</label>
              <button onClick={handleCopy} className="text-xs text-primary hover:underline font-medium">
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded p-2 min-h-[120px] font-mono text-sm bg-gray-50"
              value={output}
            />
            <p className="text-[10px] text-gray-400 text-right">
              Reduction: {Math.max(0, 100 - (output.length / input.length * 100)).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
