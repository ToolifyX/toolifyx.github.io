"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

interface ToolSearchProps {
  query: string;
  onChange: (value: string) => void;
}

export default function ToolSearch({ query, onChange }: ToolSearchProps) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="w-6 h-6" />
      </div>
      <input
        type="text"
        placeholder="What tool do you need?"
        className="w-full border-2 rounded-3xl py-5 pl-14 pr-12 bg-background focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xl font-bold shadow-xl placeholder:text-muted-foreground/50"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
