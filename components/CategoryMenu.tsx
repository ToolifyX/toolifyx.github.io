"use client";

import React from 'react';
import { ToolCategory } from '@/tools/types';
import { tools } from '@/tools/config';

interface CategoryMenuProps {
  activeCategory: ToolCategory | 'all';
  onCategoryChange: (category: ToolCategory | 'all') => void;
}

const categories: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'pdf', label: 'PDF' },
  { id: 'design', label: 'Design' },
  { id: 'utility', label: 'Utility' },
];

export default function CategoryMenu({ activeCategory, onCategoryChange }: CategoryMenuProps) {
  const getCount = (id: ToolCategory | 'all') => {
    if (id === 'all') return tools.length;
    return tools.filter(t => t.category === id).length;
  };

  return (
    <div className="flex overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 p-1 bg-card rounded-2xl border border-border/60 shadow-sm">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200
                ${isActive
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
              `}
            >
              <span className="relative z-10">{cat.label}</span>
              <span className={`
                text-[10px] px-1.5 py-0.5 rounded-md font-black
                ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'}
              `}>
                {getCount(cat.id)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
