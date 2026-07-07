"use client";

/**
 * SEO Title: Find and Replace Online - Text & Regex Search Tool
 * Meta Description: Powerful text search and replace tool. Supports Regex, case matching, whole word search, and real-time match counting.
 */

import React, { useState, useMemo } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { Search, Replace, Hash } from 'lucide-react';

export default function FindReplace() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (!find || !text) return 0;
    try {
      let pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (wholeWord) pattern = `\\b${pattern}\\b`;
      const flags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch (e) {
      return 0;
    }
  }, [text, find, useRegex, matchCase, wholeWord]);

  const handleReplace = (all: boolean) => {
    if (!find || !text) return;
    try {
      let pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (wholeWord) pattern = `\\b${pattern}\\b`;
      const flags = all ? (matchCase ? 'g' : 'gi') : (matchCase ? '' : 'i');
      const regex = new RegExp(pattern, flags);
      setText(text.replace(regex, replace));
    } catch (e) {
      alert("Invalid Regex pattern");
    }
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
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Search className="w-3 h-3" /> Find
            </label>
            <input
              type="text"
              className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-mono"
              placeholder="Text to find..."
              value={find}
              onChange={e => setFind(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Replace className="w-3 h-3" /> Replace
            </label>
            <input
              type="text"
              className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-mono"
              placeholder="Replacement text..."
              value={replace}
              onChange={e => setReplace(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Regex</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Match Case</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={wholeWord} onChange={e => setWholeWord(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Whole Word</span>
          </label>
          {find && (
            <div className="ml-auto flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
              <Hash className="w-3 h-3" /> {stats} Matches Found
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleReplace(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Replace All
          </button>
          <button
            onClick={() => handleReplace(false)}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all"
          >
            Replace First
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
