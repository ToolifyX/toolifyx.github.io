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
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[400px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Start typing or paste text to count characters..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-muted/30 rounded-xl border text-center space-y-1">
            <div className="text-4xl font-black text-primary">{total}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Characters (with spaces)</div>
          </div>
          <div className="p-6 bg-muted/30 rounded-xl border text-center space-y-1">
            <div className="text-4xl font-black text-primary">{noSpaces}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Characters (no spaces)</div>
          </div>
        </div>
        <button
          onClick={() => setText('')}
          className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
