"use client";

/**
 * SEO Title: CSS Minifier - Compress CSS Online
 * Meta Description: Compress your CSS code by removing unnecessary whitespace and comments. Fast, free, and secure online CSS minification.
 *
 * FAQ 1: How does CSS minification help?
 * It reduces the payload size of your stylesheets, which improves PageSpeed scores and user experience.
 *
 * FAQ 2: Is it safe for production?
 * Yes, the minification logic preserves the functional CSS rules while removing non-essential characters.
 *
 * FAQ 3: Can I minify SCSS or LESS?
 * This tool is designed for standard CSS. Please compile your preprocessor files to CSS before using this tool.
 */

import React, { useState } from 'react';
import { minifyCSS, copyToClipboard } from '@/lib/utils';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyCSS(input));
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
          placeholder=".header {\n  color: red;\n  margin: 0px;\n}"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleMinify}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Minify CSS
        </button>

        {output && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Minified CSS</span>
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
