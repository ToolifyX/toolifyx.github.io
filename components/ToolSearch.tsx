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
      <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-black dark:text-white group-focus-within:text-primary transition-colors z-10">
        <Search className="w-8 h-8 stroke-[3]" />
      </div>
      <input
        type="text"
        placeholder="WHAT TOOL DO YOU NEED?"
        className="w-full border-4 border-black dark:border-white rounded-xl py-8 pl-20 pr-16 bg-white dark:bg-black focus:outline-none focus:ring-0 shadow-neo-lg focus:shadow-neo-xl transition-all text-2xl md:text-4xl font-black placeholder:text-black/20 dark:placeholder:white/20 tracking-tight uppercase"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-8 flex items-center text-black dark:text-white hover:text-primary transition-colors z-10"
          aria-label="Clear search"
        >
          <X className="w-8 h-8 stroke-[3]" />
        </button>
      )}
    </div>
  );
}
