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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <button onClick={() => convert('upper')} className="bg-black text-white px-4 py-2 rounded">UPPERCASE</button>
          <button onClick={() => convert('lower')} className="bg-black text-white px-4 py-2 rounded">lowercase</button>
          <button onClick={() => convert('capital')} className="bg-black text-white px-4 py-2 rounded">Capitalize Each Word</button>
          <button onClick={() => convert('sentence')} className="bg-black text-white px-4 py-2 rounded">Sentence case</button>
        </div>

        <button onClick={handleCopy} className="border px-4 py-2 rounded w-full">
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
