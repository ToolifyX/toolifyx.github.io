import { useState, useEffect, useMemo } from 'react';
import { tools } from '@/tools/config';
import { Tool } from '@/tools/types';

/**
 * Hook to manage favorite tools
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favoriteTools');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const toggleFavorite = (slug: string) => {
    const newFavorites = favorites.includes(slug)
      ? favorites.filter(s => s !== slug)
      : [...favorites, slug];

    setFavorites(newFavorites);
    localStorage.setItem('favoriteTools', JSON.stringify(newFavorites));
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  const favoriteTools = useMemo(() => {
    return favorites
      .map(slug => tools.find(t => t.slug === slug))
      .filter((t): t is Tool => !!t);
  }, [favorites]);

  return { favorites, favoriteTools, toggleFavorite, isFavorite };
}

/**
 * Hook to manage recent tools
 */
export function useRecentTools() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyUsedTools');
    if (stored) {
      try {
        setRecentSlugs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent tools', e);
      }
    }
  }, []);

  const addRecent = (slug: string) => {
    const updated = [slug, ...recentSlugs.filter(s => s !== slug)].slice(0, 12);
    setRecentSlugs(updated);
    localStorage.setItem('recentlyUsedTools', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setRecentSlugs([]);
    localStorage.removeItem('recentlyUsedTools');
  };

  const recentTools = useMemo(() => {
    return recentSlugs
      .map(slug => tools.find(t => t.slug === slug))
      .filter((t): t is Tool => !!t);
  }, [recentSlugs]);

  return { recentSlugs, recentTools, addRecent, clearHistory };
}

/**
 * Hook to manage command palette state
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
