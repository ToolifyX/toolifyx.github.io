"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { tools } from '@/tools/config';
import { Tool } from '@/tools/types';
import { Search, Star, History, Command, ArrowRight, X, Sparkles } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';
import { useFavorites, useRecentTools } from '@/lib/hooks';

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { favorites, isFavorite } = useFavorites();
  const { recentTools } = useRecentTools();

  // Simple fuzzy search implementation
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show recents and favorites when empty
      const combined = [...recentTools];
      favorites.forEach(slug => {
        if (!combined.some(t => t.slug === slug)) {
          const tool = tools.find(t => t.slug === slug);
          if (tool) combined.push(tool);
        }
      });
      return combined.slice(0, 10);
    }

    const s = query.toLowerCase();
    return tools
      .filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.slug.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
      )
      .sort((a, b) => {
        // Prioritize exact match in title
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle === s) return -1;
        if (bTitle === s) return 1;
        // Prioritize favorites
        if (isFavorite(a.slug) && !isFavorite(b.slug)) return -1;
        if (!isFavorite(a.slug) && isFavorite(b.slug)) return 1;
        return 0;
      })
      .slice(0, 10);
  }, [query, recentTools, favorites]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        router.push(`/tools/${results[selectedIndex].slug}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-40">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="flex items-center px-4 py-3 border-b">
           <Search className="w-5 h-5 text-muted-foreground mr-3" />
           <input
             ref={inputRef}
             type="text"
             className="flex-1 bg-transparent border-0 outline-none text-base font-medium placeholder:text-muted-foreground"
             placeholder="Search tools, categories, or shortcuts..."
             value={query}
             onChange={e => setQuery(e.target.value)}
             onKeyDown={handleKeyDown}
           />
           <div className="flex items-center gap-1.5 ml-3">
              <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-black uppercase text-muted-foreground border shadow-sm">ESC</span>
           </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
          {results.length === 0 ? (
            <div className="py-12 text-center space-y-2 opacity-50">
               <Search className="w-8 h-8 mx-auto text-muted-foreground" />
               <p className="text-sm font-bold">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
               <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center justify-between">
                  <span>{query ? 'Results' : 'Recent & Favorites'}</span>
                  <span>{results.length} found</span>
               </div>
               {results.map((tool, i) => (
                 <button
                   key={tool.slug}
                   onClick={() => { router.push(`/tools/${tool.slug}`); onClose(); }}
                   onMouseEnter={() => setSelectedIndex(i)}
                   className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedIndex === i ? 'bg-primary text-primary-foreground shadow-lg scale-[1.01] z-10' : 'hover:bg-muted/50'}`}
                 >
                   <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${selectedIndex === i ? 'bg-white/20 border-white/20' : tool.iconColor || 'bg-muted border-border/50'}`}>
                         <DynamicIcon name={tool.icon || 'HelpCircle'} size={20} strokeWidth={2.5} />
                      </div>
                      <div className="text-left min-w-0">
                         <div className="flex items-center gap-2">
                            <span className="font-black text-sm tracking-tight truncate">{tool.title}</span>
                            {isFavorite(tool.slug) && <Star className={`w-3 h-3 fill-current ${selectedIndex === i ? 'text-white' : 'text-yellow-500'}`} />}
                         </div>
                         <p className={`text-[10px] font-bold truncate opacity-80 ${selectedIndex === i ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{tool.description}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${selectedIndex === i ? 'border-white/20 bg-white/10' : 'bg-muted text-muted-foreground'}`}>{tool.category}</span>
                      {selectedIndex === i && <ArrowRight className="w-4 h-4 animate-in slide-in-from-left-2" />}
                   </div>
                 </button>
               ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-muted/30 border-t flex items-center justify-between">
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span className="flex items-center gap-1"><span className="p-1 rounded bg-muted border text-foreground">↑↓</span> Navigate</span>
              <span className="flex items-center gap-1"><span className="p-1 rounded bg-muted border text-foreground">Enter</span> Select</span>
           </div>
           <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary/60">
              <Command className="w-3 h-3" /> ToolifyX Search
           </div>
        </div>
      </div>
    </div>
  );
}
