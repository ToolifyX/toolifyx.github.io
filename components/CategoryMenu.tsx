"use client";

import React from 'react';
import { ToolCategory } from '@/tools/types';
import { tools } from '@/tools/config';

interface CategoryMenuProps {
  activeCategory: ToolCategory | 'all';
  onCategoryChange: (category: ToolCategory | 'all') => void;
}

const categories: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'dev', label: 'Dev Tools' },
  { id: 'text', label: 'Text Tools' },
  { id: 'image', label: 'Image Tools' },
  { id: 'pdf', label: 'PDF Tools' },
  { id: 'design', label: 'Design Tools' },
  { id: 'utility', label: 'Utility Tools' },
];

export default function CategoryMenu({ activeCategory, onCategoryChange }: CategoryMenuProps) {
  const getCount = (id: ToolCategory | 'all') => {
    if (id === 'all') return tools.length;
    return tools.filter(t => t.category === id).length;
  };

  return (
    <div className="flex overflow-x-auto pb-4 mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex space-x-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
              ${activeCategory === cat.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            {cat.label}
            <span className={`ml-2 text-xs ${activeCategory === cat.id ? 'text-gray-400' : 'text-gray-400'}`}>
              {getCount(cat.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
