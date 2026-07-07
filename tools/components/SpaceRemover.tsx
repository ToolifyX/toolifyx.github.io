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
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[400px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Paste messy text here to clean up spaces and empty lines..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            onClick={handleClean}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Remove Extra Spaces
          </button>
          <button
            onClick={handleCopy}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={() => setText('')}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all ml-auto"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
