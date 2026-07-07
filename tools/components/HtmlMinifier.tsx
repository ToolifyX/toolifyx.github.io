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
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="<div>\n  <p>Hello World</p>\n</div>"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleMinify}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Minify HTML
        </button>

        {output && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Minified Output</span>
              <button onClick={handleCopy} className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded-xl p-4 min-h-[300px] font-mono text-base bg-muted/10"
              value={output}
            />
            <p className="text-[10px] font-bold text-primary text-right uppercase tracking-widest">
              Reduction: {Math.max(0, 100 - (output.length / (input.length || 1) * 100)).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
