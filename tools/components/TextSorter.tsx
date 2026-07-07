"use client";

/**
 * SEO Title: Text Sorter - Sort Lines Alphabetically
 * Meta Description: Sort your lists or text lines alphabetically from A-Z or Z-A. Supports case-insensitive sorting.
 *
 * FAQ 1: Can I sort in reverse?
 * Yes, use the "Sort Z → A" button.
 *
 * FAQ 2: Does it handle numbers?
 * It sorts lines as strings, so 10 might come before 2.
 *
 * FAQ 3: How do I clear the text?
 * Click the "Clear" button to reset the input.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function TextSorter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const sortLines = (direction: 'asc' | 'desc') => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    if (direction === 'desc') lines.reverse();
    setText(lines.join('\n'));
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
          placeholder="Enter lines to sort (e.g. lists, names, data)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => sortLines('asc')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Sort A → Z
          </button>
          <button
            onClick={() => sortLines('desc')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Sort Z → A
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
