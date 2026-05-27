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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <textarea
            className="w-full border rounded p-2 min-h-[200px]"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded border text-center">
            <div className="text-xl font-bold">{stats.words}</div>
            <div className="text-xs text-gray-500 uppercase">Words</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border text-center">
            <div className="text-xl font-bold">{stats.chars}</div>
            <div className="text-xs text-gray-500 uppercase">Characters</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border text-center">
            <div className="text-xl font-bold">{stats.sentences}</div>
            <div className="text-xs text-gray-500 uppercase">Sentences</div>
          </div>
          <div className="p-3 bg-gray-50 rounded border text-center">
            <div className="text-xl font-bold">{stats.paragraphs}</div>
            <div className="text-xs text-gray-500 uppercase">Paragraphs</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={() => setText('')}
            className="border px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
