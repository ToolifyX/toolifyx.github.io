"use client";

import React, { useState, useMemo } from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import CategoryMenu from '@/components/CategoryMenu';
import ToolSearch from '@/components/ToolSearch';
import { ToolCategory } from '@/tools/types';
import Link from 'next/link';

const categories: { id: ToolCategory; label: string; href: string; description: string }[] = [
  { id: 'dev', label: 'Developer Tools', href: '/dev-tools', description: 'JSON, Base64, UUID...' },
  { id: 'text', label: 'Text Tools', href: '/text-tools', description: 'Counter, Case, Slug...' },
  { id: 'image', label: 'Image Tools', href: '/image-tools', description: 'Compress, Convert, Resize...' },
  { id: 'pdf', label: 'PDF Tools', href: '/pdf-tools', description: 'Merge, Split, Convert...' },
  { id: 'design', label: 'Design Tools', href: '/design-tools', description: 'Picker, Gradient, Shadow...' },
  { id: 'utility', label: 'Utility Tools', href: '/utility-tools', description: 'QR, Password, Unit...' },
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
    <div className="space-y-6 pb-12">
      {/* Hero Section - Compact */}
      <div className="text-center space-y-3 py-6 md:py-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
          EVERY TOOL <span className="text-primary italic">INSTANTLY.</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto px-4">
          Fast, private, browser-based utilities. Your data never leaves your machine.
        </p>

        <div className="pt-4 px-4 max-w-xl mx-auto">
          <ToolSearch query={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="space-y-4">
        <CategoryMenu
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isFiltering ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold">
                {searchQuery ? `Results for "${searchQuery}"` : 'Filtered Tools'}
                <span className="ml-2 text-xs font-normal text-muted-foreground">({filteredTools.length})</span>
              </h2>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear all
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-xl bg-muted/10">
                <p className="text-sm font-semibold">No tools found</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-2 text-xs bg-black text-white px-4 py-1.5 rounded-full"
                >
                  Show all
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Default Discovery View: Compact Categories */
          <div className="space-y-10">
            {categories.map((cat) => {
              const categoryTools = tools.filter((t) => t.category === cat.id);
              if (categoryTools.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-3">
                  <div className="flex items-end justify-between border-b pb-2 px-1">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-lg font-bold tracking-tight">{cat.label}</h2>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">{categoryTools.length} tools</span>
                    </div>
                    <Link
                      href={cat.href}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5 group"
                    >
                      View all
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {categoryTools.slice(0, 10).map((tool) => (
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
