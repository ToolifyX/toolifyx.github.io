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
  const [keep, setKeep] = useState<'first' | 'last'>('first');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [sortResult, setSortResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const removeDuplicates = () => {
    if (!text.trim()) return;
    let lines = text.split('\n');

    if (keep === 'last') lines.reverse();

    const seen = new Set<string>();
    const result: string[] = [];

    lines.forEach(line => {
      let cleanLine = line;
      if (ignoreWhitespace) cleanLine = line.trim();

      const compareLine = caseSensitive ? cleanLine : cleanLine.toLowerCase();

      if (!seen.has(compareLine)) {
        seen.add(compareLine);
        result.push(line);
      }
    });

    if (keep === 'last') result.reverse();
    if (sortResult) result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    setText(result.join('\n'));
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
          placeholder="Paste list with duplicate lines here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-6 items-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-4 border-r border-border/50 pr-6 mr-2">
             <button onClick={() => setKeep('first')} className={`text-xs font-bold uppercase tracking-widest transition-all ${keep === 'first' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>First</button>
             <button onClick={() => setKeep('last')} className={`text-xs font-bold uppercase tracking-widest transition-all ${keep === 'last' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Last</button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Case Sensitive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={ignoreWhitespace} onChange={e => setIgnoreWhitespace(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Ignore Whitespace</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={sortResult} onChange={e => setSortResult(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Sort Result</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={removeDuplicates}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Remove Duplicates
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
