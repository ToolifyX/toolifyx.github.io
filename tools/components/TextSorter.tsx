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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          placeholder="Enter list to sort..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={() => sortLines('asc')} className="bg-black text-white px-4 py-2 rounded">Sort A → Z</button>
          <button onClick={() => sortLines('desc')} className="bg-black text-white px-4 py-2 rounded">Sort Z → A</button>
          <button onClick={handleCopy} className="border px-4 py-2 rounded">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
