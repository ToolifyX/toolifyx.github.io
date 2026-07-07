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
  const [removeWhitespaceOnly, setRemoveWhitespaceOnly] = useState(true);
  const [trimLines, setTrimLines] = useState(false);
  const [preserveIndentation, setPreserveIndentation] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleClean = () => {
    if (!text) return;
    let lines = text.split('\n');

    if (removeWhitespaceOnly) {
      lines = lines.filter(line => line.trim() !== '');
    }

    if (trimLines) {
      lines = lines.map(line => line.trim());
    } else if (!preserveIndentation) {
      lines = lines.map(line => line.trimStart());
    }

    setText(lines.join('\n'));
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
          placeholder="Paste text with empty lines to clean up..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-6 items-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={removeWhitespaceOnly} onChange={e => setRemoveWhitespaceOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Remove Whitespace Lines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Trim Lines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={preserveIndentation} onChange={e => setPreserveIndentation(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" disabled={trimLines} />
            <span className={`text-sm font-bold transition-colors ${trimLines ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-muted-foreground group-hover:text-foreground'}`}>Preserve Indentation</span>
          </label>
        </div>

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
