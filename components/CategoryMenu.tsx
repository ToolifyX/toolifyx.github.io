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
      <div className="flex space-x-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              whitespace-nowrap px-6 py-3 rounded-2xl text-base font-black transition-all border-2
              ${activeCategory === cat.id
                ? 'bg-black text-white border-black shadow-lg scale-105 z-10'
                : 'bg-card text-muted-foreground border-transparent hover:border-muted-foreground/20'}
            `}
          >
            {cat.label}
            <span className={`ml-2 text-xs font-bold opacity-60`}>
              {getCount(cat.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
