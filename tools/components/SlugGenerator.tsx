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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Enter title or text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {slug && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-600">Generated Slug</label>
            <div className="flex gap-2">
              <input
                readOnly
                className="w-full border rounded p-2 bg-gray-50 font-mono text-sm"
                value={slug}
              />
              <button
                onClick={handleCopy}
                className="bg-black text-white px-4 py-2 rounded shrink-0"
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
