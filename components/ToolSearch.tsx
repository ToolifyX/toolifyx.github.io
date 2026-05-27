"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

interface ToolSearchProps {
  query: string;
  onChange: (value: string) => void;
}

export default function ToolSearch({ query, onChange }: ToolSearchProps) {
  return (
    <div className="relative max-w-2xl mx-auto w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search tools (e.g. json, pdf, image)..."
        className="w-full border-2 rounded-2xl py-4 pl-12 pr-12 bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg shadow-sm hover:shadow-md"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
