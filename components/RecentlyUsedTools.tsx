"use client";

import React, { useEffect, useState } from 'react';
import { tools } from '@/tools/config';
import ToolCard from './ToolCard';
import { Tool } from '@/tools/types';

export default function RecentlyUsedTools() {
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    try {
      const recentlyUsedSlugs = JSON.parse(localStorage.getItem('recentlyUsedTools') || '[]');
      if (Array.isArray(recentlyUsedSlugs) && recentlyUsedSlugs.length > 0) {
        const recent = recentlyUsedSlugs
          .map((slug: string) => tools.find((t) => t.slug === slug))
          .filter((t: Tool | undefined): t is Tool => !!t);
        setRecentTools(recent);
      }
    } catch (e) {
      console.error('Failed to load recently used tools', e);
    }
  }, []);

  if (recentTools.length === 0) return null;

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000 mb-10">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-[0.15em] text-primary">Recently Used Quick Access</h2>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('recentlyUsedTools');
            setRecentTools([]);
          }}
          className="text-[10px] font-bold text-muted-foreground hover:text-destructive transition-colors uppercase tracking-widest"
        >
          Clear History
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
