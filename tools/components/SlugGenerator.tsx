"use client";

/**
 * SEO Title: URL Slug Generator - Create Clean URLs
 * Meta Description: Convert any text into a URL-friendly slug. Removes special characters and replaces spaces with hyphens.
 *
 * FAQ 1: What is a slug?
 * A slug is the part of a URL which identifies a particular page in human-readable keywords.
 *
 * FAQ 2: Why use hyphens instead of spaces?
 * URLs cannot contain spaces. Hyphens are the standard separator for SEO-friendly URLs.
 *
 * FAQ 3: Does it remove emojis?
 * Yes, it strips non-alphanumeric characters to ensure the slug is valid for URLs.
 */

import React, { useState } from 'react';
import { slugify, copyToClipboard } from '@/lib/utils';

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const slug = slugify(input);

  const handleCopy = async () => {
    const success = await copyToClipboard(slug);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <input
          className="w-full border rounded-xl p-4 text-lg font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Enter title or text to slugify..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {slug && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Generated Slug</span>
            <div className="flex gap-2">
              <input
                readOnly
                className="w-full border rounded-xl p-4 bg-muted/10 font-mono text-base"
                value={slug}
              />
              <button
                onClick={handleCopy}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shrink-0 hover:opacity-90 transition-all"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
