"use client";

import React, { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Enter Text</label>
          <textarea
            className="w-full p-2 border rounded bg-background min-h-[150px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded text-center">
            <div className="text-2xl font-bold">{wordCount}</div>
            <div className="text-xs text-muted-foreground uppercase">Words</div>
          </div>
          <div className="p-4 bg-muted rounded text-center">
            <div className="text-2xl font-bold">{charCount}</div>
            <div className="text-xs text-muted-foreground uppercase">Characters</div>
          </div>
        </div>
      </div>
    </div>
  );
}
