"use client";

/**
 * SEO Title: Text Compare Online - Diff Checker & Similarity Tool
 * Meta Description: Compare two text blocks side-by-side. Highlight added, removed, and modified lines with similarity percentage.
 */

import React, { useState, useMemo } from 'react';

export default function TextCompare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const diff = useMemo(() => {
    if (!text1 && !text2) return { lines: [], similarity: 100 };

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);

    const resultLines = [];
    let matches = 0;

    for (let i = 0; i < maxLines; i++) {
      const l1 = lines1[i] || '';
      const l2 = lines2[i] || '';

      if (l1 === l2) {
        if (l1 !== '') matches++;
        resultLines.push({ type: 'equal', value: l1 });
      } else {
        resultLines.push({ type: 'diff', v1: l1, v2: l2 });
      }
    }

    const similarity = maxLines > 0 ? Math.round((matches / maxLines) * 100) : 100;

    return { lines: resultLines, similarity };
  }, [text1, text2]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Original Text</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[300px] text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            placeholder="Paste first text version here..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Modified Text</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[300px] text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            placeholder="Paste second text version here..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>
      </div>

      <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Comparison Result</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase">Similarity</span>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-sm">{diff.similarity}%</div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden divide-y divide-border/50 font-mono text-sm">
          {diff.lines.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground italic">Enter text above to start comparison</div>
          ) : (
            diff.lines.map((line, i) => (
              <div key={i} className="flex min-h-[1.5rem]">
                <div className="w-8 shrink-0 bg-muted/30 text-[10px] flex items-center justify-center text-muted-foreground border-r border-border/50 select-none">{i+1}</div>
                {line.type === 'equal' ? (
                  <div className="px-4 py-1 text-muted-foreground whitespace-pre-wrap flex-1">{line.value || ' '}</div>
                ) : (
                  <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/50">
                    <div className="flex-1 px-4 py-1 bg-red-500/10 text-red-600 line-through decoration-red-600/30 whitespace-pre-wrap">{line.v1 || ' '}</div>
                    <div className="flex-1 px-4 py-1 bg-green-500/10 text-green-600 font-bold whitespace-pre-wrap">{line.v2 || ' '}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => { setText1(''); setText2(''); }}
          className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full uppercase tracking-widest text-xs"
        >
          Reset Comparison
        </button>
      </div>
    </div>
  );
}
