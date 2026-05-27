"use client";

/**
 * SEO Title: Character Counter - Count Characters with & without Spaces
 * Meta Description: Precision character counter tool. Count total characters, characters excluding spaces, and more.
 *
 * FAQ 1: Does it count line breaks?
 * Yes, line breaks are included in the total character count.
 *
 * FAQ 2: Why count without spaces?
 * Many social media platforms and academic requirements specify limits excluding whitespace.
 *
 * FAQ 3: Is there a maximum limit?
 * No, the tool can handle very large blocks of text.
 */

import React, { useState } from 'react';

export default function CharacterCounter() {
  const [text, setText] = useState('');

  const total = text.length;
  const noSpaces = text.replace(/\s/g, '').length;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          placeholder="Start typing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded border text-center">
            <div className="text-3xl font-bold">{total}</div>
            <div className="text-xs text-muted-foreground uppercase">Characters (with spaces)</div>
          </div>
          <div className="p-4 bg-muted rounded border text-center">
            <div className="text-3xl font-bold">{noSpaces}</div>
            <div className="text-xs text-muted-foreground uppercase">Characters (no spaces)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
