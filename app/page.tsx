"use client";

import React, { useState, useMemo } from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import CategoryMenu from '@/components/CategoryMenu';
import ToolSearch from '@/components/ToolSearch';
import { ToolCategory } from '@/tools/types';
import Link from 'next/link';

const categories: { id: ToolCategory; label: string; href: string; description: string }[] = [
  { id: 'dev', label: 'Developer Tools', href: '/dev-tools', description: 'JSON, Base64, UUID, and more.' },
  { id: 'text', label: 'Text Tools', href: '/text-tools', description: 'Case conversion, word counts, and cleaning.' },
  { id: 'image', label: 'Image Tools', href: '/image-tools', description: 'Compress, convert, and resize images.' },
  { id: 'pdf', label: 'PDF Tools', href: '/pdf-tools', description: 'Merge, split, and manage PDF files.' },
  { id: 'design', label: 'Design Tools', href: '/design-tools', description: 'Color pickers, gradients, and CSS shadows.' },
  { id: 'utility', label: 'Utility Tools', href: '/utility-tools', description: 'QR codes, passwords, and unit converters.' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => selectedCategory === 'all' || tool.category === selectedCategory)
      .filter((tool) => {
        const search = searchQuery.toLowerCase();
        return (
          tool.title.toLowerCase().includes(search) ||
          tool.slug.toLowerCase().includes(search) ||
          tool.description.toLowerCase().includes(search)
        );
      });
  }, [searchQuery, selectedCategory]);

  const isFiltering = searchQuery !== '' || selectedCategory !== 'all';

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 md:py-20">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">
          TOOLS FOR <span className="text-primary italic underline decoration-wavy decoration-primary/30 underline-offset-8">EVERYTHING.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Free, browser-based utilities for developers and designers.
          Your data never leaves your machine.
        </p>

        <div className="pt-8 px-4">
          <ToolSearch query={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="space-y-10">
        <CategoryMenu
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isFiltering ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Results for "${searchQuery}"` : 'Filtered Tools'}
                <span className="ml-2 text-sm font-normal text-muted-foreground">({filteredTools.length} found)</span>
              </h2>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-sm text-primary hover:underline font-medium"
              >
                Clear all
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/20">
                <p className="text-xl font-semibold mb-2">No tools found matching your search</p>
                <p className="text-muted-foreground">Try using different keywords or clearing your filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-6 bg-black text-white px-6 py-2 rounded-full font-medium"
                >
                  Show all tools
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Default Discovery View: Grouped by Category */
          <div className="space-y-24">
            {categories.map((cat) => {
              const categoryTools = tools.filter((t) => t.category === cat.id);
              if (categoryTools.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold tracking-tight">{cat.label}</h2>
                      <p className="text-muted-foreground">{cat.description}</p>
                    </div>
                    <Link
                      href={cat.href}
                      className="text-primary font-bold hover:underline flex items-center gap-1 transition-all group"
                    >
                      View all {categoryTools.length} {cat.label}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.slice(0, 6).map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
