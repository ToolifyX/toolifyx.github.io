"use client";

/**
 * SEO Title: Remove Extra Spaces - Clean Text Online
 * Meta Description: Automatically remove double spaces, trailing spaces, and empty lines from your text.
 *
 * FAQ 1: How does it clean text?
 * It trims each line and replaces multiple spaces between words with a single space.
 *
 * FAQ 2: Can I remove empty lines?
 * Yes, the tool automatically filters out blank lines.
 *
 * FAQ 3: Is it free?
 * Yes, all tools on ToolifyX are free and open-source.
 */

import React, { useState } from 'react';
import { removeExtraSpaces, copyToClipboard } from '@/lib/utils';

export default function SpaceRemover() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleClean = () => {
    setText(removeExtraSpaces(text));
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
          placeholder="Paste messy text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={handleClean} className="bg-black text-white px-4 py-2 rounded">Remove Extra Spaces</button>
          <button onClick={handleCopy} className="border px-4 py-2 rounded">
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        </div>
      </div>
    </div>
  );
}
