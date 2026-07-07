"use client";

/**
 * SEO Title: Remove Duplicate Lines - Clean Lists Online
 * Meta Description: Remove duplicate lines from your text or list while preserving the original order.
 *
 * FAQ 1: Does it preserve order?
 * Yes, the tool keeps the first occurrence of every line and removes subsequent duplicates.
 *
 * FAQ 2: Is it case-sensitive?
 * Yes, "Apple" and "apple" are considered different by default.
 *
 * FAQ 3: Can I process large lists?
 * Yes, it uses a Javascript Set for efficient O(n) duplicate removal.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function DuplicateRemover() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const uniqueLines = Array.from(new Set(lines));
    setText(uniqueLines.join('\n'));
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
          placeholder="Paste list with duplicate lines here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={removeDuplicates}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Remove Duplicates
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
