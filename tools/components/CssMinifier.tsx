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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Source CSS</label>
          <textarea
            className="w-full border rounded p-2 min-h-[150px] font-mono text-sm"
            placeholder=".header {\n  color: red;\n  margin: 0px;\n}"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={handleMinify}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Minify CSS
        </button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-green-600">Minified CSS</label>
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
