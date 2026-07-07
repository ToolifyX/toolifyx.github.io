"use client";

/**
 * SEO Title: Keyword Density Checker - Content Analysis Online
 * Meta Description: Analyze your content's keyword density. Find top repeated words, word count, and identify potential keyword stuffing issues instantly.
 */

import React, { useState, useMemo } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { Search, Hash, FileText, AlertCircle } from 'lucide-react';

export default function KeywordDensity() {
  const [text, setText] = useState('');

  const analysis = useMemo(() => {
    if (!text.trim()) return { total: 0, unique: 0, top: [] };

    const words = text.toLowerCase()
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");

    const freq: Record<string, number> = {};
    words.forEach(w => {
      if (w.length > 2) { // Filter out short words
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      total: words.length,
      unique: Object.keys(freq).length,
      top: sorted.map(([word, count]) => ({
        word,
        count,
        percent: ((count / words.length) * 100).toFixed(1)
      }))
    };
  }, [text]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Paste your article or content here to analyze keywords..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                <FileText className="w-4 h-4" /> Global Stats
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1">
                   <div className="text-2xl font-black text-primary">{analysis.total}</div>
                   <div className="text-[10px] font-bold text-muted-foreground uppercase">Total Words</div>
                </div>
                <div className="p-4 bg-muted/10 rounded-xl border border-border/50 text-center space-y-1">
                   <div className="text-2xl font-black text-primary">{analysis.unique}</div>
                   <div className="text-[10px] font-bold text-muted-foreground uppercase">Keywords</div>
                </div>
             </div>

             {analysis.top.some(k => parseFloat(k.percent) > 5) && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">Warning: Some keywords have density over 5%. This might be flagged as keyword stuffing by search engines.</p>
               </div>
             )}
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary px-1">
                <Search className="w-4 h-4" /> Top Keyword Density
             </div>
             <div className="space-y-2 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                {analysis.top.length > 0 ? analysis.top.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-muted/5 group hover:bg-muted/10 transition-all">
                     <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.word}</span>
                     <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">{item.count} Times</span>
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                           <div className={`h-full bg-primary transition-all duration-1000`} style={{ width: `${Math.min(100, parseFloat(item.percent) * 10)}%` }} />
                        </div>
                        <span className="text-xs font-black text-primary w-10 text-right">{item.percent}%</span>
                     </div>
                  </div>
                )) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic text-xs py-10 opacity-50">
                     Analysis will appear here
                  </div>
                )}
             </div>
          </div>
        </div>

        <button
          onClick={() => setText('')}
          className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full uppercase tracking-widest text-xs"
        >
          Clear content
        </button>
      </div>
    </div>
  );
}
