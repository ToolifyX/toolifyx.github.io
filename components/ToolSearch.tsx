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
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-black dark:text-white group-focus-within:text-primary transition-colors z-10">
        <Search className="w-6 h-6 stroke-[3]" />
      </div>
      <input
        type="text"
        placeholder="WHAT TOOL DO YOU NEED?"
        className="w-full border-2 border-black dark:border-white rounded-lg py-4 pl-14 pr-12 bg-white dark:bg-black focus:outline-none focus:ring-0 shadow-neo focus:shadow-neo-lg transition-all text-xl font-black placeholder:text-black/30 dark:placeholder:white/30 tracking-tight uppercase"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-black dark:text-white hover:text-primary transition-colors z-10"
          aria-label="Clear search"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>
      )}
    </div>
  );
}
