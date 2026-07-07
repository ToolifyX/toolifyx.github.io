"use client";

/**
 * SEO Title: JSON Compare - Side-by-Side JSON Diff Tool
 * Meta Description: Compare two JSON objects side-by-side. Identify differences, added keys, and removed values instantly.
 */

import React, { useState, useMemo } from 'react';
import { formatJSON } from '@/lib/utils';

export default function JsonCompare() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');

  const diffResult = useMemo(() => {
    if (!json1.trim() || !json2.trim()) return null;
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);

      const s1 = JSON.stringify(obj1, null, 2).split('\n');
      const s2 = JSON.stringify(obj2, null, 2).split('\n');

      const maxLines = Math.max(s1.length, s2.length);
      const lines = [];
      let matches = 0;

      for (let i = 0; i < maxLines; i++) {
        const l1 = s1[i] || '';
        const l2 = s2[i] || '';
        if (l1 === l2) {
          if (l1) matches++;
          lines.push({ type: 'equal', v1: l1, v2: l2 });
        } else {
          lines.push({ type: 'diff', v1: l1, v2: l2 });
        }
      }

      const similarity = maxLines > 0 ? Math.round((matches / maxLines) * 100) : 100;
      return { lines, similarity };
    } catch (e) {
      return { error: "Invalid JSON in one or both inputs" };
    }
  }, [json1, json2]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">JSON A</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[250px] text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            placeholder='{"id": 1, "name": "Apple"}'
            value={json1}
            onChange={(e) => setJson1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">JSON B</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[250px] text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            placeholder='{"id": 1, "name": "Orange"}'
            value={json2}
            onChange={(e) => setJson2(e.target.value)}
          />
        </div>
      </div>

      {diffResult && (
        <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Comparison Result</h3>
            {diffResult.similarity !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">Similarity</span>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-sm">{diffResult.similarity}%</div>
              </div>
            )}
          </div>

          {diffResult.error ? (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
              {diffResult.error}
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden divide-y divide-border/50 font-mono text-[12px] bg-muted/5">
               {diffResult.lines?.map((line, i) => (
                 <div key={i} className="flex min-h-[1.5rem] group">
                    <div className="w-10 shrink-0 bg-muted/30 flex items-center justify-center text-muted-foreground border-r border-border/50 text-[9px] font-bold select-none">{i+1}</div>
                    {line.type === 'equal' ? (
                      <div className="px-4 py-1 text-muted-foreground whitespace-pre flex-1 truncate">{line.v1 || ' '}</div>
                    ) : (
                      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/50">
                        <div className="flex-1 px-4 py-1 bg-red-500/10 text-red-600 whitespace-pre truncate">{line.v1 || ' '}</div>
                        <div className="flex-1 px-4 py-1 bg-green-500/10 text-green-600 font-bold whitespace-pre truncate">{line.v2 || ' '}</div>
                      </div>
                    )}
                 </div>
               ))}
            </div>
          )}

          <button
            onClick={() => { setJson1(''); setJson2(''); }}
            className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full uppercase tracking-widest text-xs"
          >
            Clear Comparison
          </button>
        </div>
      )}
    </div>
  );
}
