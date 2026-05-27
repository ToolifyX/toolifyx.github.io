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
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4">
      {/* Hero Section - Professional & Minimalist */}
      <div className="text-center space-y-3 pt-6 md:pt-10 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Every tool for <br />
          <span className="text-primary">everyone.</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Fast, private, browser-native tools. Your data never leaves your device.
        </p>

        <div className="pt-4 max-w-xl mx-auto">
          <ToolSearch query={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center pb-1">
          <CategoryMenu
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {isFiltering ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : 'Filtered Tools'}
                <span className="ml-2 lowercase font-normal">({filteredTools.length})</span>
              </h2>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-500">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border rounded-2xl bg-muted/20">
                <p className="text-sm text-muted-foreground">No tools match your search criteria.</p>
              </div>
            )}
          </div>
        ) : (
          /* Default Discovery View: Compact Categories */
          <div className="space-y-16">
            {categories.map((cat) => {
              const categoryTools = tools.filter((t) => t.category === cat.id);
              if (categoryTools.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-foreground">{cat.label}</h2>
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold text-muted-foreground">{categoryTools.length}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <Link
                      href={cat.href}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 transition-all hover:gap-2"
                    >
                      Explore All
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryTools.slice(0, 8).map((tool) => (
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
