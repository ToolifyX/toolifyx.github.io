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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          placeholder="Paste list with duplicates..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={removeDuplicates} className="bg-black text-white px-4 py-2 rounded">Remove Duplicates</button>
          <button onClick={handleCopy} className="border px-4 py-2 rounded">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
