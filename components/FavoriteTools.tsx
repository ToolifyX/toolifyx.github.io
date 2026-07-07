"use client";

import React, { useEffect, useState } from 'react';
import ToolCard from './ToolCard';
import { useFavorites } from '@/lib/hooks';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FavoriteTools() {
  const { favoriteTools } = useFavorites();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || favoriteTools.length === 0) return null;

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000 mb-10">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-[0.15em] text-yellow-600">Your Favorites</h2>
          <span className="text-[10px] bg-yellow-500/10 px-1.5 py-0.5 rounded font-bold text-yellow-600">Saved Tools</span>
        </div>
        <Link
          href="/favorites"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteTools.slice(0, 4).map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
