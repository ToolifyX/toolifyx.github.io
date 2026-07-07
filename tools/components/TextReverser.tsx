"use client";

/**
 * SEO Title: Text Reverser - Reverse Text and Lines
 * Meta Description: Reverse your text or flip each line individually. Useful for mirrors, puzzles, and data processing.
 *
 * FAQ 1: How do I reverse the whole text?
 * Use the "Reverse Entire Text" button.
 *
 * FAQ 2: What does "Reverse Each Line" do?
 * It keeps the order of lines but flips the characters within each line.
 *
 * FAQ 3: Can I reverse word order?
 * Currently, we support character and line reversing.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function TextReverser() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const reverseEntire = () => {
    setText(text.split('').reverse().join(''));
  };

  const reverseLines = () => {
    setText(text.split('\n').map(line => line.split('').reverse().join('')).join('\n'));
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
          placeholder="Enter text to reverse or flip..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={reverseEntire}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Reverse Entire Text
          </button>
          <button
            onClick={reverseLines}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Reverse Each Line
          </button>
          <button
            onClick={handleCopy}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={() => setText('')}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all sm:ml-auto"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
