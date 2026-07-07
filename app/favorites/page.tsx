"use client";

import React, { useState, useEffect } from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import { useFavorites } from '@/lib/hooks';
import Link from 'next/link';
import { Star, ArrowRight, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteTools } = useFavorites();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 pt-10">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest">
           <Star className="w-3 h-3 fill-current" /> My Workspace
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Favorite Tools</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Your personalized collection of frequently used utilities. Everything is stored locally in your browser for instant access and total privacy.
        </p>
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {favoriteTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed rounded-3xl space-y-6 bg-muted/10">
          <div className="w-20 h-20 rounded-full bg-card border flex items-center justify-center mx-auto shadow-sm">
             <Heart className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
             <p className="text-lg font-bold text-foreground">No favorites yet</p>
             <p className="text-sm text-muted-foreground max-w-xs mx-auto">Start bookmarking your most used tools to see them here for quick access.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:opacity-90 transition-all"
          >
             Browse All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
