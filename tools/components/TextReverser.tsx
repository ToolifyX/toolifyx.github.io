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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          placeholder="Enter text to reverse..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={reverseEntire} className="bg-black text-white px-4 py-2 rounded">Reverse Entire Text</button>
          <button onClick={reverseLines} className="bg-black text-white px-4 py-2 rounded">Reverse Each Line</button>
          <button onClick={handleCopy} className="border px-4 py-2 rounded">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
