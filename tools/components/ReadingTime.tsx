"use client";

/**
 * SEO Title: Reading Time Calculator - Estimate Text Reading & Speaking Speed
 * Meta Description: Calculate exactly how long it takes to read or speak your text. Includes estimates for slow, average, and fast reading speeds.
 */

import React, { useState, useMemo } from 'react';
import { Timer, MessageSquare, FileText, Hash } from 'lucide-react';

export default function ReadingTime() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return { words: 0, chars: 0, slow: 0, avg: 0, fast: 0, speaking: 0 };

    const words = trimmed.split(/\s+/).length;
    const chars = text.length;

    return {
      words,
      chars,
      slow: Math.ceil(words / 150),
      avg: Math.ceil(words / 200),
      fast: Math.ceil(words / 250),
      speaking: Math.ceil(words / 130)
    };
  }, [text]);

  const formatTime = (minutes: number) => {
    if (minutes === 0) return '0s';
    if (minutes < 1) return '< 1m';
    return `${minutes}m`;
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[300px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Paste your script or article here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 flex flex-col items-center justify-center text-center">
             <FileText className="w-4 h-4 text-muted-foreground mb-2" />
             <div className="text-xl font-black">{stats.words}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Words</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 flex flex-col items-center justify-center text-center">
             <Hash className="w-4 h-4 text-muted-foreground mb-2" />
             <div className="text-xl font-black">{stats.chars}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Characters</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 flex flex-col items-center justify-center text-center">
             <Timer className="w-4 h-4 text-primary mb-2" />
             <div className="text-xl font-black text-primary">{formatTime(stats.avg)}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reading Time</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 flex flex-col items-center justify-center text-center">
             <MessageSquare className="w-4 h-4 text-orange-500 mb-2" />
             <div className="text-xl font-black text-orange-500">{formatTime(stats.speaking)}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Speaking Time</div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Reading Levels</h3>
          <div className="space-y-6">
            <SpeedLevel label="Slow (150 WPM)" time={formatTime(stats.slow)} progress={30} theme="slate" />
            <SpeedLevel label="Average (200 WPM)" time={formatTime(stats.avg)} progress={60} theme="blue" />
            <SpeedLevel label="Fast (250 WPM)" time={formatTime(stats.fast)} progress={90} theme="emerald" />
          </div>
        </div>

        <button
          onClick={() => setText('')}
          className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full uppercase tracking-widest text-xs"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function SpeedLevel({ label, time, progress, theme }: { label: string, time: string, progress: number, theme: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold">{label}</span>
        <span className={`text-sm font-black text-${theme}-600 dark:text-${theme}-400`}>{time}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full bg-${theme}-500 transition-all duration-1000`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
