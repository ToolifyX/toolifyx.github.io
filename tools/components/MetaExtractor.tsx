"use client";

/**
 * SEO Title: HTML Meta Extractor - Extract SEO Tags from HTML
 * Meta Description: Extract all meta tags, Open Graph data, and Twitter cards from any HTML code snippet. Fast, private, and client-side extraction.
 */

import React, { useState, useMemo } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { ScanText, Copy, Trash2, Hash, Tag, Share2 } from 'lucide-react';

export default function MetaExtractor() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const tags = useMemo(() => {
    if (!input.trim()) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    const result: { type: string, name: string, content: string }[] = [];

    // Extract title
    const title = doc.querySelector('title')?.innerText;
    if (title) result.push({ type: 'Title', name: 'title', content: title });

    // Extract meta tags
    doc.querySelectorAll('meta').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        let type = 'Meta';
        if (name.startsWith('og:')) type = 'Open Graph';
        if (name.startsWith('twitter:')) type = 'Twitter';
        result.push({ type, name, content });
      }
    });

    // Extract link tags (canonical)
    doc.querySelectorAll('link').forEach(link => {
      const rel = link.getAttribute('rel');
      const href = link.getAttribute('href');
      if (rel && href) {
        result.push({ type: 'Link', name: rel, content: href });
      }
    });

    return result;
  }, [input]);

  const handleCopyAll = async () => {
    const text = tags.map(t => `${t.name}: ${t.content}`).join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-xl p-6 bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source HTML</span>
                <button onClick={() => setInput('')} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Clear</button>
              </div>
              <textarea
                className="flex-1 p-6 font-mono text-xs bg-transparent outline-none resize-none leading-relaxed"
                placeholder="Paste <head> or full HTML source code here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
           </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Extracted Tags</span>
                   <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded">{tags.length} FOUND</span>
                </div>
                {tags.length > 0 && (
                   <button onClick={handleCopyAll} className="text-[10px] font-black text-primary uppercase hover:underline">
                      {copied ? 'Copied!' : 'Copy All'}
                   </button>
                )}
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-2 custom-scrollbar">
                 {tags.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic text-xs space-y-2 opacity-50">
                      <ScanText className="w-8 h-8" />
                      <p>Extracted meta data will appear here</p>
                   </div>
                 ) : (
                   tags.map((tag, i) => (
                     <div key={i} className="p-3 border rounded-lg bg-muted/5 group hover:border-primary/30 transition-all space-y-1">
                        <div className="flex items-center justify-between">
                           <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${tag.type === 'Open Graph' ? 'bg-blue-500/10 text-blue-600' : tag.type === 'Twitter' ? 'bg-sky-500/10 text-sky-600' : 'bg-muted text-muted-foreground'}`}>
                              {tag.type}
                           </span>
                           <button onClick={() => copyToClipboard(tag.content)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"><Copy className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                        <div className="text-[10px] font-black text-foreground truncate">{tag.name}</div>
                        <p className="text-[11px] font-medium text-muted-foreground line-clamp-2 break-all">{tag.content}</p>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
