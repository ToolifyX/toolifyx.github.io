"use client";

/**
 * SEO Title: Text Case Converter - Change Text Case Online
 * Meta Description: Easily convert text to UPPERCASE, lowercase, Capitalized, or Sentence case. Fast and free online text tool.
 *
 * FAQ 1: How do I convert text to uppercase?
 * Paste your text and click the "UPPERCASE" button.
 *
 * FAQ 2: What is Sentence case?
 * It capitalizes the first letter of each sentence and lowers the rest.
 *
 * FAQ 3: Is my text private?
 * Yes, all conversions happen in your browser.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type: 'upper' | 'lower' | 'capital' | 'sentence') => {
    let result = text;
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'capital':
        result = text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (l) => l.toUpperCase());
        break;
    }
    setText(result);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[400px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Enter text to convert..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <button onClick={() => convert('upper')} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all">UPPERCASE</button>
          <button onClick={() => convert('lower')} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all">lowercase</button>
          <button onClick={() => convert('capital')} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all">Capitalize Each Word</button>
          <button onClick={() => convert('sentence')} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all">Sentence case</button>
        </div>

        <button onClick={handleCopy} className="border px-6 py-3 rounded-xl w-full font-bold hover:bg-muted/50 transition-all">
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
