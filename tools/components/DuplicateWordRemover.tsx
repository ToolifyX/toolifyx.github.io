"use client";

/**
 * SEO Title: Remove Duplicate Words Online - Clean Repeated Words
 * Meta Description: Easily remove duplicate words from your text. Supports case sensitivity and punctuation ignoring.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function DuplicateWordRemover() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [copied, setCopied] = useState(false);

  const removeDuplicates = () => {
    if (!text.trim()) return;

    let words = text.split(/\s+/);
    const seen = new Set<string>();
    const result: string[] = [];

    words.forEach(word => {
      let cleanWord = word;
      if (ignorePunctuation) {
        cleanWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
      }

      const compareWord = caseSensitive ? cleanWord : cleanWord.toLowerCase();

      if (compareWord && !seen.has(compareWord)) {
        seen.add(compareWord);
        result.push(word);
      }
    });

    setText(result.join(' '));
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
          className="w-full border rounded-xl p-4 min-h-[300px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="apple apple banana orange banana..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-6 items-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={e => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Case Sensitive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={ignorePunctuation}
              onChange={e => setIgnorePunctuation(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Ignore Punctuation</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={removeDuplicates}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Remove Duplicate Words
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
