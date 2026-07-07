"use client";

/**
 * SEO Title: Online Line Counter - Total, Empty & Non-Empty Line Stats
 * Meta Description: Analyze your text with detailed line statistics. Count total lines, empty lines, and find the longest/shortest lines instantly.
 */

import React, { useState, useMemo } from 'react';

export default function LineCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) return { total: 0, empty: 0, nonEmpty: 0, longest: 0, shortest: 0, avg: 0 };
    const lines = text.split('\n');
    const total = lines.length;
    const nonEmptyLines = lines.filter(l => l.trim() !== '');
    const emptyLinesCount = total - nonEmptyLines.length;

    let longest = 0;
    let shortest = total > 0 ? lines[0].length : 0;
    let totalLen = 0;

    lines.forEach(line => {
      const len = line.length;
      if (len > longest) longest = len;
      if (len < shortest) shortest = len;
      totalLen += len;
    });

    return {
      total,
      empty: emptyLinesCount,
      nonEmpty: nonEmptyLines.length,
      longest,
      shortest: total > 0 ? shortest : 0,
      avg: total > 0 ? Math.round(totalLen / total) : 0
    };
  }, [text]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[350px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Paste your text or code here to analyze lines..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBox value={stats.total} label="Total Lines" theme="blue" />
          <StatBox value={stats.empty} label="Empty Lines" theme="slate" />
          <StatBox value={stats.nonEmpty} label="Non-Empty Lines" theme="green" />
          <StatBox value={stats.longest} label="Longest Line" theme="orange" />
          <StatBox value={stats.shortest} label="Shortest Line" theme="amber" />
          <StatBox value={stats.avg} label="Avg Line Length" theme="indigo" />
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

function StatBox({ value, label, theme }: { value: number | string, label: string, theme: string }) {
  return (
    <div className={`p-6 rounded-2xl border bg-card shadow-sm transition-all hover:scale-[1.02] border-${theme}-500/20 bg-${theme}-500/[0.03]`}>
      <div className={`text-3xl font-black text-${theme}-600 dark:text-${theme}-400 mb-1`}>{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
