"use client";

/**
 * SEO Title: Random Number Generator - Generate Random Values & Lists
 * Meta Description: Flexible random number generator. Generate integers, decimals, or unique lists with custom ranges. Sort, shuffle, and export results instantly.
 */

import React, { useState, useMemo } from 'react';
import { Hash, RefreshCw, Copy, Download, SortAsc, SortDesc, Shuffle } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/utils';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [unique, setUnique] = useState(true);
  const [decimal, setDecimal] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const newResults: number[] = [];
    const range = max - min + 1;

    if (unique && count > range && !decimal) {
      alert("Cannot generate more unique integers than available in range.");
      return;
    }

    const seen = new Set();
    while (newResults.length < count) {
      let num = Math.random() * (max - min);
      if (!decimal) num = Math.floor(num + min);
      else num = parseFloat((num + min).toFixed(2));

      if (unique && !decimal) {
        if (!seen.has(num)) {
          seen.add(num);
          newResults.push(num);
        }
      } else {
        newResults.push(num);
      }
    }
    setResults(newResults);
  };

  const handleSort = (dir: 'asc' | 'desc') => {
    const sorted = [...results].sort((a, b) => dir === 'asc' ? a - b : b - a);
    setResults(sorted);
  };

  const handleShuffle = () => {
    const shuffled = [...results].sort(() => Math.random() - 0.5);
    setResults(shuffled);
  };

  const stats = useMemo(() => {
    if (results.length === 0) return null;
    const sum = results.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / results.length).toFixed(2),
      min: Math.min(...results),
      max: Math.max(...results),
      sum: sum.toFixed(2)
    };
  }, [results]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Min Value</label>
              <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Max Value</label>
              <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Count</label>
              <input type="number" value={count} onChange={e => setCount(Math.min(1000, Number(e.target.value)))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
           </div>
        </div>

        <div className="flex flex-wrap gap-6 items-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Unique Values</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={decimal} onChange={e => setDecimal(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Decimal Mode</span>
          </label>
          <button
             onClick={generate}
             className="ml-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
          >
             <RefreshCw className="w-4 h-4" /> Generate
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-500 border-t pt-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Average" value={stats?.avg} theme="blue" />
                <StatCard label="Min" value={stats?.min} theme="emerald" />
                <StatCard label="Max" value={stats?.max} theme="orange" />
                <StatCard label="Sum" value={stats?.sum} theme="violet" />
             </div>

             <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-2">
                      <button onClick={() => handleSort('asc')} className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground" title="Sort Ascending"><SortAsc className="w-4 h-4" /></button>
                      <button onClick={() => handleSort('desc')} className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground" title="Sort Descending"><SortDesc className="w-4 h-4" /></button>
                      <button onClick={handleShuffle} className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground" title="Shuffle"><Shuffle className="w-4 h-4" /></button>
                   </div>
                   <div className="flex items-center gap-3">
                      <button onClick={() => { copyToClipboard(results.join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs font-bold text-primary hover:underline">{copied ? 'Copied!' : 'Copy List'}</button>
                      <button onClick={() => downloadFile(new Blob([results.join('\n')]), 'random-numbers.txt')} className="text-xs font-bold text-muted-foreground hover:text-foreground">Download</button>
                   </div>
                </div>

                <div className="flex flex-wrap gap-2 p-6 bg-muted/10 rounded-2xl border border-border/50 min-h-[100px]">
                   {results.map((n, i) => (
                     <div key={i} className="px-4 py-2 rounded-lg bg-background border border-border shadow-sm font-black text-primary animate-in zoom-in-50 duration-300">
                        {n}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, theme }: { label: string, value: any, theme: string }) {
  return (
    <div className={`p-4 rounded-xl border border-${theme}-500/20 bg-${theme}-500/[0.03] text-center`}>
       <div className={`text-xl font-black text-${theme}-600 dark:text-${theme}-400`}>{value}</div>
       <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
