"use client";

import React, { useState } from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import CategoryMenu from '@/components/CategoryMenu';
import { ToolCategory } from '@/tools/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Every Tool You Need, <span className="text-primary">In One Place.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Fast, browser-based tools for everyday tasks. No login required.
        </p>
      </div>

      <CategoryMenu
        activeCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">No tools found in this category yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
