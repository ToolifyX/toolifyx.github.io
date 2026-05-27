"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

interface ToolSearchProps {
  query: string;
  onChange: (value: string) => void;
}

export default function ToolSearch({ query, onChange }: ToolSearchProps) {
  return (
    <div className="relative group max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <input
        type="text"
        placeholder="Search for a tool..."
        className="w-full h-12 bg-card border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-lg py-4 pl-11 pr-12 transition-all text-[15px] font-medium outline-none placeholder:text-muted-foreground shadow-sm"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
