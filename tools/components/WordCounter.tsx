"use client";

/**
 * SEO Title: Word Counter - Count Words, Characters & Sentences Online
 * Meta Description: Free online word counter tool. Calculate word count, character count, sentences, and paragraphs in real-time.
 *
 * FAQ 1: How does the word counter work?
 * Simply type or paste your text into the box, and the counts will update automatically.
 *
 * FAQ 2: Does it count spaces?
 * Yes, it provides both total character count (including spaces) and word count.
 *
 * FAQ 3: Is there a limit to the text length?
 * No, you can paste large amounts of text, and it will process it locally in your browser.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n+/).filter(Boolean).length,
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
        <div className="space-y-3">
          <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground">Input Text</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[400px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-xl border text-center space-y-1">
            <div className="text-2xl font-black text-primary">{stats.words}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Words</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl border text-center space-y-1">
            <div className="text-2xl font-black text-primary">{stats.chars}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Characters</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl border text-center space-y-1">
            <div className="text-2xl font-black text-primary">{stats.sentences}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sentences</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl border text-center space-y-1">
            <div className="text-2xl font-black text-primary">{stats.paragraphs}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Paragraphs</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={() => setText('')}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
