"use client";

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useFavorites } from '@/lib/hooks';

export default function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(slug);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      onClick={() => toggleFavorite(slug)}
      className={`p-2 rounded-lg border transition-all flex items-center gap-2 group ${
        active
          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 shadow-sm'
          : 'bg-card border-border text-muted-foreground hover:border-yellow-500/30 hover:bg-yellow-500/5 hover:text-yellow-600'
      }`}
      title={active ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      <Star className={`w-4 h-4 transition-transform group-active:scale-90 ${active ? 'fill-current' : ''}`} />
      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
        {active ? 'Favorited' : 'Favorite'}
      </span>
    </button>
  );
}
