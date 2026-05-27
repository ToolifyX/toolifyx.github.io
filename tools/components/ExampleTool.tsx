"use client";

import React, { useState } from 'react';

export default function ExampleTool() {
  const [input, setInput] = useState('');

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Input Text</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-background"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
          />
        </div>
        <div className="p-4 bg-muted rounded">
          <label className="block text-xs uppercase text-muted-foreground font-semibold mb-2">Uppercase Output</label>
          <p className="break-all">{input.toUpperCase() || '...'}</p>
        </div>
      </div>
    </div>
  );
}
