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
    <div className="flex overflow-x-auto pb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex space-x-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              whitespace-nowrap px-8 py-5 rounded-xl text-xl font-black transition-all border-4 border-black dark:border-white uppercase tracking-tighter
              ${activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-none translate-x-1 translate-y-1'
                : 'bg-white dark:bg-black text-black dark:text-white shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1'}
            `}
          >
            {cat.label}
            <span className={`ml-3 text-sm font-black opacity-50 tracking-widest`}>
              {getCount(cat.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
